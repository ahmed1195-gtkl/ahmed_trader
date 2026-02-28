/**
 * خدمة عميل ذكاء السوق (Market Intelligence Client Service)
 * تتعامل مع جميع طلبات API المتعلقة بـ Market Intelligence
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class MarketIntelligenceClient {
  /**
   * جلب قائمة الأصول المتاحة
   */
  async getAvailableAssets() {
    try {
      const response = await fetch(`${API_BASE_URL}/market-intelligence/assets`);
      if (!response.ok) throw new Error('Failed to fetch assets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching assets:', error);
      // إرجاع أصول افتراضية في حالة الفشل
      return [
        { id: 'BTCUSDT', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
        { id: 'ETHUSDT', symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
        { id: 'EURUSD', symbol: 'EUR', name: 'Euro', type: 'forex' },
        { id: 'GBPUSD', symbol: 'GBP', name: 'British Pound', type: 'forex' },
        { id: 'XAUUSD', symbol: 'XAU', name: 'Gold', type: 'commodity' }
      ];
    }
  }

  /**
   * جلب بيانات أصل معين (الأخبار والتحليلات)
   */
  async getAssetData(assetId) {
    try {
      const response = await fetch(`${API_BASE_URL}/market-intelligence/${assetId}`);
      if (!response.ok) throw new Error('Failed to fetch asset data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching asset data:', error);
      throw error;
    }
  }

  /**
   * جلب أحدث الأخبار لأصل معين
   */
  async getLatestNews(assetId, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market-intelligence/${assetId}/news?limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch news');
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  /**
   * جلب التحليلات لأصل معين
   */
  async getAssetAnalytics(assetId, timeframeHours = 24) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market-intelligence/${assetId}/analytics?timeframe=${timeframeHours}`
      );
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  /**
   * جلب درجات المشاعر لمقالة معينة
   */
  async getArticleSentiment(articleId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market-intelligence/articles/${articleId}/sentiment`
      );
      if (!response.ok) throw new Error('Failed to fetch sentiment');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sentiment:', error);
      return null;
    }
  }

  /**
   * جلب تنبؤات التأثير لمقالة معينة
   */
  async getArticleImpact(articleId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market-intelligence/articles/${articleId}/impact`
      );
      if (!response.ok) throw new Error('Failed to fetch impact');
      return await response.json();
    } catch (error) {
      console.error('Error fetching impact:', error);
      return null;
    }
  }

  /**
   * إنشاء تنبيه مخصص
   */
  async createAlert(userId, alertData) {
    try {
      const response = await fetch(`${API_BASE_URL}/market-intelligence/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this._getAuthToken()}`
        },
        body: JSON.stringify({
          userId,
          ...alertData
        })
      });
      if (!response.ok) throw new Error('Failed to create alert');
      return await response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * جلب التنبيهات الخاصة بالمستخدم
   */
  async getUserAlerts(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market-intelligence/alerts?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${await this._getAuthToken()}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  /**
   * حذف تنبيه
   */
  async deleteAlert(alertId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/market-intelligence/alerts/${alertId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${await this._getAuthToken()}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to delete alert');
      return await response.json();
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  /**
   * الحصول على رمز المصادقة (Token)
   * @private
   */
  async _getAuthToken() {
    // في الإنتاج، يتم الحصول على الرمز من Firebase Auth
    // مثال: const token = await auth.currentUser.getIdToken();
    return 'mock-token';
  }
}

export const marketIntelligenceClient = new MarketIntelligenceClient();
export default marketIntelligenceClient;
