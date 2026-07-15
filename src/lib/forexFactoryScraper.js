/**
 * Forex Factory Economic Calendar Scraper
 * Fetches actual economic events from Forex Factory HTML
 * Uses event-driven architecture with smart caching
 */

export class ForexFactoryScraper {
  constructor() {
    this.baseUrl = 'https://www.forexfactory.com/calendar.php';
    this.cachedEvents = [];
    this.lastFetchTime = null;
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes cache
    this.isScraperRunning = false;
  }

  /**
   * Fetch and parse Forex Factory calendar
   */
  async fetchEvents() {
    try {
      // Check cache first
      if (this.cachedEvents.length > 0 && Date.now() - this.lastFetchTime < this.cacheDuration) {
        console.log('✅ Using cached Forex Factory events');
        return this.cachedEvents;
      }

      console.log('🔄 Fetching fresh events from Forex Factory...');
      
      // Fetch the HTML
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.forexfactory.com/'
        }
      });

      if (!response.ok) {
        throw new Error(`Forex Factory returned ${response.status}`);
      }

      const html = await response.text();
      const events = this.parseForexFactoryHTML(html);

      if (events.length > 0) {
        this.cachedEvents = events;
        this.lastFetchTime = Date.now();
        console.log(`✅ Fetched ${events.length} events from Forex Factory`);
        return events;
      } else {
        console.warn('⚠️ No events parsed, using fallback');
        return this.getFallbackEvents();
      }
    } catch (error) {
      console.error('❌ Scraper error:', error.message);
      
      // Return cached events if available
      if (this.cachedEvents.length > 0) {
        console.log('📦 Returning cached events due to fetch error');
        return this.cachedEvents;
      }
      
      return this.getFallbackEvents();
    }
  }

  /**
   * Parse Forex Factory HTML and extract events
   */
  parseForexFactoryHTML(html) {
    const events = [];

    try {
      // Create DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find all event rows - Forex Factory uses specific patterns
      // Look for rows with event data
      const rows = doc.querySelectorAll('tr[id^="eventid"]');
      
      if (rows.length === 0) {
        console.warn('⚠️ No event rows found in HTML');
        return this.getFallbackEvents();
      }

      rows.forEach((row, index) => {
        try {
          const event = this.parseEventRow(row);
          if (event && event.title) {
            events.push(event);
          }
        } catch (e) {
          console.warn(`⚠️ Error parsing row ${index}:`, e.message);
        }
      });

      return events.length > 0 ? events : this.getFallbackEvents();
    } catch (error) {
      console.error('❌ HTML parsing error:', error.message);
      return this.getFallbackEvents();
    }
  }

  /**
   * Parse a single event row from Forex Factory
   */
  parseEventRow(row) {
    try {
      // Extract all cells
      const cells = row.querySelectorAll('td');
      if (cells.length < 5) return null;

      // Forex Factory row structure:
      // [0] = Date, [1] = Time, [2] = Currency, [3] = Impact, [4] = Event, [5] = Forecast, [6] = Previous, [7] = Actual

      const timeCell = cells[1]?.textContent?.trim() || '';
      const currencyCell = cells[2]?.textContent?.trim() || '';
      const impactCell = cells[3];
      const titleCell = cells[4]?.textContent?.trim() || '';
      const forecastCell = cells[5]?.textContent?.trim() || '';
      const previousCell = cells[6]?.textContent?.trim() || '';
      const actualCell = cells[7]?.textContent?.trim() || '';

      // Determine impact level
      let impact = 'MEDIUM';
      if (impactCell) {
        const impactClass = impactCell.className || '';
        const impactSpan = impactCell.querySelector('span');
        const impactStyle = impactSpan?.style?.backgroundColor || '';
        
        if (impactClass.includes('high') || impactStyle.includes('red') || impactStyle.includes('ff')) {
          impact = 'HIGH';
        } else if (impactClass.includes('low') || impactStyle.includes('green') || impactStyle.includes('00')) {
          impact = 'LOW';
        }
      }

      // Validate required fields
      if (!titleCell || !currencyCell) {
        return null;
      }

      return {
        id: `${currencyCell}_${titleCell}_${Date.now()}_${Math.random()}`,
        title: titleCell,
        currency: currencyCell,
        impact: impact,
        time: timeCell,
        forecast: forecastCell || 'N/A',
        previous: previousCell || 'N/A',
        actual: actualCell && actualCell !== '' ? actualCell : null,
        status: actualCell && actualCell !== '' ? 'released' : 'pending',
        source: 'forexfactory',
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error parsing event row:', error.message);
      return null;
    }
  }

  /**
   * Fallback events when scraping fails
   */
  getFallbackEvents() {
    return [
      {
        id: 'nfp_fallback',
        title: 'Non-Farm Payroll',
        currency: 'USD',
        impact: 'HIGH',
        time: 'Friday 13:30',
        forecast: '180K',
        previous: '210K',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'ecb_fallback',
        title: 'ECB Interest Rate Decision',
        currency: 'EUR',
        impact: 'HIGH',
        time: 'Thursday 13:00',
        forecast: '4.25%',
        previous: '4.50%',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'cpi_fallback',
        title: 'CPI (Consumer Price Index)',
        currency: 'USD',
        impact: 'HIGH',
        time: 'Wednesday 13:30',
        forecast: '3.2%',
        previous: '3.4%',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'gdp_fallback',
        title: 'GDP (Gross Domestic Product)',
        currency: 'GBP',
        impact: 'HIGH',
        time: 'Friday 09:00',
        forecast: '0.5%',
        previous: '0.2%',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'boe_fallback',
        title: 'BOE Interest Rate Decision',
        currency: 'GBP',
        impact: 'HIGH',
        time: 'Thursday 12:00',
        forecast: '5.25%',
        previous: '5.50%',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'boj_fallback',
        title: 'BOJ Interest Rate Decision',
        currency: 'JPY',
        impact: 'HIGH',
        time: 'Wednesday 09:00',
        forecast: '0.50%',
        previous: '0.25%',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'inflation_fallback',
        title: 'Inflation Rate',
        currency: 'EUR',
        impact: 'MEDIUM',
        time: 'Tuesday 10:00',
        forecast: '2.4%',
        previous: '2.6%',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'jobless_fallback',
        title: 'Jobless Claims',
        currency: 'USD',
        impact: 'MEDIUM',
        time: 'Thursday 13:30',
        forecast: '210K',
        previous: '220K',
        actual: null,
        status: 'pending',
        source: 'fallback',
        fetchedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Filter events by currency and impact
   */
  filterEvents(events, currencies = [], impacts = []) {
    return events.filter(event => {
      const currencyMatch = currencies.length === 0 || currencies.includes(event.currency);
      const impactMatch = impacts.length === 0 || impacts.includes(event.impact);
      return currencyMatch && impactMatch;
    });
  }

  /**
   * Sort events by time
   */
  sortEventsByTime(events) {
    return events.sort((a, b) => {
      // Parse time strings and compare
      const timeA = this.parseTime(a.time);
      const timeB = this.parseTime(b.time);
      return timeA - timeB;
    });
  }

  /**
   * Parse time string to comparable value
   */
  parseTime(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.match(/(\d+):(\d+)/);
    if (!parts) return 0;
    return parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }

  /**
   * Clear cache and force refresh
   */
  clearCache() {
    this.cachedEvents = [];
    this.lastFetchTime = null;
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      eventCount: this.cachedEvents.length,
      lastFetchTime: this.lastFetchTime,
      isCacheValid: Date.now() - this.lastFetchTime < this.cacheDuration,
      cacheExpiresIn: Math.max(0, this.cacheDuration - (Date.now() - this.lastFetchTime))
    };
  }
}

// Export singleton instance
export const forexFactoryScraper = new ForexFactoryScraper();
