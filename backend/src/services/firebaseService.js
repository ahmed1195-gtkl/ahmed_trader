import admin from 'firebase-admin';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.db = null;
  }

  initialize() {
    if (this.initialized) {
      logger.warn('Firebase already initialized');
      return;
    }

    try {
      if (!config.firebase.projectId || !config.firebase.privateKey || !config.firebase.clientEmail) {
        logger.error('Firebase configuration is incomplete');
        return;
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          privateKey: config.firebase.privateKey,
          clientEmail: config.firebase.clientEmail,
        }),
      });

      this.db = admin.firestore();
      this.initialized = true;
      logger.info('✅ Firebase initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Firebase', error);
    }
  }

  getFirestore() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.db;
  }

  // Save trade to Firestore
  async saveTrade(userId, trade) {
    try {
      const db = this.getFirestore();
      const tradeRef = await db.collection('live_trades').add({
        userId,
        ...trade,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      logger.info(`Trade saved: ${tradeRef.id}`);
      return tradeRef.id;
    } catch (error) {
      logger.error('Failed to save trade', error);
      throw error;
    }
  }

  // Update trade
  async updateTrade(tradeId, updates) {
    try {
      const db = this.getFirestore();
      await db.collection('live_trades').doc(tradeId).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      logger.info(`Trade updated: ${tradeId}`);
    } catch (error) {
      logger.error('Failed to update trade', error);
      throw error;
    }
  }

  // Get active trades for user
  async getActiveTrades(userId) {
    try {
      const db = this.getFirestore();
      const snapshot = await db
        .collection('live_trades')
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('Failed to get active trades', error);
      throw error;
    }
  }

  // Save bot learning data
  async saveBotLearning(userId, learningData) {
    try {
      const db = this.getFirestore();
      await db.collection('bot_learning_v2').add({
        userId,
        ...learningData,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      logger.debug('Bot learning data saved');
    } catch (error) {
      logger.error('Failed to save bot learning data', error);
    }
  }

  // Get bot learning history
  async getBotLearningHistory(userId, limit = 100) {
    try {
      const db = this.getFirestore();
      const snapshot = await db
        .collection('bot_learning_v2')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      logger.error('Failed to get bot learning history', error);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();
export default firebaseService;
