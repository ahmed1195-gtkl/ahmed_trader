// ShukriTrade Academy - Complete Course Data
// 4 Schools × 12-15 Lessons each = 50+ lessons

export const tradingTips = {
  en: [
    "Never risk more than 1-2% of your account on a single trade.",
    "Always set your stop loss before entering a trade.",
    "The trend is your friend — trade with it, not against it.",
    "Patience is the most profitable trading skill you can develop.",
    "A good trader manages risk first and profits second.",
    "Don't chase the market. Let the setup come to you.",
    "Keep a trading journal — it's your best teacher.",
    "Master one strategy before learning another.",
    "The best trade is sometimes no trade at all.",
    "Emotions are the enemy of consistent trading.",
    "Backtest your strategy before risking real money.",
    "Focus on the process, not the profit.",
    "Higher timeframes give more reliable signals.",
    "Liquidity is where the smart money hunts.",
    "Always have a plan before you click buy or sell."
  ],
  ar: [
    "لا تخاطر بأكثر من 1-2% من حسابك في صفقة واحدة.",
    "ضع وقف الخسارة دائماً قبل الدخول في أي صفقة.",
    "الاتجاه صديقك — تداول معه وليس ضده.",
    "الصبر هو أكثر مهارة تداول مربحة يمكنك تطويرها.",
    "المتداول الجيد يدير المخاطر أولاً والأرباح ثانياً.",
    "لا تطارد السوق. دع الفرصة تأتي إليك.",
    "احتفظ بدفتر تداول — إنه أفضل معلم لك.",
    "أتقن استراتيجية واحدة قبل تعلم أخرى.",
    "أفضل صفقة أحياناً هي عدم التداول.",
    "المشاعر هي عدو التداول المتسق.",
    "اختبر استراتيجيتك قبل المخاطرة بأموال حقيقية.",
    "ركز على العملية وليس على الربح.",
    "الأطر الزمنية الأعلى تعطي إشارات أكثر موثوقية.",
    "السيولة هي حيث يصطاد المال الذكي.",
    "ضع خطة دائماً قبل أن تضغط شراء أو بيع."
  ],
  fr: [
    "Ne risquez jamais plus de 1-2% de votre compte sur un seul trade.",
    "Placez toujours votre stop loss avant d'entrer en position.",
    "La tendance est votre amie — tradez avec elle, pas contre.",
    "La patience est la compétence de trading la plus rentable.",
    "Un bon trader gère le risque d'abord et les profits ensuite.",
    "Ne poursuivez pas le marché. Laissez le setup venir à vous.",
    "Tenez un journal de trading — c'est votre meilleur professeur.",
    "Maîtrisez une stratégie avant d'en apprendre une autre.",
    "Le meilleur trade est parfois de ne pas trader du tout.",
    "Les émotions sont l'ennemi du trading consistant.",
    "Backtestez votre stratégie avant de risquer de l'argent réel.",
    "Concentrez-vous sur le processus, pas sur le profit.",
    "Les timeframes supérieurs donnent des signaux plus fiables.",
    "La liquidité est là où l'argent intelligent chasse.",
    "Ayez toujours un plan avant de cliquer acheter ou vendre."
  ],
  es: [
    "Nunca arriesgues más del 1-2% de tu cuenta en una sola operación.",
    "Siempre coloca tu stop loss antes de entrar en una operación.",
    "La tendencia es tu amiga — opera con ella, no en su contra.",
    "La paciencia es la habilidad de trading más rentable.",
    "Un buen trader gestiona el riesgo primero y las ganancias después.",
    "No persigas el mercado. Deja que la configuración venga a ti.",
    "Mantén un diario de trading — es tu mejor maestro.",
    "Domina una estrategia antes de aprender otra.",
    "La mejor operación a veces es no operar en absoluto.",
    "Las emociones son el enemigo del trading consistente.",
    "Haz backtesting de tu estrategia antes de arriesgar dinero real.",
    "Enfócate en el proceso, no en la ganancia.",
    "Los marcos temporales superiores dan señales más confiables.",
    "La liquidez es donde el dinero inteligente caza.",
    "Siempre ten un plan antes de hacer clic en comprar o vender."
  ]
};

export const schools = [
  {
    id: 'foundation',
    icon: 'BookOpen',
    color: 'from-amber-500 to-yellow-500',
    colorLight: 'amber',
    lessons: 8
  },
  {
    id: 'classical',
    icon: 'BarChart3',
    color: 'from-blue-500 to-cyan-500',
    colorLight: 'blue',
    lessons: 13
  },
  {
    id: 'smc',
    icon: 'Brain',
    color: 'from-purple-500 to-pink-500',
    colorLight: 'purple',
    lessons: 12
  },
  {
    id: 'ict',
    icon: 'Target',
    color: 'from-emerald-500 to-teal-500',
    colorLight: 'emerald',
    lessons: 12
  },
  {
    id: 'sk',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500',
    colorLight: 'amber',
    lessons: 12
  }
];

// Diagram types for each lesson
export const diagramTypes = {
  'trading-intro': 'tradingIntro',
  'supply-demand': 'supplyDemand',
  'market-participants': 'marketParticipants',
  'price-imbalance': 'priceImbalance',
  'market-types': 'marketTypes',
  'order-types': 'orderTypes',
  'platform-mockup': 'platformMockup',
  'candlestick-intro': 'candlestickIntro',
  'support-resistance': 'supportResistance',
  'trendlines': 'trendlines',
  'head-shoulders': 'headShoulders',
  'double-top-bottom': 'doubleTopBottom',
  'candlestick': 'candlestick',
  'market-structure': 'marketStructure',
  'liquidity': 'liquidity',
  'order-blocks': 'orderBlocks',
  'fvg': 'fairValueGap',
  'bos': 'breakOfStructure',
  'kill-zones': 'killZones',
  'risk-management': 'riskManagement',
  'trend': 'trend',
  'fibonacci': 'fibonacci',
  'entry-model': 'entryModel',
  'chart-patterns': 'chartPatterns'
};

// Complete lesson data for all 4 schools
export const lessonsData = {
  foundation: [
    {
      id: 1,
      diagram: 'trading-intro',
      en: {
        title: "What is Trading?",
        content: `Trading, at its core, involves **buying and selling financial assets** across various markets. These assets can be **stocks** (representing company ownership), **foreign exchange (Forex)** traded in currency pairs, **commodities** like Gold and Oil, or **cryptocurrencies**.\n\nIt is vital to understand that **the trader cannot control the market**. Instead, a trader **reacts to market movements**, predicting future directions using analysis. The primary driver of price is **Supply and Demand**.\n\n**The key takeaway is that the market does not care about your opinions or wishes; it only follows buy and sell orders. Success requires an objective, data-driven mindset.**`,
        steps: [
          "Open any demo trading platform and watch the price movements for 10 minutes.",
          "Observe how the price moves up and down constantly.",
          "Do not place any trades yet; simply observe the flow and dynamics."
        ],
        example: "Buying gold at $60/gram today and selling it tomorrow at $65/gram when demand rises. The $5 difference represents your trading profit.",
        keyTakeaways: [
          "Trading is buying/selling assets to profit from price fluctuations.",
          "Traders do not control the market; they react to it.",
          "Supply and demand are the ultimate price drivers.",
          "Trading requires a disciplined, emotional-free mindset."
        ],
        activeRecall: [
          "What does the term 'Trading' mean to you?",
          "Do you think the trader controls the market movement?"
        ],
        quiz: [
          { q: "What is the main goal of trading?", a: "To make a profit by taking advantage of asset price changes over time." },
          { q: "Does the trader have the power to control market direction? Why?", a: "No, because the market is a massive entity moved by millions of decisions, institutional capital, and supply/demand forces. A trader only reacts to it." }
        ],
        feedbackLoop: "If you couldn't answer correctly, review the concept block again and focus on supply/demand and objective mindset."
      },
      ar: {
        title: "ما هو التداول؟",
        content: `التداول، في جوهره، هو النشاط الذي ينطوي على **شراء وبيع الأصول المالية** المختلفة في الأسواق المخصصة لذلك. هذه الأصول يمكن أن تكون أي شيء ذي قيمة متغيرة، مثل **الأسهم** التي تمثل حصص ملكية في الشركات، **العملات الأجنبية (الفوركس)** التي يتم تداولها في أزواج، **السلع** مثل الذهب والنفط، أو حتى **العملات الرقمية** الحديثة. الهدف الأساسي من هذه العملية هو **تحقيق الربح** من خلال الاستفادة من **تغيرات الأسعار** لهذه الأصول بمرور الوقت.\n\nمن المهم جداً فهم أن **المتداول لا يملك القدرة على التحكم في السوق**. السوق كيان ضخم ومعقد يتأثر بملايين القرارات وتدفقات رأس المال يومياً. بدلاً من التحكم، يقوم المتداول بـ**التفاعل مع حركة السوق**، محاولاً التنبؤ بالاتجاهات المستقبلية بناءً على تحليل دقيق. المحرك الرئيسي لهذه الحركة هو مبدأ **العرض والطلب**.\n\n**الفكرة الأساسية والجوهرية هنا هي أن السوق لا يهتم بآرائك الشخصية، توقعاتك، أو حتى آمالك وأحلامك. السوق يتبع فقط قوى العرض والطلب الفعلية التي تتجسد في أوامر الشراء والبيع. هذا يعني أن التداول يتطلب عقلية موضوعية، تعتمد على البيانات والتحليل بدلاً من العواطف أو التمنيات.**`,
        steps: [
          "افتح أي منصة تداول (حساب تجريبي) وراقب حركة سعر أي أصل مالي لمدة 10 دقائق.",
          "حاول أن تلاحظ كيف يتغير السعر صعوداً وهبوطاً بشكل مستمر.",
          "لا تحاول التداول، فقط راقب وسجل ملاحظاتك حول التغير المستمر."
        ],
        example: "تخيل أنك تشتري جرام الذهب اليوم بسعر 60 دولاراً وتبيعه في اليوم التالي بسعر 65 دولاراً بعد ارتفاع الطلب عليه. هذا الفارق (5 دولارات) هو ربحك من التداول.",
        keyTakeaways: [
          "التداول هو شراء وبيع أصول مالية للاستفادة من تغير الأسعار.",
          "المتداول لا يتحكم بالسوق بل يتفاعل مع حركته بشكل موضوعي.",
          "السوق يتحرك بناءً على قوى العرض والطلب الحقيقية فقط.",
          "يتطلب التداول عقلية منضبطة تعتمد على البيانات وليس المشاعر."
        ],
        activeRecall: [
          "ماذا يعني لك مصطلح 'التداول'؟",
          "هل تعتقد أن المتداول يتحكم في حركة السوق؟"
        ],
        quiz: [
          { q: "ما هو الهدف الرئيسي من عملية التداول؟", a: "تحقيق الربح من خلال الاستفادة من تغيرات أسعار الأصول المالية بمرور الوقت." },
          { q: "هل يمتلك المتداول القدرة على التحكم في اتجاه السوق؟ ولماذا؟", a: "لا، لأن السوق كيان ضخم يتأثر بملايين القرارات وتدفقات السيولة الضخمة وقوى العرض والطلب الفعلية، والمتداول فقط يتفاعل مع هذه الحركة." }
        ],
        feedbackLoop: "إذا لم تتمكن من الإجابة بشكل صحيح، قم بمراجعة كتلة المفهوم مرة أخرى وركز على العرض والطلب وعقلية التداول الموضوعية."
      }
    },
    {
      id: 2,
      diagram: 'supply-demand',
      en: {
        title: "How Do Markets Work?",
        content: `To understand how financial markets work, we must go back to the fundamental economic principle: **Supply and Demand**. This simple yet powerful force governs all price fluctuations.\n\n* **Demand:** The desire of buyers to acquire an asset. When demand increases, buyers are willing to pay more, driving the **price higher**.\n* **Supply:** The amount of an asset available for sale. When supply increases, sellers compete to sell, driving the **price lower**.\n\n**The price you see on your screen at any moment is the instantaneous equilibrium point between these opposing forces.** It represents the consensus value agreed upon by buyers and sellers at that exact second. Price is the outcome of a continuous battle between buyers (demand) and sellers (supply).`,
        steps: [
          "Look at a price chart and find a period where the price is flat (balance).",
          "Find a period where the price shoots up or down rapidly (imbalance).",
          "Identify how news or events might shift the balance of supply and demand."
        ],
        example: "If a tech company releases a revolutionary product, demand for its stock skyrockets. Since supply is limited, buyers bid higher prices to get shares, causing the stock price to climb.",
        keyTakeaways: [
          "Price is determined by the balance between supply and demand.",
          "High demand drives prices up; high supply drives prices down.",
          "The market price is the instantaneous equilibrium point.",
          "Price movement represents the shift of power between buyers and sellers."
        ],
        activeRecall: [
          "What determines the price of goods in daily life?",
          "Do you think financial markets work the same way?"
        ],
        quiz: [
          { q: "What happens to the price of an asset when demand increases significantly?", a: "The price rises because buyers compete and are willing to pay higher prices." },
          { q: "What are the two primary forces that move the price?", a: "Supply (sellers) and Demand (buyers)." }
        ],
        feedbackLoop: "If you had difficulty, focus on how price is the instantaneous consensus value agreed by both forces."
      },
      ar: {
        title: "كيف تعمل الأسواق؟",
        content: `لفهم كيفية عمل الأسواق المالية، يجب أن نعود إلى المبدأ الاقتصادي الأساسي الذي يحكم جميع الأسواق: **التوازن بين العرض والطلب**. هذا المبدأ بسيط ولكنه قوي، وهو المحرك الأساسي لحركة الأسعار.\n\n* **الطلب (Demand):** يمثل رغبة المشترين في الحصول على أصل مالي معين. عندما يزداد الطلب، يكون المشترون مستعدين لدفع سعر أعلى، مما يؤدي إلى **ارتفاع السعر**.\n* **العرض (Supply):** يمثل كمية الأصل المالي المتاحة للبيع في السوق. عندما يزداد العرض، يتنافس البائعون لبيعه، مما يدفعهم لخفض السعر، وبالتالي يؤدي إلى **انخفاض السعر**.\n\n**السعر الذي نراه على الشاشة في أي لحظة هو نقطة التوازن اللحظية بين هذه القوى المتعارضة.** إنه يعكس اللحظة التي يتفق فيها المشترون والبائعون على قيمة معينة للأصل. وبالتالي، السعر هو نتيجة صراع مستمر وديناميكي بين قوتين فقط: المشترين (الطلب) والبائعين (العرض).`,
        steps: [
          "ابحث عن منطقة في الشارت يتحرك فيها السعر بشكل أفقي (توازن).",
          "ابحث عن منطقة ينطلق فيها السعر بقوة لأعلى أو لأسفل (خلل توازن).",
          "حاول ربط حركة السعر بتغير ميزان القوى بين المشترين والبائعين."
        ],
        example: "إذا أعلنت شركة هواتف عن أرباح قياسية، يزداد الطلب على سهمها بشكل كبير. ونظراً لمحدودية المعروض من الأسهم، يتسابق المشترون لعرض أسعار أعلى للحصول عليها، مما يرفع سعر السهم.",
        keyTakeaways: [
          "يتحكم ميزان العرض والطلب في تحديد أسعار الأصول المالية.",
          "زيادة الطلب تؤدي للارتفاع، وزيادة العرض تؤدي للانخفاض.",
          "السعر الحالي هو نقطة التوافق المؤقتة بين البائع والمشتري.",
          "حركة السعر تعبر عن فوز أحد الطرفين في الصراع المستمر."
        ],
        activeRecall: [
          "ما الذي يحدد سعر أي سلعة أو خدمة في الحياة اليومية؟",
          "هل تعتقد أن الأسواق المالية تعمل بنفس المبدأ؟"
        ],
        quiz: [
          { q: "ماذا يحدث لسعر الأصل المالي عندما يزيد الطلب عليه بشكل كبير؟", a: "يرتفع السعر لأن المشترين يتسابقون لدفع أسعار أعلى للحصول على الأصل." },
          { q: "ما هما القوتان الرئيسيتان اللتان تحركان السعر في الأسواق المالية؟", a: "قوة الطلب (المشترين) وقوة العرض (البائعين)." }
        ],
        feedbackLoop: "إذا واجهت صعوبة في ربط الأخبار بالعرض والطلب، أعد قراءة المفهوم وركز على نقطة التوازن اللحظية."
      }
    },
    {
      id: 3,
      diagram: 'market-participants',
      en: {
        title: "Who Moves the Price?",
        content: `While retail traders participate in the market, **large financial institutions** (such as investment banks, hedge funds, asset management firms) and **Market Makers** have the most significant impact on price movements.\n\nThis is due to the **massive volume of capital** they control. Their large orders create huge imbalances in supply and demand, leading to noticeable price trends. Therefore, **major market movements are not random**; they are driven by the decisions and flow of smart money.`,
        steps: [
          "Understand the difference between retail traders (small orders) and institutions (huge orders).",
          "Identify that institutions leave footprints (large candles, swept highs/lows) on the chart.",
          "Learn to follow institutional footprints rather than guessing direction."
        ],
        example: "A retail trader might trade with $1,000, while a major bank like JPMorgan trades with $500,000,000. The bank's entry creates an immediate, visible impulse on the chart.",
        keyTakeaways: [
          "Institutions and market makers are the primary price movers.",
          "Their influence comes from the massive volume and liquidity they command.",
          "Major price movements are logical and driven by institutional capital flow.",
          "The goal of a smart trader is to align with institutional direction."
        ],
        activeRecall: [
          "Do you think retail traders like you and me determine the market direction?",
          "Who do you think has the most power to move prices?"
        ],
        quiz: [
          { q: "Who are the key players with the largest impact on price movements?", a: "Large financial institutions (investment banks, hedge funds, asset managers) and Market Makers." },
          { q: "Are major market movements random or driven by specific factors?", a: "They are not random; they are driven by the flow of massive capital from large institutions (smart money)." }
        ],
        feedbackLoop: "If you missed this, remember to follow the footprints (large candles, structure breaks) left by institutional smart money."
      },
      ar: {
        title: "من يحرك السعر؟",
        content: `بينما يشارك المتداولون الأفراد في السوق، فإن **المؤسسات المالية الكبرى** (مثل البنوك الاستثمارية، صناديق التحوط، شركات إدارة الأصول) و**صناع السوق (Market Makers)** هم من يمتلكون التأثير الأكبر على حركة الأسعار.\n\nيرجع ذلك إلى **حجم السيولة الهائل** الذي يديرونه. أوامرهم الكبيرة يمكن أن تخلق اختلالات كبيرة في العرض والطلب، مما يؤدي إلى تحركات سعرية واضحة. لذلك، **الحركة الكبيرة في السوق ليست عشوائية**، بل غالباً ما تكون مدفوعة بقرارات وتدفقات مالية ضخمة من هذه الجهات.`,
        steps: [
          "افهم الفرق بين حجم تداول الأفراد وحجم تداول المؤسسات الضخمة.",
          "ابحث عن التحركات السعرية الحادة والمفاجئة التي تعكس دخول سيولة مؤسسية.",
          "تعلم كيف تراقب الشارت للبحث عن آثار صانع السوق (الشموع الاندفاعية الكبيرة)."
        ],
        example: "بينما يتداول الفرد بمبلغ 1,000 دولار، يدخل بنك مثل JPMorgan بصفقة حجمها 500 مليون دولار. دخول البنك يحدث تأثيراً فورياً ومباشراً يظهر على الشارت كشمعة ضخمة.",
        keyTakeaways: [
          "المؤسسات المالية الكبرى وصناع السوق هم المحرك الحقيقي للأسعار.",
          "حجم السيولة الضخم للمؤسسات يخلق اتجاهات السوق الرئيسية.",
          "الحركات الكبيرة في الشارت مدروسة ولها أسباب تتعلق بتدفق السيولة.",
          "وظيفة المتداول الناجح هي تتبع خطوات المال الذكي والتداول معه."
        ],
        activeRecall: [
          "هل تعتقد أن المتداولين الأفراد هم من يحددون اتجاه السوق؟",
          "من برأيك يمتلك القوة الأكبر لتحريك الأسعار بشكل ملحوظ؟"
        ],
        quiz: [
          { q: "من هم اللاعبون الرئيسيون الذين يمتلكون التأثير الأكبر على حركة الأسعار؟", a: "المؤسسات المالية الكبرى (مثل البنوك الاستثمارية وصناديق التحوط وشركات إدارة الأصول) وصناع السوق." },
          { q: "هل حركة السوق الكبيرة عشوائية أم مدفوعة بعوامل معينة؟", a: "ليست عشوائية، بل هي مدفوعة بتدفقات سيولة ضخمة وقرارات مدروسة من المؤسسات المالية وصناع السوق (المال الذكي)." }
        ],
        feedbackLoop: "إذا لم تتمكن من الإجابة بشكل صحيح، أعد قراءة المفهوم وركز على دور المؤسسات الكبرى وتتبع آثارها."
      }
    },
    {
      id: 4,
      diagram: 'price-imbalance',
      en: {
        title: "Why Does Price Rise and Fall?",
        content: `Price movement in financial markets is not random; it is the direct result of an **imbalance between supply and demand**.\n\n* **Demand > Supply:** When there are more buyers than sellers, price rises to find new sellers.\n* **Supply > Demand:** When there are more sellers than buyers, price falls to find new buyers.\n\nThis imbalance pushes the price to search for liquidity. When the imbalance is large and sustained, a new trend begins. The trend persists until a new level of balance (accumulation or distribution) is reached.`,
        steps: [
          "Identify rapid price expansions (impulsive moves) on the chart.",
          "Identify narrow consolidation phases where supply and demand are equal.",
          "Understand that the market cycles continuously from balance to imbalance and back."
        ],
        example: "During oil crises, supply drops suddenly while demand remains high. This sharp imbalance forces prices to skyrocket until demand slows or supply rises.",
        keyTakeaways: [
          "Price movement occurs due to imbalances between buying and selling forces.",
          "Increased buying pressure rises prices; increased selling pressure drops them.",
          "A new trend starts when the temporary horizontal equilibrium breaks.",
          "The market cycles between consolidation (balance) and expansion (imbalance)."
        ],
        activeRecall: [
          "Do you think price always moves randomly?",
          "What happens when there are many buyers and not enough sellers?"
        ],
        quiz: [
          { q: "What is the primary cause of price rising and falling?", a: "The imbalance between supply and demand (buyers overriding sellers or vice versa)." },
          { q: "When can we say a new trend has started?", a: "When the temporary horizontal equilibrium (consolidation) breaks and a sustained imbalance in favor of one side occurs." }
        ],
        feedbackLoop: "Remember that the market cycles continuously between range (balance) and trend (imbalance)."
      },
      ar: {
        title: "لماذا يرتفع السعر وينخفض؟",
        content: `حركة السعر في الأسواق المالية ليست عشوائية، بل هي نتيجة مباشرة لـ **اختلال التوازن بين العرض والطلب**.\n\n* **الطلب > العرض:** عندما يكون هناك مشترون أكثر من البائعين، يرتفع السعر للبحث عن بائعين جدد.\n* **العرض > الطلب:** عندما يكون هناك بائعون أكثر من المشترين، ينخفض السعر للبحث عن مشترين جدد.\n\nهذا الاختلال هو ما يدفع السعر للتحرك في اتجاه معين للبحث عن السيولة. عندما يصبح هذا الاختلال كبيراً ومستداماً، فإنه يؤدي إلى **بدء اتجاه جديد** (صاعد أو هابط). الفكرة الأساسية هي أن **الاتجاه يبدأ عندما ينكسر التوازن** بين المشترين والبائعين.`,
        steps: [
          "حدد فترات الاندفاع السعري السريع (Expansion) على الرسم البياني.",
          "حدد فترات التذبذب الضيق (Consolidation) حيث يتساوى العرض والطلب.",
          "افهم أن السوق يتحرك في دورة مستمرة من التوازن إلى الاختلال ثم العودة للتوازن."
        ],
        example: "في أوقات أزمات النفط، ينخفض المعروض فجأة مع بقاء الطلب مرتفعاً. هذا الاختلال الحاد يجبر الأسعار على الارتفاع الصاروخي حتى يقل الطلب أو يزيد العرض.",
        keyTakeaways: [
          "حركة السعر تحدث نتيجة لعدم التوازن بين قوى الشراء وقوى البيع.",
          "تزايد قوى الشراء يرفع السعر، وتزايد قوى البيع يخفض السعر.",
          "يبدأ الاتجاه الجديد عندما ينكسر التوازن الأفقي المؤقت في السوق.",
          "ينتقل السوق باستمرار بين مرحلتين: التذبذب (التوازن) والاتجاه (الاختلال)."
        ],
        activeRecall: [
          "هل تعتقد أن السعر يتحرك دائماً بشكل عشوائي؟",
          "ماذا يحدث عندما يكون هناك عدد كبير جداً من المشترين ولا يوجد ما يكفي من البائعين؟"
        ],
        quiz: [
          { q: "ما هو السبب الرئيسي وراء حركة السعر (ارتفاعه وانخفاضه)؟", a: "اختلال التوازن بين العرض والطلب (تفوق قوى الشراء على البيع أو العكس)." },
          { q: "متى يمكن القول بأن اتجاهاً جديداً قد بدأ في السوق؟", a: "عندما ينكسر التوازن الأفقي المؤقت (التذبذب) ويحدث اختلال كبير ومستدام لصالح أحد الطرفين." }
        ],
        feedbackLoop: "إذا لم تتمكن من ربط حركة السعر باختلال التوازن، أعد قراءة المفهوم وركز على انتقال السوق من التوازن إلى الاختلال."
      }
    },
    {
      id: 5,
      diagram: 'market-types',
      en: {
        title: "Types of Markets",
        content: `There are various financial markets where trading takes place. While they trade different assets, they all operate under the same principles of supply and demand:\n\n* **Forex (Foreign Exchange):** The global currency market, trading pairs like EUR/USD. It is the largest and most liquid market.\n* **Cryptocurrencies:** Digital assets operating on blockchain, such as Bitcoin (BTC) and Ethereum (ETH).\n* **Stocks:** Buying shares representing fractional ownership in public companies like Apple or Tesla.\n* **Commodities:** Physical goods like Gold, Silver, Crude Oil, and agricultural products.`,
        steps: [
          "Explore the list of symbols on your trading platform.",
          "Identify currency pairs, stock symbols, and commodity tickers.",
          "Compare the daily trading hours: Forex is 24/5, Crypto is 24/7, Stocks have session hours."
        ],
        example: "If you trade EUR/USD, you are in the Forex market. If you trade Bitcoin, you are in the Crypto market. If you trade Gold, you are in the Commodities market.",
        keyTakeaways: [
          "Financial markets vary by the type of asset traded.",
          "Forex, Crypto, Stocks, and Commodities are the major trading markets.",
          "All markets share the same core price delivery mechanics (Supply/Demand).",
          "Each market has its own characteristics, hours, and volatility profiles."
        ],
        activeRecall: [
          "Do you think all financial markets work the same way?",
          "Name a few types of financial markets you know."
        ],
        quiz: [
          { q: "Name three different types of financial markets.", a: "Forex (currencies), Stocks, Cryptocurrencies, and Commodities." },
          { q: "Do the core principles of price movement differ between these markets? Why?", a: "No, they all follow the same supply/demand and imbalance principles; only the traded assets and session hours differ." }
        ],
        feedbackLoop: "Recall that technical analysis works across all these markets because human psychology and supply/demand govern them all."
      },
      ar: {
        title: "أنواع الأسواق",
        content: `توجد أنواع مختلفة من الأسواق المالية، وكل منها يتعامل مع أصول مختلفة، ولكنها جميعاً تشترك في المبدأ الأساسي الذي يحكمها وهو **العرض والطلب**:\n\n* **الفوركس (Forex):** سوق تداول العملات الأجنبية (مثل EUR/USD)، وهو الأكبر والأكثر سيولة في العالم.\n* **العملات الرقمية (Cryptocurrencies):** سوق الأصول الرقمية اللامركزية مثل البيتكوين والإيثيريوم.\n* **الأسهم (Stocks):** سوق تداول حصص ملكية في الشركات المساهمة العامة (مثل Apple أو Tesla).\n* **السلع (Commodities):** سوق تداول المواد الخام والمعادن كالذهب والنفط والغاز الطبيعي.\n\n**المبادئ التي تحرك الأسعار (العرض والطلب، اختلال التوازن) واحدة في كل هذه الأسواق، وإن اختلفت تفاصيل الأصول المتداولة.**`,
        steps: [
          "تصفح قائمة الأصول المتاحة في منصتك وتعرف على تصنيفاتها.",
          "لاحظ الفروقات في أوقات عمل الأسواق: الكريبتو 24/7، الفوركس 24/5، الأسهم لها جلسات يومية محددة.",
          "قارن بين حركة عملة رقمية وحركة زوج عملات لتلاحظ فرق السيولة والتذبذب."
        ],
        example: "عندما تشتري اليورو مقابل الدولار فأنت تتداول في سوق الفوركس. وعندما تشتري البيتكوين فأنت في سوق الكريبتو. وعندما تشتري الذهب فأنت في سوق السلع.",
        keyTakeaways: [
          "تتنوع الأسواق المالية حسب نوع الأصل المالي المتداول فيه.",
          "أهم الأسواق هي: العملات الأجنبية، العملات الرقمية، الأسهم، والسلع.",
          "جميع الأسواق تخضع لنفس منطق حركة السعر ولا تختلف إلا في التفاصيل.",
          "لكل سوق خصوصية في أوقات التداول وحجم السيولة ومستويات المخاطرة."
        ],
        activeRecall: [
          "هل تعتقد أن جميع الأسواق المالية تعمل بنفس الطريقة؟",
          "اذكر بعض أنواع الأسواق المالية التي تعرفها."
        ],
        quiz: [
          { q: "اذكر ثلاثة أنواع مختلفة من الأسواق المالية.", a: "سوق الفوركس (العملات)، سوق الأسهم، سوق العملات الرقمية (الكريبتو)، وسوق السلع." },
          { q: "هل تختلف المبادئ الأساسية التي تحرك الأسعار بين هذه الأسواق؟ ولماذا؟", a: "لا، تظل المبادئ واحدة وهي قوى العرض والطلب واختلال التوازن، وإن اختلفت تفاصيل الأصول المتداولة وأوقات العمل." }
        ],
        feedbackLoop: "إذا لم تتمكن من تحديد الأسواق أو فهم وحدة مبادئها، أعد قراءة كتلة المفهوم وركز على العرض والطلب كعامل مشترك."
      }
    },
    {
      id: 6,
      diagram: 'order-types',
      en: {
        title: "Types of Orders",
        content: `Orders are the instructions you send to your broker to execute trades. Understanding them is crucial for entry and exit precision:\n\n* **Market Order:** An order to buy or sell immediately at the best available current market price. Guarantees execution but not the exact price.\n* **Limit Order:** An order to buy or sell at a specific price or better. Guarantees the price but not the execution.\n* **Stop Order (Stop Loss / Stop Entry):** Triggers a market order once a specific price level is hit. A **Stop Loss (SL)** is a protective stop order that automatically closes a losing trade to protect your capital.`,
        steps: [
          "Open the trading panel in your demo account and study options.",
          "Differentiate between instant execution (market) and pending orders (limit/stop).",
          "Place a mock trade and specify Stop Loss and Take Profit levels."
        ],
        example: "Current price of EUR/USD is 1.0850. To buy instantly, use a Market Order. If you want to buy only if the price drops to 1.0800, place a Limit Order (Buy Limit).",
        keyTakeaways: [
          "Orders are the tools a trader uses to control trade entry and exit.",
          "Market orders guarantee speed; pending orders guarantee price precision.",
          "Stop Loss (SL) is absolutely mandatory to prevent account blowouts.",
          "The interaction of these orders in order books is what forms candlesticks."
        ],
        activeRecall: [
          "How do traders tell the market they want to buy or sell?",
          "Do all buying and selling transactions happen immediately?"
        ],
        quiz: [
          { q: "Which order type guarantees immediate execution but not the price?", a: "Market Order." },
          { q: "If you want to buy an asset only at a specific price or lower, which order type do you use?", a: "Limit Order (specifically a Buy Limit)." }
        ],
        feedbackLoop: "Make sure you understand the difference between immediate market orders and pending limit/stop orders, and the absolute necessity of a Stop Loss."
      },
      ar: {
        title: "أنواع الأوامر",
        content: `الأوامر هي الوسيلة التي يتفاعل بها المتداولون مع السوق لتنفيذ عمليات الشراء والبيع. فهم أنواع الأوامر ضروري للتحكم في كيفية دخولك وخروجك من الصفقات. الأنواع الرئيسية للأوامر هي:\n\n* **أمر السوق (Market Order):** يتم تنفيذه فوراً بأفضل سعر متاح في السوق. السرعة هي الأهم هنا، ولكن قد لا يكون السعر هو الأفضل.\n* **الأمر المحدد (Limit Order):** يتم وضعه لشراء أو بيع أصل بسعر محدد أو أفضل. لا يتم تنفيذه إلا إذا وصل السعر إلى المستوى المطلوب، مما يضمن سعراً أفضل ولكن لا يضمن التنفيذ.\n* **أمر إيقاف الخسارة / الدخول (Stop Order):** يتم تفعيله ليصبح أمر سوق عندما يصل السعر إلى مستوى معين. مثلاً، أمر إيقاف الخسارة (Stop Loss) هو أمر حماية يغلق الصفقة تلقائياً للحد من الخسائر لحماية رأس مالك.`,
        steps: [
          "افتح نافذة الصفقات في حسابك التجريبي وتعرف على الخيارات المتاحة.",
          "لاحظ الفرق بين 'التنفيذ الفوري' (أمر السوق) و'الأمر المعلق' (الأمر المحدد/الإيقاف).",
          "جرب وضع صفقة تجريبية وحدد مستويات إيقاف الخسارة (Stop Loss) وجني الأرباح (Take Profit)."
        ],
        example: "سعر EUR/USD الحالي هو 1.0850. إذا أردت الشراء فوراً تستخدم أمر السوق. وإذا أردت الشراء فقط إذا هبط السعر إلى 1.0800، تضع أمر شراء محدد (Buy Limit).",
        keyTakeaways: [
          "الأوامر هي أدوات تحكم المتداول في طريقة دخول وخروج صفقاته.",
          "أمر السوق يضمن سرعة التنفيذ، بينما الأمر المعلق يضمن دقة سعر الدخول.",
          "أمر إيقاف الخسارة (Stop Loss) ضروري جداً لحماية الحساب من المرجنة.",
          "تفاعل الأوامر المختلفة في دفاتر الطلبات هو ما يصنع الشموع وحركتها."
        ],
        activeRecall: [
          "كيف يخبر المتداولون السوق برغبتهم في الشراء أو البيع?",
          "هل جميع عمليات الشراء والبيع تحدث فوراً؟"
        ],
        quiz: [
          { q: "ما هو نوع الأمر الذي يضمن التنفيذ الفوري ولكنه لا يضمن أفضل سعر؟", a: "أمر السوق (Market Order)." },
          { q: "إذا أردت شراء أصل بسعر معين أو أقل، فما هو نوع الأمر الذي ستستخدمه؟", a: "الأمر المحدد (Limit Order - وتحديداً Buy Limit)." }
        ],
        feedbackLoop: "إذا لم تتمكن من التمييز بين أنواع الأوامر، أعد قراءة المفهوم وركز على دور الأوامر المعلقة وإيقاف الخسارة."
      }
    },
    {
      id: 7,
      diagram: 'platform-mockup',
      en: {
        title: "Trading Platforms",
        content: `A trading platform is the software gateway connecting you to financial markets. It displays charts, tracks asset prices, and executes your orders:\n\n* **TradingView:** The ultimate platform for chart analysis, backtesting, and technical tools. Highly recommended for analysis.\n* **MetaTrader 4 / 5 (MT4/MT5):** The industry standard software for executing orders, connecting directly to brokers, and managing positions.\n\n**Remember: The platform is just a tool. Mastering the tool is important, but your trading edge comes from your analysis, strategy, and risk discipline.**`,
        steps: [
          "Create a free account on TradingView.com.",
          "Search for a symbol like 'EURUSD' or 'BTCUSD' and open the full-featured chart.",
          "Practice switching timeframes (1m, 15m, 1H, 4H, Daily) and using drawing tools."
        ],
        example: "You use TradingView to draw support levels and analyze the trend, then you open MetaTrader on your phone to click 'BUY' and place the order with your broker.",
        keyTakeaways: [
          "Trading platforms are the software interfaces used to interact with markets.",
          "TradingView is best for charting; MetaTrader is widely used for order execution.",
          "A platform does not make trading decisions for you; it only executes them.",
          "Mastering chart navigation and timeframe analysis is key to technical analysis."
        ],
        activeRecall: [
          "Where do traders execute their trades?",
          "Have you heard of any software or apps used for trading?"
        ],
        quiz: [
          { q: "What is the primary function of a trading platform?", a: "To connect to the market, display charts, execute orders, and manage trades." },
          { q: "Does the platform itself guarantee success? Why?", a: "No, the platform is just an execution and analysis tool. Success depends on strategy, risk management, and discipline." }
        ],
        feedbackLoop: "Differentiate clearly between analysis platforms (TradingView) and execution platforms (MetaTrader) and how they fit into your trading process."
      },
      ar: {
        title: "منصات التداول",
        content: `منصة التداول هي البرنامج أو التطبيق الذي تستخدمه للاتصال بالسوق، عرض الرسوم البيانية (الشارت)، تنفيذ الأوامر، وإدارة صفقاتك. إنها بوابتك إلى الأسواق المالية:\n\n* **TradingView:** منصة قوية جداً ومتقدمة للتحليل الفني، رسم الشارت، وتتبع جميع الأسواق العالمية.\n* **MetaTrader 4 / 5 (MT4/MT5):** المنصة الأكثر استخداماً لتنفيذ الصفقات الفورية وإدارة المحفظة وربط الحساب بشركة الوساطة.\n\n**الفكرة الأساسية هي أن المنصة هي مجرد أداة. إتقان استخدام الأداة مهم، ولكن الأهم هو الاستراتيجية والتحليل الذي تقوم به باستخدامها.**`,
        steps: [
          "قم بإنشاء حساب مجاني على موقع TradingView وافتح الرسم البياني لأي أصل.",
          "تعرف على شريط الأدوات الجانبي (أدوات الرسم كخطوط الاتجاه والأشكال).",
          "جرب التنقل بين الأطر الزمنية المختلفة (يومي، 4 ساعات، ساعة، 15 دقيقة) وتأمل تغير شكل الحركة."
        ],
        example: "تستخدم منصة TradingView لرسم خطوط الاتجاه ومراقبة حركة السعر، ثم تستخدم تطبيق MetaTrader على هاتفك للضغط على زر الشراء وتحديد الوقف والهدف.",
        keyTakeaways: [
          "المنصة هي البرنامج الذي يربط المتداول بالسوق ويعرض البيانات السعرية.",
          "تعد TradingView الأفضل للتحليل بينما تعد MetaTrader الأفضل للتنفيذ.",
          "المنصة أداة تنفيذية فقط ولا تضمن الربح بل يضمنه التزامك بالخطة والتحليل.",
          "التعرف على واجهة المنصة وإتقان الرسم عليها يسهل العملية التحليلية بشكل كبير."
        ],
        activeRecall: [
          "أين يقوم المتداولون بتنفيذ صفقاتهم؟",
          "هل سمعت عن أي برامج أو تطبيقات تستخدم للتداول؟"
        ],
        quiz: [
          { q: "ما هي الوظيفة الأساسية لمنصة التداول؟", a: "الاتصال بالسوق، عرض الرسوم البيانية (الشارت)، تنفيذ الأوامر، وإدارة الصفقات." },
          { q: "هل المنصة بحد ذاتها تضمن لك النجاح في التداول؟ ولماذا؟", a: "لا، المنصة مجرد أداة. النجاح يأتي من الاستراتيجية وإدارة المخاطر والالتزام الذاتي للمتداول." }
        ],
        feedbackLoop: "إذا واجهت صعوبة في فهم دور المنصة، ركز على التفريق بين أداة التحليل وأداة التنفيذ وكيف يتكاملان."
      }
    },
    {
      id: 8,
      diagram: 'candlestick-intro',
      en: {
        title: "Introduction to Japanese Candlesticks",
        content: `Japanese Candlesticks are the visual language of price charts. Each candle tells a story about the battle between buyers and sellers over a specific timeframe (e.g., 1 hour, 1 day):\n\n* **The Body:** The solid colored part representing the distance between the Open and Close price.\n  * **Bullish Candle (Green/White):** Close is higher than Open (Buyers won).\n  * **Bearish Candle (Red/Black):** Close is lower than Open (Sellers won).\n* **The Wicks (Shadows):** The thin lines projecting from the top and bottom. They represent the High (maximum price reached) and Low (minimum price reached) during that period.`,
        steps: [
          "Open any chart and zoom in to look at individual candles.",
          "Locate a bullish candle and identify its Open, Close, High, and Low.",
          "Locate a bearish candle and identify the same four price levels."
        ],
        example: "A daily candle for EUR/USD opens at 1.0800, climbs to a high of 1.0900, drops to a low of 1.0780, and closes at 1.0880. Because it closed higher than it opened, it forms a green (bullish) candle with wicks on both sides.",
        keyTakeaways: [
          "Candlesticks are the standard method for representing price action.",
          "Every candle displays four prices: Open, High, Low, and Close (OHLC).",
          "Candle color represents the market bias (Green = Bullish, Red = Bearish).",
          "Long wicks indicate price rejection and potential reversals."
        ],
        activeRecall: [
          "How do traders read price action on a screen?",
          "Have you seen charts with green and red bars? What do you think they mean?"
        ],
        quiz: [
          { q: "What does the body of a Japanese candlestick represent?", a: "The distance between the open price and close price over a specific timeframe." },
          { q: "If the close price is higher than the open price, what type of candle forms?", a: "A bullish (upward) candle, typically colored green or white." }
        ],
        feedbackLoop: "Study the anatomy (open, close, high, low, wicks) carefully, as it is the basic alphabet of all price charts."
      },
      ar: {
        title: "الشموع اليابانية (مقدمة)",
        content: `الشموع اليابانية هي اللغة المرئية لشارت الأسعار. كل شمعة تحكي قصة الصراع بين المشترين والبائعين خلال فترة زمنية معينة (مثل ساعة أو يوم):\n\n* **الجسم (Body):** الجزء العريض الملون، ويمثل المسافة بين سعري الافتتاح والإغلاق.\n  * **شمعة صاعدة (غالباً خضراء):** سعر الإغلاق أعلى من سعر الافتتاح (المشترون سيطروا).\n  * **شمعة هابطة (غالباً حمراء):** سعر الإغلاق أقل من سعر الافتتاح (البائعون سيطروا).\n* **الذيول/الظلال (Wicks/Shadows):** الخطوط الرفيعة أعلى وأسفل الجسم، وتمثل أعلى سعر وأدنى سعر وصل إليه الأصل خلال تلك الفترة الزمنية.\n\n**شكل الشمعة يعطيك دليلاً مباشراً على من كان مسيطراً على السوق.**`,
        steps: [
          "افتح شارت عملات وقم بتكبير الشموع لتأمل تفاصيلها الفردية.",
          "اختر شمعة خضراء وحدد مستويات الافتتاح والإغلاق وأعلى ذيل وأدنى ذيل.",
          "اختر شمعة حمراء ولاحظ كيف ينعكس مكان الافتتاح والإغلاق مقارنة بالخضراء."
        ],
        example: "شمعة يومية لزوج EUR/USD تفتتح عند 1.0800، وترتفع لأعلى مستوى عند 1.0900، وتهبط لأدنى مستوى عند 1.0780، وتغلق عند 1.0880. بما أن الإغلاق أعلى من الافتتاح، ستظهر الشمعة بلون أخضر مع ذيول في الطرفين.",
        keyTakeaways: [
          "الشموع اليابانية هي الأداة القياسية لعرض تفاصيل حركة السعر.",
          "توفر كل شمعة أربع معلومات رئيسية: سعر الافتتاح، الإغلاق، الأعلى، والأدنى.",
          "لون جسم الشمعة يوضح نتيجة الصراع (أخضر = صعود، أحمر = هبوط).",
          "الذيول الطويلة تعبر عن رفض السعر عند تلك المستويات واحتمال انعكاس الاتجاه."
        ],
        activeRecall: [
          "كيف يقرأ المتداولون حركة السعر على الشاشة؟",
          "هل رأيت من قبل رسوماً بيانية تحتوي على أعمدة خضراء وحمراء؟ ماذا تعني برأيك؟"
        ],
        quiz: [
          { q: "ماذا يمثل جسم الشمعة اليابانية؟", a: "يمثل المسافة بين سعري الافتتاح والإغلاق خلال فترة زمنية محددة." },
          { q: "إذا كان سعر الإغلاق أعلى من سعر الافتتاح، فما نوع الشمعة التي ستتشكل؟", a: "شمعة صاعدة (Bullish Candle) وتكون عادة خضراء أو بيضاء." }
        ],
        feedbackLoop: "إذا لم تتمكن من تحديد أجزاء الشمعة أو فهم دلالتها، ركز على الشمعة كصراع بين المشترين والبائعين والافتتاح/الإغلاق."
      }
    }
  ],
  classical: [
    {
      id: 1,
      diagram: 'trend',
      en: {
        title: "What is Technical Analysis?",
        content: `Technical analysis is the study of historical price movements to predict future price direction. Unlike fundamental analysis, which looks at economic data and company financials, technical analysis focuses purely on price charts and patterns.

The core principle is that all known information is already reflected in the price. This means that by studying price charts, you can identify patterns that tend to repeat over time.

Technical analysts use various tools including trend lines, support and resistance levels, chart patterns, and indicators to make trading decisions.`,
        steps: [
          "Open a price chart on any trading platform",
          "Observe how price moves in waves — up, down, and sideways",
          "Notice that prices tend to bounce off certain levels repeatedly",
          "Understand that patterns from the past often repeat in the future",
          "Start identifying basic trends: uptrend, downtrend, and sideways"
        ],
        example: "Look at any currency pair like EUR/USD on a daily chart. You'll notice the price doesn't move in a straight line — it creates peaks and valleys. These movements form patterns that traders use to predict where price might go next.",
        keyTakeaways: [
          "Technical analysis studies price charts to predict future movements",
          "All market information is reflected in the price",
          "Price patterns tend to repeat over time",
          "It works on all markets: Forex, Crypto, Stocks"
        ]
      },
      ar: {
        title: "ما هو التحليل الفني؟",
        content: `التحليل الفني هو دراسة حركة الأسعار التاريخية للتنبؤ باتجاه السعر المستقبلي. على عكس التحليل الأساسي الذي ينظر إلى البيانات الاقتصادية، يركز التحليل الفني بشكل كامل على الرسوم البيانية وأنماط الأسعار.

المبدأ الأساسي هو أن جميع المعلومات المعروفة تنعكس بالفعل في السعر. هذا يعني أنه من خلال دراسة الرسوم البيانية، يمكنك تحديد أنماط تميل إلى التكرار مع مرور الوقت.

يستخدم المحللون الفنيون أدوات متنوعة تشمل خطوط الاتجاه، مستويات الدعم والمقاومة، أنماط الرسوم البيانية، والمؤشرات لاتخاذ قرارات التداول.`,
        steps: [
          "افتح رسماً بيانياً للسعر على أي منصة تداول",
          "لاحظ كيف يتحرك السعر في موجات — صعوداً وهبوطاً وجانبياً",
          "لاحظ أن الأسعار تميل إلى الارتداد من مستويات معينة بشكل متكرر",
          "افهم أن الأنماط من الماضي غالباً ما تتكرر في المستقبل",
          "ابدأ في تحديد الاتجاهات الأساسية: صاعد، هابط، وجانبي"
        ],
        example: "انظر إلى أي زوج عملات مثل EUR/USD على الرسم البياني اليومي. ستلاحظ أن السعر لا يتحرك في خط مستقيم — بل يخلق قمماً وقيعاناً. هذه الحركات تشكل أنماطاً يستخدمها المتداولون للتنبؤ بالاتجاه القادم.",
        keyTakeaways: [
          "التحليل الفني يدرس الرسوم البيانية للتنبؤ بالحركات المستقبلية",
          "جميع معلومات السوق تنعكس في السعر",
          "أنماط الأسعار تميل إلى التكرار مع مرور الوقت",
          "يعمل على جميع الأسواق: فوركس، كريبتو، أسهم"
        ]
      },
      fr: {
        title: "Qu'est-ce que l'Analyse Technique?",
        content: `L'analyse technique est l'étude des mouvements de prix historiques pour prédire la direction future des prix. Elle se concentre sur les graphiques et les patterns de prix.

Le principe fondamental est que toutes les informations connues sont déjà reflétées dans le prix. En étudiant les graphiques, vous pouvez identifier des patterns qui tendent à se répéter.`,
        steps: ["Ouvrez un graphique de prix", "Observez les mouvements en vagues", "Identifiez les niveaux de rebond", "Comprenez la répétition des patterns", "Identifiez les tendances de base"],
        example: "Regardez EUR/USD sur un graphique journalier pour observer les patterns de prix.",
        keyTakeaways: ["L'analyse technique étudie les graphiques", "L'information est dans le prix", "Les patterns se répètent", "Fonctionne sur tous les marchés"]
      },
      es: {
        title: "¿Qué es el Análisis Técnico?",
        content: `El análisis técnico es el estudio de los movimientos históricos de precios para predecir la dirección futura. Se enfoca en gráficos y patrones de precios.

El principio fundamental es que toda la información conocida ya está reflejada en el precio.`,
        steps: ["Abre un gráfico de precios", "Observa los movimientos en ondas", "Identifica niveles de rebote", "Comprende la repetición de patrones", "Identifica tendencias básicas"],
        example: "Mira EUR/USD en un gráfico diario para observar patrones de precios.",
        keyTakeaways: ["El análisis técnico estudia gráficos", "La información está en el precio", "Los patrones se repiten", "Funciona en todos los mercados"]
      }
    },
    {
      id: 2, diagram: 'trend',
      en: { title: "Market Trends", content: "A market trend is the general direction in which the price of an asset is moving. There are three types of trends:\n\n**Uptrend (Bullish):** Price makes higher highs and higher lows. Each peak is higher than the previous one.\n\n**Downtrend (Bearish):** Price makes lower highs and lower lows. Each valley is lower than the previous one.\n\n**Sideways (Range):** Price moves between a defined upper and lower boundary without a clear direction.\n\nIdentifying the trend is the first and most important step in technical analysis. The famous saying 'the trend is your friend' means you should trade in the direction of the prevailing trend.", steps: ["Open a chart and zoom out to see the bigger picture", "Look for a series of higher highs and higher lows (uptrend)", "Or lower highs and lower lows (downtrend)", "Draw a line connecting the lows in an uptrend", "Draw a line connecting the highs in a downtrend"], example: "On a 4-hour EUR/USD chart, if you see price making higher highs at 1.1050, 1.1100, 1.1150, and higher lows at 1.1000, 1.1030, 1.1060 — this is a clear uptrend. You should look for buying opportunities.", keyTakeaways: ["Three types: Uptrend, Downtrend, Sideways", "Uptrend = Higher Highs + Higher Lows", "Downtrend = Lower Highs + Lower Lows", "Always trade with the trend"] },
      ar: { title: "اتجاهات السوق", content: "اتجاه السوق هو الاتجاه العام الذي يتحرك فيه سعر الأصل. هناك ثلاثة أنواع:\n\n**الاتجاه الصاعد:** السعر يصنع قمماً أعلى وقيعاناً أعلى.\n\n**الاتجاه الهابط:** السعر يصنع قمماً أدنى وقيعاناً أدنى.\n\n**الاتجاه الجانبي:** السعر يتحرك بين حدود علوية وسفلية محددة.\n\nتحديد الاتجاه هو الخطوة الأولى والأهم في التحليل الفني.", steps: ["افتح الرسم البياني وابتعد لرؤية الصورة الكبيرة", "ابحث عن سلسلة من القمم الأعلى والقيعان الأعلى", "أو القمم الأدنى والقيعان الأدنى", "ارسم خطاً يربط القيعان في الاتجاه الصاعد", "ارسم خطاً يربط القمم في الاتجاه الهابط"], example: "على رسم EUR/USD بإطار 4 ساعات، إذا رأيت السعر يصنع قمماً أعلى عند 1.1050، 1.1100، 1.1150 وقيعاناً أعلى — هذا اتجاه صاعد واضح.", keyTakeaways: ["ثلاثة أنواع: صاعد، هابط، جانبي", "صاعد = قمم أعلى + قيعان أعلى", "هابط = قمم أدنى + قيعان أدنى", "تداول دائماً مع الاتجاه"] },
      fr: { title: "Les Tendances du Marché", content: "Une tendance est la direction générale du prix. Il y a trois types: haussière, baissière et latérale.", steps: ["Ouvrez un graphique", "Identifiez les sommets et creux", "Déterminez la direction", "Tracez les lignes de tendance", "Tradez dans la direction de la tendance"], example: "Sur EUR/USD H4, des sommets et creux de plus en plus hauts indiquent une tendance haussière.", keyTakeaways: ["Trois types de tendances", "Haussière = sommets et creux plus hauts", "Baissière = sommets et creux plus bas", "Tradez avec la tendance"] },
      es: { title: "Tendencias del Mercado", content: "Una tendencia es la dirección general del precio. Hay tres tipos: alcista, bajista y lateral.", steps: ["Abre un gráfico", "Identifica máximos y mínimos", "Determina la dirección", "Traza líneas de tendencia", "Opera en la dirección de la tendencia"], example: "En EUR/USD H4, máximos y mínimos cada vez más altos indican tendencia alcista.", keyTakeaways: ["Tres tipos de tendencias", "Alcista = máximos y mínimos más altos", "Bajista = máximos y mínimos más bajos", "Opera con la tendencia"] }
    },
    {
      id: 3, diagram: 'support-resistance',
      en: { title: "Support and Resistance", content: "Support and resistance are the most fundamental concepts in technical analysis.\n\n**Support** is a price level where buying pressure is strong enough to prevent the price from falling further. Think of it as a floor.\n\n**Resistance** is a price level where selling pressure is strong enough to prevent the price from rising further. Think of it as a ceiling.\n\nThese levels form because traders remember past price levels and tend to buy or sell at those same levels again. The more times a level is tested, the stronger it becomes.", steps: ["Identify areas where price has bounced up multiple times (support)", "Identify areas where price has been rejected down multiple times (resistance)", "Draw horizontal lines at these levels", "Watch for price reactions when it approaches these levels", "Use these levels to plan your entries and exits"], example: "If EUR/USD keeps bouncing off 1.0800 and getting rejected at 1.0900, then 1.0800 is support and 1.0900 is resistance. You could buy near 1.0800 with a stop below it, or sell near 1.0900 with a stop above it.", keyTakeaways: ["Support = price floor where buyers step in", "Resistance = price ceiling where sellers step in", "The more times tested, the stronger the level", "When support breaks, it becomes resistance and vice versa"] },
      ar: { title: "الدعم والمقاومة", content: "الدعم والمقاومة هما أهم مفاهيم التحليل الفني.\n\n**الدعم** هو مستوى سعري يكون فيه ضغط الشراء قوياً بما يكفي لمنع السعر من الهبوط أكثر. فكر فيه كأرضية.\n\n**المقاومة** هي مستوى سعري يكون فيه ضغط البيع قوياً بما يكفي لمنع السعر من الصعود أكثر. فكر فيها كسقف.\n\nتتشكل هذه المستويات لأن المتداولين يتذكرون مستويات الأسعار السابقة.", steps: ["حدد المناطق التي ارتد منها السعر للأعلى عدة مرات (دعم)", "حدد المناطق التي رُفض فيها السعر للأسفل عدة مرات (مقاومة)", "ارسم خطوطاً أفقية عند هذه المستويات", "راقب ردود فعل السعر عند اقترابه من هذه المستويات", "استخدم هذه المستويات لتخطيط دخولك وخروجك"], example: "إذا كان EUR/USD يرتد باستمرار من 1.0800 ويُرفض عند 1.0900، فإن 1.0800 هو دعم و1.0900 هو مقاومة.", keyTakeaways: ["الدعم = أرضية سعرية يتدخل فيها المشترون", "المقاومة = سقف سعري يتدخل فيه البائعون", "كلما تم اختبار المستوى أكثر، أصبح أقوى", "عندما يُكسر الدعم يصبح مقاومة والعكس"] },
      fr: { title: "Support et Résistance", content: "Le support est un niveau où les acheteurs empêchent le prix de baisser. La résistance est un niveau où les vendeurs empêchent le prix de monter.", steps: ["Identifiez les rebonds (support)", "Identifiez les rejets (résistance)", "Tracez des lignes horizontales", "Observez les réactions du prix", "Planifiez vos entrées et sorties"], example: "Si EUR/USD rebondit sur 1.0800 et est rejeté à 1.0900, ce sont vos niveaux clés.", keyTakeaways: ["Support = plancher de prix", "Résistance = plafond de prix", "Plus testé = plus fort", "Support cassé devient résistance"] },
      es: { title: "Soporte y Resistencia", content: "El soporte es un nivel donde los compradores impiden que el precio baje más. La resistencia es donde los vendedores impiden que suba más.", steps: ["Identifica rebotes (soporte)", "Identifica rechazos (resistencia)", "Traza líneas horizontales", "Observa reacciones del precio", "Planifica entradas y salidas"], example: "Si EUR/USD rebota en 1.0800 y es rechazado en 1.0900, esos son tus niveles clave.", keyTakeaways: ["Soporte = piso de precio", "Resistencia = techo de precio", "Más probado = más fuerte", "Soporte roto se vuelve resistencia"] }
    },
    {
      id: 4, diagram: 'trendlines',
      en: { title: "Trendlines", content: "A trendline is a diagonal line drawn on a chart that connects two or more price points. It serves as a dynamic support or resistance level.\n\n**Uptrend line:** Connect two or more higher lows. Price tends to bounce off this line.\n\n**Downtrend line:** Connect two or more lower highs. Price tends to get rejected at this line.\n\nTrendlines help you visualize the trend and find potential entry points. A break of a trendline can signal a trend reversal.", steps: ["In an uptrend, connect at least 2 swing lows with a line", "In a downtrend, connect at least 2 swing highs with a line", "Extend the line forward to project future support/resistance", "Look for price to bounce off the trendline for entries", "Watch for a break of the trendline as a reversal signal"], example: "Draw a line connecting the lows at 1.0800 and 1.0850 in an uptrend. When price comes back to touch this line at 1.0900, it's a potential buying opportunity.", keyTakeaways: ["Trendlines connect swing points", "Uptrend line = dynamic support", "Downtrend line = dynamic resistance", "A break of trendline may signal reversal"] },
      ar: { title: "خطوط الاتجاه", content: "خط الاتجاه هو خط مائل يُرسم على الرسم البياني يربط بين نقطتين سعريتين أو أكثر. يعمل كمستوى دعم أو مقاومة ديناميكي.\n\n**خط الاتجاه الصاعد:** يربط قاعين أو أكثر. السعر يميل للارتداد من هذا الخط.\n\n**خط الاتجاه الهابط:** يربط قمتين أو أكثر. السعر يميل للرفض عند هذا الخط.", steps: ["في اتجاه صاعد، اربط قاعين على الأقل بخط", "في اتجاه هابط، اربط قمتين على الأقل بخط", "مدّ الخط للأمام لتوقع الدعم/المقاومة المستقبلية", "ابحث عن ارتداد السعر من خط الاتجاه للدخول", "راقب كسر خط الاتجاه كإشارة انعكاس"], example: "ارسم خطاً يربط القيعان عند 1.0800 و1.0850. عندما يعود السعر لملامسة هذا الخط عند 1.0900، فهذه فرصة شراء محتملة.", keyTakeaways: ["خطوط الاتجاه تربط نقاط التأرجح", "خط الاتجاه الصاعد = دعم ديناميكي", "خط الاتجاه الهابط = مقاومة ديناميكية", "كسر خط الاتجاه قد يشير لانعكاس"] },
      fr: { title: "Lignes de Tendance", content: "Une ligne de tendance est une ligne diagonale reliant deux points de prix ou plus, servant de support ou résistance dynamique.", steps: ["Reliez les creux dans une tendance haussière", "Reliez les sommets dans une tendance baissière", "Prolongez la ligne", "Cherchez les rebonds", "Surveillez les cassures"], example: "Tracez une ligne reliant les creux à 1.0800 et 1.0850 pour identifier les entrées.", keyTakeaways: ["Les lignes relient les points de swing", "Ligne haussière = support dynamique", "Ligne baissière = résistance dynamique", "Cassure = signal de retournement"] },
      es: { title: "Líneas de Tendencia", content: "Una línea de tendencia es una línea diagonal que conecta dos o más puntos de precio, sirviendo como soporte o resistencia dinámica.", steps: ["Conecta los mínimos en tendencia alcista", "Conecta los máximos en tendencia bajista", "Extiende la línea", "Busca rebotes", "Vigila las rupturas"], example: "Traza una línea conectando mínimos en 1.0800 y 1.0850 para identificar entradas.", keyTakeaways: ["Las líneas conectan puntos de swing", "Línea alcista = soporte dinámico", "Línea bajista = resistencia dinámica", "Ruptura = señal de reversión"] }
    },
    {
      id: 5, diagram: 'chart-patterns',
      en: { title: "Chart Patterns", content: "Chart patterns are specific formations created by price movements on a chart. They are categorized into:\n\n**Reversal Patterns:** Signal that the current trend is about to change direction.\n- Head and Shoulders\n- Double Top / Double Bottom\n- Triple Top / Triple Bottom\n\n**Continuation Patterns:** Signal that the current trend will continue.\n- Flags and Pennants\n- Triangles (Ascending, Descending, Symmetrical)\n- Rectangles\n\nRecognizing these patterns gives you a significant edge in predicting price movements.", steps: ["Learn to identify the most common patterns", "Look for patterns forming at key support/resistance levels", "Wait for the pattern to complete before trading", "Measure the pattern to set your profit target", "Always use a stop loss in case the pattern fails"], example: "A Double Top at 1.1000 means price tried to break above twice and failed. This is a bearish signal. You could sell when price breaks below the neckline with a target equal to the height of the pattern.", keyTakeaways: ["Reversal patterns signal trend change", "Continuation patterns signal trend continuation", "Wait for pattern completion before trading", "Measure patterns to set profit targets"] },
      ar: { title: "أنماط الرسوم البيانية", content: "أنماط الرسوم البيانية هي تشكيلات محددة تنشأ من حركة الأسعار. تنقسم إلى:\n\n**أنماط انعكاسية:** تشير إلى تغيير الاتجاه الحالي.\n- الرأس والكتفين\n- القمة المزدوجة / القاع المزدوج\n\n**أنماط استمرارية:** تشير إلى استمرار الاتجاه الحالي.\n- الأعلام والرايات\n- المثلثات", steps: ["تعلم تحديد الأنماط الأكثر شيوعاً", "ابحث عن الأنماط عند مستويات الدعم/المقاومة", "انتظر اكتمال النمط قبل التداول", "قس النمط لتحديد هدف الربح", "استخدم دائماً وقف الخسارة"], example: "قمة مزدوجة عند 1.1000 تعني أن السعر حاول الاختراق مرتين وفشل. هذه إشارة هبوطية.", keyTakeaways: ["الأنماط الانعكاسية تشير لتغيير الاتجاه", "الأنماط الاستمرارية تشير لاستمرار الاتجاه", "انتظر اكتمال النمط قبل التداول", "قس الأنماط لتحديد أهداف الربح"] },
      fr: { title: "Figures Chartistes", content: "Les figures chartistes sont des formations spécifiques créées par les mouvements de prix. Elles se divisent en figures de retournement et de continuation.", steps: ["Apprenez les figures courantes", "Cherchez-les aux niveaux clés", "Attendez la complétion", "Mesurez pour les objectifs", "Utilisez un stop loss"], example: "Un double sommet à 1.1000 est un signal baissier.", keyTakeaways: ["Figures de retournement", "Figures de continuation", "Attendez la complétion", "Mesurez les objectifs"] },
      es: { title: "Patrones de Gráficos", content: "Los patrones son formaciones específicas creadas por movimientos de precios. Se dividen en patrones de reversión y continuación.", steps: ["Aprende los patrones comunes", "Búscalos en niveles clave", "Espera la completación", "Mide para objetivos", "Usa stop loss"], example: "Un doble techo en 1.1000 es una señal bajista.", keyTakeaways: ["Patrones de reversión", "Patrones de continuación", "Espera la completación", "Mide los objetivos"] }
    },
    {
      id: 6, diagram: 'head-shoulders',
      en: { title: "Head and Shoulders Pattern", content: "The Head and Shoulders is one of the most reliable reversal patterns. It consists of three peaks:\n\n1. **Left Shoulder:** A peak followed by a decline\n2. **Head:** A higher peak followed by a decline\n3. **Right Shoulder:** A lower peak (similar height to left shoulder)\n4. **Neckline:** A line connecting the lows between the shoulders\n\nThe pattern is confirmed when price breaks below the neckline. The inverse Head and Shoulders appears at the bottom of downtrends and signals a bullish reversal.", steps: ["Identify an uptrend that's losing momentum", "Spot the left shoulder, head, and right shoulder", "Draw the neckline connecting the two lows", "Wait for price to break below the neckline", "Enter short with target = head height below neckline"], example: "EUR/USD forms peaks at 1.1050 (left shoulder), 1.1100 (head), 1.1040 (right shoulder). The neckline is at 1.0980. When price breaks below 1.0980, sell with target at 1.0860 (120 pips = head height).", keyTakeaways: ["Most reliable reversal pattern", "Three peaks: Left Shoulder, Head, Right Shoulder", "Confirmed on neckline break", "Target = height of head projected from neckline"] },
      ar: { title: "نمط الرأس والكتفين", content: "الرأس والكتفين هو أحد أكثر أنماط الانعكاس موثوقية. يتكون من ثلاث قمم:\n\n1. **الكتف الأيسر:** قمة يليها هبوط\n2. **الرأس:** قمة أعلى يليها هبوط\n3. **الكتف الأيمن:** قمة أدنى (بارتفاع مشابه للكتف الأيسر)\n4. **خط العنق:** خط يربط القيعان بين الكتفين", steps: ["حدد اتجاهاً صاعداً يفقد زخمه", "اكتشف الكتف الأيسر والرأس والكتف الأيمن", "ارسم خط العنق", "انتظر كسر السعر لخط العنق", "ادخل بيع بهدف = ارتفاع الرأس تحت خط العنق"], example: "EUR/USD يشكل قمماً عند 1.1050 (كتف أيسر)، 1.1100 (رأس)، 1.1040 (كتف أيمن). خط العنق عند 1.0980. عند كسره، بِع بهدف 1.0860.", keyTakeaways: ["أكثر أنماط الانعكاس موثوقية", "ثلاث قمم: كتف أيسر، رأس، كتف أيمن", "يُؤكد عند كسر خط العنق", "الهدف = ارتفاع الرأس من خط العنق"] },
      fr: { title: "Tête et Épaules", content: "La tête et épaules est l'une des figures de retournement les plus fiables avec trois sommets.", steps: ["Identifiez une tendance haussière", "Repérez les trois sommets", "Tracez la ligne de cou", "Attendez la cassure", "Entrez en position"], example: "EUR/USD forme des sommets à 1.1050, 1.1100, 1.1040 avec ligne de cou à 1.0980.", keyTakeaways: ["Figure de retournement fiable", "Trois sommets", "Confirmée à la cassure", "Objectif = hauteur de la tête"] },
      es: { title: "Cabeza y Hombros", content: "El patrón de cabeza y hombros es uno de los más confiables con tres picos.", steps: ["Identifica tendencia alcista", "Localiza los tres picos", "Traza la línea de cuello", "Espera la ruptura", "Entra en posición"], example: "EUR/USD forma picos en 1.1050, 1.1100, 1.1040 con línea de cuello en 1.0980.", keyTakeaways: ["Patrón de reversión confiable", "Tres picos", "Confirmado en ruptura", "Objetivo = altura de la cabeza"] }
    },
    {
      id: 7, diagram: 'double-top-bottom',
      en: { title: "Double Top & Double Bottom", content: "**Double Top** is a bearish reversal pattern that forms after an uptrend. Price reaches a high, pulls back, then reaches approximately the same high again before reversing down.\n\n**Double Bottom** is a bullish reversal pattern that forms after a downtrend. Price reaches a low, bounces up, then reaches approximately the same low again before reversing up.\n\nThese patterns are confirmed when price breaks the neckline (the middle point between the two tops or bottoms).", steps: ["Identify two peaks at roughly the same level (Double Top)", "Or two valleys at roughly the same level (Double Bottom)", "Draw the neckline at the middle swing point", "Wait for price to break the neckline", "Enter with target equal to the pattern height"], example: "Price hits 1.1000 twice and fails both times. The neckline is at 1.0950. When price breaks below 1.0950, sell with target at 1.0900 (50 pips = pattern height).", keyTakeaways: ["Double Top = bearish reversal after uptrend", "Double Bottom = bullish reversal after downtrend", "Confirmed on neckline break", "Target = height of the pattern"] },
      ar: { title: "القمة المزدوجة والقاع المزدوج", content: "**القمة المزدوجة** نمط انعكاسي هبوطي يتشكل بعد اتجاه صاعد. السعر يصل لقمة، يتراجع، ثم يصل لنفس القمة تقريباً قبل الانعكاس.\n\n**القاع المزدوج** نمط انعكاسي صعودي يتشكل بعد اتجاه هابط.", steps: ["حدد قمتين عند نفس المستوى تقريباً (قمة مزدوجة)", "أو قاعين عند نفس المستوى (قاع مزدوج)", "ارسم خط العنق عند نقطة التأرجح الوسطى", "انتظر كسر خط العنق", "ادخل بهدف يساوي ارتفاع النمط"], example: "السعر يصل إلى 1.1000 مرتين ويفشل. خط العنق عند 1.0950. عند الكسر، بِع بهدف 1.0900.", keyTakeaways: ["قمة مزدوجة = انعكاس هبوطي", "قاع مزدوج = انعكاس صعودي", "يُؤكد عند كسر خط العنق", "الهدف = ارتفاع النمط"] },
      fr: { title: "Double Sommet & Double Creux", content: "Le double sommet est baissier après une hausse. Le double creux est haussier après une baisse.", steps: ["Identifiez deux sommets/creux au même niveau", "Tracez la ligne de cou", "Attendez la cassure", "Entrez en position", "Objectif = hauteur du pattern"], example: "Le prix touche 1.1000 deux fois et échoue. Vendez à la cassure de 1.0950.", keyTakeaways: ["Double sommet = retournement baissier", "Double creux = retournement haussier", "Confirmé à la cassure", "Objectif = hauteur du pattern"] },
      es: { title: "Doble Techo y Doble Suelo", content: "El doble techo es bajista después de una subida. El doble suelo es alcista después de una bajada.", steps: ["Identifica dos picos/valles al mismo nivel", "Traza la línea de cuello", "Espera la ruptura", "Entra en posición", "Objetivo = altura del patrón"], example: "El precio toca 1.1000 dos veces y falla. Vende en la ruptura de 1.0950.", keyTakeaways: ["Doble techo = reversión bajista", "Doble suelo = reversión alcista", "Confirmado en ruptura", "Objetivo = altura del patrón"] }
    },
    {
      id: 8, diagram: 'candlestick',
      en: { title: "Candlestick Basics", content: "Japanese candlesticks are the most popular way to display price data. Each candle shows four prices:\n\n- **Open:** The price at the start of the period\n- **Close:** The price at the end of the period\n- **High:** The highest price during the period\n- **Low:** The lowest price during the period\n\n**Bullish candle (green/white):** Close is higher than Open\n**Bearish candle (red/black):** Close is lower than Open\n\nThe body shows the range between open and close. The wicks (shadows) show the high and low.", steps: ["Understand the four components: Open, High, Low, Close", "Green/white candle = buyers won (bullish)", "Red/black candle = sellers won (bearish)", "Long body = strong momentum", "Long wick = rejection of that price level"], example: "A long green candle with a small upper wick at a support level indicates strong buying pressure and a potential upward move.", keyTakeaways: ["Each candle = Open, High, Low, Close", "Green = bullish, Red = bearish", "Long body = strong momentum", "Long wicks = price rejection"] },
      ar: { title: "أساسيات الشموع اليابانية", content: "الشموع اليابانية هي الطريقة الأكثر شيوعاً لعرض بيانات الأسعار. كل شمعة تُظهر أربعة أسعار:\n\n- **الافتتاح:** السعر في بداية الفترة\n- **الإغلاق:** السعر في نهاية الفترة\n- **الأعلى:** أعلى سعر خلال الفترة\n- **الأدنى:** أدنى سعر خلال الفترة", steps: ["افهم المكونات الأربعة: افتتاح، أعلى، أدنى، إغلاق", "شمعة خضراء = المشترون فازوا (صعودية)", "شمعة حمراء = البائعون فازوا (هبوطية)", "جسم طويل = زخم قوي", "ذيل طويل = رفض لمستوى السعر"], example: "شمعة خضراء طويلة بذيل علوي صغير عند مستوى دعم تشير لضغط شراء قوي.", keyTakeaways: ["كل شمعة = افتتاح، أعلى، أدنى، إغلاق", "خضراء = صعودية، حمراء = هبوطية", "جسم طويل = زخم قوي", "ذيول طويلة = رفض السعر"] },
      fr: { title: "Bases des Chandeliers", content: "Les chandeliers japonais montrent quatre prix: ouverture, clôture, plus haut, plus bas.", steps: ["Comprenez les 4 composants", "Vert = haussier", "Rouge = baissier", "Grand corps = fort momentum", "Longue mèche = rejet"], example: "Un grand chandelier vert sur un support indique une forte pression acheteuse.", keyTakeaways: ["Chaque chandelier = OHLC", "Vert = haussier, Rouge = baissier", "Grand corps = momentum", "Longues mèches = rejet"] },
      es: { title: "Bases de Velas Japonesas", content: "Las velas japonesas muestran cuatro precios: apertura, cierre, máximo, mínimo.", steps: ["Comprende los 4 componentes", "Verde = alcista", "Rojo = bajista", "Cuerpo largo = momentum fuerte", "Mecha larga = rechazo"], example: "Una gran vela verde en soporte indica fuerte presión compradora.", keyTakeaways: ["Cada vela = OHLC", "Verde = alcista, Rojo = bajista", "Cuerpo largo = momentum", "Mechas largas = rechazo"] }
    },
    {
      id: 9, diagram: 'candlestick',
      en: { title: "Candlestick Patterns", content: "Certain candlestick formations provide powerful trading signals:\n\n**Doji:** Open and close are nearly equal. Shows indecision.\n**Hammer:** Small body at top, long lower wick. Bullish at support.\n**Shooting Star:** Small body at bottom, long upper wick. Bearish at resistance.\n**Engulfing:** A candle that completely covers the previous candle. Strong reversal signal.\n**Morning Star:** Three-candle bullish reversal pattern.\n**Evening Star:** Three-candle bearish reversal pattern.", steps: ["Learn to recognize the key patterns", "Look for patterns at important price levels", "Confirm with the overall trend direction", "Use patterns as entry triggers, not standalone signals", "Combine with support/resistance for best results"], example: "A hammer candle forms at the 1.0800 support level after a downtrend. This is a strong buy signal, especially if the next candle closes above the hammer's high.", keyTakeaways: ["Doji = indecision", "Hammer = bullish reversal at support", "Shooting Star = bearish reversal at resistance", "Engulfing = strong reversal signal"] },
      ar: { title: "أنماط الشموع اليابانية", content: "تشكيلات شموع معينة توفر إشارات تداول قوية:\n\n**دوجي:** الافتتاح والإغلاق متساويان تقريباً. تُظهر التردد.\n**المطرقة:** جسم صغير في الأعلى، ذيل سفلي طويل. صعودية عند الدعم.\n**النجمة الساقطة:** جسم صغير في الأسفل، ذيل علوي طويل. هبوطية عند المقاومة.\n**الابتلاع:** شمعة تغطي الشمعة السابقة بالكامل.", steps: ["تعلم التعرف على الأنماط الرئيسية", "ابحث عن الأنماط عند مستويات سعرية مهمة", "أكد مع اتجاه الترند العام", "استخدم الأنماط كمحفزات دخول", "ادمج مع الدعم/المقاومة"], example: "شمعة مطرقة تتشكل عند مستوى دعم 1.0800 بعد اتجاه هابط. هذه إشارة شراء قوية.", keyTakeaways: ["دوجي = تردد", "مطرقة = انعكاس صعودي عند الدعم", "نجمة ساقطة = انعكاس هبوطي عند المقاومة", "ابتلاع = إشارة انعكاس قوية"] },
      fr: { title: "Patterns de Chandeliers", content: "Certaines formations de chandeliers fournissent des signaux puissants: Doji, Marteau, Étoile filante, Englobante.", steps: ["Apprenez les patterns clés", "Cherchez-les aux niveaux importants", "Confirmez avec la tendance", "Utilisez comme déclencheurs", "Combinez avec S/R"], example: "Un marteau sur le support 1.0800 est un signal d'achat fort.", keyTakeaways: ["Doji = indécision", "Marteau = retournement haussier", "Étoile filante = retournement baissier", "Englobante = signal fort"] },
      es: { title: "Patrones de Velas", content: "Ciertas formaciones de velas proporcionan señales poderosas: Doji, Martillo, Estrella fugaz, Envolvente.", steps: ["Aprende los patrones clave", "Búscalos en niveles importantes", "Confirma con la tendencia", "Úsalos como disparadores", "Combina con S/R"], example: "Un martillo en el soporte 1.0800 es una señal de compra fuerte.", keyTakeaways: ["Doji = indecisión", "Martillo = reversión alcista", "Estrella fugaz = reversión bajista", "Envolvente = señal fuerte"] }
    },
    {
      id: 10, diagram: 'fibonacci',
      en: { title: "Fibonacci Retracements", content: "Fibonacci retracement levels are horizontal lines that indicate where support and resistance are likely to occur. They are based on the Fibonacci sequence and the key levels are:\n\n- **23.6%** - Shallow retracement\n- **38.2%** - Common retracement\n- **50.0%** - Half retracement\n- **61.8%** - Golden ratio (most important)\n- **78.6%** - Deep retracement\n\nTraders use these levels to find potential entry points during pullbacks in a trend.", steps: ["Identify a clear swing high and swing low", "Apply the Fibonacci tool from low to high (uptrend) or high to low (downtrend)", "Watch for price reactions at the key levels", "The 61.8% level is the most significant", "Combine with other tools for confirmation"], example: "In an uptrend from 1.0800 to 1.1000, the 61.8% retracement is at 1.0876. If price pulls back to this level and shows bullish candles, it's a strong buy opportunity.", keyTakeaways: ["Key levels: 38.2%, 50%, 61.8%", "61.8% is the golden ratio", "Use during pullbacks in trends", "Combine with S/R for best results"] },
      ar: { title: "مستويات فيبوناتشي", content: "مستويات فيبوناتشي هي خطوط أفقية تشير إلى مناطق الدعم والمقاومة المحتملة. المستويات الرئيسية هي:\n\n- **23.6%** - تصحيح ضحل\n- **38.2%** - تصحيح شائع\n- **50.0%** - نصف التصحيح\n- **61.8%** - النسبة الذهبية (الأهم)\n- **78.6%** - تصحيح عميق", steps: ["حدد قمة وقاع واضحين", "طبق أداة فيبوناتشي من القاع للقمة (صاعد) أو العكس", "راقب ردود فعل السعر عند المستويات", "مستوى 61.8% هو الأكثر أهمية", "ادمج مع أدوات أخرى للتأكيد"], example: "في اتجاه صاعد من 1.0800 إلى 1.1000، تصحيح 61.8% عند 1.0876. إذا تراجع السعر لهذا المستوى وظهرت شموع صعودية، فهذه فرصة شراء قوية.", keyTakeaways: ["المستويات الرئيسية: 38.2%، 50%، 61.8%", "61.8% هي النسبة الذهبية", "استخدمها أثناء التصحيحات", "ادمج مع الدعم/المقاومة"] },
      fr: { title: "Retracements de Fibonacci", content: "Les niveaux de Fibonacci indiquent les zones de support et résistance potentielles. Les niveaux clés sont 38.2%, 50% et 61.8%.", steps: ["Identifiez un swing haut et bas", "Appliquez l'outil Fibonacci", "Observez les réactions", "Le 61.8% est le plus important", "Combinez avec d'autres outils"], example: "Dans une hausse de 1.0800 à 1.1000, le 61.8% est à 1.0876.", keyTakeaways: ["Niveaux clés: 38.2%, 50%, 61.8%", "61.8% = ratio d'or", "Utilisez pendant les corrections", "Combinez avec S/R"] },
      es: { title: "Retrocesos de Fibonacci", content: "Los niveles de Fibonacci indican zonas de soporte y resistencia potenciales. Los niveles clave son 38.2%, 50% y 61.8%.", steps: ["Identifica un máximo y mínimo claros", "Aplica la herramienta Fibonacci", "Observa las reacciones", "El 61.8% es el más importante", "Combina con otras herramientas"], example: "En una subida de 1.0800 a 1.1000, el 61.8% está en 1.0876.", keyTakeaways: ["Niveles clave: 38.2%, 50%, 61.8%", "61.8% = ratio áureo", "Usa durante correcciones", "Combina con S/R"] }
    },
    {
      id: 11, diagram: 'risk-management',
      en: { title: "Risk Management", content: "Risk management is the most important skill in trading. Without it, even the best strategy will fail.\n\n**Key Rules:**\n1. Never risk more than 1-2% per trade\n2. Always use a stop loss\n3. Aim for a minimum 1:2 risk-to-reward ratio\n4. Don't overtrade\n5. Never move your stop loss further away\n\n**Position Sizing Formula:**\nLot Size = (Account Balance × Risk %) / (Stop Loss in Pips × Pip Value)", steps: ["Determine your risk per trade (1-2% of account)", "Calculate your stop loss distance in pips", "Use the position sizing formula to find lot size", "Set your take profit at minimum 2× your stop loss", "Never risk more than you can afford to lose"], example: "Account: $10,000. Risk: 1% = $100. Stop Loss: 50 pips. Pip value for EUR/USD: $10/pip for 1 lot. Lot size = $100 / (50 × $10) = 0.20 lots.", keyTakeaways: ["Risk 1-2% per trade maximum", "Always use stop loss", "Minimum 1:2 risk-to-reward ratio", "Position sizing is crucial"] },
      ar: { title: "إدارة المخاطر", content: "إدارة المخاطر هي أهم مهارة في التداول. بدونها، حتى أفضل استراتيجية ستفشل.\n\n**القواعد الأساسية:**\n1. لا تخاطر بأكثر من 1-2% لكل صفقة\n2. استخدم دائماً وقف الخسارة\n3. استهدف نسبة مخاطرة/مكافأة 1:2 كحد أدنى\n4. لا تفرط في التداول\n5. لا تحرك وقف الخسارة بعيداً أبداً", steps: ["حدد مخاطرتك لكل صفقة (1-2% من الحساب)", "احسب مسافة وقف الخسارة بالنقاط", "استخدم معادلة حجم المركز", "ضع هدف الربح بضعف وقف الخسارة كحد أدنى", "لا تخاطر بأكثر مما تستطيع تحمل خسارته"], example: "حساب: $10,000. مخاطرة: 1% = $100. وقف خسارة: 50 نقطة. حجم اللوت = $100 / (50 × $10) = 0.20 لوت.", keyTakeaways: ["خاطر بـ 1-2% كحد أقصى لكل صفقة", "استخدم دائماً وقف الخسارة", "نسبة مخاطرة/مكافأة 1:2 كحد أدنى", "حجم المركز أمر حاسم"] },
      fr: { title: "Gestion des Risques", content: "La gestion des risques est la compétence la plus importante. Risquez 1-2% par trade, utilisez un stop loss, et visez un ratio risque/récompense de 1:2.", steps: ["Déterminez votre risque par trade", "Calculez votre stop loss", "Utilisez la formule de taille de position", "Objectif = 2× stop loss", "Ne risquez jamais plus que vous pouvez perdre"], example: "Compte: $10,000. Risque: 1% = $100. Stop: 50 pips. Taille = 0.20 lots.", keyTakeaways: ["Risque 1-2% par trade", "Toujours un stop loss", "Ratio 1:2 minimum", "Taille de position cruciale"] },
      es: { title: "Gestión de Riesgos", content: "La gestión de riesgos es la habilidad más importante. Arriesga 1-2% por operación, usa stop loss y apunta a ratio 1:2.", steps: ["Determina tu riesgo por operación", "Calcula tu stop loss", "Usa la fórmula de tamaño de posición", "Objetivo = 2× stop loss", "Nunca arriesgues más de lo que puedes perder"], example: "Cuenta: $10,000. Riesgo: 1% = $100. Stop: 50 pips. Tamaño = 0.20 lotes.", keyTakeaways: ["Riesgo 1-2% por operación", "Siempre stop loss", "Ratio 1:2 mínimo", "Tamaño de posición crucial"] }
    },
    {
      id: 12, diagram: 'entry-model',
      en: { title: "Building a Trading Plan", content: "A trading plan is your roadmap to consistent profits. It removes emotions and provides clear rules for every situation.\n\n**Your plan should include:**\n1. Markets you trade\n2. Timeframes you use\n3. Entry criteria\n4. Exit criteria (TP and SL)\n5. Risk management rules\n6. Trading hours\n7. Maximum daily loss limit", steps: ["Choose 2-3 currency pairs to focus on", "Select your primary and confirmation timeframes", "Define exact entry conditions", "Set clear stop loss and take profit rules", "Establish daily/weekly loss limits", "Write everything down and follow it strictly"], example: "My plan: Trade EUR/USD and GBP/USD on H4. Enter on trendline bounce with bullish candle confirmation. SL below recent swing low. TP at 1:2 RR. Max 2 trades per day. Stop trading after 2 consecutive losses.", keyTakeaways: ["A plan removes emotional trading", "Include specific entry and exit rules", "Define risk limits strictly", "Review and improve your plan regularly"] },
      ar: { title: "بناء خطة تداول", content: "خطة التداول هي خريطة طريقك لأرباح مستمرة. تزيل المشاعر وتوفر قواعد واضحة لكل موقف.\n\n**يجب أن تتضمن خطتك:**\n1. الأسواق التي تتداولها\n2. الأطر الزمنية\n3. معايير الدخول\n4. معايير الخروج\n5. قواعد إدارة المخاطر\n6. ساعات التداول\n7. حد الخسارة اليومي", steps: ["اختر 2-3 أزواج عملات للتركيز عليها", "حدد الأطر الزمنية الأساسية والتأكيدية", "حدد شروط الدخول بدقة", "ضع قواعد واضحة لوقف الخسارة وجني الأرباح", "حدد حدود الخسارة اليومية/الأسبوعية", "اكتب كل شيء والتزم به"], example: "خطتي: تداول EUR/USD و GBP/USD على H4. الدخول عند ارتداد خط الاتجاه مع تأكيد شمعة صعودية. وقف خسارة تحت آخر قاع. هدف 1:2. حد أقصى صفقتين يومياً.", keyTakeaways: ["الخطة تزيل التداول العاطفي", "تتضمن قواعد دخول وخروج محددة", "حدد حدود المخاطر بصرامة", "راجع وحسّن خطتك بانتظام"] },
      fr: { title: "Construire un Plan de Trading", content: "Un plan de trading est votre feuille de route. Il élimine les émotions et fournit des règles claires.", steps: ["Choisissez 2-3 paires", "Sélectionnez vos timeframes", "Définissez les conditions d'entrée", "Fixez les règles SL/TP", "Établissez des limites de perte", "Écrivez et suivez"], example: "Mon plan: EUR/USD et GBP/USD sur H4 avec rebond sur ligne de tendance.", keyTakeaways: ["Le plan élimine les émotions", "Règles d'entrée/sortie spécifiques", "Limites de risque strictes", "Révision régulière"] },
      es: { title: "Construir un Plan de Trading", content: "Un plan de trading es tu hoja de ruta. Elimina las emociones y proporciona reglas claras.", steps: ["Elige 2-3 pares", "Selecciona tus marcos temporales", "Define condiciones de entrada", "Fija reglas SL/TP", "Establece límites de pérdida", "Escribe y sigue"], example: "Mi plan: EUR/USD y GBP/USD en H4 con rebote en línea de tendencia.", keyTakeaways: ["El plan elimina emociones", "Reglas de entrada/salida específicas", "Límites de riesgo estrictos", "Revisión regular"] }
    },
    {
      id: 13, diagram: 'entry-model',
      en: { title: "Putting It All Together", content: "Now let's combine everything into a complete trading strategy:\n\n1. **Identify the trend** on a higher timeframe (Daily/H4)\n2. **Mark key levels** of support and resistance\n3. **Wait for price** to reach a key level\n4. **Look for confirmation** using candlestick patterns\n5. **Calculate position size** based on risk management\n6. **Enter the trade** with clear SL and TP\n7. **Manage the trade** and stick to your plan", steps: ["Check the daily chart for overall trend direction", "Switch to H4 to identify key S/R levels", "Wait for price to reach a key level", "Look for a candlestick pattern confirmation", "Calculate your lot size (1% risk)", "Place your trade with SL and TP", "Don't touch the trade — let it play out"], example: "Daily trend is bullish on EUR/USD. H4 shows price pulling back to support at 1.0850 (also 61.8% Fibonacci). A hammer candle forms. Enter long at 1.0860, SL at 1.0820 (40 pips), TP at 1.0940 (80 pips = 1:2 RR).", keyTakeaways: ["Combine multiple tools for higher probability", "Higher timeframe for trend, lower for entry", "Always wait for confirmation", "Stick to your risk management rules"] },
      ar: { title: "تجميع كل شيء معاً", content: "الآن لنجمع كل شيء في استراتيجية تداول كاملة:\n\n1. **حدد الاتجاه** على إطار زمني أعلى\n2. **حدد المستويات الرئيسية** للدعم والمقاومة\n3. **انتظر وصول السعر** لمستوى رئيسي\n4. **ابحث عن تأكيد** باستخدام أنماط الشموع\n5. **احسب حجم المركز** بناءً على إدارة المخاطر\n6. **ادخل الصفقة** بوقف خسارة وهدف واضحين\n7. **أدر الصفقة** والتزم بخطتك", steps: ["تحقق من الرسم اليومي لاتجاه الترند", "انتقل إلى H4 لتحديد مستويات الدعم/المقاومة", "انتظر وصول السعر لمستوى رئيسي", "ابحث عن تأكيد بنمط شموع", "احسب حجم اللوت (مخاطرة 1%)", "ضع صفقتك بوقف خسارة وهدف", "لا تلمس الصفقة — دعها تعمل"], example: "الاتجاه اليومي صاعد على EUR/USD. H4 يُظهر تراجع السعر لدعم عند 1.0850 (أيضاً فيبوناتشي 61.8%). شمعة مطرقة تتشكل. ادخل شراء عند 1.0860، وقف خسارة 1.0820، هدف 1.0940 (نسبة 1:2).", keyTakeaways: ["ادمج أدوات متعددة لاحتمالية أعلى", "إطار أعلى للاتجاه، أدنى للدخول", "انتظر دائماً التأكيد", "التزم بقواعد إدارة المخاطر"] },
      fr: { title: "Tout Assembler", content: "Combinons tout en une stratégie complète: tendance, niveaux, confirmation, gestion du risque.", steps: ["Vérifiez la tendance journalière", "Identifiez les niveaux S/R sur H4", "Attendez le prix aux niveaux", "Cherchez une confirmation", "Calculez la taille", "Placez le trade", "Ne touchez pas"], example: "Tendance haussière EUR/USD. Support H4 à 1.0850 avec marteau. Achat à 1.0860, SL 1.0820, TP 1.0940.", keyTakeaways: ["Combinez les outils", "Timeframe supérieur pour la tendance", "Attendez la confirmation", "Respectez le risque"] },
      es: { title: "Juntando Todo", content: "Combinemos todo en una estrategia completa: tendencia, niveles, confirmación, gestión de riesgo.", steps: ["Verifica la tendencia diaria", "Identifica niveles S/R en H4", "Espera el precio en los niveles", "Busca confirmación", "Calcula el tamaño", "Coloca la operación", "No toques"], example: "Tendencia alcista EUR/USD. Soporte H4 en 1.0850 con martillo. Compra en 1.0860, SL 1.0820, TP 1.0940.", keyTakeaways: ["Combina herramientas", "Marco superior para tendencia", "Espera confirmación", "Respeta el riesgo"] }
    }
  ],
  // SMC, ICT, SK schools will be in separate file due to size
};

export default { schools, lessonsData, tradingTips, diagramTypes };
