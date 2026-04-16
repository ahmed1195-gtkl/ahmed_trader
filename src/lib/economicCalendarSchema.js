/**
 * Economic Calendar Firestore Schema
 * 
 * This file defines the structure for all collections related to the Economic Calendar system.
 * It follows an event-driven architecture to minimize scraping and API calls.
 */

export const FIRESTORE_COLLECTIONS = {
  // Main collection for economic events
  ECONOMIC_EVENTS: 'economic_events',
  
  // Collection for event alerts sent to users
  EVENT_ALERTS: 'event_alerts',
  
  // Collection for scraper metadata and status
  SCRAPER_STATUS: 'scraper_status',
  
  // Collection for user preferences and filters
  USER_CALENDAR_PREFERENCES: 'user_calendar_preferences',
  
  // Collection for cached event data
  CACHED_EVENTS: 'cached_events'
};

/**
 * Economic Event Document Structure
 * 
 * Collection: economic_events
 * Purpose: Store all economic calendar events
 * 
 * @example
 * {
 *   id: "nfp_2024_01_05",
 *   title: "Non-Farm Payroll",
 *   titleAr: "الرواتب غير الزراعية",
 *   titleEn: "Non-Farm Payroll",
 *   titleFr: "Emplois non agricoles",
 *   titleEs: "Nómina no agrícola",
 *   
 *   currency: "USD",
 *   country: "United States",
 *   countryCode: "US",
 *   
 *   impact: "HIGH", // HIGH, MEDIUM, LOW
 *   
 *   eventTime: Timestamp,
 *   eventTimeUTC: "2024-01-05T13:30:00Z",
 *   
 *   forecast: "180000",
 *   previous: "210000",
 *   actual: null, // Set after event is released
 *   
 *   status: "pending", // pending, alert_sent, released, completed
 *   
 *   source: "forex_factory", // forex_factory, investing_com, etc
 *   sourceUrl: "https://www.forexfactory.com/...",
 *   
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 *   releasedAt: null, // Set when actual value is released
 *   
 *   // Sentiment analysis (optional)
 *   sentiment: null, // bullish, bearish, neutral
 *   
 *   // For tracking
 *   alertSentAt: null,
 *   preAlertSentAt: null, // 5 minutes before
 *   
 *   // Metadata
 *   importance: 9, // 1-10 scale
 *   category: "Employment", // Employment, GDP, Inflation, etc
 *   
 *   // Duplicate tracking
 *   isDuplicate: false,
 *   duplicateOf: null, // Reference to original event ID
 * }
 */
export const ECONOMIC_EVENT_SCHEMA = {
  // Identifiers
  id: String,
  
  // Event Details (Multi-language)
  title: String,
  titleAr: String,
  titleEn: String,
  titleFr: String,
  titleEs: String,
  
  // Currency & Country
  currency: String, // e.g., "USD", "EUR", "GBP"
  country: String,
  countryCode: String,
  
  // Impact Level
  impact: String, // "HIGH", "MEDIUM", "LOW"
  
  // Timing
  eventTime: 'Timestamp',
  eventTimeUTC: String,
  
  // Economic Data
  forecast: String,
  previous: String,
  actual: String,
  
  // Status Tracking
  status: String, // "pending", "alert_sent", "released", "completed"
  
  // Source Information
  source: String,
  sourceUrl: String,
  
  // Timestamps
  createdAt: 'Timestamp',
  updatedAt: 'Timestamp',
  releasedAt: 'Timestamp',
  
  // Alert Tracking
  alertSentAt: 'Timestamp',
  preAlertSentAt: 'Timestamp',
  
  // Optional: Sentiment Analysis
  sentiment: String, // "bullish", "bearish", "neutral"
  
  // Metadata
  importance: Number, // 1-10
  category: String, // "Employment", "GDP", "Inflation", etc
  
  // Duplicate Handling
  isDuplicate: Boolean,
  duplicateOf: String
};

/**
 * Event Alert Document Structure
 * 
 * Collection: event_alerts
 * Purpose: Track alerts sent to users
 * 
 * @example
 * {
 *   id: "alert_nfp_2024_01_05_user123",
 *   eventId: "nfp_2024_01_05",
 *   userId: "user123",
 *   
 *   alertType: "pre_alert", // pre_alert, release_alert
 *   
 *   sentAt: Timestamp,
 *   deliveryStatus: "sent", // sent, failed, bounced
 *   
 *   channel: "in_app", // in_app, telegram, email, push
 *   
 *   messageContent: "...",
 *   
 *   read: false,
 *   readAt: null,
 * }
 */
export const EVENT_ALERT_SCHEMA = {
  id: String,
  eventId: String,
  userId: String,
  
  alertType: String, // "pre_alert", "release_alert"
  
  sentAt: 'Timestamp',
  deliveryStatus: String, // "sent", "failed", "bounced"
  
  channel: String, // "in_app", "telegram", "email", "push"
  
  messageContent: String,
  
  read: Boolean,
  readAt: 'Timestamp'
};

/**
 * Scraper Status Document Structure
 * 
 * Collection: scraper_status
 * Purpose: Track scraper execution and prevent duplicates
 * 
 * @example
 * {
 *   id: "scraper_status",
 *   
 *   lastScrapedAt: Timestamp,
 *   lastScrapedEvents: 25,
 *   
 *   nextScheduledScrape: Timestamp,
 *   
 *   status: "idle", // idle, running, error
 *   
 *   lastError: null,
 *   errorCount: 0,
 *   
 *   scrapedEventIds: ["nfp_2024_01_05", "cpi_2024_01_10", ...],
 *   
 *   updatedAt: Timestamp
 * }
 */
export const SCRAPER_STATUS_SCHEMA = {
  id: String,
  
  lastScrapedAt: 'Timestamp',
  lastScrapedEvents: Number,
  
  nextScheduledScrape: 'Timestamp',
  
  status: String, // "idle", "running", "error"
  
  lastError: String,
  errorCount: Number,
  
  scrapedEventIds: [String],
  
  updatedAt: 'Timestamp'
};

/**
 * User Calendar Preferences Document Structure
 * 
 * Collection: user_calendar_preferences
 * Purpose: Store user filter preferences
 * 
 * @example
 * {
 *   id: "user123",
 *   
 *   currencies: ["USD", "EUR", "GBP"],
 *   
 *   impactLevels: ["HIGH", "MEDIUM"],
 *   
 *   categories: ["Employment", "GDP"],
 *   
 *   language: "ar", // ar, en, fr, es
 *   
 *   timezone: "UTC",
 *   
 *   notificationPreferences: {
 *     preAlert: true,
 *     releaseAlert: true,
 *     channels: ["in_app", "telegram"]
 *   },
 *   
 *   updatedAt: Timestamp
 * }
 */
export const USER_CALENDAR_PREFERENCES_SCHEMA = {
  id: String,
  
  currencies: [String],
  impactLevels: [String],
  categories: [String],
  
  language: String,
  timezone: String,
  
  notificationPreferences: {
    preAlert: Boolean,
    releaseAlert: Boolean,
    channels: [String]
  },
  
  updatedAt: 'Timestamp'
};

/**
 * Cached Events Document Structure
 * 
 * Collection: cached_events
 * Purpose: Cache events for quick retrieval
 * 
 * @example
 * {
 *   id: "cached_events_2024_01",
 *   
 *   month: "2024-01",
 *   
 *   events: [...], // Array of event summaries
 *   
 *   totalEvents: 45,
 *   
 *   cachedAt: Timestamp,
 *   expiresAt: Timestamp,
 * }
 */
export const CACHED_EVENTS_SCHEMA = {
  id: String,
  
  month: String,
  
  events: [Object],
  
  totalEvents: Number,
  
  cachedAt: 'Timestamp',
  expiresAt: 'Timestamp'
};

/**
 * Helper function to create a new economic event object
 */
export function createEconomicEvent(data) {
  return {
    id: data.id || generateEventId(data),
    
    // Multi-language titles
    title: data.title || '',
    titleAr: data.titleAr || data.title || '',
    titleEn: data.titleEn || data.title || '',
    titleFr: data.titleFr || data.title || '',
    titleEs: data.titleEs || data.title || '',
    
    // Currency & Country
    currency: data.currency || 'USD',
    country: data.country || 'Unknown',
    countryCode: data.countryCode || 'XX',
    
    // Impact
    impact: data.impact || 'MEDIUM',
    
    // Timing
    eventTime: data.eventTime || new Date(),
    eventTimeUTC: data.eventTimeUTC || new Date().toISOString(),
    
    // Economic Data
    forecast: data.forecast || null,
    previous: data.previous || null,
    actual: data.actual || null,
    
    // Status
    status: 'pending',
    
    // Source
    source: data.source || 'unknown',
    sourceUrl: data.sourceUrl || '',
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
    releasedAt: null,
    
    // Alerts
    alertSentAt: null,
    preAlertSentAt: null,
    
    // Optional
    sentiment: null,
    importance: data.importance || 5,
    category: data.category || 'Other',
    
    // Duplicate handling
    isDuplicate: false,
    duplicateOf: null
  };
}

/**
 * Generate a unique event ID
 */
function generateEventId(data) {
  const title = data.title?.toLowerCase().replace(/\s+/g, '_') || 'event';
  const date = new Date(data.eventTime).toISOString().split('T')[0];
  const currency = data.currency || 'xxx';
  return `${title}_${currency}_${date}`;
}

/**
 * Event Categories
 */
export const EVENT_CATEGORIES = {
  EMPLOYMENT: 'Employment',
  GDP: 'GDP',
  INFLATION: 'Inflation',
  INTEREST_RATES: 'Interest Rates',
  RETAIL_SALES: 'Retail Sales',
  HOUSING: 'Housing',
  MANUFACTURING: 'Manufacturing',
  SERVICES: 'Services',
  TRADE: 'Trade',
  CENTRAL_BANK: 'Central Bank',
  CONSUMER: 'Consumer',
  BUSINESS: 'Business',
  OTHER: 'Other'
};

/**
 * Impact Levels
 */
export const IMPACT_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

/**
 * Event Status
 */
export const EVENT_STATUS = {
  PENDING: 'pending',
  ALERT_SENT: 'alert_sent',
  RELEASED: 'released',
  COMPLETED: 'completed'
};

/**
 * Alert Types
 */
export const ALERT_TYPES = {
  PRE_ALERT: 'pre_alert',
  RELEASE_ALERT: 'release_alert'
};

/**
 * Notification Channels
 */
export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  TELEGRAM: 'telegram',
  EMAIL: 'email',
  PUSH: 'push'
};
