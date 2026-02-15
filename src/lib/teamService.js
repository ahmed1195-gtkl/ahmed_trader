import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment 
} from 'firebase/firestore';

/**
 * توليد كود دعوة فريد
 */
function generateInviteCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 9; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/**
 * إنشاء فريق جديد
 */
export async function createTeam(challengeId, leaderId, leaderName, teamName) {
  try {
    // التحقق من أن المستخدم ليس في فريق آخر في نفس التحدي
    const existingTeamQuery = query(
      collection(db, 'teams'),
      where('challengeId', '==', challengeId),
      where('members', 'array-contains', leaderId)
    );
    const existingTeams = await getDocs(existingTeamQuery);
    
    if (!existingTeams.empty) {
      throw new Error('You are already in a team for this challenge');
    }

    // توليد كود دعوة فريد
    let inviteCode = generateInviteCode();
    let codeExists = true;
    
    // التأكد من أن الكود فريد
    while (codeExists) {
      const inviteQuery = query(
        collection(db, 'team_invites'),
        where('inviteCode', '==', inviteCode)
      );
      const inviteSnap = await getDocs(inviteQuery);
      if (inviteSnap.empty) {
        codeExists = false;
      } else {
        inviteCode = generateInviteCode();
      }
    }

    // إنشاء الفريق
    const teamRef = doc(collection(db, 'teams'));
    await setDoc(teamRef, {
      challengeId,
      name: teamName || `${leaderName}'s Team`,
      leaderId,
      leaderName,
      members: [leaderId],
      memberNames: [leaderName],
      inviteCode,
      createdAt: serverTimestamp(),
      status: 'active',
      totalMembers: 1
    });

    // إنشاء رابط الدعوة
    const inviteRef = doc(collection(db, 'team_invites'));
    await setDoc(inviteRef, {
      teamId: teamRef.id,
      inviteCode,
      createdBy: leaderId,
      challengeId,
      createdAt: serverTimestamp(),
      expiresAt: null, // لا ينتهي
      maxUses: 50, // حد أقصى 50 استخدام
      usedCount: 0
    });

    // إضافة رسالة ترحيبية في الدردشة
    await addTeamMessage(teamRef.id, 'system', 'System', `Team "${teamName || `${leaderName}'s Team`}" has been created!`, 'system');

    return {
      teamId: teamRef.id,
      inviteCode
    };
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

/**
 * الانضمام إلى فريق باستخدام كود الدعوة
 */
export async function joinTeam(inviteCode, userId, userName) {
  try {
    // البحث عن الدعوة
    const inviteQuery = query(
      collection(db, 'team_invites'),
      where('inviteCode', '==', inviteCode.toUpperCase())
    );
    const inviteSnap = await getDocs(inviteQuery);

    if (inviteSnap.empty) {
      throw new Error('Invalid invite code');
    }

    const inviteData = inviteSnap.docs[0].data();
    const inviteId = inviteSnap.docs[0].id;

    // التحقق من عدد الاستخدامات
    if (inviteData.usedCount >= inviteData.maxUses) {
      throw new Error('This invite code has reached its maximum uses');
    }

    // التحقق من انتهاء الصلاحية
    if (inviteData.expiresAt && inviteData.expiresAt.toDate() < new Date()) {
      throw new Error('This invite code has expired');
    }

    // الحصول على معلومات الفريق
    const teamRef = doc(db, 'teams', inviteData.teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data();

    // التحقق من أن المستخدم ليس عضواً بالفعل
    if (teamData.members.includes(userId)) {
      throw new Error('You are already a member of this team');
    }

    // التحقق من أن المستخدم ليس في فريق آخر في نفس التحدي
    const existingTeamQuery = query(
      collection(db, 'teams'),
      where('challengeId', '==', teamData.challengeId),
      where('members', 'array-contains', userId)
    );
    const existingTeams = await getDocs(existingTeamQuery);
    
    if (!existingTeams.empty) {
      throw new Error('You are already in another team for this challenge');
    }

    // إضافة العضو إلى الفريق
    await updateDoc(teamRef, {
      members: arrayUnion(userId),
      memberNames: arrayUnion(userName),
      totalMembers: increment(1)
    });

    // تحديث عدد استخدامات الدعوة
    await updateDoc(doc(db, 'team_invites', inviteId), {
      usedCount: increment(1)
    });

    // إضافة رسالة في الدردشة
    await addTeamMessage(inviteData.teamId, 'system', 'System', `${userName} joined the team!`, 'system');

    return {
      teamId: inviteData.teamId,
      teamName: teamData.name
    };
  } catch (error) {
    console.error('Error joining team:', error);
    throw error;
  }
}

/**
 * مغادرة الفريق
 */
export async function leaveTeam(teamId, userId, userName) {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data();

    // لا يمكن للقائد المغادرة
    if (teamData.leaderId === userId) {
      throw new Error('Team leader cannot leave. Transfer leadership or delete the team.');
    }

    // إزالة العضو من الفريق
    await updateDoc(teamRef, {
      members: arrayRemove(userId),
      memberNames: arrayRemove(userName),
      totalMembers: increment(-1)
    });

    // إضافة رسالة في الدردشة
    await addTeamMessage(teamId, 'system', 'System', `${userName} left the team`, 'system');

    return true;
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
}

/**
 * طرد عضو من الفريق (للقائد فقط)
 */
export async function removeMember(teamId, leaderId, memberId, memberName) {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data();

    // التحقق من أن المستخدم هو القائد
    if (teamData.leaderId !== leaderId) {
      throw new Error('Only the team leader can remove members');
    }

    // لا يمكن طرد القائد نفسه
    if (memberId === leaderId) {
      throw new Error('Cannot remove the team leader');
    }

    // إزالة العضو من الفريق
    await updateDoc(teamRef, {
      members: arrayRemove(memberId),
      memberNames: arrayRemove(memberName),
      totalMembers: increment(-1)
    });

    // إضافة رسالة في الدردشة
    await addTeamMessage(teamId, 'system', 'System', `${memberName} was removed from the team`, 'system');

    return true;
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}

/**
 * حذف الفريق (للقائد فقط)
 */
export async function deleteTeam(teamId, leaderId) {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data();

    // التحقق من أن المستخدم هو القائد
    if (teamData.leaderId !== leaderId) {
      throw new Error('Only the team leader can delete the team');
    }

    // حذف رابط الدعوة
    const inviteQuery = query(
      collection(db, 'team_invites'),
      where('teamId', '==', teamId)
    );
    const inviteSnap = await getDocs(inviteQuery);
    const deleteInvitePromises = inviteSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteInvitePromises);

    // حذف رسائل الدردشة
    const chatQuery = query(
      collection(db, 'team_chat'),
      where('teamId', '==', teamId)
    );
    const chatSnap = await getDocs(chatQuery);
    const deleteChatPromises = chatSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteChatPromises);

    // حذف الفريق
    await deleteDoc(teamRef);

    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
}

/**
 * الحصول على معلومات الفريق
 */
export async function getTeam(teamId) {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      return null;
    }

    return {
      id: teamDoc.id,
      ...teamDoc.data()
    };
  } catch (error) {
    console.error('Error getting team:', error);
    return null;
  }
}

/**
 * الحصول على فريق المستخدم في تحدي معين
 */
export async function getUserTeam(userId, challengeId) {
  try {
    const teamQuery = query(
      collection(db, 'teams'),
      where('challengeId', '==', challengeId),
      where('members', 'array-contains', userId)
    );
    const teamSnap = await getDocs(teamQuery);

    if (teamSnap.empty) {
      return null;
    }

    return {
      id: teamSnap.docs[0].id,
      ...teamSnap.docs[0].data()
    };
  } catch (error) {
    console.error('Error getting user team:', error);
    return null;
  }
}

/**
 * إضافة رسالة في دردشة الفريق
 */
export async function addTeamMessage(teamId, userId, userName, message, type = 'text') {
  try {
    const messageRef = doc(collection(db, 'team_chat'));
    await setDoc(messageRef, {
      teamId,
      userId,
      userName,
      message,
      type,
      timestamp: serverTimestamp()
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error adding team message:', error);
    throw error;
  }
}

/**
 * الحصول على رسائل الفريق
 */
export async function getTeamMessages(teamId, limitCount = 50) {
  try {
    const messagesQuery = query(
      collection(db, 'team_chat'),
      where('teamId', '==', teamId)
    );
    const messagesSnap = await getDocs(messagesQuery);

    const messages = messagesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // ترتيب حسب الوقت
    messages.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return a.timestamp.toDate() - b.timestamp.toDate();
    });

    return messages.slice(-limitCount);
  } catch (error) {
    console.error('Error getting team messages:', error);
    return [];
  }
}

/**
 * الحصول على إحصائيات الفريق
 */
export async function getTeamStats(teamId) {
  try {
    const teamDoc = await getDoc(doc(db, 'teams', teamId));
    if (!teamDoc.exists()) {
      return null;
    }

    const teamData = teamDoc.data();
    const memberIds = teamData.members;

    // جلب بيانات المشاركين
    const participantsQuery = query(
      collection(db, 'challenge_participants'),
      where('challengeId', '==', teamData.challengeId)
    );
    const participantsSnap = await getDocs(participantsQuery);
    
    const teamParticipants = participantsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => memberIds.includes(p.userId));

    // حساب الإحصائيات
    const totalBalance = teamParticipants.reduce((sum, p) => sum + p.balance, 0);
    const totalProfit = teamParticipants.reduce((sum, p) => sum + (p.balance - p.initialBalance), 0);
    const totalTrades = teamParticipants.reduce((sum, p) => sum + (p.totalTrades || 0), 0);
    const avgDrawdown = teamParticipants.reduce((sum, p) => sum + (p.maxDrawdown || 0), 0) / teamParticipants.length;

    return {
      totalMembers: teamParticipants.length,
      totalBalance,
      totalProfit,
      totalTrades,
      avgDrawdown,
      participants: teamParticipants
    };
  } catch (error) {
    console.error('Error getting team stats:', error);
    return null;
  }
}

export default {
  createTeam,
  joinTeam,
  leaveTeam,
  removeMember,
  deleteTeam,
  getTeam,
  getUserTeam,
  addTeamMessage,
  getTeamMessages,
  getTeamStats
};
