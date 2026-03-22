export const stage15Quizzes = [
  {
    id: 1,
    stageId: 15,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: الذكاء الاصطناعي في التداول",
    titleEn: "Mini-Quiz: AI in Trading",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هو الغرض الرئيسي من استخدام الذكاء الاصطناعي في التداول؟",
        questionEn: "What is the main purpose of using AI in trading?",
        options: [
          { text: "لجعل التداول أكثر عشوائية", isCorrect: false },
          { text: "لمعالجة كميات هائلة من البيانات، تحديد الأنماط المعقدة، واتخاذ القرارات بسرعة فائقة", isCorrect: true },
          { text: "لزيادة التدخل البشري في التداول", isCorrect: false },
          { text: "لتقليل الحاجة إلى التحليل الفني", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي يتفوق في معالجة البيانات الضخمة وتحديد الأنماط التي قد تفوت على البشر."
      },
      {
        id: 2,
        question: "ما هو نوع التعلم الآلي الذي يتم فيه تدريب النماذج على بيانات تاريخية تحتوي على مدخلات ومخرجات معروفة؟",
        questionEn: "What type of machine learning involves training models on historical data with known inputs and outputs?",
        options: [
          { text: "التعلم غير الخاضع للإشراف (Unsupervised Learning)", isCorrect: false },
          { text: "التعلم المعزز (Reinforcement Learning)", isCorrect: false },
          { text: "التعلم الخاضع للإشراف (Supervised Learning)", isCorrect: true },
          { text: "التعلم العميق (Deep Learning)", isCorrect: false }
        ],
        explanation: "التعلم الخاضع للإشراف يستخدم بيانات مصنفة لتدريب النموذج على التنبؤ بالمخرجات."
      },
      {
        id: 3,
        question: "ما هي الشبكات العصبية الاصطناعية (ANN)؟",
        questionEn: "What are Artificial Neural Networks (ANN)?",
        options: [
          { text: "برامج حاسوبية بسيطة لتنفيذ الأوامر", isCorrect: false },
          { text: "نماذج مستوحاة من الدماغ البشري، قادرة على التعرف على الأنماط المعقدة في بيانات السوق غير الخطية", isCorrect: true },
          { text: "أدوات لتحليل المشاعر فقط", isCorrect: false },
          { text: "أنظمة لإدارة المخاطر فقط", isCorrect: false }
        ],
        explanation: "ANNs هي نماذج قوية للتعرف على الأنماط والتنبؤ في البيانات المعقدة مثل بيانات السوق."
      },
      {
        id: 4,
        question: "ما هو التداول الخوارزمي (Algorithmic Trading)؟",
        questionEn: "What is Algorithmic Trading?",
        options: [
          { text: "التداول اليدوي بناءً على التحليل الفني", isCorrect: false },
          { text: "استخدام برامج حاسوبية لتنفيذ أوامر التداول بسرعة ودقة بناءً على قواعد محددة مسبقاً", isCorrect: true },
          { text: "التداول بناءً على الشائعات والأخبار فقط", isCorrect: false },
          { text: "التداول الذي يتطلب تدخل بشري مستمر", isCorrect: false }
        ],
        explanation: "التداول الخوارزمي يعتمد على الأتمتة لتنفيذ الصفقات بناءً على خوارزميات محددة."
      },
      {
        id: 5,
        question: "ما هو الغرض من تحليل المشاعر (Sentiment Analysis) في التداول؟",
        questionEn: "What is the purpose of Sentiment Analysis in trading?",
        options: [
          { text: "لتحديد مستويات الدعم والمقاومة", isCorrect: false },
          { text: "لتحديد مشاعر السوق (إيجابية، سلبية، محايدة) بناءً على الأخبار ووسائل التواصل الاجتماعي", isCorrect: true },
          { text: "لتحليل البيانات التاريخية للأسعار", isCorrect: false },
          { text: "لبناء روبوتات تداول", isCorrect: false }
        ],
        explanation: "تحليل المشاعر يساعد في فهم المزاج العام للسوق وتأثيره المحتمل على الأسعار."
      },
      {
        id: 6,
        question: "ما هي إحدى التحديات الرئيسية التي تواجه استخدام الذكاء الاصطناعي في التداول؟",
        questionEn: "What is one of the main challenges facing the use of AI in trading?",
        options: [
          { text: "سهولة بناء النماذج", isCorrect: false },
          { text: "جودة البيانات والتحيزات المحتملة فيها", isCorrect: true },
          { text: "عدم وجود تقلبات في السوق", isCorrect: false },
          { text: "عدم الحاجة إلى خبرة تقنية", isCorrect: false }
        ],
        explanation: "جودة البيانات هي عامل حاسم، فالنماذج تكون جيدة بقدر جودة البيانات التي تدربت عليها."
      },
      {
        id: 7,
        question: "ماذا يعني \"التعلم المعزز (Reinforcement Learning)\" في سياق التداول؟",
        questionEn: "What does \"Reinforcement Learning\" mean in the context of trading?",
        options: [
          { text: "تدريب النماذج على بيانات مصنفة", isCorrect: false },
          { text: "تحديد الأنماط المخفية في البيانات", isCorrect: false },
          { text: "تدريب الروبوتات على اتخاذ قرارات تداول من خلال التجربة والخطأ في بيئة محاكاة", isCorrect: true },
          { text: "تحليل الأخبار الاقتصادية", isCorrect: false }
        ],
        explanation: "التعلم المعزز يسمح للروبوتات بتعلم أفضل الاستراتيجيات من خلال التفاعل مع البيئة."
      },
      {
        id: 8,
        question: "ما هو التداول عالي التردد (High-Frequency Trading - HFT)؟",
        questionEn: "What is High-Frequency Trading (HFT)?",
        options: [
          { text: "استراتيجية تداول بطيئة المدى", isCorrect: false },
          { text: "تنفيذ آلاف الصفقات في أجزاء من الثانية", isCorrect: true },
          { text: "التداول اليدوي على أطر زمنية كبيرة", isCorrect: false },
          { text: "استخدام الذكاء الاصطناعي لتحليل المشاعر فقط", isCorrect: false }
        ],
        explanation: "HFT هو نوع من التداول الخوارزمي يتميز بالسرعة الفائقة في تنفيذ الصفقات."
      },
      {
        id: 9,
        question: "لماذا يجب على المتداولين الأفراد استخدام الذكاء الاصطناعي بحذر؟",
        questionEn: "Why should individual traders use AI cautiously?",
        options: [
          { text: "لأنه غير فعال في التداول", isCorrect: false },
          { text: "لأنه يتطلب خبرة تقنية عالية، وقد لا تعمل النماذج بشكل جيد في ظروف السوق المتغيرة", isCorrect: true },
          { text: "لأنه يقلل من الأرباح", isCorrect: false },
          { text: "لأنه يزيل الحاجة إلى إدارة المخاطر", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي أداة قوية لكنه يتطلب فهماً عميقاً لتحدياته وقيوده."
      },
      {
        id: 10,
        question: "ما هو الدور الذي يلعبه الذكاء الاصطناعي في إدارة المخاطر وتحسين المحافظ؟",
        questionEn: "What role does AI play in risk management and portfolio optimization?",
        options: [
          { text: "يزيد من المخاطر بشكل عشوائي", isCorrect: false },
          { text: "يحلل المخاطر بدقة، ويحدد الارتباطات بين الأصول، ويحسن توزيع الأصول لزيادة العوائد وتقليل المخاطر", isCorrect: true },
          { text: "يتجاهل المخاطر تماماً", isCorrect: false },
          { text: "يقتصر دوره على التداول الخوارزمي فقط", isCorrect: false }
        ],
        explanation: "نماذج الذكاء الاصطناعي يمكنها تحليل كميات هائلة من البيانات لتحديد المخاطر وتحسين أداء المحافظ."
      }
    ]
  },
  {
    id: 2,
    stageId: 15,
    type: "stage-exam",
    title: "الاختبار النهائي للمرحلة 15: الذكاء الاصطناعي في التداول",
    titleEn: "Stage 15 Final Exam: AI in Trading",
    passingScore: 75,
    timeLimitMinutes: 30,
    questions: [
      {
        id: 1,
        question: "ما هي القدرة الرئيسية التي يمنحها الذكاء الاصطناعي للمتداولين؟",
        questionEn: "What is the main capability that AI provides to traders?",
        options: [
          { text: "القدرة على التداول يدوياً بشكل أسرع", isCorrect: false },
          { text: "القدرة على معالجة كميات هائلة من البيانات وتحديد الأنماط المعقدة", isCorrect: true },
          { text: "القدرة على تجاهل ظروف السوق", isCorrect: false },
          { text: "القدرة على التنبؤ بالمستقبل بدقة 100%", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي يتفوق في تحليل البيانات الضخمة واستخلاص الأنماط منها."
      },
      {
        id: 2,
        question: "ما هو التعلم الخاضع للإشراف (Supervised Learning)؟",
        questionEn: "What is Supervised Learning?",
        options: [
          { text: "تحديد الأنماط المخفية في البيانات بدون مخرجات محددة مسبقاً", isCorrect: false },
          { text: "تدريب النماذج على بيانات تاريخية تحتوي على مدخلات ومخرجات معروفة", isCorrect: true },
          { text: "تدريب الروبوتات على اتخاذ قرارات من خلال التجربة والخطأ", isCorrect: false },
          { text: "تحليل المشاعر في الأخبار", isCorrect: false }
        ],
        explanation: "التعلم الخاضع للإشراف يعتمد على بيانات مصنفة لتعلم العلاقة بين المدخلات والمخرجات."
      },
      {
        id: 3,
        question: "ما هي الشبكات العصبية الاصطناعية (ANN) المستخدمة في التداول؟",
        questionEn: "What are Artificial Neural Networks (ANN) used for in trading?",
        options: [
          { text: "لتنفيذ أوامر التداول يدوياً", isCorrect: false },
          { text: "للتعرف على الأنماط المعقدة في بيانات السوق غير الخطية وتوقع الأسعار", isCorrect: true },
          { text: "لتحليل الأخبار فقط", isCorrect: false },
          { text: "لإدارة المخاطر فقط", isCorrect: false }
        ],
        explanation: "ANNs هي أدوات قوية للتعرف على الأنماط والتنبؤ في الأسواق المالية."
      },
      {
        id: 4,
        question: "ما هو التداول الخوارزمي (Algorithmic Trading)؟",
        questionEn: "What is Algorithmic Trading?",
        options: [
          { text: "التداول الذي يعتمد على الحدس البشري", isCorrect: false },
          { text: "استخدام برامج حاسوبية لتنفيذ أوامر التداول بسرعة ودقة بناءً على قواعد محددة مسبقاً", isCorrect: true },
          { text: "التداول الذي يتجاهل التحليل الفني", isCorrect: false },
          { text: "التداول الذي يتم فقط في أوقات الأخبار", isCorrect: false }
        ],
        explanation: "التداول الخوارزمي يهدف إلى أتمتة عملية التداول لزيادة الكفاءة والسرعة."
      },
      {
        id: 5,
        question: "كيف يساهم تحليل المشاعر (Sentiment Analysis) في التداول؟",
        questionEn: "How does Sentiment Analysis contribute to trading?",
        options: [
          { text: "يحدد مستويات الدعم والمقاومة تلقائياً", isCorrect: false },
          { text: "يحدد مشاعر السوق (إيجابية، سلبية، محايدة) بناءً على مصادر مختلفة", isCorrect: true },
          { text: "يقوم بتنفيذ الصفقات بدلاً من المتداول", isCorrect: false },
          { text: "يحلل البيانات التاريخية فقط", isCorrect: false }
        ],
        explanation: "تحليل المشاعر يوفر رؤى حول المزاج العام للسوق، مما يساعد في اتخاذ قرارات تداول مستنيرة."
      },
      {
        id: 6,
        question: "ما هي إحدى التحديات الأخلاقية المرتبطة بالذكاء الاصطناعي في التداول؟",
        questionEn: "What is one of the ethical challenges associated with AI in trading?",
        options: [
          { text: "زيادة الشفافية في السوق", isCorrect: false },
          { text: "العدالة والشفافية في التداول الآلي", isCorrect: true },
          { text: "تقليل المخاطر بشكل كبير", isCorrect: false },
          { text: "سهولة الوصول إلى البيانات", isCorrect: false }
        ],
        explanation: "العدالة والشفافية هي اعتبارات أخلاقية مهمة لضمان أن التداول الآلي لا يضر بالمشاركين الصغار في السوق."
      },
      {
        id: 7,
        question: "ما هو الدور الذي يلعبه \"التعلم المعزز (Reinforcement Learning)\" في تطوير روبوتات التداول؟",
        questionEn: "What role does \"Reinforcement Learning\" play in developing trading bots?",
        options: [
          { text: "يساعد في جمع البيانات التاريخية", isCorrect: false },
          { text: "يمكن الروبوتات من تعلم أفضل الاستراتيجيات من خلال التجربة والخطأ في بيئة محاكاة", isCorrect: true },
          { text: "يستخدم لتحديد الأنماط المخفية فقط", isCorrect: false },
          { text: "يستخدم لتحليل الأخبار فقط", isCorrect: false }
        ],
        explanation: "التعلم المعزز يسمح للروبوتات بتحسين أدائها بشكل مستمر من خلال التفاعل مع بيئة التداول."
      },
      {
        id: 8,
        question: "ما هي أهمية جودة البيانات في بناء نماذج الذكاء الاصطناعي للتداول؟",
        questionEn: "What is the importance of data quality in building AI models for trading?",
        options: [
          { text: "ليس لها أهمية كبيرة", isCorrect: false },
          { text: "نماذج الذكاء الاصطناعي جيدة بقدر جودة البيانات التي تدربت عليها", isCorrect: true },
          { text: "تزيد من تعقيد النماذج دون فائدة", isCorrect: false },
          { text: "تؤدي إلى تحيزات في النماذج", isCorrect: false }
        ],
        explanation: "البيانات عالية الجودة ضرورية لتدريب نماذج ذكاء اصطناعي فعالة ودقيقة."
      },
      {
        id: 9,
        question: "ما هو أحد تطبيقات الذكاء الاصطناعي في إدارة المخاطر؟",
        questionEn: "What is one application of AI in risk management?",
        options: [
          { text: "زيادة المخاطر لتعظيم الأرباح", isCorrect: false },
          { text: "تحليل المخاطر بدقة وتحديد الارتباطات بين الأصول لتحسين المحافظ", isCorrect: true },
          { text: "تجاهل جميع المخاطر", isCorrect: false },
          { text: "الاعتماد على الحدس البشري فقط", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي يمكنه تحليل كميات هائلة من البيانات لتحديد المخاطر وتحسين توزيع الأصول في المحافظ."
      },
      {
        id: 10,
        question: "ما هي الخطوة الأولى في بناء روبوت تداول بسيط باستخدام Python؟",
        questionEn: "What is the first step in building a simple trading bot using Python?",
        options: [
          { text: "ربط الروبوت بمنصة تداول مباشرة", isCorrect: false },
          { text: "جمع البيانات التاريخية للأسعار", isCorrect: true },
          { text: "تطوير استراتيجية معقدة", isCorrect: false },
          { text: "الاختبار الخلفي (Backtesting)", isCorrect: false }
        ],
        explanation: "جمع البيانات هو الأساس الذي تبنى عليه أي استراتيجية تداول آلية."
      },
      {
        id: 11,
        question: "ماذا يعني \"التعلم غير الخاضع للإشراف (Unsupervised Learning)\" في التداول؟",
        questionEn: "What does \"Unsupervised Learning\" mean in trading?",
        options: [
          { text: "تدريب النماذج على بيانات مصنفة", isCorrect: false },
          { text: "تحديد الأنماط المخفية في البيانات بدون مخرجات محددة مسبقاً", isCorrect: true },
          { text: "تدريب الروبوتات على اتخاذ قرارات من خلال التجربة والخطأ", isCorrect: false },
          { text: "تحليل الأخبار الاقتصادية", isCorrect: false }
        ],
        explanation: "التعلم غير الخاضع للإشراف يكتشف الهياكل والأنماط في البيانات غير المصنفة."
      },
      {
        id: 12,
        question: "ما هي إحدى الفوائد الرئيسية للتداول الخوارزمي؟",
        questionEn: "What is one of the main benefits of algorithmic trading?",
        options: [
          { text: "زيادة التدخل العاطفي", isCorrect: false },
          { text: "تنفيذ أوامر التداول بسرعة ودقة عالية", isCorrect: true },
          { text: "تقليل حجم التداول", isCorrect: false },
          { text: "زيادة الأخطاء البشرية", isCorrect: false }
        ],
        explanation: "التداول الخوارزمي يقلل من الأخطاء البشرية ويزيد من سرعة ودقة التنفيذ."
      },
      {
        id: 13,
        question: "ما هو \"الاختبار الخلفي (Backtesting)\" في سياق بناء روبوت تداول؟",
        questionEn: "What is \"Backtesting\" in the context of building a trading bot?",
        options: [
          { text: "التداول على حساب حقيقي", isCorrect: false },
          { text: "اختبار الاستراتيجية على البيانات التاريخية لتقييم أدائها", isCorrect: true },
          { text: "التداول على حساب تجريبي", isCorrect: false },
          { text: "تجاهل الأداء السابق", isCorrect: false }
        ],
        explanation: "الاختبار الخلفي ضروري لتقييم فعالية الاستراتيجية قبل تطبيقها في التداول الحقيقي."
      },
      {
        id: 14,
        question: "لماذا يعتبر الذكاء الاصطناعي أداة لا غنى عنها للمؤسسات المالية الكبرى؟",
        questionEn: "Why is AI an indispensable tool for major financial institutions?",
        options: [
          { text: "لأنه يقلل من الحاجة إلى الموظفين", isCorrect: false },
          { text: "لقدرته على معالجة كميات هائلة من البيانات، تحديد الأنماط المعقدة، واتخاذ القرارات بسرعة فائقة", isCorrect: true },
          { text: "لأنه يضمن الأرباح دائماً", isCorrect: false },
          { text: "لأنه يلغي الحاجة إلى إدارة المخاطر", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي يمنح المؤسسات ميزة تنافسية كبيرة في الأسواق."
      },
      {
        id: 15,
        question: "ما هي إحدى الاعتبارات الأخلاقية المتعلقة بالمسؤولية في أنظمة التداول الآلي؟",
        questionEn: "What is one ethical consideration related to responsibility in automated trading systems?",
        options: [
          { text: "من المسؤول عند حدوث خطأ في نظام تداول آلي؟", isCorrect: true },
          { text: "هل التداول الآلي يزيد من الأرباح؟", isCorrect: false },
          { text: "هل التداول الآلي يقلل من التقلبات؟", isCorrect: false },
          { text: "هل التداول الآلي سهل التعلم؟", isCorrect: false }
        ],
        explanation: "تحديد المسؤولية عند حدوث أخطاء في الأنظمة الآلية هو تحدي أخلاقي وقانوني."
      },
      {
        id: 16,
        question: "ما هو نوع التعلم الآلي الذي يحدد الأنماط المخفية في البيانات بدون مخرجات محددة مسبقاً؟",
        questionEn: "What type of machine learning identifies hidden patterns in data without predefined outputs?",
        options: [
          { text: "التعلم الخاضع للإشراف", isCorrect: false },
          { text: "التعلم غير الخاضع للإشراف", isCorrect: true },
          { text: "التعلم المعزز", isCorrect: false },
          { text: "التعلم العميق", isCorrect: false }
        ],
        explanation: "التعلم غير الخاضع للإشراف مفيد لاكتشاف الهياكل غير المعروفة في البيانات."
      },
      {
        id: 17,
        question: "ما هي إحدى الطرق التي يمكن للمتداولين الأفراد من خلالها الاستفادة من الذكاء الاصطناعي؟",
        questionEn: "What is one way individual traders can benefit from AI?",
        options: [
          { text: "الاعتماد الكلي على الروبوتات دون فهم", isCorrect: false },
          { text: "استخدامه كأداة مساعدة لتعزيز قراراتهم التداولية", isCorrect: true },
          { text: "تجاهل جميع أدوات التحليل الأخرى", isCorrect: false },
          { text: "التداول بدون خطة", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي يجب أن يكون أداة مساعدة، وليس بديلاً عن التفكير النقدي."
      },
      {
        id: 18,
        question: "ما هي إحدى التحديات المتعلقة بالظروف المتغيرة للسوق في نماذج الذكاء الاصطناعي؟",
        questionEn: "What is one challenge related to changing market conditions in AI models?",
        options: [
          { text: "أن النماذج المدربة على بيانات سابقة قد لا تعمل بشكل جيد في ظروف سوق جديدة", isCorrect: true },
          { text: "أن النماذج تصبح أكثر دقة في الظروف المتغيرة", isCorrect: false },
          { text: "أن الظروف المتغيرة لا تؤثر على النماذج", isCorrect: false },
          { text: "أن النماذج تتكيف تلقائياً مع أي تغيير", isCorrect: false }
        ],
        explanation: "الأسواق ديناميكية، والنماذج تحتاج إلى التكيف المستمر مع الظروف الجديدة."
      },
      {
        id: 19,
        question: "ما هو الدور الذي يلعبه الذكاء الاصطناعي في اكتشاف الاحتيال والتلاعب في الأسواق المالية؟",
        questionEn: "What role does AI play in detecting fraud and manipulation in financial markets?",
        options: [
          { text: "يزيد من فرص الاحتيال", isCorrect: false },
          { text: "يحدد الأنماط غير الطبيعية في بيانات التداول التي قد تشير إلى أنشطة احتيالية أو تلاعب", isCorrect: true },
          { text: "يتجاهل الأنشطة المشبوهة", isCorrect: false },
          { text: "يقتصر دوره على التداول فقط", isCorrect: false }
        ],
        explanation: "الذكاء الاصطناعي يمكنه تحليل كميات هائلة من البيانات لتحديد السلوكيات المشبوهة."
      },
      {
        id: 20,
        question: "ما هي أهمية \"التعلم المستمر\" في التداول، حتى مع وجود الذكاء الاصطناعي؟",
        questionEn: "What is the importance of \"continuous learning\" in trading, even with AI?",
        options: [
          { text: "لا توجد أهمية، فالذكاء الاصطناعي يقوم بكل شيء", isCorrect: false },
          { text: "التعلم في التداول عملية مستمرة، والنجاح يتطلب الانضباط، المثابرة، والتكيف المستمر", isCorrect: true },
          { text: "التعلم يقتصر على المتداولين المبتدئين فقط", isCorrect: false },
          { text: "التعلم يزيد من التعقيد دون فائدة", isCorrect: false }
        ],
        explanation: "التعلم المستمر ضروري للمتداولين للبقاء على اطلاع دائم والتكيف مع التغيرات في السوق والتقنيات."
      }
    ]
  }
];
