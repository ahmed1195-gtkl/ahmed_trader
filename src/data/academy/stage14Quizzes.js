export const stage14Quizzes = [
  {
    id: 1,
    stageId: 14,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: تداول السيولة، كتل الأوامر، وتداول الأخبار",
    titleEn: "Mini-Quiz: Liquidity, Order Blocks, and News Trading",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هو الغرض الرئيسي للمؤسسات الكبرى من استهداف مناطق السيولة في السوق؟",
        questionEn: "What is the main purpose of large institutions targeting liquidity zones in the market?",
        options: [
          { text: "لزيادة التقلبات السعرية", isCorrect: false },
          { text: "لتنفيذ أوامرها الكبيرة دون التأثير بشكل كبير على السعر", isCorrect: true },
          { text: "لإرباك المتداولين الصغار", isCorrect: false },
          { text: "لتحديد الاتجاه العام للسوق", isCorrect: false }
        ],
        explanation: "المؤسسات تحتاج إلى سيولة ضخمة لتنفيذ صفقاتها، واستهداف مناطق السيولة يساعدها على ذلك."
      },
      {
        id: 2,
        question: "ماذا تمثل \"كتلة الأوامر الصعودية (Bullish Order Block)\"؟",
        questionEn: "What does a \"Bullish Order Block\" represent?",
        options: [
          { text: "آخر شمعة صعودية قبل حركة هبوطية قوية", isCorrect: false },
          { text: "آخر شمعة هبوطية قبل حركة صعودية قوية تكسر هيكل السوق", isCorrect: true },
          { text: "منطقة دعم قوية", isCorrect: false },
          { text: "منطقة مقاومة قوية", isCorrect: false }
        ],
        explanation: "كتلة الأوامر الصعودية هي آخر شمعة هبوطية قبل حركة صعودية قوية تكسر هيكل السوق، مما يشير إلى منطقة دخول محتملة للمشترين المؤسسيين."
      },
      {
        id: 3,
        question: "ما هي الفجوات السعرية غير المتوازنة (Imbalance / FVG)؟",
        questionEn: "What are Imbalance / Fair Value Gaps (FVG)?",
        options: [
          { text: "مناطق على الرسم البياني حيث توجد فجوة بين الشمعة الأولى والثالثة في حركة سعرية قوية", isCorrect: true },
          { text: "مناطق يتم فيها ملء أوامر الشراء والبيع بالتساوي", isCorrect: false },
          { text: "مناطق يتم فيها تداول السعر بشكل جانبي", isCorrect: false },
          { text: "مناطق يتم فيها عكس الاتجاه بشكل مفاجئ", isCorrect: false }
        ],
        explanation: "FVG هي مناطق عدم توازن بين المشترين والبائعين، وغالباً ما يعود السعر لملئها."
      },
      {
        id: 4,
        question: "ما هي إحدى خصائص تداول الأخبار عالية التأثير؟",
        questionEn: "What is one characteristic of high-impact news trading?",
        options: [
          { text: "انخفاض كبير في التقلبات السعرية", isCorrect: false },
          { text: "زيادة في السبريد (الفارق بين سعر الشراء والبيع)", isCorrect: true },
          { text: "تنفيذ الأوامر دائماً بالسعر المطلوب", isCorrect: false },
          { text: "غياب الفجوات السعرية", isCorrect: false }
        ],
        explanation: "الأخبار عالية التأثير تسبب زيادة في السبريد والانزلاق السعري بسبب التقلبات الشديدة."
      },
      {
        id: 5,
        question: "لماذا يعتبر وضع وقف الخسارة الفوري أمراً حاسماً في تداول الأخبار؟",
        questionEn: "Why is immediate stop-loss placement crucial in news trading?",
        options: [
          { text: "لزيادة الأرباح المحتملة", isCorrect: false },
          { text: "لحماية رأس المال من التقلبات السعرية العنيفة وغير المتوقعة", isCorrect: true },
          { text: "لتحسين نسبة المخاطرة إلى المكافأة", isCorrect: false },
          { text: "لضمان تنفيذ الصفقة", isCorrect: false }
        ],
        explanation: "وقف الخسارة الفوري يحمي رأس المال من التحركات السعرية الحادة التي قد تحدث بعد صدور الأخبار."
      },
      {
        id: 6,
        question: "ما هو الغرض من استخدام المفكرة الاقتصادية (Economic Calendar) في تداول الأخبار؟",
        questionEn: "What is the purpose of using an Economic Calendar in news trading?",
        options: [
          { text: "لتحديد أفضل أزواج العملات للتداول", isCorrect: false },
          { text: "لتحديد الأخبار عالية التأثير القادمة وتوقيت صدورها", isCorrect: true },
          { text: "لتحليل البيانات التاريخية للأسعار", isCorrect: false },
          { text: "لتحديد مستويات الدعم والمقاومة", isCorrect: false }
        ],
        explanation: "المفكرة الاقتصادية هي الأداة الأساسية لتتبع الأخبار الاقتصادية الهامة وتوقيت صدورها."
      },
      {
        id: 7,
        question: "ما هي إحدى المكونات الأساسية لخطة التداول الشاملة؟",
        questionEn: "What is one of the essential components of a comprehensive trading plan?",
        options: [
          { text: "التداول العشوائي", isCorrect: false },
          { text: "إدارة المخاطر ورأس المال", isCorrect: true },
          { text: "تجاهل الأهداف الشخصية", isCorrect: false },
          { text: "عدم مراجعة الأداء", isCorrect: false }
        ],
        explanation: "إدارة المخاطر ورأس المال هي حجر الزاوية في أي خطة تداول ناجحة لحماية رأس المال وضمان الاستدامة."
      },
      {
        id: 8,
        question: "لماذا يعتبر سجل التداول (Trading Journal) مهماً؟",
        questionEn: "Why is a Trading Journal important?",
        options: [
          { text: "لنسيان الصفقات الخاسرة بسرعة", isCorrect: false },
          { text: "لتقييم الأداء، تحديد نقاط القوة والضعف، والتعلم من الأخطاء", isCorrect: true },
          { text: "لإظهار الصفقات الرابحة فقط", isCorrect: false },
          { text: "للتداول بدون خطة", isCorrect: false }
        ],
        explanation: "سجل التداول يسمح للمتداول بمراجعة صفقاته بشكل موضوعي، وتحليل أدائه، وتحديد المجالات التي تحتاج إلى تحسين."
      },
      {
        id: 9,
        question: "ما هي الخطوة الأولى في بناء خطة تداول؟",
        questionEn: "What is the first step in building a trading plan?",
        options: [
          { text: "التداول مباشرة بحساب حقيقي", isCorrect: false },
          { text: "التفكير والبحث لتحديد الأهداف والاستراتيجيات المناسبة", isCorrect: true },
          { text: "نسخ خطة تداول متداول آخر", isCorrect: false },
          { text: "تجاهل سيكولوجية التداول", isCorrect: false }
        ],
        explanation: "الخطوة الأولى هي التفكير والبحث لتحديد الأهداف الشخصية والمالية، واختيار الاستراتيجيات التي تتناسب مع شخصية المتداول."
      },
      {
        id: 10,
        question: "ماذا يعني \"Backtesting\" في سياق خطة التداول؟",
        questionEn: "What does \"Backtesting\" mean in the context of a trading plan?",
        options: [
          { text: "التداول على حساب حقيقي", isCorrect: false },
          { text: "اختبار الاستراتيجيات على البيانات التاريخية لتقييم فعاليتها", isCorrect: true },
          { text: "التداول على حساب تجريبي", isCorrect: false },
          { text: "تجاهل الأداء السابق", isCorrect: false }
        ],
        explanation: "Backtesting هو عملية اختبار استراتيجية تداول باستخدام البيانات التاريخية لتحديد مدى فعاليتها وربحيتها قبل تطبيقها في التداول الحقيقي."
      }
    ]
  },
  {
    id: 2,
    stageId: 14,
    type: "stage-exam",
    title: "الاختبار النهائي للمرحلة 14: المتاجرة المتقدمة واستراتيجيات احترافية",
    titleEn: "Stage 14 Final Exam: Advanced Trading and Professional Strategies",
    passingScore: 75,
    timeLimitMinutes: 30,
    questions: [
      {
        id: 1,
        question: "ما هو المفهوم الذي يشير إلى وجود أوامر شراء وبيع معلقة بكميات كبيرة عند مستويات سعرية معينة؟",
        questionEn: "What concept refers to the presence of large quantities of pending buy and sell orders at specific price levels?",
        options: [
          { text: "التقلبات", isCorrect: false },
          { text: "السيولة", isCorrect: true },
          { text: "الزخم", isCorrect: false },
          { text: "السبريد", isCorrect: false }
        ],
        explanation: "السيولة هي أساس حركة السوق، وتمثل وجود أوامر معلقة بكميات كبيرة."
      },
      {
        id: 2,
        question: "ما هي \"كتلة الأوامر الهبوطية (Bearish Order Block)\"؟",
        questionEn: "What is a \"Bearish Order Block\"?",
        options: [
          { text: "آخر شمعة هبوطية قبل حركة صعودية قوية", isCorrect: false },
          { text: "آخر شمعة صعودية قبل حركة هبوطية قوية تكسر هيكل السوق", isCorrect: true },
          { text: "منطقة طلب قوية", isCorrect: false },
          { text: "منطقة عرض ضعيفة", isCorrect: false }
        ],
        explanation: "كتلة الأوامر الهبوطية هي آخر شمعة صعودية قبل حركة هبوطية قوية، وتشير إلى منطقة بيع محتملة للمؤسسات."
      },
      {
        id: 3,
        question: "في استراتيجية تداول السيولة وكتل الأوامر، لماذا ننتقل إلى إطار زمني أصغر بعد تحديد الاتجاه الرئيسي على إطار زمني أكبر؟",
        questionEn: "In the liquidity and order blocks trading strategy, why do we move to a smaller timeframe after identifying the main trend on a larger timeframe?",
        options: [
          { text: "لإغلاق جميع الصفقات", isCorrect: false },
          { text: "للبحث عن فرص الدخول الدقيقة التي تتوافق مع الاتجاه الرئيسي", isCorrect: true },
          { text: "لتجاهل الاتجاه الرئيسي", isCorrect: false },
          { text: "لأن الأطر الزمنية الأصغر أكثر موثوقية دائماً", isCorrect: false }
        ],
        explanation: "التحليل متعدد الأطر الزمنية يسمح بتحديد الاتجاه العام على إطار زمني كبير، ثم تحسين نقاط الدخول على إطار زمني أصغر."
      },
      {
        id: 4,
        question: "ما هو أحد المخاطر الرئيسية لتداول الأخبار عالية التأثير؟",
        questionEn: "What is one of the main risks of high-impact news trading?",
        options: [
          { text: "انخفاض السبريد", isCorrect: false },
          { text: "غياب التقلبات السعرية", isCorrect: false },
          { text: "الانزلاق السعري (Slippage)", isCorrect: true },
          { text: "تنفيذ الأوامر بأسعار أفضل", isCorrect: false }
        ],
        explanation: "الانزلاق السعري هو تنفيذ الأمر بسعر مختلف عن السعر المطلوب بسبب التقلبات السريعة بعد صدور الأخبار."
      },
      {
        id: 5,
        question: "ما هي استراتيجية الدخول التي تتضمن وضع أوامر معلقة فوق وتحت المستويات الرئيسية قبل صدور الخبر؟",
        questionEn: "Which entry strategy involves placing pending orders above and below key levels before a news release?",
        options: [
          { text: "استراتيجية الارتداد", isCorrect: false },
          { text: "استراتيجية الاختراق", isCorrect: true },
          { text: "استراتيجية التجميع", isCorrect: false },
          { text: "استراتيجية التوزيع", isCorrect: false }
        ],
        explanation: "استراتيجية الاختراق تهدف إلى الدخول في اتجاه الحركة القوية التي يسببها الخبر من خلال أوامر معلقة."
      },
      {
        id: 6,
        question: "ما هي نسبة المخاطرة إلى المكافأة (R:R Ratio) التي يجب أن تستهدفها كحد أدنى في صفقاتك؟",
        questionEn: "What is the minimum Risk-to-Reward Ratio (R:R Ratio) you should aim for in your trades?",
        options: [
          { text: "1:1", isCorrect: false },
          { text: "1:0.5", isCorrect: false },
          { text: "1:2", isCorrect: true },
          { text: "2:1", isCorrect: false }
        ],
        explanation: "نسبة 1:2 تعني أنك تخاطر بوحدة واحدة لتحقيق وحدتين من الربح، وهي نسبة جيدة لضمان الربحية على المدى الطويل."
      },
      {
        id: 7,
        question: "ما هو الغرض الرئيسي من سجل التداول (Trading Journal)؟",
        questionEn: "What is the main purpose of a Trading Journal?",
        options: [
          { text: "لتسجيل الأرباح فقط", isCorrect: false },
          { text: "لتقييم الأداء، تحديد نقاط القوة والضعف، والتعلم من الأخطاء", isCorrect: true },
          { text: "لمشاركة الصفقات مع الآخرين", isCorrect: false },
          { text: "لتحديد الأخبار الاقتصادية", isCorrect: false }
        ],
        explanation: "سجل التداول هو أداة حيوية للتحسين المستمر من خلال تحليل الصفقات الماضية."
      },
      {
        id: 8,
        question: "ما هي أهمية \"Backtesting\" في بناء خطة التداول؟",
        questionEn: "What is the importance of \"Backtesting\" in building a trading plan?",
        options: [
          { text: "للتداول مباشرة بحساب حقيقي", isCorrect: false },
          { text: "لاختبار الاستراتيجيات على البيانات التاريخية لتقييم فعاليتها قبل التداول الحقيقي", isCorrect: true },
          { text: "للتداول على حساب تجريبي", isCorrect: false },
          { text: "لتجاهل الأداء السابق", isCorrect: false }
        ],
        explanation: "Backtesting يوفر رؤى حول كيفية أداء الاستراتيجية في الماضي، مما يساعد على تحسينها قبل المخاطرة برأس مال حقيقي."
      },
      {
        id: 9,
        question: "ما هي القاعدة الذهبية لإدارة المخاطر في تداول الأخبار عالية التأثير؟",
        questionEn: "What is the golden rule for risk management in high-impact news trading?",
        options: [
          { text: "زيادة حجم الصفقة لتعظيم الأرباح", isCorrect: false },
          { text: "عدم استخدام وقف الخسارة", isCorrect: false },
          { text: "تقليل حجم الصفقة بشكل كبير ووضع وقف خسارة فوري", isCorrect: true },
          { text: "التداول بدون خطة", isCorrect: false }
        ],
        explanation: "تقليل حجم الصفقة ووضع وقف خسارة فوري هما الأكثر أهمية لحماية رأس المال في بيئة الأخبار المتقلبة."
      },
      {
        id: 10,
        question: "ما هو الدور الذي تلعبه سيكولوجية التداول في نجاح المتداول؟",
        questionEn: "What role does trading psychology play in a trader's success?",
        options: [
          { text: "دور ثانوي وغير مهم", isCorrect: false },
          { text: "دور حاسم في التحكم بالعواطف واتخاذ قرارات منطقية", isCorrect: true },
          { text: "لا علاقة لها بالربحية", isCorrect: false },
          { text: "تقتصر على المتداولين المبتدئين فقط", isCorrect: false }
        ],
        explanation: "سيكولوجية التداول هي عامل أساسي، حيث أن التحكم في الخوف والطمع والانضباط العاطفي يؤثر بشكل مباشر على الأداء."
      },
      {
        id: 11,
        question: "ماذا يعني \"سحب السيولة (Liquidity Sweep)\"؟",
        questionEn: "What does \"Liquidity Sweep\" mean?",
        options: [
          { text: "إغلاق جميع الصفقات في السوق", isCorrect: false },
          { text: "قيام المؤسسات بدفع السعر لكسر مستويات السيولة (مثل وقف الخسارة) قبل عكس الاتجاه", isCorrect: true },
          { text: "زيادة مفاجئة في حجم التداول", isCorrect: false },
          { text: "انخفاض حاد في التقلبات", isCorrect: false }
        ],
        explanation: "سحب السيولة هو تكتيك تستخدمه المؤسسات لتفعيل أوامر وقف الخسارة للمتداولين الصغار قبل التحرك في الاتجاه المعاكس."
      },
      {
        id: 12,
        question: "ما هي الفائدة من تحديد الفجوات السعرية غير المتوازنة (FVG)؟",
        questionEn: "What is the benefit of identifying Fair Value Gaps (FVG)?",
        options: [
          { text: "تحديد مناطق السيولة", isCorrect: false },
          { text: "تحديد مناطق محتملة لعودة السعر لملء الفجوة قبل استمرار الاتجاه", isCorrect: true },
          { text: "تحديد نقاط جني الأرباح", isCorrect: false },
          { text: "تحديد وقف الخسارة", isCorrect: false }
        ],
        explanation: "FVG تشير إلى عدم توازن في السوق، وغالباً ما يعود السعر لملء هذه الفجوات، مما يوفر فرص دخول."
      },
      {
        id: 13,
        question: "ما هي استراتيجية الدخول التي تتضمن انتظار الحركة الأولية العنيفة بعد الخبر ثم البحث عن إشارات انعكاسية؟",
        questionEn: "Which entry strategy involves waiting for the initial violent movement after the news and then looking for reversal signals?",
        options: [
          { text: "استراتيجية الاختراق", isCorrect: false },
          { text: "استراتيجية الارتداد (Fade Strategy)", isCorrect: true },
          { text: "استراتيجية التجميع", isCorrect: false },
          { text: "استراتيجية التوزيع", isCorrect: false }
        ],
        explanation: "استراتيجية الارتداد هي محاولة للتداول عكس الحركة الأولية المبالغ فيها بعد الخبر."
      },
      {
        id: 14,
        question: "ما هو الحد الأقصى الموصى به للمخاطرة لكل صفقة كنسبة مئوية من رأس المال في تداول الأخبار؟",
        questionEn: "What is the recommended maximum risk per trade as a percentage of capital in news trading?",
        options: [
          { text: "5%", isCorrect: false },
          { text: "2%", isCorrect: false },
          { text: "0.5% أو أقل", isCorrect: true },
          { text: "10%", isCorrect: false }
        ],
        explanation: "بسبب التقلبات العالية، يجب تقليل المخاطرة لكل صفقة بشكل كبير في تداول الأخبار لحماية رأس المال."
      },
      {
        id: 15,
        question: "ما هي أهمية تحديد الأهداف الشخصية والمالية في خطة التداول؟",
        questionEn: "What is the importance of defining personal and financial goals in a trading plan?",
        options: [
          { text: "ليس لها أهمية", isCorrect: false },
          { text: "لتوفير الوضوح والتركيز وتحديد الدافع وراء التداول", isCorrect: true },
          { text: "لزيادة المخاطرة", isCorrect: false },
          { text: "للتداول بدون استراتيجية", isCorrect: false }
        ],
        explanation: "تحديد الأهداف يوفر اتجاهاً واضحاً ويساعد المتداول على البقاء متحفزاً ومنضبطاً."
      },
      {
        id: 16,
        question: "ماذا يجب أن تسجل في سجل التداول الخاص بك؟",
        questionEn: "What should you record in your trading journal?",
        options: [
          { text: "تاريخ، وقت، الأصول، الدخول، الخروج، الربح/الخسارة، الأسباب، الدروس المستفادة", isCorrect: true },
          { text: "الربح والخسارة فقط", isCorrect: false },
          { text: "الاستراتيجيات التي لم تستخدمها", isCorrect: false },
          { text: "الأخبار الاقتصادية فقط", isCorrect: false }
        ],
        explanation: "سجل التداول الشامل يتضمن جميع تفاصيل الصفقة والتحليل والدروس المستفادة للتعلم والتحسين."
      },
      {
        id: 17,
        question: "ما هي أهمية المراجعة الدورية لخطة التداول؟",
        questionEn: "What is the importance of regularly reviewing a trading plan?",
        options: [
          { text: "لإلغاء الخطة تماماً", isCorrect: false },
          { text: "لتعديلها وتحسينها حسب تطور المهارات وظروف السوق", isCorrect: true },
          { text: "للتوقف عن التداول", isCorrect: false },
          { text: "لزيادة المخاطرة", isCorrect: false }
        ],
        explanation: "المراجعة الدورية تضمن أن الخطة تظل ذات صلة وفعالة مع تغير ظروف السوق وتطور المتداول."
      },
      {
        id: 18,
        question: "ما هو المفهوم الذي يشير إلى أن الأنماط السعرية تتكرر على جميع الأطر الزمنية في الأسواق المالية؟",
        questionEn: "What concept indicates that price patterns repeat across all timeframes in financial markets?",
        options: [
          { text: "الطبيعة العشوائية", isCorrect: false },
          { text: "الطبيعة الخطية", isCorrect: false },
          { text: "الطبيعة الفراكتالية (Fractal Nature)", isCorrect: true },
          { text: "الطبيعة الدورية", isCorrect: false }
        ],
        explanation: "الطبيعة الفراكتالية للأسواق تعني أن الأنماط تتكرر على مقاييس مختلفة، مما يسمح بالتحليل متعدد الأطر الزمنية."
      },
      {
        id: 19,
        question: "في تداول السيولة وكتل الأوامر، أين يوضع وقف الخسارة عادة؟",
        questionEn: "In liquidity and order blocks trading, where is the stop loss typically placed?",
        options: [
          { text: "عند نقطة الدخول", isCorrect: false },
          { text: "خلف كتلة الأوامر أو منطقة FVG مباشرة", isCorrect: true },
          { text: "عند هدف جني الأرباح", isCorrect: false },
          { text: "بعيداً جداً عن نقطة الدخول", isCorrect: false }
        ],
        explanation: "وقف الخسارة الدقيق خلف كتلة الأوامر أو FVG يسمح بنسبة مخاطرة إلى مكافأة عالية."
      },
      {
        id: 20,
        question: "ما هو الغرض من \"التأكيد (Confirmation)\" عند الدخول في صفقة بعد إعادة اختبار كتلة الأوامر؟",
        questionEn: "What is the purpose of \"Confirmation\" when entering a trade after retesting an order block?",
        options: [
          { text: "لزيادة حجم الصفقة", isCorrect: false },
          { text: "للتأكد من أن السعر سيتحرك في الاتجاه المطلوب وتقليل المخاطرة", isCorrect: true },
          { text: "لتجاهل إشارات الانعكاس", isCorrect: false },
          { text: "لإطالة مدة الصفقة", isCorrect: false }
        ],
        explanation: "التأكيد، مثل نماذج الشموع الانعكاسية أو CHoCH، يزيد من احتمالية نجاح الصفقة ويقلل من الدخول في صفقات خاسرة."
      }
    ]
  }
];
