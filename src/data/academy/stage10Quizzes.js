export const stage10Quizzes = [
  {
    id: 1,
    stageId: 10,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: أساسيات خطة التداول",
    titleEn: "Mini-Quiz: Fundamentals of Trading Plan",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هو الغرض الأساسي من خطة التداول؟",
        questionEn: "What is the primary purpose of a trading plan?",
        options: [
          { text: "ضمان الربح في كل صفقة", isCorrect: false },
          { text: "تحديد الأهداف، المنهجية، إدارة المخاطر، ومعايير الدخول والخروج للصفقات", isCorrect: true },
          { text: "التنبؤ بحركة السوق بدقة 100%", isCorrect: false },
          { text: "جعل التداول عشوائياً ومثيراً", isCorrect: false }
        ],
        explanation: "خطة التداول هي وثيقة شاملة تحدد جميع جوانب التداول لضمان الانضباط والموضوعية."
      },
      {
        id: 2,
        question: "أي من التالي ليس من أهمية خطة التداول؟",
        questionEn: "Which of the following is NOT an importance of a trading plan?",
        options: [
          { text: "فرض الانضباط والموضوعية", isCorrect: false },
          { text: "إدارة المخاطر بفعالية", isCorrect: false },
          { text: "ضمان عدم وجود أي خسائر", isCorrect: true },
          { text: "تحديد الأهداف وتقييم الأداء", isCorrect: false }
        ],
        explanation: "لا يمكن لأي خطة تداول أن تضمن عدم وجود خسائر، فالخسائر جزء طبيعي من التداول. الهدف هو إدارتها وتقليلها."
      },
      {
        id: 3,
        question: "ماذا تعني الأهداف التداولية SMART؟",
        questionEn: "What do SMART trading objectives mean?",
        options: [
          { text: "ذكية، مالية، قابلة للتحقيق، واقعية، زمنية", isCorrect: false },
          { text: "محددة، قابلة للقياس، قابلة للتحقيق، ذات صلة، ومحددة زمنياً", isCorrect: true },
          { text: "بسيطة، محفزة، قابلة للتطبيق، سريعة، تكتيكية", isCorrect: false },
          { text: "استراتيجية، مالية، تحليلية، ربحية، تكتيكية", isCorrect: false }
        ],
        explanation: "SMART هي اختصار لـ Specific, Measurable, Achievable, Relevant, Time-bound."
      },
      {
        id: 4,
        question: "ما هي النسبة المئوية القصوى الموصى بها للمخاطرة بها في صفقة واحدة كجزء من إدارة المخاطر؟",
        questionEn: "What is the recommended maximum percentage to risk per trade as part of risk management?",
        options: [
          { text: "5%", isCorrect: false },
          { text: "10%", isCorrect: false },
          { text: "1% أو 0.5%", isCorrect: true },
          { text: "20%", isCorrect: false }
        ],
        explanation: "للحفاظ على رأس المال على المدى الطويل، يوصى بشدة بعدم المخاطرة بأكثر من 1% أو حتى 0.5% من رأس المال في صفقة واحدة."
      },
      {
        id: 5,
        question: "لماذا يعتبر التداول بدون خطة غالباً كارثياً؟",
        questionEn: "Why is trading without a plan often catastrophic?",
        options: [
          { text: "لأنه يحد من فرص الربح", isCorrect: false },
          { text: "لأنه يؤدي إلى قرارات عشوائية وعاطفية وإدارة مخاطر سيئة", isCorrect: true },
          { text: "لأنه يتطلب الكثير من الوقت والجهد", isCorrect: false },
          { text: "لأنه يجعلك تتبع الآخرين", isCorrect: false }
        ],
        explanation: "التداول بدون خطة يجعل المتداول عرضة للقرارات العاطفية، مما يؤدي إلى نتائج غير متوقعة وخسائر كبيرة."
      },
      {
        id: 6,
        question: "ما هو الدور الذي تلعبه مفكرة التداول (Trading Journal) في خطة التداول؟",
        questionEn: "What role does a Trading Journal play in a trading plan?",
        options: [
          { text: "لتسجيل الأرباح فقط", isCorrect: false },
          { text: "أداة للتعلم المستمر، تقييم الأداء، وتحديد الأخطاء", isCorrect: true },
          { text: "لمشاركة الصفقات مع الأصدقاء", isCorrect: false },
          { text: "لإثبات النجاح للآخرين", isCorrect: false }
        ],
        explanation: "المفكرة التداولية هي أداة حيوية للتحليل الذاتي والتحسين المستمر لأداء المتداول."
      },
      {
        id: 7,
        question: "أي من هذه المكونات يعتبر العمود الفقري لخطة التداول؟",
        questionEn: "Which of these components is considered the backbone of a trading plan?",
        options: [
          { text: "أسلوب التداول", isCorrect: false },
          { text: "سيكولوجية التداول", isCorrect: false },
          { text: "إدارة المخاطر ورأس المال", isCorrect: true },
          { text: "الأهداف التداولية", isCorrect: false }
        ],
        explanation: "إدارة المخاطر ورأس المال هي الأهم لأنها تحمي رأس المال وتضمن بقاء المتداول في السوق على المدى الطويل."
      },
      {
        id: 8,
        question: "ما هو التحيز السلوكي الذي يدفع المتداولين إلى التمسك بالصفقات الخاسرة على أمل أن تعود؟",
        questionEn: "What behavioral bias drives traders to hold onto losing trades hoping they will turn around?",
        options: [
          { text: "تأثير الهالة", isCorrect: false },
          { text: "تحيز التكلفة الغارقة", isCorrect: true },
          { text: "تحيز التأكيد", isCorrect: false },
          { text: "تأثير الإرساء", isCorrect: false }
        ],
        explanation: "تحيز التكلفة الغارقة هو الميل للاستمرار في استثمار الموارد (الوقت، المال، الجهد) في مشروع أو قرار سابق، حتى عندما لا يكون ذلك منطقياً، بسبب التكاليف التي تم استثمارها بالفعل."
      },
      {
        id: 9,
        question: "ماذا يجب أن تفعل عند مواجهة سلسلة من الخسائر؟",
        questionEn: "What should you do when facing a losing streak?",
        options: [
          { text: "زيادة حجم المخاطرة لتعويض الخسائر بسرعة", isCorrect: false },
          { text: "أخذ قسط من الراحة ومراجعة الخطة والأداء", isCorrect: true },
          { text: "تغيير الاستراتيجية بالكامل فوراً", isCorrect: false },
          { text: "لوم السوق أو الحظ", isCorrect: false }
        ],
        explanation: "أخذ قسط من الراحة ومراجعة الأداء والخطة يساعد على استعادة الموضوعية وتجنب قرارات الانتقام."
      },
      {
        id: 10,
        question: "لماذا يُنصح بالتداول كـ \"روبوت\"؟",
        questionEn: "Why is it recommended to trade like a \"robot\"?",
        options: [
          { text: "لأن الروبوتات لا تخسر أبداً", isCorrect: false },
          { text: "لتقليل تأثير العواطف والالتزام الصارم بقواعد الخطة", isCorrect: true },
          { text: "لأنها طريقة أسرع للتداول", isCorrect: false },
          { text: "لأنها لا تتطلب تحليلاً", isCorrect: false }
        ],
        explanation: "التداول كـ \"روبوت\" يعني الالتزام الصارم بقواعد الخطة دون تدخل العواطف، مما يعزز الانضباط ويحسن الأداء على المدى الطويل."
      }
    ]
  },
  {
    id: 2,
    stageId: 10,
    lessonRange: "4-6",
    type: "mini-quiz",
    title: "اختبار قصير: تطبيق خطة التداول",
    titleEn: "Mini-Quiz: Implementing the Trading Plan",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هو أهم عامل في تطبيق خطة التداول بفعالية؟",
        questionEn: "What is the most important factor in effectively implementing a trading plan?",
        options: [
          { text: "المرونة وتغيير الخطة باستمرار", isCorrect: false },
          { text: "الالتزام المطلق بالقواعد وعدم كسرها أبداً", isCorrect: true },
          { text: "الاعتماد على نصائح الآخرين", isCorrect: false },
          { text: "التداول بأكبر حجم ممكن", isCorrect: false }
        ],
        explanation: "الالتزام المطلق بالقواعد هو حجر الزاوية في تطبيق الخطة بنجاح، حيث يمنع القرارات العاطفية والعشوائية."
      },
      {
        id: 2,
        question: "ما هو التحيز السلوكي الذي يشير إلى الخوف من تفويت الفرص؟",
        questionEn: "What behavioral bias refers to the fear of missing out on opportunities?",
        options: [
          { text: "FOMO (Fear Of Missing Out)", isCorrect: true },
          { text: "Revenge Trading", isCorrect: false },
          { text: "Overconfidence", isCorrect: false },
          { text: "Confirmation Bias", isCorrect: false }
        ],
        explanation: "FOMO هو اختصار لـ Fear Of Missing Out، وهو شعور يدفع المتداولين للدخول في صفقات غير مخطط لها خوفاً من تفويت الأرباح."
      },
      {
        id: 3,
        question: "ما هي أفضل طريقة للتعامل مع الرغبة في الانتقام من السوق بعد صفقة خاسرة؟",
        questionEn: "What is the best way to deal with the urge for revenge trading after a losing trade?",
        options: [
          { text: "زيادة حجم الصفقة التالية لتعويض الخسارة", isCorrect: false },
          { text: "أخذ قسط من الراحة والابتعاد عن الشاشات", isCorrect: true },
          { text: "الدخول في صفقة معاكسة فوراً", isCorrect: false },
          { text: "تجاهل الخسارة والاستمرار كالمعتاد", isCorrect: false }
        ],
        explanation: "أخذ قسط من الراحة يساعد على تصفية الذهن وتجنب القرارات المتهورة التي غالباً ما تؤدي إلى خسائر أكبر."
      },
      {
        id: 4,
        question: "لماذا يجب على المتداول مراجعة خطته وأدائه بانتظام؟",
        questionEn: "Why should a trader regularly review their plan and performance?",
        options: [
          { text: "للتأكد من أن السوق لا يزال يعمل", isCorrect: false },
          { text: "لأن الخطة ليست ثابتة ويجب تعديلها بناءً على التجربة وظروف السوق", isCorrect: true },
          { text: "لإظهارها للمتداولين الآخرين", isCorrect: false },
          { text: "لأن ذلك مطلوب من قبل الوسطاء", isCorrect: false }
        ],
        explanation: "خطة التداول هي وثيقة حية تتطور مع المتداول، والمراجعة الدورية تساعد على تحسينها وتكييفها مع التغيرات."
      },
      {
        id: 5,
        question: "ما هو أحد الأخطاء الشائعة التي يرتكبها المتداولون بعد تحقيق أرباح كبيرة؟",
        questionEn: "What is one common mistake traders make after achieving significant profits?",
        options: [
          { text: "الالتزام الصارم بالخطة", isCorrect: false },
          { text: "زيادة حجم المخاطرة بشكل غير مبرر بسبب الإفراط في الثقة", isCorrect: true },
          { text: "أخذ قسط من الراحة", isCorrect: false },
          { text: "مراجعة مفكرة التداول", isCorrect: false }
        ],
        explanation: "الإفراط في الثقة بعد الأرباح يمكن أن يدفع المتداولين لزيادة المخاطرة، مما يعرضهم لخسائر كبيرة."
      },
      {
        id: 6,
        question: "ما هو الغرض من الروتين اليومي للمتداول؟",
        questionEn: "What is the purpose of a trader's daily routine?",
        options: [
          { text: "لإضاعة الوقت قبل التداول", isCorrect: false },
          { text: "لترسيخ الانضباط، التحضير الذهني، ومراجعة السوق", isCorrect: true },
          { text: "لتقليد المتداولين الآخرين", isCorrect: false },
          { text: "للتداول بشكل عشوائي", isCorrect: false }
        ],
        explanation: "الروتين اليومي يساعد المتداول على البقاء منضبطاً، مستعداً ذهنياً، ومطلعاً على ظروف السوق."
      },
      {
        id: 7,
        question: "ماذا يجب أن تسجل في مفكرة التداول الخاصة بك بالإضافة إلى نقاط الدخول والخروج؟",
        questionEn: "What else should you record in your trading journal besides entry and exit points?",
        options: [
          { text: "الطقس وحالتك المزاجية", isCorrect: false },
          { text: "حالتك العاطفية، سبب الدخول، سبب الخروج، الأخطاء، والدروس المستفادة", isCorrect: true },
          { text: "أخبار المشاهير", isCorrect: false },
          { text: "ما قاله المحللون الآخرون", isCorrect: false }
        ],
        explanation: "تسجيل الجوانب النفسية والتحليلية للصفقة يساعد على فهم الأداء بشكل أعمق وتحديد مجالات التحسين."
      },
      {
        id: 8,
        question: "ما هو المبدأ الذي يجب أن يتبعه المتداول عند تحريك وقف الخسارة؟",
        questionEn: "What principle should a trader follow when moving a stop loss?",
        options: [
          { text: "تحريكه بعيداً عن نقطة الدخول لتقليل الخسارة", isCorrect: false },
          { text: "تحريكه إلى نقطة الدخول أو لتحقيق أرباح بمجرد أن تصبح الصفقة رابحة", isCorrect: true },
          { text: "عدم تحريكه أبداً", isCorrect: false },
          { text: "تحريكه بشكل عشوائي", isCorrect: false }
        ],
        explanation: "تحريك وقف الخسارة إلى نقطة الدخول أو إلى منطقة الربح يحمي رأس المال ويضمن عدم تحول الصفقة الرابحة إلى خاسرة."
      },
      {
        id: 9,
        question: "ماذا يعني \"الفشل في التخطيط هو التخطيط للفشل\" في سياق التداول؟",
        questionEn: "What does \"Failing to plan is planning to fail\" mean in the context of trading?",
        options: [
          { text: "أن التخطيط لا يضمن النجاح", isCorrect: false },
          { text: "أن عدم وجود خطة تداول مدروسة يؤدي حتماً إلى الفشل", isCorrect: true },
          { text: "أن التخطيط يأخذ وقتاً طويلاً", isCorrect: false },
          { text: "أن التخطيط معقد جداً", isCorrect: false }
        ],
        explanation: "هذا القول يؤكد على الأهمية القصوى للتخطيط المسبق في التداول لتجنب النتائج السلبية."
      },
      {
        id: 10,
        question: "ما هي الفائدة الرئيسية من مراجعة مفكرة التداول أسبوعياً/شهرياً؟",
        questionEn: "What is the main benefit of reviewing a trading journal weekly/monthly?",
        options: [
          { text: "لمعرفة مقدار الأموال التي كسبتها", isCorrect: false },
          { text: "للبحث عن الأنماط، تحديد الأخطاء المتكررة، وتحسين الخطة", isCorrect: true },
          { text: "لمقارنة أدائك بالمتداولين الآخرين", isCorrect: false },
          { text: "لإضاعة الوقت", isCorrect: false }
        ],
        explanation: "المراجعة الدورية تساعد على التعلم من الأخطاء، تعزيز نقاط القوة، وتكييف الخطة مع التطورات."
      }
    ]
  },
  {
    id: 3,
    stageId: 10,
    type: "stage-exam",
    title: "الاختبار النهائي للمرحلة 10: بناء خطة تداول شاملة",
    titleEn: "Stage 10 Final Exam: Building a Comprehensive Trading Plan",
    passingScore: 75,
    timeLimitMinutes: 30,
    questions: [
      {
        id: 1,
        question: "ما هو المكون الأساسي لخطة التداول الذي يحدد نسبة المخاطرة لكل صفقة؟",
        questionEn: "What is the essential component of a trading plan that defines the risk percentage per trade?",
        options: [
          { text: "الأهداف التداولية", isCorrect: false },
          { text: "أسلوب التداول", isCorrect: false },
          { text: "إدارة المخاطر ورأس المال", isCorrect: true },
          { text: "سيكولوجية التداول", isCorrect: false }
        ],
        explanation: "إدارة المخاطر ورأس المال هي المسؤولة عن تحديد حجم المخاطرة لكل صفقة لحماية رأس المال."
      },
      {
        id: 2,
        question: "لماذا يجب أن تكون الأهداف التداولية \"محددة زمنياً\"؟",
        questionEn: "Why should trading objectives be \"time-bound\"?",
        options: [
          { text: "لأن السوق يتغير باستمرار", isCorrect: false },
          { text: "لتوفير إطار زمني لتحقيق الهدف وتقييم التقدم", isCorrect: true },
          { text: "لأن المتداولين يحبون المواعيد النهائية", isCorrect: false },
          { text: "لجعل الأهداف أكثر صعوبة", isCorrect: false }
        ],
        explanation: "تحديد الإطار الزمني يساعد على التركيز، قياس التقدم، وتعديل الأهداف إذا لزم الأمر."
      },
      {
        id: 3,
        question: "أي من أساليب التداول التالية يتضمن إغلاق جميع الصفقات قبل نهاية اليوم؟",
        questionEn: "Which of the following trading styles involves closing all trades before the end of the day?",
        options: [
          { text: "المضاربة (Scalping)", isCorrect: false },
          { text: "التداول اليومي (Day Trading)", isCorrect: true },
          { text: "التداول المتأرجح (Swing Trading)", isCorrect: false },
          { text: "التداول الموضعي (Position Trading)", isCorrect: false }
        ],
        explanation: "التداول اليومي يركز على فتح وإغلاق الصفقات ضمن نفس اليوم لتجنب مخاطر الفجوات السعرية الليلية."
      },
      {
        id: 4,
        question: "ما هو الغرض من تحديد \"شروط الدخول\" في خطة التداول؟",
        questionEn: "What is the purpose of defining \"entry criteria\" in a trading plan?",
        options: [
          { text: "لجعل الدخول عشوائياً", isCorrect: false },
          { text: "لتحديد متى وكيف يتم الدخول في الصفقة بناءً على تحليل محدد", isCorrect: true },
          { text: "للتداول بناءً على المشاعر", isCorrect: false },
          { text: "لإضاعة الوقت قبل الدخول", isCorrect: false }
        ],
        explanation: "شروط الدخول الواضحة تضمن أن المتداول يدخل الصفقات بناءً على قواعد موضوعية ومحددة مسبقاً."
      },
      {
        id: 5,
        question: "ماذا يعني \"تحريك وقف الخسارة (Trailing Stop Loss)\"؟",
        questionEn: "What does \"Trailing Stop Loss\" mean?",
        options: [
          { text: "إلغاء وقف الخسارة تماماً", isCorrect: false },
          { text: "تحريك وقف الخسارة يدوياً لتقليل الخسارة المحتملة", isCorrect: false },
          { text: "تحريك وقف الخسارة إلى نقطة الدخول أو لتحقيق أرباح بمجرد أن تصبح الصفقة رابحة", isCorrect: true },
          { text: "زيادة حجم وقف الخسارة مع زيادة الربح", isCorrect: false }
        ],
        explanation: "تحريك وقف الخسارة هو استراتيجية لإدارة الصفقة تهدف إلى حماية الأرباح أو تقليل المخاطر بمجرد أن تتحرك الصفقة في الاتجاه المرغوب."
      },
      {
        id: 6,
        question: "أي من هذه العواقب ليست نتيجة للتداول بدون خطة؟",
        questionEn: "Which of these consequences is NOT a result of trading without a plan?",
        options: [
          { text: "قرارات عشوائية وعاطفية", isCorrect: false },
          { text: "إدارة مخاطر سيئة", isCorrect: false },
          { text: "التعلم والتطور المستمر", isCorrect: true },
          { text: "خسائر متكررة وكبيرة", isCorrect: false }
        ],
        explanation: "التداول بدون خطة يعيق التعلم والتطور، بينما الخطة الجيدة هي التي تمكن المتداول من التعلم من أخطائه وتحسين أدائه."
      },
      {
        id: 7,
        question: "ما هو الغرض من تحديد \"الحد الأقصى للخسارة اليومية/الأسبوعية/الشهرية\" في خطة التداول؟",
        questionEn: "What is the purpose of defining a \"maximum daily/weekly/monthly loss\" in a trading plan?",
        options: [
          { text: "لإجبار المتداول على التوقف عن التداول بعد تحقيق أرباح كبيرة", isCorrect: false },
          { text: "لحماية رأس المال ومنع الخسائر الكبيرة التي قد تؤدي إلى تدمير الحساب", isCorrect: true },
          { text: "لتحديد عدد الصفقات التي يمكن فتحها", isCorrect: false },
          { text: "لجعل التداول أكثر إثارة", isCorrect: false }
        ],
        explanation: "الحد الأقصى للخسارة هو آلية حماية أساسية تمنع المتداول من الاستمرار في التداول عندما يكون أداؤه سيئاً، مما يحمي رأس المال من الاستنزاف."
      },
      {
        id: 8,
        question: "ما هو التحيز السلوكي الذي يدفع المتداولين إلى البحث عن المعلومات التي تؤكد وجهة نظرهم فقط؟",
        questionEn: "What behavioral bias drives traders to seek information that only confirms their viewpoint?",
        options: [
          { text: "تحيز التوفر", isCorrect: false },
          { text: "تحيز التأكيد", isCorrect: true },
          { text: "تحيز التثبيت", isCorrect: false },
          { text: "تأثير الهالة", isCorrect: false }
        ],
        explanation: "تحيز التأكيد هو ميل الأفراد لتفضيل المعلومات التي تؤكد معتقداتهم أو فرضياتهم الموجودة مسبقاً."
      },
      {
        id: 9,
        question: "لماذا يعتبر الالتزام المطلق بالخطة أمراً حاسماً؟",
        questionEn: "Why is absolute adherence to the plan crucial?",
        options: [
          { text: "لأن كسر القواعد مرة واحدة يفتح الباب لكسرها مرات عديدة ويؤدي إلى تداول عشوائي", isCorrect: true },
          { text: "لأن الخطة لا يمكن تغييرها أبداً", isCorrect: false },
          { text: "لأن ذلك يضمن الربح في كل صفقة", isCorrect: false },
          { text: "لأن الوسطاء يفضلون ذلك", isCorrect: false }
        ],
        explanation: "الالتزام المطلق يحافظ على الانضباط ويمنع الانجراف نحو التداول العشوائي الذي تسببه العواطف."
      },
      {
        id: 10,
        question: "ما هو الغرض من \"التحضير الذهني\" كجزء من الروتين اليومي قبل التداول؟",
        questionEn: "What is the purpose of \"mental preparation\" as part of the daily routine before trading?",
        options: [
          { text: "لإضاعة الوقت", isCorrect: false },
          { text: "للتأكد من أنك في حالة ذهنية هادئة ومركزة قبل اتخاذ القرارات", isCorrect: true },
          { text: "للتنبؤ بحركة السوق", isCorrect: false },
          { text: "للتفكير في الصفقات الماضية", isCorrect: false }
        ],
        explanation: "التحضير الذهني يساعد المتداول على الدخول في حالة من الهدوء والتركيز، مما يقلل من تأثير العواطف على قرارات التداول."
      },
      {
        id: 11,
        question: "أي من التالي هو مثال على هدف تداولي غير مالي؟",
        questionEn: "Which of the following is an example of a non-financial trading objective?",
        options: [
          { text: "تحقيق 10% أرباح شهرية", isCorrect: false },
          { text: "زيادة رأس المال بنسبة 20% سنوياً", isCorrect: false },
          { text: "تحسين الانضباط وتقليل الأخطاء العاطفية", isCorrect: true },
          { text: "جني 5000 دولار شهرياً", isCorrect: false }
        ],
        explanation: "الأهداف غير المالية تركز على تطوير المهارات الشخصية والسلوكية للمتداول."
      },
      {
        id: 12,
        question: "ما هو الفرق الرئيسي بين \"الاستراتيجية\" و\"خطة التداول\"؟",
        questionEn: "What is the main difference between a \"strategy\" and a \"trading plan\"?",
        options: [
          { text: "لا يوجد فرق، كلاهما نفس الشيء", isCorrect: false },
          { text: "الاستراتيجية تحدد متى تشتري وتبيع، بينما الخطة أشمل وتحدد كل جوانب التداول", isCorrect: true },
          { text: "الاستراتيجية للمبتدئين والخطة للمحترفين", isCorrect: false },
          { text: "الاستراتيجية تركز على التحليل الفني فقط، والخطة على الأساسي", isCorrect: false }
        ],
        explanation: "الاستراتيجية هي جزء من الخطة الشاملة التي تغطي جميع جوانب التداول بما في ذلك إدارة المخاطر، سيكولوجية التداول، والأهداف."
      },
      {
        id: 13,
        question: "ما هو الإطار الزمني الذي يتضمن إبقاء الصفقات مفتوحة لأيام أو أسابيع؟",
        questionEn: "What timeframe involves keeping trades open for days or weeks?",
        options: [
          { text: "المضاربة (Scalping)", isCorrect: false },
          { text: "التداول اليومي (Day Trading)", isCorrect: false },
          { text: "التداول المتأرجح (Swing Trading)", isCorrect: true },
          { text: "التداول الموضعي (Position Trading)", isCorrect: false }
        ],
        explanation: "التداول المتأرجح يستهدف تحركات الأسعار المتوسطة الأجل، مما يعني الاحتفاظ بالصفقات لعدة أيام أو أسابيع."
      },
      {
        id: 14,
        question: "لماذا يجب تسجيل العواطف في مفكرة التداول؟",
        questionEn: "Why should emotions be recorded in a trading journal?",
        options: [
          { text: "لأنها لا تؤثر على قرارات التداول", isCorrect: false },
          { text: "لفهم كيف تؤثر العواطف على قراراتك وتحديد الأنماط السلوكية", isCorrect: true },
          { text: "لأنها تجعل المفكرة أكثر إثارة", isCorrect: false },
          { text: "لأنها مطلوبة من قبل الوسطاء", isCorrect: false }
        ],
        explanation: "تسجيل العواطف يساعد المتداول على الوعي الذاتي وفهم العلاقة بين حالته النفسية وقراراته التداولية."
      },
      {
        id: 15,
        question: "ما هو الغرض من \"الحد الأقصى للخسارة اليومية\"؟",
        questionEn: "What is the purpose of a \"maximum daily loss\"?",
        options: [
          { text: "لإجبار المتداول على التوقف عن التداول بعد تحقيق أرباح كبيرة", isCorrect: false },
          { text: "لحماية رأس المال من الخسائر المفرطة في يوم واحد", isCorrect: true },
          { text: "لتحديد عدد الصفقات التي يمكن فتحها في اليوم", isCorrect: false },
          { text: "لجعل التداول أكثر إثارة", isCorrect: false }
        ],
        explanation: "الحد الأقصى للخسارة اليومية هو إجراء وقائي يمنع المتداول من تدمير حسابه في يوم واحد بسبب سلسلة من الخسائر أو قرارات متهورة."
      },
      {
        id: 16,
        question: "أي من التالي ليس من مكونات إدارة المخاطر ورأس المال؟",
        questionEn: "Which of the following is NOT a component of risk and money management?",
        options: [
          { text: "حجم المخاطرة لكل صفقة", isCorrect: false },
          { text: "وقف الخسارة", isCorrect: false },
          { text: "جني الأرباح", isCorrect: false },
          { text: "التحليل الأساسي", isCorrect: true }
        ],
        explanation: "التحليل الأساسي هو جزء من منهجية الدخول، وليس من إدارة المخاطر ورأس المال."
      },
      {
        id: 17,
        question: "ما هي أهمية مراجعة الأخبار الاقتصادية قبل التداول؟",
        questionEn: "What is the importance of reviewing economic news before trading?",
        options: [
          { text: "للتنبؤ بحركة السوق بدقة 100%", isCorrect: false },
          { text: "لتجنب التداول خلال الأحداث عالية التأثير التي قد تسبب تقلبات كبيرة", isCorrect: true },
          { text: "لإيجاد صفقات مضمونة الربح", isCorrect: false },
          { text: "لإضاعة الوقت", isCorrect: false }
        ],
        explanation: "مراجعة الأخبار الاقتصادية تساعد المتداول على تجنب التداول في أوقات التقلبات العالية غير المتوقعة، أو لتعديل استراتيجيته بما يتناسب مع الأحداث القادمة."
      },
      {
        id: 18,
        question: "ما هو التحيز السلوكي الذي يدفع المتداولين إلى الإفراط في الثقة بعد تحقيق سلسلة من الأرباح؟",
        questionEn: "What behavioral bias drives traders to overconfidence after a series of profits?",
        options: [
          { text: "تحيز التوفر", isCorrect: false },
          { text: "تحيز التأكيد", isCorrect: false },
          { text: "الإفراط في الثقة (Overconfidence)", isCorrect: true },
          { text: "تحيز التكلفة الغارقة", isCorrect: false }
        ],
        explanation: "الإفراط في الثقة يمكن أن يؤدي إلى زيادة حجم المخاطرة أو التداول خارج الخطة، مما يعرض المتداول لخسائر كبيرة."
      },
      {
        id: 19,
        question: "ماذا يجب أن تفعل إذا شككت في خطة التداول الخاصة بك؟",
        questionEn: "What should you do if you doubt your trading plan?",
        options: [
          { text: "تغييرها بالكامل فوراً", isCorrect: false },
          { text: "التوقف عن التداول", isCorrect: false },
          { text: "مراجعة مفكرة التداول للتأكد مما إذا كانت مربحة على المدى الطويل، والثقة بها إذا كانت كذلك", isCorrect: true },
          { text: "طلب نصيحة من كل متداول تعرفه", isCorrect: false }
        ],
        explanation: "إذا كانت الخطة مبنية على أساس سليم وتم اختبارها، فإن الشك غالباً ما يكون عاطفياً. مراجعة البيانات الموضوعية في المفكرة تعيد الثقة."
      },
      {
        id: 20,
        question: "ما هو الهدف النهائي من بناء خطة تداول شاملة والالتزام بها؟",
        questionEn: "What is the ultimate goal of building and adhering to a comprehensive trading plan?",
        options: [
          { text: "تحقيق الثراء السريع", isCorrect: false },
          { text: "تحويل التداول من نشاط عشوائي إلى عمل منظم ومنضبط لتحقيق النجاح المستمر", isCorrect: true },
          { text: "إثبات أنك أفضل من المتداولين الآخرين", isCorrect: false },
          { text: "التداول بدون أي مجهود", isCorrect: false }
        ],
        explanation: "الهدف هو بناء مسيرة تداولية مستدامة وناجحة من خلال الانضباط، إدارة المخاطر، والتعلم المستمر."
      }
    ]
  }
];
