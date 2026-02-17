# 🔧 دليل إعداد متغيرات البيئة - Ahmed Trader

هذا الدليل يشرح كيفية الحصول على جميع مفاتيح API المطلوبة لتشغيل المشروع.

---

## 📋 الخطوات السريعة

1. انسخ ملف `.env.example` إلى `.env`
   ```bash
   cp .env.example .env
   ```

2. املأ القيم في ملف `.env` باستخدام الدليل أدناه

3. **لا تشارك ملف `.env` أبداً** - هو مضاف بالفعل إلى `.gitignore`

---

## 🔥 Firebase (ضروري)

### الحصول على بيانات Firebase:

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى **Project Settings** (⚙️ > Project Settings)
4. في قسم **Your apps**، اختر تطبيق الويب أو أنشئ واحد
5. انسخ القيم من **SDK setup and configuration**:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",              // VITE_FIREBASE_API_KEY
     authDomain: "...",          // VITE_FIREBASE_AUTH_DOMAIN
     projectId: "...",           // VITE_FIREBASE_PROJECT_ID
     storageBucket: "...",       // VITE_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "...",   // VITE_FIREBASE_MESSAGING_SENDER_ID
     appId: "...",               // VITE_FIREBASE_APP_ID
     measurementId: "..."        // VITE_FIREBASE_MEASUREMENT_ID
   };
   ```

### تفعيل الخدمات المطلوبة:

1. **Authentication**:
   - اذهب إلى Authentication > Sign-in method
   - فعّل Email/Password
   - فعّل Google (اختياري)

2. **Firestore Database**:
   - اذهب إلى Firestore Database
   - أنشئ قاعدة بيانات في وضع Production
   - انسخ القواعد من ملف `firestore.rules`

3. **Storage**:
   - اذهب إلى Storage
   - ابدأ الخدمة

---

## 📊 Finnhub API (ضروري)

**الاستخدام**: أسعار الأسهم والعملات في الوقت الفعلي

### الحصول على المفتاح:

1. اذهب إلى [Finnhub.io](https://finnhub.io/)
2. سجل حساب مجاني
3. اذهب إلى [Dashboard](https://finnhub.io/dashboard)
4. انسخ **API Key**
5. ضعه في `VITE_FINNHUB_API_KEY`

**الخطة المجانية**:
- ✅ 60 طلب/دقيقة
- ✅ أسعار فورية للأسهم والعملات
- ✅ بيانات تاريخية محدودة

---

## 📈 TwelveData API (ضروري)

**الاستخدام**: بيانات تاريخية وأسعار فورية

### الحصول على المفتاح:

1. اذهب إلى [TwelveData](https://twelvedata.com/)
2. سجل حساب مجاني
3. اذهب إلى [API Dashboard](https://twelvedata.com/account/api)
4. انسخ **API Key**
5. ضعه في `VITE_TWELVEDATA_API_KEY`

**الخطة المجانية**:
- ✅ 800 طلب/يوم
- ✅ بيانات تاريخية
- ✅ مؤشرات فنية
- ❌ WebSocket (خطة مدفوعة فقط)

---

## 🤖 MetaAPI (ضروري للتحديات)

**الاستخدام**: ربط حسابات MT4/MT5 التجريبية

### الحصول على Token:

1. اذهب إلى [MetaAPI.cloud](https://metaapi.cloud/)
2. سجل حساب مجاني
3. اذهب إلى [Dashboard](https://app.metaapi.cloud/)
4. اذهب إلى **Settings** > **API tokens**
5. أنشئ token جديد
6. انسخ الـ Token
7. ضعه في `VITE_METAAPI_TOKEN`

**الخطة المجانية**:
- ✅ 1 حساب ديمو
- ✅ قراءة البيانات فقط (Investor Password)
- ✅ تحديثات فورية
- ❌ حسابات حقيقية (خطة مدفوعة فقط)

### ربط حساب MT4/MT5:

بعد الحصول على Token، يمكن للمستخدمين ربط حساباتهم التجريبية من داخل التطبيق.

---

## 🔐 مفتاح التشفير (ضروري)

**الاستخدام**: تشفير كلمات مرور المستثمرين وبيانات حساسة

### توليد مفتاح قوي:

**Linux/Mac**:
```bash
openssl rand -base64 32
```

**Windows (PowerShell)**:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**أونلاين** (استخدم موقع موثوق):
- [RandomKeygen](https://randomkeygen.com/)
- اختر "CodeIgniter Encryption Keys" (256-bit)

ضع المفتاح في `VITE_ENCRYPTION_KEY`

⚠️ **مهم جداً**:
- لا تشارك هذا المفتاح مع أحد
- إذا فقدت المفتاح، لن تتمكن من فك تشفير البيانات
- لا تغير المفتاح بعد بدء الإنتاج

---

## 📰 News API (اختياري)

**الاستخدام**: أخبار مالية وتحليل المشاعر

### الحصول على المفتاح:

1. اذهب إلى [NewsAPI.org](https://newsapi.org/)
2. سجل حساب مجاني
3. انسخ **API Key** من [Dashboard](https://newsapi.org/account)
4. ضعه في `VITE_NEWS_API_KEY`

**الخطة المجانية**:
- ✅ 100 طلب/يوم
- ✅ أخبار من 80,000+ مصدر
- ❌ أخبار قديمة (خطة مدفوعة فقط)

---

## 📊 Alpha Vantage (اختياري)

**الاستخدام**: مؤشرات فنية وبيانات أساسية

### الحصول على المفتاح:

1. اذهب إلى [Alpha Vantage](https://www.alphavantage.co/)
2. اضغط على [Get Your Free API Key Today](https://www.alphavantage.co/support/#api-key)
3. املأ النموذج
4. انسخ **API Key**
5. ضعه في `VITE_ALPHA_VANTAGE_KEY`

**الخطة المجانية**:
- ✅ 25 طلب/يوم
- ✅ مؤشرات فنية (RSI, MACD, etc.)
- ✅ بيانات أساسية

---

## ☁️ Cloudinary (اختياري)

**الاستخدام**: تخزين الصور والفيديوهات

### الحصول على البيانات:

1. اذهب إلى [Cloudinary](https://cloudinary.com/)
2. سجل حساب مجاني
3. من [Dashboard](https://cloudinary.com/console):
   - انسخ **Cloud Name** → `VITE_CLOUDINARY_CLOUD_NAME`
   - انسخ **API Key** → `VITE_CLOUDINARY_API_KEY`
   - انسخ **API Secret** → `VITE_CLOUDINARY_API_SECRET`

**الخطة المجانية**:
- ✅ 25 GB تخزين
- ✅ 25 GB bandwidth/شهر
- ✅ معالجة الصور

---

## 💬 Telegram Bot (اختياري)

**الاستخدام**: إشعارات وتنبيهات

### إنشاء Bot:

1. افتح Telegram وابحث عن [@BotFather](https://t.me/BotFather)
2. أرسل `/newbot`
3. اتبع التعليمات
4. انسخ **Bot Token** → `VITE_TELEGRAM_BOT_TOKEN`

### الحصول على Chat ID:

1. ابحث عن [@userinfobot](https://t.me/userinfobot)
2. أرسل `/start`
3. انسخ **Chat ID** → `VITE_TELEGRAM_CHAT_ID`

---

## ✅ التحقق من الإعداد

بعد ملء جميع المتغيرات، شغّل المشروع:

```bash
npm run dev
```

تحقق من Console في المتصفح:
- ✅ لا توجد أخطاء في الاتصال بـ Firebase
- ✅ بيانات السوق تُحمّل بشكل صحيح
- ✅ لا توجد رسائل "API key missing"

---

## 🐛 حل المشاكل الشائعة

### Firebase: "Firebase App not initialized"
- تأكد من أن جميع متغيرات `VITE_FIREBASE_*` مملوءة
- تأكد من أن ملف `.env` في المجلد الرئيسي للمشروع

### Market Data: "Failed to fetch price"
- تأكد من صحة `VITE_FINNHUB_API_KEY`
- تحقق من عدم تجاوز حد الطلبات (60/دقيقة)

### MetaAPI: "Invalid token"
- تأكد من نسخ Token بشكل صحيح
- تحقق من أن Token لم ينتهي

### Encryption: "Malformed UTF-8 data"
- تأكد من أن `VITE_ENCRYPTION_KEY` لم يتغير
- إذا غيرت المفتاح، احذف جميع الحسابات المربوطة

---

## 📝 ملاحظات مهمة

1. **الأمان**:
   - لا تشارك ملف `.env` أبداً
   - لا ترفع ملف `.env` على GitHub
   - استخدم متغيرات بيئة مختلفة للإنتاج

2. **الحدود المجانية**:
   - راقب استخدامك للـ APIs
   - فكر في الترقية للخطط المدفوعة عند الحاجة

3. **الإنتاج**:
   - استخدم متغيرات بيئة من Vercel/Netlify
   - لا تستخدم مفاتيح التطوير في الإنتاج

---

## 🆘 الدعم

إذا واجهت مشاكل:
1. تحقق من Console في المتصفح
2. تحقق من صحة جميع المفاتيح
3. راجع توثيق كل API

---

**جاهز للانطلاق! 🚀**
