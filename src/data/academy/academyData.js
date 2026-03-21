// ShukriTrade Academy - Complete Course Data
// 15 Stages × 12 Lessons each = 178 lessons total
// From Zero to Expert Trading

export const tradingTips = {
  en: [
    "Never risk more than 1-2% of your account on a single trade.",
    "Always set your stop loss before entering a trade.",
    "The trend is your friend — trade with it, not against it.",
    "Patience is the most profitable trading skill you can develop.",
    "A good trader manages risk first and profits second.",
    "Don't chase the market. Let the setup come to you.",
    "Keep a trading journal — it's your best teacher.",
    "Master one strategy before learning another.",
    "The best trade is sometimes no trade at all.",
    "Emotions are the enemy of consistent trading.",
    "Backtest your strategy before risking real money.",
    "Focus on the process, not the profit.",
    "Higher timeframes give more reliable signals.",
    "Liquidity is where the smart money hunts.",
    "Always have a plan before you click buy or sell."
  ],
  ar: [
    "لا تخاطر بأكثر من 1-2% من حسابك في صفقة واحدة.",
    "ضع وقف الخسارة دائماً قبل الدخول في أي صفقة.",
    "الاتجاه صديقك — تداول معه وليس ضده.",
    "الصبر هو أكثر مهارة تداول مربحة يمكنك تطويرها.",
    "المتداول الجيد يدير المخاطر أولاً والأرباح ثانياً.",
    "لا تطارد السوق. دع الفرصة تأتي إليك.",
    "احتفظ بدفتر تداول — إنه أفضل معلم لك.",
    "أتقن استراتيجية واحدة قبل تعلم أخرى.",
    "أفضل صفقة أحياناً هي عدم التداول.",
    "المشاعر هي عدو التداول المتسق.",
    "اختبر استراتيجيتك قبل المخاطرة بأموال حقيقية.",
    "ركز على العملية وليس على الربح.",
    "الأطر الزمنية الأعلى تعطي إشارات أكثر موثوقية.",
    "السيولة هي حيث يصطاد المال الذكي.",
    "ضع خطة دائماً قبل أن تضغط شراء أو بيع."
  ],
  fr: [
    "Ne risquez jamais plus de 1-2% de votre compte sur un seul trade.",
    "Placez toujours votre stop loss avant d'entrer en position.",
    "La tendance est votre amie — tradez avec elle, pas contre.",
    "La patience est la compétence de trading la plus rentable.",
    "Un bon trader gère le risque d'abord et les profits ensuite.",
    "Ne poursuivez pas le marché. Laissez le setup venir à vous.",
    "Tenez un journal de trading — c'est votre meilleur professeur.",
    "Maîtrisez une stratégie avant d'en apprendre une autre.",
    "Le meilleur trade est parfois de ne pas trader du tout.",
    "Les émotions sont l'ennemi du trading consistant.",
    "Backtestez votre stratégie avant de risquer de l'argent réel.",
    "Concentrez-vous sur le processus, pas sur le profit.",
    "Les timeframes supérieurs donnent des signaux plus fiables.",
    "La liquidité est là où l'argent intelligent chasse.",
    "Ayez toujours un plan avant de cliquer acheter ou vendre."
  ],
  es: [
    "Nunca arriesgues más del 1-2% de tu cuenta en una sola operación.",
    "Siempre coloca tu stop loss antes de entrar en una operación.",
    "La tendencia es tu amiga — opera con ella, no en su contra.",
    "La paciencia es la habilidad de trading más rentable.",
    "Un buen trader gestiona el riesgo primero y las ganancias después.",
    "No persigas el mercado. Deja que la configuración venga a ti.",
    "Mantén un diario de trading — es tu mejor maestro.",
    "Domina una estrategia antes de aprender otra.",
    "La mejor operación a veces es no operar en absoluto.",
    "Las emociones son el enemigo del trading consistente.",
    "Haz backtesting de tu estrategia antes de arriesgar dinero real.",
    "Enfócate en el proceso, no en la ganancia.",
    "Los marcos temporales superiores dan señales más confiables.",
    "La liquidez es donde el dinero inteligente caza.",
    "Siempre ten un plan antes de hacer clic en comprar o vender."
  ]
};

// 15 Stages with metadata
export const stages = [
  {
    id: 0,
    name: "المرحلة 0: التهيئة الذهنية والعقلية",
    nameEn: "Stage 0: Mental & Psychological Preparation",
    description: "فهم سيكولوجية التداول والانضباط الذاتي والتوقعات الواقعية",
    descriptionEn: "Understanding trading psychology, self-discipline, and realistic expectations",
    lessonsCount: 12,
    difficulty: "Beginner",
    estimatedHours: 8,
    order: 0
  },
  {
    id: 1,
    name: "المرحلة 1: أساسيات السوق والمفاهيم",
    nameEn: "Stage 1: Market Fundamentals & Concepts",
    description: "فهم أسواق الفوركس والعملات الرقمية والأدوات الأساسية",
    descriptionEn: "Understanding Forex, Crypto markets, and basic trading instruments",
    lessonsCount: 12,
    difficulty: "Beginner",
    estimatedHours: 10,
    order: 1
  },
  {
    id: 2,
    name: "المرحلة 2: أساسيات التحليل الفني",
    nameEn: "Stage 2: Technical Analysis Foundation",
    description: "الشموع اليابانية والدعم والمقاومة والاتجاهات",
    descriptionEn: "Japanese Candlesticks, Support & Resistance, Trends",
    lessonsCount: 12,
    difficulty: "Beginner",
    estimatedHours: 10,
    order: 2
  },
  {
    id: 3,
    name: "المرحلة 3: أنماط الشارت المتقدمة",
    nameEn: "Stage 3: Advanced Chart Patterns",
    description: "الرأس والكتفين، القمم والقيعان المزدوجة، المثلثات، الأعلام",
    descriptionEn: "Head & Shoulders, Double Tops/Bottoms, Triangles, Flags",
    lessonsCount: 12,
    difficulty: "Intermediate",
    estimatedHours: 12,
    order: 3
  },
  {
    id: 4,
    name: "المرحلة 4: المؤشرات الفنية الأساسية",
    nameEn: "Stage 4: Basic Technical Indicators",
    description: "RSI, MACD, Moving Averages, Bollinger Bands",
    descriptionEn: "RSI, MACD, Moving Averages, Bollinger Bands",
    lessonsCount: 12,
    difficulty: "Intermediate",
    estimatedHours: 12,
    order: 4
  },
  {
    id: 5,
    name: "المرحلة 5: المؤشرات المتقدمة والتحليل الحجمي",
    nameEn: "Stage 5: Advanced Indicators & Volume Analysis",
    description: "Stochastic, CCI, ADX, Volume Profile, On-Balance Volume",
    descriptionEn: "Stochastic, CCI, ADX, Volume Profile, On-Balance Volume",
    lessonsCount: 12,
    difficulty: "Intermediate",
    estimatedHours: 12,
    order: 5
  },
  {
    id: 6,
    name: "المرحلة 6: مفاهيم المال الذكي (SMC) - الجزء الأول",
    nameEn: "Stage 6: Smart Money Concepts (SMC) - Part 1",
    description: "بنية السوق، السيولة، كتل الأوامر، فجوات القيمة العادلة",
    descriptionEn: "Market Structure, Liquidity, Order Blocks, Fair Value Gaps",
    lessonsCount: 12,
    difficulty: "Intermediate",
    estimatedHours: 12,
    order: 6
  },
  {
    id: 7,
    name: "المرحلة 7: مفاهيم المال الذكي (SMC) - الجزء الثاني",
    nameEn: "Stage 7: Smart Money Concepts (SMC) - Part 2",
    description: "كسر البنية، المناطق المهمة، الاكتساح، نماذج الدخول",
    descriptionEn: "Break of Structure, Key Zones, Sweeps, Entry Models",
    lessonsCount: 12,
    difficulty: "Intermediate",
    estimatedHours: 12,
    order: 7
  },
  {
    id: 8,
    name: "المرحلة 8: منهجية ICT للتداول - الجزء الأول",
    nameEn: "Stage 8: ICT Trading Method - Part 1",
    description: "مناطق القتل، اكتساح السيولة، الهياكل المؤسسية",
    descriptionEn: "Kill Zones, Liquidity Sweeps, Institutional Structures",
    lessonsCount: 12,
    difficulty: "Advanced",
    estimatedHours: 12,
    order: 8
  },
  {
    id: 9,
    name: "المرحلة 9: منهجية ICT للتداول - الجزء الثاني",
    nameEn: "Stage 9: ICT Trading Method - Part 2",
    description: "نماذج الدخول المتقدمة، إدارة الصفقات، الخروج الاحترافي",
    descriptionEn: "Advanced Entry Models, Trade Management, Professional Exits",
    lessonsCount: 12,
    difficulty: "Advanced",
    estimatedHours: 12,
    order: 9
  },
  {
    id: 10,
    name: "المرحلة 10: إدارة المخاطر والعقلية الاحترافية",
    nameEn: "Stage 10: Risk Management & Professional Mindset",
    description: "حساب حجم المركز، نسبة المخاطرة/المكافأة، الانضباط النفسي",
    descriptionEn: "Position Sizing, Risk/Reward Ratio, Psychological Discipline",
    lessonsCount: 12,
    difficulty: "Advanced",
    estimatedHours: 12,
    order: 10
  },
  {
    id: 11,
    name: "المرحلة 11: التحليل الأساسي والأخبار الاقتصادية",
    nameEn: "Stage 11: Fundamental Analysis & Economic News",
    description: "البيانات الاقتصادية، الفائدة، التضخم، تأثير الأخبار",
    descriptionEn: "Economic Data, Interest Rates, Inflation, News Impact",
    lessonsCount: 12,
    difficulty: "Advanced",
    estimatedHours: 12,
    order: 11
  },
  {
    id: 12,
    name: "المرحلة 12: نظام SK المتكامل",
    nameEn: "Stage 12: Complete SK Trading System",
    description: "دمج SMC و ICT مع إدارة مخاطر صارمة وأمثلة حية",
    descriptionEn: "Combining SMC & ICT with Strict Risk Management & Live Examples",
    lessonsCount: 12,
    difficulty: "Expert",
    estimatedHours: 12,
    order: 12
  },
  {
    id: 13,
    name: "المرحلة 13: التداول الآلي والبوتات",
    nameEn: "Stage 13: Automated Trading & Trading Bots",
    description: "البرمجة البسيطة، الاستراتيجيات الآلية، الاختبار الخلفي",
    descriptionEn: "Simple Programming, Automated Strategies, Backtesting",
    lessonsCount: 12,
    difficulty: "Expert",
    estimatedHours: 12,
    order: 13
  },
  {
    id: 14,
    name: "المرحلة 14: الاحتراف العميق والتداول الحقيقي",
    nameEn: "Stage 14: Deep Mastery & Live Trading",
    description: "دراسات حالة حقيقية، إدارة محفظة، الاستثمار طويل الأجل",
    descriptionEn: "Real Case Studies, Portfolio Management, Long-term Investing",
    lessonsCount: 12,
    difficulty: "Expert",
    estimatedHours: 12,
    order: 14
  }
];

// Old 4 schools structure (kept for backward compatibility)
export const schools = [
  {
    id: 'classical',
    icon: 'BarChart3',
    color: 'from-blue-500 to-cyan-500',
    colorLight: 'blue',
    lessons: 13
  },
  {
    id: 'smc',
    icon: 'Brain',
    color: 'from-purple-500 to-pink-500',
    colorLight: 'purple',
    lessons: 12
  },
  {
    id: 'ict',
    icon: 'Target',
    color: 'from-emerald-500 to-teal-500',
    colorLight: 'emerald',
    lessons: 12
  },
  {
    id: 'sk',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500',
    colorLight: 'amber',
    lessons: 12
  }
];

// Diagram types for each lesson
export const diagramTypes = {
  'support-resistance': 'supportResistance',
  'trendlines': 'trendlines',
  'head-shoulders': 'headShoulders',
  'double-top-bottom': 'doubleTopBottom',
  'candlestick': 'candlestick',
  'market-structure': 'marketStructure',
  'liquidity': 'liquidity',
  'order-blocks': 'orderBlocks',
  'fvg': 'fairValueGap',
  'bos': 'breakOfStructure',
  'kill-zones': 'killZones',
  'risk-management': 'riskManagement',
  'trend': 'trend',
  'fibonacci': 'fibonacci',
  'entry-model': 'entryModel',
  'chart-patterns': 'chartPatterns'
};

// Summary statistics
export const academySummary = {
  totalStages: 15,
  totalLessons: 178,
  totalEstimatedHours: 160,
  difficultyProgression: [
    "Beginner (Stages 0-2): 36 lessons",
    "Intermediate (Stages 3-7): 60 lessons",
    "Advanced (Stages 8-11): 48 lessons",
    "Expert (Stages 12-14): 36 lessons"
  ],
  certificateEligibility: "شهادة عند إكمال كل مرحلة بنجاح (15/20 في الاختبار النهائي)",
  successCriteria: {
    lessonCompletion: "الوصول إلى نهاية الدرس بقراءة كامل المحتوى",
    quizPassing: "الحصول على 15/20 على الأقل (75%)",
    stagePassing: "النجاح في الاختبار النهائي للمرحلة",
    certificateEarning: "إكمال جميع دروس المرحلة والنجاح في الاختبار النهائي"
  }
};

// Placeholder lessons data structure
export const lessonsData = {
  // Will be populated with actual lesson content from comprehensive data files
  // Each stage will have 12 lessons with full content, examples, and quizzes
};

export default {
  tradingTips,
  stages,
  schools,
  diagramTypes,
  academySummary,
  lessonsData
};
