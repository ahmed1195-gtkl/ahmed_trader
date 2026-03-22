export const stage13Quizzes = [
  {
    id: 1,
    stageId: 13,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: الهارمونيك، موجات إليوت، والفراكتلات المتقدمة",
    titleEn: "Mini-Quiz: Advanced Harmonic, Elliott Wave, and Fractal Trading",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هي الأنماط الهارمونيكية المتقدمة التي تتميز بنقطة D التي تصل إلى 161.8% من XA؟",
        questionEn: "Which advanced harmonic patterns are characterized by point D reaching 161.8% of XA?",
        options: [
          { text: "Gartley و Bat", isCorrect: false },
          { text: "Crab و Deep Crab", isCorrect: true },
          { text: "Butterfly و Cypher", isCorrect: false },
          { text: "Shark و Bat", isCorrect: false }
        ],
        explanation: "نمطا Crab و Deep Crab يتميزان بامتداد كبير حيث تصل نقطة D إلى 161.8% من XA، مما يشير إلى إشارة انعكاسية قوية."
      },
      {
        id: 2,
        question: "في تداول الهارمونيك المتقدم، ما هو الغرض من استخدام \"التقاء (Confluence)\"؟",
        questionEn: "In advanced harmonic trading, what is the purpose of using \"Confluence\"?",
        options: [
          { text: "لتحديد حجم الصفقة المناسب", isCorrect: false },
          { text: "لزيادة احتمالية نجاح الانعكاس من خلال تقاطع منطقة PRZ مع مستويات دعم/مقاومة أو خطوط اتجاه أخرى", isCorrect: true },
          { text: "لتحديد نقاط جني الأرباح", isCorrect: false },
          { text: "لإلغاء النمط الهارمونيكي", isCorrect: false }
        ],
        explanation: "التقاء الأدوات التحليلية المختلفة في منطقة PRZ يزيد من قوة إشارة الانعكاس المحتملة."
      },
      {
        id: 3,
        question: "وفقاً لقواعد موجات إليوت، ما هي القاعدة التي تنص على أن الموجة 3 لا يمكن أن تكون الأقصر بين الموجات الدافعة؟",
        questionEn: "According to Elliott Wave rules, which rule states that Wave 3 cannot be the shortest among the impulsive waves?",
        options: [
          { text: "القاعدة 1", isCorrect: false },
          { text: "القاعدة 2", isCorrect: true },
          { text: "القاعدة 3", isCorrect: false },
          { text: "لا توجد قاعدة كهذه", isCorrect: false }
        ],
        explanation: "القاعدة 2 في موجات إليوت تنص على أن الموجة 3 لا يمكن أن تكون الأقصر بين الموجات الدافعة (1, 3, 5)."
      },
      {
        id: 4,
        question: "ما هو النمط التصحيحي المعقد في موجات إليوت الذي يتكون من 5 موجات (3-3-3-3-3) ويتحرك جانبياً بشكل متقارب أو متباعد؟",
        questionEn: "Which complex corrective pattern in Elliott Wave consists of 5 waves (3-3-3-3-3) and moves sideways in a contracting or expanding manner?",
        options: [
          { text: "المسطحة (Flat)", isCorrect: false },
          { text: "المتعرجة (Zigzag)", isCorrect: false },
          { text: "المثلثات (Triangles)", isCorrect: true },
          { text: "التركيبات المزدوجة (Double Combinations)", isCorrect: false }
        ],
        explanation: "المثلثات هي أنماط تصحيحية معقدة تتكون من 5 موجات فرعية وتتحرك بشكل جانبي متقارب أو متباعد."
      },
      {
        id: 5,
        question: "ماذا يعني \"كسر هيكل صعودي (Break of Structure - BOS)\" في تحليل هيكل السوق؟",
        questionEn: "What does a \"Break of Structure (BOS)\" mean in market structure analysis?",
        options: [
          { text: "عندما يتم كسر قاع أعلى سابق", isCorrect: false },
          { text: "عندما يتم كسر قمة سابقة وتكوين قمة أعلى جديدة", isCorrect: true },
          { text: "عندما يتحرك السعر جانبياً", isCorrect: false },
          { text: "عندما يتم كسر قاع أدنى سابق", isCorrect: false }
        ],
        explanation: "كسر هيكل صعودي يحدث عندما يتجاوز السعر قمة سابقة، مؤكداً استمرار الاتجاه الصعودي."
      },
      {
        id: 6,
        question: "في استراتيجية تداول الفراكتلات وهيكل السوق، لماذا يتم الانتقال إلى إطار زمني أصغر بعد تحديد الاتجاه الرئيسي على إطار زمني أكبر؟",
        questionEn: "In fractal trading and market structure strategy, why move to a smaller timeframe after identifying the main trend on a larger timeframe?",
        options: [
          { text: "لإغلاق جميع الصفقات", isCorrect: false },
          { text: "للبحث عن فرص الدخول الدقيقة التي تتوافق مع الاتجاه الرئيسي", isCorrect: true },
          { text: "لتجاهل الاتجاه الرئيسي", isCorrect: false },
          { text: "لأن الأطر الزمنية الأصغر أكثر موثوقية دائماً", isCorrect: false }
        ],
        explanation: "التحليل متعدد الأطر الزمنية يسمح بتحديد الاتجاه العام على إطار زمني كبير، ثم تحسين نقاط الدخول على إطار زمني أصغر."
      },
      {
        id: 7,
        question: "ما هي القاعدة التي تنص على أن الموجة 4 لا يمكن أن تتداخل مع منطقة سعر الموجة 1 في موجات إليوت؟",
        questionEn: "Which rule states that Wave 4 cannot overlap the price territory of Wave 1 in Elliott Waves?",
        options: [
          { text: "القاعدة 1", isCorrect: false },
          { text: "القاعدة 2", isCorrect: false },
          { text: "القاعدة 3", isCorrect: true },
          { text: "قاعدة التناوب", isCorrect: false }
        ],
        explanation: "القاعدة 3 هي التي تمنع تداخل الموجة 4 مع منطقة سعر الموجة 1، باستثناء المثلثات القطرية."
      },
      {
        id: 8,
        question: "ماذا يشير \"تغير في الشخصية (Change of Character - CHoCH)\" في الاتجاه الصعودي؟",
        questionEn: "What does a \"Change of Character (CHoCH)\" indicate in an uptrend?",
        options: [
          { text: "استمرار قوي للاتجاه الصعودي", isCorrect: false },
          { text: "ضعف الاتجاه الصعودي واحتمال الانعكاس", isCorrect: true },
          { text: "تكوين قمة أعلى جديدة", isCorrect: false },
          { text: "تكوين قاع أعلى جديد", isCorrect: false }
        ],
        explanation: "CHoCH في الاتجاه الصعودي يحدث عندما يتم كسر قاع أعلى سابق، مما يشير إلى تحول محتمل في هيكل السوق."
      },
      {
        id: 9,
        question: "في تداول الهارمونيك، أين يوضع وقف الخسارة عادة؟",
        questionEn: "In harmonic trading, where is the stop loss typically placed?",
        options: [
          { text: "عند نقطة B", isCorrect: false },
          { text: "خلف نقطة D بقليل", isCorrect: true },
          { text: "عند نقطة A", isCorrect: false },
          { text: "في منتصف النمط", isCorrect: false }
        ],
        explanation: "يوضع وقف الخسارة عادة خلف نقطة D بقليل لتجنب الاختراقات الكاذبة وحماية رأس المال."
      },
      {
        id: 10,
        question: "ما هي الطبيعة التي تصف تكرار الأنماط السعرية على جميع الأطر الزمنية في الأسواق المالية؟",
        questionEn: "What nature describes the repetition of price patterns across all timeframes in financial markets?",
        options: [
          { text: "الطبيعة العشوائية", isCorrect: false },
          { text: "الطبيعة الخطية", isCorrect: false },
          { text: "الطبيعة الفراكتالية (Fractal Nature)", isCorrect: true },
          { text: "الطبيعة الدورية", isCorrect: false }
        ],
        explanation: "الطبيعة الفراكتالية للأسواق تعني أن الأنماط تتكرر على مقاييس مختلفة، مما يسمح بالتحليل متعدد الأطر الزمنية."
      }
    ]
  }
];
