/**
 * Event Trigger System
 * 
 * This system monitors pending economic events and triggers actions when:
 * 1. 5 minutes before event (pre-alert)
 * 2. At event time (release alert)
 * 3. After event is released (update actual value)
 * 
 * Architecture:
 * - Checks every 60 seconds (not continuously)
 * - Only processes HIGH impact events by default
 * - Sends alerts via multiple channels
 * - Updates event status in Firestore
 */

import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import {
  FIRESTORE_COLLECTIONS,
  EVENT_STATUS,
  ALERT_TYPES,
  NOTIFICATION_CHANNELS
} from './economicCalendarSchema';

class EventTriggerSystem {
  constructor() {
    this.isRunning = false;
    this.processedEvents = new Set();
    this.PRE_ALERT_MINUTES = 5; // Send alert 5 minutes before
  }

  /**
   * Start the event trigger system
   * Checks every 60 seconds
   */
  start() {
    if (this.isRunning) {
      console.warn('Event Trigger System is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Event Trigger System started');

    // Run immediately
    this.checkAndTriggerEvents();

    // Then run every 60 seconds
    this.interval = setInterval(() => {
      this.checkAndTriggerEvents();
    }, 60 * 1000);
  }

  /**
   * Stop the event trigger system
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.isRunning = false;
    console.log('⛔ Event Trigger System stopped');
  }

  /**
   * Check and trigger events
   */
  async checkAndTriggerEvents() {
    try {
      const now = new Date();

      // Get all pending events
      const pendingEvents = await this.getPendingEvents();

      for (const event of pendingEvents) {
        const eventTime = new Date(event.eventTimeUTC);
        const timeDiff = eventTime.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        // Check if it's time for pre-alert (5 minutes before)
        if (
          minutesDiff <= this.PRE_ALERT_MINUTES &&
          minutesDiff > (this.PRE_ALERT_MINUTES - 1) &&
          !event.preAlertSentAt
        ) {
          console.log(`⚠️ Pre-alert trigger for: ${event.title}`);
          await this.sendPreAlert(event);
        }

        // Check if event time has reached
        if (
          timeDiff <= 0 &&
          timeDiff > -60000 && // Within 1 minute after
          event.status === EVENT_STATUS.PENDING
        ) {
          console.log(`🚨 Event trigger for: ${event.title}`);
          await this.triggerEvent(event);
        }
      }

    } catch (error) {
      console.error('❌ Error in event trigger system:', error);
    }
  }

  /**
   * Get all pending events
   */
  async getPendingEvents() {
    try {
      const now = new Date();
      const futureTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours

      const q = query(
        collection(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS),
        where('status', 'in', [EVENT_STATUS.PENDING, EVENT_STATUS.ALERT_SENT]),
        where('eventTime', '>=', Timestamp.fromDate(now)),
        where('eventTime', '<=', Timestamp.fromDate(futureTime)),
        where('impact', '==', 'HIGH'), // Only HIGH impact events
        orderBy('eventTime', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('Error fetching pending events:', error);
      return [];
    }
  }

  /**
   * Send pre-alert (5 minutes before event)
   */
  async sendPreAlert(event) {
    try {
      // Create alert message
      const message = this.createPreAlertMessage(event);

      // Send alerts via multiple channels
      await Promise.all([
        this.sendInAppAlert(event, message, ALERT_TYPES.PRE_ALERT),
        this.sendTelegramAlert(event, message, ALERT_TYPES.PRE_ALERT),
        this.sendPushNotification(event, message, ALERT_TYPES.PRE_ALERT)
      ]);

      // Update event status
      await this.updateEventPreAlert(event.id);

      console.log(`✅ Pre-alert sent for: ${event.title}`);

    } catch (error) {
      console.error('❌ Error sending pre-alert:', error);
    }
  }

  /**
   * Trigger event (at event time)
   */
  async triggerEvent(event) {
    try {
      // Create alert message
      const message = this.createReleaseAlertMessage(event);

      // Send alerts via multiple channels
      await Promise.all([
        this.sendInAppAlert(event, message, ALERT_TYPES.RELEASE_ALERT),
        this.sendTelegramAlert(event, message, ALERT_TYPES.RELEASE_ALERT),
        this.sendPushNotification(event, message, ALERT_TYPES.RELEASE_ALERT)
      ]);

      // Fetch actual value (targeted scraping)
      const actualValue = await this.fetchActualValue(event);

      // Update event with actual value and status
      await this.updateEventReleased(event.id, actualValue);

      console.log(`✅ Event triggered and updated for: ${event.title}`);

    } catch (error) {
      console.error('❌ Error triggering event:', error);
    }
  }

  /**
   * Create pre-alert message
   */
  createPreAlertMessage(event) {
    return {
      title: `⚠️ ${event.title}`,
      subtitle: `Upcoming High Impact News in ${this.PRE_ALERT_MINUTES} minutes`,
      body: `
🚨 High Impact Economic News Alert

📊 Event: ${event.title}
💱 Currency: ${event.currency}
📈 Impact: ${event.impact}
⏰ Time: ${new Date(event.eventTimeUTC).toLocaleTimeString()}

📌 Forecast: ${event.forecast || 'N/A'}
📌 Previous: ${event.previous || 'N/A'}

Be ready for market volatility!
      `,
      emoji: '⚠️'
    };
  }

  /**
   * Create release alert message
   */
  createReleaseAlertMessage(event) {
    return {
      title: `🚨 ${event.title} Released`,
      subtitle: `High Impact News Just Released`,
      body: `
🚨 High Impact Economic News Released

📊 Event: ${event.title}
💱 Currency: ${event.currency}
📈 Impact: ${event.impact}
⏰ Time: ${new Date(event.eventTimeUTC).toLocaleTimeString()}

📌 Forecast: ${event.forecast || 'N/A'}
📌 Previous: ${event.previous || 'N/A'}
📌 Actual: ${event.actual || 'Awaiting data...'}

Watch for market reactions!
      `,
      emoji: '🚨'
    };
  }

  /**
   * Send in-app alert
   */
  async sendInAppAlert(event, message, alertType) {
    try {
      // Get all users who subscribed to this currency
      const usersQuery = query(
        collection(db, FIRESTORE_COLLECTIONS.USER_CALENDAR_PREFERENCES),
        where('currencies', 'array-contains', event.currency)
      );

      const usersSnapshot = await getDocs(usersQuery);

      // Create alerts for each user
      const batch = [];
      for (const userDoc of usersSnapshot.docs) {
        const alertRef = collection(db, FIRESTORE_COLLECTIONS.EVENT_ALERTS);
        batch.push(
          addDoc(alertRef, {
            eventId: event.id,
            userId: userDoc.id,
            alertType,
            sentAt: Timestamp.now(),
            deliveryStatus: 'sent',
            channel: NOTIFICATION_CHANNELS.IN_APP,
            messageContent: message.body,
            read: false,
            readAt: null
          })
        );
      }

      await Promise.all(batch);
      console.log(`✅ In-app alerts sent to ${batch.length} users`);

    } catch (error) {
      console.error('Error sending in-app alert:', error);
    }
  }

  /**
   * Send Telegram alert
   */
  async sendTelegramAlert(event, message, alertType) {
    try {
      // This would integrate with Telegram Bot API
      // For now, just log it
      console.log(`📱 Would send Telegram alert: ${message.title}`);

      // Example implementation:
      // const botToken = process.env.TELEGRAM_BOT_TOKEN;
      // const chatId = process.env.TELEGRAM_CHAT_ID;
      // await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chat_id: chatId,
      //     text: message.body,
      //     parse_mode: 'HTML'
      //   })
      // });

    } catch (error) {
      console.error('Error sending Telegram alert:', error);
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(event, message, alertType) {
    try {
      // This would integrate with Firebase Cloud Messaging
      console.log(`📲 Would send push notification: ${message.title}`);

    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  /**
   * Fetch actual value for event
   * This is targeted scraping only at event time
   */
  async fetchActualValue(event) {
    try {
      // Try to fetch from Forex Factory or Investing.com
      // This is a simplified version
      console.log(`🔍 Fetching actual value for: ${event.title}`);

      // Simulate fetching actual value
      // In production, this would scrape the actual value from the source
      const actualValue = await this.scrapeActualValue(event);

      return actualValue;

    } catch (error) {
      console.error('Error fetching actual value:', error);
      return null;
    }
  }

  /**
   * Scrape actual value from source
   */
  async scrapeActualValue(event) {
    try {
      // This would be implemented based on the event source
      // For now, return null (actual value will be updated later)
      return null;

    } catch (error) {
      console.error('Error scraping actual value:', error);
      return null;
    }
  }

  /**
   * Update event pre-alert status
   */
  async updateEventPreAlert(eventId) {
    try {
      const eventRef = doc(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS, eventId);

      await updateDoc(eventRef, {
        preAlertSentAt: Timestamp.now(),
        status: EVENT_STATUS.ALERT_SENT,
        updatedAt: Timestamp.now()
      });

    } catch (error) {
      console.error('Error updating event pre-alert:', error);
    }
  }

  /**
   * Update event released status
   */
  async updateEventReleased(eventId, actualValue) {
    try {
      const eventRef = doc(db, FIRESTORE_COLLECTIONS.ECONOMIC_EVENTS, eventId);

      await updateDoc(eventRef, {
        actual: actualValue,
        alertSentAt: Timestamp.now(),
        status: EVENT_STATUS.RELEASED,
        releasedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

    } catch (error) {
      console.error('Error updating event released:', error);
    }
  }
}

// Export singleton instance
export const eventTriggerSystem = new EventTriggerSystem();

export default EventTriggerSystem;
