export const stage6MiniQuizzes = [
  {
    id: "stage6_mini_quiz_1",
    stageId: 6,
    quizType: "mini",
    title: "اختبار قصير: الدروس 1-3 (إدارة المخاطر، حجم الصفقة، أنواع الأوامر)",
    titleEn: "Mini Quiz: Lessons 1-3 (Risk Management, Position Sizing, Order Types)",
    lessonAfter: 2,
    totalQuestions: 10,
    passingScore: 7, // 70%
    timeLimit: 600, // 10 دقائق
    
    questions: [
      {
        id: "q1",
        question: "ما هو الهدف الرئيسي لإدارة المخاطر في التداول؟",
        options: [
          "تحقيق أقصى قدر من الأرباح في كل صفقة.",
          "تجنب جميع الخسائر بشكل مطلق.",
          "التحكم في حجم الخسائر وحماية رأس المال لضمان الاستمرارية.",
          "تحديد أفضل نقاط الدخول والخروج فقط."
        ],
        correctAnswer: 2, // التحكم في حجم الخسائر وحماية رأس المال لضمان الاستمرارية.
        explanation: "إدارة المخاطر تركز على حماية رأس المال والتحكم في الخسائر لضمان البقاء في السوق.",
        explanationEn: "Risk management focuses on capital protection and loss control to ensure market survival."
      },
      {
        id: "q2",
        question: "ما هي النسبة المئوية الموصى بها للمخاطرة من رأس المال في الصفقة الواحدة؟",
        options: [
          "5% - 10%.",
          "1% - 2%.",
          "أكثر من 10%.",
          "لا يوجد نسبة محددة، الأمر يعتمد على المتداول."
        ],
        correctAnswer: 1, // 1% - 2%.
        explanation: "المخاطرة بنسبة 1% إلى 2% تحمي الحساب من سلسلة خسائر متتالية.",
        explanationEn: "Risking 1% to 2% protects the account from a series of consecutive losses."
      },
      {
        id: "q3",
        question: "إذا كان رأس مالك 10,000 دولار وقررت المخاطرة بـ 1% في الصفقة، فما هو أقصى مبلغ يمكنك خسارته في هذه الصفقة؟",
        options: [
          "10 دولار.",
          "100 دولار.",
          "1000 دولار.",
          "200 دولار."
        ],
        correctAnswer: 1, // 100 دولار.
        explanation: "1% من 10,000 دولار هو 100 دولار.",
        explanationEn: "1% of $10,000 is $100."
      },
      {
        id: "q4",
        question: "ماذا تعني نسبة المخاطرة إلى المكافأة (Risk-Reward Ratio) 1:3؟",
        options: [
          "أنك تخاطر بـ 3 دولارات لتربح دولار واحد.",
          "أنك تخاطر بدولار واحد لتربح 3 دولارات.",
          "أنك ستربح 3 صفقات مقابل كل صفقة خاسرة.",
          "أنك ستخسر 3 صفقات مقابل كل صفقة رابحة."
        ],
        correctAnswer: 1, // أنك تخاطر بدولار واحد لتربح 3 دولارات.
        explanation: "النسبة 1:3 تعني أن الربح المتوقع أكبر بثلاث مرات من الخسارة المحتملة.",
        explanationEn: "A 1:3 ratio means the expected profit is three times greater than the potential loss."
      },
      {
        id: "q5",
        question: "ما هو الغرض الرئيسي من حساب حجم الصفقة (Position Sizing)؟",
        options: [
          "لزيادة حجم الصفقات لتحقيق أرباح أكبر.",
          "لضمان أن المبلغ المخاطر به في الصفقة لا يتجاوز النسبة المئوية المحددة من رأس المال.",
          "لتحديد أفضل وقت للدخول في الصفقة.",
          "لتجنب استخدام وقف الخسارة."
        ],
        correctAnswer: 1, // لضمان أن المبلغ المخاطر به في الصفقة لا يتجاوز النسبة المئوية المحددة من رأس المال.
        explanation: "حجم الصفقة يربط إدارة المخاطر بتنفيذ الصفقة لضمان التحكم في الخسائر.",
        explanationEn: "Position sizing links risk management to trade execution to ensure loss control."
      },
      {
        id: "q6",
        question: "إذا كان رأس مالك 5,000 دولار، ونسبة المخاطرة 2%، ومسافة وقف الخسارة 25 نقطة، وقيمة النقطة للوت الستاندرد 10 دولارات، فما هو حجم الصفقة باللوتات؟",
        options: [
          "0.1 لوت.",
          "0.2 لوت.",
          "0.4 لوت.",
          "0.5 لوت."
        ],
        correctAnswer: 2, // 0.4 لوت.
        explanation: "المبلغ المخاطر به = 5000 * 0.02 = 100 دولار. قيمة النقطة المسموح بها = 100 / 25 = 4 دولار. حجم الصفقة = 4 / 10 = 0.4 لوت.",
        explanationEn: "Amount at risk = $5000 * 0.02 = $100. Allowable pip value = $100 / 25 = $4. Position size = $4 / $10 = 0.4 lots."
      },
      {
        id: "q7",
        question: "أي من أوامر التداول التالية ينفذ الصفقة فوراً بأفضل سعر متاح في السوق؟",
        options: [
          "أمر الشراء المحدد (Buy Limit).",
          "أمر البيع عند الوقف (Sell Stop).",
          "أمر السوق (Market Order).",
          "أمر جني الأرباح (Take-Profit)."
        ],
        correctAnswer: 2, // أمر السوق (Market Order).
        explanation: "أوامر السوق هي للتنفيذ الفوري.",
        explanationEn: "Market orders are for immediate execution."
      },
      {
        id: "q8",
        question: "ما هو الأمر الذي تضعه لشراء الأصل بسعر محدد أو أقل منه، ويكون سعر الأمر أقل من السعر الحالي للسوق؟",
        options: [
          "أمر الشراء بالسوق (Buy Market Order).",
          "أمر الشراء عند الوقف (Buy Stop Order).",
          "أمر الشراء المحدد (Buy Limit Order).",
          "أمر البيع المحدد (Sell Limit Order)."
        ],
        correctAnswer: 2, // أمر الشراء المحدد (Buy Limit Order).
        explanation: "أمر الشراء المحدد يستخدم للشراء بسعر أفضل من السعر الحالي.",
        explanationEn: "A Buy Limit Order is used to buy at a better price than the current market price."
      },
      {
        id: "q9",
        question: "ما هو الأمر الذي يغلق الصفقة تلقائياً إذا تحرك السعر ضدك ووصل إلى مستوى محدد مسبقاً؟",
        options: [
          "أمر جني الأرباح (Take-Profit Order).",
          "أمر وقف الخسارة (Stop-Loss Order).",
          "أمر السوق (Market Order).",
          "أمر واحد يلغي الآخر (OCO)."
        ],
        correctAnswer: 1, // أمر وقف الخسارة (Stop-Loss Order).
        explanation: "وقف الخسارة هو الأداة الأساسية لحماية رأس المال من الخسائر الكبيرة.",
        explanationEn: "A Stop-Loss Order is the primary tool to protect capital from large losses."
      },
      {
        id: "q10",
        question: "ما هو أمر وقف الخسارة المتحرك (Trailing Stop-Loss)؟",
        options: [
          "أمر يغلق الصفقة عند مستوى ثابت من الربح.",
          "أمر يتحرك تلقائياً مع السعر عندما يتحرك لصالحك للحفاظ على الأرباح.",
          "أمر يغلق الصفقة عند مستوى ثابت من الخسارة.",
          "أمر يتم تفعيله فقط في الأسواق المتقلبة."
        ],
        correctAnswer: 1, // أمر يتحرك تلقائياً مع السعر عندما يتحرك لصالحك للحفاظ على الأرباح.
        explanation: "وقف الخسارة المتحرك يحمي الأرباح المحققة مع السماح للصفقة بالاستمرار.",
        explanationEn: "A Trailing Stop-Loss protects realized profits while allowing the trade to continue."
      }
    ]
  }
];

export const stage6FinalExam = {
  id: "stage6_final_exam",
  stageId: 6,
  quizType: "final",
  title: "الاختبار النهائي - المرحلة 6: إدارة المخاطر ورأس المال",
  titleEn: "Final Exam - Stage 6: Risk and Capital Management",
  description: "اختبار شامل للمرحلة السادسة من إدارة المخاطر ورأس المال. يجب الحصول على 15/20 للنجاح.",
  totalQuestions: 20,
  passingScore: 15, // 15/20 (75%)
  timeLimit: 1800, // 30 دقيقة
  
  questions: [
    {
      id: "q1",
      question: "لماذا تعتبر إدارة المخاطر أهم من استراتيجية التداول؟",
      options: [
        "لأنها تضمن تحقيق أرباح أكبر.",
        "لأنها الجانب الوحيد الذي يتحكم فيه المتداول بشكل كامل.",
        "لأنها تحمي رأس المال وتضمن الاستمرارية في السوق على المدى الطويل.",
        "لأنها تجعل التداول أكثر إثارة."
      ],
      correctAnswer: 2, // لأنها تحمي رأس المال وتضمن الاستمرارية في السوق على المدى الطويل.
      explanation: "إدارة المخاطر هي أساس البقاء في السوق.",
      explanationEn: "Risk management is the foundation of market survival."
    },
    {
      id: "q2",
      question: "ما هي القاعدة الذهبية لحجم المخاطرة لكل صفقة؟",
      options: [
        "المخاطرة بكل رأس المال في صفقة واحدة.",
        "المخاطرة بنسبة 1% إلى 2% من رأس المال في الصفقة الواحدة.",
        "المخاطرة بنسبة 5% إلى 10% من رأس المال في الصفقة الواحدة.",
        "المخاطرة بنسبة 50% من رأس المال في الصفقة الواحدة."
      ],
      correctAnswer: 1, // المخاطرة بنسبة 1% إلى 2% من رأس المال في الصفقة الواحدة.
      explanation: "هذه النسبة تحمي الحساب من سلسلة خسائر متتالية.",
      explanationEn: "This percentage protects the account from a series of consecutive losses."
    },
    {
      id: "q3",
      question: "إذا كان رأس مالك 20,000 دولار وقررت المخاطرة بـ 1.5% في الصفقة، فما هو أقصى مبلغ يمكنك خسارته في هذه الصفقة؟",
      options: [
        "200 دولار.",
        "300 دولار.",
        "150 دولار.",
        "400 دولار."
      ],
      correctAnswer: 1, // 300 دولار.
      explanation: "1.5% من 20,000 دولار هو 300 دولار.",
      explanationEn: "1.5% of $20,000 is $300."
    },
    {
      id: "q4",
      question: "ماذا تعني نسبة المخاطرة إلى المكافأة (Risk-Reward Ratio) 1:5؟",
      options: [
        "أنك تخاطر بـ 5 دولارات لتربح دولار واحد.",
        "أنك تخاطر بدولار واحد لتربح 5 دولارات.",
        "أنك ستربح 5 صفقات مقابل كل صفقة خاسرة.",
        "أنك ستخسر 5 صفقات مقابل كل صفقة رابحة."
      ],
      correctAnswer: 1, // أنك تخاطر بدولار واحد لتربح 5 دولارات.
      explanation: "النسبة 1:5 تعني أن الربح المتوقع أكبر بخمس مرات من الخسارة المحتملة.",
      explanationEn: "A 1:5 ratio means the expected profit is five times greater than the potential loss."
    },
    {
      id: "q5",
      question: "ما هي المعلومات الثلاثة الرئيسية اللازمة لحساب حجم الصفقة؟",
      options: [
        "اسم الوسيط، نوع الحساب، تاريخ انتهاء الصلاحية.",
        "حجم رأس المال، نسبة المخاطرة لكل صفقة، المسافة إلى وقف الخسارة.",
        "سعر الدخول، سعر الخروج، حجم التداول.",
        "التحليل الفني، التحليل الأساسي، سيكولوجية السوق."
      ],
      correctAnswer: 1, // حجم رأس المال، نسبة المخاطرة لكل صفقة، المسافة إلى وقف الخسارة.
      explanation: "هذه هي المدخلات الأساسية لحساب حجم الصفقة بشكل دقيق.",
      explanationEn: "These are the essential inputs for accurate position sizing."
    },
    {
      id: "q6",
      question: "إذا كان رأس مالك 10,000 دولار، ونسبة المخاطرة 1%، ومسافة وقف الخسارة 40 نقطة، وقيمة النقطة للوت الستاندرد 10 دولارات، فما هو حجم الصفقة باللوتات؟",
      options: [
        "0.15 لوت.",
        "0.20 لوت.",
        "0.25 لوت.",
        "0.30 لوت."
      ],
      correctAnswer: 2, // 0.25 لوت.
      explanation: "المبلغ المخاطر به = 10000 * 0.01 = 100 دولار. قيمة النقطة المسموح بها = 100 / 40 = 2.5 دولار. حجم الصفقة = 2.5 / 10 = 0.25 لوت.",
      explanationEn: "Amount at risk = $10000 * 0.01 = $100. Allowable pip value = $100 / 40 = $2.5. Position size = $2.5 / $10 = 0.25 lots."
    },
    {
      id: "q7",
      question: "ما هو الأمر الذي يسمح لك بشراء الأصل بسعر السوق بمجرد أن يصل السعر إلى مستوى محدد أعلى من السعر الحالي؟",
      options: [
        "أمر الشراء المحدد (Buy Limit Order).",
        "أمر الشراء عند الوقف (Buy Stop Order).",
        "أمر البيع المحدد (Sell Limit Order).",
        "أمر البيع عند الوقف (Sell Stop Order)."
      ],
      correctAnswer: 1, // أمر الشراء عند الوقف (Buy Stop Order).
      explanation: "أمر الشراء عند الوقف يستخدم للدخول بعد اختراق مستوى مقاومة.",
      explanationEn: "A Buy Stop Order is used to enter after breaking a resistance level."
    },
    {
      id: "q8",
      question: "ما هو الأمر الذي يغلق الصفقة تلقائياً إذا تحرك السعر لصالحك ووصل إلى مستوى محدد مسبقاً؟",
      options: [
        "أمر وقف الخسارة (Stop-Loss Order).",
        "أمر جني الأرباح (Take-Profit Order).",
        "أمر السوق (Market Order).",
        "أمر واحد يلغي الآخر (OCO)."
      ],
      correctAnswer: 1, // أمر جني الأرباح (Take-Profit Order).
      explanation: "جني الأرباح يؤمن الأرباح المحققة.",
      explanationEn: "A Take-Profit Order secures realized profits."
    },
    {
      id: "q9",
      question: "ما هي ميزة استخدام وقف الخسارة المتحرك (Trailing Stop-Loss)؟",
      options: [
        "يضمن لك عدم الخسارة أبداً.",
        "يسمح لك بحماية الأرباح مع السماح للصفقة بالاستمرار في الاتجاه الرابح.",
        "يحدد نقطة الدخول المثالية للصفقة.",
        "يلغي الحاجة إلى تحديد نسبة المخاطرة."
      ],
      correctAnswer: 1, // يسمح لك بحماية الأرباح مع السماح للصفقة بالاستمرار في الاتجاه الرابح.
      explanation: "وقف الخسارة المتحرك يجمع بين حماية الأرباح وإمكانية تحقيق المزيد.",
      explanationEn: "A Trailing Stop-Loss combines profit protection with the potential for further gains."
    },
    {
      id: "q10",
      question: "ما هو أمر OCO (One Cancels the Other)؟",
      options: [
        "أمران يتم تنفيذهما في نفس الوقت.",
        "أمران معلقان يؤدي تنفيذ أحدهما إلى إلغاء الآخر تلقائياً.",
        "أمر واحد يتبع الآخر.",
        "أمر يتم تفعيله فقط عند وجود أخبار اقتصادية."
      ],
      correctAnswer: 1, // أمران معلقان يؤدي تنفيذ أحدهما إلى إلغاء الآخر تلقائياً.
      explanation: "OCO يستخدم عادة لربط وقف الخسارة وجني الأرباح.",
      explanationEn: "OCO is typically used to link a stop-loss and a take-profit order."
    },
    {
      id: "q11",
      question: "لماذا يعتبر التحكم في العواطف جزءاً من إدارة المخاطر؟",
      options: [
        "لأن العواطف لا تؤثر على قرارات التداول.",
        "لأن إدارة المخاطر تقلل الضغط النفسي وتساعد على اتخاذ قرارات عقلانية.",
        "لأن المتداولين المحترفين لا يشعرون بأي عواطف.",
        "لأن العواطف تزيد من دقة التحليل."
      ],
      correctAnswer: 1, // لأن إدارة المخاطر تقلل الضغط النفسي وتساعد على اتخاذ قرارات عقلانية.
      explanation: "التحكم في المخاطر يقلل من الخوف والطمع، مما يؤدي إلى تداول أفضل.",
      explanationEn: "Risk control reduces fear and greed, leading to better trading."
    },
    {
      id: "q12",
      question: "ما هو الفرق بين أمر الشراء عند الوقف (Buy Stop) وأمر الشراء المحدد (Buy Limit)؟",
      options: [
        "Buy Stop للشراء بسعر أقل، Buy Limit للشراء بسعر أعلى.",
        "Buy Stop للشراء بسعر أعلى، Buy Limit للشراء بسعر أقل.",
        "كلاهما نفس الشيء تماماً.",
        "Buy Stop للتنفيذ الفوري، Buy Limit للتنفيذ المستقبلي."
      ],
      correctAnswer: 1, // Buy Stop للشراء بسعر أعلى، Buy Limit للشراء بسعر أقل.
      explanation: "Buy Stop يستخدم لاختراق المقاومة، Buy Limit يستخدم للارتداد من الدعم.",
      explanationEn: "Buy Stop is used for resistance breakouts, Buy Limit for bounces from support."
    },
    {
      id: "q13",
      question: "إذا كنت تبيع أصلاً (صفقة بيع)، فما هو نوع أمر وقف الخسارة الذي ستستخدمه؟",
      options: [
        "أمر بيع محدد (Sell Limit Order).",
        "أمر شراء عند الوقف (Buy Stop Order).",
        "أمر بيع عند الوقف (Sell Stop Order).",
        "أمر شراء بالسوق (Buy Market Order)."
      ],
      correctAnswer: 1, // أمر شراء عند الوقف (Buy Stop Order).
      explanation: "لإغلاق صفقة بيع بخسارة، تحتاج إلى أمر شراء.",
      explanationEn: "To close a sell trade at a loss, you need a buy order."
    },
    {
      id: "q14",
      question: "ما هو أمر OTO (One Triggers the Other)؟",
      options: [
        "أمران يتم تنفيذهما في نفس الوقت.",
        "أمران معلقان يؤدي تنفيذ أحدهما إلى إلغاء الآخر تلقائياً.",
        "أمران معلقان يؤدي تنفيذ الأمر الأول إلى تفعيل الأمر الثاني تلقائياً.",
        "أمر يتم تفعيله فقط عند وجود أخبار اقتصادية."
      ],
      correctAnswer: 2, // أمران معلقان يؤدي تنفيذ الأمر الأول إلى تفعيل الأمر الثاني تلقائياً.
      explanation: "OTO يستخدم لوضع وقف خسارة وجني أرباح تلقائياً بعد الدخول في صفقة.",
      explanationEn: "OTO is used to automatically place a stop-loss and take-profit after entering a trade."
    },
    {
      id: "q15",
      question: "لماذا يجب على المتداولين استخدام وقف الخسارة في كل صفقة؟",
      options: [
        "لأنه يزيد من الأرباح.",
        "لأنه يحدد أقصى خسارة ممكنة ويحمي رأس المال من الانهيار.",
        "لأنه يجعل الصفقة أكثر تعقيداً.",
        "لأنه ليس ضرورياً إذا كانت الاستراتيجية جيدة."
      ],
      correctAnswer: 1, // لأنه يحدد أقصى خسارة ممكنة ويحمي رأس المال من الانهيار.
      explanation: "وقف الخسارة هو خط الدفاع الأول ضد الخسائر الكبيرة.",
      explanationEn: "A stop-loss is the first line of defense against large losses."
    },
    {
      id: "q16",
      question: "ما هو الانزلاق السعري (Slippage)؟",
      options: [
        "تنفيذ الأمر بالسعر المطلوب تماماً.",
        "تنفيذ الأمر بسعر مختلف عن السعر المطلوب بسبب تقلبات السوق.",
        "تأخير في تنفيذ الأمر.",
        "إلغاء الأمر تلقائياً."
      ],
      correctAnswer: 1, // تنفيذ الأمر بسعر مختلف عن السعر المطلوب بسبب تقلبات السوق.
      explanation: "يحدث الانزلاق السعري غالباً في أوامر السوق أو أوامر الوقف في الأسواق المتقلبة.",
      explanationEn: "Slippage often occurs with market or stop orders in volatile markets."
    },
    {
      id: "q17",
      question: "أي من هذه الأوامر يضمن لك الحصول على سعر أفضل من السعر الحالي عند الشراء؟",
      options: [
        "أمر الشراء بالسوق (Buy Market Order).",
        "أمر الشراء عند الوقف (Buy Stop Order).",
        "أمر الشراء المحدد (Buy Limit Order).",
        "أمر البيع المحدد (Sell Limit Order)."
      ],
      correctAnswer: 2, // أمر الشراء المحدد (Buy Limit Order).
      explanation: "أمر الشراء المحدد يضعك في انتظار سعر أفضل.",
      explanationEn: "A Buy Limit Order puts you in wait for a better price."
    },
    {
      id: "q18",
      question: "ما هي أهمية تحديد نسبة المخاطرة إلى المكافأة (R:R) قبل الدخول في الصفقة؟",
      options: [
        "لأنها تحدد حجم الصفقة فقط.",
        "لأنها تضمن أنك ستحقق الربح في كل صفقة.",
        "لأنها تساعد في تحديد ما إذا كانت الصفقة تستحق المخاطرة وتضمن الربحية على المدى الطويل.",
        "لأنها ليست ذات أهمية كبيرة."
      ],
      correctAnswer: 2, // لأنها تساعد في تحديد ما إذا كانت الصفقة تستحق المخاطرة وتضمن الربحية على المدى الطويل.
      explanation: "نسبة R:R الإيجابية هي مفتاح الربحية حتى مع نسبة نجاح متوسطة.",
      explanationEn: "A positive R:R ratio is key to profitability even with an average win rate."
    },
    {
      id: "q19",
      question: "إذا كنت تتوقع أن السعر سيرتفع قليلاً ثم ينخفض، وتريد البيع عند مستوى مقاومة معين، فما هو الأمر الذي ستستخدمه؟",
      options: [
        "أمر البيع بالسوق (Sell Market Order).",
        "أمر البيع عند الوقف (Sell Stop Order).",
        "أمر البيع المحدد (Sell Limit Order).",
        "أمر الشراء المحدد (Buy Limit Order)."
      ],
      correctAnswer: 2, // أمر البيع المحدد (Sell Limit Order).
      explanation: "أمر البيع المحدد يستخدم للبيع بسعر أفضل من السعر الحالي.",
      explanationEn: "A Sell Limit Order is used to sell at a better price than the current market price."
    },
    {
      id: "q20",
      question: "ما هو المفهوم الذي يضمن لك أن كل صفقة تتداولها تتماشى مع خطة المخاطر الخاصة بك؟",
      options: [
        "التحليل الفني.",
        "التحليل الأساسي.",
        "حجم الصفقة (Position Sizing).",
        "سيكولوجية التداول."
      ],
      correctAnswer: 2, // حجم الصفقة (Position Sizing).
      explanation: "حجم الصفقة هو التطبيق العملي لإدارة المخاطر.",
      explanationEn: "Position sizing is the practical application of risk management."
    }
  ]
};
