export const stage4MiniQuizzes = [
  {
    id: "stage4_mini_quiz_1",
    stageId: 4,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3 (مقدمة المؤشرات، المتوسطات المتحركة، الماكد)",
    titleEn: "Mini Quiz: Lessons 1-3 (Indicators Intro, Moving Averages, MACD)",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "ما هي الوظيفة الأساسية للمؤشرات الفنية؟",
        options: [
          "التنبؤ بالمستقبل بدقة 100%.",
          "تأكيد التحليلات وتحديد ظروف السوق بناءً على بيانات تاريخية.",
          "استبدال التحليل السعري بالكامل.",
          "توليد إشارات تداول عشوائية."
        ],
        correctAnswer: 1, // تأكيد التحليلات وتحديد ظروف السوق بناءً على بيانات تاريخية.
        explanation: "المؤشرات الفنية هي أدوات مساعدة وليست أدوات تنبؤ مطلقة.",
        explanationEn: "Technical indicators are auxiliary tools, not absolute prediction tools."
      },
      {
        id: "q2",
        question: "أي من أنواع المؤشرات التالية يقيس سرعة وقوة حركة السعر ويساعد في تحديد ذروة الشراء/البيع؟",
        options: [
          "مؤشرات الاتجاه (Trend-Following Indicators)",
          "مؤشرات الزخم (Oscillators/Momentum Indicators)",
          "مؤشرات الحجم (Volume Indicators)",
          "مؤشرات التقلب (Volatility Indicators)"
        ],
        correctAnswer: 1, // مؤشرات الزخم (Oscillators/Momentum Indicators)
        explanation: "مؤشرات الزخم مثل RSI و Stochastic تقيس سرعة وتغير حركة السعر.",
        explanationEn: "Momentum indicators like RSI and Stochastic measure the speed and change of price movement."
      },
      {
        id: "q3",
        question: "ما هو الفرق الرئيسي بين المتوسط المتحرك البسيط (SMA) والمتوسط المتحرك الأسي (EMA)؟",
        options: [
          "SMA يعطي وزناً أكبر للأسعار الحديثة، EMA يعطي وزناً متساوياً.",
          "EMA يعطي وزناً أكبر للأسعار الحديثة، SMA يعطي وزناً متساوياً.",
          "SMA يستخدم في الاتجاهات الصاعدة فقط، EMA في الاتجاهات الهابطة فقط.",
          "لا يوجد فرق جوهري بينهما."
        ],
        correctAnswer: 1, // EMA يعطي وزناً أكبر للأسعار الحديثة، SMA يعطي وزناً متساوياً.
        explanation: "EMA أكثر استجابة للتغيرات السعرية الحديثة بسبب طريقة حسابه.",
        explanationEn: "EMA is more responsive to recent price changes due to its calculation method."
      },
      {
        id: "q4",
        question: "ماذا يشير تقاطع الموت (Death Cross) في المتوسطات المتحركة؟",
        options: [
          "إشارة صعودية قوية.",
          "إشارة هبوطية قوية.",
          "استمرارية الاتجاه الصاعد.",
          "حيرة في السوق."
        ],
        correctAnswer: 1, // إشارة هبوطية قوية.
        explanation: "يحدث عندما يتقاطع متوسط متحرك قصير الأجل تحت متوسط متحرك طويل الأجل.",
        explanationEn: "Occurs when a shorter-term moving average crosses below a longer-term moving average."
      },
      {
        id: "q5",
        question: "ما هي المكونات الرئيسية لمؤشر الماكد (MACD)؟",
        options: [
          "خط الماكد، الخط الإشاري، حجم التداول.",
          "خط الماكد، الخط الإشاري، المدرج التكراري.",
          "خط الماكد، خط الاتجاه، مستويات فيبوناتشي.",
          "خط الماكد، مؤشر القوة النسبية، مؤشر ستوكاستيك."
        ],
        correctAnswer: 1, // خط الماكد، الخط الإشاري، المدرج التكراري.
        explanation: "هذه هي المكونات الثلاثة التي تشكل مؤشر الماكد.",
        explanationEn: "These are the three components that make up the MACD indicator."
      },
      {
        id: "q6",
        question: "متى تحدث ظاهرة التباعد السلبي (Bearish Divergence) بين السعر ومؤشر الماكد؟",
        options: [
          "عندما يسجل السعر قيعاناً أدنى والماكد قيعاناً أعلى.",
          "عندما يسجل السعر قمم أعلى والماكد قمم أدنى.",
          "عندما يتحرك السعر والماكد في نفس الاتجاه.",
          "عندما يتقاطع خط الماكد فوق الخط الإشاري."
        ],
        correctAnswer: 1, // عندما يسجل السعر قمم أعلى والماكد قمم أدنى.
        explanation: "التباين السلبي هو إشارة محتملة لانعكاس هبوطي.",
        explanationEn: "Bearish divergence is a potential bearish reversal signal."
      },
      {
        id: "q7",
        question: "لماذا يُنصح بعدم استخدام عدد كبير من المؤشرات الفنية؟",
        options: [
          "لأنها تزيد من دقة التحليل.",
          "لأنها تؤدي إلى "شلل التحليل" وتضارب الإشارات.",
          "لأنها تجعل الرسم البياني أكثر وضوحاً.",
          "لأنها ضرورية لكل استراتيجية تداول."
        ],
        correctAnswer: 1, // لأنها تؤدي إلى "شلل التحليل" وتضارب الإشارات.
        explanation: "الكثرة في المؤشرات تسبب الارتباك وتعيق اتخاذ القرار.",
        explanationEn: "Too many indicators cause confusion and hinder decision-making."
      },
      {
        id: "q8",
        question: "ما هي الإعدادات الافتراضية والأكثر شيوعاً لمؤشر الماكد؟",
        options: [
          "(7, 14, 7)",
          "(12, 26, 9)",
          "(20, 50, 10)",
          "(100, 200, 50)"
        ],
        correctAnswer: 1, // (12, 26, 9)
        explanation: "هذه الإعدادات هي الأكثر استخداماً في معظم منصات التداول.",
        explanationEn: "These settings are the most commonly used in most trading platforms."
      },
      {
        id: "q9",
        question: "كيف يمكن للمتوسطات المتحركة أن تعمل كدعم ومقاومة ديناميكية؟",
        options: [
          "عن طريق البقاء ثابتة في مكانها.",
          "عن طريق تغيير لونها باستمرار.",
          "عن طريق تحركها مع السعر وارتداد السعر منها.",
          "عن طريق إعطاء إشارات شراء وبيع فقط."
        ],
        correctAnswer: 2, // عن طريق تحركها مع السعر وارتداد السعر منها.
        explanation: "المتوسطات المتحركة تتكيف مع حركة السعر وتوفر مستويات تفاعل متحركة.",
        explanationEn: "Moving averages adapt to price movement and provide dynamic interaction levels."
      },
      {
        id: "q10",
        question: "ماذا يعني تقاطع خط الماكد فوق خط الصفر؟",
        options: [
          "تأكيد الاتجاه الهبوطي.",
          "تأكيد الاتجاه الصعودي.",
          "إشارة بيع قوية.",
          "لا يوجد له أي دلالة."
        ],
        correctAnswer: 1, // تأكيد الاتجاه الصعودي.
        explanation: "تقاطع خط الماكد فوق خط الصفر يشير إلى أن الزخم الصعودي هو المسيطر.",
        explanationEn: "A MACD line crossover above the zero line indicates that bullish momentum is dominant."
      }
    ]
  }
];

export const stage4FinalExam = {
  id: "stage4_final_exam",
  stageId: 4,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 4: المؤشرات الفنية",
  titleEn: "Final Exam - Stage 4: Technical Indicators",
  description: "اختبار شامل للمرحلة الرابعة من التحليل الفني. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "ما هي الفئة الرئيسية للمؤشرات الفنية التي تساعد في تحديد اتجاه السوق وتأكيده؟",
      options: [
        "مؤشرات الزخم (Oscillators)",
        "مؤشرات الاتجاه (Trend-Following Indicators)",
        "مؤشرات التقلب (Volatility Indicators)",
        "مؤشرات الحجم (Volume Indicators)"
      ],
      correctAnswer: 1, // مؤشرات الاتجاه (Trend-Following Indicators)
      explanation: "مؤشرات الاتجاه مثل المتوسطات المتحركة تساعد في تتبع الاتجاه.",
      explanationEn: "Trend-following indicators like Moving Averages help track the trend."
    },
    {
      id: "q2",
      question: "أي من المؤشرات التالية يعطي وزناً أكبر لأسعار الإغلاق الأحدث؟",
      options: [
        "المتوسط المتحرك البسيط (SMA)",
        "المتوسط المتحرك الأسي (EMA)",
        "مؤشر الماكد (MACD)",
        "مؤشر القوة النسبية (RSI)"
      ],
      correctAnswer: 1, // المتوسط المتحرك الأسي (EMA)
      explanation: "EMA أكثر استجابة للتغيرات السعرية الحديثة.",
      explanationEn: "EMA is more responsive to recent price changes."
    },
    {
      id: "q3",
      question: "ماذا يشير تقاطع الذهبي (Golden Cross) في المتوسطات المتحركة؟",
      options: [
        "إشارة هبوطية قوية.",
        "إشارة صعودية قوية.",
        "استمرارية الاتجاه الهابط.",
        "لا يوجد له أي دلالة."
      ],
      correctAnswer: 1, // إشارة صعودية قوية.
      explanation: "يحدث عندما يتقاطع متوسط متحرك قصير الأجل فوق متوسط متحرك طويل الأجل.",
      explanationEn: "Occurs when a shorter-term moving average crosses above a longer-term moving average."
    },
    {
      id: "q4",
      question: "ما هو المكون الذي يمثل الفرق بين خط الماكد والخط الإشاري في مؤشر الماكد؟",
      options: [
        "خط الماكد نفسه.",
        "الخط الإشاري.",
        "المدرج التكراري (Histogram).",
        "خط الصفر."
      ],
      correctAnswer: 2, // المدرج التكراري (Histogram).
      explanation: "المدرج التكراري يوضح قوة الزخم واتجاهه.",
      explanationEn: "The histogram shows the strength and direction of momentum."
    },
    {
      id: "q5",
      question: "متى تحدث ظاهرة التباعد الإيجابي (Bullish Divergence) بين السعر ومؤشر الماكد؟",
      options: [
        "عندما يسجل السعر قمم أعلى والماكد قمم أدنى.",
        "عندما يسجل السعر قيعاناً أدنى والماكد قيعاناً أعلى.",
        "عندما يتحرك السعر والماكد في نفس الاتجاه.",
        "عندما يتقاطع خط الماكد تحت الخط الإشاري."
      ],
      correctAnswer: 1, // عندما يسجل السعر قيعاناً أدنى والماكد قيعاناً أعلى.
      explanation: "التباين الإيجابي هو إشارة محتملة لانعكاس صعودي.",
      explanationEn: "Bullish divergence is a potential bullish reversal signal."
    },
    {
      id: "q6",
      question: "لماذا تعتبر المؤشرات الفنية متأخرة (Lagging)؟",
      options: [
        "لأنها تستخدم بيانات مستقبلية.",
        "لأنها تستند إلى بيانات تاريخية وبالتالي تتأخر عن حركة السعر الفعلية.",
        "لأنها تتفاعل بسرعة كبيرة مع حركة السعر.",
        "لأنها لا تعطي أي إشارات."
      ],
      correctAnswer: 1, // لأنها تستند إلى بيانات تاريخية وبالتالي تتأخر عن حركة السعر الفعلية.
      explanation: "هذا هو أحد عيوب المؤشرات الفنية، ويجب أخذها في الاعتبار.",
      explanationEn: "This is one of the drawbacks of technical indicators and should be taken into account."
    },
    {
      id: "q7",
      question: "ما هي أفضل طريقة لاستخدام المؤشرات الفنية؟",
      options: [
        "استخدام مؤشر واحد فقط بشكل منفصل.",
        "دمجها مع التحليل السعري (Price Action) وأدوات أخرى.",
        "استخدام أكبر عدد ممكن من المؤشرات.",
        "الاعتماد عليها بشكل كلي دون أي تحليل آخر."
      ],
      correctAnswer: 1, // دمجها مع التحليل السعري (Price Action) وأدوات أخرى.
      explanation: "الدمج يعزز قوة الإشارات ويقلل من المخاطر.",
      explanationEn: "Combination enhances signal strength and reduces risks."
    },
    {
      id: "q8",
      question: "أي من هذه المؤشرات يستخدم لتحديد مناطق ذروة الشراء وذروة البيع؟",
      options: [
        "المتوسط المتحرك البسيط (SMA)",
        "مؤشر الماكد (MACD)",
        "مؤشر القوة النسبية (RSI) ومؤشر ستوكاستيك (Stochastic)",
        "المتوسط المتحرك الأسي (EMA)"
      ],
      correctAnswer: 2, // مؤشر القوة النسبية (RSI) ومؤشر ستوكاستيك (Stochastic)
      explanation: "هذه المؤشرات مصممة خصيصاً لتحديد هذه الظروف.",
      explanationEn: "These indicators are specifically designed to identify these conditions."
    },
    {
      id: "q9",
      question: "ماذا يعني تقاطع خط الماكد تحت الخط الإشاري؟",
      options: [
        "إشارة شراء قوية.",
        "إشارة بيع قوية.",
        "تأكيد الاتجاه الصعودي.",
        "لا يوجد له أي دلالة."
      ],
      correctAnswer: 1, // إشارة بيع قوية.
      explanation: "يشير إلى أن الزخم الهبوطي يتزايد.",
      explanationEn: "Indicates that bearish momentum is increasing."
    },
    {
      id: "q10",
      question: "ما هي أهمية التباعد (Divergence) في المؤشرات الفنية؟",
      options: [
        "يشير دائماً إلى استمرارية الاتجاه.",
        "يعتبر إشارة قوية لانعكاس محتمل في الاتجاه.",
        "لا يوجد له أي أهمية في التحليل الفني.",
        "يستخدم فقط لتحديد حجم التداول."
      ],
      correctAnswer: 1, // يعتبر إشارة قوية لانعكاس محتمل في الاتجاه.
      explanation: "التباين هو إشارة تحذيرية مبكرة لتغير محتمل في الاتجاه.",
      explanationEn: "Divergence is an early warning sign of a potential trend change."
    },
    {
      id: "q11",
      question: "ما هي الفترة الزمنية التي يفضلها المتداولون على المدى الطويل (Position Traders) للمتوسطات المتحركة؟",
      options: [
        "9, 12, 20 EMA.",
        "50 EMA/SMA.",
        "100, 200 SMA.",
        "لا يستخدمون المتوسطات المتحركة."
      ],
      correctAnswer: 2, // 100, 200 SMA.
      explanation: "الفترات الطويلة تساعد في تحديد الاتجاهات الرئيسية طويلة الأجل.",
      explanationEn: "Longer periods help identify major long-term trends."
    },
    {
      id: "q12",
      question: "متى تعمل مؤشرات الزخم (Oscillators) بشكل أفضل؟",
      options: [
        "في الأسواق ذات الاتجاه الواضح (Trending Markets).",
        "في الأسواق العرضية (Ranging Markets).",
        "عندما يكون حجم التداول منخفضاً جداً.",
        "عندما لا يوجد أي تقلب في السوق."
      ],
      correctAnswer: 1, // في الأسواق العرضية (Ranging Markets).
      explanation: "مؤشرات الزخم مصممة لتحديد نقاط الانعكاس في الأسواق التي لا يوجد بها اتجاه واضح.",
      explanationEn: "Momentum indicators are designed to identify reversal points in markets without a clear trend."
    },
    {
      id: "q13",
      question: "ماذا يعني تقاطع خط الماكد فوق خط الصفر؟",
      options: [
        "تأكيد الاتجاه الهبوطي.",
        "تأكيد الاتجاه الصعودي.",
        "إشارة بيع قوية.",
        "لا يوجد له أي دلالة."
      ],
      correctAnswer: 1, // تأكيد الاتجاه الصعودي.
      explanation: "تقاطع خط الماكد فوق خط الصفر يشير إلى أن الزخم الصعودي هو المسيطر.",
      explanationEn: "A MACD line crossover above the zero line indicates that bullish momentum is dominant."
    },
    {
      id: "q14",
      question: "ما هو الدور الذي يلعبه المدرج التكراري (Histogram) في مؤشر الماكد؟",
      options: [
        "يحدد مستويات الدعم والمقاومة.",
        "يقيس الفرق بين خط الماكد والخط الإشاري ويشير إلى تسارع أو تباطؤ الزخم.",
        "يحدد حجم التداول.",
        "يتنبأ بالأسعار المستقبلية."
      ],
      correctAnswer: 1, // يقيس الفرق بين خط الماكد والخط الإشاري ويشير إلى تسارع أو تباطؤ الزخم.
      explanation: "المدرج التكراري هو مؤشر بصري لقوة الزخم.",
      explanationEn: "The histogram is a visual indicator of momentum strength."
    },
    {
      id: "q15",
      question: "لماذا يجب دمج المؤشرات الفنية مع التحليل السعري؟",
      options: [
        "لأن المؤشرات الفنية وحدها كافية.",
        "لزيادة موثوقية الإشارات وتقليل المخاطر.",
        "لجعل التحليل أكثر تعقيداً.",
        "لأن التحليل السعري غير ضروري."
      ],
      correctAnswer: 1, // لزيادة موثوقية الإشارات وتقليل المخاطر.
      explanation: "التحليل السعري يوفر السياق، والمؤشرات تؤكد الإشارات.",
      explanationEn: "Price action provides context, and indicators confirm signals."
    },
    {
      id: "q16",
      question: "ما هي الإشارة التي تدل على أن المشترين يسيطرون على السوق عند استخدام المتوسطات المتحركة؟",
      options: [
        "السعر تحت المتوسط المتحرك والمتوسط يتجه للأسفل.",
        "السعر فوق المتوسط المتحرك والمتوسط يتجه للأعلى.",
        "السعر يتذبذب حول المتوسط المتحرك.",
        "المتوسط المتحرك أفقياً."
      ],
      correctAnswer: 1, // السعر فوق المتوسط المتحرك والمتوسط يتجه للأعلى.
      explanation: "هذا هو التعريف الأساسي للاتجاه الصاعد باستخدام المتوسطات المتحركة.",
      explanationEn: "This is the basic definition of an uptrend using moving averages."
    },
    {
      id: "q17",
      question: "ما هو التباعد (Divergence)؟",
      options: [
        "عندما يتحرك السعر والمؤشر في نفس الاتجاه.",
        "عندما يتحرك السعر في اتجاه، بينما يتحرك المؤشر في الاتجاه المعاكس.",
        "عندما يكون المؤشر ثابتاً والسعر يتحرك.",
        "عندما لا يوجد أي علاقة بين السعر والمؤشر."
      ],
      correctAnswer: 1, // عندما يتحرك السعر في اتجاه، بينما يتحرك المؤشر في الاتجاه المعاكس.
      explanation: "التباين هو إشارة قوية لتغير محتمل في الاتجاه.",
      explanationEn: "Divergence is a strong signal of a potential trend change."
    },
    {
      id: "q18",
      question: "أي من هذه المؤشرات يعتبر مؤشر اتجاه (Trend-Following Indicator)؟",
      options: [
        "مؤشر القوة النسبية (RSI)",
        "مؤشر ستوكاستيك (Stochastic Oscillator)",
        "المتوسطات المتحركة (Moving Averages)",
        "مؤشر الماكد (MACD) (بشكل أساسي مؤشر زخم ولكن يتبع الاتجاه أيضاً)"
      ],
      correctAnswer: 2, // المتوسطات المتحركة (Moving Averages)
      explanation: "المتوسطات المتحركة هي الأداة الأساسية لتحديد وتتبع الاتجاه.",
      explanationEn: "Moving Averages are the primary tool for identifying and following trends."
    },
    {
      id: "q19",
      question: "ما هي الفائدة من استخدام مجموعة من المتوسطات المتحركة (مثل EMA 20 و EMA 50)؟",
      options: [
        "لجعل الرسم البياني أكثر تعقيداً.",
        "لتشكيل "نطاق" أو "منطقة" دعم ومقاومة ديناميكية.",
        "للحصول على إشارات متضاربة.",
        "لأن متوسطاً واحداً لا يكفي أبداً."
      ],
      correctAnswer: 1, // لتشكيل "نطاق" أو "منطقة" دعم ومقاومة ديناميكية.
      explanation: "النطاقات توفر رؤية أكثر شمولية لمناطق التفاعل المحتملة.",
      explanationEn: "Zones provide a more comprehensive view of potential interaction areas."
    },
    {
      id: "q20",
      question: "ماذا يعني تقاطع خط الماكد فوق الخط الإشاري؟",
      options: [
        "إشارة بيع.",
        "إشارة شراء.",
        "لا يوجد أي دلالة.",
        "تأكيد على استمرارية الاتجاه الهابط."
      ],
      correctAnswer: 1, // إشارة شراء.
      explanation: "هذا التقاطع يشير إلى زيادة في الزخم الصعودي.",
      explanationEn: "This crossover indicates an increase in bullish momentum."
    }
  ]
};
