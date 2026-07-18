// set-admin.js — شغّله مرة واحدة لكل مستخدم أدمن
import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// قم بتنزيل ملف المفتاح الخاص بك من إعدادات Firebase وتسميته باسم service-account.json في هذا المجلد
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// المعرف الخاص بك الذي تم تعيينه تلقائياً
const adminUid = '5aildTghkdSExbwJ7QbYDDjdS9i2';

await admin.auth().setCustomUserClaims(adminUid, { isAdmin: true });
console.log('✅ isAdmin claim set for:', adminUid);
process.exit(0);
