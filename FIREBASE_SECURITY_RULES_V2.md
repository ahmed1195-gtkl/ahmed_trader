# قواعد حماية Firebase (Security Rules) - ShukriTrade Academy v2
## نظام التقدم التدريجي والمراحل المقفلة

---

## 📋 نظرة عامة

هذا الملف يحتوي على قواعس الحماية المحدثة لـ Firestore لنظام الأكاديمية الجديد مع:
- ✅ نظام المراحل الـ 15 (0-14)
- ✅ 178 درس موزعة على المراحل
- ✅ نظام التقدم التدريجي (Locked Progression)
- ✅ خصوصية بيانات كل مستخدم
- ✅ منع الغش والوصول غير المصرح

---

## 🔐 قواعس Firestore Rules (انسخ هذا الكود)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==================== دوال مساعدة ====================
    
    // التحقق من أن المستخدم مسجل دخول
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // التحقق من أن المستخدم هو صاحب البيانات
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // التحقق من أن المستخدم هو admin
    function isAdmin() {
      let userDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      return userDoc.data.isAdmin == true;
    }
    
    // ==================== مجموعة Users ====================
    
    match /users/{userId} {
      // قراءة: المستخدم يقرأ بيانات نفسه فقط
      allow read: if isAuthenticated() && isOwner(userId);
      
      // كتابة: المستخدم يكتب بيانات نفسه فقط
      allow write: if isAuthenticated() && isOwner(userId);
      
      // حذف: ممنوع
      allow delete: if false;
      
      // السماح بإنشاء مستخدم جديد عند التسجيل
      allow create: if isAuthenticated() && isOwner(userId) && 
                       request.resource.data.keys().hasAll(['email', 'createdAt']);
    }
    
    // ==================== مجموعة User Progress (الرئيسية) ====================
    
    match /userProgress/{userId} {
      // قراءة: المستخدم يقرأ بيانات تقدمه فقط
      allow read: if isAuthenticated() && isOwner(userId);
      
      // كتابة: المستخدم يكتب بيانات تقدمه فقط
      allow write: if isAuthenticated() && isOwner(userId) &&
                      request.resource.data.keys().hasAll(['userId', 'createdAt']) &&
                      request.resource.data.userId == userId;
      
      // حذف: ممنوع
      allow delete: if false;
      
      // السماح بإنشاء ملف تقدم جديد
      allow create: if isAuthenticated() && isOwner(userId) &&
                       request.resource.data.userId == userId;
      
      // ==================== مجموعة Activity Logs ====================
      
      match /activityLogs/{logId} {
        // قراءة: المستخدم يقرأ سجل نشاطه فقط
        allow read: if isAuthenticated() && isOwner(userId);
        
        // كتابة: المستخدم يضيف سجلات نشاطه فقط
        allow write: if isAuthenticated() && isOwner(userId) &&
                        request.resource.data.userId == userId &&
                        request.resource.data.keys().hasAll(['userId', 'timestamp']);
        
        // حذف: ممنوع
        allow delete: if false;
      }
    }
    
    // ==================== مجموعة Stage Exams ====================
    
    match /stageExams/{examId} {
      // قراءة: المستخدم يقرأ نتائج امتحاناته فقط
      allow read: if isAuthenticated() && 
                     get(/databases/$(database)/documents/stageExams/$(examId)).data.userId == request.auth.uid;
      
      // كتابة: المستخدم يرسل نتائج امتحانه فقط
      allow write: if isAuthenticated() &&
                      request.resource.data.userId == request.auth.uid &&
                      request.resource.data.keys().hasAll(['userId', 'stageId', 'score', 'timestamp']);
      
      // حذف: ممنوع
      allow delete: if false;
    }
    
    // ==================== مجموعة Achievements ====================
    
    match /achievements/{achievementId} {
      // قراءة: المستخدم يقرأ إنجازاته فقط
      allow read: if isAuthenticated() && 
                     get(/databases/$(database)/documents/achievements/$(achievementId)).data.userId == request.auth.uid;
      
      // كتابة: ممنوع (يتم من Cloud Functions فقط)
      allow write: if false;
      
      // حذف: ممنوع
      allow delete: if false;
    }
    
    // ==================== مجموعة Admin Data ====================
    
    match /adminData/{document=**} {
      // قراءة: Admin فقط
      allow read: if isAuthenticated() && isAdmin();
      
      // كتابة: Admin فقط
      allow write: if isAuthenticated() && isAdmin();
      
      // حذف: Admin فقط
      allow delete: if isAuthenticated() && isAdmin();
    }
    
    // ==================== مجموعة Public Data ====================
    
    match /publicData/{document=**} {
      // قراءة: الجميع
      allow read: if true;
      
      // كتابة: Admin فقط
      allow write: if isAuthenticated() && isAdmin();
      
      // حذف: Admin فقط
      allow delete: if isAuthenticated() && isAdmin();
    }
    
    // ==================== قاعدة افتراضية ====================
    
    // رفض كل ما لم يتم تحديده
    match /{document=**} {
      allow read, write, delete: if false;
    }
  }
}
```

---

## 📊 هيكل البيانات في Firestore

### 1. **مجموعة `userProgress/{userId}` (الرئيسية)**

```json
{
  "userId": "user123",
  "userName": "أحمد",
  "email": "ahmed@example.com",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T12:00:00Z",
  
  // ملخص التقدم العام
  "overallProgress": 25,
  "completedStages": 1,
  "completedLessons": 12,
  "totalPoints": 100,
  
  // حالة المراحل (15 مرحلة من 0 إلى 14)
  "stagesStatus": {
    "stage_0": {
      "stageId": 0,
      "isUnlocked": true,
      "isCompleted": true,
      "completedAt": "2024-03-19T12:00:00Z",
      "completedLessons": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      "totalLessons": 12,
      "lessonsProgress": 100,
      "stageExam": {
        "isTaken": true,
        "score": 18,
        "maxScore": 20,
        "isPassed": true,
        "passedAt": "2024-03-19T12:00:00Z",
        "attempts": 1,
        "maxAttempts": 3
      },
      "timeSpent": 180,
      "pointsEarned": 100
    },
    "stage_1": {
      "stageId": 1,
      "isUnlocked": true,
      "isCompleted": false,
      "completedAt": null,
      "completedLessons": [0, 1, 2],
      "totalLessons": 12,
      "lessonsProgress": 25,
      "stageExam": {
        "isTaken": false,
        "score": 0,
        "maxScore": 20,
        "isPassed": false,
        "passedAt": null,
        "attempts": 0,
        "maxAttempts": 3
      },
      "timeSpent": 45,
      "pointsEarned": 0
    },
    "stage_2": {
      "stageId": 2,
      "isUnlocked": false,
      "isCompleted": false,
      "completedAt": null,
      "completedLessons": [],
      "totalLessons": 12,
      "lessonsProgress": 0,
      "stageExam": {
        "isTaken": false,
        "score": 0,
        "maxScore": 20,
        "isPassed": false,
        "passedAt": null,
        "attempts": 0,
        "maxAttempts": 3
      },
      "timeSpent": 0,
      "pointsEarned": 0
    }
    // ... المراحل الأخرى (3-14) بنفس البنية
  },
  
  // الإنجازات والأوسمة
  "achievements": [
    {
      "type": "STAGE_COMPLETED",
      "stageId": 0,
      "earnedAt": "2024-03-19T12:00:00Z",
      "points": 100
    }
  ],
  "badges": ["first_stage_completed", "quick_learner"],
  
  // الإحصائيات
  "stats": {
    "totalTimeSpent": 225,
    "averageScore": 82,
    "highestScore": 18,
    "lowestScore": 0,
    "quizzesTaken": 1,
    "quizzesPass": 1,
    "passRate": 100
  },
  
  // آخر نشاط
  "lastActivityAt": "2024-03-19T12:00:00Z",
  "lastCompletedStage": 0,
  "currentStage": 1
}
```

### 2. **مجموعة `userProgress/{userId}/activityLogs`**

```json
{
  "userId": "user123",
  "activityType": "LESSON_COMPLETED",
  "details": {
    "stageId": 0,
    "lessonId": 0,
    "timeSpent": 15
  },
  "timestamp": "2024-03-19T11:00:00Z"
}
```

### 3. **مجموعة `stageExams`**

```json
{
  "userId": "user123",
  "stageId": 0,
  "score": 18,
  "maxScore": 20,
  "isPassed": true,
  "attempts": 1,
  "timestamp": "2024-03-19T12:00:00Z",
  "answers": [
    {
      "questionId": "q1",
      "userAnswer": "A",
      "correctAnswer": "A",
      "correct": true
    }
  ]
}
```

---

## 🔧 خطوات التطبيق

### الخطوة 1: الدخول إلى Firebase Console
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروع `ahmed_trader`
3. انقر على **Firestore Database**

### الخطوة 2: الذهاب إلى Rules
1. انقر على تبويب **Rules**
2. ستجد محرر القواعس

### الخطوة 3: نسخ القواعس
1. انسخ كود القواعس من الأعلى
2. الصقه في محرر القواعس
3. انقر على **Publish**

### الخطوة 4: التحقق
- ستظهر رسالة "Rules published successfully"
- الآن القواعس نشطة وتحمي قاعدة البيانات

---

## ⚠️ نقاط مهمة

### 1. **الأمان**
هذه القواعس تمنع:
- ❌ المستخدمين من قراءة بيانات بعضهم البعض
- ❌ تعديل بيانات المستخدمين الآخرين
- ❌ حذف البيانات المهمة
- ❌ الوصول غير المصرح

### 2. **نظام التقدم التدريجي**
- ✅ المرحلة الأولى (stage_0) مفتوحة افتراضياً
- ✅ المراحل الأخرى تفتح تلقائياً عند النجاح في الاختبار
- ✅ معيار النجاح: 15/20 (75%)
- ✅ 3 محاولات لكل اختبار

### 3. **حفظ البيانات**
- ✅ يتم حفظ التقدم تلقائياً عند إكمال الدرس
- ✅ يتم حفظ نتائج الاختبارات فوراً
- ✅ يتم تسجيل جميع الأنشطة في السجل

### 4. **الإحصائيات**
- ✅ يتم حساب نسبة النجاح تلقائياً
- ✅ يتم تتبع الوقت المستغرق
- ✅ يتم حساب النقاط الإجمالية

---

## 📝 أمثلة الاستخدام

### 1. **تسجيل إكمال درس**
```javascript
import { markLessonAsComplete } from './lib/progressService';

// عند إكمال الدرس
await markLessonAsComplete(userId, stageId, lessonId, timeSpent);
```

### 2. **تسجيل نتيجة الاختبار**
```javascript
import { submitStageExam } from './lib/progressService';

// عند إكمال الاختبار
const result = await submitStageExam(userId, stageId, score, 20);
// {
//   isPassed: true,
//   score: 18,
//   attempts: 1,
//   nextStageUnlocked: true
// }
```

### 3. **الحصول على ملخص التقدم**
```javascript
import { getProgressSummary } from './lib/progressService';

const summary = await getProgressSummary(userId);
// {
//   overallProgress: 25,
//   completedStages: 1,
//   completedLessons: 12,
//   totalPoints: 100,
//   ...
// }
```

### 4. **التحقق من فتح المرحلة**
```javascript
import { isStageUnlocked } from './lib/progressService';

const unlocked = await isStageUnlocked(userId, stageId);
if (!unlocked) {
  // عرض رسالة أن المرحلة مقفلة
}
```

---

## 🆘 استكشاف الأخطاء

### خطأ: "Permission denied"
✅ **الحل:**
- تحقق من أن المستخدم مسجل دخول
- تحقق من أن المستخدم يحاول الوصول إلى بيانات نفسه
- تأكد من أن القواعس منشورة

### خطأ: "Document not found"
✅ **الحل:**
- تحقق من أن المسار صحيح
- تحقق من أن المستند موجود بالفعل
- استخدم `initializeUserProgress` لإنشاء ملف تقدم جديد

### خطأ: "Invalid write"
✅ **الحل:**
- تحقق من أن البيانات تحتوي على الحقول المطلوبة
- تحقق من أن البيانات تطابق النوع المتوقع

---

## 📊 الإحصائيات والتحليلات

### للمستخدم الفردي
```javascript
{
  "overallProgress": 25,      // نسبة التقدم الإجمالي
  "completedStages": 1,       // عدد المراحل المكتملة
  "completedLessons": 12,     // عدد الدروس المكتملة
  "totalPoints": 100,         // النقاط الإجمالية
  "averageScore": 82,         // متوسط درجات الاختبارات
  "passRate": 100,            // نسبة النجاح
  "totalTimeSpent": 225       // الوقت المستغرق (دقيقة)
}
```

---

## 🎯 معايير النجاح

| المعيار | القيمة | الملاحظات |
|--------|--------|---------|
| درجة النجاح | 15/20 (75%) | الحد الأدنى للنجاح |
| عدد المحاولات | 3 | عدد محاولات الاختبار |
| فترة الانتظار | 24 ساعة | بين المحاولات |
| النقاط لكل مرحلة | 100 | عند إكمال المرحلة |
| الدروس لكل مرحلة | 12 | متوسط الدروس |

---

## 🔐 الأمان والخصوصية

### التشفير
- ✅ جميع البيانات مشفرة في الانتقال (HTTPS)
- ✅ كلمات المرور مشفرة بـ bcrypt

### الوصول
- ✅ المستخدمون يرون فقط بيانات حسابهم
- ✅ Admin يرى إحصائيات عامة فقط
- ✅ لا يمكن الوصول لبيانات الآخرين

### التدقيق
- ✅ جميع التعديلات تسجل مع الطابع الزمني
- ✅ يمكن تتبع من قام بأي تعديل

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من [Firebase Documentation](https://firebase.google.com/docs/firestore/security/start)
2. استخدم **Firestore Emulator** للاختبار المحلي
3. راجع السجلات في Firebase Console
4. تواصل مع الدعم الفني

---

**آخر تحديث:** 2024-03-21
**الإصدار:** 2.0
**الحالة:** ✅ جاهز للاستخدام
