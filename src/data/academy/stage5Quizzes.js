export const stage5MiniQuizzes = [
  {
    id: "stage5_mini_quiz_1",
    stageId: 5,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3 (مقدمة الأنماط، أنماط الاستمرارية، أنماط الانعكاس، القنوات السعرية)",
    titleEn: "Mini Quiz: Lessons 1-3 (Patterns Intro, Continuation, Reversal, Price Channels)",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "ما هي الفئة الرئيسية للأنماط السعرية التي تشير إلى أن الاتجاه الحالي من المرجح أن يستمر؟",
        options: [
          "أنماط الانعكاس (Reversal Patterns)",
          "أنماط الاستمرارية (Continuation Patterns)",
          "أنماط التذبذب (Volatility Patterns)",
          "أنماط الحجم (Volume Patterns)"
        ],
        correctAnswer: 1, // أنماط الاستمرارية (Continuation Patterns)
        explanation: "أنماط الاستمرارية تدل على فترة توحيد قبل مواصلة الاتجاه السابق.",
        explanationEn: "Continuation patterns indicate a consolidation period before resuming the previous trend."
      },
      {
        id: "q2",
        question: "أي من الأنماط التالية يعتبر نمط استمراري صعودي غالباً؟",
        options: [
          "الرأس والكتفين (Head and Shoulders)",
          "القمة المزدوجة (Double Top)",
          "المثلث الصاعد (Ascending Triangle)",
          "الوتد الصاعد (Rising Wedge)"
        ],
        correctAnswer: 2, // المثلث الصاعد (Ascending Triangle)
        explanation: "المثلث الصاعد غالباً ما يكسر للأعلى ليواصل الاتجاه الصاعد.",
        explanationEn: "An ascending triangle often breaks upwards to continue an uptrend."
      },
      {
        id: "q3",
        question: "ما هو نمط الانعكاس الهبوطي الذي يتكون من ثلاث قمم، الوسطى هي الأعلى؟",
        options: [
          "القمة المزدوجة (Double Top)",
          "الرأس والكتفين (Head and Shoulders)",
          "الوتد الهابط (Falling Wedge)",
          "المثلث المتماثل (Symmetrical Triangle)"
        ],
        correctAnswer: 1, // الرأس والكتفين (Head and Shoulders)
        explanation: "نمط الرأس والكتفين هو نمط انعكاسي هبوطي كلاسيكي.",
        explanationEn: "The Head and Shoulders pattern is a classic bearish reversal pattern."
      },
      {
        id: "q4",
        question: "ماذا يشير كسر خط العنق (Neckline) في نمط الرأس والكتفين؟",
        options: [
          "تأكيد استمرارية الاتجاه الصاعد.",
          "إشارة دخول قوية لصفقة بيع.",
          "إشارة دخول قوية لصفقة شراء.",
          "لا يوجد له أي دلالة."
        ],
        correctAnswer: 1, // إشارة دخول قوية لصفقة بيع.
        explanation: "كسر خط العنق يؤكد الانعكاس الهبوطي.",
        explanationEn: "Breaking the neckline confirms the bearish reversal."
      },
      {
        id: "q5",
        question: "أي من الأنماط التالية يشبه حرف 'W' ويشير إلى انعكاس صعودي؟",
        options: [
          "القمة المزدوجة (Double Top)",
          "القاع المزدوج (Double Bottom)",
          "الرأس والكتفين المقلوب (Inverse Head and Shoulders)",
          "المستطيل (Rectangle)"
        ],
        correctAnswer: 1, // القاع المزدوج (Double Bottom)
        explanation: "القاع المزدوج هو نمط انعكاسي صعودي قوي.",
        explanationEn: "The Double Bottom is a strong bullish reversal pattern."
      },
      {
        id: "q6",
        question: "ما هي القناة السعرية التي تتكون من خطي اتجاه صاعدين متوازيين؟",
        options: [
          "القناة الهابطة (Descending Channel)",
          "القناة الأفقية (Horizontal Channel)",
          "القناة الصاعدة (Ascending Channel)",
          "الوتد الصاعد (Rising Wedge)"
        ],
        correctAnswer: 2, // القناة الصاعدة (Ascending Channel)
        explanation: "القناة الصاعدة تحدد اتجاه صاعد بين خطي دعم ومقاومة متوازيين.",
        explanationEn: "An ascending channel defines an uptrend between two parallel support and resistance lines."
      },
      {
        id: "q7",
        question: "ماذا يعني كسر القناة الصاعدة للأسفل؟",
        options: [
          "تأكيد استمرارية الاتجاه الصاعد.",
          "إشارة صعودية قوية.",
          "إشارة هبوطية قوية قد تؤدي إلى انعكاس الاتجاه.",
          "لا يوجد له أي دلالة."
        ],
        correctAnswer: 2, // إشارة هبوطية قوية قد تؤدي إلى انعكاس الاتجاه.
        explanation: "كسر القناة الصاعدة للأسفل يشير إلى ضعف في الاتجاه الصاعد.",
        explanationEn: "Breaking below an ascending channel indicates weakness in the uptrend."
      },
      {
        id: "q8",
        question: "لماذا يعتبر الحجم (Volume) عاملاً مهماً عند تأكيد الأنماط السعرية؟",
        options: [
          "لأنه لا يؤثر على موثوقية النمط.",
          "لأنه يحدد لون الشموع.",
          "لأنه يؤكد قوة الاختراق أو الكسر ويزيد من موثوقية النمط.",
          "لأنه يستخدم فقط في أنماط الاستمرارية."
        ],
        correctAnswer: 2, // لأنه يؤكد قوة الاختراق أو الكسر ويزيد من موثوقية النمط.
        explanation: "الحجم يؤكد المشاركة الحقيقية في حركة السعر.",
        explanationEn: "Volume confirms genuine participation in price movement."
      },
      {
        id: "q9",
        question: "ما هو الهدف السعري لنمط المستطيل (Rectangle) بعد الاختراق؟",
        options: [
          "طول سارية العلم.",
          "المسافة من الرأس إلى خط العنق.",
          "ارتفاع المستطيل يضاف أو يطرح من نقطة الاختراق.",
          "لا يوجد هدف سعري محدد."
        ],
        correctAnswer: 2, // ارتفاع المستطيل يضاف أو يطرح من نقطة الاختراق.
        explanation: "الهدف السعري للمستطيل يقاس بارتفاع النمط نفسه.",
        explanationEn: "The price target for a rectangle is measured by the height of the pattern itself."
      },
      {
        id: "q10",
        question: "ما هو المبدأ الأساسي الذي يجب اتباعه عند التداول بناءً على الأنماط السعرية؟",
        options: [
          "الدخول فور رؤية النمط.",
          "انتظار التأكيد (إغلاق شمعة كاملة خارج النمط).",
          "الاعتماد على مؤشر واحد فقط.",
          "تجاهل الإطار الزمني."
        ],
        correctAnswer: 1, // انتظار التأكيد (إغلاق شمعة كاملة خارج النمط).
        explanation: "التأكيد يقلل من الصفقات الخاسرة الناتجة عن الاختراقات الكاذبة.",
        explanationEn: "Confirmation reduces losing trades resulting from false breakouts."
      }
    ]
  }
];

export const stage5FinalExam = {
  id: "stage5_final_exam",
  stageId: 5,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 5: الأنماط السعرية والقنوات السعرية",
  titleEn: "Final Exam - Stage 5: Chart Patterns and Price Channels",
  description: "اختبار شامل للمرحلة الخامسة من التحليل الفني. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "ما هي الفئة الرئيسية للأنماط السعرية التي تشير إلى تحول وشيك في الاتجاه؟",
      options: [
        "أنماط الاستمرارية (Continuation Patterns)",
        "أنماط الانعكاس (Reversal Patterns)",
        "أنماط التوحيد (Consolidation Patterns)",
        "أنماط الحجم (Volume Patterns)"
      ],
      correctAnswer: 1, // أنماط الانعكاس (Reversal Patterns)
      explanation: "أنماط الانعكاس توفر إشارات مبكرة لانتهاء الاتجاه الحالي.",
      explanationEn: "Reversal patterns provide early signals for the end of the current trend."
    },
    {
      id: "q2",
      question: "أي من الأنماط التالية يعتبر نمط استمراري هبوطي غالباً؟",
      options: [
        "الرأس والكتفين المقلوب (Inverse Head and Shoulders)",
        "القاع المزدوج (Double Bottom)",
        "المثلث الهابط (Descending Triangle)",
        "الوتد الهابط (Falling Wedge)"
      ],
      correctAnswer: 2, // المثلث الهابط (Descending Triangle)
      explanation: "المثلث الهابط غالباً ما يكسر للأسفل ليواصل الاتجاه الهابط.",
      explanationEn: "A descending triangle often breaks downwards to continue a downtrend."
    },
    {
      id: "q3",
      question: "ما هو نمط الانعكاس الصعودي الذي يتكون من ثلاث قيعان، الوسطى هي الأدنى؟",
      options: [
        "القاع المزدوج (Double Bottom)",
        "الرأس والكتفين المقلوب (Inverse Head and Shoulders)",
        "الوتد الصاعد (Rising Wedge)",
        "المثلث المتماثل (Symmetrical Triangle)"
      ],
      correctAnswer: 1, // الرأس والكتفين المقلوب (Inverse Head and Shoulders)
      explanation: "نمط الرأس والكتفين المقلوب هو نمط انعكاسي صعودي كلاسيكي.",
      explanationEn: "The Inverse Head and Shoulders pattern is a classic bullish reversal pattern."
    },
    {
      id: "q4",
      question: "ماذا يشير اختراق خط العنق (Neckline) في نمط الرأس والكتفين المقلوب؟",
      options: [
        "تأكيد استمرارية الاتجاه الهابط.",
        "إشارة دخول قوية لصفقة بيع.",
        "إشارة دخول قوية لصفقة شراء.",
        "لا يوجد له أي دلالة."
      ],
      correctAnswer: 2, // إشارة دخول قوية لصفقة شراء.
      explanation: "اختراق خط العنق يؤكد الانعكاس الصعودي.",
      explanationEn: "Breaking the neckline confirms the bullish reversal."
    },
    {
      id: "q5",
      question: "أي من الأنماط التالية يشبه حرف 'M' ويشير إلى انعكاس هبوطي؟",
      options: [
          "القمة المزدوجة (Double Top)",
          "القاع المزدوج (Double Bottom)",
          "الرأس والكتفين (Head and Shoulders)",
          "المستطيل (Rectangle)"
      ],
      correctAnswer: 0, // القمة المزدوجة (Double Top)
      explanation: "القمة المزدوجة هي نمط انعكاسي هبوطي قوي.",
      explanationEn: "The Double Top is a strong bearish reversal pattern."
    },
    {
      id: "q6",
      question: "ما هي القناة السعرية التي تتكون من خطي اتجاه هابطين متوازيين؟",
      options: [
        "القناة الصاعدة (Ascending Channel)",
        "القناة الأفقية (Horizontal Channel)",
        "القناة الهابطة (Descending Channel)",
        "الوتد الهابط (Falling Wedge)"
      ],
      correctAnswer: 2, // القناة الهابطة (Descending Channel)
      explanation: "القناة الهابطة تحدد اتجاه هابط بين خطي دعم ومقاومة متوازيين.",
      explanationEn: "A descending channel defines a downtrend between two parallel support and resistance lines."
    },
    {
      id: "q7",
      question: "ماذا يعني اختراق القناة الهابطة للأعلى؟",
      options: [
        "تأكيد استمرارية الاتجاه الهابط.",
        "إشارة هبوطية قوية.",
        "إشارة صعودية قوية قد تؤدي إلى انعكاس الاتجاه.",
        "لا يوجد له أي دلالة."
      ],
      correctAnswer: 2, // إشارة صعودية قوية قد تؤدي إلى انعكاس الاتجاه.
      explanation: "اختراق القناة الهابطة للأعلى يشير إلى ضعف في الاتجاه الهابط.",
      explanationEn: "Breaking above a descending channel indicates weakness in the downtrend."
    },
    {
      id: "q8",
      question: "ما هو الإطار الزمني المفضل للأنماط السعرية لزيادة موثوقيتها؟",
      options: [
        "إطارات زمنية صغيرة (دقيقة، 5 دقائق).",
        "إطارات زمنية متوسطة (ساعة، 4 ساعات).",
        "إطارات زمنية أكبر (يومي، أسبوعي).",
        "لا يهم الإطار الزمني."
      ],
      correctAnswer: 2, // إطارات زمنية أكبر (يومي، أسبوعي).
      explanation: "الأنماط على الإطارات الزمنية الأكبر تكون أكثر موثوقية وقوة.",
      explanationEn: "Patterns on larger timeframes are more reliable and powerful."
    },
    {
      id: "q9",
      question: "ما هو الهدف السعري لنمط العلم (Flag) بعد الاختراق؟",
      options: [
        "ارتفاع المستطيل.",
        "المسافة من الرأس إلى خط العنق.",
        "طول سارية العلم يضاف أو يطرح من نقطة الاختراق.",
        "لا يوجد هدف سعري محدد."
      ],
      correctAnswer: 2, // طول سارية العلم يضاف أو يطرح من نقطة الاختراق.
      explanation: "الهدف السعري للعلم يقاس بطول سارية العلم التي تسبقه.",
      explanationEn: "The price target for a flag is measured by the length of the flagpole preceding it."
    },
    {
      id: "q10",
      question: "ماذا يعني مصطلح 'إعادة الاختبار' (Retest) في سياق كسر الأنماط أو القنوات؟",
      options: [
        "أن السعر لم يكسر النمط بعد.",
        "أن السعر يعود لاختبار مستوى الكسر قبل مواصلة حركته في الاتجاه الجديد.",
        "أن النمط غير صالح.",
        "أن المتداول يجب أن يدخل الصفقة فوراً."
      ],
      correctAnswer: 1, // أن السعر يعود لاختبار مستوى الكسر قبل مواصلة حركته في الاتجاه الجديد.
      explanation: "إعادة الاختبار هي فرصة ثانية للدخول أو تأكيد إضافي.",
      explanationEn: "A retest is a second opportunity to enter or an additional confirmation."
    },
    {
      id: "q11",
      question: "أي من الأنماط التالية يعتبر نمط انعكاسي صعودي قوي ويشبه حرف 'W'؟",
      options: [
        "القمة المزدوجة (Double Top)",
        "القاع المزدوج (Double Bottom)",
        "الرأس والكتفين (Head and Shoulders)",
        "المثلث الصاعد (Ascending Triangle)"
      ],
      correctAnswer: 1, // القاع المزدوج (Double Bottom)
      explanation: "القاع المزدوج هو إشارة قوية لانعكاس الاتجاه الهابط إلى صاعد.",
      explanationEn: "The Double Bottom is a strong signal for a bearish to bullish trend reversal."
    },
    {
      id: "q12",
      question: "ما هو الوتد الصاعد (Rising Wedge) وماذا يشير غالباً؟",
      options: [
        "نمط استمراري صعودي.",
        "نمط انعكاسي هبوطي.",
        "نمط استمراري هبوطي.",
        "نمط انعكاسي صعودي."
      ],
      correctAnswer: 1, // نمط انعكاسي هبوطي.
      explanation: "الوتد الصاعد غالباً ما يكسر للأسفل مشيراً إلى انعكاس هبوطي.",
      explanationEn: "A rising wedge often breaks downwards, indicating a bearish reversal."
    },
    {
      id: "q13",
      question: "ما هي أهمية 'الاتجاه السابق' (Prior Trend) عند البحث عن أنماط الانعكاس؟",
      options: [
        "لا يوجد له أهمية.",
        "يجب أن يسبق نمط الانعكاس اتجاه واضح (صاعد أو هابط).",
        "يجب أن يكون السوق في حالة توحيد.",
        "يجب أن يكون السوق في اتجاه جانبي."
      ],
      correctAnswer: 1, // يجب أن يسبق نمط الانعكاس اتجاه واضح (صاعد أو هابط).
      explanation: "لا يمكن أن ينعكس اتجاه غير موجود.",
      explanationEn: "A non-existent trend cannot be reversed."
    },
    {
      id: "q14",
      question: "ما هو الدور الذي يلعبه 'خط الوسط' (Mid-Channel Line) في القنوات السعرية؟",
      options: [
        "يعمل كخط دعم ومقاومة رئيسي.",
        "يعمل كخط دعم ومقاومة ثانويين داخل القناة.",
        "يحدد نقطة الدخول والخروج الوحيدة.",
        "لا يوجد له أي دور."
      ],
      correctAnswer: 1, // يعمل كخط دعم ومقاومة ثانويين داخل القناة.
      explanation: "خط الوسط يوفر نقاط تفاعل إضافية داخل القناة.",
      explanationEn: "The mid-channel line provides additional interaction points within the channel."
    },
    {
      id: "q15",
      question: "ما هو الفرق بين العلم (Flag) والراية (Pennant)؟",
      options: [
        "العلم قناة سعرية صغيرة، والراية مثلث صغير.",
        "العلم مثلث صغير، والراية قناة سعرية صغيرة.",
        "كلاهما نفس الشيء تماماً.",
        "العلم نمط انعكاسي، والراية نمط استمراري."
      ],
      correctAnswer: 0, // العلم قناة سعرية صغيرة، والراية مثلث صغير.
      explanation: "كلاهما أنماط استمرارية قصيرة الأجل بعد حركة حادة.",
      explanationEn: "Both are short-term continuation patterns after a sharp move."
    },
    {
      id: "q16",
      question: "ما هي أهمية 'التأكيد' (Confirmation) عند التداول بالأنماط السعرية؟",
      options: [
        "للدخول في الصفقة قبل أن يكتمل النمط.",
        "لزيادة المخاطر المحتملة.",
        "للتأكد من صحة النمط وتجنب الإشارات الكاذبة.",
        "لجعل التحليل أكثر تعقيداً."
      ],
      correctAnswer: 2, // للتأكد من صحة النمط وتجنب الإشارات الكاذبة.
      explanation: "التأكيد يقلل من الصفقات الخاسرة ويزيد من فرص النجاح.",
      explanationEn: "Confirmation reduces losing trades and increases success rates."
    },
    {
      id: "q17",
      question: "أي من الأنماط التالية يعتبر نمط انعكاسي هبوطي قوي ويشبه حرف 'M'؟",
      options: [
        "القمة المزدوجة (Double Top)",
        "القاع المزدوج (Double Bottom)",
        "الرأس والكتفين المقلوب (Inverse Head and Shoulders)",
        "المثلث الهابط (Descending Triangle)"
      ],
      correctAnswer: 0, // القمة المزدوجة (Double Top)
      explanation: "القمة المزدوجة هي إشارة قوية لانعكاس الاتجاه الصاعد إلى هابط.",
      explanationEn: "The Double Top is a strong signal for a bullish to bearish trend reversal."
    },
    {
      id: "q18",
      question: "ما هو الوتد الهابط (Falling Wedge) وماذا يشير غالباً؟",
      options: [
        "نمط استمراري صعودي.",
        "نمط انعكاسي هبوطي.",
        "نمط استمراري هبوطي.",
        "نمط انعكاسي صعودي."
      ],
      correctAnswer: 3, // نمط انعكاسي صعودي.
      explanation: "الوتد الهابط غالباً ما يخترق للأعلى مشيراً إلى انعكاس صعودي.",
      explanationEn: "A falling wedge often breaks upwards, indicating a bullish reversal."
    },
    {
      id: "q19",
      question: "ما هي أهمية 'الهدف السعري' (Price Target) في الأنماط السعرية؟",
      options: [
        "يحدد نقطة الدخول فقط.",
        "يحدد نقطة وقف الخسارة فقط.",
        "يوفر تقديراً للمسافة التي يمكن أن يتحركها السعر بعد الاختراق/الكسر.",
        "لا يوجد له أي أهمية."
      ],
      correctAnswer: 2, // يوفر تقديراً للمسافة التي يمكن أن يتحركها السعر بعد الاختراق/الكسر.
      explanation: "الهدف السعري يساعد في تحديد استراتيجية جني الأرباح.",
      explanationEn: "The price target helps in defining the profit-taking strategy."
    },
    {
      id: "q20",
      question: "ما هو المثلث المتماثل (Symmetrical Triangle) وماذا يشير غالباً؟",
      options: [
        "نمط انعكاسي صعودي.",
        "نمط انعكاسي هبوطي.",
        "نمط استمراري يشير إلى حيرة في السوق قبل مواصلة الاتجاه السابق.",
        "نمط استمراري يشير إلى انعكاس وشيك."
      ],
      correctAnswer: 2, // نمط استمراري يشير إلى حيرة في السوق قبل مواصلة الاتجاه السابق.
      explanation: "المثلث المتماثل هو نمط توحيد يعكس حيرة السوق قبل أن يقرر مواصلة الاتجاه الأصلي.",
      explanationEn: "A symmetrical triangle is a consolidation pattern reflecting market indecision before resuming the original trend."
    }
  ]
};
