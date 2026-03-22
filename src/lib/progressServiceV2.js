import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';

/**
 * نظام تتبع التقدم التعليمي المحسّن (Progress Tracking System V2)
 * مع نظام القفل المتسلسل (Sequential Locking) للدروس الفردية
 */

const TOTAL_STAGES = 15;
const LESSONS_PER_STAGE = 12;
const PASSING_SCORE = 75; // 15/20
const MINI_QUIZ_INTERVAL = 3; // اختبار قصير بعد كل 3 دروس

// ============ إنشاء/تحديث ملف التقدم ============

/**
 * إنشاء ملف تقدم جديد للمستخدم مع نظام القفل المتسلسل
 */
export const initializeUserProgressV2 = async (userId, userName, email) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(progressRef);

    if (!progressDoc.exists()) {
      await setDoc(progressRef, {
        userId,
        userName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        overallProgress: 0,
        completedStages: 0,
        completedLessons: 0,
        totalPoints: 0,
        
        stagesStatus: initializeStagesStatusV2(),
        
        achievements: [],
        badges: [],
        
        stats: {
          totalTimeSpent: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          quizzesTaken: 0,
          quizzesPass: 0,
          passRate: 0,
          miniQuizzesTaken: 0,
          miniQuizzesPass: 0
        },
        
        lastActivityAt: serverTimestamp(),
        lastCompletedStage: -1,
        currentStage: 0,
      });

      console.log('✅ تم إنشاء ملف التقدم (V2) للمستخدم:', userId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ خطأ في إنشاء ملف التقدم:', error);
    throw error;
  }
};

/**
 * تهيئة حالة المراحل مع نظام القفل المتسلسل للدروس
 */
const initializeStagesStatusV2 = () => {
  const stages = {};
  for (let i = 0; i < TOTAL_STAGES; i++) {
    stages[`stage_${i}`] = {
      stageId: i,
      isUnlocked: i === 0,
      isCompleted: false,
      completedAt: null,
      
      // حالة الدروس الفردية (مع نظام القفل المتسلسل)
      lessonsStatus: initializeLessonsStatus(),
      lessonsProgress: 0,
      
      // الاختبارات القصيرة (Mini-Quizzes)
      miniQuizzes: initializeMiniQuizzes(),
      
      // الاختبار النهائي
      stageExam: {
        isTaken: false,
        score: 0,
        maxScore: 20,
        isPassed: false,
        passedAt: null,
        attempts: 0,
        maxAttempts: 3,
        canRetake: true,
        retryAfter: null
      },
      
      timeSpent: 0,
      pointsEarned: 0,
    };
  }
  return stages;
};

/**
 * تهيئة حالة الدروس الفردية (الدرس الأول مفتوح فقط)
 */
const initializeLessonsStatus = () => {
  const lessons = {};
  for (let i = 0; i < LESSONS_PER_STAGE; i++) {
    lessons[`lesson_${i}`] = {
      lessonId: i,
      isUnlocked: i === 0, // فقط الدرس الأول مفتوح
      isCompleted: false,
      completedAt: null,
      timeSpent: 0,
      pointsEarned: 0,
      attempts: 0,
      lastAttemptAt: null
    };
  }
  return lessons;
};

/**
 * تهيئة الاختبارات القصيرة (بعد كل 3 دروس)
 */
const initializeMiniQuizzes = () => {
  const quizzes = {};
  // سيكون هناك 4 اختبارات قصيرة (بعد الدرس 2، 5، 8، 11)
  for (let i = 1; i <= 4; i++) {
    quizzes[`miniQuiz_${i}`] = {
      quizId: i,
      lessonAfter: i * 3 - 1, // بعد الدرس 2، 5، 8، 11
      isTaken: false,
      score: 0,
      maxScore: 10,
      isPassed: false,
      passedAt: null,
      attempts: 0,
      maxAttempts: 2
    };
  }
  return quizzes;
};

// ============ إدارة الدروس الفردية ============

/**
 * الحصول على حالة درس معين
 */
export const getLessonStatus = async (userId, stageId, lessonId) => {
  try {
    const progress = await getUserProgress(userId);
    const stageKey = `stage_${stageId}`;
    const lessonKey = `lesson_${lessonId}`;
    
    if (progress?.stagesStatus[stageKey]?.lessonsStatus[lessonKey]) {
      return progress.stagesStatus[stageKey].lessonsStatus[lessonKey];
    }
    return null;
  } catch (error) {
    console.error('❌ خطأ في الحصول على حالة الدرس:', error);
    throw error;
  }
};

/**
 * التحقق من ما إذا كان الدرس مفتوحاً
 */
export const isLessonUnlocked = async (userId, stageId, lessonId) => {
  try {
    const lessonStatus = await getLessonStatus(userId, stageId, lessonId);
    return lessonStatus ? lessonStatus.isUnlocked : false;
  } catch (error) {
    console.error('❌ خطأ في التحقق من فتح الدرس:', error);
    throw error;
  }
};

/**
 * تسجيل إكمال درس وفتح الدرس التالي تلقائياً
 */
export const markLessonAsCompleteV2 = async (userId, stageId, lessonId, timeSpent = 0) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progress = await getUserProgress(userId);

    if (!progress) {
      throw new Error('ملف التقدم غير موجود');
    }

    const stageKey = `stage_${stageId}`;
    const lessonKey = `lesson_${lessonId}`;
    const stageStatus = progress.stagesStatus[stageKey];
    const lessonStatus = stageStatus.lessonsStatus[lessonKey];

    if (!lessonStatus.isCompleted) {
      // تسجيل إكمال الدرس
      await updateDoc(progressRef, {
        [`stagesStatus.${stageKey}.lessonsStatus.${lessonKey}.isCompleted`]: true,
        [`stagesStatus.${stageKey}.lessonsStatus.${lessonKey}.completedAt`]: serverTimestamp(),
        [`stagesStatus.${stageKey}.lessonsStatus.${lessonKey}.timeSpent`]: timeSpent,
        [`stagesStatus.${stageKey}.lessonsStatus.${lessonKey}.pointsEarned`]: 10,
        completedLessons: increment(1),
        [`stats.totalTimeSpent`]: increment(timeSpent),
        lastActivityAt: serverTimestamp(),
        currentStage: stageId,
      });

      // فتح الدرس التالي تلقائياً (إن وجد)
      if (lessonId < LESSONS_PER_STAGE - 1) {
        const nextLessonKey = `lesson_${lessonId + 1}`;
        await updateDoc(progressRef, {
          [`stagesStatus.${stageKey}.lessonsStatus.${nextLessonKey}.isUnlocked`]: true,
        });
        console.log(`✅ تم فتح الدرس ${lessonId + 1} من المرحلة ${stageId}`);
      }

      // تحديث نسبة إكمال الدروس
      const completedCount = Object.values(stageStatus.lessonsStatus).filter(l => l.isCompleted).length + 1;
      const lessonsProgress = Math.round((completedCount / LESSONS_PER_STAGE) * 100);
      
      await updateDoc(progressRef, {
        [`stagesStatus.${stageKey}.lessonsProgress`]: lessonsProgress,
      });

      // إضافة إلى السجل
      await addActivityLog(userId, 'LESSON_COMPLETED', {
        stageId,
        lessonId,
        timeSpent
      });

      console.log(`✅ تم تسجيل إكمال الدرس ${lessonId} من المرحلة ${stageId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ خطأ في تسجيل إكمال الدرس:', error);
    throw error;
  }
};

// ============ إدارة الاختبارات القصيرة (Mini-Quizzes) ============

/**
 * تسجيل نتيجة اختبار قصير
 */
export const submitMiniQuiz = async (userId, stageId, quizId, score, maxScore = 10) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progress = await getUserProgress(userId);

    if (!progress) {
      throw new Error('ملف التقدم غير موجود');
    }

    const stageKey = `stage_${stageId}`;
    const miniQuizKey = `miniQuiz_${quizId}`;
    const stageStatus = progress.stagesStatus[stageKey];
    const miniQuiz = stageStatus.miniQuizzes[miniQuizKey];
    const isPassed = (score / maxScore) * 100 >= 70; // 70% للنجاح في الاختبار القصير

    await updateDoc(progressRef, {
      [`stagesStatus.${stageKey}.miniQuizzes.${miniQuizKey}.isTaken`]: true,
      [`stagesStatus.${stageKey}.miniQuizzes.${miniQuizKey}.score`]: score,
      [`stagesStatus.${stageKey}.miniQuizzes.${miniQuizKey}.isPassed`]: isPassed,
      [`stagesStatus.${stageKey}.miniQuizzes.${miniQuizKey}.attempts`]: increment(1),
      [`stagesStatus.${stageKey}.miniQuizzes.${miniQuizKey}.passedAt`]: isPassed ? serverTimestamp() : null,
      [`stats.miniQuizzesTaken`]: increment(1),
      [`stats.miniQuizzesPass`]: isPassed ? increment(1) : increment(0),
      lastActivityAt: serverTimestamp(),
    });

    await addActivityLog(userId, 'MINI_QUIZ_SUBMITTED', {
      stageId,
      quizId,
      score,
      isPassed
    });

    return {
      isPassed,
      score,
      attempts: miniQuiz.attempts + 1
    };
  } catch (error) {
    console.error('❌ خطأ في تسجيل نتيجة الاختبار القصير:', error);
    throw error;
  }
};

// ============ إدارة الاختبار النهائي ============

/**
 * تسجيل نتيجة اختبار المرحلة النهائي
 */
export const submitStageExamV2 = async (userId, stageId, score, maxScore = 20) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progress = await getUserProgress(userId);

    if (!progress) {
      throw new Error('ملف التقدم غير موجود');
    }

    const stageKey = `stage_${stageId}`;
    const stageStatus = progress.stagesStatus[stageKey];
    const isPassed = (score / maxScore) * 100 >= PASSING_SCORE;
    const newAttempts = stageStatus.stageExam.attempts + 1;

    await updateDoc(progressRef, {
      [`stagesStatus.${stageKey}.stageExam.isTaken`]: true,
      [`stagesStatus.${stageKey}.stageExam.score`]: score,
      [`stagesStatus.${stageKey}.stageExam.isPassed`]: isPassed,
      [`stagesStatus.${stageKey}.stageExam.attempts`]: newAttempts,
      [`stagesStatus.${stageKey}.stageExam.passedAt`]: isPassed ? serverTimestamp() : null,
      [`stats.quizzesTaken`]: increment(1),
      [`stats.quizzesPass`]: isPassed ? increment(1) : increment(0),
      lastActivityAt: serverTimestamp(),
    });

    // إذا نجح، فتح المرحلة التالية
    if (isPassed && stageId < TOTAL_STAGES - 1) {
      const nextStageKey = `stage_${stageId + 1}`;
      await updateDoc(progressRef, {
        [`stagesStatus.${nextStageKey}.isUnlocked`]: true,
        [`stagesStatus.${stageKey}.isCompleted`]: true,
        [`stagesStatus.${stageKey}.completedAt`]: serverTimestamp(),
        completedStages: increment(1),
      });

      // إضافة إنجاز
      await addAchievement(userId, {
        type: 'STAGE_COMPLETED',
        stageId,
        earnedAt: serverTimestamp(),
        points: 100
      });

      console.log(`✅ تم فتح المرحلة ${stageId + 1} بعد نجاح المرحلة ${stageId}`);
    }

    await addActivityLog(userId, 'EXAM_SUBMITTED', {
      stageId,
      score,
      isPassed,
      attempts: newAttempts
    });

    await updatePassRate(userId);

    return {
      isPassed,
      score,
      attempts: newAttempts,
      nextStageUnlocked: isPassed && stageId < TOTAL_STAGES - 1
    };
  } catch (error) {
    console.error('❌ خطأ في تسجيل نتيجة الاختبار:', error);
    throw error;
  }
};

// ============ دوال مساعدة ============

export const getUserProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(progressRef);
    return progressDoc.exists() ? progressDoc.data() : null;
  } catch (error) {
    console.error('❌ خطأ في الحصول على بيانات التقدم:', error);
    throw error;
  }
};

export const getProgressSummary = async (userId) => {
  try {
    const progress = await getUserProgress(userId);
    if (!progress) return null;

    const overallProgress = Math.round((progress.completedStages / TOTAL_STAGES) * 100);

    return {
      userId,
      userName: progress.userName,
      overallProgress,
      completedStages: progress.completedStages,
      totalStages: TOTAL_STAGES,
      completedLessons: progress.completedLessons,
      totalLessons: TOTAL_STAGES * LESSONS_PER_STAGE,
      totalPoints: progress.totalPoints,
      achievements: progress.achievements.length,
      badges: progress.badges.length,
      stats: progress.stats,
      lastActivityAt: progress.lastActivityAt,
      currentStage: progress.currentStage,
    };
  } catch (error) {
    console.error('❌ خطأ في الحصول على ملخص التقدم:', error);
    throw error;
  }
};

export const addAchievement = async (userId, achievement) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    await updateDoc(progressRef, {
      achievements: arrayUnion(achievement),
      totalPoints: increment(achievement.points || 0)
    });
    return true;
  } catch (error) {
    console.error('❌ خطأ في إضافة الإنجاز:', error);
    throw error;
  }
};

export const addActivityLog = async (userId, activityType, details = {}) => {
  try {
    const logsRef = collection(db, 'userProgress', userId, 'activityLogs');
    await setDoc(doc(logsRef), {
      userId,
      activityType,
      details,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('❌ خطأ في تسجيل النشاط:', error);
    throw error;
  }
};

const updatePassRate = async (userId) => {
  try {
    const progress = await getUserProgress(userId);
    const passRate = progress.stats.quizzesTaken > 0 
      ? Math.round((progress.stats.quizzesPass / progress.stats.quizzesTaken) * 100)
      : 0;

    const progressRef = doc(db, 'userProgress', userId);
    await updateDoc(progressRef, {
      [`stats.passRate`]: passRate
    });
  } catch (error) {
    console.error('❌ خطأ في تحديث نسبة النجاح:', error);
  }
};

export default {
  initializeUserProgressV2,
  getLessonStatus,
  isLessonUnlocked,
  markLessonAsCompleteV2,
  submitMiniQuiz,
  submitStageExamV2,
  getUserProgress,
  getProgressSummary,
  addAchievement,
  addActivityLog,
};
