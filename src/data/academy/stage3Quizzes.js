export const stage3MiniQuizzes = [
  {
    id: "stage3_mini_quiz_1",
    stageId: 3,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3 (الدعم والمقاومة، تبادل الأدوار، خطوط الاتجاه)",
    titleEn: "Mini Quiz: Lessons 1-3 (Support & Resistance, Role Reversal, Trendlines)",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "ما هو مستوى الدعم؟",
        options: [
          "منطقة سعرية يميل السعر عندها إلى التوقف عن الصعود والارتداد للأسفل.",
          "منطقة سعرية يميل السعر عندها إلى التوقف عن الهبوط والارتداد للأعلى.",
          "خط يربط بين قمتين متتاليتين.",
          "خط يربط بين قاعين متتاليين."
        ],
        correctAnswer: 1, // منطقة سعرية يميل السعر عندها إلى التوقف عن الهبوط والارتداد للأعلى.
        explanation: "مستوى الدعم هو منطقة يجد فيها المشترون القوة لمنع السعر من الانخفاض أكثر.",
        explanationEn: "A support level is an area where buyers find strength to prevent the price from falling further."
      },
      {
        id: "q2",
        question: "متى يتحول مستوى الدعم المكسور إلى مقاومة؟",
        options: [
          "عندما يرتد السعر منه للأعلى.",
          "عندما يخترق السعر هذا المستوى للأعلى.",
          "عندما يكسر السعر هذا المستوى للأسفل ثم يعود لإعادة اختباره.",
          "عندما يكون حجم التداول منخفضاً."
        ],
        correctAnswer: 2, // عندما يكسر السعر هذا المستوى للأسفل ثم يعود لإعادة اختباره.
        explanation: "هذا هو مبدأ تبادل الأدوار، حيث يتغير دور المستوى بعد كسره.",
        explanationEn: "This is the principle of role reversal, where the level's role changes after being broken."
      },
      {
        id: "q3",
        question: "ما هو الشرط الأساسي لرسم خط اتجاه صاعد صحيح؟",
        options: [
          "ربط قمتين هابطتين متتاليتين.",
          "ربط قاعين صاعدين متتاليين أو أكثر.",
          "ربط أي نقطتين على الرسم البياني.",
          "رسم خط أفقي عبر أجسام الشموع."
        ],
        correctAnswer: 1, // ربط قاعين صاعدين متتاليين أو أكثر.
        explanation: "خط الاتجاه الصاعد يربط القيعان الصاعدة.",
        explanationEn: "An uptrend line connects successive higher lows."
      },
      {
        id: "q4",
        question: "لماذا يجب التعامل مع مستويات الدعم والمقاومة كمناطق وليست خطوطاً دقيقة؟",
        options: [
          "لأن السعر دائماً ما يرتد من نقطة واحدة بالضبط.",
          "لزيادة المرونة في التداول وتقليل الاختراقات الكاذبة.",
          "لأن رسم الخطوط الدقيقة صعب جداً.",
          "لأنها لا تعكس سيكولوجية المتداولين."
        ],
        correctAnswer: 1, // لزيادة المرونة في التداول وتقليل الاختراقات الكاذبة.
        explanation: "السعر نادراً ما يرتد من نقطة واحدة، والمناطق توفر نطاقاً أكثر واقعية.",
        explanationEn: "Price rarely bounces off a single point, and zones provide a more realistic range."
      },
      {
        id: "q5",
        question: "ماذا تشير الفجوة السعرية (Gap) في اتجاه صاعد؟",
        options: [
          "ضعف في الاتجاه الصاعد",
          "انعكاس هبوطي وشيك",
          "قوة شرائية كبيرة واستمرارية الاتجاه الصاعد",
          "حيرة في السوق"
        ],
        correctAnswer: 2, // قوة شرائية كبيرة واستمرارية الاتجاه الصاعد
        explanation: "الفجوات في اتجاه قوي غالباً ما تؤكد استمرارية هذا الاتجاه.",
        explanationEn: "Gaps in a strong trend often confirm the continuation of that trend."
      },
      {
        id: "q6",
        question: "ما هو الاختراق الكاذب (False Breakout)؟",
        options: [
          "عندما يخترق السعر مستوى ثم يواصل حركته بقوة.",
          "عندما يتجاوز السعر مستوى الدعم أو المقاومة لفترة وجيزة ثم يعود بسرعة.",
          "عندما يرتد السعر من مستوى الدعم أو المقاومة.",
          "عندما يكون حجم التداول عالياً جداً."
        ],
        correctAnswer: 1, // عندما يتجاوز السعر مستوى الدعم أو المقاومة لفترة وجيزة ثم يعود بسرعة.
        explanation: "الاختراقات الكاذبة تخدع المتداولين وتؤدي إلى خسائر إذا لم يتم التعامل معها بحذر.",
        explanationEn: "False breakouts deceive traders and lead to losses if not handled carefully."
      },
      {
        id: "q7",
        question: "ما الذي يزيد من موثوقية خط الاتجاه؟",
        options: [
          "رسمه على إطار زمني صغير.",
          "عدد مرات قليلة لارتداد السعر منه.",
          "صموده لفترة زمنية طويلة وارتداد السعر منه عدة مرات.",
          "زاوية ميل شديدة الانحدار."
        ],
        correctAnswer: 2, // صموده لفترة زمنية طويلة وارتداد السعر منه عدة مرات.
        explanation: "القوة تأتي من التفاعل المتكرر للسعر مع الخط على مدى فترة طويلة.",
        explanationEn: "Strength comes from repeated price interaction with the line over a long period."
      },
      {
        id: "q8",
        question: "أي من الطرق التالية لا تستخدم لتحديد مستويات الدعم والمقاومة؟",
        options: [
          "القمم والقيعان السابقة.",
          "الأرقام المستديرة.",
          "لون الشمعة التالية.",
          "مستويات فيبوناتشي."
        ],
        correctAnswer: 2, // لون الشمعة التالية.
        explanation: "لون الشمعة التالية لا يحدد مستويات الدعم والمقاومة، بل هو نتيجة للتفاعل معها.",
        explanationEn: "The color of the next candle does not determine support and resistance levels, but is a result of interaction with them."
      },
      {
        id: "q9",
        question: "ماذا يعني كسر خط الاتجاه الصاعد للأسفل؟",
        options: [
          "تأكيد على استمرارية الاتجاه الصاعد.",
          "إشارة إلى أن المشترين يفقدون السيطرة وقد يبدأ اتجاه هابط أو عرضي.",
          "فرصة قوية للشراء.",
          "لا يوجد له أي دلالة."
        ],
        correctAnswer: 1, // إشارة إلى أن المشترين يفقدون السيطرة وقد يبدأ اتجاه هابط أو عرضي.
        explanation: "كسر خط الاتجاه الصاعد هو إشارة تحذيرية لتغير محتمل في الاتجاه.",
        explanationEn: "A break below an uptrend line is a warning sign of a potential trend change."
      },
      {
        id: "q10",
        question: "ما هي الأهمية النفسية للأرقام المستديرة (مثل 1.20000) في التداول؟",
        options: [
          "لا يوجد لها أهمية.",
          "تعمل كمستويات دعم ومقاومة نفسية قوية يميل المتداولون لوضع أوامرهم عندها.",
          "تشير دائماً إلى انعكاس وشيك.",
          "تستخدم فقط في تداول العملات الرقمية."
        ],
        correctAnswer: 1, // تعمل كمستويات دعم ومقاومة نفسية قوية يميل المتداولون لوضع أوامرهم عندها.
        explanation: "الأرقام المستديرة تجذب انتباه المتداولين وتؤثر على قراراتهم.",
        explanationEn: "Round numbers attract traders' attention and influence their decisions."
      }
    ]
  }
];

export const stage3FinalExam = {
  id: "stage3_final_exam",
  stageId: 3,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 3: مستويات الدعم والمقاومة",
  titleEn: "Final Exam - Stage 3: Support and Resistance Levels",
  description: "اختبار شامل للمرحلة الثالثة من التحليل الفني. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "ما هو مستوى المقاومة؟",
      options: [
        "منطقة سعرية يميل السعر عندها إلى التوقف عن الهبوط والارتداد للأعلى.",
        "منطقة سعرية يميل السعر عندها إلى التوقف عن الصعود والارتداد للأسفل.",
        "خط يربط بين قاعين متتاليين.",
        "خط يربط بين قمتين متتاليتين."
      ],
      correctAnswer: 1, // منطقة سعرية يميل السعر عندها إلى التوقف عن الصعود والارتداد للأسفل.
      explanation: "مستوى المقاومة هو منطقة يجد فيها البائعون القوة لمنع السعر من الارتفاع أكثر.",
      explanationEn: "A resistance level is an area where sellers find strength to prevent the price from rising further."
    },
    {
      id: "q2",
      question: "ماذا يحدث لمستوى المقاومة المخترق؟",
      options: [
        "يظل مقاومة قوية.",
        "يتحول إلى مستوى دعم.",
        "يختفي من الرسم البياني.",
        "يصبح منطقة حيرة."
      ],
      correctAnswer: 1, // يتحول إلى مستوى دعم.
      explanation: "هذا هو مبدأ تبادل الأدوار، حيث يتغير دور المستوى بعد اختراقه.",
      explanationEn: "This is the principle of role reversal, where the level's role changes after being breached."
    },
    {
      id: "q3",
      question: "ما هو الشرط الأساسي لرسم خط اتجاه هابط صحيح؟",
      options: [
        "ربط قاعين صاعدين متتاليين.",
        "ربط قمتين هابطتين متتاليتين أو أكثر.",
        "ربط أي نقطتين على الرسم البياني.",
        "رسم خط أفقي عبر ظلال الشموع."
      ],
      correctAnswer: 1, // ربط قمتين هابطتين متتاليتين أو أكثر.
      explanation: "خط الاتجاه الهابط يربط القمم الهابطة.",
      explanationEn: "A downtrend line connects successive lower highs."
    },
    {
      id: "q4",
      question: "أي من العوامل التالية يزيد من قوة مستوى الدعم أو المقاومة؟",
      options: [
        "ظهوره على إطار زمني صغير.",
        "عدد مرات قليلة لارتداد السعر منه.",
        "تفاعل السعر معه عدة مرات على إطار زمني كبير.",
        "كونه خطاً دقيقاً وليس منطقة."
      ],
      correctAnswer: 2, // تفاعل السعر معه عدة مرات على إطار زمني كبير.
      explanation: "كلما زاد تفاعل السعر مع المستوى وزادت المدة الزمنية، زادت قوته.",
      explanationEn: "The more the price interacts with the level and the longer the timeframe, the stronger it becomes."
    },
    {
      id: "q5",
      question: "ما هي سيكولوجية المتداولين عند كسر مستوى دعم قوي؟",
      options: [
        "المشترون يزيدون من صفقات الشراء.",
        "البائعون يغلقون صفقاتهم البيعية.",
        "المشترون العالقون يبيعون للخروج بأقل خسارة، والبائعون الجدد يدخلون.",
        "لا يوجد أي تأثير نفسي."
      ],
      correctAnswer: 2, // المشترون العالقون يبيعون للخروج بأقل خسارة، والبائعون الجدد يدخلون.
      explanation: "هذا التفاعل النفسي هو ما يحول الدعم المكسور إلى مقاومة.",
      explanationEn: "This psychological interaction is what turns broken support into resistance."
    },
    {
      id: "q6",
      question: "كيف يمكن تأكيد الاختراق الحقيقي لخط الاتجاه؟",
      options: [
          "بمجرد أن يلمس السعر الخط.",
          "بإغلاق شمعة كاملة فوق (أو تحت) الخط وبحجم تداول عالٍ.",
          "عندما يكون السعر متذبذباً.",
          "فقط على الإطارات الزمنية الصغيرة."
      ],
      correctAnswer: 1, // بإغلاق شمعة كاملة فوق (أو تحت) الخط وبحجم تداول عالٍ.
      explanation: "التأكيد يقلل من احتمالية الاختراقات الكاذبة.",
      explanationEn: "Confirmation reduces the likelihood of false breakouts."
    },
    {
      id: "q7",
      question: "أي من هذه الأدوات يمكن أن تعمل كدعم ومقاومة ديناميكية؟",
      options: [
        "القمم والقيعان السابقة.",
        "الأرقام المستديرة.",
        "المتوسطات المتحركة وخطوط الاتجاه.",
        "أنماط الشموع اليابانية."
      ],
      correctAnswer: 2, // المتوسطات المتحركة وخطوط الاتجاه.
      explanation: "هذه الأدوات تتغير قيمتها مع حركة السعر، لذا فهي ديناميكية.",
      explanationEn: "These tools change their values with price movement, so they are dynamic."
    },
    {
      id: "q8",
      question: "ماذا يعني مبدأ تبادل الأدوار (Role Reversal)؟",
      options: [
        "أن الدعم والمقاومة لا يتغيران أبداً.",
        "أن الدعم المكسور يصبح مقاومة، والمقاومة المخترقة تصبح دعماً.",
        "أن السعر يتحرك دائماً في اتجاه واحد.",
        "أن المتداولين يغيرون استراتيجياتهم بشكل عشوائي."
      ],
      correctAnswer: 1, // أن الدعم المكسور يصبح مقاومة، والمقاومة المخترقة تصبح دعماً.
      explanation: "هذا المبدأ أساسي لفهم سلوك السعر بعد اختراق المستويات.",
      explanationEn: "This principle is fundamental to understanding price behavior after level breaches."
    },
    {
      id: "q9",
      question: "ما هي الأهمية الرئيسية لخطوط الاتجاه؟",
      options: [
        "تحديد نقاط الدخول والخروج بدقة 100%.",
        "تحديد الاتجاه العام للسوق وتعمل كدعم ومقاومة ديناميكية.",
        "التنبؤ بالمستقبل بشكل مؤكد.",
        "استبدال جميع أدوات التحليل الفني الأخرى."
      ],
      correctAnswer: 1, // تحديد الاتجاه العام للسوق وتعمل كدعم ومقاومة ديناميكية.
      explanation: "خطوط الاتجاه هي أداة قوية لتحديد الاتجاهات وتوفير مستويات تفاعل محتملة.",
      explanationEn: "Trendlines are a powerful tool for identifying trends and providing potential interaction levels."
    },
    {
      id: "q10",
      question: "متى تكون خطوط الاتجاه شديدة الانحدار (عمودية تقريباً)؟",
      options: [
        "أكثر استدامة وموثوقية.",
        "غالباً ما تكون غير مستدامة وتُكسر بسرعة.",
        "تشير إلى اتجاه عرضي.",
        "تستخدم فقط في الأسواق الهادئة."
      ],
      correctAnswer: 1, // غالباً ما تكون غير مستدامة وتُكسر بسرعة.
      explanation: "الحركات السعرية السريعة جداً نادراً ما تستمر طويلاً.",
      explanationEn: "Very rapid price movements rarely last long."
    },
    {
      id: "q11",
      question: "أي من هذه المستويات يعتبر مستوى دعم ومقاومة نفسية قوية؟",
      options: [
        "القمم والقيعان العشوائية.",
        "الأرقام المستديرة (مثل 1.50000).",
        "الأسعار التي تتغير باستمرار.",
        "الأسعار التي لا يتفاعل معها المتداولون."
      ],
      correctAnswer: 1, // الأرقام المستديرة (مثل 1.50000).
      explanation: "الأرقام المستديرة لها تأثير نفسي كبير على قرارات المتداولين.",
      explanationEn: "Round numbers have a significant psychological impact on traders' decisions."
    },
    {
      id: "q12",
      question: "ماذا يعني مصطلح 'إعادة الاختبار' (Retest) بعد كسر خط الاتجاه؟",
      options: [
        "أن السعر لن يعود أبداً إلى الخط المكسور.",
        "أن السعر يعود ليلمس الخط المكسور مرة أخرى قبل أن يواصل حركته في الاتجاه الجديد.",
        "أن الخط المكسور لم يكن مهماً في الأساس.",
        "أن المتداولين يجب أن يدخلوا الصفقة فور الكسر."
      ],
      correctAnswer: 1, // أن السعر يعود ليلمس الخط المكسور مرة أخرى قبل أن يواصل حركته في الاتجاه الجديد.
      explanation: "إعادة الاختبار توفر فرصة دخول ثانية وتأكيداً للكسر.",
      explanationEn: "A retest provides a second entry opportunity and confirmation of the break."
    },
    {
      id: "q13",
      question: "ما هي أفضل طريقة لرسم خطوط الاتجاه؟",
      options: [
        "ربط أجسام الشموع فقط.",
        "ربط ظلال الشموع (Wicks) لتمثيل أقصى مدى وصل إليه السعر.",
        "رسمها بشكل عشوائي.",
        "تجاهل الشموع تماماً."
      ],
      correctAnswer: 1, // ربط ظلال الشموع (Wicks) لتمثيل أقصى مدى وصل إليه السعر.
      explanation: "الظلال تمثل أقصى نقاط وصل إليها السعر، وهي أكثر دقة في تحديد المستويات.",
      explanationEn: "Wicks represent the extreme points reached by the price, and are more accurate in identifying levels."
    },
    {
      id: "q14",
      question: "لماذا يجب استخدام خطوط الاتجاه مع أدوات تحليل فني أخرى؟",
      options: [
        "لجعل التحليل أكثر تعقيداً.",
        "لزيادة موثوقية الإشارات وتقليل المخاطر.",
        "لأن خطوط الاتجاه وحدها غير مفيدة.",
        "لإضاعة الوقت في التحليل."
      ],
      correctAnswer: 1, // لزيادة موثوقية الإشارات وتقليل المخاطر.
      explanation: "التأكيد من أدوات متعددة يعزز قوة إشارة التداول.",
      explanationEn: "Confirmation from multiple tools enhances the strength of a trading signal."
    },
    {
      id: "q15",
      question: "ماذا يشير خط الاتجاه العرضي (Sideways Trend Line)؟",
      options: [
        "اتجاه صاعد قوي.",
        "اتجاه هابط قوي.",
        "فترة من التوحيد أو التذبذب حيث لا يوجد اتجاه واضح.",
        "انعكاس وشيك في الاتجاه."
      ],
      correctAnswer: 2, // فترة من التوحيد أو التذبذب حيث لا يوجد اتجاه واضح.
      explanation: "يشير إلى أن المشترين والبائعين في حالة توازن مؤقت.",
      explanationEn: "Indicates that buyers and sellers are in a temporary state of balance."
    },
    {
      id: "q16",
      question: "ما هي سيكولوجية المتداولين عند اختراق مستوى مقاومة قوي؟",
      options: [
        "البائعون يزيدون من صفقات البيع.",
        "المشترون يغلقون صفقاتهم الشرائية.",
        "البائعون العالقون يشترون للخروج بأقل خسارة، والمشترون الجدد يدخلون.",
        "لا يوجد أي تأثير نفسي."
      ],
      correctAnswer: 2, // البائعون العالقون يشترون للخروج بأقل خسارة، والمشترون الجدد يدخلون.
      explanation: "هذا التفاعل النفسي هو ما يحول المقاومة المخترقة إلى دعم.",
      explanationEn: "This psychological interaction is what turns broken resistance into support."
    },
    {
      id: "q17",
      question: "ما هو الفرق بين الدعم والمقاومة الثابتة والديناميكية؟",
      options: [
        "الثابتة تتغير باستمرار، والديناميكية ثابتة.",
        "الثابتة هي القمم والقيعان الأفقية، والديناميكية هي خطوط الاتجاه والمتوسطات المتحركة.",
        "لا يوجد فرق بينهما.",
        "الثابتة تستخدم في الإطارات الزمنية الكبيرة فقط، والديناميكية في الصغيرة."
      ],
      correctAnswer: 1, // الثابتة هي القمم والقيعان الأفقية، والديناميكية هي خطوط الاتجاه والمتوسطات المتحركة.
      explanation: "الثابتة لا تتغير قيمتها إلا عند كسرها، بينما الديناميكية تتغير مع حركة السعر.",
      explanationEn: "Static levels do not change their value unless broken, while dynamic levels change with price movement."
    },
    {
      id: "q18",
      question: "متى يكون خط الاتجاه الصاعد غير مستدام؟",
      options: [
        "عندما يكون ميله معتدلاً.",
        "عندما يرتد السعر منه عدة مرات.",
        "عندما يكون شديد الانحدار (عمودي تقريباً).",
        "عندما يكون على إطار زمني كبير."
      ],
      correctAnswer: 2, // عندما يكون شديد الانحدار (عمودي تقريباً).
      explanation: "خطوط الاتجاه شديدة الانحدار تشير إلى حركة سعرية مبالغ فيها غالباً ما تنتهي بتصحيح أو انعكاس.",
      explanationEn: "Very steep trendlines indicate an exaggerated price movement that often ends in a correction or reversal."
    },
    {
      id: "q19",
      question: "ما هي أهمية استخدام الإطارات الزمنية الأكبر عند رسم خطوط الاتجاه؟",
      options: [
        "لأنها تظهر المزيد من الاختراقات الكاذبة.",
        "لأنها تجعل الخطوط أقل موثوقية.",
        "لأن الخطوط المرسومة عليها تكون أقوى وأكثر موثوقية.",
        "لأنها لا تظهر الاتجاه العام للسوق."
      ],
      correctAnswer: 2, // لأن الخطوط المرسومة عليها تكون أقوى وأكثر موثوقية.
      explanation: "الإطارات الزمنية الأكبر تقلل من ضوضاء السوق وتظهر الاتجاهات الحقيقية.",
      explanationEn: "Larger timeframes reduce market noise and reveal true trends."
    },
    {
      id: "q20",
      question: "ماذا يجب أن تفعل بعد كسر خط الاتجاه وقبل الدخول في صفقة؟",
      options: [
        "الدخول فوراً في الصفقة.",
        "تجاهل الكسر تماماً.",
        "انتظار التأكيد من إغلاق الشمعة وحجم التداول وربما إعادة الاختبار.",
        "الاعتماد على مؤشر واحد فقط."
      ],
      correctAnswer: 2, // انتظار التأكيد من إغلاق الشمعة وحجم التداول وربما إعادة الاختبار.
      explanation: "الصبر والانتظار للتأكيد يقلل من المخاطر ويزيد من فرص النجاح.",
      explanationEn: "Patience and waiting for confirmation reduce risks and increase success rates."
    }
  ]
};
