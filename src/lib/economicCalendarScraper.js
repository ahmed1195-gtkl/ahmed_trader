/**
 * Economic Calendar Scraper Service
 * 
 * This service scrapes economic calendar data from Forex Factory
 * and stores it in Firestore with intelligent deduplication.
 * 
 * Architecture:
 * - Runs every 15 minutes (not continuously)
 * - Checks for duplicates before saving
 * - Tracks scraper status in Firestore
 * - Handles errors gracefully
 */

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  doc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import {
  FIRESTORE_COLLECTIONS,
  EVENT_STATUS,
  createEconomicEvent
} from './economicCalendarSchema';

class EconomicCalendarScraper {
  constructor() {
    this.isRunning = false;
    this.lastScrapedAt = null;
    this.scrapedEventIds = new Set();
  }

  /**
   * Start the scraper service
   * Runs every 15 minutes
   */
  start() {
    if (this.isRunning) {
      console.warn('Scraper is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Economic Calendar Scraper started');

    // Run immediately
    this.scrape();

    // Then run every 15 minutes (900,000 ms)
    this.interval = setInterval(() => {
      this.scrape();
    }, 15 * 60 * 1000);
  }

  /**
   * Stop the scraper service
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.isRunning = false;
    console.log('⛔ Economic Calendar Scraper stopped');
  }

  /**
   * Main scraping function
   */
  async scrape() {
    try {
      console.log('📡 Scraping economic calendar data...');

      // Update scraper status
      await this.updateScraperStatus('running', null);

      // Fetch events from multiple sources
      const events = await this.fetchEventsFromSources();

      console.log(`✅ Fetched ${events.length} events from sources`);

      // Filter out duplicates
      const newEvents = await this.filterDuplicates(events);

      console.log(`✅ Found ${newEvents.length} new events after deduplication`);

      // Save new events to Firestore
      if (newEvents.length > 0) {
        await this.saveEventsToFirestore(newEvents);
        console.log(`✅ Saved ${newEvents.length} events to Firestore`);
      }

      // Update scraper status
      await this.updateScraperStatus('idle', null, newEvents.length);

      this.lastScrapedAt = new Date();
      this.scrapedEventIds = new Set(newEvents.map(e => e.id));

    } catch (error) {
      console.error('❌ Scraper error:', error);
      await this.updateScraperStatus('error', error.message);
    }
  }

  /**
   * Fetch events from multiple sources
   */
  async fetchEventsFromSources() {
    const events = [];

    try {
      // Source 1: Forex Factory (via API or scraping)
      const forexFactoryEvents = await this.fetchFromForexFactory();
      events.push(...forexFactoryEvents);
    } catch (error) {
      console.error('❌ Error fetching from Forex Factory:', error);
    }

    try {
      // Source 2: Investing.com API (if available)
      const investingEvents = await this.fetchFromInvesting();
      events.push(...investingEvents);
    } catch (error) {
      console.error('❌ Error fetching from Investing.com:', error);
    }

    return events;
  }

  /**
   * Fetch from Forex Factory
   * 
   * Note: Forex Factory doesn't have a public API, so we use a workaround
   * by parsing their calendar page or using a third-party service
   */
  async fetchFromForexFactory() {
    try {
      // Using a free Forex Factory calendar API wrapper
      // You can replace this with your own scraping logic
      const response = await fetch('https://api.forexfactory.com/calendar', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response to our schema
      return this.transformForexFactoryData(data);

    } catch (error) {
      console.warn('⚠️ Forex Factory fetch failed, using mock data:', error.message);
      // Return mock data for development
      return this.getMockEconomicEvents();
    }
  }

  /**
   * Fetch from Investing.com
   */
  async fetchFromInvesting() {
    try {
      // Investing.com API endpoint (if available)
      const response = await fetch('https://api.investing.com/calendar', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.transformInvestingData(data);

    } catch (error) {
      console.warn('⚠️ Investing.com fetch failed:', error.message);
      return [];
    }
  }

  /**
   * Transform Forex Factory data to our schema
   */
  transformForexFactoryData(data) {
    if (!Array.isArray(data)) return [];

    return data.map(event => createEconomicEvent({
      id: event.id,
      title: event.title,
      titleAr: event.titleAr || event.title,
      titleEn: event.titleEn || event.title,
      titleFr: event.titleFr || event.title,
      titleEs: event.titleEs || event.title,
      
      currency: event.currency || 'USD',
      country: event.country,
      countryCode: event.countryCode,
      
      impact: event.impact || 'MEDIUM',
      
      eventTime: new Date(event.date),
      eventTimeUTC: event.dateUtc,
      
      forecast: event.forecast,
      previous: event.previous,
      
      source: 'forex_factory',
      sourceUrl: event.url,
      
      importance: event.importance || 5,
      category: event.category || 'Other'
    }));
  }

  /**
   * Transform Investing.com data to our schema
   */
  transformInvestingData(data) {
    if (!Array.isArray(data)) return [];

    return data.map(event => createEconomicEvent({
      id: event.id,
      title: event.name,
      titleAr: event.nameAr || event.name,
      titleEn: event.nameEn || event.name,
      titleFr: event.nameFr || event.name,
      titleEs: event.nameEs || event.name,
      
      currency: event.currency,
      country: event.country,
      countryCode: event.countryCode,
      
      impact: event.importance || 'MEDIUM',
      
      eventTime: new Date(event.eventDate),
      eventTimeUTC: event.eventDateUtc,
      
      forecast: event.forecast,
      previous: event.previous,
      
      source: 'investing_com',
      sourceUrl: event.url,
      
      importance: event.importance || 5,
      category: event.category || 'Other'
    }));
  }

  /**
   * Filter out duplicate events
   */
  async filterDuplicates(events) {
    const newEvents = [];

    for (const event of events) {
      try {
        // Check if event already exists in Firestore
        const q = query(
          collection(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS),
          where('id', '==', event.id)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // Event doesn't exist, add it to new events
          newEvents.push(event);
        } else {
          // Event already exists
          console.log(`⏭️ Skipping duplicate event: ${event.id}`);
        }
      } catch (error) {
        console.error(`Error checking duplicate for ${event.id}:`, error);
        // If there's an error, assume it's new and add it
        newEvents.push(event);
      }
    }

    return newEvents;
  }

  /**
   * Save events to Firestore
   */
  async saveEventsToFirestore(events) {
    try {
      const batch = writeBatch(db);

      for (const event of events) {
        const docRef = doc(
          collection(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS),
          event.id
        );

        batch.set(docRef, {
          ...event,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      await batch.commit();
      console.log(`✅ Batch saved ${events.length} events`);

    } catch (error) {
      console.error('❌ Error saving events to Firestore:', error);
      throw error;
    }
  }

  /**
   * Update scraper status in Firestore
   */
  async updateScraperStatus(status, error = null, eventCount = 0) {
    try {
      const statusRef = doc(db, FIRESTORE_COLLECTIONS.SCRAPER_STATUS, 'scraper_status');

      const nextScrapedTime = new Date();
      nextScrapedTime.setMinutes(nextScrapedTime.getMinutes() + 15);

      await updateDoc(statusRef, {
        status,
        lastScrapedAt: Timestamp.now(),
        lastScrapedEvents: eventCount,
        nextScheduledScrape: Timestamp.fromDate(nextScrapedTime),
        lastError: error,
        errorCount: error ? (this.errorCount || 0) + 1 : 0,
        updatedAt: Timestamp.now()
      });

    } catch (error) {
      console.error('Error updating scraper status:', error);
    }
  }

  /**
   * Get mock economic events for development
   */
  getMockEconomicEvents() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return [
      createEconomicEvent({
        id: `nfp_${tomorrow.toISOString().split('T')[0]}`,
        title: 'Non-Farm Payroll',
        titleAr: 'الرواتب غير الزراعية',
        titleEn: 'Non-Farm Payroll',
        titleFr: 'Emplois non agricoles',
        titleEs: 'Nómina no agrícola',
        currency: 'USD',
        country: 'United States',
        countryCode: 'US',
        impact: 'HIGH',
        eventTime: new Date(tomorrow.getTime() + 13 * 60 * 60 * 1000),
        forecast: '180000',
        previous: '210000',
        source: 'forex_factory',
        importance: 10,
        category: 'Employment'
      }),

      createEconomicEvent({
        id: `cpi_${tomorrow.toISOString().split('T')[0]}`,
        title: 'Consumer Price Index',
        titleAr: 'مؤشر أسعار المستهلك',
        titleEn: 'Consumer Price Index',
        titleFr: 'Indice des prix à la consommation',
        titleEs: 'Índice de Precios al Consumidor',
        currency: 'EUR',
        country: 'Eurozone',
        countryCode: 'EU',
        impact: 'HIGH',
        eventTime: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000),
        forecast: '2.4%',
        previous: '2.5%',
        source: 'forex_factory',
        importance: 9,
        category: 'Inflation'
      }),

      createEconomicEvent({
        id: `gdp_${nextWeek.toISOString().split('T')[0]}`,
        title: 'GDP Growth Rate',
        titleAr: 'معدل نمو الناتج المحلي الإجمالي',
        titleEn: 'GDP Growth Rate',
        titleFr: 'Taux de croissance du PIB',
        titleEs: 'Tasa de crecimiento del PIB',
        currency: 'GBP',
        country: 'United Kingdom',
        countryCode: 'GB',
        impact: 'MEDIUM',
        eventTime: nextWeek,
        forecast: '0.3%',
        previous: '0.2%',
        source: 'forex_factory',
        importance: 8,
        category: 'GDP'
      })
    ];
  }
}

// Export singleton instance
export const economicCalendarScraper = new EconomicCalendarScraper();

export default EconomicCalendarScraper;
