// 🎓 ShukriTrade Academy - Complete Quiz System
// Lesson Quizzes + Review Quizzes + Final Exams

const quizzesData = {
  // اختبارات الدروس الفردية
  lessonQuizzes: {
    // المرحلة 0 - الدرس 1
    "stage0_lesson1": {
      id: "stage0_lesson1",
      title: "اختبار: سيكولوجية التداول",
      titleEn: "Quiz: Trading Psychology",
      questions: [
        {
          id: 1,
          question: "ما هو الفرق الرئيسي بين القمار والتداول المحترف؟",
          questionAr: "ما هو الفرق الرئيسي بين القمار والتداول المحترف؟",
          options: [
            { text: "القمار يعتمد على الحظ، التداول يعتمد على التحليل", textAr: "القمار يعتمد على الحظ، التداول يعتمد على التحليل", correct: true },
            { text: "لا يوجد فرق", textAr: "لا يوجد فرق", correct: false },
            { text: "التداول أسهل من القمار", textAr: "التداول أسهل من القمار", correct: false },
            { text: "القمار أكثر أماناً", textAr: "القمار أكثر أماناً", correct: false }
          ]
        },
        {
          id: 2,
          question: "أي من الأخطاء النفسية التالية يحدث بعد صفقة رابحة؟",
          questionAr: "أي من الأخطاء النفسية التالية يحدث بعد صفقة رابحة؟",
          options: [
            { text: "الثقة الزائدة", textAr: "الثقة الزائدة", correct: true },
            { text: "الخوف", textAr: "الخوف", correct: false },
            { text: "الجشع", textAr: "الجشع", correct: false },
            { text: "الانتقام", textAr: "الانتقام", correct: false }
          ]
        },
        {
          id: 3,
          question: "ما هو هرمون التوتر الذي ينتجه الدماغ عند الخسارة؟",
          questionAr: "ما هو هرمون التوتر الذي ينتجه الدماغ عند الخسارة؟",
          options: [
            { text: "الكورتيزول", textAr: "الكورتيزول", correct: true },
            { text: "الأدرينالين", textAr: "الأدرينالين", correct: false },
            { text: "السيروتونين", textAr: "السيروتونين", correct: false },
            { text: "الدوبامين", textAr: "الدوبامين", correct: false }
          ]
        },
        {
          id: 4,
          question: "أي جزء من الدماغ يجب أن يحكم في التداول؟",
          questionAr: "أي جزء من الدماغ يجب أن يحكم في التداول؟",
          options: [
            { text: "الجزء المنطقي (Prefrontal Cortex)", textAr: "الجزء المنطقي", correct: true },
            { text: "الجزء العاطفي (Amygdala)", textAr: "الجزء العاطفي", correct: false },
            { text: "كلاهما متساوي", textAr: "كلاهما متساوي", correct: false },
            { text: "الجزء الحسي", textAr: "الجزء الحسي", correct: false }
          ]
        },
        {
          id: 5,
          question: "كم نسبة المتداولين الذين يخسرون؟",
          questionAr: "كم نسبة المتداولين الذين يخسرون؟",
          options: [
            { text: "90%", textAr: "90%", correct: true },
            { text: "50%", textAr: "50%", correct: false },
            { text: "30%", textAr: "30%", correct: false },
            { text: "10%", textAr: "10%", correct: false }
          ]
        }
      ],
      passingScore: 15, // 3 من 5 أسئلة
      totalPoints: 20
    },

    // المرحلة 0 - الدرس 2
    "stage0_lesson2": {
      id: "stage0_lesson2",
      title: "اختبار: الانضباط الذاتي",
      titleEn: "Quiz: Self-Discipline",
      questions: [
        {
          id: 1,
          question: "كم نسبة الصفقات الجيدة من إجمالي الفرص؟",
          questionAr: "كم نسبة الصفقات الجيدة من إجمالي الفرص؟",
          options: [
            { text: "80% من الصفقات الجيدة من 20% من الفرص", textAr: "80% من الصفقات الجيدة من 20% من الفرص", correct: true },
            { text: "50% من الصفقات الجيدة من 50% من الفرص", textAr: "50% من الصفقات الجيدة من 50% من الفرص", correct: false },
            { text: "كل الفرص جيدة", textAr: "كل الفرص جيدة", correct: false },
            { text: "10% من الصفقات الجيدة من 90% من الفرص", textAr: "10% من الصفقات الجيدة من 90% من الفرص", correct: false }
          ]
        },
        {
          id: 2,
          question: "ما هو أهم عنصر في خطة التداول؟",
          questionAr: "ما هو أهم عنصر في خطة التداول؟",
          options: [
            { text: "أن تكون مكتوبة على الورق", textAr: "أن تكون مكتوبة على الورق", correct: true },
            { text: "أن تكون معقدة جداً", textAr: "أن تكون معقدة جداً", correct: false },
            { text: "أن تضمن ربح 100%", textAr: "أن تضمن ربح 100%", correct: false },
            { text: "أن تكون في الرأس فقط", textAr: "أن تكون في الرأس فقط", correct: false }
          ]
        },
        {
          id: 3,
          question: "كم مرة يجب أن تأخذ فترة راحة أثناء التداول؟",
          questionAr: "كم مرة يجب أن تأخذ فترة راحة أثناء التداول؟",
          options: [
            { text: "كل ساعة، 10 دقائق", textAr: "كل ساعة، 10 دقائق", correct: true },
            { text: "كل 4 ساعات", textAr: "كل 4 ساعات", correct: false },
            { text: "لا تأخذ فترات راحة", textAr: "لا تأخذ فترات راحة", correct: false },
            { text: "عند الشعور بالتعب فقط", textAr: "عند الشعور بالتعب فقط", correct: false }
          ]
        },
        {
          id: 4,
          question: "ما هو السلاح الأقوى في التداول؟",
          questionAr: "ما هو السلاح الأقوى في التداول؟",
          options: [
            { text: "الصبر والانتظار", textAr: "الصبر والانتظار", correct: true },
            { text: "التداول اليومي", textAr: "التداول اليومي", correct: false },
            { text: "الرافعة المالية العالية", textAr: "الرافعة المالية العالية", correct: false },
            { text: "التداول بدون خطة", textAr: "التداول بدون خطة", correct: false }
          ]
        },
        {
          id: 5,
          question: "كم نسبة الصفقات التي يجب أن تقول لها \"لا\"؟",
          questionAr: "كم نسبة الصفقات التي يجب أن تقول لها \"لا\"؟",
          options: [
            { text: "90%", textAr: "90%", correct: true },
            { text: "50%", textAr: "50%", correct: false },
            { text: "10%", textAr: "10%", correct: false },
            { text: "0% (كل الصفقات جيدة)", textAr: "0% (كل الصفقات جيدة)", correct: false }
          ]
        }
      ],
      passingScore: 15,
      totalPoints: 20
    }
  },

  // اختبارات المراجعة (كل 3 دروس)
  reviewQuizzes: {
    "stage0_review_lessons1to3": {
      id: "stage0_review_lessons1to3",
      title: "اختبار مراجعة: الدروس 1-3",
      titleEn: "Review Quiz: Lessons 1-3",
      description: "اختبار شامل يغطي الدروس الثلاثة الأولى من المرحلة 0",
      descriptionEn: "Comprehensive quiz covering lessons 1-3 of Stage 0",
      questions: [
        {
          id: 1,
          question: "كم نسبة المتداولين الذين يخسرون؟",
          questionAr: "كم نسبة المتداولين الذين يخسرون؟",
          options: [
            { text: "90%", textAr: "90%", correct: true },
            { text: "50%", textAr: "50%", correct: false },
            { text: "30%", textAr: "30%", correct: false },
            { text: "10%", textAr: "10%", correct: false }
          ]
        },
        {
          id: 2,
          question: "ما هي الأرباح الواقعية لمتداول مبتدئ؟",
          questionAr: "ما هي الأرباح الواقعية لمتداول مبتدئ؟",
          options: [
            { text: "5-10% شهرياً", textAr: "5-10% شهرياً", correct: true },
            { text: "50-100% شهرياً", textAr: "50-100% شهرياً", correct: false },
            { text: "1-2% شهرياً", textAr: "1-2% شهرياً", correct: false },
            { text: "100%+ شهرياً", textAr: "100%+ شهرياً", correct: false }
          ]
        },
        {
          id: 3,
          question: "كم ساعة يحتاج متداول متأرجح يومياً؟",
          questionAr: "كم ساعة يحتاج متداول متأرجح يومياً؟",
          options: [
            { text: "1-2 ساعة", textAr: "1-2 ساعة", correct: true },
            { text: "4-8 ساعات", textAr: "4-8 ساعات", correct: false },
            { text: "30 دقيقة", textAr: "30 دقيقة", correct: false },
            { text: "طول اليوم", textAr: "طول اليوم", correct: false }
          ]
        },
        {
          id: 4,
          question: "أي من الأخطاء النفسية يحدث بعد خسارة؟",
          questionAr: "أي من الأخطاء النفسية يحدث بعد خسارة؟",
          options: [
            { text: "الانتقام (Revenge Trading)", textAr: "الانتقام", correct: true },
            { text: "الثقة الزائدة", textAr: "الثقة الزائدة", correct: false },
            { text: "الجشع", textAr: "الجشع", correct: false },
            { text: "الخوف فقط", textAr: "الخوف فقط", correct: false }
          ]
        },
        {
          id: 5,
          question: "كم نسبة الفوز لأفضل المتداولين؟",
          questionAr: "كم نسبة الفوز لأفضل المتداولين؟",
          options: [
            { text: "40-50%", textAr: "40-50%", correct: true },
            { text: "80-90%", textAr: "80-90%", correct: false },
            { text: "100%", textAr: "100%", correct: false },
            { text: "10-20%", textAr: "10-20%", correct: false }
          ]
        },
        {
          id: 6,
          question: "ما هو أهم عنصر في إدارة التوقعات؟",
          questionAr: "ما هو أهم عنصر في إدارة التوقعات؟",
          options: [
            { text: "فهم أن الخسائر طبيعية", textAr: "فهم أن الخسائر طبيعية", correct: true },
            { text: "توقع أرباح 100% شهرياً", textAr: "توقع أرباح 100% شهرياً", correct: false },
            { text: "عدم قبول أي خسارة", textAr: "عدم قبول أي خسارة", correct: false },
            { text: "التداول بدون خطة", textAr: "التداول بدون خطة", correct: false }
          ]
        },
        {
          id: 7,
          question: "كم ساعة يجب أن تخصص للدراسة يومياً؟",
          questionAr: "كم ساعة يجب أن تخصص للدراسة يومياً؟",
          options: [
            { text: "ساعة واحدة", textAr: "ساعة واحدة", correct: true },
            { text: "4 ساعات", textAr: "4 ساعات", correct: false },
            { text: "30 دقيقة", textAr: "30 دقيقة", correct: false },
            { text: "لا تحتاج للدراسة", textAr: "لا تحتاج للدراسة", correct: false }
          ]
        },
        {
          id: 8,
          question: "ما هو النمو المركب لـ 10% شهرياً؟",
          questionAr: "ما هو النمو المركب لـ 10% شهرياً؟",
          options: [
            { text: "214% سنوياً", textAr: "214% سنوياً", correct: true },
            { text: "120% سنوياً", textAr: "120% سنوياً", correct: false },
            { text: "50% سنوياً", textAr: "50% سنوياً", correct: false },
            { text: "10% سنوياً", textAr: "10% سنوياً", correct: false }
          ]
        }
      ],
      passingScore: 24, // 6 من 8 أسئلة (75%)
      totalPoints: 32
    }
  },

  // الاختبارات النهائية للمراحل
  stageExams: {
    "stage0_final_exam": {
      id: "stage0_final_exam",
      title: "الاختبار النهائي: المرحلة 0",
      titleEn: "Final Exam: Stage 0",
      description: "اختبار شامل يغطي جميع دروس المرحلة 0 (التهيئة الذهنية)",
      descriptionEn: "Comprehensive exam covering all Stage 0 lessons",
      questions: [
        {
          id: 1,
          question: "ما هو الفرق الرئيسي بين القمار والتداول المحترف؟",
          questionAr: "ما هو الفرق الرئيسي بين القمار والتداول المحترف؟",
          options: [
            { text: "القمار يعتمد على الحظ، التداول يعتمد على التحليل", textAr: "القمار يعتمد على الحظ، التداول يعتمد على التحليل", correct: true },
            { text: "لا يوجد فرق", textAr: "لا يوجد فرق", correct: false },
            { text: "التداول أسهل", textAr: "التداول أسهل", correct: false },
            { text: "القمار أكثر أماناً", textAr: "القمار أكثر أماناً", correct: false }
          ]
        },
        {
          id: 2,
          question: "كم نسبة المتداولين الذين يخسرون؟",
          questionAr: "كم نسبة المتداولين الذين يخسرون؟",
          options: [
            { text: "90%", textAr: "90%", correct: true },
            { text: "50%", textAr: "50%", correct: false },
            { text: "30%", textAr: "30%", correct: false },
            { text: "10%", textAr: "10%", correct: false }
          ]
        },
        {
          id: 3,
          question: "أي من الأخطاء النفسية الأربع الرئيسية؟",
          questionAr: "أي من الأخطاء النفسية الأربع الرئيسية؟",
          options: [
            { text: "الثقة الزائدة، الخوف، الجشع، الانتقام", textAr: "الثقة الزائدة، الخوف، الجشع، الانتقام", correct: true },
            { text: "الحب، الكره، الغضب، الحزن", textAr: "الحب، الكره، الغضب، الحزن", correct: false },
            { text: "الفرح، الحزن، الخوف", textAr: "الفرح، الحزن، الخوف", correct: false },
            { text: "الثقة فقط", textAr: "الثقة فقط", correct: false }
          ]
        },
        {
          id: 4,
          question: "ما هي الأرباح الواقعية لمتداول مبتدئ؟",
          questionAr: "ما هي الأرباح الواقعية لمتداول مبتدئ؟",
          options: [
            { text: "5-10% شهرياً", textAr: "5-10% شهرياً", correct: true },
            { text: "50-100% شهرياً", textAr: "50-100% شهرياً", correct: false },
            { text: "1-2% شهرياً", textAr: "1-2% شهرياً", correct: false },
            { text: "100%+ شهرياً", textAr: "100%+ شهرياً", correct: false }
          ]
        },
        {
          id: 5,
          question: "كم نسبة الفوز لأفضل المتداولين؟",
          questionAr: "كم نسبة الفوز لأفضل المتداولين؟",
          options: [
            { text: "40-50%", textAr: "40-50%", correct: true },
            { text: "80-90%", textAr: "80-90%", correct: false },
            { text: "100%", textAr: "100%", correct: false },
            { text: "10-20%", textAr: "10-20%", correct: false }
          ]
        },
        {
          id: 6,
          question: "كم ساعة يحتاج متداول متأرجح يومياً؟",
          questionAr: "كم ساعة يحتاج متداول متأرجح يومياً؟",
          options: [
            { text: "1-2 ساعة", textAr: "1-2 ساعة", correct: true },
            { text: "4-8 ساعات", textAr: "4-8 ساعات", correct: false },
            { text: "30 دقيقة", textAr: "30 دقيقة", correct: false },
            { text: "طول اليوم", textAr: "طول اليوم", correct: false }
          ]
        },
        {
          id: 7,
          question: "ما هو السلاح الأقوى في التداول؟",
          questionAr: "ما هو السلاح الأقوى في التداول؟",
          options: [
            { text: "الصبر والانتظار", textAr: "الصبر والانتظار", correct: true },
            { text: "التداول اليومي", textAr: "التداول اليومي", correct: false },
            { text: "الرافعة العالية", textAr: "الرافعة العالية", correct: false },
            { text: "التداول بدون خطة", textAr: "التداول بدون خطة", correct: false }
          ]
        },
        {
          id: 8,
          question: "كم نسبة الصفقات الجيدة من الفرص؟",
          questionAr: "كم نسبة الصفقات الجيدة من الفرص؟",
          options: [
            { text: "20%", textAr: "20%", correct: true },
            { text: "50%", textAr: "50%", correct: false },
            { text: "80%", textAr: "80%", correct: false },
            { text: "100%", textAr: "100%", correct: false }
          ]
        },
        {
          id: 9,
          question: "ما هو النمو المركب لـ 10% شهرياً؟",
          questionAr: "ما هو النمو المركب لـ 10% شهرياً؟",
          options: [
            { text: "214% سنوياً", textAr: "214% سنوياً", correct: true },
            { text: "120% سنوياً", textAr: "120% سنوياً", correct: false },
            { text: "50% سنوياً", textAr: "50% سنوياً", correct: false },
            { text: "10% سنوياً", textAr: "10% سنوياً", correct: false }
          ]
        },
        {
          id: 10,
          question: "أي جزء من الدماغ يجب أن يحكم في التداول؟",
          questionAr: "أي جزء من الدماغ يجب أن يحكم في التداول؟",
          options: [
            { text: "الجزء المنطقي", textAr: "الجزء المنطقي", correct: true },
            { text: "الجزء العاطفي", textAr: "الجزء العاطفي", correct: false },
            { text: "كلاهما متساوي", textAr: "كلاهما متساوي", correct: false },
            { text: "الجزء الحسي", textAr: "الجزء الحسي", correct: false }
          ]
        },
        {
          id: 11,
          question: "كم ساعة يجب أن تخصص للدراسة يومياً؟",
          questionAr: "كم ساعة يجب أن تخصص للدراسة يومياً؟",
          options: [
            { text: "ساعة واحدة", textAr: "ساعة واحدة", correct: true },
            { text: "4 ساعات", textAr: "4 ساعات", correct: false },
            { text: "30 دقيقة", textAr: "30 دقيقة", correct: false },
            { text: "لا تحتاج", textAr: "لا تحتاج", correct: false }
          ]
        },
        {
          id: 12,
          question: "كم نسبة الصفقات التي يجب أن تقول لها \"لا\"؟",
          questionAr: "كم نسبة الصفقات التي يجب أن تقول لها \"لا\"؟",
          options: [
            { text: "90%", textAr: "90%", correct: true },
            { text: "50%", textAr: "50%", correct: false },
            { text: "10%", textAr: "10%", correct: false },
            { text: "0%", textAr: "0%", correct: false }
          ]
        },
        {
          id: 13,
          question: "ما هو أهم عنصر في خطة التداول؟",
          questionAr: "ما هو أهم عنصر في خطة التداول؟",
          options: [
            { text: "أن تكون مكتوبة على الورق", textAr: "أن تكون مكتوبة على الورق", correct: true },
            { text: "أن تكون معقدة", textAr: "أن تكون معقدة", correct: false },
            { text: "أن تضمن ربح 100%", textAr: "أن تضمن ربح 100%", correct: false },
            { text: "أن تكون في الرأس", textAr: "أن تكون في الرأس", correct: false }
          ]
        },
        {
          id: 14,
          question: "ما هو الفترة الصعبة في التداول؟",
          questionAr: "ما هو الفترة الصعبة في التداول؟",
          options: [
            { text: "Drawdown - فترة تخسر فيها عدة صفقات", textAr: "Drawdown - فترة تخسر فيها عدة صفقات", correct: true },
            { text: "فترة الربح", textAr: "فترة الربح", correct: false },
            { text: "فترة الانتظار", textAr: "فترة الانتظار", correct: false },
            { text: "فترة الدراسة", textAr: "فترة الدراسة", correct: false }
          ]
        },
        {
          id: 15,
          question: "كم ساعة نوم يجب أن تنام يومياً؟",
          questionAr: "كم ساعة نوم يجب أن تنام يومياً؟",
          options: [
            { text: "7-8 ساعات", textAr: "7-8 ساعات", correct: true },
            { text: "4-5 ساعات", textAr: "4-5 ساعات", correct: false },
            { text: "10-12 ساعة", textAr: "10-12 ساعة", correct: false },
            { text: "كم ما تقدر", textAr: "كم ما تقدر", correct: false }
          ]
        },
        {
          id: 16,
          question: "ما هو أهم عنصر في إدارة التوقعات؟",
          questionAr: "ما هو أهم عنصر في إدارة التوقعات؟",
          options: [
            { text: "فهم أن الخسائر طبيعية", textAr: "فهم أن الخسائر طبيعية", correct: true },
            { text: "توقع أرباح 100%", textAr: "توقع أرباح 100%", correct: false },
            { text: "عدم قبول خسارة", textAr: "عدم قبول خسارة", correct: false },
            { text: "التداول بدون خطة", textAr: "التداول بدون خطة", correct: false }
          ]
        },
        {
          id: 17,
          question: "كم مرة تأخذ فترة راحة أثناء التداول؟",
          questionAr: "كم مرة تأخذ فترة راحة أثناء التداول؟",
          options: [
            { text: "كل ساعة، 10 دقائق", textAr: "كل ساعة، 10 دقائق", correct: true },
            { text: "كل 4 ساعات", textAr: "كل 4 ساعات", correct: false },
            { text: "لا تأخذ راحة", textAr: "لا تأخذ راحة", correct: false },
            { text: "عند التعب فقط", textAr: "عند التعب فقط", correct: false }
          ]
        },
        {
          id: 18,
          question: "ما هو هرمون التوتر الذي ينتجه الدماغ؟",
          questionAr: "ما هو هرمون التوتر الذي ينتجه الدماغ؟",
          options: [
            { text: "الكورتيزول", textAr: "الكورتيزول", correct: true },
            { text: "الأدرينالين", textAr: "الأدرينالين", correct: false },
            { text: "السيروتونين", textAr: "السيروتونين", correct: false },
            { text: "الدوبامين", textAr: "الدوبامين", correct: false }
          ]
        },
        {
          id: 19,
          question: "كم ساعة يحتاج متداول يومي؟",
          questionAr: "كم ساعة يحتاج متداول يومي؟",
          options: [
            { text: "4-8 ساعات", textAr: "4-8 ساعات", correct: true },
            { text: "1-2 ساعة", textAr: "1-2 ساعة", correct: false },
            { text: "30 دقيقة", textAr: "30 دقيقة", correct: false },
            { text: "طول اليوم", textAr: "طول اليوم", correct: false }
          ]
        },
        {
          id: 20,
          question: "كم ساعة يحتاج متداول طويل المدى؟",
          questionAr: "كم ساعة يحتاج متداول طويل المدى؟",
          options: [
            { text: "30 دقيقة", textAr: "30 دقيقة", correct: true },
            { text: "1-2 ساعة", textAr: "1-2 ساعة", correct: false },
            { text: "4-8 ساعات", textAr: "4-8 ساعات", correct: false },
            { text: "طول اليوم", textAr: "طول اليوم", correct: false }
          ]
        }
      ],
      passingScore: 30, // 15 من 20 (75%)
      totalPoints: 40
    }
  }
};

export default quizzesData;
