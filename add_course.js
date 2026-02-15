const admin = require('firebase-admin');

// هذا السكربت يفترض وجود إعدادات Firebase في البيئة
// في Manus، سنحاول استخدام الإعدادات الافتراضية
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} catch (e) {
  console.log("Firebase Admin already initialized or error:", e.message);
}

const db = admin.firestore();

async function addClassicCourse() {
  const courseData = {
    nameAr: "الدورة الكلاسيك",
    nameEn: "Classic Course",
    descriptionAr: "دورة شاملة في أساسيات التداول الكلاسيكي، تغطي التحليل الفني وإدارة المخاطر.",
    descriptionEn: "A comprehensive course in classic trading basics, covering technical analysis and risk management.",
    type: "free",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/ahmed-trader-123.appspot.com/o/coach_mustafa.jpg?alt=media", // رابط افتراضي أو صورة الكوتش
    duration: "4 weeks",
    sheetUrl: "https://script.google.com/macros/s/AKfycbzU7giZJy_k4nWfvkU1k3qrA8TjRoWFmk23q6dHsbDfZ8WabiBvArtl4tIQAwtvdAPPqQ/exec",
    telegramUrl: "https://t.me/+CADMeIVdMDQ2Nzg0",
    whatsappUrl: "",
    instagramUrl: "",
    telegramUrl: "https://t.me/+CADMeIVdMDQ2Nzg0",
    emailUrl: "",
    features: [
      { ar: "مجاني بالكامل", en: "Completely Free" },
      { ar: "دعم فني مستمر", en: "Continuous Support" },
      { ar: "تطبيقات عملية", en: "Practical Applications" }
    ],
    enrolledCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('courses').doc('classic_course').set(courseData);
    console.log("✅ Classic Course added successfully!");
  } catch (error) {
    console.error("❌ Error adding course:", error);
  }
}

addClassicCourse();
