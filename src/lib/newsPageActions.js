/**
 * ملف مساعد لإدارة وظائف الأزرار والتنبيهات في صفحة الأخبار
 */

/**
 * إنشاء تنبيه مخصص للمستخدم
 */
export const createUserAlert = async (userId, assetId, conditionType, thresholdValue) => {
  try {
    const response = await fetch('/api/market-intelligence/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        assetId,
        conditionType,
        thresholdValue
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create alert: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.alertId;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

/**
 * جلب التنبيهات النشطة للمستخدم
 */
export const getUserAlerts = async (userId) => {
  try {
    const response = await fetch(`/api/market-intelligence/alerts?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

/**
 * حذف تنبيه معين
 */
export const deleteAlert = async (alertId) => {
  try {
    const response = await fetch(`/api/market-intelligence/alerts/${alertId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete alert: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw error;
  }
};

/**
 * جلب بيانات Market Intelligence لأصل معين
 */
export const getMarketIntelligence = async (assetId) => {
  try {
    const response = await fetch(`/api/market-intelligence/${assetId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch market intelligence: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching market intelligence:', error);
    throw error;
  }
};

/**
 * جلب التحليلات لأصل معين
 */
export const getAssetAnalytics = async (assetId, timeframe = 24) => {
  try {
    const response = await fetch(`/api/market-intelligence/${assetId}/analytics?timeframe=${timeframe}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * جلب قائمة الأصول المتاحة
 */
export const getAvailableAssets = async () => {
  try {
    const response = await fetch('/api/market-intelligence/assets');

    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
};

/**
 * تصدير البيانات إلى CSV
 */
export const exportNewsToCSV = (newsData, filename = 'news_export.csv') => {
  try {
    const headers = ['Timestamp', 'Title', 'Source', 'Sentiment', 'Confidence', 'Impact'];
    const rows = newsData.map(n => [
      new Date(n.publishedAt).toLocaleString(),
      `"${n.title}"`,
      n.source,
      n.sentiment,
      `${Math.round(n.ai_confidence * 100)}%`,
      n.impact
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * طباعة البيانات
 */
export const printNews = (newsData, title = 'Market Intelligence Report') => {
  try {
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; }
          .bullish { color: green; }
          .bearish { color: red; }
          .neutral { color: gray; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <tr>
            <th>Timestamp</th>
            <th>Title</th>
            <th>Source</th>
            <th>Sentiment</th>
            <th>Confidence</th>
            <th>Impact</th>
          </tr>
          ${newsData.map(n => `
            <tr>
              <td>${new Date(n.publishedAt).toLocaleString()}</td>
              <td>${n.title}</td>
              <td>${n.source}</td>
              <td class="${n.sentiment.toLowerCase()}">${n.sentiment}</td>
              <td>${Math.round(n.ai_confidence * 100)}%</td>
              <td>${n.impact}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();

    return true;
  } catch (error) {
    console.error('Error printing:', error);
    throw error;
  }
};

/**
 * نسخ رابط الخبر إلى الحافظة
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
};

/**
 * مشاركة الخبر على وسائل التواصل
 */
export const shareNews = (title, url) => {
  try {
    if (navigator.share) {
      navigator.share({
        title: 'Market Intelligence',
        text: title,
        url: url
      });
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(`${title}\n${url}`);
    }
    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    throw error;
  }
};
