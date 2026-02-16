# دليل ربط نشر الكورسات مع Google Sheets

## 📋 ترتيب الأعمدة في Google Sheets

يجب أن يكون ترتيب الأعمدة في Google Sheet كالتالي:

| # | اسم العمود | الوصف |
|---|-----------|-------|
| 1 | Timestamp | وقت التسجيل التلقائي |
| 2 | Name | الاسم الكامل |
| 3 | Email | البريد الإلكتروني |
| 4 | Phone | رقم الهاتف (كود الدولة + الرقم) |
| 5 | Age | العمر |
| 6 | Country | الدولة |
| 7 | City | المدينة |
| 8 | Job | الوظيفة الحالية |
| 9 | Annual Income | الدخل السنوي التقريبي |
| 10 | Has Experience | هل لديك خبرة في التداول؟ (Yes/No) |
| 11 | Experience Years | سنوات الخبرة (إن وجدت) |
| 12 | Total Losses | إجمالي الخسائر التقريبية |
| 13 | Expected Deposit | مبلغ الإيداع المتوقع |
| 14 | Account Type | نوع الحساب (Demo/Real) |
| 15 | Broker | شركة الوساطة (البروكر) |
| 16 | Monthly Trades | عدد الصفقات الشهرية |
| 17 | Trading Style | أسلوب التداول |
| 18 | Availability | التفرغ للتداول |
| 19 | Availability Details | تفاصيل التفرغ |
| 20 | Level | المستوى الحالي |
| 21 | Learning Goal | الهدف من التعلم |
| 22 | Course ID | معرف الكورس |
| 23 | Course Name | اسم الكورس |
| 24 | Registration Code | كود التسجيل |

---

## 🔧 كود Google Apps Script

### الخطوة 1: إنشاء Google Sheet

1. افتح [Google Sheets](https://sheets.google.com)
2. أنشئ Sheet جديد
3. سمّه "Course Registrations"
4. أضف الأعمدة بالترتيب أعلاه في الصف الأول

### الخطوة 2: إضافة Apps Script

1. في Google Sheet، اذهب إلى **Extensions** → **Apps Script**
2. احذف الكود الافتراضي
3. انسخ والصق الكود التالي:

\`\`\`javascript
function doPost(e) {
  try {
    // الحصول على Sheet النشط
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // تحليل البيانات المستلمة
    const data = JSON.parse(e.postData.contents);
    
    // إضافة صف جديد مع البيانات
    sheet.appendRow([
      new Date(), // Timestamp
      data.name || '',
      data.email || '',
      data.phone || '',
      data.age || '',
      data.country || '',
      data.city || '',
      data.job || '',
      data.annualIncome || '',
      data.hasExperience || '',
      data.experienceYears || '',
      data.losses || '',
      data.deposit || '',
      data.accountType || '',
      data.broker || '',
      data.monthlyTrades || '',
      data.tradingStyle || '',
      data.availability || '',
      data.availabilityDetails || '',
      data.level || '',
      data.learning_goal || '',
      data.courseId || '',
      data.courseName || '',
      data.registrationCode || ''
    ]);
    
    // إرجاع استجابة نجاح
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration saved successfully',
        code: data.registrationCode
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // إرجاع استجابة خطأ
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Course Registration API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
\`\`\`

### الخطوة 3: نشر Apps Script

1. اضغط على **Deploy** → **New deployment**
2. اختر **Web app**
3. في **Execute as**: اختر **Me**
4. في **Who has access**: اختر **Anyone**
5. اضغط **Deploy**
6. انسخ **Web app URL** (سيكون بهذا الشكل: `https://script.google.com/macros/s/...`)

### الخطوة 4: إضافة الرابط في الموقع

أضف الرابط في ملف `.env`:

\`\`\`
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
\`\`\`

---

## 📤 كيفية إرسال البيانات من الموقع

### في ملف CourseRegistration.jsx:

\`\`\`javascript
const submitToGoogleSheets = async (formData, courseData, registrationCode) => {
  try {
    const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;
    
    const response = await fetch(sheetsUrl, {
      method: 'POST',
      mode: 'no-cors', // مهم لـ Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        courseId: courseData.id,
        courseName: courseData.nameAr || courseData.nameEn,
        registrationCode: registrationCode
      })
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return false;
  }
};
\`\`\`

---

## 🎨 واجهة المستخدم

### زر نسخ كود App Script

في صفحة إدارة الكورسات (Admin):

\`\`\`jsx
<div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-8">
  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
    <Code className="w-5 h-5 text-yellow-500" />
    Google Sheets Integration
  </h3>
  
  <p className="text-gray-400 text-sm mb-4">
    انسخ الكود التالي والصقه في Google Apps Script
  </p>
  
  <div className="relative">
    <pre className="bg-black/50 border border-white/5 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto max-h-96">
      <code>{APPS_SCRIPT_CODE}</code>
    </pre>
    
    <button
      onClick={() => {
        navigator.clipboard.writeText(APPS_SCRIPT_CODE);
        alert('تم نسخ الكود!');
      }}
      className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
    >
      <Copy className="w-4 h-4" />
      نسخ الكود
    </button>
  </div>
  
  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
    <p className="text-blue-400 text-sm">
      <strong>ملاحظة:</strong> بعد نسخ الكود، اتبع الخطوات في الدليل لنشر Web App والحصول على الرابط.
    </p>
  </div>
</div>
\`\`\`

---

## ✅ اختبار التكامل

### 1. اختبار يدوي

استخدم Postman أو cURL:

\`\`\`bash
curl -X POST "YOUR_WEB_APP_URL" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "age": "25",
    "country": "Egypt",
    "city": "Cairo"
  }'
\`\`\`

### 2. اختبار من الموقع

1. افتح صفحة التسجيل في الكورس
2. املأ النموذج
3. اضغط تسجيل
4. تحقق من Google Sheet - يجب أن يظهر صف جديد

---

## 🔐 الأمان

### ملاحظات مهمة:

1. **لا تشارك Web App URL علناً** - احفظه في `.env`
2. **استخدم HTTPS فقط**
3. **تحقق من البيانات** قبل الإرسال
4. **لا تخزن معلومات حساسة** في Google Sheets

---

## 📊 تحليل البيانات

بعد جمع البيانات في Google Sheets، يمكنك:

1. **إنشاء Charts** لتحليل التسجيلات
2. **تصدير إلى Excel** للتحليل المتقدم
3. **استخدام Google Data Studio** للتقارير
4. **إنشاء Pivot Tables** لتلخيص البيانات

---

## 🆘 استكشاف الأخطاء

### المشكلة: لا تصل البيانات إلى Sheet

**الحلول:**
1. تأكد من أن Web App منشور بشكل صحيح
2. تحقق من أن "Who has access" مضبوط على "Anyone"
3. تأكد من أن الرابط صحيح في `.env`
4. تحقق من console في المتصفح للأخطاء

### المشكلة: CORS Error

**الحل:**
استخدم `mode: 'no-cors'` في fetch request

### المشكلة: البيانات غير مرتبة

**الحل:**
تأكد من أن ترتيب الأعمدة في Sheet يطابق ترتيب البيانات في `appendRow()`

---

**جاهز للاستخدام! 🎉**
