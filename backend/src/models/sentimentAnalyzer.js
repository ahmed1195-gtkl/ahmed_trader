import logger from '../utils/logger.js';

/**
 * محلل المشاعر المالي (Financial Sentiment Analyzer)
 * يستخدم نماذج مدربة مسبقاً لتحليل المشاعر في النصوص المالية
 * 
 * ملاحظة: هذه نسخة محسّنة تحاكي FinBERT
 * في الإنتاج، يجب استخدام نموذج FinBERT الحقيقي أو OpenAI API
 */
class SentimentAnalyzer {
  constructor() {
    this.initialized = false;
    this.financialKeywords = this._initializeFinancialKeywords();
  }

  async initialize() {
    try {
      // في الإنتاج، يتم تحميل نموذج FinBERT هنا
      // مثال: this.model = await loadFinBertModel();
      this.initialized = true;
      logger.info('✅ Sentiment Analyzer initialized');
    } catch (error) {
      logger.error('Failed to initialize Sentiment Analyzer', error);
    }
  }

  /**
   * تحليل المشاعر لنص مالي
   * @param {string} text - النص المراد تحليله
   * @returns {Object} - نتيجة التحليل {score, label, confidence, keyPhrases}
   */
  async analyzeSentiment(text) {
    try {
      if (!text || text.trim().length === 0) {
        return {
          sentimentScore: 0,
          sentimentLabel: 'Neutral',
          confidencePercent: 0,
          keyPhrases: []
        };
      }

      // استخراج الكلمات المفتاحية المؤثرة
      const keyPhrases = this._extractKeyPhrases(text);

      // حساب درجة المشاعر
      const sentimentScore = this._calculateSentimentScore(text);

      // تحديد التصنيف
      const sentimentLabel = this._getSentimentLabel(sentimentScore);

      // حساب درجة الثقة
      const confidencePercent = this._calculateConfidence(text, sentimentScore);

      return {
        sentimentScore: sentimentScore,
        sentimentLabel: sentimentLabel,
        confidencePercent: confidencePercent,
        keyPhrases: keyPhrases
      };
    } catch (error) {
      logger.error('Error analyzing sentiment', error);
      return {
        sentimentScore: 0,
        sentimentLabel: 'Neutral',
        confidencePercent: 0,
        keyPhrases: []
      };
    }
  }

  /**
   * حساب درجة المشاعر من -1 إلى +1
   * @private
   */
  _calculateSentimentScore(text) {
    const lowerText = text.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;

    // الكلمات الإيجابية المالية
    const positiveWords = this.financialKeywords.positive;
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex) || [];
      positiveScore += matches.length;
    });

    // الكلمات السلبية المالية
    const negativeWords = this.financialKeywords.negative;
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex) || [];
      negativeScore += matches.length;
    });

    // حساب النسبة
    const totalScore = positiveScore + negativeScore;
    if (totalScore === 0) return 0;

    const score = (positiveScore - negativeScore) / totalScore;
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * تحديد تصنيف المشاعر بناءً على الدرجة
   * @private
   */
  _getSentimentLabel(score) {
    if (score > 0.2) return 'Bullish';
    if (score < -0.2) return 'Bearish';
    return 'Neutral';
  }

  /**
   * حساب درجة الثقة في التحليل
   * @private
   */
  _calculateConfidence(text, sentimentScore) {
    // العوامل المؤثرة على الثقة:
    // 1. طول النص
    // 2. وضوح المشاعر (بعد النقاط الوسيطة)
    // 3. عدد الكلمات المفتاحية

    const wordCount = text.split(/\s+/).length;
    const wordCountFactor = Math.min(wordCount / 100, 1); // أقصى 100 كلمة

    const sentimentClarityFactor = Math.abs(sentimentScore); // كلما زاد الفرق، زادت الثقة

    const keyPhrases = this._extractKeyPhrases(text);
    const keywordFactor = Math.min(keyPhrases.length / 5, 1); // أقصى 5 كلمات مفتاحية

    const confidence = (wordCountFactor + sentimentClarityFactor + keywordFactor) / 3;
    return Math.round(confidence * 100);
  }

  /**
   * استخراج الكلمات المفتاحية المؤثرة
   * @private
   */
  _extractKeyPhrases(text) {
    const phrases = [];
    const allKeywords = [
      ...this.financialKeywords.positive,
      ...this.financialKeywords.negative,
      ...this.financialKeywords.impactful
    ];

    allKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
        phrases.push(keyword);
      }
    });

    return [...new Set(phrases)].slice(0, 10); // إرجاع أفضل 10 كلمات فريدة
  }

  /**
   * تهيئة قاموس الكلمات المفتاحية المالية
   * @private
   */
  _initializeFinancialKeywords() {
    return {
      positive: [
        'surge', 'rise', 'gain', 'bull', 'rally', 'growth', 'profit', 'up', 'high',
        'record', 'breakthrough', 'success', 'bullish', 'positive', 'strong',
        'adoption', 'partnership', 'integration', 'upgrade', 'launch',
        'expansion', 'recovery', 'rally', 'boom', 'momentum', 'outperform',
        'beat', 'exceed', 'optimistic', 'confidence', 'upside', 'opportunity',
        'innovation', 'improvement', 'surge', 'jump', 'soar', 'triumph'
      ],
      negative: [
        'fall', 'drop', 'crash', 'bear', 'loss', 'down', 'low', 'decline', 'crisis',
        'risk', 'concern', 'warning', 'bearish', 'negative', 'weak', 'selloff',
        'ban', 'regulation', 'hack', 'exploit', 'vulnerability', 'downside',
        'recession', 'collapse', 'plunge', 'slump', 'tumble', 'pessimistic',
        'uncertainty', 'fear', 'panic', 'sell-off', 'liquidation', 'default',
        'bankruptcy', 'fraud', 'scandal', 'investigation', 'lawsuit'
      ],
      impactful: [
        'fed', 'ecb', 'central bank', 'interest rate', 'inflation', 'gdp',
        'unemployment', 'cpi', 'ppi', 'earnings', 'revenue', 'guidance',
        'merger', 'acquisition', 'ipo', 'sec', 'regulatory', 'policy',
        'geopolitical', 'sanctions', 'trade war', 'tariff', 'stimulus',
        'quantitative easing', 'rate hike', 'rate cut', 'fomc', 'nfp',
        'retail sales', 'housing', 'consumer confidence', 'pmi'
      ]
    };
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();
export default sentimentAnalyzer;
