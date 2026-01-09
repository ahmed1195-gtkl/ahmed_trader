import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Header
      "language": "Language",
      "nav.home": "Home",
      "nav.login": "Login",

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

      // Auth
      "auth.login": "Login",
      "auth.signup": "Sign Up",
      "auth.email": "Email Address",
      "auth.password": "Password",
      "auth.fullName": "Full Name",
      "auth.phone": "Phone Number",
      "auth.country": "Country",
      "auth.google": "Continue with Google",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",
      "auth.welcome": "Welcome Back",
      "auth.createAccount": "Create Your Account",
      "auth.error": "Authentication Error",
      "auth.verifyEmail": "Please verify your email. A verification link has been sent.",
      "auth.weakPassword": "Password must be at least 8 characters long and include numbers and symbols.",
      "auth.invalidEmail": "Please enter a valid email address.",
      "auth.emailInUse": "This email is already in use.",
      "auth.wrongPassword": "Incorrect password.",
      "auth.userNotFound": "No user found with this email.",
      "auth.tooManyRequests": "Too many attempts. Please try again later.",
      "auth.networkError": "Network error. Please check your connection.",

      // Footer
      "footer.rights": "All rights reserved",
      "footer.team": "Powered by our expert team"
    }
  },
  ar: {
    translation: {
      // Header
      "language": "اللغة",
      "nav.home": "الرئيسية",
      "nav.login": "تسجيل الدخول",

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

      // Auth
      "auth.login": "تسجيل الدخول",
      "auth.signup": "إنشاء حساب",
      "auth.email": "البريد الإلكتروني",
      "auth.password": "كلمة المرور",
      "auth.fullName": "الاسم الكامل",
      "auth.phone": "رقم الهاتف",
      "auth.country": "البلد",
      "auth.google": "المتابعة باستخدام جوجل",
      "auth.noAccount": "ليس لديك حساب؟",
      "auth.hasAccount": "لديك حساب بالفعل؟",
      "auth.welcome": "مرحباً بعودتك",
      "auth.createAccount": "أنشئ حسابك الخاص",
      "auth.error": "خطأ في المصادقة",
      "auth.verifyEmail": "يرجى تفعيل بريدك الإلكتروني. تم إرسال رابط التحقق.",
      "auth.weakPassword": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتشمل أرقاماً ورموزاً.",
      "auth.invalidEmail": "يرجى إدخال بريد إلكتروني صحيح.",
      "auth.emailInUse": "هذا البريد الإلكتروني مستخدم بالفعل.",
      "auth.wrongPassword": "كلمة المرور غير صحيحة.",
      "auth.userNotFound": "لا يوجد مستخدم بهذا البريد الإلكتروني.",
      "auth.tooManyRequests": "محاولات كثيرة جداً. يرجى المحاولة لاحقاً.",
      "auth.networkError": "خطأ في الشبكة. يرجى التحقق من اتصالك.",

      // Footer
      "footer.rights": "جميع الحقوق محفوظة",
      "footer.team": "مدعوم من فريقنا الخبير"
    }
  },
  fr: {
    translation: {
      // Header
      "language": "Langue",
      "nav.home": "Accueil",
      "nav.login": "Connexion",

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

      // Auth
      "auth.login": "Connexion",
      "auth.signup": "S'inscrire",
      "auth.email": "Adresse e-mail",
      "auth.password": "Mot de passe",
      "auth.fullName": "Nom complet",
      "auth.phone": "Numéro de téléphone",
      "auth.country": "Pays",
      "auth.google": "Continuer avec Google",
      "auth.noAccount": "Vous n'avez pas de compte ?",
      "auth.hasAccount": "Vous avez déjà un compte ?",
      "auth.welcome": "Bon retour",
      "auth.createAccount": "Créez votre compte",
      "auth.error": "Erreur d'authentification",
      "auth.verifyEmail": "Veuillez vérifier votre e-mail. Un lien de vérification a été envoyé.",
      "auth.weakPassword": "Le mot de passe doit comporter au moins 8 caractères et inclure des chiffres et des symboles.",
      "auth.invalidEmail": "Veuillez entrer une adresse e-mail valide.",
      "auth.emailInUse": "Cet e-mail est déjà utilisé.",
      "auth.wrongPassword": "Mot de passe incorrect.",
      "auth.userNotFound": "Aucun utilisateur trouvé avec cet e-mail.",
      "auth.tooManyRequests": "Trop de tentatives. Veuillez réessayer plus tard.",
      "auth.networkError": "Erreur réseau. Veuillez vérifier votre connexion.",

      // Footer
      "footer.rights": "Tous droits réservés",
      "footer.team": "Propulsé par notre équipe d'experts"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
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
