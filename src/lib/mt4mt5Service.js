import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import CryptoJS from 'crypto-js';

// مفتاح التشفير (يجب أن يكون في متغيرات البيئة)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-encryption-key-change-this';

/**
 * تشفير كلمة المرور
 */
function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
}

/**
 * فك تشفير كلمة المرور
 */
function decryptPassword(encryptedPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * ربط حساب ديمو MT4/MT5
 */
export async function connectDemoAccount(userId, participantId, accountData) {
  try {
    const {
      brokerId,
      brokerName,
      accountNumber,
      investorPassword,
      serverName,
      platform // 'MT4' or 'MT5'
    } = accountData;

    // التحقق من البيانات
    if (!accountNumber || !investorPassword || !serverName || !platform) {
      throw new Error('All fields are required');
    }

    // تشفير كلمة المرور
    const encryptedPassword = encryptPassword(investorPassword);

    // حفظ بيانات الحساب
    const accountRef = doc(db, 'demo_accounts', `${userId}_${participantId}`);
    await setDoc(accountRef, {
      userId,
      participantId,
      brokerId,
      brokerName,
      accountNumber,
      investorPassword: encryptedPassword,
      serverName,
      platform,
      accountType: 'demo',
      connectedAt: serverTimestamp(),
      lastSyncAt: null,
      status: 'connecting',
      error: null
    });

    // محاولة الاتصال والتحقق
    const connectionResult = await testConnection(accountData);

    if (connectionResult.success) {
      await updateDoc(accountRef, {
        status: 'connected',
        lastSyncAt: serverTimestamp()
      });
    } else {
      await updateDoc(accountRef, {
        status: 'error',
        error: connectionResult.error
      });
      throw new Error(connectionResult.error);
    }

    // بدء المزامنة التلقائية
    startAutoSync(userId, participantId);

    return {
      success: true,
      accountId: accountRef.id
    };
  } catch (error) {
    console.error('Error connecting demo account:', error);
    throw error;
  }
}

/**
 * اختبار الاتصال بالحساب
 */
async function testConnection(accountData) {
  try {
    // في الإنتاج، سيتم استخدام MetaAPI أو FIX API
    // هنا نستخدم محاكاة للاختبار
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 2000));

    // في الواقع، سيتم الاتصال بـ MetaAPI
    // const metaApi = new MetaApi(process.env.VITE_METAAPI_TOKEN);
    // const account = await metaApi.metatraderAccountApi.getAccount(accountId);
    // await account.deploy();
    // await account.waitConnected();

    // محاكاة نجاح الاتصال
    const isValid = accountData.accountNumber && 
                   accountData.investorPassword && 
                   accountData.serverName;

    if (isValid) {
      return {
        success: true,
        message: 'Connection successful'
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Connection failed'
    };
  }
}

/**
 * قراءة بيانات الحساب من MT4/MT5
 */
export async function fetchAccountData(userId, participantId) {
  try {
    const accountRef = doc(db, 'demo_accounts', `${userId}_${participantId}`);
    const accountDoc = await getDoc(accountRef);

    if (!accountDoc.exists()) {
      throw new Error('Account not found');
    }

    const accountData = accountDoc.data();

    if (accountData.status !== 'connected') {
      throw new Error('Account is not connected');
    }

    // فك تشفير كلمة المرور
    const password = decryptPassword(accountData.investorPassword);

    // جلب بيانات حقيقية من MetaAPI
    const METAAPI_TOKEN = import.meta.env.VITE_METAAPI_TOKEN;
    
    if (METAAPI_TOKEN && accountData.metaApiAccountId) {
      try {
        // جلب بيانات الحساب من MetaAPI
        const response = await fetch(
          `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${accountData.metaApiAccountId}/account-information`,
          {
            headers: {
              'auth-token': METAAPI_TOKEN
            }
          }
        );
        
        if (response.ok) {
          const accountInfo = await response.json();
          
          // جلب الصفقات المفتوحة
          const positionsResponse = await fetch(
            `https://mt-client-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${accountData.metaApiAccountId}/positions`,
            {
              headers: {
                'auth-token': METAAPI_TOKEN
              }
            }
          );
          
          const positions = positionsResponse.ok ? await positionsResponse.json() : [];
          
          // تحويل البيانات للصيغة المطلوبة
          const realData = {
            balance: accountInfo.balance || 0,
            equity: accountInfo.equity || 0,
            margin: accountInfo.margin || 0,
            freeMargin: accountInfo.freeMargin || 0,
            marginLevel: accountInfo.marginLevel || 0,
            openTrades: positions.map(pos => ({
              ticket: pos.id,
              symbol: pos.symbol,
              type: pos.type,
              volume: pos.volume,
              openPrice: pos.openPrice,
              currentPrice: pos.currentPrice,
              stopLoss: pos.stopLoss,
              takeProfit: pos.takeProfit,
              profit: pos.profit,
              openTime: pos.time,
              commission: pos.commission || 0,
              swap: pos.swap || 0
            })),
            closedTrades: [],
            maxDrawdown: accountInfo.equity < accountInfo.balance ? 
              ((accountInfo.balance - accountInfo.equity) / accountInfo.balance) * 100 : 0,
            dailyDrawdown: 0 // يتم حسابه من السجل
          };
          
          // تحديث آخر وقت مزامنة
          await updateDoc(accountRef, {
            lastSyncAt: serverTimestamp()
          });
          
          return realData;
        }
      } catch (error) {
        console.error('MetaAPI fetch error:', error);
        // الاستمرار في البيانات المحلية إذا فشل MetaAPI
      }
    }
    
    // بيانات افتراضية للاختبار (إذا لم يتم ربط MetaAPI)
    const mockData = {
      balance: accountData.initialBalance || 10000,
      equity: accountData.initialBalance || 10000,
      margin: 0,
      freeMargin: accountData.initialBalance || 10000,
      marginLevel: 0,
      openTrades: [],
      closedTrades: [],
      maxDrawdown: 0,
      dailyDrawdown: 0
    };

    // تحديث آخر وقت مزامنة
    await updateDoc(accountRef, {
      lastSyncAt: serverTimestamp()
    });

    return mockData;
  } catch (error) {
    console.error('Error fetching account data:', error);
    throw error;
  }
}

/**
 * بدء المزامنة التلقائية
 */
function startAutoSync(userId, participantId) {
  // المزامنة كل 30 ثانية
  const syncInterval = setInterval(async () => {
    try {
      const accountData = await fetchAccountData(userId, participantId);
      
      // تحديث بيانات المشارك في التحدي
      const participantRef = doc(db, 'challenge_participants', participantId);
      const participantDoc = await getDoc(participantRef);

      if (!participantDoc.exists()) {
        clearInterval(syncInterval);
        return;
      }

      const participant = participantDoc.data();

      // تحديث الرصيد والإحصائيات
      await updateDoc(participantRef, {
        balance: accountData.balance,
        equity: accountData.equity,
        maxDrawdown: Math.max(participant.maxDrawdown || 0, accountData.maxDrawdown),
        dailyDrawdown: accountData.dailyDrawdown,
        lastSyncedAt: serverTimestamp()
      });

      // مزامنة الصفقات المفتوحة
      await syncOpenTrades(participantId, accountData.openTrades);

    } catch (error) {
      console.error('Auto sync error:', error);
    }
  }, 30000); // 30 ثانية

  // حفظ معرف الفاصل الزمني لإيقافه لاحقاً
  return syncInterval;
}

/**
 * مزامنة الصفقات المفتوحة
 */
async function syncOpenTrades(participantId, trades) {
  try {
    // في التطبيق الحقيقي، سيتم مزامنة الصفقات مع Firebase
    // هنا نستخدم محاكاة بسيطة
    
    for (const trade of trades) {
      const tradeRef = doc(db, 'challenge_trades', `${participantId}_${trade.ticket}`);
      const tradeDoc = await getDoc(tradeRef);

      if (!tradeDoc.exists()) {
        // صفقة جديدة
        await setDoc(tradeRef, {
          participantId,
          ticket: trade.ticket,
          symbol: trade.symbol,
          type: trade.type,
          volume: trade.volume,
          openPrice: trade.openPrice,
          currentPrice: trade.currentPrice,
          stopLoss: trade.stopLoss,
          takeProfit: trade.takeProfit,
          profit: trade.profit,
          openTime: new Date(trade.openTime),
          status: 'open',
          source: 'mt4_sync',
          syncedAt: serverTimestamp()
        });
      } else {
        // تحديث صفقة موجودة
        await updateDoc(tradeRef, {
          currentPrice: trade.currentPrice,
          profit: trade.profit,
          syncedAt: serverTimestamp()
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error syncing open trades:', error);
    return false;
  }
}

/**
 * قطع الاتصال بالحساب
 */
export async function disconnectAccount(userId, participantId) {
  try {
    const accountRef = doc(db, 'demo_accounts', `${userId}_${participantId}`);
    await updateDoc(accountRef, {
      status: 'disconnected',
      lastSyncAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error disconnecting account:', error);
    throw error;
  }
}

/**
 * حذف الحساب المربوط
 */
export async function deleteConnectedAccount(userId, participantId) {
  try {
    const accountRef = doc(db, 'demo_accounts', `${userId}_${participantId}`);
    await deleteDoc(accountRef);

    return true;
  } catch (error) {
    console.error('Error deleting connected account:', error);
    throw error;
  }
}

/**
 * الحصول على حالة الحساب المربوط
 */
export async function getAccountStatus(userId, participantId) {
  try {
    const accountRef = doc(db, 'demo_accounts', `${userId}_${participantId}`);
    const accountDoc = await getDoc(accountRef);

    if (!accountDoc.exists()) {
      return {
        connected: false,
        status: 'not_connected'
      };
    }

    const data = accountDoc.data();
    return {
      connected: data.status === 'connected',
      status: data.status,
      brokerName: data.brokerName,
      accountNumber: data.accountNumber,
      platform: data.platform,
      lastSyncAt: data.lastSyncAt,
      error: data.error
    };
  } catch (error) {
    console.error('Error getting account status:', error);
    return {
      connected: false,
      status: 'error',
      error: error.message
    };
  }
}

export default {
  connectDemoAccount,
  fetchAccountData,
  disconnectAccount,
  deleteConnectedAccount,
  getAccountStatus,
  testConnection
};
