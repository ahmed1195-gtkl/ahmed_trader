export const stage1MiniQuizzes = [
  {
    id: "stage1_mini_quiz_1",
    stageId: 1,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3 (مقدمة التحليل الفني والرسوم البيانية والشموع الأساسية)",
    titleEn: "Mini Quiz: Lessons 1-3 (Intro to TA, Charts & Basic Candlesticks)",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "ما هو المبدأ الأساسي للتحليل الفني الذي ينص على أن جميع المعلومات ذات الصلة تنعكس في سعر الأصل؟",
        options: [
          "التاريخ يعيد نفسه",
          "الأسعار تتحرك في اتجاهات",
          "السعر يخصم كل شيء",
          "التحليل الأساسي هو الأهم"
        ],
        correctAnswer: 2, // السعر يخصم كل شيء
        explanation: "هذا هو المبدأ المحوري للتحليل الفني، حيث يفترض أن كل ما يؤثر على السعر قد تم تضمينه فيه بالفعل.",
        explanationEn: "This is the pivotal principle of technical analysis, assuming that everything affecting price has already been incorporated into it."
      },
      {
        id: "q2",
        question: "أي من أنواع الرسوم البيانية التالية هو الأكثر شيوعاً وتفصيلاً بين المتداولين المحترفين؟",
        options: [
          "الرسم البياني الخطي (Line Chart)",
          "الرسم البياني الشريطي (Bar Chart)",
          "الرسم البياني الشموع اليابانية (Candlestick Chart)",
          "الرسم البياني النقطي (Point and Figure Chart)"
        ],
        correctAnswer: 2, // الرسم البياني الشموع اليابانية
        explanation: "الشموع اليابانية توفر معلومات غنية عن أسعار الفتح والإغلاق والأعلى والأدنى، بالإضافة إلى سيكولوجية السوق.",
        explanationEn: "Japanese candlesticks provide rich information about open, close, high, and low prices, as well as market psychology."
      },
      {
        id: "q3",
        question: "ماذا تمثل الظلال (Wicks/Shadows) في الشمعة اليابانية؟",
        options: [
          "سعر الفتح والإغلاق",
          "أعلى وأدنى سعر وصل إليه السعر خلال الفترة",
          "حجم التداول",
          "قوة المشترين والبائعين"
        ],
        correctAnswer: 1, // أعلى وأدنى سعر وصل إليه السعر خلال الفترة
        explanation: "الظلال تظهر أقصى مدى وصل إليه السعر، مما يعكس التقلبات خلال الفترة.",
        explanationEn: "Wicks show the extreme range reached by the price, reflecting volatility during the period."
      },
      {
        id: "q4",
        question: "إذا رأيت شمعة مطرقة (Hammer) في نهاية اتجاه هابط، فماذا يمكن أن تشير إليه؟",
        options: [
          "استمرارية الاتجاه الهابط",
          "احتمالية انعكاس صعودي",
          "حيرة في السوق",
          "قوة البائعين"
        ],
        correctAnswer: 1, // احتمالية انعكاس صعودي
        explanation: "شمعة المطرقة هي نمط انعكاسي صعودي قوي يظهر بعد اتجاه هابط.",
        explanationEn: "A Hammer candlestick is a strong bullish reversal pattern that appears after a downtrend."
      },
      {
        id: "q5",
        question: "ما هو الفرق الرئيسي بين التحليل الفني والتحليل الأساسي؟",
        options: [
          "التحليل الفني يركز على الأخبار، الأساسي على الرسوم البيانية",
          "التحليل الفني يركز على حركة السعر، الأساسي على القيمة الجوهرية",
          "لا يوجد فرق جوهري",
          "التحليل الفني يستخدم فقط في الأسهم"
        ],
        correctAnswer: 1, // التحليل الفني يركز على حركة السعر، الأساسي على القيمة الجوهرية
        explanation: "التحليل الفني يدرس السعر نفسه، بينما الأساسي يدرس العوامل الاقتصادية والمالية.",
        explanationEn: "Technical analysis studies price itself, while fundamental analysis studies economic and financial factors."
      },
      {
        id: "q6",
        question: "ماذا يعني مبدأ 'التاريخ يعيد نفسه' في التحليل الفني؟",
        options: [
          "الأسعار ستتكرر بنفس الأرقام بالضبط",
          "الأنماط السعرية وسلوك المتداولين يميلان للتكرار",
          "لا علاقة له بسيكولوجية السوق",
          "يستخدم فقط في الأسواق القديمة"
        ],
        correctAnswer: 1, // الأنماط السعرية وسلوك المتداولين يميلان للتكرار
        explanation: "هذا المبدأ يعكس الطبيعة البشرية المتكررة في السوق (الخوف والطمع).",
        explanationEn: "This principle reflects the repetitive human nature in the market (fear and greed)."
      },
      {
        id: "q7",
        question: "إذا كان سعر الإغلاق أعلى من سعر الفتح في شمعة يابانية، فماذا يسمى الجسم الحقيقي لهذه الشمعة؟",
        options: [
          "جسم هابط (Bearish Body)",
          "جسم صعودي (Bullish Body)",
          "دوجي (Doji)",
          "ماروبوزو (Marubozu)"
        ],
        correctAnswer: 1, // جسم صعودي (Bullish Body)
        explanation: "الشمعة الصعودية تشير إلى سيطرة المشترين خلال الفترة.",
        explanationEn: "A bullish candle indicates buyer dominance during the period."
      },
      {
        id: "q8",
        question: "ما هو الإطار الزمني الذي يفضله المتداول المتأرجح (Swing Trader) عادةً؟",
        options: [
          "1 دقيقة",
          "5 دقائق",
          "ساعة أو 4 ساعات أو يومي",
          "شهري"
        ],
        correctAnswer: 2, // ساعة أو 4 ساعات أو يومي
        explanation: "المتداول المتأرجح يركز على حركات الأسعار متوسطة الأجل.",
        explanationEn: "Swing traders focus on medium-term price movements."
      },
      {
        id: "q9",
        question: "ماذا تشير شمعة الدوجي (Doji)؟",
        options: [
          "اتجاه صعودي قوي",
          "اتجاه هبوطي قوي",
          "حيرة وعدم يقين في السوق",
          "استمرارية الاتجاه"
        ],
        correctAnswer: 2, // حيرة وعدم يقين في السوق
        explanation: "الدوجي تعني أن المشترين والبائعين متساويون في القوة خلال الفترة.",
        explanationEn: "Doji means buyers and sellers are equally matched in strength during the period."
      },
      {
        id: "q10",
        question: "لماذا يعتبر حجم التداول (Volume) مهماً في التحليل الفني؟",
        options: [
          "لأنه يحدد سعر الفتح والإغلاق",
          "لأنه يؤكد قوة حركة السعر والاتجاه",
          "لأنه يحل محل المؤشرات الفنية الأخرى",
          "لأنه لا يؤثر على التحليل الفني"
        ],
        correctAnswer: 1, // لأنه يؤكد قوة حركة السعر والاتجاه
        explanation: "حجم التداول العالي مع حركة سعرية قوية يؤكد صحة الحركة.",
        explanationEn: "High trading volume with strong price movement confirms the validity of the move."
      }
    ]
  }
];

export const stage1FinalExam = {
  id: "stage1_final_exam",
  stageId: 1,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 1: التحليل الفني الأساسي",
  titleEn: "Final Exam - Stage 1: Basic Technical Analysis",
  description: "اختبار شامل للمرحلة الأولى من التحليل الفني. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "ما هو المبدأ الأساسي للتحليل الفني الذي ينص على أن جميع المعلومات ذات الصلة تنعكس في سعر الأصل؟",
      options: [
        "التاريخ يعيد نفسه",
        "الأسعار تتحرك في اتجاهات",
        "السعر يخصم كل شيء",
        "التحليل الأساسي هو الأهم"
      ],
      correctAnswer: 2, // السعر يخصم كل شيء
      explanation: "هذا هو المبدأ المحوري للتحليل الفني، حيث يفترض أن كل ما يؤثر على السعر قد تم تضمينه فيه بالفعل.",
      explanationEn: "This is the pivotal principle of technical analysis, assuming that everything affecting price has already been incorporated into it."
    },
    {
      id: "q2",
      question: "أي من أنواع الرسوم البيانية التالية هو الأكثر شيوعاً وتفصيلاً بين المتداولين المحترفين؟",
      options: [
        "الرسم البياني الخطي (Line Chart)",
        "الرسم البياني الشريطي (Bar Chart)",
        "الرسم البياني الشموع اليابانية (Candlestick Chart)",
        "الرسم البياني النقطي (Point and Figure Chart)"
      ],
      correctAnswer: 2, // الرسم البياني الشموع اليابانية
      explanation: "الشموع اليابانية توفر معلومات غنية عن أسعار الفتح والإغلاق والأعلى والأدنى، بالإضافة إلى سيكولوجية السوق.",
      explanationEn: "Japanese candlesticks provide rich information about open, close, high, and low prices, as well as market psychology."
    },
    {
      id: "q3",
      question: "ماذا تمثل الظلال (Wicks/Shadows) في الشمعة اليابانية؟",
      options: [
        "سعر الفتح والإغلاق",
        "أعلى وأدنى سعر وصل إليه السعر خلال الفترة",
        "حجم التداول",
        "قوة المشترين والبائعين"
      ],
      correctAnswer: 1, // أعلى وأدنى سعر وصل إليه السعر خلال الفترة
      explanation: "الظلال تظهر أقصى مدى وصل إليه السعر، مما يعكس التقلبات خلال الفترة.",
      explanationEn: "Wicks show the extreme range reached by the price, reflecting volatility during the period."
    },
    {
      id: "q4",
      question: "إذا رأيت شمعة مطرقة (Hammer) في نهاية اتجاه هابط، فماذا يمكن أن تشير إليه؟",
      options: [
        "استمرارية الاتجاه الهابط",
        "احتمالية انعكاس صعودي",
        "حيرة في السوق",
        "قوة البائعين"
      ],
      correctAnswer: 1, // احتمالية انعكاس صعودي
      explanation: "شمعة المطرقة هي نمط انعكاسي صعودي قوي يظهر بعد اتجاه هابط.",
      explanationEn: "A Hammer candlestick is a strong bullish reversal pattern that appears after a downtrend."
    },
    {
      id: "q5",
      question: "ما هو الفرق الرئيسي بين التحليل الفني والتحليل الأساسي؟",
      options: [
        "التحليل الفني يركز على الأخبار، الأساسي على الرسوم البيانية",
        "التحليل الفني يركز على حركة السعر، الأساسي على القيمة الجوهرية",
        "لا يوجد فرق جوهري",
        "التحليل الفني يستخدم فقط في الأسهم"
      ],
      correctAnswer: 1, // التحليل الفني يركز على حركة السعر، الأساسي على القيمة الجوهرية
      explanation: "التحليل الفني يدرس السعر نفسه، بينما الأساسي يدرس العوامل الاقتصادية والمالية.",
      explanationEn: "Technical analysis studies price itself, while fundamental analysis studies economic and financial factors."
    },
    {
      id: "q6",
      question: "ماذا يعني مبدأ 'التاريخ يعيد نفسه' في التحليل الفني؟",
      options: [
        "الأسعار ستتكرر بنفس الأرقام بالضبط",
        "الأنماط السعرية وسلوك المتداولين يميلان للتكرار",
        "لا علاقة له بسيكولوجية السوق",
        "يستخدم فقط في الأسواق القديمة"
      ],
      correctAnswer: 1, // الأنماط السعرية وسلوك المتداولين يميلان للتكرار
      explanation: "هذا المبدأ يعكس الطبيعة البشرية المتكررة في السوق (الخوف والطمع).",
      explanationEn: "This principle reflects the repetitive human nature in the market (fear and greed)."
    },
    {
      id: "q7",
      question: "إذا كان سعر الإغلاق أعلى من سعر الفتح في شمعة يابانية، فماذا يسمى الجسم الحقيقي لهذه الشمعة؟",
      options: [
        "جسم هابط (Bearish Body)",
        "جسم صعودي (Bullish Body)",
        "دوجي (Doji)",
        "ماروبوزو (Marubozu)"
      ],
      correctAnswer: 1, // جسم صعودي (Bullish Body)
      explanation: "الشمعة الصعودية تشير إلى سيطرة المشترين خلال الفترة.",
      explanationEn: "A bullish candle indicates buyer dominance during the period."
    },
    {
      id: "q8",
      question: "ما هو الإطار الزمني الذي يفضله المتداول المتأرجح (Swing Trader) عادةً؟",
      options: [
        "1 دقيقة",
        "5 دقائق",
        "ساعة أو 4 ساعات أو يومي",
        "شهري"
      ],
      correctAnswer: 2, // ساعة أو 4 ساعات أو يومي
      explanation: "المتداول المتأرجح يركز على حركات الأسعار متوسطة الأجل.",
      explanationEn: "Swing traders focus on medium-term price movements."
    },
    {
      id: "q9",
      question: "ماذا تشير شمعة الدوجي (Doji)؟",
      options: [
        "اتجاه صعودي قوي",
        "اتجاه هبوطي قوي",
        "حيرة وعدم يقين في السوق",
        "استمرارية الاتجاه"
      ],
      correctAnswer: 2, // حيرة وعدم يقين في السوق
      explanation: "الدوجي تعني أن المشترين والبائعين متساويون في القوة خلال الفترة.",
      explanationEn: "Doji means buyers and sellers are equally matched in strength during the period."
    },
    {
      id: "q10",
      question: "لماذا يعتبر حجم التداول (Volume) مهماً في التحليل الفني؟",
      options: [
        "لأنه يحدد سعر الفتح والإغلاق",
        "لأنه يؤكد قوة حركة السعر والاتجاه",
        "لأنه يحل محل المؤشرات الفنية الأخرى",
        "لأنه لا يؤثر على التحليل الفني"
      ],
      correctAnswer: 1, // لأنه يؤكد قوة حركة السعر والاتجاه
      explanation: "حجم التداول العالي مع حركة سعرية قوية يؤكد صحة الحركة.",
      explanationEn: "High trading volume with strong price movement confirms the validity of the move."
    },
    {
      id: "q11",
      question: "ما هو نوع الشمعة اليابانية التي تتميز بجسم صغير في الجزء السفلي وظل علوي طويل، وتظهر في نهاية الاتجاه الصاعد؟",
      options: [
        "المطرقة (Hammer)",
        "الرجل المشنوق (Hanging Man)",
        "الشهاب (Shooting Star)",
        "المطرقة المقلوبة (Inverted Hammer)"
      ],
      correctAnswer: 2, // الشهاب (Shooting Star)
      explanation: "الشهاب هي شمعة انعكاسية هبوطية تظهر في نهاية الاتجاه الصاعد.",
      explanationEn: "A Shooting Star is a bearish reversal candle that appears at the end of an uptrend."
    },
    {
      id: "q12",
      question: "ماذا يعني 'تحليل الإطارات الزمنية المتعددة'؟",
      options: [
        "التركيز على إطار زمني واحد فقط",
        "تحليل السوق على إطارات زمنية مختلفة (كبير ثم صغير)",
        "تجاهل الإطارات الزمنية تماماً",
        "استخدام إطارات زمنية عشوائية"
      ],
      correctAnswer: 1, // تحليل السوق على إطارات زمنية مختلفة (كبير ثم صغير)
      explanation: "يساعد تحليل الإطارات الزمنية المتعددة على تحديد الاتجاه العام وتوقيت الدخول الدقيق.",
      explanationEn: "Multiple timeframe analysis helps identify the overall trend and precise entry timing."
    },
    {
      id: "q13",
      question: "أي من المبادئ التالية لا ينتمي إلى التحليل الفني؟",
      options: [
        "السعر يخصم كل شيء",
        "الأسعار تتحرك في اتجاهات",
        "التاريخ يعيد نفسه",
        "البيانات الاقتصادية هي المحرك الوحيد للسوق"
      ],
      correctAnswer: 3, // البيانات الاقتصادية هي المحرك الوحيد للسوق
      explanation: "التحليل الفني يفترض أن كل شيء ينعكس في السعر، ولا يركز على البيانات الاقتصادية بشكل مباشر.",
      explanationEn: "Technical analysis assumes everything is reflected in price, and does not directly focus on economic data."
    },
    {
      id: "q14",
      question: "ماذا يمثل 'الجسم الحقيقي' (Real Body) في الشمعة اليابانية؟",
      options: [
        "أعلى وأدنى سعر",
        "سعر الفتح والإغلاق",
        "حجم التداول",
        "التقلب"
      ],
      correctAnswer: 1, // سعر الفتح والإغلاق
      explanation: "الجسم الحقيقي يوضح العلاقة بين سعر الفتح والإغلاق، مما يعكس سيطرة المشترين أو البائعين.",
      explanationEn: "The real body shows the relationship between open and close prices, reflecting buyer or seller dominance."
    },
    {
      id: "q15",
      question: "إذا رأيت شمعة 'ماروبوزو' (Marubozu) صعودية، فماذا تشير؟",
      options: [
        "حيرة في السوق",
        "ضعف في الاتجاه الصعودي",
        "سيطرة قوية جداً للمشترين واستمرارية الاتجاه",
        "احتمالية انعكاس هبوطي"
      ],
      correctAnswer: 2, // سيطرة قوية جداً للمشترين واستمرارية الاتجاه
      explanation: "الماروبوزو الصعودية تدل على قوة شرائية ساحقة خلال الفترة.",
      explanationEn: "A bullish Marubozu indicates overwhelming buying power during the period."
    },
    {
      id: "q16",
      question: "ما هي أهمية التحليل الفني في إدارة المخاطر؟",
      options: [
        "لا علاقة له بإدارة المخاطر",
        "يساعد على تحديد مستويات وقف الخسارة وجني الأرباح بشكل منطقي",
        "يزيد من حجم المخاطرة",
        "يجعل التداول مضموناً"
      ],
      correctAnswer: 1, // يساعد على تحديد مستويات وقف الخسارة وجني الأرباح بشكل منطقي
      explanation: "من خلال تحديد مستويات الدعم والمقاومة، يمكن للمتداول وضع أوامر وقف الخسارة بشكل فعال.",
      explanationEn: "By identifying support and resistance levels, traders can effectively place stop-loss orders."
    },
    {
      id: "q17",
      question: "ما هو الرسم البياني الذي يربط فقط نقاط الإغلاق للسعر؟",
      options: [
        "الشموع اليابانية",
        "الشريطي",
        "الخطي",
        "الرينكو"
      ],
      correctAnswer: 2, // الخطي
      explanation: "الرسم البياني الخطي يعطي رؤية مبسطة للاتجاه العام بالتركيز على أسعار الإغلاق.",
      explanationEn: "A line chart provides a simplified view of the overall trend by focusing on closing prices."
    },
    {
      id: "q18",
      question: "إذا رأيت شمعة 'الشهاب' (Shooting Star) في نهاية اتجاه صاعد، فماذا يمكن أن تشير إليه؟",
      options: [
        "استمرارية الاتجاه الصعودي",
        "احتمالية انعكاس هبوطي",
        "قوة المشترين",
        "حيرة في السوق"
      ],
      correctAnswer: 1, // احتمالية انعكاس هبوطي
      explanation: "الشهاب هي شمعة انعكاسية هبوطية تظهر في نهاية الاتجاه الصاعد.",
      explanationEn: "A Shooting Star is a bearish reversal candle that appears at the end of an uptrend."
    },
    {
      id: "q19",
      question: "ما هي أهمية 'حجم التداول' (Volume) في التحليل الفني؟",
      options: [
        "يحدد لون الشمعة",
        "يؤكد قوة أو ضعف حركة السعر والاتجاه",
        "يحدد الإطار الزمني للرسم البياني",
        "لا يستخدمه المحللون الفنيون"
      ],
      correctAnswer: 1, // يؤكد قوة أو ضعف حركة السعر والاتجاه
      explanation: "حجم التداول يعطي مصداقية للحركات السعرية. حركة قوية بحجم عالٍ تكون أكثر أهمية.",
      explanationEn: "Volume adds credibility to price movements. A strong move with high volume is more significant."
    },
    {
      id: "q20",
      question: "ماذا يعني أن 'السعر يخصم كل شيء'؟",
      options: [
        "السعر لا يتأثر بأي عوامل خارجية",
        "جميع المعلومات المعروفة وغير المعروفة تنعكس بالفعل في السعر",
        "السعر يتأثر فقط بالأخبار الاقتصادية",
        "السعر يتحرك بشكل عشوائي تماماً"
      ],
      correctAnswer: 1, // جميع المعلومات المعروفة وغير المعروفة تنعكس بالفعل في السعر
      explanation: "هذا المبدأ يعني أن الرسم البياني هو المصدر الوحيد الذي تحتاجه لتحليل السوق.",
      explanationEn: "This principle means that the chart is the only source you need to analyze the market."
    }
  ]
};
