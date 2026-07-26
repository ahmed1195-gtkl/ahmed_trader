import React, { useState } from 'react';
import Header from './Header';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Table, Code, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const SheetsGuide = () => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const APP_SCRIPT_CODE = `function doPost(e) {
  try {
    // الحصول على البيانات من الطلب
    var data = JSON.parse(e.postData.contents);
    
    // فتح الشيت
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // إنشاء كود تسجيل فريد
    var registrationCode = 'REG-' + new Date().getTime();
    
    // إضافة صف جديد بالبيانات
    sheet.appendRow([
      new Date(),                    // 1. Timestamp
      data.name || '',               // 2. Name
      data.email || '',              // 3. Email
      data.phone || '',              // 4. Phone
      data.age || '',                // 5. Age
      data.country || '',            // 6. Country
      data.city || '',               // 7. City
      data.job || '',                // 8. Job
      data.annualIncome || '',       // 9. Annual Income
      data.hasExperience || '',      // 10. Has Experience
      data.experienceYears || '',    // 11. Experience Years
      data.totalLosses || '',        // 12. Total Losses
      data.expectedDeposit || '',    // 13. Expected Deposit
      data.accountType || '',        // 14. Account Type
      data.broker || '',             // 15. Broker
      data.monthlyTrades || '',      // 16. Monthly Trades
      data.tradingStyle || '',       // 17. Trading Style
      data.availability || '',       // 18. Availability
      data.availabilityDetails || '',// 19. Availability Details
      data.level || '',              // 20. Level
      data.learningGoal || '',       // 21. Learning Goal
      data.courseId || '',           // 22. Course ID
      data.courseName || '',         // 23. Course Name
      registrationCode               // 24. Registration Code
    ]);
    
    // إرجاع كود التسجيل
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        registrationCode: registrationCode
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(APP_SCRIPT_CODE);
    setCopied(true);
    toast.success(i18n.language === 'ar' ? 'تم نسخ الكود!' : 'Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const columns = [
    { num: 1, name: 'Timestamp', ar: 'التاريخ والوقت', example: '2024-01-15 10:30:00' },
    { num: 2, name: 'Name', ar: 'الاسم', example: 'أحمد محمد' },
    { num: 3, name: 'Email', ar: 'البريد الإلكتروني', example: 'ahmed@example.com' },
    { num: 4, name: 'Phone', ar: 'الهاتف', example: '+966501234567' },
    { num: 5, name: 'Age', ar: 'العمر', example: '28' },
    { num: 6, name: 'Country', ar: 'الدولة', example: 'السعودية' },
    { num: 7, name: 'City', ar: 'المدينة', example: 'الرياض' },
    { num: 8, name: 'Job', ar: 'الوظيفة', example: 'مهندس' },
    { num: 9, name: 'Annual Income', ar: 'الدخل السنوي', example: '100000' },
    { num: 10, name: 'Has Experience', ar: 'لديه خبرة', example: 'نعم' },
    { num: 11, name: 'Experience Years', ar: 'سنوات الخبرة', example: '3' },
    { num: 12, name: 'Total Losses', ar: 'إجمالي الخسائر', example: '5000' },
    { num: 13, name: 'Expected Deposit', ar: 'الإيداع المتوقع', example: '10000' },
    { num: 14, name: 'Account Type', ar: 'نوع الحساب', example: 'حقيقي' },
    { num: 15, name: 'Broker', ar: 'الوسيط', example: 'XM' },
    { num: 16, name: 'Monthly Trades', ar: 'الصفقات الشهرية', example: '20' },
    { num: 17, name: 'Trading Style', ar: 'أسلوب التداول', example: 'Day Trading' },
    { num: 18, name: 'Availability', ar: 'التفرغ', example: 'بدوام كامل' },
    { num: 19, name: 'Availability Details', ar: 'تفاصيل التفرغ', example: 'متفرغ 8 ساعات يومياً' },
    { num: 20, name: 'Level', ar: 'المستوى', example: 'متوسط' },
    { num: 21, name: 'Learning Goal', ar: 'الهدف من التعلم', example: 'تحقيق دخل إضافي' },
    { num: 22, name: 'Course ID', ar: 'معرف الكورس', example: 'classic-trading-course' },
    { num: 23, name: 'Course Name', ar: 'اسم الكورس', example: 'كورس التداول الكلاسيكي' },
    { num: 24, name: 'Registration Code', ar: 'كود التسجيل', example: 'REG-1705315800000' }
  ];

  return (
    <>
      <Header />
      <section className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileSpreadsheet className="w-12 h-12 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">
              {i18n.language === 'ar' ? 'دليل Google Sheets' : 'Google Sheets Guide'}
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {i18n.language === 'ar' 
              ? 'كيفية إعداد Google Sheet لاستقبال بيانات تسجيل الكورسات'
              : 'How to set up Google Sheet to receive course registration data'}
          </p>
        </motion.div>

        {/* Step 1: إنشاء Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xl">
              1
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase">
              {i18n.language === 'ar' ? 'إنشاء Google Sheet' : 'Create Google Sheet'}
            </h2>
          </div>
          <div className="space-y-4 text-zinc-300">
            <p>
              {i18n.language === 'ar' 
                ? '1. افتح Google Sheets وأنشئ شيت جديد'
                : '1. Open Google Sheets and create a new sheet'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '2. سمّه مثلاً: "تسجيلات الكورسات"'
                : '2. Name it, for example: "Course Registrations"'}
            </p>
            <Button
              onClick={() => window.open('https://sheets.google.com', '_blank')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {i18n.language === 'ar' ? 'افتح Google Sheets' : 'Open Google Sheets'}
            </Button>
          </div>
        </motion.div>

        {/* Step 2: ترتيب الأعمدة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xl">
              2
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase flex items-center gap-2">
              <Table className="w-6 h-6" />
              {i18n.language === 'ar' ? 'ترتيب الأعمدة (24 عمود)' : 'Column Layout (24 columns)'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-amber-500 font-bold">#</th>
                  <th className="text-left p-3 text-amber-500 font-bold">
                    {i18n.language === 'ar' ? 'اسم العمود (EN)' : 'Column Name (EN)'}
                  </th>
                  <th className="text-left p-3 text-amber-500 font-bold">
                    {i18n.language === 'ar' ? 'اسم العمود (AR)' : 'Column Name (AR)'}
                  </th>
                  <th className="text-left p-3 text-amber-500 font-bold">
                    {i18n.language === 'ar' ? 'مثال' : 'Example'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col) => (
                  <tr key={col.num} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-zinc-400 font-mono">{col.num}</td>
                    <td className="p-3 text-white font-medium">{col.name}</td>
                    <td className="p-3 text-zinc-300">{col.ar}</td>
                    <td className="p-3 text-zinc-400 text-xs font-mono">{col.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-500 text-sm">
              ⚠️ {i18n.language === 'ar' 
                ? 'مهم: يجب أن تكون الأعمدة بنفس الترتيب أعلاه تماماً'
                : 'Important: Columns must be in the exact order shown above'}
            </p>
          </div>
        </motion.div>

        {/* Step 3: نسخ كود Apps Script */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xl">
              3
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase flex items-center gap-2">
              <Code className="w-6 h-6" />
              {i18n.language === 'ar' ? 'نسخ كود Apps Script' : 'Copy Apps Script Code'}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <pre className="bg-black border border-white/10 rounded-xl p-6 overflow-x-auto text-xs text-green-400 font-mono max-h-96">
                {APP_SCRIPT_CODE}
              </pre>
              <Button
                onClick={copyCode}
                className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {i18n.language === 'ar' ? 'تم النسخ!' : 'Copied!'}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    {i18n.language === 'ar' ? 'نسخ الكود' : 'Copy Code'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Step 4: إضافة الكود */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xl">
              4
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase">
              {i18n.language === 'ar' ? 'إضافة الكود في Apps Script' : 'Add Code to Apps Script'}
            </h2>
          </div>
          <div className="space-y-4 text-zinc-300">
            <p>
              {i18n.language === 'ar' 
                ? '1. في Google Sheet، اذهب إلى: Extensions → Apps Script'
                : '1. In Google Sheet, go to: Extensions → Apps Script'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '2. احذف الكود الموجود والصق الكود المنسوخ'
                : '2. Delete existing code and paste the copied code'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '3. احفظ المشروع (Ctrl+S أو Cmd+S)'
                : '3. Save the project (Ctrl+S or Cmd+S)'}
            </p>
          </div>
        </motion.div>

        {/* Step 5: نشر Web App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xl">
              5
            </div>
            <h2 className="text-2xl font-black text-foreground uppercase">
              {i18n.language === 'ar' ? 'نشر Web App' : 'Deploy Web App'}
            </h2>
          </div>
          <div className="space-y-4 text-zinc-300">
            <p>
              {i18n.language === 'ar' 
                ? '1. اضغط على "Deploy" → "New deployment"'
                : '1. Click "Deploy" → "New deployment"'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '2. اختر نوع: Web app'
                : '2. Select type: Web app'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '3. Execute as: Me'
                : '3. Execute as: Me'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '4. Who has access: Anyone'
                : '4. Who has access: Anyone'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '5. اضغط "Deploy" وانسخ رابط Web App'
                : '5. Click "Deploy" and copy the Web App URL'}
            </p>
            <p>
              {i18n.language === 'ar' 
                ? '6. ضع الرابط في حقل "Sheet URL" عند إضافة الكورس'
                : '6. Paste the URL in "Sheet URL" field when adding a course'}
            </p>
          </div>
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-green-500 text-sm">
              ✅ {i18n.language === 'ar' 
                ? 'الآن أصبح الشيت جاهزاً لاستقبال بيانات التسجيل تلقائياً!'
                : 'Now the sheet is ready to receive registration data automatically!'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default SheetsGuide;
