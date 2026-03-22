export const stage8Quizzes = [
  {
    id: 1,
    stageId: 8,
    lessonRange: "1-3",
    type: "mini-quiz",
    title: "اختبار قصير: أساسيات التحليل الأساسي",
    titleEn: "Mini-Quiz: Fundamentals of Fundamental Analysis",
    passingScore: 70,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: "ما هو الهدف الرئيسي للتحليل الأساسي في التداول؟",
        questionEn: "What is the primary goal of fundamental analysis in trading?",
        options: [
          { text: "تحديد أنماط الأسعار التاريخية", isCorrect: false },
          { text: "تحديد ما إذا كان الأصل مقوماً بأقل أو أكثر من قيمته الحقيقية", isCorrect: true },
          { text: "التنبؤ بحركة السعر على المدى القصير جداً", isCorrect: false },
          { text: "تحليل سلوك المتداولين الآخرين", isCorrect: false }
        ],
        explanation: "التحليل الأساسي يهدف إلى تقييم القيمة الحقيقية للأصل لتحديد ما إذا كان سعره الحالي في السوق عادلاً أم لا."
      },
      {
        id: 2,
        question: "أي من التالي يعتبر من ركائز التحليل الأساسي في سوق الفوركس؟",
        questionEn: "Which of the following is considered a pillar of fundamental analysis in the Forex market?",
        options: [
          { text: "المتوسطات المتحركة", isCorrect: false },
          { text: "السياسة النقدية للبنوك المركزية", isCorrect: true },
          { text: "مؤشر القوة النسبية (RSI)", isCorrect: false },
          { text: "الأنماط الرسومية (Chart Patterns)", isCorrect: false }
        ],
        explanation: "السياسة النقدية للبنوك المركزية هي أحد أهم ركائز التحليل الأساسي في الفوركس، حيث تؤثر بشكل مباشر على قيمة العملة."
      },
      {
        id: 3,
        question: "ما هو تأثير رفع أسعار الفائدة من قبل البنك المركزي على العملة عادة؟",
        questionEn: "What is the typical effect of a central bank raising interest rates on its currency?",
        options: [
          { text: "إضعاف العملة", isCorrect: false },
          { text: "تقوية العملة", isCorrect: true },
          { text: "لا يوجد تأثير مباشر", isCorrect: false },
          { text: "زيادة التضخم", isCorrect: false }
        ],
        explanation: "رفع أسعار الفائدة يجعل العملة أكثر جاذبية للمستثمرين الباحثين عن عوائد أعلى، مما يزيد الطلب عليها ويقويها."
      },
      {
        id: 4,
        question: "أي من المؤشرات الاقتصادية التالية يعتبر المؤشر الأوسع والأكثر شمولاً للصحة الاقتصادية؟",
        questionEn: "Which of the following economic indicators is considered the broadest and most comprehensive measure of economic health?",
        options: [
          { text: "مؤشر أسعار المستهلك (CPI)", isCorrect: false },
          { text: "معدلات البطالة", isCorrect: false },
          { text: "الناتج المحلي الإجمالي (GDP)", isCorrect: true },
          { text: "مبيعات التجزئة", isCorrect: false }
        ],
        explanation: "الناتج المحلي الإجمالي (GDP) يقيس إجمالي قيمة السلع والخدمات المنتجة في بلد ما، ويعتبر المؤشر الأوسع للصحة الاقتصادية."
      },
      {
        id: 5,
        question: "ماذا تعني السياسة النقدية المتشددة (Hawkish Monetary Policy)؟",
        questionEn: "What does a Hawkish Monetary Policy imply?",
        options: [
          { text: "خفض أسعار الفائدة لدعم النمو", isCorrect: false },
          { text: "زيادة المعروض النقدي من خلال التيسير الكمي", isCorrect: false },
          { text: "رفع أسعار الفائدة أو التلميح لرفعها لمكافحة التضخم", isCorrect: true },
          { text: "الحفاظ على أسعار الفائدة دون تغيير مع لهجة متساهلة", isCorrect: false }
        ],
        explanation: "السياسة المتشددة تركز على مكافحة التضخم وغالباً ما تتضمن رفع أسعار الفائدة أو الإشارة إلى احتمالية رفعها."
      },
      {
        id: 6,
        question: "ما هو التأثير المتوقع للبيانات الاقتصادية التي تكون \"أفضل من التوقعات\" على العملة؟",
        questionEn: "What is the expected impact of economic data that is 'better than forecast' on a currency?",
        options: [
          { text: "سلبي (إضعاف العملة)", isCorrect: false },
          { text: "إيجابي (تقوية العملة)", isCorrect: true },
          { text: "لا يوجد تأثير", isCorrect: false },
          { text: "يؤدي إلى تقلبات عشوائية", isCorrect: false }
        ],
        explanation: "البيانات الاقتصادية التي تتجاوز التوقعات تشير إلى أداء اقتصادي أقوى، مما يجعل العملة أكثر جاذبية ويقويها."
      },
      {
        id: 7,
        question: "لماذا يُنصح المتداولون المبتدئون بتجنب التداول وقت الأخبار عالية التأثير؟",
        questionEn: "Why are novice traders advised to avoid trading during high-impact news releases?",
        options: [
          { text: "لأن الأسواق تكون مغلقة في ذلك الوقت", isCorrect: false },
          { text: "بسبب التقلبات الشديدة والفروقات السعرية الكبيرة (Spreads)", isCorrect: true },
          { text: "لأن الأخبار لا تؤثر على الأسعار", isCorrect: false },
          { text: "لأنها تتطلب رأس مال كبير جداً", isCorrect: false }
        ],
        explanation: "الأخبار عالية التأثير تسبب تقلبات حادة في الأسعار وتوسعاً في الفروقات السعرية، مما يزيد من المخاطر على المتداولين المبتدئين."
      },
      {
        id: 8,
        question: "ما هو التيسير الكمي (Quantitative Easing - QE)؟",
        questionEn: "What is Quantitative Easing (QE)?",
        options: [
          { text: "بيع السندات الحكومية لتقليص المعروض النقدي", isCorrect: false },
          { text: "رفع أسعار الفائدة لمكافحة التضخم", isCorrect: false },
          { text: "شراء البنك المركزي لكميات كبيرة من السندات والأصول لضخ السيولة", isCorrect: true },
          { text: "خفض أسعار الفائدة لتحفيز الاقتراض", isCorrect: false }
        ],
        explanation: "التيسير الكمي هو أداة تستخدمها البنوك المركزية لضخ السيولة في الاقتصاد عن طريق شراء الأصول، مما يضعف العملة عادة."
      },
      {
        id: 9,
        question: "أي من التالي ليس من الأهداف الرئيسية للبنوك المركزية؟",
        questionEn: "Which of the following is NOT a primary objective of central banks?",
        options: [
          { text: "استقرار الأسعار", isCorrect: false },
          { text: "الحد الأقصى للتوظيف", isCorrect: false },
          { text: "تحقيق أقصى ربح للحكومة", isCorrect: true },
          { text: "استقرار النظام المالي", isCorrect: false }
        ],
        explanation: "البنوك المركزية مؤسسات مستقلة تهدف إلى استقرار الاقتصاد وليس تحقيق الربح للحكومة."
      },
      {
        id: 10,
        question: "ماذا يحدث للعملة عندما يقلص البنك المركزي ميزانيته العمومية عن طريق بيع السندات (التشديد الكمي QT)؟",
        questionEn: "What happens to a currency when a central bank reduces its balance sheet by selling bonds (Quantitative Tightening - QT)?",
        options: [
          { text: "تضعف العملة", isCorrect: false },
          { text: "تقوى العملة", isCorrect: true },
          { text: "لا تتأثر العملة", isCorrect: false },
          { text: "يزداد التضخم", isCorrect: false }
        ],
        explanation: "التشديد الكمي يسحب السيولة من الاقتصاد، مما يقلل من المعروض النقدي ويقوي العملة."
      }
    ]
  }
];
