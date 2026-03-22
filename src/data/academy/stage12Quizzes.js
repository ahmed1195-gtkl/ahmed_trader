export const stage12Quizzes = [
  {
    id: 1,
    stageId: 12,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: تداول المدى، الزخم، والفجوات المتقدم",
    titleEn: "Mini-Quiz: Advanced Range, Momentum, and Gap Trading",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هي الخصائص التي تميز القناة السعرية \"الصحية\" في تداول المدى المتقدم؟",
        questionEn: "What characteristics distinguish a \"healthy\" price channel in advanced range trading?",
        options: [
          { text: "الوضوح، الانتظام، وزيادة حجم التداول داخل القناة", isCorrect: false },
          { text: "الوضوح، الانتظام، وانخفاض حجم التداول داخل القناة مع زيادته عند اختبار الحدود", isCorrect: true },
          { text: "الغموض، عدم الانتظام، وحجم تداول مرتفع باستمرار", isCorrect: false },
          { text: "لا توجد خصائص محددة، كل القنوات متشابهة", isCorrect: false }
        ],
        explanation: "القناة الصحية تتميز بحدود واضحة، حركة سعر منتظمة، وانخفاض حجم التداول داخلها مع زيادته عند الارتداد من الحدود."
      },
      {
        id: 2,
        question: "في تداول المدى المتقدم، متى تكون \"إعادة الاختبار (Retest)\" فرصة للدخول في صفقة؟",
        questionEn: "In advanced range trading, when is a \"Retest\" an opportunity to enter a trade?",
        options: [
          { text: "عندما يخترق السعر القناة ويستمر في الاتجاه", isCorrect: false },
          { text: "عندما يعود السعر لإعادة اختبار الحد المخترق للقناة قبل مواصلة الاتجاه", isCorrect: true },
          { text: "عندما يرتد السعر من منتصف القناة", isCorrect: false },
          { text: "لا تستخدم إعادة الاختبار في تداول المدى", isCorrect: false }
        ],
        explanation: "إعادة الاختبار تحدث عادة بعد اختراق حقيقي للقناة، حيث يتحول الحد المخترق إلى دعم أو مقاومة جديد."
      },
      {
        id: 3,
        question: "ما هي علامة الزخم القوي التي يجب البحث عنها في تداول الزخم المتقدم؟",
        questionEn: "What is a sign of strong momentum to look for in advanced momentum trading?",
        options: [
          { text: "شموع صغيرة وذيول طويلة", isCorrect: false },
          { text: "انخفاض في حجم التداول", isCorrect: false },
          { text: "شموع كبيرة وقوية مع زيادة في حجم التداول", isCorrect: true },
          { text: "مؤشرات الزخم تظهر قراءات ضعيفة", isCorrect: false }
        ],
        explanation: "الزخم القوي يتجلى في شموع ذات أجسام كبيرة وذيول صغيرة مصحوبة بزيادة في حجم التداول."
      },
      {
        id: 4,
        question: "متى يجب الخروج من صفقة تداول الزخم؟",
        questionEn: "When should one exit a momentum trade?",
        options: [
          { text: "عندما يستمر الزخم في الارتفاع", isCorrect: false },
          { text: "عندما تبدأ مؤشرات الزخم في التباطؤ أو يظهر تباعد (Divergence)", isCorrect: true },
          { text: "عندما يصل السعر إلى مستوى دعم قوي", isCorrect: false },
          { text: "لا يوجد وقت محدد للخروج", isCorrect: false }
        ],
        explanation: "الخروج من صفقة الزخم يكون عند ظهور علامات ضعف الزخم، مثل التباطؤ في المؤشرات أو التباعد."
      },
      {
        id: 5,
        question: "ما هو نوع الفجوة السعرية التي تشير إلى بداية اتجاه جديد قوي وغالباً ما لا يتم إغلاقها بسرعة؟",
        questionEn: "What type of price gap indicates the start of a strong new trend and is often not filled quickly?",
        options: [
          { text: "فجوة الإرهاق (Exhaustion Gap)", isCorrect: false },
          { text: "الفجوة العادية (Common Gap)", isCorrect: false },
          { text: "فجوة الانفصال (Breakaway Gap)", isCorrect: true },
          { text: "فجوة الاستمرار (Runaway Gap)", isCorrect: false }
        ],
        explanation: "فجوة الانفصال تحدث عند اختراق مستوى رئيسي وتشير إلى بداية اتجاه جديد قوي."
      },
      {
        id: 6,
        question: "في تداول الفجوات السعرية، ما هو الهدف الأول لفجوة الإرهاق؟",
        questionEn: "In gap trading, what is the primary target for an Exhaustion Gap?",
        options: [
          { text: "استمرار الاتجاه الحالي", isCorrect: false },
          { text: "إغلاق الفجوة (Fill the Gap)", isCorrect: true },
          { text: "كسر مستوى دعم/مقاومة جديد", isCorrect: false },
          { text: "لا يوجد هدف محدد", isCorrect: false }
        ],
        explanation: "فجوات الإرهاق غالباً ما يتم إغلاقها بسرعة، لذا فإن إغلاق الفجوة هو الهدف الأول."
      },
      {
        id: 7,
        question: "لماذا تعتبر إدارة المخاطر الصارمة مهمة جداً في تداول المدى؟",
        questionEn: "Why is strict risk management very important in range trading?",
        options: [
          { text: "لأنها تضمن الربح في كل صفقة", isCorrect: false },
          { text: "للحماية من الاختراقات المفاجئة للقناة التي قد تؤدي إلى خسائر كبيرة", isCorrect: true },
          { text: "لأنها تلغي الحاجة إلى التحليل الفني", isCorrect: false },
          { text: "لأنها تجعل التداول أكثر إثارة", isCorrect: false }
        ],
        explanation: "الاختراق المفاجئ للقناة يمكن أن يغير ديناميكية السوق بالكامل، وإدارة المخاطر تحمي رأس المال."
      },
      {
        id: 8,
        question: "ما هو مؤشر الزخم الذي يمكن استخدامه لتحديد مناطق التشبع الشرائي/البيعي في تداول المدى؟",
        questionEn: "Which momentum indicator can be used to identify overbought/oversold zones in range trading?",
        options: [
          { text: "المتوسط المتحرك (Moving Average)", isCorrect: false },
          { text: "مؤشر القوة النسبية (RSI)", isCorrect: true },
          { text: "MACD", isCorrect: false },
          { text: "حجم التداول (Volume)", isCorrect: false }
        ],
        explanation: "مؤشر القوة النسبية (RSI) ومؤشر ستوكاستيك (Stochastic) هما من مؤشرات التذبذب الشائعة لتحديد مناطق التشبع."
      },
      {
        id: 9,
        question: "ما هو المفهوم الذي يصف معدل سرعة تغير السعر؟",
        questionEn: "What concept describes the rate of speed of price change?",
        options: [
          { text: "التقلب (Volatility)", isCorrect: false },
          { text: "الاتجاه (Trend)", isCorrect: false },
          { text: "الزخم (Momentum)", isCorrect: true },
          { text: "الحجم (Volume)", isCorrect: false }
        ],
        explanation: "الزخم هو مقياس لسرعة وقوة حركة السعر."
      },
      {
        id: 10,
        question: "لماذا يجب على المتداولين تجنب تداول \"الفجوة العادية (Common Gap)\"؟",
        questionEn: "Why should traders avoid trading a \"Common Gap\"?",
        options: [
          { text: "لأنها دائماً ما تؤدي إلى خسائر", isCorrect: false },
          { text: "لأنها تحدث في نطاقات التداول الجانبية وليس لها أهمية تداولية كبيرة", isCorrect: true },
          { text: "لأنها تحدث فقط في الأسواق المتقلبة", isCorrect: false },
          { text: "لأنها لا يمكن إغلاقها أبداً", isCorrect: false }
        ],
        explanation: "الفجوات العادية لا توفر فرص تداول موثوقة وغالباً ما يتم إغلاقها بسرعة دون حركة اتجاهية واضحة."
      }
    ]
  },
  {
    id: 2,
    stageId: 12,
    type: "stage-exam",
    title: "الاختبار النهائي للمرحلة 12: المتاجرة المتقدمة واستراتيجيات احترافية",
    titleEn: "Stage 12 Final Exam: Advanced Trading and Professional Strategies",
    passingScore: 75,
    timeLimitMinutes: 30,
    questions: [
      {
        id: 1,
        question: "ما هو الفرق الرئيسي بين فجوة الانفصال وفجوة الإرهاق؟",
        questionEn: "What is the main difference between a Breakaway Gap and an Exhaustion Gap?",
        options: [
          { text: "فجوة الانفصال تحدث في نهاية الاتجاه، وفجوة الإرهاق في بدايته", isCorrect: false },
          { text: "فجوة الانفصال تشير لبداية اتجاه جديد ولا يتم إغلاقها بسرعة، بينما فجوة الإرهاق تشير لنهاية الاتجاه ويتم إغلاقها بسرعة", isCorrect: true },
          { text: "كلاهما يشيران إلى استمرار الاتجاه", isCorrect: false },
          { text: "لا يوجد فرق، كلاهما نفس الشيء", isCorrect: false }
        ],
        explanation: "فجوة الانفصال هي إشارة قوية لبداية اتجاه جديد، بينما فجوة الإرهاق هي إشارة على ضعف الاتجاه الحالي وقرب انعكاسه."
      },
      {
        id: 2,
        question: "ما هي إحدى علامات الزخم الكاذب/الضعيف في تداول الزخم المتقدم؟",
        questionEn: "What is one sign of false/weak momentum in advanced momentum trading?",
        options: [
          { text: "شموع كبيرة وقوية", isCorrect: false },
          { text: "زيادة في حجم التداول", isCorrect: false },
          { text: "حجم تداول منخفض عند الحركة السعرية", isCorrect: true },
          { text: "كسر المستويات الرئيسية بقوة", isCorrect: false }
        ],
        explanation: "الزخم الكاذب أو الضعيف غالباً ما يكون مصحوباً بحجم تداول منخفض، مما يشير إلى أن الحركة قد لا تستمر."
      },
      {
        id: 3,
        question: "في تداول المدى المتقدم، أين يجب وضع وقف الخسارة للحماية من الاختراقات المفاجئة للقناة؟",
        questionEn: "In advanced range trading, where should the stop loss be placed to protect against sudden channel breakouts?",
        options: [
          { text: "داخل القناة بقليل", isCorrect: false },
          { text: "خارج حدود القناة بقليل، أسفل الدعم أو فوق المقاومة", isCorrect: true },
          { text: "عند منتصف القناة", isCorrect: false },
          { text: "لا داعي لوقف الخسارة في تداول المدى", isCorrect: false }
        ],
        explanation: "وضع وقف الخسارة خارج حدود القناة بقليل يحمي المتداول في حال حدوث اختراق حقيقي للقناة."
      },
      {
        id: 4,
        question: "ما هو الغرض من استخدام \"وقف الخسارة المتحرك (Trailing Stop Loss)\" في تداول الزخم؟",
        questionEn: "What is the purpose of using a \"Trailing Stop Loss\" in momentum trading?",
        options: [
          { text: "لتحديد نقطة الدخول الأولية", isCorrect: false },
          { text: "لحماية الأرباح مع السماح للصفقة بالاستمرار طالما الزخم قوي", isCorrect: true },
          { text: "لزيادة المخاطرة في الصفقة", isCorrect: false },
          { text: "لإغلاق الصفقة فوراً عند أي تراجع بسيط", isCorrect: false }
        ],
        explanation: "وقف الخسارة المتحرك يسمح للمتداول بتأمين الأرباح المحققة مع الاستفادة من استمرار الحركة الاتجاهية."
      },
      {
        id: 5,
        question: "أي من هذه الأدوات لا يستخدم عادة لتأكيد نقاط الدخول والخروج في تداول المدى المتقدم؟",
        questionEn: "Which of these tools is NOT typically used to confirm entry and exit points in advanced range trading?",
        options: [
          { text: "مؤشرات التذبذب (Oscillators)", isCorrect: false },
          { text: "نماذج الشموع الانعكاسية", isCorrect: false },
          { text: "حجم التداول", isCorrect: false },
          { text: "مؤشرات الاتجاه المتأخرة (Lagging Trend Indicators)", isCorrect: true }
        ],
        explanation: "مؤشرات الاتجاه المتأخرة مثل المتوسطات المتحركة البسيطة لا تكون فعالة في تحديد نقاط الدخول والخروج الدقيقة داخل النطاقات السعرية."
      },
      {
        id: 6,
        question: "ما هي سيكولوجية \"فجوة الإرهاق (Exhaustion Gap)\"؟",
        questionEn: "What is the psychology behind an \"Exhaustion Gap\"?",
        options: [
          { text: "تعكس قوة كبيرة من المشترين/البائعين", isCorrect: false },
          { text: "تعكس محاولة أخيرة من المشترين/البائعين لدفع السعر، ولكن القوة تتلاشى", isCorrect: true },
          { text: "تشير إلى استمرار الزخم", isCorrect: false },
          { text: "ليس لها أي دلالة سيكولوجية", isCorrect: false }
        ],
        explanation: "فجوة الإرهاق تحدث عندما يحاول المشترون أو البائعون دفع السعر للمرة الأخيرة قبل أن تتلاشى قوتهم وينعكس الاتجاه."
      },
      {
        id: 7,
        question: "ما هو نوع القناة السعرية التي تتميز بخطوط اتجاه أفقية متوازية والسعر يتحرك جانبياً؟",
        questionEn: "What type of price channel is characterized by parallel horizontal trendlines and sideways price movement?",
        options: [
          { text: "القناة الصاعدة (Ascending Channel)", isCorrect: false },
          { text: "القناة الهابطة (Descending Channel)", isCorrect: false },
          { text: "القناة الأفقية (Horizontal Channel)", isCorrect: true },
          { text: "القناة المائلة (Diagonal Channel)", isCorrect: false }
        ],
        explanation: "القناة الأفقية، أو المستطيل، هي منطقة تداول جانبي بين دعم ومقاومة ثابتين."
      },
      {
        id: 8,
        question: "لماذا يعتبر \"التباعد (Divergence)\" بين السعر ومؤشرات الزخم إشارة مهمة للخروج من صفقة الزخم؟",
        questionEn: "Why is \"Divergence\" between price and momentum indicators an important signal to exit a momentum trade?",
        options: [
          { text: "لأنه يؤكد استمرار الزخم", isCorrect: false },
          { text: "لأنه يشير إلى ضعف الزخم الحالي واحتمال انعكاس السعر", isCorrect: true },
          { text: "لأنه يعني أن الصفقة ستكون مربحة دائماً", isCorrect: false },
          { text: "لأنه لا علاقة له بالزخم", isCorrect: false }
        ],
        explanation: "التباعد هو إشارة تحذير مبكرة على أن القوة الدافعة وراء حركة السعر تتلاشى، مما يزيد من احتمالية الانعكاس."
      },
      {
        id: 9,
        question: "في تداول الفجوات السعرية، متى يجب الدخول في الاتجاه المعاكس للفجوة؟",
        questionEn: "In gap trading, when should one enter in the opposite direction of the gap?",
        options: [
          { text: "بعد فجوة الانفصال (Breakaway Gap)", isCorrect: false },
          { text: "بعد فجوة الاستمرار (Runaway Gap)", isCorrect: false },
          { text: "بعد فجوة الإرهاق (Exhaustion Gap) وتأكيد انعكاسي", isCorrect: true },
          { text: "بعد الفجوة العادية (Common Gap)", isCorrect: false }
        ],
        explanation: "فجوة الإرهاق غالباً ما تتبعها حركة انعكاسية، والدخول في الاتجاه المعاكس بعد تأكيد مناسب يكون مربحاً."
      },
      {
        id: 10,
        question: "ما هو المفهوم الذي يصف استغلال العلاقة بين أصلين أو أكثر للتحوط أو لتأكيد إشارات التداول؟",
        questionEn: "What concept describes exploiting the relationship between two or more assets for hedging or confirming trading signals?",
        options: [
          { text: "تداول الاختراق", isCorrect: false },
          { text: "تداول الارتداد", isCorrect: false },
          { text: "تداول الارتباط (Correlation Trading)", isCorrect: true },
          { text: "تداول الفجوات السعرية", isCorrect: false }
        ],
        explanation: "تداول الارتباط يستخدم العلاقات الإحصائية بين الأصول لاتخاذ قرارات تداول أكثر ذكاءً."
      },
      {
        id: 11,
        question: "ما هي الفائدة الرئيسية من استخدام \"الدخول المتعدد (Multiple Entries)\" أو \"الدخول التدريجي (Scaling In)\" في تداول الارتداد؟",
        questionEn: "What is the main benefit of using \"Multiple Entries\" or \"Scaling In\" in reversal trading?",
        options: [
          { text: "لزيادة المخاطرة في كل صفقة", isCorrect: false },
          { text: "لتقليل المخاطرة والدخول على مراحل", isCorrect: true },
          { text: "للدخول في جميع الصفقات دفعة واحدة", isCorrect: false },
          { text: "لأنها طريقة أسرع للتداول", isCorrect: false }
        ],
        explanation: "الدخول التدريجي يقلل من المخاطرة الكلية للصفقة ويسمح للمتداول بتعديل مركزه بناءً على تأكيدات إضافية."
      },
      {
        id: 12,
        question: "ما هو الغرض من \"الاختبار والمحاكاة (Backtesting & Simulation)\" قبل استخدام استراتيجية جديدة؟",
        questionEn: "What is the purpose of \"Backtesting & Simulation\" before using a new strategy?",
        options: [
          { text: "لضمان أن الاستراتيجية ستكون مربحة بنسبة 100%", isCorrect: false },
          { text: "لاختبار الاستراتيجية على البيانات التاريخية وحساب تجريبي قبل المخاطرة بأموال حقيقية", isCorrect: true },
          { text: "لإضاعة الوقت قبل التداول", isCorrect: false },
          { text: "لإثبات أنك متداول محترف", isCorrect: false }
        ],
        explanation: "الاختبار والمحاكاة ضروريان لتقييم فعالية الاستراتيجية وفهم سلوكها في ظروف السوق المختلفة دون المخاطرة برأس المال الحقيقي."
      },
      {
        id: 13,
        question: "أي من هذه الاستراتيجيات تهدف إلى تحديد نقاط انعكاس الاتجاهات الرئيسية أو الثانوية؟",
        questionEn: "Which of these strategies aims to identify major or minor trend reversal points?",
        options: [
          { text: "تداول الاختراق", isCorrect: false },
          { text: "تداول الارتداد", isCorrect: true },
          { text: "تداول المدى", isCorrect: false },
          { text: "تداول الزخم", isCorrect: false }
        ],
        explanation: "تداول الارتداد هو فن اصطياد القمم والقيعان في السوق."
      },
      {
        id: 14,
        question: "ما هي إحدى علامات الانعكاس القوية التي تتضمن اختلافاً بين حركة السعر ومؤشرات الزخم؟",
        questionEn: "What is one strong reversal sign that involves a discrepancy between price action and momentum indicators?",
        options: [
          { text: "إغلاق شمعة قوية", isCorrect: false },
          { text: "حجم تداول مرتفع", isCorrect: false },
          { text: "التباعد (Divergence)", isCorrect: true },
          { text: "إعادة الاختبار", isCorrect: false }
        ],
        explanation: "التباعد هو إشارة قوية على ضعف الاتجاه الحالي واحتمال انعكاسه."
      },
      {
        id: 15,
        question: "لماذا يُنصح بـ \"انتظار تأكيد السعر (Price Action Confirmation)\" في تداول الارتداد؟",
        questionEn: "Why is \"Price Action Confirmation\" recommended in reversal trading?",
        options: [
          { text: "لأن وصول السعر إلى منطقة انعكاس محتملة كافٍ للدخول", isCorrect: false },
          { text: "للتأكد من أن الانعكاس حقيقي وليس مجرد تصحيح مؤقت", isCorrect: true },
          { text: "لزيادة المخاطرة في الصفقة", isCorrect: false },
          { text: "لأنها تلغي الحاجة إلى وقف الخسارة", isCorrect: false }
        ],
        explanation: "تأكيد السعر يقلل من مخاطر الدخول المبكر في انعكاسات كاذبة أو تصحيحات بسيطة."
      },
      {
        id: 16,
        question: "ما هو المفهوم الذي يصف التداول ضمن نطاق سعري محدد عن طريق الشراء عند الدعم والبيع عند المقاومة؟",
        questionEn: "What concept describes trading within a defined price range by buying at support and selling at resistance?",
        options: [
          { text: "تداول الاختراق", isCorrect: false },
          { text: "تداول الارتداد", isCorrect: false },
          { text: "تداول المدى (Range Trading)", isCorrect: true },
          { text: "تداول الزخم", isCorrect: false }
        ],
        explanation: "تداول المدى هو استراتيجية تستغل حركة السعر بين مستويات دعم ومقاومة واضحة."
      },
      {
        id: 17,
        question: "ما هي إحدى علامات الانعكاس التي تتضمن كسر قيعان أعلى في الاتجاه الصعودي؟",
        questionEn: "What is one reversal sign that involves breaking higher lows in an uptrend?",
        options: [
          { text: "نموذج شمعة دوجي", isCorrect: false },
          { text: "تغير في هيكل السوق (Market Structure Shift)", isCorrect: true },
          { text: "زيادة في حجم التداول", isCorrect: false },
          { text: "إعادة الاختبار", isCorrect: false }
        ],
        explanation: "كسر القيعان الأعلى في الاتجاه الصعودي يشير إلى ضعف المشترين واحتمال تحول الاتجاه إلى هبوطي."
      },
      {
        id: 18,
        question: "لماذا تعتبر إدارة المخاطر في تداول الارتداد مهمة جداً؟",
        questionEn: "Why is risk management in reversal trading very important?",
        options: [
          { text: "لأنها تضمن الربح في كل صفقة", isCorrect: false },
          { text: "لأن محاولة اصطياد القمم والقيعان يمكن أن تكون خطيرة وتؤدي إلى خسائر كبيرة", isCorrect: true },
          { text: "لأنها تلغي الحاجة إلى التحليل", isCorrect: false },
          { text: "لأنها تجعل التداول أكثر إثارة", isCorrect: false }
        ],
        explanation: "تداول الارتداد يتطلب دقة عالية، وإدارة المخاطر تحمي المتداول من الأخطاء المكلفة."
      },
      {
        id: 19,
        question: "ما هو المفهوم الذي يصف استغلال الفجوات السعرية التي تحدث عادة عند افتتاح السوق؟",
        questionEn: "What concept describes exploiting price gaps that typically occur at market open?",
        options: [
          { text: "تداول الاختراق", isCorrect: false },
          { text: "تداول الارتداد", isCorrect: false },
          { text: "تداول الفجوات السعرية (Gap Trading)", isCorrect: true },
          { text: "تداول الزخم", isCorrect: false }
        ],
        explanation: "تداول الفجوات السعرية هو استراتيجية متخصصة تستغل الحركات السعرية المفاجئة عند افتتاح السوق."
      },
      {
        id: 20,
        question: "ما هي الفائدة من استخدام \"الدخول المتعدد (Multiple Entries)\" في تداول الارتداد؟",
        questionEn: "What is the benefit of using \"Multiple Entries\" in reversal trading?",
        options: [
          { text: "لزيادة حجم المخاطرة بشكل كبير", isCorrect: false },
          { text: "لتقليل المخاطرة الكلية للصفقة والدخول على مراحل بناءً على تأكيدات إضافية", isCorrect: true },
          { text: "للدخول في جميع الصفقات دفعة واحدة", isCorrect: false },
          { text: "لأنها طريقة أسرع للتداول", isCorrect: false }
        ],
        explanation: "الدخول المتعدد يسمح للمتداول ببناء مركزه تدريجياً مع الحصول على تأكيدات إضافية، مما يقلل من المخاطرة."
      }
    ]
  }
];
