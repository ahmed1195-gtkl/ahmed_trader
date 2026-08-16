import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

/**
 * Saves a lesson assessment result to Firestore under `users/{uid}/academyProgress/main`
 * and records history in `academyAssessments/{uid}_{schoolId}_{lessonId}`.
 */
export async function saveAssessmentResult({ schoolId, lessonId, score, totalQuestions, answers, timeSpentSeconds = 0 }) {
  const user = auth.currentUser;
  if (!user) {
    // Fallback to local storage if user is anonymous or offline
    const localData = JSON.parse(localStorage.getItem('academy_progress') || '{}');
    const key = `${schoolId}_lesson_${lessonId}`;
    const percentage = Math.round((score / totalQuestions) * 100);
    localData[key] = {
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 70,
      timestamp: new Date().toISOString(),
      timeSpentSeconds
    };
    localStorage.setItem('academy_progress', JSON.stringify(localData));
    return { success: true, localOnly: true, percentage, passed: percentage >= 70 };
  }

  const uid = user.uid;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;

  try {
    // 1. Detailed assessment attempt record
    const assessmentRef = doc(db, 'academyAssessments', `${uid}_${schoolId}_lesson_${lessonId}`);
    const existingDoc = await getDoc(assessmentRef);
    const prevAttempts = existingDoc.exists() ? existingDoc.data().attempts || 0 : 0;

    await setDoc(assessmentRef, {
      uid,
      schoolId,
      lessonId,
      score,
      totalQuestions,
      percentage,
      passed,
      answers,
      timeSpentSeconds,
      attempts: prevAttempts + 1,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    // 2. User main progress document
    const userProgressRef = doc(db, 'users', uid, 'academyProgress', 'main');
    const userProgressSnap = await getDoc(userProgressRef);

    if (userProgressSnap.exists()) {
      await updateDoc(userProgressRef, {
        completedLessons: passed ? arrayUnion(`${schoolId}_${lessonId}`) : userProgressSnap.data().completedLessons || [],
        [`scores.${schoolId}_${lessonId}`]: percentage,
        lastActiveLesson: { schoolId, lessonId, timestamp: new Date().toISOString() }
      });
    } else {
      await setDoc(userProgressRef, {
        completedLessons: passed ? [`${schoolId}_${lessonId}`] : [],
        scores: { [`${schoolId}_${lessonId}`]: percentage },
        lastActiveLesson: { schoolId, lessonId, timestamp: new Date().toISOString() }
      });
    }

    return { success: true, percentage, passed, attempts: prevAttempts + 1 };
  } catch (error) {
    console.error('[AssessmentService] Error saving assessment result:', error);
    // Graceful fallback to local storage on network error
    return { success: false, error: error.message, percentage, passed };
  }
}

/**
 * Retrieves assessment history for a specific lesson
 */
export async function getLessonAssessmentHistory(schoolId, lessonId) {
  const user = auth.currentUser;
  if (!user) {
    const localData = JSON.parse(localStorage.getItem('academy_progress') || '{}');
    const key = `${schoolId}_lesson_${lessonId}`;
    return localData[key] || null;
  }

  try {
    const assessmentRef = doc(db, 'academyAssessments', `${user.uid}_${schoolId}_lesson_${lessonId}`);
    const docSnap = await getDoc(assessmentRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.error('[AssessmentService] Fetch history error:', err);
  }
  return null;
}
