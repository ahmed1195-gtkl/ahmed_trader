# إضافة الكورس الكلاسيكي المجاني

## 📋 الملخص

تم إنشاء بيانات كورس كلاسيكي مجاني يحتوي على:
- ✅ صورة الكوتش مصطفى من الصفحة الرئيسية
- ✅ محتوى شامل باللغات الثلاث (عربي، إنجليزي، فرنسي)
- ✅ مجاني 100%
- ✅ منهج دراسي كامل من 8 وحدات
- ✅ معلومات المدرب

---

## 🎯 طريقة الإضافة

### الطريقة 1: عبر Firebase Console (الأسهل)

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. انتقل إلى **Firestore Database**
4. اضغط على **Start collection**
5. اسم المجموعة: `courses`
6. Document ID: `classic-trading-course`
7. انسخ البيانات من ملف `classic_course_data.json`
8. الصق البيانات واضغط **Save**

### الطريقة 2: عبر Admin Panel (إذا كان متوفراً)

1. سجّل الدخول كـ Admin
2. انتقل إلى صفحة إدارة الكورسات
3. اضغط على "إضافة كورس جديد"
4. املأ البيانات التالية:

**المعلومات الأساسية:**
- الاسم بالعربي: `كورس التداول الكلاسيكي`
- الاسم بالإنجليزي: `Classic Trading Course`
- الاسم بالفرنسي: `Cours de Trading Classique`
- النوع: `مجاني / Free`
- السعر: `0`
- المدة: `8 أسابيع / 8 Weeks / 8 Semaines`

**الوصف:**

**عربي:**
```
كورس شامل للمبتدئين يغطي أساسيات التداول والتحليل الفني والأساسي. تعلم من الكوتش مصطفى كيف تبدأ رحلتك في عالم التداول بثقة واحترافية.
```

**English:**
```
Comprehensive beginner course covering trading basics, technical and fundamental analysis. Learn from Coach Mustafa how to start your trading journey with confidence and professionalism.
```

**Français:**
```
Cours complet pour débutants couvrant les bases du trading, l'analyse technique et fondamentale. Apprenez du Coach Mustafa comment commencer votre parcours de trading avec confiance et professionnalisme.
```

**الصورة:**
- ارفع صورة الكوتش مصطفى من: `src/assets/coach_mustafa.jpg`

**المميزات (Features):**

**عربي:**
- محتوى شامل للمبتدئين
- دروس فيديو عالية الجودة
- تمارين عملية وتطبيقات
- شهادة إتمام مجانية
- دعم فني مستمر
- وصول مدى الحياة

**English:**
- Comprehensive beginner content
- High-quality video lessons
- Practical exercises and applications
- Free completion certificate
- Continuous technical support
- Lifetime access

**Français:**
- Contenu complet pour débutants
- Leçons vidéo de haute qualité
- Exercices pratiques et applications
- Certificat de fin gratuit
- Support technique continu
- Accès à vie

**المنهج الدراسي (Curriculum):**

**عربي:**
1. مقدمة في عالم التداول
2. أساسيات التحليل الفني
3. التحليل الأساسي
4. إدارة المخاطر
5. استراتيجيات التداول
6. علم النفس التجاري
7. منصات التداول
8. التطبيق العملي

**English:**
1. Introduction to Trading
2. Technical Analysis Basics
3. Fundamental Analysis
4. Risk Management
5. Trading Strategies
6. Trading Psychology
7. Trading Platforms
8. Practical Application

**Français:**
1. Introduction au Trading
2. Bases de l'Analyse Technique
3. Analyse Fondamentale
4. Gestion des Risques
5. Stratégies de Trading
6. Psychologie du Trading
7. Plateformes de Trading
8. Application Pratique

**معلومات المدرب:**
- الاسم: `Coach Mustafa / الكوتش مصطفى`
- السيرة الذاتية (عربي): `خبير تداول معتمد مع أكثر من 10 سنوات من الخبرة في الأسواق المالية`
- السيرة الذاتية (English): `Certified trading expert with over 10 years of experience in financial markets`
- السيرة الذاتية (Français): `Expert en trading certifié avec plus de 10 ans d'expérience sur les marchés financiers`
- الصورة: نفس صورة الكورس

---

## 📦 الملفات المرفقة

1. **classic_course_data.json** - بيانات الكورس بصيغة JSON
2. **add_classic_course.js** - سكريبت لإضافة الكورس تلقائياً (يحتاج إعداد Firebase)

---

## 🎨 التصميم

الكورس سيظهر في صفحة الكورسات مع:
- ✅ صورة الكوتش مصطفى
- ✅ شارة "مجاني / Free" باللون الأخضر
- ✅ أيقونة هدية (Gift icon)
- ✅ تصميم متناسق مع باقي الكورسات

---

## 🔗 الربط بصفحة التسجيل

عند الضغط على الكورس، سيتم توجيه المستخدم إلى:
- صفحة التسجيل القديمة (`CourseRegistration.backup.jsx`)
- أو صفحة تفاصيل الكورس الجديدة

---

## ✅ التحقق

بعد الإضافة، تحقق من:
1. ظهور الكورس في صفحة `/courses`
2. صورة الكوتش تظهر بشكل صحيح
3. شارة "مجاني" باللون الأخضر
4. جميع النصوص بالعربي والإنجليزي والفرنسي صحيحة
5. زر التسجيل يعمل

---

## 📝 ملاحظات

- الكورس **مجاني 100%**
- يمكن للجميع التسجيل بدون دفع
- صورة الكوتش مصطفى من الصفحة الرئيسية
- المحتوى شامل للمبتدئين
- يتضمن شهادة إتمام مجانية

---

## 🆘 في حالة وجود مشاكل

إذا لم يظهر الكورس:
1. تحقق من Firebase Console أن البيانات موجودة
2. تحقق من أن Document ID هو `classic-trading-course`
3. تحقق من أن حقل `status` = `active`
4. تحقق من أن حقل `type` = `free`
5. أعد تحميل الصفحة (Ctrl+F5)

---

**الكورس جاهز للإضافة! 🎉**
