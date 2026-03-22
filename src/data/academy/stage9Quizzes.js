export const stage9Quizzes = [
  {
    id: 1,
    stageId: 9,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: أساسيات سيكولوجية التداول",
    titleEn: "Mini-Quiz: Fundamentals of Trading Psychology",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هو العامل الأكثر أهمية في نجاح التداول والذي غالباً ما يكون السبب الرئيسي وراء فشل المتداولين المهرة؟",
        questionEn: "What is the most crucial factor in trading success, often being the primary reason for the failure of skilled traders?",
        options: [
          { text: "التحليل الفني", isCorrect: false },
          { text: "التحليل الأساسي", isCorrect: false },
          { text: "سيكولوجية التداول", isCorrect: true },
          { text: "إدارة رأس المال", isCorrect: false }
        ],
        explanation: "سيكولوجية التداول هي الأساس الذي تبنى عليه جميع الاستراتيجيات، وبدونها يمكن أن تفشل حتى أفضل الاستراتيجيات."
      },
      {
        id: 2,
        question: "أي من العواطف التالية غالباً ما تؤدي إلى عدم جني الأرباح في الوقت المناسب أو الدخول في صفقات محفوفة بالمخاطر؟",
        questionEn: "Which of the following emotions often leads to not taking profits at the right time or entering risky trades?",
        options: [
          { text: "الخوف", isCorrect: false },
          { text: "الطمع", isCorrect: true },
          { text: "الأمل", isCorrect: false },
          { text: "الغضب", isCorrect: false }
        ],
        explanation: "الطمع يدفع المتداولين إلى الرغبة في تحقيق أرباح أكبر، مما يؤدي إلى التمسك بالصفقات الرابحة لفترة طويلة جداً أو زيادة حجم المخاطرة."
      },
      {
        id: 3,
        question: "ما هو التحيز المعرفي الذي يتمثل في البحث عن المعلومات التي تؤكد معتقداتنا وتجاهل ما يتعارض معها؟",
        questionEn: "Which cognitive bias involves seeking information that confirms our beliefs and ignoring contradictory information?",
        options: [
          { text: "تحيز التوفر", isCorrect: false },
          { text: "تحيز التثبيت", isCorrect: false },
          { text: "تحيز التأكيد", isCorrect: true },
          { text: "تحيز التكلفة الغارقة", isCorrect: false }
        ],
        explanation: "تحيز التأكيد هو ميل الأفراد للبحث عن المعلومات وتفسيرها وتذكرها بطريقة تؤكد معتقداتهم أو فرضياتهم المسبقة."
      },
      {
        id: 4,
        question: "ماذا يعني \"تقبل الخسارة\" كجزء من بناء عقلية المتداول الاحترافي؟",
        questionEn: "What does \"acceptance of loss\" mean as part of building a professional trader's mindset?",
        options: [
          { text: "عدم استخدام وقف الخسارة", isCorrect: false },
          { text: "الاستمرار في صفقة خاسرة على أمل أن تعود", isCorrect: false },
          { text: "فهم أن الخسائر جزء لا يتجزأ من التداول والتركيز على إدارتها", isCorrect: true },
          { text: "لوم السوق أو الحظ عند حدوث الخسائر", isCorrect: false }
        ],
        explanation: "تقبل الخسارة يعني فهم أنها جزء طبيعي من عملية التداول، والتركيز على إدارة المخاطر لتقليل تأثيرها بدلاً من محاولة تجنبها تماماً."
      },
      {
        id: 5,
        question: "عند مواجهة سلسلة من الخسائر، ما هي الخطوة الأولى التي يُنصح بها للمتداول؟",
        questionEn: "When facing a losing streak, what is the first recommended step for a trader?",
        options: [
          { text: "زيادة حجم المخاطرة لتعويض الخسائر بسرعة", isCorrect: false },
          { text: "أخذ قسط من الراحة والابتعاد عن التداول", isCorrect: true },
          { text: "تغيير استراتيجية التداول بالكامل فوراً", isCorrect: false },
          { text: "الاستمرار في التداول بنفس الحجم لعدم تفويت الفرص", isCorrect: false }
        ],
        explanation: "أخذ قسط من الراحة والابتعاد عن الشاشات يساعد على تصفية الذهن واستعادة المنظور، وهو أمر حيوي للتعامل مع سلسلة الخسائر بفعالية."
      },
      {
        id: 6,
        question: "ما هو المفهوم الذي يميز المتداولين المحترفين عن الهواة، ويركز على أن السوق سلسلة لا نهائية من الاحتمالات؟",
        questionEn: "What concept distinguishes professional traders from amateurs, focusing on the market as an endless series of probabilities?",
        options: [
          { text: "التفكير اليقيني", isCorrect: false },
          { text: "التفكير العاطفي", isCorrect: false },
          { text: "التفكير الاحتمالي", isCorrect: true },
          { text: "التفكير التنبؤي", isCorrect: false }
        ],
        explanation: "التفكير الاحتمالي هو فهم أن كل صفقة هي مجرد احتمال، وأن النجاح يأتي من تطبيق استراتيجية ذات أفضلية إحصائية على المدى الطويل."
      },
      {
        id: 7,
        question: "ماذا يعني \"الأفضلية الإحصائية (Statistical Edge)\" في التداول؟",
        questionEn: "What does \"Statistical Edge\" mean in trading?",
        options: [
          { text: "القدرة على التنبؤ بحركة السوق بنسبة 100%", isCorrect: false },
          { text: "امتلاك استراتيجية تمنحك احتمالاً أعلى للربح على المدى الطويل", isCorrect: true },
          { text: "الحصول على معلومات داخلية عن السوق", isCorrect: false },
          { text: "القدرة على التداول بدون خسائر على الإطلاق", isCorrect: false }
        ],
        explanation: "الأفضلية الإحصائية هي ميزة في استراتيجية التداول تمنح المتداول احتمالاً إيجابياً للربح على المدى الطويل، حتى لو تضمنت خسائر فردية."
      },
      {
        id: 8,
        question: "لماذا يُنصح بالاحتفاظ بمفكرة تداولية (Trading Journal)؟",
        questionEn: "Why is it recommended to keep a Trading Journal?",
        options: [
          { text: "لتسجيل الأرباح فقط", isCorrect: false },
          { text: "لمشاركة الصفقات مع متداولين آخرين", isCorrect: false },
          { text: "لتسجيل جميع التداولات، الأسباب، العواطف، والنتائج لمراجعتها وتحليلها", isCorrect: true },
          { text: "لإثبات أنك متداول ناجح", isCorrect: false }
        ],
        explanation: "المفكرة التداولية أداة حيوية للوعي الذاتي والتعلم، حيث تساعد المتداول على تحليل أدائه، تحديد الأنماط السلوكية، وتحسين قراراته."
      },
      {
        id: 9,
        question: "ما هو قانون الأعداد الكبيرة (Law of Large Numbers) في سياق التداول؟",
        questionEn: "What is the Law of Large Numbers in the context of trading?",
        options: [
          { text: "كلما زاد حجم الصفقة، زادت الأرباح", isCorrect: false },
          { text: "كلما زاد عدد الصفقات، اقتربت النتائج الفعلية من التوقعات الإحصائية للاستراتيجية", isCorrect: true },
          { text: "كلما زاد عدد المتداولين، زادت تقلبات السوق", isCorrect: false },
          { text: "كلما زادت الخبرة، قلت الحاجة إلى استراتيجية", isCorrect: false }
        ],
        explanation: "قانون الأعداد الكبيرة يشير إلى أن النتائج الإحصائية لاستراتيجية التداول تصبح أكثر وضوحاً ودقة كلما زاد عدد الصفقات المنفذة."
      },
      {
        id: 10,
        question: "أي من التالي ليس من خصائص بناء عقلية المتداول الاحترافي؟",
        questionEn: "Which of the following is NOT a characteristic of building a professional trader's mindset?",
        options: [
          { text: "الوعي الذاتي", isCorrect: false },
          { text: "الانضباط", isCorrect: false },
          { text: "الاعتماد على الحظ", isCorrect: true },
          { text: "الصبر", isCorrect: false }
        ],
        explanation: "الاعتماد على الحظ يتنافى تماماً مع عقلية المتداول الاحترافي الذي يركز على الأفضلية الإحصائية، الانضباط، وإدارة المخاطر."
      }
    ]
  }
];
