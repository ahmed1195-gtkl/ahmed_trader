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
 * نظام تتبع التقدم التعليمي (Progress Tracking System)
 * يدير تقدم المستخدم عبر المراحل والدروس
 */

// ============ البيانات الأساسية ============

const TOTAL_STAGES = 15; // المراحل من 0 إلى 14
const LESSONS_PER_STAGE = 12; // متوسط الدروس لكل مرحلة
const PASSING_SCORE = 75; // درجة النجاح (15/20)

// ============ إنشاء/تحديث ملف التقدم ============

/**
 * إنشاء ملف تقدم جديد للمستخدم
 * @param {string} userId - معرف المستخدم
 * @param {string} userName - اسم المستخدم
 * @param {string} email - بريد المستخدم
 */
export const initializeUserProgress = async (userId, userName, email) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(progressRef);

    if (!progressDoc.exists()) {
      // إنشاء ملف تقدم جديد
      await setDoc(progressRef, {
        userId,
        userName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // ملخص التقدم العام
        overallProgress: 0, // نسبة التقدم الإجمالي (0-100)
        completedStages: 0, // عدد المراحل المكتملة
        completedLessons: 0, // إجمالي الدروس المكتملة
        totalPoints: 0, // النقاط الإجمالية
        
        // حالة المراحل
        stagesStatus: initializeStagesStatus(),
        
        // الإنجازات والأوسمة
        achievements: [],
        badges: [],
        
        // الإحصائيات
        stats: {
          totalTimeSpent: 0, // إجمالي الوقت المستغرق (بالدقائق)
          averageScore: 0, // متوسط الدرجات
          highestScore: 0, // أعلى درجة
          lowestScore: 0, // أقل درجة
          quizzesTaken: 0, // عدد الاختبارات المأخوذة
          quizzesPass: 0, // عدد الاختبارات الناجحة
          passRate: 0 // نسبة النجاح
        },
        
        // آخر نشاط
        lastActivityAt: serverTimestamp(),
        lastCompletedStage: -1, // آخر مرحلة مكتملة
        currentStage: 0, // المرحلة الحالية
      });

      console.log('✅ تم إنشاء ملف التقدم للمستخدم:', userId);
      return true;
    }
    
    return false; // الملف موجود بالفعل
  } catch (error) {
    console.error('❌ خطأ في إنشاء ملف التقدم:', error);
    throw error;
  }
};

/**
 * تهيئة حالة المراحل (جميع المراحل مقفلة ما عدا الأولى)
 */
const initializeStagesStatus = () => {
  const stages = {};
  for (let i = 0; i < TOTAL_STAGES; i++) {
    stages[`stage_${i}`] = {
      stageId: i,
      isUnlocked: i === 0, // فقط المرحلة الأولى مفتوحة
      isCompleted: false,
      completedAt: null,
      
      // حالة الدروس
      completedLessons: [],
      totalLessons: LESSONS_PER_STAGE,
      lessonsProgress: 0, // نسبة إكمال الدروس (0-100)
      
      // الاختبار النهائي
      stageExam: {
        isTaken: false,
        score: 0,
        maxScore: 20,
        isPassed: false,
        passedAt: null,
        attempts: 0,
        maxAttempts: 3
      },
      
      // الإحصائيات
      timeSpent: 0, // الوقت المستغرق (بالدقائق)
      pointsEarned: 0, // النقاط المكتسبة
    };
  }
  return stages;
};

// ============ الحصول على بيانات التقدم ============

/**
 * الحصول على ملف التقدم الكامل للمستخدم
 * @param {string} userId - معرف المستخدم
 */
export const getUserProgress = async (userId) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
      return progressDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('❌ خطأ في الحصول على بيانات التقدم:', error);
    throw error;
  }
};

/**
 * الحصول على حالة مرحلة معينة
 * @param {string} userId - معرف المستخدم
 * @param {number} stageId - معرف المرحلة
 */
export const getStageStatus = async (userId, stageId) => {
  try {
    const progress = await getUserProgress(userId);
    if (progress && progress.stagesStatus[`stage_${stageId}`]) {
      return progress.stagesStatus[`stage_${stageId}`];
    }
    return null;
  } catch (error) {
    console.error('❌ خطأ في الحصول على حالة المرحلة:', error);
    throw error;
  }
};

/**
 * التحقق من ما إذا كانت المرحلة مفتوحة
 * @param {string} userId - معرف المستخدم
 * @param {number} stageId - معرف المرحلة
 */
export const isStageUnlocked = async (userId, stageId) => {
  try {
    const stageStatus = await getStageStatus(userId, stageId);
    return stageStatus ? stageStatus.isUnlocked : false;
  } catch (error) {
    console.error('❌ خطأ في التحقق من فتح المرحلة:', error);
    throw error;
  }
};

// ============ تحديث حالة الدروس ============

/**
 * تسجيل إكمال درس معين
 * @param {string} userId - معرف المستخدم
 * @param {number} stageId - معرف المرحلة
 * @param {number} lessonId - معرف الدرس
 * @param {number} timeSpent - الوقت المستغرق (بالدقائق)
 */
export const markLessonAsComplete = async (userId, stageId, lessonId, timeSpent = 0) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progress = await getUserProgress(userId);

    if (!progress) {
      throw new Error('ملف التقدم غير موجود');
    }

    const stageKey = `stage_${stageId}`;
    const stageStatus = progress.stagesStatus[stageKey];

    // التحقق من عدم تكرار إكمال نفس الدرس
    if (!stageStatus.completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...stageStatus.completedLessons, lessonId];
      const lessonsProgress = Math.round((newCompletedLessons.length / LESSONS_PER_STAGE) * 100);

      // تحديث بيانات المرحلة
      await updateDoc(progressRef, {
        [`stagesStatus.${stageKey}.completedLessons`]: newCompletedLessons,
        [`stagesStatus.${stageKey}.lessonsProgress`]: lessonsProgress,
        [`stagesStatus.${stageKey}.timeSpent`]: increment(timeSpent),
        completedLessons: increment(1),
        [`stats.totalTimeSpent`]: increment(timeSpent),
        lastActivityAt: serverTimestamp(),
        currentStage: stageId,
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

    return false; // الدرس مكتمل بالفعل
  } catch (error) {
    console.error('❌ خطأ في تسجيل إكمال الدرس:', error);
    throw error;
  }
};

// ============ إدارة الاختبارات ============

/**
 * تسجيل نتيجة اختبار المرحلة
 * @param {string} userId - معرف المستخدم
 * @param {number} stageId - معرف المرحلة
 * @param {number} score - الدرجة المحصول عليها
 * @param {number} maxScore - أقصى درجة (عادة 20)
 */
export const submitStageExam = async (userId, stageId, score, maxScore = 20) => {
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

    // تحديث نتائج الاختبار
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

    // إضافة إلى السجل
    await addActivityLog(userId, 'EXAM_SUBMITTED', {
      stageId,
      score,
      isPassed,
      attempts: newAttempts
    });

    // تحديث نسبة النجاح
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

// ============ الإنجازات والأوسمة ============

/**
 * إضافة إنجاز للمستخدم
 * @param {string} userId - معرف المستخدم
 * @param {object} achievement - بيانات الإنجاز
 */
export const addAchievement = async (userId, achievement) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    
    await updateDoc(progressRef, {
      achievements: arrayUnion(achievement),
      totalPoints: increment(achievement.points || 0)
    });

    console.log('✅ تم إضافة إنجاز:', achievement.type);
    return true;
  } catch (error) {
    console.error('❌ خطأ في إضافة الإنجاز:', error);
    throw error;
  }
};

/**
 * منح وسام للمستخدم
 * @param {string} userId - معرف المستخدم
 * @param {string} badgeType - نوع الوسام
 */
export const awardBadge = async (userId, badgeType) => {
  try {
    const progressRef = doc(db, 'userProgress', userId);
    const progress = await getUserProgress(userId);

    if (!progress.badges.includes(badgeType)) {
      await updateDoc(progressRef, {
        badges: arrayUnion(badgeType)
      });

      console.log('✅ تم منح الوسام:', badgeType);
      return true;
    }

    return false; // الوسام موجود بالفعل
  } catch (error) {
    console.error('❌ خطأ في منح الوسام:', error);
    throw error;
  }
};

// ============ الإحصائيات والتقارير ============

/**
 * تحديث نسبة النجاح
 * @param {string} userId - معرف المستخدم
 */
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

/**
 * الحصول على ملخص التقدم
 * @param {string} userId - معرف المستخدم
 */
export const getProgressSummary = async (userId) => {
  try {
    const progress = await getUserProgress(userId);

    if (!progress) {
      return null;
    }

    // حساب نسبة التقدم الإجمالي
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

// ============ سجل النشاط ============

/**
 * إضافة نشاط إلى سجل المستخدم
 * @param {string} userId - معرف المستخدم
 * @param {string} activityType - نوع النشاط
 * @param {object} details - تفاصيل النشاط
 */
export const addActivityLog = async (userId, activityType, details = {}) => {
  try {
    const logsRef = collection(db, 'userProgress', userId, 'activityLogs');
    
    await setDoc(doc(logsRef), {
      userId,
      activityType,
      details,
      timestamp: serverTimestamp(),
    });

    console.log(`📝 تم تسجيل النشاط: ${activityType}`);
    return true;
  } catch (error) {
    console.error('❌ خطأ في تسجيل النشاط:', error);
    throw error;
  }
};

/**
 * الحصول على سجل النشاط
 * @param {string} userId - معرف المستخدم
 * @param {number} limit - عدد السجلات المطلوبة
 */
export const getActivityLogs = async (userId, limit = 50) => {
  try {
    const logsRef = collection(db, 'userProgress', userId, 'activityLogs');
    const q = query(logsRef);
    const snapshot = await getDocs(q);

    const logs = [];
    snapshot.forEach(doc => {
      logs.push(doc.data());
    });

    return logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  } catch (error) {
    console.error('❌ خطأ في الحصول على سجل النشاط:', error);
    throw error;
  }
};

// ============ دوال مساعدة ============

/**
 * حساب نسبة التقدم الإجمالي
 * @param {object} progress - بيانات التقدم
 */
export const calculateOverallProgress = (progress) => {
  if (!progress || !progress.stagesStatus) {
    return 0;
  }

  let totalLessons = 0;
  let completedLessons = 0;

  for (let i = 0; i < TOTAL_STAGES; i++) {
    const stageKey = `stage_${i}`;
    const stage = progress.stagesStatus[stageKey];
    
    totalLessons += stage.totalLessons;
    completedLessons += stage.completedLessons.length;
  }

  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
};

/**
 * الحصول على قائمة المراحل المفتوحة
 * @param {object} progress - بيانات التقدم
 */
export const getUnlockedStages = (progress) => {
  if (!progress || !progress.stagesStatus) {
    return [];
  }

  const unlockedStages = [];
  for (let i = 0; i < TOTAL_STAGES; i++) {
    const stageKey = `stage_${i}`;
    if (progress.stagesStatus[stageKey].isUnlocked) {
      unlockedStages.push(i);
    }
  }

  return unlockedStages;
};

/**
 * الحصول على المرحلة التالية المقفلة
 * @param {object} progress - بيانات التقدم
 */
export const getNextLockedStage = (progress) => {
  if (!progress || !progress.stagesStatus) {
    return 1;
  }

  for (let i = 0; i < TOTAL_STAGES; i++) {
    const stageKey = `stage_${i}`;
    if (!progress.stagesStatus[stageKey].isUnlocked) {
      return i;
    }
  }

  return TOTAL_STAGES; // جميع المراحل مكتملة
};

export default {
  initializeUserProgress,
  getUserProgress,
  getStageStatus,
  isStageUnlocked,
  markLessonAsComplete,
  submitStageExam,
  addAchievement,
  awardBadge,
  getProgressSummary,
  addActivityLog,
  getActivityLogs,
  calculateOverallProgress,
  getUnlockedStages,
  getNextLockedStage,
};
