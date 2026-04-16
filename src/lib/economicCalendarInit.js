/**
 * Economic Calendar Initialization Service
 * 
 * This service initializes the Economic Calendar system:
 * 1. Starts the Scraper Service (runs every 15 minutes)
 * 2. Starts the Event Trigger System (runs every 60 seconds)
 * 3. Initializes Firestore collections if needed
 */

import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { economicCalendarScraper } from './economicCalendarScraper';
import { eventTriggerSystem } from './eventTriggerSystem';
import {
  FIRESTORE_COLLECTIONS,
  SCRAPER_STATUS_SCHEMA
} from './economicCalendarSchema';

class EconomicCalendarInit {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the entire Economic Calendar system
   */
  async initialize() {
    if (this.initialized) {
      console.warn('Economic Calendar already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Economic Calendar System...');

      // Step 1: Initialize Firestore collections
      await this.initializeFirestoreCollections();

      // Step 2: Start Scraper Service
      economicCalendarScraper.start();

      // Step 3: Start Event Trigger System
      eventTriggerSystem.start();

      this.initialized = true;
      console.log('✅ Economic Calendar System initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing Economic Calendar:', error);
    }
  }

  /**
   * Initialize Firestore collections
   */
  async initializeFirestoreCollections() {
    try {
      // Check if scraper_status document exists
      const statusRef = doc(db, FIRESTORE_COLLECTIONS.SCRAPER_STATUS, 'scraper_status');
      const statusSnap = await getDoc(statusRef);

      if (!statusSnap.exists()) {
        console.log('📝 Creating scraper_status document...');

        await setDoc(statusRef, {
          status: 'idle',
          lastScrapedAt: null,
          lastScrapedEvents: 0,
          nextScheduledScrape: Timestamp.fromDate(new Date()),
          lastError: null,
          errorCount: 0,
          scrapedEventIds: [],
          updatedAt: Timestamp.now()
        });

        console.log('✅ scraper_status document created');
      }

      // Create a sample economic event for testing (if collection is empty)
      await this.createSampleEventsIfNeeded();

    } catch (error) {
      console.error('Error initializing Firestore collections:', error);
    }
  }

  /**
   * Create sample events if collection is empty
   */
  async createSampleEventsIfNeeded() {
    try {
      const eventsRef = collection(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS);

      // Check if collection has any documents
      // Note: In production, you would use a proper query
      // For now, we'll skip this check

      console.log('✅ Firestore collections ready');

    } catch (error) {
      console.error('Error creating sample events:', error);
    }
  }

  /**
   * Stop all services
   */
  shutdown() {
    try {
      economicCalendarScraper.stop();
      eventTriggerSystem.stop();
      this.initialized = false;
      console.log('⛔ Economic Calendar System stopped');
    } catch (error) {
      console.error('Error shutting down Economic Calendar:', error);
    }
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      scraperRunning: economicCalendarScraper.isRunning,
      triggerSystemRunning: eventTriggerSystem.isRunning,
      lastScrapedAt: economicCalendarScraper.lastScrapedAt
    };
  }
}

// Export singleton instance
export const economicCalendarInit = new EconomicCalendarInit();

export default EconomicCalendarInit;
