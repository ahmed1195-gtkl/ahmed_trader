# خطة تطوير نظام الفرق الحقيقية (Real Teams System)

## نظرة عامة

تطوير نظام التحديات ليشمل:
1. قائمة أعلى 10 نتائج على مستوى المنصة
2. نظام الفرق الحقيقية مع روابط الدعوة
3. ربط الحسابات الديمو الحقيقية من الوسطاء
4. نظام محادثات الفريق
5. قراءة الصفقات والـ Drawdown من الحسابات الحقيقية

---

## 1. بنية البيانات الجديدة

### Firebase Collections

#### **teams**
```javascript
{
  id: "team_id",
  challengeId: "challenge_id",
  name: "Team Alpha",
  leaderId: "user_id",
  members: ["user_id1", "user_id2", ...],
  inviteCode: "ABC123XYZ",
  createdAt: timestamp,
  status: "active" | "completed"
}
```

#### **team_invites**
```javascript
{
  id: "invite_id",
  teamId: "team_id",
  inviteCode: "ABC123XYZ",
  createdBy: "user_id",
  expiresAt: timestamp,
  maxUses: 10,
  usedCount: 0
}
```

#### **demo_accounts**
```javascript
{
  id: "account_id",
  userId: "user_id",
  participantId: "participant_id",
  brokerId: "broker_id",
  brokerName: "IC Markets",
  accountNumber: "12345678",
  investorPassword: "encrypted_password",
  serverName: "ICMarkets-Demo01",
  accountType: "demo",
  platform: "MT4" | "MT5",
  connectedAt: timestamp,
  lastSyncAt: timestamp,
  status: "connected" | "disconnected" | "error"
}
```

#### **team_chat**
```javascript
{
  id: "message_id",
  teamId: "team_id",
  userId: "user_id",
  userName: "Ahmed",
  message: "Let's focus on EUR/USD",
  timestamp: timestamp,
  type: "text" | "trade_alert" | "system"
}
```

#### **global_leaderboard**
```javascript
{
  id: "leaderboard_id",
  userId: "user_id",
  userName: "Ahmed",
  totalChallenges: 5,
  passedChallenges: 3,
  totalProfit: 15000,
  averageReturn: 15.5,
  winRate: 68.5,
  bestChallenge: {
    level: "gold",
    profit: 12000,
    return: 24.0
  },
  rank: 1,
  updatedAt: timestamp
}
```

---

## 2. قائمة أعلى 10 نتائج

### المكون: `GlobalLeaderboard.jsx`

**الميزات:**
- عرض أفضل 10 متداولين على مستوى المنصة
- الإحصائيات: إجمالي التحديات، النجاحات، الأرباح، معدل العائد
- فلترة حسب: الكل، البرونزي، الفضي، الذهبي
- تحديثات فورية
- عرض شارات للمراكز الثلاثة الأولى

**الحسابات:**
- إجمالي الأرباح من جميع التحديات الناجحة
- معدل العائد = (إجمالي الأرباح / إجمالي رأس المال الأولي) × 100
- معدل الفوز = (عدد الصفقات الرابحة / إجمالي الصفقات) × 100

---

## 3. نظام الفرق وروابط الدعوة

### المكون: `TeamManagement.jsx`

**الميزات:**
- إنشاء فريق جديد
- توليد رابط دعوة فريد
- مشاركة الرابط (نسخ، QR Code)
- عرض أعضاء الفريق
- إحصائيات الفريق الجماعية
- طرد أعضاء (للقائد فقط)

**آلية العمل:**
1. المستخدم ينضم إلى تحدي
2. يمكنه إنشاء فريق أو الانضمام لفريق موجود
3. يتم توليد رابط دعوة فريد (مثل: `/join-team/ABC123XYZ`)
4. الأعضاء الجدد ينقرون على الرابط وينضمون
5. الحد الأقصى للفريق = عدد المشاركين في التحدي

---

## 4. ربط الحسابات الديمو من الوسطاء

### المكون: `ConnectDemoAccount.jsx`

**الحقول المطلوبة:**
- اختيار الوسيط من القائمة الموجودة
- رقم الحساب (Account Number)
- كلمة مرور المستثمر (Investor Password)
- اسم السيرفر (Server Name)
- نوع المنصة (MT4 / MT5)

**التحقق:**
- التحقق من صحة البيانات قبل الحفظ
- تشفير كلمة المرور
- اختبار الاتصال بالسيرفر

**الوسطاء المدعومون:**
سيتم استخدام قائمة الوسطاء الموجودة في `src/data/brokers.js`

---

## 5. قراءة بيانات MT4/MT5

### الخدمة: `mt4mt5Service.js`

**طرق القراءة:**

#### الطريقة 1: MetaAPI (موصى بها)
- API موثوق لقراءة بيانات MT4/MT5
- يدعم القراءة فقط (Investor Password)
- يوفر: الصفقات، الرصيد، Equity، Drawdown
- التكلفة: مجاني للحسابات الديمو

#### الطريقة 2: FIX API
- اتصال مباشر بسيرفرات الوسطاء
- يتطلب دعم من الوسيط

#### الطريقة 3: Web API من الوسطاء
- بعض الوسطاء يوفرون APIs خاصة

**البيانات المقروءة:**
```javascript
{
  balance: 10500.00,
  equity: 10650.00,
  margin: 150.00,
  freeMargin: 10500.00,
  openTrades: [
    {
      ticket: 12345678,
      symbol: "EURUSD",
      type: "buy" | "sell",
      volume: 0.1,
      openPrice: 1.0850,
      currentPrice: 1.0865,
      stopLoss: 1.0830,
      takeProfit: 1.0900,
      profit: 15.00,
      openTime: timestamp
    }
  ],
  closedTrades: [...],
  maxDrawdown: 5.2,
  dailyDrawdown: 2.1
}
```

**التحديث:**
- قراءة البيانات كل 30 ثانية
- تحديث Firebase تلقائياً
- حساب Drawdown تلقائياً

---

## 6. نظام محادثات الفريق

### المكون: `TeamChat.jsx`

**الميزات:**
- محادثة فورية بين أعضاء الفريق
- إشعارات عند فتح/إغلاق صفقة من أي عضو
- مشاركة التحليلات والأفكار
- رموز تعبيرية
- إرسال صور (اختياري)

**أنواع الرسائل:**
1. **نصية عادية**: رسائل الأعضاء
2. **تنبيهات الصفقات**: "Ahmed opened BUY EURUSD 0.1 lot"
3. **رسائل النظام**: "New member joined the team"

**التصميم:**
- نافذة منبثقة في زاوية الشاشة
- قابلة للتصغير/التكبير
- عداد الرسائل غير المقروءة
- صوت تنبيه (اختياري)

---

## 7. واجهات المستخدم الجديدة

### 7.1 صفحة القادة العالمية
**المسار:** `/global-leaderboard`
- جدول بأفضل 10 متداولين
- فلاتر حسب المستوى
- إحصائيات تفصيلية
- شارات للمراكز الأولى

### 7.2 صفحة إدارة الفريق
**المسار:** `/team/:teamId`
- معلومات الفريق
- قائمة الأعضاء
- رابط الدعوة
- إحصائيات جماعية
- محادثة الفريق

### 7.3 صفحة ربط الحساب
**المسار:** `/connect-demo-account/:participantId`
- نموذج إدخال بيانات الحساب
- اختيار الوسيط
- اختبار الاتصال
- حالة الاتصال

### 7.4 صفحة الانضمام للفريق
**المسار:** `/join-team/:inviteCode`
- معلومات الفريق
- عدد الأعضاء الحاليين
- زر الانضمام

---

## 8. التكامل مع النظام الحالي

### تعديلات على `ChallengeDashboard.jsx`
- إضافة زر "Create Team" / "Join Team"
- عرض معلومات الفريق إذا كان المستخدم في فريق
- زر "Connect Demo Account"
- عرض حالة الاتصال بالحساب الديمو

### تعديلات على `TradingChallenge.jsx`
- إضافة قسم "Global Top 10"
- رابط إلى صفحة القادة الكاملة

### تعديلات على `Header.jsx`
- إضافة رابط "Global Leaderboard"

---

## 9. الأمان والخصوصية

### تشفير البيانات
- تشفير كلمات مرور المستثمرين قبل الحفظ
- استخدام Firebase Security Rules

### الصلاحيات
- فقط صاحب الحساب يمكنه ربط حسابه
- قائد الفريق يمكنه طرد الأعضاء
- جميع أعضاء الفريق يمكنهم رؤية بيانات بعضهم

### قواعد Firebase
```javascript
// teams
match /teams/{teamId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth.uid == resource.data.leaderId;
}

// demo_accounts
match /demo_accounts/{accountId} {
  allow read: if request.auth != null && 
    (request.auth.uid == resource.data.userId || 
     exists(/databases/$(database)/documents/teams/$(resource.data.teamId)/members/$(request.auth.uid)));
  allow write: if request.auth.uid == resource.data.userId;
}

// team_chat
match /team_chat/{messageId} {
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/teams/$(resource.data.teamId)/members/$(request.auth.uid));
  allow create: if request.auth != null;
}
```

---

## 10. APIs المطلوبة

### MetaAPI
- **الموقع**: https://metaapi.cloud/
- **التسجيل**: مجاني للحسابات الديمو
- **الاستخدام**: قراءة بيانات MT4/MT5
- **التوثيق**: https://metaapi.cloud/docs/

### متغيرات البيئة الجديدة
```
VITE_METAAPI_TOKEN=your_metaapi_token
```

---

## 11. الجدول الزمني للتنفيذ

1. **المرحلة 1**: بنية البيانات والتخطيط ✓
2. **المرحلة 2**: قائمة أعلى 10 نتائج (30 دقيقة)
3. **المرحلة 3**: نظام الفرق وروابط الدعوة (45 دقيقة)
4. **المرحلة 4**: ربط الحسابات الديمو وقراءة البيانات (60 دقيقة)
5. **المرحلة 5**: نظام محادثات الفريق (30 دقيقة)
6. **المرحلة 6**: الواجهات والتكامل (45 دقيقة)
7. **المرحلة 7**: الاختبار والنشر (30 دقيقة)

**الإجمالي**: ~4 ساعات

---

## 12. الميزات الإضافية (اختياري)

- [ ] QR Code لروابط الدعوة
- [ ] إحصائيات مقارنة بين أعضاء الفريق
- [ ] نسخ الصفقات (Copy Trading) داخل الفريق
- [ ] تنبيهات Telegram للفريق
- [ ] تحليل أداء الفريق الجماعي
- [ ] مسابقات بين الفرق

---

**تاريخ الإنشاء**: 15 فبراير 2026
**الحالة**: جاري التنفيذ
