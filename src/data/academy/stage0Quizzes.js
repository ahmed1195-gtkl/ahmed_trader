/**
 * الاختبارات للمرحلة 0: التهيئة الذهنية والعقلية
 * 
 * نظام الاختبارات:
 * 1. Mini-Quiz بعد كل 3 دروس (10 أسئلة) - معيار النجاح: 70%
 * 2. Stage Exam في نهاية المرحلة (20 سؤال) - معيار النجاح: 75% (15/20)
 */

export const stage0MiniQuizzes = [
  {
    id: "stage0_mini_quiz_1",
    stageId: 0,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3",
    titleEn: "Mini Quiz: Lessons 1-3",
    description: "اختبر معرفتك بالدروس الثلاثة الأولى",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "ما النسبة المئوية للمتداولين الذين يخسرون أموالهم في السنة الأولى؟",
        questionEn: "What percentage of traders lose their money in the first year?",
        options: [
          "50%",
          "70%",
          "90%",
          "100%"
        ],
        correctAnswer: 2, // 90%
        explanation: "وفقاً لإحصائيات SEC و FCA، حوالي 90% من المتداولين يخسرون أموالهم في السنة الأولى.",
        explanationEn: "According to SEC and FCA statistics, about 90% of traders lose their money in the first year."
      },
      {
        id: "q2",
        question: "ما نسبة الخسائر التي تكون بسبب أخطاء نفسية؟",
        questionEn: "What percentage of losses are due to psychological errors?",
        options: [
          "30%",
          "50%",
          "70%",
          "100%"
        ],
        correctAnswer: 2, // 70%
        explanation: "70% من خسائر المتداولين سببها أخطاء نفسية وليس تقنية.",
        explanationEn: "70% of traders' losses are due to psychological errors, not technical."
      },
      {
        id: "q3",
        question: "أي من التالي يعتبر قمار وليس تداول؟",
        questionEn: "Which of the following is considered gambling, not trading?",
        options: [
          "شراء عملة بناءً على تحليل فني دقيق",
          "المراهنة على نتيجة مباراة كرة قدم",
          "شراء أسهم بناءً على بحث أساسي",
          "فتح صفقة بناءً على خطة محددة"
        ],
        correctAnswer: 1, // المراهنة على نتيجة مباراة
        explanation: "القمار هو المراهنة على نتيجة غير مؤكدة بدون دراسة أو تحليل.",
        explanationEn: "Gambling is betting on an uncertain outcome without study or analysis."
      },
      {
        id: "q4",
        question: "ما الفرق الأساسي بين التداول والاستثمار؟",
        questionEn: "What is the main difference between trading and investing?",
        options: [
          "التداول أكثر أماناً",
          "الاستثمار قصير الأجل والتداول طويل الأجل",
          "التداول قصير الأجل والاستثمار طويل الأجل",
          "لا يوجد فرق"
        ],
        correctAnswer: 2, // التداول قصير والاستثمار طويل
        explanation: "التداول يركز على تقلبات الأسعار قصيرة الأجل (ساعات إلى أسابيع)، بينما الاستثمار يركز على النمو طويل الأجل (سنوات).",
        explanationEn: "Trading focuses on short-term price fluctuations (hours to weeks), while investing focuses on long-term growth (years)."
      },
      {
        id: "q5",
        question: "ما نسبة نجاح المتداول الاحترافي في الصفقات؟",
        questionEn: "What is the success rate of professional traders?",
        options: [
          "80-90%",
          "55-65%",
          "40-50%",
          "100%"
        ],
        correctAnswer: 1, // 55-65%
        explanation: "المتداول الاحترافي لا يفوز في كل صفقة. نسبة النجاح الحقيقية تتراوح بين 55-65%.",
        explanationEn: "Professional traders don't win every trade. Real success rate is 55-65%."
      },
      {
        id: "q6",
        question: "أي من الخصائص التالية هي الأهم لنجاح المتداول؟",
        questionEn: "Which of the following characteristics is most important for trader success?",
        options: [
          "الذكاء العالي",
          "الانضباط والصبر",
          "الحظ",
          "رأس مال كبير جداً"
        ],
        correctAnswer: 1, // الانضباط والصبر
        explanation: "الانضباط والصبر أهم من الذكاء في التداول. المتداول المنضبط يحمي رأس ماله.",
        explanationEn: "Discipline and patience are more important than intelligence in trading. Disciplined trader protects capital."
      },
      {
        id: "q7",
        question: "ماذا يجب أن تفعل إذا خسرت صفقة؟",
        questionEn: "What should you do if you lose a trade?",
        options: [
          "افتح صفقة أخرى فوراً للانتقام",
          "توقف عن التداول نهائياً",
          "حلل الخسارة وتعلم منها",
          "زيادة حجم الصفقة التالية"
        ],
        correctAnswer: 2, // حلل وتعلم
        explanation: "كل خسارة هي درس. يجب تحليل ما حدث والتعلم منه، وليس الانتقام أو الاستسلام.",
        explanationEn: "Every loss is a lesson. You should analyze what happened and learn from it, not revenge or give up."
      },
      {
        id: "q8",
        question: "كم نسبة رأس المال يجب أن تخاطر بها في الصفقة الواحدة؟",
        questionEn: "What percentage of capital should you risk per trade?",
        options: [
          "10-20%",
          "5-10%",
          "1-2%",
          "أكثر من 50%"
        ],
        correctAnswer: 2, // 1-2%
        explanation: "قاعدة ذهبية: لا تخاطر بأكثر من 1-2% من رأس المال في الصفقة الواحدة.",
        explanationEn: "Golden rule: Don't risk more than 1-2% of capital per trade."
      },
      {
        id: "q9",
        question: "ما أهمية التعلم المستمر في التداول؟",
        questionEn: "What is the importance of continuous learning in trading?",
        options: [
          "غير مهم",
          "السوق يتغير باستمرار والاستراتيجيات تتطور",
          "فقط للمبتدئين",
          "يجب التعلم مرة واحدة فقط"
        ],
        correctAnswer: 1, // السوق يتغير
        explanation: "السوق ديناميكي ومتغير باستمرار. الاستراتيجية التي تعمل اليوم قد لا تعمل غداً.",
        explanationEn: "Markets are dynamic and constantly changing. Strategy that works today may not work tomorrow."
      },
      {
        id: "q10",
        question: "أي من التالي يعتبر من مؤشرات الفشل المبكر؟",
        questionEn: "Which of the following is an early sign of failure?",
        options: [
          "الصبر على انتظار الفرص",
          "الالتزام بخطة محددة",
          "فتح صفقات عشوائية بدون خطة",
          "إدارة صارمة للمخاطر"
        ],
        correctAnswer: 2, // صفقات عشوائية
        explanation: "فتح صفقات عشوائية بدون خطة هو أول علامة على الفشل.",
        explanationEn: "Opening random trades without a plan is the first sign of failure."
      }
    ]
  },

  {
    id: "stage0_mini_quiz_2",
    stageId: 0,
    quizType: "mini",
    title: "اختبار قصير: الدروس 4-6",
    titleEn: "Mini Quiz: Lessons 4-6",
    description: "اختبر معرفتك بالدروس 4-6",
    lessonAfter: 5,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600,
    
    questions: [
      // سيتم ملء هذا بعد كتابة الدروس 4-6
      {
        id: "q1",
        question: "سؤال تجريبي 1",
        questionEn: "Sample Question 1",
        options: ["أ", "ب", "ج", "د"],
        correctAnswer: 0,
        explanation: "شرح تجريبي",
        explanationEn: "Sample explanation"
      }
    ]
  },

  {
    id: "stage0_mini_quiz_3",
    stageId: 0,
    quizType: "mini",
    title: "اختبار قصير: الدروس 7-9",
    titleEn: "Mini Quiz: Lessons 7-9",
    description: "اختبر معرفتك بالدروس 7-9",
    lessonAfter: 8,
    totalQuestions: 10,
    passingScore: 7,
    timeLimit: 600,
    
    questions: [
      {
        id: "q1",
        question: "سؤال تجريبي 1",
        questionEn: "Sample Question 1",
        options: ["أ", "ب", "ج", "د"],
        correctAnswer: 0,
        explanation: "شرح تجريبي",
        explanationEn: "Sample explanation"
      }
    ]
  },

  {
    id: "stage0_mini_quiz_4",
    stageId: 0,
    quizType: "mini",
    title: "اختبار قصير: الدروس 10-12",
    titleEn: "Mini Quiz: Lessons 10-12",
    description: "اختبر معرفتك بالدروس 10-12",
    lessonAfter: 11,
    totalQuestions: 10,
    passingScore: 7,
    timeLimit: 600,
    
    questions: [
      {
        id: "q1",
        question: "سؤال تجريبي 1",
        questionEn: "Sample Question 1",
        options: ["أ", "ب", "ج", "د"],
        correctAnswer: 0,
        explanation: "شرح تجريبي",
        explanationEn: "Sample explanation"
      }
    ]
  }
];

export const stage0FinalExam = {
  id: "stage0_final_exam",
  stageId: 0,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 0: التهيئة الذهنية",
  titleEn: "Final Exam - Stage 0: Mental Preparation",
  description: "اختبار شامل للمرحلة الأولى. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "وفقاً للدراسات الإحصائية، كم نسبة المتداولين الذين يخسرون أموالهم؟",
      questionEn: "According to statistical studies, what percentage of traders lose money?",
      options: ["50%", "70%", "90%", "100%"],
      correctAnswer: 2,
      explanation: "90% من المتداولين يخسرون أموالهم، خاصة في السنة الأولى.",
      explanationEn: "90% of traders lose money, especially in the first year."
    },
    {
      id: "q2",
      question: "ما السبب الأساسي لخسائر المتداولين؟",
      questionEn: "What is the main reason for traders' losses?",
      options: ["عدم فهم التحليل الفني", "أخطاء نفسية وعاطفية", "السوق عشوائي", "سوء الحظ"],
      correctAnswer: 1,
      explanation: "70% من الخسائر سببها أخطاء نفسية (الخوف، الجشع، عدم الانضباط).",
      explanationEn: "70% of losses are due to psychological errors (fear, greed, lack of discipline)."
    },
    {
      id: "q3",
      question: "أي من التالي يعتبر تداول احترافي؟",
      questionEn: "Which of the following is considered professional trading?",
      options: [
        "فتح 50 صفقة يومياً",
        "فتح 1-2 صفقة أسبوعياً بناءً على خطة",
        "المراهنة على أي حركة سعرية",
        "تجاهل إدارة المخاطر"
      ],
      correctAnswer: 1,
      explanation: "التداول الاحترافي يتطلب صبراً واختيار الفرص الواضحة فقط.",
      explanationEn: "Professional trading requires patience and selecting only clear opportunities."
    },
    {
      id: "q4",
      question: "ما الفرق بين التداول والقمار؟",
      questionEn: "What is the difference between trading and gambling?",
      options: [
        "لا يوجد فرق",
        "التداول له خطة وتحليل، القمار عشوائي",
        "القمار أفضل",
        "التداول أسهل"
      ],
      correctAnswer: 1,
      explanation: "التداول يعتمد على دراسة وخطة، بينما القمار عشوائي تماماً.",
      explanationEn: "Trading is based on study and plan, while gambling is completely random."
    },
    {
      id: "q5",
      question: "ما نسبة نجاح المتداول الاحترافي؟",
      questionEn: "What is a professional trader's success rate?",
      options: ["100%", "90%", "55-65%", "20-30%"],
      correctAnswer: 2,
      explanation: "حتى أفضل المتداولين يخسرون 35-45% من الصفقات.",
      explanationEn: "Even the best traders lose 35-45% of trades."
    },
    {
      id: "q6",
      question: "ما أهم خاصية لنجاح المتداول؟",
      questionEn: "What is the most important characteristic for trader success?",
      options: ["الذكاء العالي", "الحظ", "الانضباط والصبر", "رأس مال كبير"],
      correctAnswer: 2,
      explanation: "الانضباط والصبر هما أساس النجاح في التداول.",
      explanationEn: "Discipline and patience are the foundation of trading success."
    },
    {
      id: "q7",
      question: "كم نسبة رأس المال يجب أن تخاطر بها في الصفقة؟",
      questionEn: "What percentage of capital should you risk per trade?",
      options: ["10%", "5%", "1-2%", "50%"],
      correctAnswer: 2,
      explanation: "القاعدة الذهبية: 1-2% من رأس المال فقط.",
      explanationEn: "Golden rule: Only 1-2% of capital per trade."
    },
    {
      id: "q8",
      question: "ماذا تفعل عندما تخسر صفقة؟",
      questionEn: "What do you do when you lose a trade?",
      options: [
        "تفتح صفقة أخرى للانتقام",
        "تتوقف عن التداول",
        "تحلل الخسارة وتتعلم منها",
        "تزيد حجم الصفقة التالية"
      ],
      correctAnswer: 2,
      explanation: "كل خسارة درس. يجب تحليلها والتعلم منها.",
      explanationEn: "Every loss is a lesson. Analyze it and learn from it."
    },
    {
      id: "q9",
      question: "ما الفرق بين التداول والاستثمار؟",
      questionEn: "What is the difference between trading and investing?",
      options: [
        "التداول طويل الأجل",
        "الاستثمار قصير الأجل",
        "التداول قصير الأجل، الاستثمار طويل الأجل",
        "لا يوجد فرق"
      ],
      correctAnswer: 2,
      explanation: "التداول يركز على تقلبات قصيرة، الاستثمار على نمو طويل الأجل.",
      explanationEn: "Trading focuses on short fluctuations, investing on long-term growth."
    },
    {
      id: "q10",
      question: "هل يمكن الفوز في كل صفقة؟",
      questionEn: "Can you win every trade?",
      options: ["نعم، إذا كنت محترفاً", "نعم، دائماً", "لا، الخسائر طبيعية", "قد تكون محظوظاً"],
      correctAnswer: 2,
      explanation: "لا، الخسائر جزء طبيعي من التداول حتى للمحترفين.",
      explanationEn: "No, losses are natural part of trading even for professionals."
    },
    {
      id: "q11",
      question: "ما أهمية إدارة العواطف في التداول؟",
      questionEn: "What is the importance of emotional control in trading?",
      options: [
        "غير مهمة",
        "مهمة لكن ليست حتمية",
        "حتمية - العواطف تدمر رأس المال",
        "للمبتدئين فقط"
      ],
      correctAnswer: 2,
      explanation: "العواطف (الخوف، الجشع) هي أكبر عدو للمتداول.",
      explanationEn: "Emotions (fear, greed) are the trader's biggest enemy."
    },
    {
      id: "q12",
      question: "كم عدد الصفقات التي يجب أن يفتحها المتداول يومياً؟",
      questionEn: "How many trades should a trader open daily?",
      options: ["20-30", "10-15", "5-10", "0-2 (أو لا يوجد)"],
      correctAnswer: 3,
      explanation: "الجودة أهم من الكمية. المتداول الاحترافي قد لا يتاجر يومياً.",
      explanationEn: "Quality is more important than quantity. Professional may not trade daily."
    },
    {
      id: "q13",
      question: "ما معنى Revenge Trading؟",
      questionEn: "What does Revenge Trading mean?",
      options: [
        "التداول بحذر بعد خسارة",
        "فتح صفقات عشوائية للانتقام من خسارة سابقة",
        "التداول مع صديق",
        "التداول في الليل"
      ],
      correctAnswer: 1,
      explanation: "Revenge Trading هو أسوأ عادة - فتح صفقات بحجم كبير بدون خطة بعد خسارة.",
      explanationEn: "Revenge Trading is worst habit - opening large trades without plan after loss."
    },
    {
      id: "q14",
      question: "هل يجب على المتداول أن يتعلم باستمرار؟",
      questionEn: "Should a trader continuously learn?",
      options: ["لا، مرة واحدة كافية", "نعم، السوق يتغير باستمرار", "فقط المبتدئون", "لا، الخبرة كافية"],
      correctAnswer: 1,
      explanation: "التعلم المستمر ضروري لأن السوق ديناميكي والاستراتيجيات تتطور.",
      explanationEn: "Continuous learning is necessary because markets are dynamic and strategies evolve."
    },
    {
      id: "q15",
      question: "ما الهدف الحقيقي من التداول؟",
      questionEn: "What is the real goal of trading?",
      options: [
        "الثراء السريع",
        "الربح من كل صفقة",
        "بناء نظام تداول منظم وأرباح منتظمة",
        "الفوز في كل مرة"
      ],
      correctAnswer: 2,
      explanation: "الهدف هو بناء نظام منظم يحقق أرباح منتظمة على المدى الطويل.",
      explanationEn: "Goal is to build organized system that generates regular profits long-term."
    },
    {
      id: "q16",
      question: "أي من التالي يعتبر من علامات المتداول المحترف؟",
      questionEn: "Which of the following is a sign of professional trader?",
      options: [
        "يفتح صفقات كثيرة يومياً",
        "يتاجر بدون خطة",
        "يقبل الخسائر ويتعلم منها",
        "يتوقع الفوز في كل صفقة"
      ],
      correctAnswer: 2,
      explanation: "المتداول المحترف يتقبل الخسائر كجزء من العملية ويتعلم منها.",
      explanationEn: "Professional trader accepts losses as part of process and learns from them."
    },
    {
      id: "q17",
      question: "ما أثر الانضباط على نتائج التداول؟",
      questionEn: "What is the impact of discipline on trading results?",
      options: [
        "لا تأثير",
        "تأثير بسيط",
        "تأثير كبير جداً - حتى 80% من النجاح",
        "تأثير سلبي"
      ],
      correctAnswer: 2,
      explanation: "الانضباط يحدد 80% من نجاح المتداول.",
      explanationEn: "Discipline determines 80% of trader's success."
    },
    {
      id: "q18",
      question: "هل يجب أن تتاجر بأموال لا تستطيع خسارتها؟",
      questionEn: "Should you trade with money you can't afford to lose?",
      options: ["نعم، إذا كنت واثقاً", "نعم، دائماً", "لا، أبداً", "قد تكون محظوظاً"],
      correctAnswer: 2,
      explanation: "لا تتاجر بأموال تحتاجها - استخدم رأس مال يمكنك خسارته.",
      explanationEn: "Never trade with money you need - use capital you can afford to lose."
    },
    {
      id: "q19",
      question: "ما الفرق بين المتداول المبتدئ والمحترف؟",
      questionEn: "What is the difference between beginner and professional trader?",
      options: [
        "المحترف أكثر حظاً",
        "المحترف يتاجر أكثر",
        "المحترف ينضبط ويدير المخاطر بذكاء",
        "لا يوجد فرق"
      ],
      correctAnswer: 2,
      explanation: "المحترف ينضبط، يدير المخاطر، ويتعلم من الأخطاء.",
      explanationEn: "Professional is disciplined, manages risks, and learns from mistakes."
    },
    {
      id: "q20",
      question: "ما الخطوة الأولى نحو النجاح في التداول؟",
      questionEn: "What is the first step toward success in trading?",
      options: [
        "فتح حساب وابدأ التداول",
        "البحث عن استراتيجية سحرية",
        "بناء عقلية صحيحة والتعليم",
        "البدء برأس مال كبير"
      ],
      correctAnswer: 2,
      explanation: "الخطوة الأولى هي بناء عقلية صحيحة والتعليم قبل أي شيء آخر.",
      explanationEn: "First step is building healthy mindset and education before anything else."
    }
  ]
};

export default {
  stage0MiniQuizzes,
  stage0FinalExam
};
  ,
  {
    id: "stage0_mini_quiz_3",
    stageId: 0,
    quizType: "mini",
    title: "اختبار قصير: الدروس 7-9",
    titleEn: "Mini Quiz: Lessons 7-9",
    description: "اختبر معرفتك بالدروس 7-9",
    lessonAfter: 8,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600,
    
    questions: [
      {
        id: "q1",
        question: "ما هو المبدأ الأساسي للتحليل الفني الذي يشير إلى أن جميع المعلومات تنعكس في السعر؟",
        options: [
          "التاريخ يعيد نفسه",
          "الأسعار تتحرك في اتجاهات",
          "السعر يعكس كل شيء",
          "التحليل الفني أفضل من الأساسي"
        ],
        correctAnswer: 2, // السعر يعكس كل شيء
        explanation: "المبدأ الأساسي للتحليل الفني هو أن كل شيء ينعكس في السعر.",
        explanationEn: "The basic principle of technical analysis is that everything is reflected in the price."
      },
      {
        id: "q2",
        question: "ما هو نوع الشمعة اليابانية التي تتميز بجسم صغير في الجزء العلوي وظل سفلي طويل، وتظهر في نهاية الاتجاه الهابط؟",
        options: [
          "الشهاب",
          "الرجل المشنوق",
          "المطرقة",
          "الدوجي"
        ],
        correctAnswer: 2, // المطرقة
        explanation: "شمعة المطرقة هي شمعة انعكاسية صعودية تظهر في نهاية الاتجاه الهابط.",
        explanationEn: "The hammer candlestick is a bullish reversal candle that appears at the end of a downtrend."
      },
      {
        id: "q3",
        question: "عندما يتم كسر مستوى مقاومة قوي، فماذا يصبح دوره غالباً في المستقبل؟",
        options: [
          "يبقى مقاومة",
          "يتحول إلى دعم",
          "يختفي تماماً",
          "يصبح منطقة حيادية"
        ],
        correctAnswer: 1, // يتحول إلى دعم
        explanation: "مبدأ تبادل الأدوار: المقاومة المكسورة تصبح دعماً، والدعم المكسور يصبح مقاومة.",
        explanationEn: "Role reversal principle: broken resistance becomes support, and broken support becomes resistance."
      },
      {
        id: "q4",
        question: "أي من التالي ليس من المبادئ الأساسية للتحليل الفني؟",
        options: [
          "الأسعار تتحرك في اتجاهات",
          "التاريخ يعيد نفسه",
          "السعر يعكس كل شيء",
          "التحليل الأساسي هو الأهم"
        ],
        correctAnswer: 3, // التحليل الأساسي هو الأهم
        explanation: "التحليل الفني لا يتعارض مع التحليل الأساسي، لكنه يركز على حركة السعر.",
        explanationEn: "Technical analysis does not contradict fundamental analysis, but it focuses on price action."
      },
      {
        id: "q5",
        question: "ماذا تمثل الظلال (Wicks) في الشمعة اليابانية؟",
        options: [
          "سعر الفتح والإغلاق",
          "أعلى وأدنى سعر وصل إليه السعر",
          "حجم التداول",
          "قوة المشترين والبائعين"
        ],
        correctAnswer: 1, // أعلى وأدنى سعر وصل إليه السعر
        explanation: "الظلال تمثل أقصى مدى وصل إليه السعر خلال فترة الشمعة.",
        explanationEn: "Wicks represent the highest and lowest price reached during the candle period."
      },
      {
        id: "q6",
        question: "ما هي أفضل طريقة لرسم مستويات الدعم والمقاومة؟",
        options: [
          "خطوط دقيقة جداً",
          "مناطق (Zones)",
          "باستخدام مؤشر RSI فقط",
          "باستخدام المتوسطات المتحركة فقط"
        ],
        correctAnswer: 1, // مناطق (Zones)
        explanation: "الدعم والمقاومة هي مناطق وليست خطوطاً دقيقة.",
        explanationEn: "Support and resistance are zones, not precise lines."
      },
      {
        id: "q7",
        question: "ما هو نمط الشموع اليابانية الذي يتكون من شمعة هابطة صغيرة تتبعها شمعة صاعدة كبيرة تبتلع جسم الشمعة السابقة؟",
        options: [
          "الشهاب",
          "نجمة المساء",
          "الابتلاع الصاعد",
          "الدوجي"
        ],
        correctAnswer: 2, // الابتلاع الصاعد
        explanation: "نمط الابتلاع الصاعد هو نمط انعكاسي صعودي قوي.",
        explanationEn: "The bullish engulfing pattern is a strong bullish reversal pattern."
      },
      {
        id: "q8",
        question: "ماذا تعني استراتيجية الارتداد (Reversal Strategy) عند استخدام الدعم والمقاومة؟",
        options: [
          "الدخول في صفقة عندما يكسر السعر المستوى",
          "الدخول في صفقة عندما يرتد السعر من المستوى",
          "الدخول في صفقة عند إعادة اختبار المستوى",
          "الدخول في صفقة بغض النظر عن المستوى"
        ],
        correctAnswer: 1, // الدخول في صفقة عندما يرتد السعر من المستوى
        explanation: "استراتيجية الارتداد تعتمد على توقع ارتداد السعر من مستويات الدعم أو المقاومة.",
        explanationEn: "Reversal strategy relies on anticipating price bouncing off support or resistance levels."
      },
      {
        id: "q9",
        question: "ما هي الشمعة اليابانية التي تشير إلى حيرة في السوق وعدم سيطرة أي من المشترين أو البائعين؟",
        options: [
          "المطرقة",
          "الشهاب",
          "الدوجي",
          "الابتلاع الهابط"
        ],
        correctAnswer: 2, // الدوجي
        explanation: "شمعة الدوجي تشير إلى التردد وعدم اليقين في السوق.",
        explanationEn: "Doji candlestick indicates indecision and uncertainty in the market."
      },
      {
        id: "q10",
        question: "أي من التالي يعتبر خطأ شائعاً عند استخدام مستويات الدعم والمقاومة؟",
        options: [
          "الاعتماد على إطار زمني واحد",
          "رسمها كمناطق",
          "البحث عن القمم والقيعان الواضحة",
          "استخدام الشموع اليابانية للتأكيد"
        ],
        correctAnswer: 0, // الاعتماد على إطار زمني واحد
        explanation: "يجب النظر إلى مستويات الدعم والمقاومة على إطارات زمنية متعددة.",
        explanationEn: "Support and resistance levels should be viewed on multiple timeframes."
      }
    ]
  },
  {
    id: "stage0_final_exam",
    stageId: 0,
    quizType: "final",
    title: "الاختبار النهائي - المرحلة 0: التهيئة الذهنية والأساسيات",
    titleEn: "Final Exam - Stage 0: Mindset and Fundamentals",
    description: "اختبار شامل للمرحلة الأولى. يجب الحصول على 15/20 للنجاح.",
    totalQuestions: 20,
    passingScore: 15, // 15/20 (75%)
    timeLimit: 1800, // 30 دقيقة
    
    questions: [
      {
        id: "q1",
        question: "وفقاً للدراسات الإحصائية، كم نسبة المتداولين الذين يخسرون أموالهم؟",
        options: ["50%", "70%", "90%", "100%"],
        correctAnswer: 2, // 90%
        explanation: "90% من المتداولين يخسرون أموالهم، خاصة في السنة الأولى.",
        explanationEn: "90% of traders lose money, especially in the first year."
      },
      {
        id: "q2",
        question: "ما السبب الأساسي لخسائر المتداولين؟",
        options: ["عدم فهم التحليل الفني", "أخطاء نفسية وعاطفية", "السوق عشوائي", "سوء الحظ"],
        correctAnswer: 1, // أخطاء نفسية وعاطفية
        explanation: "70% من الخسائر سببها أخطاء نفسية (الخوف، الجشع، عدم الانضباط).",
        explanationEn: "70% of losses are due to psychological errors (fear, greed, lack of discipline)."
      },
      {
        id: "q3",
        question: "أي من التالي يعتبر تداول احترافي؟",
        options: [
          "فتح 50 صفقة يومياً",
          "فتح 1-2 صفقة أسبوعياً بناءً على خطة",
          "المراهنة على أي حركة سعرية",
          "تجاهل إدارة المخاطر"
        ],
        correctAnswer: 1, // فتح 1-2 صفقة أسبوعياً بناءً على خطة
        explanation: "التداول الاحترافي يتطلب صبراً واختيار الفرص الواضحة فقط.",
        explanationEn: "Professional trading requires patience and selecting only clear opportunities."
      },
      {
        id: "q4",
        question: "ما الفرق بين التداول والقمار؟",
        options: [
          "لا يوجد فرق",
          "التداول له خطة وتحليل، القمار عشوائي",
          "القمار أفضل",
          "كلاهما نفس الشيء"
        ],
        correctAnswer: 1, // التداول له خطة وتحليل، القمار عشوائي
        explanation: "التداول يعتمد على التحليل والإحصاءات، بينما القمار يعتمد على الحظ.",
        explanationEn: "Trading relies on analysis and statistics, while gambling relies on luck."
      },
      {
        id: "q5",
        question: "ما هي النسبة المئوية القصوى من رأس المال التي يجب المخاطرة بها في صفقة واحدة؟",
        options: [
          "5-10%",
          "1-2%",
          "20% فأكثر",
          "لا يوجد حد"
        ],
        correctAnswer: 1, // 1-2%
        explanation: "قاعدة إدارة المخاطر الذهبية هي عدم المخاطرة بأكثر من 1-2% من رأس المال في الصفقة الواحدة.",
        explanationEn: "The golden rule of risk management is not to risk more than 1-2% of capital per trade."
      },
      {
        id: "q6",
        question: "أي من التالي يعتبر من أهم خصائص عقلية المتداول الاحترافي؟",
        options: [
          "الاندفاع",
          "الطمع",
          "الصبر والانضباط",
          "الاعتماد على الحظ"
        ],
        correctAnswer: 2, // الصبر والانضباط
        explanation: "الصبر والانضباط هما مفتاح النجاح في التداول على المدى الطويل.",
        explanationEn: "Patience and discipline are key to long-term trading success."
      },
      {
        id: "q7",
        question: "ما هو المبدأ الأساسي للتحليل الفني الذي يشير إلى أن جميع المعلومات تنعكس في السعر؟",
        options: [
          "التاريخ يعيد نفسه",
          "الأسعار تتحرك في اتجاهات",
          "السعر يعكس كل شيء",
          "التحليل الفني أفضل من الأساسي"
        ],
        correctAnswer: 2, // السعر يعكس كل شيء
        explanation: "هذا هو الافتراض الأساسي الذي يبنى عليه التحليل الفني.",
        explanationEn: "This is the fundamental assumption upon which technical analysis is built."
      },
      {
        id: "q8",
        question: "ماذا تمثل الشمعة اليابانية ذات الجسم الصغير والظلال الطويلة المتساوية من الأعلى والأسفل؟",
        options: [
          "المطرقة",
          "الشهاب",
          "الدوجي",
          "الابتلاع الصاعد"
        ],
        correctAnswer: 2, // الدوجي
        explanation: "الدوجي تشير إلى حيرة السوق وعدم وجود سيطرة واضحة للمشترين أو البائعين.",
        explanationEn: "Doji indicates market indecision and no clear control by buyers or sellers."
      },
      {
        id: "q9",
        question: "عندما يتم كسر مستوى دعم قوي، فماذا يصبح دوره غالباً في المستقبل؟",
        options: [
          "يبقى دعماً",
          "يتحول إلى مقاومة",
          "يختفي تماماً",
          "يصبح منطقة حيادية"
        ],
        correctAnswer: 1, // يتحول إلى مقاومة
        explanation: "مبدأ تبادل الأدوار هو مفهوم أساسي في التحليل الفني.",
        explanationEn: "The role reversal principle is a fundamental concept in technical analysis."
      },
      {
        id: "q10",
        question: "ما هي أفضل طريقة لرسم مستويات الدعم والمقاومة؟",
        options: [
          "خطوط دقيقة جداً",
          "مناطق (Zones)",
          "باستخدام مؤشر RSI فقط",
          "باستخدام المتوسطات المتحركة فقط"
        ],
        correctAnswer: 1, // مناطق (Zones)
        explanation: "الدعم والمقاومة هي مناطق سعرية يتفاعل معها السعر، وليست خطوطاً دقيقة.",
        explanationEn: "Support and resistance are price zones that price interacts with, not precise lines."
      },
      {
        id: "q11",
        question: "ما هو الفرق الرئيسي بين المتوسط المتحرك البسيط (SMA) والمتوسط المتحرك الأسي (EMA)؟",
        options: [
          "SMA أسرع استجابة من EMA",
          "EMA يعطي وزناً أكبر للأسعار الحديثة",
          "SMA يستخدم في الاتجاهات الصاعدة فقط",
          "EMA يستخدم في الاتجاهات الهابطة فقط"
        ],
        correctAnswer: 1, // EMA يعطي وزناً أكبر للأسعار الحديثة
        explanation: "EMA أكثر استجابة لحركة السعر الحالية لأنه يركز على البيانات الأحدث.",
        explanationEn: "EMA is more responsive to current price action because it emphasizes newer data."
      },
      {
        id: "q12",
        question: "ماذا تعني إشارة 'التقاطع الذهبي' (Golden Cross) في المتوسطات المتحركة؟",
        options: [
          "تقاطع متوسط قصير الأجل تحت متوسط طويل الأجل (إشارة هبوطية)",
          "تقاطع متوسط قصير الأجل فوق متوسط طويل الأجل (إشارة صعودية)",
          "تقاطع السعر فوق المتوسط المتحرك",
          "تقاطع السعر تحت المتوسط المتحرك"
        ],
        correctAnswer: 1, // تقاطع متوسط قصير الأجل فوق متوسط طويل الأجل (إشارة صعودية)
        explanation: "التقاطع الذهبي هو إشارة صعودية قوية تشير إلى بداية اتجاه صاعد.",
        explanationEn: "A Golden Cross is a strong bullish signal indicating the beginning of an uptrend."
      },
      {
        id: "q13",
        question: "عندما يكون مؤشر RSI فوق مستوى 70، فماذا يشير ذلك؟",
        options: [
          "ذروة بيع",
          "ذروة شراء",
          "اتجاه صاعد قوي",
          "اتجاه هابط قوي"
        ],
        correctAnswer: 1, // ذروة شراء
        explanation: "مستوى 70 في RSI يشير إلى أن الأصل في منطقة ذروة شراء وقد يكون مستحقاً للتصحيح.",
        explanationEn: "An RSI level above 70 indicates that the asset is in an overbought zone and may be due for a correction."
      },
      {
        id: "q14",
        question: "ماذا يمثل الانحراف السلبي (Bearish Divergence) في مؤشر RSI؟",
        options: [
          "السعر يسجل قمم أعلى و RSI يسجل قمم أعلى",
          "السعر يسجل قمم أعلى و RSI يسجل قمم أدنى",
          "السعر يسجل قيعان أدنى و RSI يسجل قيعان أعلى",
          "السعر يسجل قيعان أدنى و RSI يسجل قيعان أدنى"
        ],
        correctAnswer: 1, // السعر يسجل قمم أعلى و RSI يسجل قمم أدنى
        explanation: "الانحراف السلبي هو إشارة انعكاسية هبوطية قوية.",
        explanationEn: "Bearish divergence is a strong bearish reversal signal."
      },
      {
        id: "q15",
        question: "ما هي المكونات الثلاثة الرئيسية لمؤشر الماكد (MACD)؟",
        options: [
          "خط الماكد، خط الإشارة، مؤشر RSI",
          "خط الماكد، خط الإشارة، المدرج التكراري",
          "الخط الأوسط، النطاق العلوي، النطاق السفلي",
          "المتوسط المتحرك البسيط، المتوسط المتحرك الأسي، الحجم"
        ],
        correctAnswer: 1, // خط الماكد، خط الإشارة، المدرج التكراري
        explanation: "هذه هي المكونات الأساسية التي يتكون منها مؤشر الماكد.",
        explanationEn: "These are the basic components that make up the MACD indicator."
      },
      {
        id: "q16",
        question: "ماذا تعني إشارة الشراء في الماكد عندما يتقاطع خط الماكد فوق خط الإشارة؟",
        options: [
          "زخم هبوطي متزايد",
          "زخم صعودي متزايد",
          "ضعف في الاتجاه",
          "لا توجد إشارة واضحة"
        ],
        correctAnswer: 1, // زخم صعودي متزايد
        explanation: "تقاطع خط الماكد فوق خط الإشارة هو إشارة صعودية.",
        explanationEn: "A MACD line crossing above the signal line is a bullish signal."
      },
      {
        id: "q17",
        question: "ماذا تشير النطاقات الضيقة (Squeeze) في مؤشر البولينجر باندز؟",
        options: [
          "تقلب عالٍ في السوق",
          "تقلب منخفض وغالباً ما يسبق انفجاراً سعرياً",
          "اتجاه صاعد قوي",
          "اتجاه هابط قوي"
        ],
        correctAnswer: 1, // تقلب منخفض وغالباً ما يسبق انفجاراً سعرياً
        explanation: "ضيق النطاقات في البولينجر باندز يشير إلى هدوء السوق قبل حركة كبيرة.",
        explanationEn: "Bollinger Bands squeeze indicates market calm before a big move."
      },
      {
        id: "q18",
        question: "عندما يلامس السعر النطاق السفلي للبولينجر باندز ويرتد للأعلى، فماذا يمكن أن تكون هذه إشارة؟",
        options: [
          "ذروة شراء نسبية",
          "ذروة بيع نسبية",
          "كسر هبوطي",
          "استمرارية الاتجاه الهابط"
        ],
        correctAnswer: 1, // ذروة بيع نسبية
        explanation: "ملامسة النطاق السفلي والارتداد يشير إلى أن السعر كان في منطقة ذروة بيع.",
        explanationEn: "Touching the lower band and bouncing indicates the price was in an oversold area."
      },
      {
        id: "q19",
        question: "ما هي النسبة الذهبية في تسلسل فيبوناتشي التي تستخدم بشكل شائع في مستويات التصحيح؟",
        options: [
          "23.6%",
          "38.2%",
          "50%",
          "61.8%"
        ],
        correctAnswer: 3, // 61.8%
        explanation: "نسبة 61.8% هي النسبة الذهبية الأكثر أهمية في فيبوناتشي.",
        explanationEn: "The 61.8% ratio is the most important golden ratio in Fibonacci."
      },
      {
        id: "q20",
        question: "كيف يتم رسم مستويات فيبوناتشي التصحيحية في الاتجاه الصاعد؟",
        options: [
          "من القمة إلى القاع",
          "من القاع إلى القمة",
          "من منتصف الاتجاه",
          "بشكل عشوائي"
        ],
        correctAnswer: 1, // من القاع إلى القمة
        explanation: "في الاتجاه الصاعد، يتم رسم فيبوناتشي من القاع إلى القمة لتحديد مستويات الدعم المحتملة.",
        explanationEn: "In an uptrend, Fibonacci is drawn from low to high to identify potential support levels."
      }
    ]
  }
