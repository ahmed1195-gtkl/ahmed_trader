# 🤖 دليل تكامل MetaAPI - Ahmed Trader

هذا الدليل يشرح كيفية تفعيل التكامل الحقيقي مع MetaAPI لربط حسابات MT4/MT5 التجريبية.

---

## 📋 نظرة عامة

حالياً، ملف `mt4mt5Service.js` يستخدم **بيانات محاكاة (Mock Data)** للاختبار. لتفعيل التكامل الحقيقي، يجب:

1. ✅ التسجيل في MetaAPI
2. ✅ الحصول على API Token
3. ✅ تثبيت SDK
4. ✅ تحديث الكود
5. ✅ اختبار الاتصال

---

## 🚀 الخطوة 1: التسجيل في MetaAPI

### 1.1 إنشاء حساب

1. اذهب إلى [MetaAPI.cloud](https://metaapi.cloud/)
2. اضغط على **Sign Up**
3. أكمل التسجيل (يمكنك استخدام Google/GitHub)

### 1.2 الحصول على API Token

1. بعد تسجيل الدخول، اذهب إلى [Dashboard](https://app.metaapi.cloud/)
2. من القائمة الجانبية، اختر **Settings** > **API tokens**
3. اضغط على **Create new token**
4. أدخل اسم للـ Token (مثل: `ahmed-trader-production`)
5. انسخ الـ Token وضعه في ملف `.env`:
   ```
   VITE_METAAPI_TOKEN=your_token_here
   ```

⚠️ **مهم**: احتفظ بالـ Token في مكان آمن، لن تتمكن من رؤيته مرة أخرى!

---

## 📦 الخطوة 2: تثبيت MetaAPI SDK

### 2.1 تثبيت الحزمة

```bash
cd /home/ubuntu/ahmed_trader
npm install metaapi.cloud-sdk
```

أو باستخدام pnpm:
```bash
pnpm add metaapi.cloud-sdk
```

### 2.2 التحقق من التثبيت

```bash
npm list metaapi.cloud-sdk
```

يجب أن ترى:
```
metaapi.cloud-sdk@X.X.X
```

---

## 🔧 الخطوة 3: تحديث الكود

### 3.1 تحديث `mt4mt5Service.js`

الكود الحالي يستخدم محاكاة. يجب استبدال الدوال التالية:

#### أ) استيراد MetaAPI

أضف في بداية الملف:
```javascript
import MetaApi from 'metaapi.cloud-sdk';

// تهيئة MetaAPI
const metaApiToken = import.meta.env.VITE_METAAPI_TOKEN;
let metaApi = null;

if (metaApiToken && metaApiToken !== 'your_metaapi_token_here') {
  metaApi = new MetaApi(metaApiToken);
}
```

#### ب) تحديث `testConnection()`

استبدل الدالة الحالية بـ:
```javascript
async function testConnection(accountData) {
  try {
    if (!metaApi) {
      return {
        success: false,
        error: 'MetaAPI token not configured'
      };
    }

    // إنشاء حساب في MetaAPI
    const accounts = await metaApi.metatraderAccountApi.getAccounts();
    
    // البحث عن حساب موجود بنفس رقم الحساب
    let account = accounts.find(a => a.login === accountData.accountNumber);
    
    if (!account) {
      // إنشاء حساب جديد
      account = await metaApi.metatraderAccountApi.createAccount({
        name: `Ahmed Trader - ${accountData.accountNumber}`,
        type: 'cloud',
        login: accountData.accountNumber,
        password: accountData.investorPassword,
        server: accountData.serverName,
        platform: accountData.platform.toLowerCase(), // 'mt4' or 'mt5'
        magic: 0,
        application: 'MetaApi',
        region: 'new-york' // أو 'london', 'singapore'
      });
    }

    // نشر الحساب
    await account.deploy();
    
    // انتظار الاتصال (حد أقصى 3 دقائق)
    await account.waitConnected({ timeoutInSeconds: 180 });

    // اختبار القراءة
    const accountInfo = await account.getAccountInformation();
    
    if (accountInfo) {
      return {
        success: true,
        message: 'Connection successful',
        accountId: account.id,
        balance: accountInfo.balance,
        equity: accountInfo.equity
      };
    } else {
      return {
        success: false,
        error: 'Failed to retrieve account information'
      };
    }
  } catch (error) {
    console.error('MetaAPI connection error:', error);
    return {
      success: false,
      error: error.message || 'Connection failed'
    };
  }
}
```

#### ج) تحديث `fetchAccountData()`

استبدل الدالة الحالية بـ:
```javascript
export async function fetchAccountData(userId, participantId) {
  try {
    if (!metaApi) {
      throw new Error('MetaAPI not configured');
    }

    // جلب معلومات الحساب من Firebase
    const accountRef = doc(db, 'demo_accounts', `${userId}_${participantId}`);
    const accountDoc = await getDoc(accountRef);

    if (!accountDoc.exists()) {
      throw new Error('Account not found');
    }

    const accountData = accountDoc.data();

    if (accountData.status !== 'connected') {
      throw new Error('Account is not connected');
    }

    // الحصول على الحساب من MetaAPI
    const accounts = await metaApi.metatraderAccountApi.getAccounts();
    const account = accounts.find(a => a.login === accountData.accountNumber);

    if (!account) {
      throw new Error('MetaAPI account not found');
    }

    // التأكد من أن الحساب متصل
    if (account.state !== 'DEPLOYED') {
      await account.deploy();
      await account.waitConnected({ timeoutInSeconds: 60 });
    }

    // جلب معلومات الحساب
    const accountInfo = await account.getAccountInformation();
    
    // جلب الصفقات المفتوحة
    const positions = await account.getPositions();
    
    // جلب السجل (آخر 24 ساعة)
    const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const history = await account.getHistoryOrdersByTimeRange(startTime, new Date());

    // تحويل الصفقات المفتوحة
    const openTrades = positions.map(pos => ({
      ticket: pos.id,
      symbol: pos.symbol,
      type: pos.type === 'POSITION_TYPE_BUY' ? 'buy' : 'sell',
      volume: pos.volume,
      openPrice: pos.openPrice,
      currentPrice: pos.currentPrice,
      stopLoss: pos.stopLoss,
      takeProfit: pos.takeProfit,
      profit: pos.profit,
      openTime: pos.time,
      commission: pos.commission || 0,
      swap: pos.swap || 0
    }));

    // حساب Drawdown
    const peakBalance = Math.max(accountInfo.balance, accountData.initialBalance || accountInfo.balance);
    const maxDrawdown = ((peakBalance - accountInfo.balance) / peakBalance) * 100;
    
    // حساب Daily Drawdown (يحتاج تتبع يومي)
    const dailyDrawdown = 0; // TODO: تنفيذ حساب Daily Drawdown

    // تحديث آخر وقت مزامنة
    await updateDoc(accountRef, {
      lastSyncAt: serverTimestamp()
    });

    return {
      balance: accountInfo.balance,
      equity: accountInfo.equity,
      margin: accountInfo.margin,
      freeMargin: accountInfo.freeMargin,
      marginLevel: accountInfo.marginLevel,
      openTrades,
      closedTrades: history,
      maxDrawdown,
      dailyDrawdown
    };
  } catch (error) {
    console.error('Error fetching account data:', error);
    throw error;
  }
}
```

---

## 🧪 الخطوة 4: الاختبار

### 4.1 اختبار محلي

1. تأكد من أن `VITE_METAAPI_TOKEN` موجود في `.env`
2. شغّل المشروع:
   ```bash
   npm run dev
   ```
3. اذهب إلى صفحة التحديات
4. حاول ربط حساب ديمو

### 4.2 اختبار الاتصال

استخدم هذا الكود للاختبار:
```javascript
import { connectDemoAccount } from './lib/mt4mt5Service';

const testAccount = {
  brokerId: 'ic-markets',
  brokerName: 'IC Markets',
  accountNumber: '12345678',
  investorPassword: 'your_investor_password',
  serverName: 'ICMarkets-Demo01',
  platform: 'MT4'
};

connectDemoAccount('test_user_id', 'test_participant_id', testAccount)
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

---

## 📊 الخطوة 5: المراقبة والصيانة

### 5.1 مراقبة الاتصالات

MetaAPI يوفر dashboard لمراقبة:
- عدد الحسابات المتصلة
- استخدام API
- الأخطاء والتنبيهات

### 5.2 معالجة الأخطاء الشائعة

#### خطأ: "Account not found"
- تأكد من صحة رقم الحساب واسم السيرفر
- تحقق من أن الحساب ديمو وليس حقيقي

#### خطأ: "Invalid credentials"
- تأكد من صحة كلمة مرور المستثمر
- جرب تسجيل الدخول يدوياً في MT4/MT5

#### خطأ: "Connection timeout"
- تحقق من اتصال الإنترنت
- جرب region مختلف (new-york, london, singapore)

#### خطأ: "Rate limit exceeded"
- الخطة المجانية: 1 حساب ديمو فقط
- ترقية للخطة المدفوعة لحسابات أكثر

---

## 💰 الأسعار والحدود

### الخطة المجانية
- ✅ 1 حساب ديمو
- ✅ قراءة فقط (Investor Password)
- ✅ تحديثات فورية
- ✅ API calls غير محدودة
- ❌ حسابات حقيقية

### الخطط المدفوعة
- **Basic** ($49/شهر): 5 حسابات ديمو
- **Pro** ($99/شهر): 20 حساب ديمو + 5 حقيقية
- **Enterprise**: حسب الطلب

---

## 🔐 الأمان

### حماية البيانات الحساسة

1. **تشفير كلمات المرور**:
   - يتم تشفير Investor Password قبل الحفظ
   - استخدام `VITE_ENCRYPTION_KEY`

2. **عدم تخزين Master Password**:
   - لا نطلب Master Password أبداً
   - فقط Investor Password (قراءة فقط)

3. **قواعد Firebase**:
   - فقط صاحب الحساب يمكنه رؤية بياناته
   - الأدمن لا يمكنه رؤية كلمات المرور

---

## 🐛 استكشاف الأخطاء

### مشكلة: البيانات المحاكاة لا تزال تظهر

**الحل**:
1. تأكد من تثبيت `metaapi.cloud-sdk`
2. تأكد من وجود `VITE_METAAPI_TOKEN` في `.env`
3. أعد تشغيل الخادم (`npm run dev`)
4. امسح cache المتصفح

### مشكلة: "MetaAPI is not a constructor"

**الحل**:
```javascript
// استخدم:
import MetaApi from 'metaapi.cloud-sdk';

// بدلاً من:
import { MetaApi } from 'metaapi.cloud-sdk';
```

### مشكلة: الاتصال بطيء جداً

**الحل**:
1. اختر region أقرب لموقع السيرفر
2. استخدم `waitConnected` مع timeout أطول
3. تحقق من سرعة الإنترنت

---

## 📚 موارد إضافية

- [MetaAPI Documentation](https://metaapi.cloud/docs/)
- [MetaAPI JavaScript SDK](https://github.com/agiliumtrade-ai/metaapi-node.js-sdk)
- [MetaAPI Examples](https://github.com/agiliumtrade-ai/metaapi-node.js-sdk/tree/master/examples)
- [MetaAPI Support](https://metaapi.cloud/support/)

---

## ✅ Checklist

قبل الإطلاق في الإنتاج:

- [ ] تثبيت `metaapi.cloud-sdk`
- [ ] الحصول على MetaAPI Token
- [ ] تحديث `mt4mt5Service.js`
- [ ] اختبار الاتصال مع حساب ديمو حقيقي
- [ ] اختبار قراءة الصفقات والرصيد
- [ ] اختبار المزامنة التلقائية
- [ ] معالجة جميع الأخطاء المحتملة
- [ ] مراقبة استخدام API
- [ ] توثيق العملية للمستخدمين

---

**جاهز للتكامل! 🚀**
