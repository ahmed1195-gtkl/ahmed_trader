/**
 * سكريبت لإضافة الكورس الكلاسيكي المجاني إلى Firebase
 * يتم تشغيله مرة واحدة لإضافة البيانات
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import coachMustafaImg from './src/assets/coach_mustafa.jpg';

// Firebase configuration (استخدم نفس الإعدادات من firebase.js)
const firebaseConfig = {
  // سيتم ملؤها من ملف .env
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const classicCourse = {
  id: 'classic-trading-course',
  nameAr: 'كورس التداول الكلاسيكي',
  nameEn: 'Classic Trading Course',
  nameFr: 'Cours de Trading Classique',
  descriptionAr: 'كورس شامل للمبتدئين يغطي أساسيات التداول والتحليل الفني والأساسي. تعلم من الكوتش مصطفى كيف تبدأ رحلتك في عالم التداول بثقة واحترافية.',
  descriptionEn: 'Comprehensive beginner course covering trading basics, technical and fundamental analysis. Learn from Coach Mustafa how to start your trading journey with confidence and professionalism.',
  descriptionFr: 'Cours complet pour débutants couvrant les bases du trading, l\'analyse technique et fondamentale. Apprenez du Coach Mustafa comment commencer votre parcours de trading avec confiance et professionnalisme.',
  type: 'free',
  imageUrl: coachMustafaImg,
  duration: '8 أسابيع / 8 Weeks / 8 Semaines',
  price: 0,
  enrolledCount: 0,
  features: {
    ar: [
      'محتوى شامل للمبتدئين',
      'دروس فيديو عالية الجودة',
      'تمارين عملية وتطبيقات',
      'شهادة إتمام مجانية',
      'دعم فني مستمر',
      'وصول مدى الحياة'
    ],
    en: [
      'Comprehensive beginner content',
      'High-quality video lessons',
      'Practical exercises and applications',
      'Free completion certificate',
      'Continuous technical support',
      'Lifetime access'
    ],
    fr: [
      'Contenu complet pour débutants',
      'Leçons vidéo de haute qualité',
      'Exercices pratiques et applications',
      'Certificat de fin gratuit',
      'Support technique continu',
      'Accès à vie'
    ]
  },
  curriculum: {
    ar: [
      'مقدمة في عالم التداول',
      'أساسيات التحليل الفني',
      'التحليل الأساسي',
      'إدارة المخاطر',
      'استراتيجيات التداول',
      'علم النفس التجاري',
      'منصات التداول',
      'التطبيق العملي'
    ],
    en: [
      'Introduction to Trading',
      'Technical Analysis Basics',
      'Fundamental Analysis',
      'Risk Management',
      'Trading Strategies',
      'Trading Psychology',
      'Trading Platforms',
      'Practical Application'
    ],
    fr: [
      'Introduction au Trading',
      'Bases de l\'Analyse Technique',
      'Analyse Fondamentale',
      'Gestion des Risques',
      'Stratégies de Trading',
      'Psychologie du Trading',
      'Plateformes de Trading',
      'Application Pratique'
    ]
  },
  instructor: {
    name: 'Coach Mustafa',
    nameAr: 'الكوتش مصطفى',
    nameFr: 'Coach Mustafa',
    bio: {
      ar: 'خبير تداول معتمد مع أكثر من 10 سنوات من الخبرة في الأسواق المالية',
      en: 'Certified trading expert with over 10 years of experience in financial markets',
      fr: 'Expert en trading certifié avec plus de 10 ans d\'expérience sur les marchés financiers'
    },
    image: coachMustafaImg
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  status: 'active',
  isClassic: true
};

async function addClassicCourse() {
  try {
    const courseRef = doc(db, 'courses', 'classic-trading-course');
    await setDoc(courseRef, classicCourse);
    console.log('✅ تم إضافة الكورس الكلاسيكي بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في إضافة الكورس:', error);
  }
}

// تشغيل السكريبت
addClassicCourse();
