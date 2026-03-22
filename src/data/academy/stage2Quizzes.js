export const stage2MiniQuizzes = [
  {
    id: "stage2_mini_quiz_1",
    stageId: 2,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3 (أنماط الشموع الانعكاسية والاستمرارية)",
    titleEn: "Mini Quiz: Lessons 1-3 (Reversal & Continuation Candlestick Patterns)",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "أي نمط شموع يابانية يتكون من شمعة صعودية كبيرة تبتلع شمعة هبوطية صغيرة سابقة، ويظهر في نهاية الاتجاه الهابط؟",
        options: [
          "ابتلاع هبوطي (Bearish Engulfing)",
          "ابتلاع صعودي (Bullish Engulfing)",
          "نجمة المساء (Evening Star)",
          "غيمة سوداء (Dark Cloud Cover)"
        ],
        correctAnswer: 1, // ابتلاع صعودي (Bullish Engulfing)
        explanation: "نمط الابتلاع الصعودي هو إشارة قوية لانعكاس صعودي.",
        explanationEn: "The Bullish Engulfing pattern is a strong bullish reversal signal."
      },
      {
        id: "q2",
        question: "ما هو نمط الشموع الذي يتكون من ثلاث شموع: شمعة هبوطية كبيرة، تتبعها شمعة صغيرة (دوجي أو جسم صغير)، ثم شمعة صعودية كبيرة تغلق فوق منتصف الشمعة الأولى، ويظهر في نهاية الاتجاه الهابط؟",
        options: [
          "نجمة المساء (Evening Star)",
          "نجمة الصباح (Morning Star)",
          "ثلاثة جنود بيض (Three White Soldiers)",
          "غيمة سوداء (Dark Cloud Cover)"
        ],
        correctAnswer: 1, // نجمة الصباح (Morning Star)
        explanation: "نجمة الصباح هي نمط انعكاسي صعودي قوي يتكون من ثلاث شموع.",
        explanationEn: "The Morning Star is a strong bullish reversal pattern consisting of three candles."
      },
      {
        id: "q3",
        question: "ماذا يشير نمط توقف الاتجاه الصعودي (Rising Three Methods)؟",
        options: [
          "انعكاس هبوطي محتمل",
          "استمرارية الاتجاه الصعودي بعد توقف قصير",
          "حيرة في السوق",
          "انعكاس صعودي محتمل"
        ],
        correctAnswer: 1, // استمرارية الاتجاه الصعودي بعد توقف قصير
        explanation: "هذا النمط يدل على أن الاتجاه الصاعد سيستمر بعد فترة تصحيح بسيطة.",
        explanationEn: "This pattern indicates that the uptrend will continue after a minor correction."
      },
      {
        id: "q4",
        question: "أي من الأنماط التالية يعتبر إشارة انعكاسية هبوطية متوسطة القوة ويظهر في نهاية الاتجاه الصاعد، حيث تفتح شمعة هبوطية بفجوة صاعدة ثم تغلق تحت منتصف الشمعة الصعودية السابقة؟",
        options: [
          "ابتلاع صعودي (Bullish Engulfing)",
          "ثاقب (Piercing Pattern)",
          "غيمة سوداء (Dark Cloud Cover)",
          "نجمة الصباح (Morning Star)"
        ],
        correctAnswer: 2, // غيمة سوداء (Dark Cloud Cover)
        explanation: "الغيمة السوداء هي إشارة هبوطية متوسطة القوة.",
        explanationEn: "Dark Cloud Cover is a moderately strong bearish signal."
      },
      {
        id: "q5",
        question: "ما هو الشرط الأساسي لنمط الابتلاع الهبوطي (Bearish Engulfing)؟",
        options: [
          "الشمعة الثانية صعودية وتغطي الأولى",
          "الشمعة الثانية هبوطية وتغطي الأولى بالكامل",
          "الشمعة الأولى هبوطية والثانية صعودية",
          "الشمعة الثانية تفتح بفجوة صاعدة"
        ],
        correctAnswer: 1, // الشمعة الثانية هبوطية وتغطي الأولى بالكامل
        explanation: "يجب أن تبتلع الشمعة الهبوطية الثانية جسم الشمعة الصعودية الأولى بالكامل.",
        explanationEn: "The second bearish candle must completely engulf the body of the first bullish candle."
      },
      {
        id: "q6",
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
        id: "q7",
        question: "نمط القيعان الثلاثة (Three White Soldiers) هو إشارة: ",
        options: [
          "انعكاسية هبوطية",
          "استمرارية هبوطية",
          "انعكاسية صعودية قوية",
          "حيرة في السوق"
        ],
        correctAnswer: 2, // انعكاسية صعودية قوية
        explanation: "هذا النمط يتكون من ثلاث شموع صعودية متتالية ويشير إلى تحول قوي في الاتجاه الهابط.",
        explanationEn: "This pattern consists of three consecutive bullish candles and indicates a strong reversal in a downtrend."
      },
      {
        id: "q8",
        question: "متى تكون أنماط الشموع اليابانية أكثر فعالية؟",
        options: [
          "عندما تظهر بشكل عشوائي في أي مكان على الرسم البياني",
          "عندما تظهر عند مستويات دعم أو مقاومة رئيسية",
          "عندما لا يتم تأكيدها بأدوات أخرى",
          "عندما يكون حجم التداول منخفضاً جداً"
        ],
        correctAnswer: 1, // عندما تظهر عند مستويات دعم أو مقاومة رئيسية
        explanation: "الأنماط التي تظهر عند مناطق مهمة تكون أكثر موثوقية.",
        explanationEn: "Patterns appearing at significant areas are more reliable."
      },
      {
        id: "q9",
        question: "ما هو نمط الشموع الذي يتكون من شمعة هبوطية كبيرة تتبعها شمعة صعودية تفتح بفجوة هابطة وتغلق فوق منتصف الشمعة الهبوطية الأولى؟",
        options: [
          "غيمة سوداء (Dark Cloud Cover)",
          "ابتلاع هبوطي (Bearish Engulfing)",
          "ثاقب (Piercing Pattern)",
          "نجمة المساء (Evening Star)"
        ],
        correctAnswer: 2, // ثاقب (Piercing Pattern)
        explanation: "نمط الثاقب هو إشارة انعكاسية صعودية متوسطة القوة.",
        explanationEn: "The Piercing Pattern is a moderately strong bullish reversal signal."
      },
      {
        id: "q10",
        question: "أي من الأنماط التالية يشير إلى استمرارية الاتجاه الهابط بعد توقف قصير، ويتكون من شمعة هبوطية كبيرة، ثلاث شموع صعودية صغيرة داخل نطاق الأولى، ثم شمعة هبوطية كبيرة أخرى؟",
        options: [
          "توقف الاتجاه الصعودي (Rising Three Methods)",
          "توقف الاتجاه الهبوطي (Falling Three Methods)",
          "الغربان الثلاثة السوداء (Three Black Crows)",
          "نجمة الصباح (Morning Star)"
        ],
        correctAnswer: 1, // توقف الاتجاه الهبوطي (Falling Three Methods)
        explanation: "هذا النمط يؤكد استمرارية الاتجاه الهابط.",
        explanationEn: "This pattern confirms the continuation of a downtrend."
      }
    ]
  }
];

export const stage2FinalExam = {
  id: "stage2_final_exam",
  stageId: 2,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 2: الشموع اليابانية",
  titleEn: "Final Exam - Stage 2: Japanese Candlesticks",
  description: "اختبار شامل للمرحلة الثانية من التحليل الفني. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "أي نمط شموع يابانية يتكون من شمعة صعودية كبيرة تبتلع شمعة هبوطية صغيرة سابقة، ويظهر في نهاية الاتجاه الهابط؟",
      options: [
        "ابتلاع هبوطي (Bearish Engulfing)",
        "ابتلاع صعودي (Bullish Engulfing)",
        "نجمة المساء (Evening Star)",
        "غيمة سوداء (Dark Cloud Cover)"
      ],
      correctAnswer: 1, // ابتلاع صعودي (Bullish Engulfing)
      explanation: "نمط الابتلاع الصعودي هو إشارة قوية لانعكاس صعودي.",
      explanationEn: "The Bullish Engulfing pattern is a strong bullish reversal signal."
    },
    {
      id: "q2",
      question: "ما هو نمط الشموع الذي يتكون من ثلاث شموع: شمعة هبوطية كبيرة، تتبعها شمعة صغيرة (دوجي أو جسم صغير)، ثم شمعة صعودية كبيرة تغلق فوق منتصف الشمعة الأولى، ويظهر في نهاية الاتجاه الهابط؟",
      options: [
        "نجمة المساء (Evening Star)",
        "نجمة الصباح (Morning Star)",
        "ثلاثة جنود بيض (Three White Soldiers)",
        "غيمة سوداء (Dark Cloud Cover)"
      ],
      correctAnswer: 1, // نجمة الصباح (Morning Star)
      explanation: "نجمة الصباح هي نمط انعكاسي صعودي قوي يتكون من ثلاث شموع.",
      explanationEn: "The Morning Star is a strong bullish reversal pattern consisting of three candles."
    },
    {
      id: "q3",
      question: "ماذا يشير نمط توقف الاتجاه الصعودي (Rising Three Methods)؟",
      options: [
        "انعكاس هبوطي محتمل",
        "استمرارية الاتجاه الصعودي بعد توقف قصير",
        "حيرة في السوق",
        "انعكاس صعودي محتمل"
      ],
      correctAnswer: 1, // استمرارية الاتجاه الصعودي بعد توقف قصير
      explanation: "هذا النمط يدل على أن الاتجاه الصاعد سيستمر بعد فترة تصحيح بسيطة.",
      explanationEn: "This pattern indicates that the uptrend will continue after a minor correction."
    },
    {
      id: "q4",
      question: "أي من الأنماط التالية يعتبر إشارة انعكاسية هبوطية متوسطة القوة ويظهر في نهاية الاتجاه الصاعد، حيث تفتح شمعة هبوطية بفجوة صاعدة ثم تغلق تحت منتصف الشمعة الصعودية السابقة؟",
      options: [
        "ابتلاع صعودي (Bullish Engulfing)",
        "ثاقب (Piercing Pattern)",
        "غيمة سوداء (Dark Cloud Cover)",
        "نجمة الصباح (Morning Star)"
      ],
      correctAnswer: 2, // غيمة سوداء (Dark Cloud Cover)
      explanation: "الغيمة السوداء هي إشارة هبوطية متوسطة القوة.",
      explanationEn: "Dark Cloud Cover is a moderately strong bearish signal."
    },
    {
      id: "q5",
      question: "ما هو الشرط الأساسي لنمط الابتلاع الهبوطي (Bearish Engulfing)؟",
      options: [
        "الشمعة الثانية صعودية وتغطي الأولى",
        "الشمعة الثانية هبوطية وتغطي الأولى بالكامل",
        "الشمعة الأولى هبوطية والثانية صعودية",
        "الشمعة الثانية تفتح بفجوة صاعدة"
      ],
      correctAnswer: 1, // الشمعة الثانية هبوطية وتغطي الأولى بالكامل
      explanation: "يجب أن تبتلع الشمعة الهبوطية الثانية جسم الشمعة الصعودية الأولى بالكامل.",
      explanationEn: "The second bearish candle must completely engulf the body of the first bullish candle."
    },
    {
      id: "q6",
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
      id: "q7",
      question: "نمط القيعان الثلاثة (Three White Soldiers) هو إشارة: ",
      options: [
        "انعكاسية هبوطية",
        "استمرارية هبوطية",
        "انعكاسية صعودية قوية",
        "حيرة في السوق"
      ],
      correctAnswer: 2, // انعكاسية صعودية قوية
      explanation: "هذا النمط يتكون من ثلاث شموع صعودية متتالية ويشير إلى تحول قوي في الاتجاه الهابط.",
      explanationEn: "This pattern consists of three consecutive bullish candles and indicates a strong reversal in a downtrend."
    },
    {
      id: "q8",
      question: "متى تكون أنماط الشموع اليابانية أكثر فعالية؟",
      options: [
        "عندما تظهر بشكل عشوائي في أي مكان على الرسم البياني",
        "عندما تظهر عند مستويات دعم أو مقاومة رئيسية",
        "عندما لا يتم تأكيدها بأدوات أخرى",
        "عندما يكون حجم التداول منخفضاً جداً"
      ],
      correctAnswer: 1, // عندما تظهر عند مستويات دعم أو مقاومة رئيسية
      explanation: "الأنماط التي تظهر عند مناطق مهمة تكون أكثر موثوقية.",
      explanationEn: "Patterns appearing at significant areas are more reliable."
    },
    {
      id: "q9",
      question: "ما هو نمط الشموع الذي يتكون من شمعة هبوطية كبيرة تتبعها شمعة صعودية تفتح بفجوة هابطة وتغلق فوق منتصف الشمعة الهبوطية الأولى؟",
      options: [
        "غيمة سوداء (Dark Cloud Cover)",
        "ابتلاع هبوطي (Bearish Engulfing)",
        "ثاقب (Piercing Pattern)",
        "نجمة المساء (Evening Star)"
      ],
      correctAnswer: 2, // ثاقب (Piercing Pattern)
      explanation: "نمط الثاقب هو إشارة انعكاسية صعودية متوسطة القوة.",
      explanationEn: "The Piercing Pattern is a moderately strong bullish reversal signal."
    },
    {
      id: "q10",
      question: "أي من الأنماط التالية يشير إلى استمرارية الاتجاه الهابط بعد توقف قصير، ويتكون من شمعة هبوطية كبيرة، ثلاث شموع صعودية صغيرة داخل نطاق الأولى، ثم شمعة هبوطية كبيرة أخرى؟",
      options: [
        "توقف الاتجاه الصعودي (Rising Three Methods)",
        "توقف الاتجاه الهبوطي (Falling Three Methods)",
        "الغربان الثلاثة السوداء (Three Black Crows)",
        "نجمة الصباح (Morning Star)"
      ],
      correctAnswer: 1, // توقف الاتجاه الهبوطي (Falling Three Methods)
      explanation: "هذا النمط يؤكد استمرارية الاتجاه الهابط.",
      explanationEn: "This pattern confirms the continuation of a downtrend."
    },
    {
      id: "q11",
      question: "ما هو نمط الشموع الذي يتكون من ثلاث شموع هبوطية متتالية، حيث تفتح كل شمعة داخل جسم السابقة وتغلق أدنى منها، ويظهر في نهاية الاتجاه الصاعد؟",
      options: [
        "ثلاثة جنود بيض (Three White Soldiers)",
        "الغربان الثلاثة السوداء (Three Black Crows)",
        "نجمة الصباح (Morning Star)",
        "نجمة المساء (Evening Star)"
      ],
      correctAnswer: 1, // الغربان الثلاثة السوداء (Three Black Crows)
      explanation: "الغربان الثلاثة السوداء هي إشارة انعكاسية هبوطية قوية.",
      explanationEn: "Three Black Crows is a strong bearish reversal signal."
    },
    {
      id: "q12",
      question: "ماذا يعني نمط خط المواجهة الصعودي (Bullish Meeting Lines)؟",
      options: [
        "استمرارية هبوطية قوية",
        "انعكاس صعودي متوسط القوة",
        "انعكاس هبوطي قوي",
        "حيرة في السوق"
      ],
      correctAnswer: 1, // انعكاس صعودي متوسط القوة
      explanation: "يشير إلى أن البائعين فقدوا زخمهم ونجح المشترون في إعادة السعر لمستوى الإغلاق السابق.",
      explanationEn: "Indicates that sellers have lost momentum and buyers have managed to bring the price back to the previous closing level."
    },
    {
      id: "q13",
      question: "أي من الأنماط التالية هو نمط استمراري صعودي يتكون من شمعة صعودية كبيرة، تتبعها فجوة سعرية صاعدة، ثم شمعة صعودية أخرى، ثم شمعة هبوطية تغلق داخل الفجوة ولكن لا تغلقها بالكامل؟",
      options: [
        "فجوة تاسي هبوطية (Bearish Tasuki Gap)",
        "فجوة تاسي صعودية (Bullish Tasuki Gap)",
        "فجوة هابطة (Downward Gap)",
        "فجوة صاعدة (Upward Gap)"
      ],
      correctAnswer: 1, // فجوة تاسي صعودية (Bullish Tasuki Gap)
      explanation: "فجوة تاسي الصعودية هي إشارة استمرارية للاتجاه الصاعد.",
      explanationEn: "A Bullish Tasuki Gap is a continuation signal for an uptrend."
    },
    {
      id: "q14",
      question: "ما هو الشرط الذي يزيد من قوة إشارة أنماط الشموع الاستمرارية؟",
      options: [
        "حجم تداول منخفض جداً",
        "ظهورها عند مستويات انعكاسية قوية",
        "عدم إغلاق الفجوات السعرية بسرعة",
        "تجاهل الاتجاه العام للسوق"
      ],
      correctAnswer: 2, // عدم إغلاق الفجوات السعرية بسرعة
      explanation: "الفجوات التي لا يتم إغلاقها بسرعة تؤكد قوة الاتجاه.",
      explanationEn: "Gaps that are not quickly filled confirm the strength of the trend."
    },
    {
      id: "q15",
      question: "ماذا تمثل الشمعة الثانية الصغيرة في نمط نجمة المساء (Evening Star)؟",
      options: [
        "سيطرة قوية للمشترين",
        "سيطرة قوية للبائعين",
        "حيرة وعدم يقين في السوق",
        "استمرارية الاتجاه الصاعد"
      ],
      correctAnswer: 2, // حيرة وعدم يقين في السوق
      explanation: "الشمعة الصغيرة تشير إلى توقف في الزخم قبل انعكاس الاتجاه.",
      explanationEn: "The small candle indicates a pause in momentum before a trend reversal."
    },
    {
      id: "q16",
      question: "أي من الأنماط التالية يعتبر إشارة انعكاسية صعودية متوسطة القوة ويظهر في نهاية الاتجاه الهابط، حيث تفتح شمعة صعودية بفجوة هابطة ثم تغلق فوق منتصف الشمعة الهبوطية السابقة؟",
      options: [
        "غيمة سوداء (Dark Cloud Cover)",
        "ابتلاع هبوطي (Bearish Engulfing)",
        "ثاقب (Piercing Pattern)",
        "نجمة المساء (Evening Star)"
      ],
      correctAnswer: 2, // ثاقب (Piercing Pattern)
      explanation: "نمط الثاقب هو إشارة انعكاسية صعودية متوسطة القوة.",
      explanationEn: "The Piercing Pattern is a moderately strong bullish reversal signal."
    },
    {
      id: "q17",
      question: "ما هو الفرق بين نمط الابتلاع الصعودي ونمط الثاقب؟",
      options: [
        "الابتلاع الصعودي يبتلع الشمعة السابقة بالكامل، الثاقب يغلق فوق المنتصف فقط.",
        "الابتلاع الصعودي يظهر في اتجاه صاعد، الثاقب في اتجاه هابط.",
        "الابتلاع الصعودي إشارة أضعف من الثاقب.",
        "لا يوجد فرق جوهري."
      ],
      correctAnswer: 0, // الابتلاع الصعودي يبتلع الشمعة السابقة بالكامل، الثاقب يغلق فوق المنتصف فقط.
      explanation: "الابتلاع الصعودي أقوى لأنه يظهر سيطرة كاملة للمشترين.",
      explanationEn: "Bullish Engulfing is stronger because it shows complete buyer dominance."
    },
    {
      id: "q18",
      question: "ماذا يشير نمط الغربان الثلاثة السوداء (Three Black Crows)؟",
      options: [
        "انعكاس صعودي قوي",
        "استمرارية صعودية",
        "انعكاس هبوطي قوي",
        "حيرة في السوق"
      ],
      correctAnswer: 2, // انعكاس هبوطي قوي
      explanation: "هذا النمط يتكون من ثلاث شموع هبوطية متتالية ويشير إلى تحول قوي في الاتجاه الصاعد.",
      explanationEn: "This pattern consists of three consecutive bearish candles and indicates a strong reversal in an uptrend."
    },
    {
      id: "q19",
      question: "أي من الأنماط التالية يعتبر نمط استمراري هبوطي؟",
      options: [
        "نجمة الصباح (Morning Star)",
        "ابتلاع صعودي (Bullish Engulfing)",
        "توقف الاتجاه الهبوطي (Falling Three Methods)",
        "الشهاب (Shooting Star)"
      ],
      correctAnswer: 2, // توقف الاتجاه الهبوطي (Falling Three Methods)
      explanation: "توقف الاتجاه الهبوطي يؤكد استمرارية الاتجاه الهابط بعد توقف قصير.",
      explanationEn: "Falling Three Methods confirms the continuation of a downtrend after a brief pause."
    },
    {
      id: "q20",
      question: "ما هي أهمية تأكيد أنماط الشموع اليابانية بأدوات تحليل فني أخرى؟",
      options: [
        "لجعل التحليل أكثر تعقيداً",
        "لزيادة موثوقية الإشارة وتقليل الصفقات الخاسرة",
        "لأن أنماط الشموع وحدها غير مفيدة",
        "لإضاعة الوقت في التحليل"
      ],
      correctAnswer: 1, // لزيادة موثوقية الإشارة وتقليل الصفقات الخاسرة
      explanation: "التأكيد يضيف طبقة إضافية من الثقة في قرار التداول.",
      explanationEn: "Confirmation adds an extra layer of confidence to a trading decision."
    }
  ]
};
