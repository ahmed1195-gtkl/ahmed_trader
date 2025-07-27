import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Header
      "language": "Language",

      // Hero Section
      "hero.title": "Master Trading with Our Free Course",
      "hero.description": "Learn how to dominate the Forex market with our training, designed for beginners and future pros using SK, ICT, and SMC strategies.",
      "hero.cta": "Join Now for Free",

      // Benefits Section
      "benefits.title": "Why Choose Our Course?",
      "benefits.point1": "Understand Forex in simple terms",
      "benefits.point2": "Learn SK, ICT, and SMC trading strategies",
      "benefits.point3": "Community support and updates",

      // Coach Section
      "coach.title": "Meet Coach Mustafa",
      "coach.description": "Coach Mustafa is a trading expert with over 10 years of experience in the Forex market. He has helped thousands of students succeed using SK, ICT, and SMC strategies.",
      "coach.learnMore": "Learn More About Coach",

      // Brokers Section
      "brokers.title": "Recommended Brokers",
      "brokers.subtitle": "Start trading with our trusted partners",
      "brokers.register": "Register Now",
      "brokers.details": "View Details",

      // Footer
      "footer.rights": "All rights reserved",
      "footer.team": "Powered by our expert team"
    }
  },
  ar: {
    translation: {
      // Header
      "language": "اللغة",

      // Hero Section
      "hero.title": "أتقن التداول مع كورس مجاني",
      "hero.description": "تعلم السيطرة على سوق الفوركس من خلال تدريب مناسب للمبتدئين والمحترفين باستخدام استراتيجيات SMC و SK و ICT.",
      "hero.cta": "سجّل الآن مجانًا",

      // Benefits Section
      "benefits.title": "لماذا تختار كورسنا؟",
      "benefits.point1": "فهم سوق الفوركس ببساطة",
      "benefits.point2": "تعلم استراتيجيات SMC و SK و ICT",
      "benefits.point3": "دعم مجتمعي وتحديثات مستمرة",

      // Coach Section
      "coach.title": "تعرف على الكوتش مصطفى",
      "coach.description": "الكوتش مصطفى هو خبير تداول ذو خبرة تفوق 10 سنوات في سوق الفوركس. ساعد آلاف الطلاب على النجاح باستخدام استراتيجيات SMC و SK و ICT.",
      "coach.learnMore": "تعرف أكثر على الكوتش",

      // Brokers Section
      "brokers.title": "البروكرات الموصى بها",
      "brokers.subtitle": "ابدأ التداول مع شركائنا الموثوقين",
      "brokers.register": "سجل الآن",
      "brokers.details": "عرض التفاصيل",

      // Footer
      "footer.rights": "جميع الحقوق محفوظة",
      "footer.team": "مدعوم من فريقنا الخبير"
    }
  },
  fr: {
    translation: {
      // Header
      "language": "Langue",

      // Hero Section
      "hero.title": "Maîtrisez le trading avec notre cours gratuit",
      "hero.description": "Apprenez à dominer le marché du Forex grâce à une formation conçue pour les débutants et les futurs pros avec les stratégies SK, ICT et SMC.",
      "hero.cta": "Rejoignez-nous gratuitement",

      // Benefits Section
      "benefits.title": "Pourquoi choisir notre cours?",
      "benefits.point1": "Comprendre le Forex simplement",
      "benefits.point2": "Apprenez les stratégies SK, ICT et SMC",
      "benefits.point3": "Support communautaire et mises à jour",

      // Coach Section
      "coach.title": "Rencontrez le Coach Mustafa",
      "coach.description": "Le coach Mustafa est un expert en trading avec plus de 10 ans d'expérience dans le marché du Forex. Il a aidé des milliers d'étudiants à réussir grâce aux stratégies SK, ICT et SMC.",
      "coach.learnMore": "En savoir plus sur le Coach",

      // Brokers Section
      "brokers.title": "Courtiers Recommandés",
      "brokers.subtitle": "Commencez à trader avec nos partenaires de confiance",
      "brokers.register": "S'inscrire maintenant",
      "brokers.details": "Voir les détails",

      // Footer
      "footer.rights": "Tous droits réservés",
      "footer.team": "Propulsé par notre équipe d'experts"
    }
  }
};
i18n
  .use(LanguageDetector)            // يكتشف لغة المستخدم
  .use(initReactI18next)            // يربط i18next مع React
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

