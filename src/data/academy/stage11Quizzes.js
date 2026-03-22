export const stage11Quizzes = [
  {
    id: 1,
    stageId: 11,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: استراتيجيات التداول المتقدمة",
    titleEn: "Mini-Quiz: Advanced Trading Strategies",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما الذي يميز استراتيجيات التداول المتقدمة عن الأساليب التقليدية؟",
        questionEn: "What distinguishes advanced trading strategies from traditional approaches?",
        options: [
          { text: "التركيز فقط على المؤشرات الفنية", isCorrect: false },
          { text: "تتطلب فهماً أعمق للسوق، انضباطاً عالياً، وقدرة على التكيف", isCorrect: true },
          { text: "تضمن الربح في كل صفقة", isCorrect: false },
          { text: "لا تحتاج إلى إدارة مخاطر", isCorrect: false }
        ],
        explanation: "الاستراتيجيات المتقدمة تتطلب فهماً متعدد الأبعاد للسوق، إدارة مخاطر دقيقة، وتكيفاً مستمراً."
      },
      {
        id: 2,
        question: "ما هو الغرض من استغلال \"الاختراقات الكاذبة\" في استراتيجية تداول الاختراق المتقدمة؟",
        questionEn: "What is the purpose of exploiting \"false breakouts\" in an advanced breakout trading strategy?",
        options: [
          { text: "للدخول في نفس اتجاه الاختراق الكاذب", isCorrect: false },
          { text: "للدخول في الاتجاه المعاكس للاختراق الكاذب", isCorrect: true },
          { text: "لتجنب التداول تماماً", isCorrect: false },
          { text: "لزيادة حجم المخاطرة", isCorrect: false }
        ],
        explanation: "الاختراق الكاذب غالباً ما يشير إلى حركة قوية في الاتجاه المعاكس، ويمكن استغلاله للدخول في صفقة مربحة."
      },
      {
        id: 3,
        question: "أي من هذه العلامات لا يعتبر تأكيداً للاختراق الحقيقي؟",
        questionEn: "Which of these signs is NOT a confirmation of a true breakout?",
        options: [
          { text: "إغلاق شمعة قوية فوق/تحت المستوى المخترق", isCorrect: false },
          { text: "زيادة ملحوظة في حجم التداول عند الاختراق", isCorrect: false },
          { text: "حجم تداول منخفض عند الاختراق", isCorrect: true },
          { text: "إعادة الاختبار (Retest) للمستوى المخترق", isCorrect: false }
        ],
        explanation: "حجم التداول المنخفض عند الاختراق يشير إلى ضعف الحركة وقد يكون علامة على اختراق كاذب."
      },
      {
        id: 4,
        question: "ماذا يعني \"التباعد (Divergence)\" في سياق تداول الارتداد؟",
        questionEn: "What does \"Divergence\" mean in the context of reversal trading?",
        options: [
          { text: "توافق حركة السعر مع مؤشرات الزخم", isCorrect: false },
          { text: "اختلاف بين حركة السعر ومؤشرات الزخم", isCorrect: true },
          { text: "زيادة في حجم التداول", isCorrect: false },
          { text: "إعادة اختبار المستوى المخترق", isCorrect: false }
        ],
        explanation: "التباعد هو اختلاف بين اتجاه حركة السعر واتجاه مؤشر الزخم، وغالباً ما يكون إشارة مبكرة على انعكاس محتمل."
      },
      {
        id: 5,
        question: "لماذا يُنصح بوضع وقف خسارة ضيق في تداول الاختراق؟",
        questionEn: "Why is it recommended to place a tight stop loss in breakout trading?",
        options: [
          { text: "لأن الاختراقات دائماً ما تكون حقيقية", isCorrect: false },
          { text: "لأن تداول الاختراق ينطوي على مخاطر عالية بسبب الاختراقات الكاذبة", isCorrect: true },
          { text: "لزيادة الأرباح المحتملة", isCorrect: false },
          { text: "لأنها استراتيجية بسيطة لا تحتاج إلى إدارة مخاطر", isCorrect: false }
        ],
        explanation: "وقف الخسارة الضيق ضروري لحماية رأس المال من الاختراقات الكاذبة التي تحدث بشكل متكرر في هذه الاستراتيجية."
      },
      {
        id: 6,
        question: "أي من هذه الأدوات يمكن استخدامها لتحديد مناطق الانعكاس المحتملة في تداول الارتداد؟",
        questionEn: "Which of these tools can be used to identify potential reversal zones in reversal trading?",
        options: [
          { text: "المتوسطات المتحركة طويلة الأجل", isCorrect: false },
          { text: "مناطق العرض والطلب", isCorrect: false },
          { text: "مستويات فيبوناتشي", isCorrect: false },
          { text: "جميع ما ذكر", isCorrect: true }
        ],
        explanation: "جميع هذه الأدوات تساعد في تحديد المناطق التي قد ينعكس منها السعر."
      },
      {
        id: 7,
        question: "ما هي الخطوة الأولى التي يجب اتخاذها قبل الغوص في الاستراتيجيات المتقدمة؟",
        questionEn: "What is the first step to take before diving into advanced strategies?",
        options: [
          { text: "شراء مؤشرات مدفوعة", isCorrect: false },
          { text: "إتقان الأساسيات (التحليل الفني والأساسي وإدارة المخاطر)", isCorrect: true },
          { text: "زيادة حجم رأس المال", isCorrect: false },
          { text: "التداول على حساب حقيقي مباشرة", isCorrect: false }
        ],
        explanation: "الأساس المتين في التداول هو شرط أساسي قبل الانتقال إلى الاستراتيجيات الأكثر تعقيداً."
      },
      {
        id: 8,
        question: "ما هو الغرض من \"إعادة الاختبار (Retest)\" في استراتيجية تداول الاختراق؟",
        questionEn: "What is the purpose of a \"Retest\" in a breakout trading strategy?",
        options: [
          { text: "لتأكيد أن الاختراق كان كاذباً", isCorrect: false },
          { text: "لتوفير فرصة دخول ثانية أفضل ومخاطرة أقل", isCorrect: true },
          { text: "لإغلاق الصفقة فوراً", isCorrect: false },
          { text: "لزيادة حجم الصفقة", isCorrect: false }
        ],
        explanation: "إعادة الاختبار تحول المستوى المخترق إلى دعم/مقاومة جديد، مما يوفر نقطة دخول مؤكدة ومخاطرة محددة."
      },
      {
        id: 9,
        question: "ما هو المفهوم الذي يهدف إلى الدخول في صفقة عندما يخترق السعر مستوى دعم أو مقاومة رئيسي؟",
        questionEn: "What concept aims to enter a trade when the price breaks a major support or resistance level?",
        options: [
          { text: "تداول الارتداد", isCorrect: false },
          { text: "تداول المدى", isCorrect: false },
          { text: "تداول الاختراق", isCorrect: true },
          { text: "تداول الزخم", isCorrect: false }
        ],
        explanation: "تداول الاختراق هو الاستراتيجية التي تركز على الدخول عند كسر المستويات الرئيسية."
      },
      {
        id: 10,
        question: "لماذا يعتبر \"الدخول المتعدد (Multiple Entries)\" أو \"الدخول التدريجي (Scaling In)\" مفيداً في تداول الارتداد؟",
        questionEn: "Why are \"Multiple Entries\" or \"Scaling In\" beneficial in reversal trading?",
        options: [
          { text: "لزيادة المخاطرة في كل صفقة", isCorrect: false },
          { text: "لتقليل المخاطرة والدخول على مراحل", isCorrect: true },
          { text: "للدخول في جميع الصفقات دفعة واحدة", isCorrect: false },
          { text: "لأنها طريقة أسرع للتداول", isCorrect: false }
        ],
        explanation: "الدخول التدريجي يقلل من المخاطرة الكلية للصفقة ويسمح للمتداول بتعديل مركزه بناءً على تأكيدات إضافية."
      }
    ]
  },
  {
    id: 2,
    stageId: 11,
    type: "stage-exam",
    title: "الاختبار النهائي للمرحلة 11: المتاجرة المتقدمة واستراتيجيات احترافية",
    titleEn: "Stage 11 Final Exam: Advanced Trading and Professional Strategies",
    passingScore: 75,
    timeLimitMinutes: 30,
    questions: [
      {
        id: 1,
        question: "ما هو الفرق الرئيسي بين الاختراق الحقيقي والاختراق الكاذب؟",
        questionEn: "What is the main difference between a true breakout and a false breakout?",
        options: [
          { text: "الاختراق الحقيقي يحدث على إطارات زمنية أكبر فقط", isCorrect: false },
          { text: "الاختراق الحقيقي يتميز بحجم تداول كبير وإغلاق شمعة قوية، بينما الكاذب بحجم منخفض وعودة سريعة للسعر", isCorrect: true },
          { text: "الاختراق الكاذب يؤدي دائماً إلى خسائر", isCorrect: false },
          { text: "لا يوجد فرق، كلاهما نفس الشيء", isCorrect: false }
        ],
        explanation: "التمييز بينهما يعتمد على عوامل التأكيد مثل حجم التداول وإغلاق الشمعة وسلوك السعر بعد الاختراق."
      },
      {
        id: 2,
        question: "ما هي \"مصيدة الثيران (Bull Trap)\"؟",
        questionEn: "What is a \"Bull Trap\"?",
        options: [
          { text: "اختراق حقيقي لمستوى مقاومة يتبعه ارتفاع قوي", isCorrect: false },
          { text: "اختراق كاذب لمستوى مقاومة يعود السعر بعده للهبوط", isCorrect: true },
          { text: "اختراق حقيقي لمستوى دعم يتبعه هبوط قوي", isCorrect: false },
          { text: "اختراق كاذب لمستوى دعم يعود السعر بعده للارتفاع", isCorrect: false }
        ],
        explanation: "مصيدة الثيران هي سيناريو يحدث عندما يخترق السعر مقاومة بشكل كاذب، مما يجذب المشترين، ثم ينعكس السعر هبوطاً."
      },
      {
        id: 3,
        question: "أي من هذه الأدوات لا يستخدم عادة لتأكيد الانعكاس في استراتيجية تداول الارتداد؟",
        questionEn: "Which of these tools is NOT typically used to confirm a reversal in a reversal trading strategy?",
        options: [
          { text: "نماذج الشموع الانعكاسية", isCorrect: false },
          { text: "التباعد (Divergence) بين السعر والمؤشرات", isCorrect: false },
          { text: "حجم التداول", isCorrect: false },
          { text: "مؤشرات الاتجاه (مثل المتوسطات المتحركة البسيطة)", isCorrect: true }
        ],
        explanation: "مؤشرات الاتجاه مثل المتوسطات المتحركة البسيطة تستخدم لتحديد الاتجاه السائد، وليس لتأكيد الانعكاسات."
      },
      {
        id: 4,
        question: "ما هو الغرض من استخدام \"مناطق العرض والطلب (Supply and Demand Zones)\" في تداول الارتداد؟",
        questionEn: "What is the purpose of using \"Supply and Demand Zones\" in reversal trading?",
        options: [
          { text: "لتحديد اتجاه السوق العام", isCorrect: false },
          { text: "لتحديد مناطق تاريخية حيث كان هناك ضغط بيع/شراء قوي أدى إلى انعكاس السعر", isCorrect: true },
          { text: "لتحديد حجم التداول", isCorrect: false },
          { text: "لتحديد مستويات وقف الخسارة فقط", isCorrect: false }
        ],
        explanation: "مناطق العرض والطلب هي مناطق رئيسية يتوقع أن ينعكس منها السعر بسبب اختلال التوازن بين المشترين والبائعين."
      },
      {
        id: 5,
        question: "ماذا يعني \"تغير في هيكل السوق (Market Structure Shift)\" كعلامة على الانعكاس؟",
        questionEn: "What does \"Market Structure Shift\" mean as a sign of reversal?",
        options: [
          { text: "استمرار الاتجاه الحالي", isCorrect: false },
          { text: "كسر قيعان أعلى في الاتجاه الصعودي أو قمم أدنى في الاتجاه الهبوطي", isCorrect: true },
          { text: "تشكل نموذج شمعة دوجي", isCorrect: false },
          { text: "زيادة في حجم التداول", isCorrect: false }
        ],
        explanation: "تغير هيكل السوق هو إشارة قوية على أن الاتجاه السائد قد بدأ في التغير."
      },
      {
        id: 6,
        question: "لماذا يجب على المتداولين المتقدمين أن يكونوا \"متكيفين ومرنين\"؟",
        questionEn: "Why should advanced traders be \"adaptable and flexible\"?",
        options: [
          { text: "لأنهم لا يمتلكون خطة تداول ثابتة", isCorrect: false },
          { text: "لأن السوق يتغير باستمرار ويجب تكييف الاستراتيجيات مع الظروف المتغيرة", isCorrect: true },
          { text: "لأنهم يحبون تجربة استراتيجيات جديدة كل يوم", isCorrect: false },
          { text: "لأن ذلك يقلل من الحاجة إلى التحليل", isCorrect: false }
        ],
        explanation: "المرونة والتكيف مع ظروف السوق المتغيرة هو مفتاح البقاء والربحية على المدى الطويل."
      },
      {
        id: 7,
        question: "ما هي الفائدة الرئيسية من استخدام \"إعادة الاختبار (Retest)\" كفرصة دخول ثانية في تداول الاختراق؟",
        questionEn: "What is the main benefit of using a \"Retest\" as a second entry opportunity in breakout trading?",
        options: [
          { text: "للدخول بحجم أكبر من المخاطرة", isCorrect: false },
          { text: "لتوفير نقطة دخول أفضل ومخاطرة أقل", isCorrect: true },
          { text: "لأنها تضمن الربح في الصفقة", isCorrect: false },
          { text: "لأنها تلغي الحاجة إلى وقف الخسارة", isCorrect: false }
        ],
        explanation: "إعادة الاختبار توفر تأكيداً إضافياً للاختراق وتسمح بوضع وقف خسارة أكثر إحكاماً."
      },
      {
        id: 8,
        question: "أي من هذه الاستراتيجيات المتقدمة تركز على الدخول في صفقات مع الأصول التي تتحرك بقوة في اتجاه معين؟",
        questionEn: "Which of these advanced strategies focuses on entering trades with assets that are moving strongly in a certain direction?",
        options: [
          { text: "تداول الارتداد", isCorrect: false },
          { text: "تداول المدى", isCorrect: false },
          { text: "تداول الزخم", isCorrect: true },
          { text: "تداول الارتباط", isCorrect: false }
        ],
        explanation: "تداول الزخم يهدف إلى الاستفادة من استمرارية الحركة القوية في اتجاه واحد."
      },
      {
        id: 9,
        question: "ما هو المفهوم الذي يصف استغلال العلاقة بين أصلين أو أكثر للتحوط أو لتأكيد إشارات التداول؟",
        questionEn: "What concept describes exploiting the relationship between two or more assets for hedging or confirming trading signals?",
        options: [
          { text: "تداول الاختراق", isCorrect: false },
          { text: "تداول الارتداد", isCorrect: false },
          { text: "تداول الارتباط", isCorrect: true },
          { text: "تداول الفجوات السعرية", isCorrect: false }
        ],
        explanation: "تداول الارتباط يستخدم العلاقات الإحصائية بين الأصول لاتخاذ قرارات تداول أكثر ذكاءً."
      },
      {
        id: 10,
        question: "لماذا لا يجب على المتداولين المبتدئين محاولة تطبيق الاستراتيجيات المتقدمة مباشرة؟",
        questionEn: "Why should beginner traders not attempt to apply advanced strategies directly?",
        options: [
          { text: "لأنها تتطلب رأس مال كبير جداً", isCorrect: false },
          { text: "لأنها تتطلب فهماً عميقاً للأساسيات وإدارة المخاطر التي قد لا يمتلكونها بعد", isCorrect: true },
          { text: "لأنها غير مربحة للمبتدئين", isCorrect: false },
          { text: "لأنها معقدة جداً ولا يمكن تعلمها", isCorrect: false }
        ],
        explanation: "الاستراتيجيات المتقدمة مبنية على أساس متين من المعرفة والخبرة، ومحاولة تطبيقها بدون هذا الأساس قد يؤدي إلى خسائر كبيرة."
      },
      {
        id: 11,
        question: "ما هي \"مصيدة الدببة (Bear Trap)\"؟",
        questionEn: "What is a \"Bear Trap\"?",
        options: [
          { text: "اختراق حقيقي لمستوى دعم يتبعه هبوط قوي", isCorrect: false },
          { text: "اختراق كاذب لمستوى دعم يعود السعر بعده للارتفاع", isCorrect: true },
          { text: "اختراق حقيقي لمستوى مقاومة يتبعه ارتفاع قوي", isCorrect: false },
          { text: "اختراق كاذب لمستوى مقاومة يعود السعر بعده للهبوط", isCorrect: false }
        ],
        explanation: "مصيدة الدببة هي سيناريو يحدث عندما يخترق السعر دعماً بشكل كاذب، مما يجذب البائعين، ثم ينعكس السعر صعوداً."
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
