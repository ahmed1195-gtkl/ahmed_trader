/**
 * Forex Factory Economic Calendar Scraper
 * Fetches real-time economic events from Forex Factory
 */

export class ForexFactoryScraper {
  constructor() {
    this.baseUrl = 'https://www.forexfactory.com/calendar.php';
    this.cachedEvents = [];
    this.lastFetchTime = null;
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Fetch economic events from Forex Factory
   * Returns array of events with: time, currency, impact, title, forecast, previous, actual
   */
  async fetchEvents() {
    try {
      // Check if cache is still valid
      if (this.cachedEvents.length > 0 && Date.now() - this.lastFetchTime < this.cacheDuration) {
        console.log('Using cached Forex Factory events');
        return this.cachedEvents;
      }

      // Fetch from Forex Factory
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Forex Factory API returned ${response.status}`);
      }

      const html = await response.text();
      const events = this.parseForexFactoryHTML(html);
      
      // Cache the events
      this.cachedEvents = events;
      this.lastFetchTime = Date.now();

      console.log(`Fetched ${events.length} events from Forex Factory`);
      return events;
    } catch (error) {
      console.error('Error fetching from Forex Factory:', error);
      // Return cached events if available
      if (this.cachedEvents.length > 0) {
        console.log('Returning cached events due to fetch error');
        return this.cachedEvents;
      }
      return this.getDefaultEvents();
    }
  }

  /**
   * Parse Forex Factory HTML and extract events
   */
  parseForexFactoryHTML(html) {
    const events = [];
    
    try {
      // Create a temporary DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find all event rows (Forex Factory uses specific class names)
      const rows = doc.querySelectorAll('tr[id^="eventid"]');
      
      rows.forEach(row => {
        try {
          const event = this.parseEventRow(row);
          if (event) {
            events.push(event);
          }
        } catch (e) {
          console.warn('Error parsing event row:', e);
        }
      });

      return events.length > 0 ? events : this.getDefaultEvents();
    } catch (error) {
      console.error('Error parsing Forex Factory HTML:', error);
      return this.getDefaultEvents();
    }
  }

  /**
   * Parse a single event row from Forex Factory
   */
  parseEventRow(row) {
    try {
      // Extract time
      const timeCell = row.querySelector('td.time');
      const time = timeCell ? timeCell.textContent.trim() : '';

      // Extract currency
      const currencyCell = row.querySelector('td.currency');
      const currency = currencyCell ? currencyCell.textContent.trim() : '';

      // Extract impact (High/Medium/Low)
      const impactCell = row.querySelector('td.impact');
      let impact = 'MEDIUM';
      if (impactCell) {
        const impactClass = impactCell.className;
        if (impactClass.includes('high')) impact = 'HIGH';
        else if (impactClass.includes('low')) impact = 'LOW';
      }

      // Extract title/event name
      const titleCell = row.querySelector('td.event');
      const title = titleCell ? titleCell.textContent.trim() : '';

      // Extract forecast
      const forecastCell = row.querySelector('td.forecast');
      const forecast = forecastCell ? forecastCell.textContent.trim() : '';

      // Extract previous
      const previousCell = row.querySelector('td.previous');
      const previous = previousCell ? previousCell.textContent.trim() : '';

      // Extract actual (if available)
      const actualCell = row.querySelector('td.actual');
      const actual = actualCell ? actualCell.textContent.trim() : null;

      if (!title || !currency) {
        return null;
      }

      return {
        id: `${currency}_${title}_${Date.now()}`,
        title,
        currency,
        impact,
        time,
        forecast,
        previous,
        actual: actual || null,
        status: actual ? 'released' : 'pending',
        source: 'forexfactory',
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Error parsing event row:', error);
      return null;
    }
  }

  /**
   * Get default events if scraping fails
   * These are common high-impact events
   */
  getDefaultEvents() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'usd_nfp_default',
        title: 'Non-Farm Payroll',
        currency: 'USD',
        impact: 'HIGH',
        time: 'Friday 13:30',
        forecast: '180K',
        previous: '210K',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'eur_ecb_default',
        title: 'ECB Interest Rate Decision',
        currency: 'EUR',
        impact: 'HIGH',
        time: 'Thursday 13:00',
        forecast: '4.25%',
        previous: '4.50%',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'gbp_boe_default',
        title: 'BOE Interest Rate Decision',
        currency: 'GBP',
        impact: 'HIGH',
        time: 'Thursday 12:00',
        forecast: '5.25%',
        previous: '5.50%',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'jpy_boj_default',
        title: 'BOJ Interest Rate Decision',
        currency: 'JPY',
        impact: 'HIGH',
        time: 'Wednesday 09:00',
        forecast: '0.50%',
        previous: '0.25%',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'usd_cpi_default',
        title: 'CPI (Consumer Price Index)',
        currency: 'USD',
        impact: 'HIGH',
        time: 'Wednesday 13:30',
        forecast: '3.2%',
        previous: '3.4%',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'eur_inflation_default',
        title: 'Inflation Rate',
        currency: 'EUR',
        impact: 'MEDIUM',
        time: 'Tuesday 10:00',
        forecast: '2.4%',
        previous: '2.6%',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'gbp_gdp_default',
        title: 'GDP (Gross Domestic Product)',
        currency: 'GBP',
        impact: 'HIGH',
        time: 'Friday 09:00',
        forecast: '0.5%',
        previous: '0.2%',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      },
      {
        id: 'usd_jobless_default',
        title: 'Jobless Claims',
        currency: 'USD',
        impact: 'MEDIUM',
        time: 'Thursday 13:30',
        forecast: '210K',
        previous: '220K',
        actual: null,
        status: 'pending',
        source: 'default',
        fetchedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Get events filtered by currency and impact
   */
  getFilteredEvents(events, currencies = [], impacts = []) {
    return events.filter(event => {
      const currencyMatch = currencies.length === 0 || currencies.includes(event.currency);
      const impactMatch = impacts.length === 0 || impacts.includes(event.impact);
      return currencyMatch && impactMatch;
    });
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cachedEvents = [];
    this.lastFetchTime = null;
  }
}

// Export singleton instance
export const forexFactoryScraper = new ForexFactoryScraper();
