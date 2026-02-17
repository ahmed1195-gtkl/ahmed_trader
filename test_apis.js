/**
 * ═══════════════════════════════════════════════════════════════
 * API Keys Testing Script
 * ═══════════════════════════════════════════════════════════════
 * اختبار جميع مفاتيح API للتأكد من صحتها
 * ═══════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import fetch from 'node-fetch';

const results = {
  passed: [],
  failed: [],
  warnings: []
};

/**
 * اختبار Finnhub API
 */
async function testFinnhub() {
  const apiKey = process.env.VITE_FINNHUB_API_KEY;
  
  if (!apiKey) {
    results.failed.push({
      service: 'Finnhub',
      error: 'API Key not found in .env'
    });
    return;
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`);
    const data = await response.json();

    if (response.status === 200 && data.c) {
      results.passed.push({
        service: 'Finnhub',
        status: 'OK',
        message: `Current price: $${data.c}`
      });
    } else if (response.status === 401) {
      results.failed.push({
        service: 'Finnhub',
        error: 'Invalid API Key (401 Unauthorized)'
      });
    } else if (response.status === 429) {
      results.warnings.push({
        service: 'Finnhub',
        warning: 'Rate limit exceeded (429)'
      });
    } else {
      results.failed.push({
        service: 'Finnhub',
        error: `Unexpected response: ${response.status}`
      });
    }
  } catch (error) {
    results.failed.push({
      service: 'Finnhub',
      error: error.message
    });
  }
}

/**
 * اختبار TwelveData API
 */
async function testTwelveData() {
  const apiKey = process.env.VITE_TWELVEDATA_API_KEY;
  
  if (!apiKey) {
    results.failed.push({
      service: 'TwelveData',
      error: 'API Key not found in .env'
    });
    return;
  }

  try {
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=EUR/USD&interval=1min&apikey=${apiKey}`);
    const data = await response.json();

    if (response.status === 200 && data.values) {
      results.passed.push({
        service: 'TwelveData',
        status: 'OK',
        message: `Data points received: ${data.values.length}`
      });
    } else if (data.code === 401) {
      results.failed.push({
        service: 'TwelveData',
        error: 'Invalid API Key (401 Unauthorized)'
      });
    } else if (data.code === 429) {
      results.warnings.push({
        service: 'TwelveData',
        warning: 'Rate limit exceeded (429)'
      });
    } else {
      results.failed.push({
        service: 'TwelveData',
        error: data.message || `Unexpected response: ${response.status}`
      });
    }
  } catch (error) {
    results.failed.push({
      service: 'TwelveData',
      error: error.message
    });
  }
}

/**
 * اختبار MetaAPI Token
 */
async function testMetaAPI() {
  const token = process.env.VITE_METAAPI_TOKEN;
  
  if (!token) {
    results.failed.push({
      service: 'MetaAPI',
      error: 'Token not found in .env'
    });
    return;
  }

  try {
    const response = await fetch('https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current', {
      headers: {
        'auth-token': token
      }
    });
    
    const data = await response.json();

    if (response.status === 200 && data._id) {
      results.passed.push({
        service: 'MetaAPI',
        status: 'OK',
        message: `User ID: ${data._id}`
      });
    } else if (response.status === 401) {
      results.failed.push({
        service: 'MetaAPI',
        error: 'Invalid Token (401 Unauthorized)'
      });
    } else {
      results.failed.push({
        service: 'MetaAPI',
        error: `Unexpected response: ${response.status}`
      });
    }
  } catch (error) {
    results.failed.push({
      service: 'MetaAPI',
      error: error.message
    });
  }
}

/**
 * اختبار News API
 */
async function testNewsAPI() {
  const apiKey = process.env.VITE_NEWS_API_KEY;
  
  if (!apiKey) {
    results.warnings.push({
      service: 'News API',
      warning: 'API Key not found (optional service)'
    });
    return;
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${apiKey}`);
    const data = await response.json();

    if (response.status === 200 && data.articles) {
      results.passed.push({
        service: 'News API',
        status: 'OK',
        message: `Articles found: ${data.articles.length}`
      });
    } else if (data.code === 'apiKeyInvalid') {
      results.failed.push({
        service: 'News API',
        error: 'Invalid API Key'
      });
    } else if (data.code === 'rateLimited') {
      results.warnings.push({
        service: 'News API',
        warning: 'Rate limit exceeded'
      });
    } else {
      results.failed.push({
        service: 'News API',
        error: data.message || `Unexpected response: ${response.status}`
      });
    }
  } catch (error) {
    results.failed.push({
      service: 'News API',
      error: error.message
    });
  }
}

/**
 * اختبار Alpha Vantage API
 */
async function testAlphaVantage() {
  const apiKey = process.env.VITE_ALPHA_VANTAGE_KEY;
  
  if (!apiKey) {
    results.warnings.push({
      service: 'Alpha Vantage',
      warning: 'API Key not found (optional service)'
    });
    return;
  }

  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${apiKey}`);
    const data = await response.json();

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      results.passed.push({
        service: 'Alpha Vantage',
        status: 'OK',
        message: `Price: $${data['Global Quote']['05. price']}`
      });
    } else if (data['Error Message']) {
      results.failed.push({
        service: 'Alpha Vantage',
        error: data['Error Message']
      });
    } else if (data['Note']) {
      results.warnings.push({
        service: 'Alpha Vantage',
        warning: 'Rate limit exceeded (5 calls/min)'
      });
    } else {
      results.failed.push({
        service: 'Alpha Vantage',
        error: 'Unexpected response format'
      });
    }
  } catch (error) {
    results.failed.push({
      service: 'Alpha Vantage',
      error: error.message
    });
  }
}

/**
 * التحقق من Firebase Config
 */
function testFirebaseConfig() {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);

  if (missingKeys.length === 0) {
    results.passed.push({
      service: 'Firebase Config',
      status: 'OK',
      message: 'All required keys present'
    });
  } else {
    results.failed.push({
      service: 'Firebase Config',
      error: `Missing keys: ${missingKeys.join(', ')}`
    });
  }
}

/**
 * التحقق من Encryption Key
 */
function testEncryptionKey() {
  const key = process.env.VITE_ENCRYPTION_KEY;
  
  if (!key) {
    results.failed.push({
      service: 'Encryption Key',
      error: 'Not found in .env'
    });
  } else if (key.length < 32) {
    results.warnings.push({
      service: 'Encryption Key',
      warning: 'Key is too short (should be 32+ characters)'
    });
  } else {
    results.passed.push({
      service: 'Encryption Key',
      status: 'OK',
      message: `Length: ${key.length} characters`
    });
  }
}

/**
 * طباعة النتائج
 */
function printResults() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🔍 API KEYS TESTING RESULTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (results.passed.length > 0) {
    console.log('✅ PASSED TESTS:\n');
    results.passed.forEach(result => {
      console.log(`  ✓ ${result.service}`);
      console.log(`    Status: ${result.status}`);
      console.log(`    ${result.message}\n`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    results.warnings.forEach(result => {
      console.log(`  ⚠ ${result.service}`);
      console.log(`    ${result.warning}\n`);
    });
  }

  if (results.failed.length > 0) {
    console.log('❌ FAILED TESTS:\n');
    results.failed.forEach(result => {
      console.log(`  ✗ ${result.service}`);
      console.log(`    Error: ${result.error}\n`);
    });
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('SUMMARY:');
  console.log(`  ✅ Passed: ${results.passed.length}`);
  console.log(`  ⚠️  Warnings: ${results.warnings.length}`);
  console.log(`  ❌ Failed: ${results.failed.length}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (results.failed.length === 0) {
    console.log('🎉 ALL CRITICAL TESTS PASSED! Your APIs are ready to use.\n');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Please check the errors above.\n');
  }
}

/**
 * تشغيل جميع الاختبارات
 */
async function runAllTests() {
  console.log('🚀 Starting API tests...\n');

  // اختبارات غير متزامنة
  await testFinnhub();
  await testTwelveData();
  await testMetaAPI();
  await testNewsAPI();
  await testAlphaVantage();

  // اختبارات متزامنة
  testFirebaseConfig();
  testEncryptionKey();

  // طباعة النتائج
  printResults();
}

// تشغيل الاختبارات
runAllTests().catch(console.error);
