# Firebase Security Rules للأكاديمية - ShukriTrade Academy

## قواعد Firestore الأمنية (Firestore Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========== المستخدمون ==========
    match /users/{userId} {
      // السماح للمستخدم بقراءة وتعديل بيانات حسابه فقط
      allow read, write: if request.auth.uid == userId;
      
      // مجموعة تقدم الدروس
      match /academyProgress/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
      
      // مجموعة نتائج الاختبارات
      match /quizResults/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
      
      // مجموعة الشهادات المكتسبة
      match /certificates/{document=**} {
        allow read: if request.auth.uid == userId;
      }
    }
    
    // ========== بيانات الأكاديمية العامة ==========
    match /academy/{document=**} {
      // السماح للجميع بقراءة بيانات الدروس والمحتوى
      allow read: if request.auth != null;
      // منع الكتابة من المستخدمين العاديين (Admin فقط)
      allow write: if request.auth.token.admin == true;
    }
    
    // ========== بيانات المدارس والدروس ==========
    match /academySchools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
      
      match /lessons/{lessonId} {
        allow read: if request.auth != null;
        allow write: if request.auth.token.admin == true;
      }
    }
    
    // ========== الاختبارات ==========
    match /academyQuizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // ========== نتائج الاختبارات للمستخدمين ==========
    match /userQuizResults/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /results/{resultId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // ========== تقدم الدروس ==========
    match /userLessonProgress/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /lessons/{lessonId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // ========== الشهادات ==========
    match /userCertificates/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.token.admin == true;
    }
    
    // ========== الإحصائيات العامة (للمسؤولين فقط) ==========
    match /academyStats/{document=**} {
      allow read: if request.auth.token.admin == true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## هيكل البيانات في Firestore

### 1. **مجموعة `users/{userId}/academyProgress`**
```json
{
  "userId": "user123",
  "currentStage": 0,
  "completedLessons": [1, 2, 3],
  "lockedLessons": [4, 5, 6, ...],
  "lastAccessedLesson": 3,
  "enrollmentDate": "2024-03-19T10:30:00Z",
  "totalProgressPercentage": 25,
  "stages": {
    "0": {
      "completed": true,
      "completionDate": "2024-03-19T12:00:00Z",
      "finalTestScore": 18,
      "passed": true
    },
    "1": {
      "completed": false,
      "completionDate": null,
      "finalTestScore": null,
      "passed": false
    }
  }
}
```

### 2. **مجموعة `users/{userId}/quizResults`**
```json
{
  "quizId": "stage0_final",
  "stageId": 0,
  "attemptNumber": 1,
  "score": 18,
  "totalQuestions": 20,
  "percentage": 90,
  "passed": true,
  "answers": [
    {
      "questionId": "q1",
      "userAnswer": "A",
      "correctAnswer": "A",
      "correct": true
    }
  ],
  "completedAt": "2024-03-19T12:00:00Z",
  "timeSpent": 1200  // بالثواني
}
```

### 3. **مجموعة `academy/stages`**
```json
{
  "stageId": 0,
  "name": "المرحلة 0: التهيئة الذهنية",
  "nameEn": "Stage 0: Mental Preparation",
  "description": "فهم سيكولوجية التداول والانضباط الذاتي",
  "descriptionEn": "Understanding trading psychology and self-discipline",
  "lessonsCount": 4,
  "estimatedHours": 3,
  "difficulty": "Beginner",
  "order": 0,
  "prerequisites": [],
  "unlockConditions": {
    "minScore": 15,
    "outOf": 20
  }
}
```

### 4. **مجموعة `academy/lessons`**
```json
{
  "lessonId": "stage0_lesson1",
  "stageId": 0,
  "title": "سيكولوجية التداول: لماذا يخسر 90%؟",
  "titleEn": "Trading Psychology: Why Do 90% Lose?",
  "content": "محتوى الدرس كاملاً...",
  "contentEn": "Lesson content in English...",
  "order": 1,
  "estimatedMinutes": 15,
  "diagramType": "psychology",
  "keyTakeaways": ["نقطة 1", "نقطة 2", "نقطة 3"],
  "quizQuestions": [
    {
      "questionId": "q1",
      "question": "ما الفرق بين القمار والتداول؟",
      "options": ["أ", "ب", "ج", "د"],
      "correctAnswer": "أ",
      "explanation": "الشرح..."
    }
  ]
}
```

### 5. **مجموعة `academy/quizzes`**
```json
{
  "quizId": "stage0_final",
  "stageId": 0,
  "type": "final",  // "lesson" أو "review" أو "final"
  "title": "الاختبار النهائي - المرحلة 0",
  "titleEn": "Final Test - Stage 0",
  "questions": [
    {
      "questionId": "q1",
      "question": "السؤال...",
      "options": ["أ", "ب", "ج", "د"],
      "correctAnswer": "أ",
      "explanation": "الشرح..."
    }
  ],
  "passingScore": 15,
  "totalQuestions": 20,
  "timeLimit": 3600,  // بالثواني
  "createdAt": "2024-03-19T10:00:00Z"
}
```

---

## قواعد إدارة التقدم

### 1. **فتح الدروس**
- الدرس الأول من كل مرحلة يكون **مفتوحاً افتراضياً**
- الدروس التالية تفتح تلقائياً عند إكمال الدرس السابق
- الاختبار النهائي يفتح بعد إكمال جميع الدروس

### 2. **معايير النجاح**
```javascript
// معيار النجاح في الاختبار
const passingScore = 15;  // من 20
const passingPercentage = 75;  // 75%

// إذا كانت النتيجة < 15/20
// → إعادة توجيه للمراجعة
// → إمكانية إعادة الاختبار بعد 24 ساعة
```

### 3. **حفظ التقدم تلقائياً**
```javascript
// يتم حفظ التقدم عند:
// 1. إكمال الدرس (عند الوصول للنهاية)
// 2. الإجابة على أسئلة الدرس
// 3. إكمال الاختبار
// 4. الحصول على شهادة
```

---

## عمليات Firestore الأساسية

### 1. **حفظ تقدم الدرس**
```javascript
await updateDoc(doc(db, `users/${userId}/academyProgress/lessons/${lessonId}`), {
  completed: true,
  completedAt: serverTimestamp(),
  timeSpent: duration
});
```

### 2. **حفظ نتيجة الاختبار**
```javascript
await addDoc(collection(db, `users/${userId}/quizResults`), {
  quizId: quizId,
  stageId: stageId,
  score: score,
  totalQuestions: 20,
  percentage: (score / 20) * 100,
  passed: score >= 15,
  completedAt: serverTimestamp(),
  timeSpent: duration
});
```

### 3. **فتح الدرس التالي**
```javascript
if (currentLesson.completed && nextLesson) {
  await updateDoc(doc(db, `users/${userId}/academyProgress/lessons/${nextLessonId}`), {
    locked: false,
    unlockedAt: serverTimestamp()
  });
}
```

### 4. **الحصول على تقدم المستخدم**
```javascript
const progressDoc = await getDoc(doc(db, `users/${userId}/academyProgress/overview`));
const progress = progressDoc.data();
// {
//   currentStage: 0,
//   completedLessons: [1, 2, 3],
//   totalProgressPercentage: 25
// }
```

---

## الشهادات والإنجازات

### 1. **شهادة إكمال المرحلة**
```json
{
  "certificateId": "cert_stage0_user123",
  "userId": "user123",
  "stageId": 0,
  "stageName": "المرحلة 0: التهيئة الذهنية",
  "issuedDate": "2024-03-19T12:00:00Z",
  "finalScore": 18,
  "certificateURL": "https://shukritrade.com/certificates/cert_stage0_user123.pdf"
}
```

### 2. **شهادة إكمال الأكاديمية**
```json
{
  "certificateId": "cert_academy_user123",
  "userId": "user123",
  "completionDate": "2024-06-19T12:00:00Z",
  "totalLessonsCompleted": 178,
  "averageScore": 87,
  "certificateURL": "https://shukritrade.com/certificates/cert_academy_user123.pdf"
}
```

---

## الإحصائيات والتحليلات

### 1. **إحصائيات المستخدم الشخصية**
```json
{
  "userId": "user123",
  "totalLessonsCompleted": 12,
  "totalLessonsAttempted": 15,
  "averageQuizScore": 82,
  "totalTimeSpent": 3600,  // بالثواني
  "lastActivityDate": "2024-03-19T12:00:00Z",
  "certificatesEarned": 1
}
```

### 2. **إحصائيات عامة (للمسؤولين)**
```json
{
  "totalUsers": 1250,
  "totalEnrolled": 850,
  "completionRate": 0.34,  // 34%
  "averageScore": 76,
  "mostPopularStage": 0,
  "lastUpdated": "2024-03-19T12:00:00Z"
}
```

---

## الأمان والخصوصية

### 1. **التشفير**
- جميع البيانات الحساسة مشفرة في الانتقال (HTTPS)
- كلمات المرور مشفرة بـ bcrypt

### 2. **الوصول**
- المستخدمون يرون فقط بيانات حسابهم
- المسؤولون يرون إحصائيات عامة فقط
- لا يمكن الوصول لبيانات المستخدمين الآخرين

### 3. **التدقيق**
- جميع التعديلات تسجل مع الطابع الزمني
- يمكن تتبع من قام بأي تعديل

---

## ملاحظات مهمة

1. **قاعدة البيانات:** استخدم Firestore (NoSQL) لأنها أسرع وأكثر مرونة
2. **المصادقة:** استخدم Firebase Authentication مع Email/Password و Google Sign-In
3. **التخزين:** استخدم Firebase Storage للشهادات والملفات
4. **الأداء:** استخدم Firestore Indexes لتسريع الاستعلامات
5. **النسخ الاحتياطي:** قم بنسخ احتياطية يومية للبيانات

---

## أمثلة الاستخدام في React

### حفظ تقدم الدرس
```javascript
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

const completeLesson = async (lessonId, timeSpent) => {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    await updateDoc(doc(db, `users/${user.uid}/academyProgress/lessons/${lessonId}`), {
      completed: true,
      completedAt: serverTimestamp(),
      timeSpent: timeSpent
    });
    console.log('تم حفظ التقدم بنجاح');
  } catch (error) {
    console.error('خطأ في حفظ التقدم:', error);
  }
};
```

### الحصول على تقدم المستخدم
```javascript
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';

const getUserProgress = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const progressDoc = await getDoc(doc(db, `users/${user.uid}/academyProgress/overview`));
    return progressDoc.data();
  } catch (error) {
    console.error('خطأ في الحصول على التقدم:', error);
    return null;
  }
};
```

---

**تم إنشاء هذه القواعد بناءً على أفضل الممارسات الأمنية والأداء في Firebase.**
