import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  MapPin, 
  Calendar, 
  UserPlus, 
  UserCheck, 
  MessageCircle,
  ArrowLeft,
  Mail,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null); // null, 'pending', 'accepted'
  const [requestId, setRequestId] = useState(null);

  // مراقبة المستخدم الحالي
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // جلب بيانات المستخدم المطلوب
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfileUser({ id: userDoc.id, ...userDoc.data() });
        } else {
          toast.error(t('userNotFound') || 'User not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error(t('errorLoadingProfile') || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate, t]);

  // التحقق من حالة طلب الصداقة
  useEffect(() => {
    const checkFriendRequestStatus = async () => {
      if (!currentUser || !userId || currentUser.uid === userId) return;

      try {
        // التحقق من وجود طلب صداقة
        const requestsRef = collection(db, 'friend_requests');
        const q = query(
          requestsRef,
          where('senderId', '==', currentUser.uid),
          where('receiverId', '==', userId)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const request = snapshot.docs[0];
          setRequestId(request.id);
          setFriendRequestStatus(request.data().status);
        }
      } catch (error) {
        console.error('Error checking friend request:', error);
      }
    };

    checkFriendRequestStatus();
  }, [currentUser, userId]);

  const handleSendFriendRequest = async () => {
    if (!currentUser) {
      toast.error(t('pleaseLogin') || 'Please login first');
      return;
    }

    try {
      await addDoc(collection(db, 'friend_requests'), {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        senderPhoto: currentUser.photoURL || '',
        receiverId: userId,
        receiverName: profileUser.displayName || profileUser.email,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setFriendRequestStatus('pending');
      toast.success(t('friendRequestSent') || 'Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(t('errorSendingRequest') || 'Error sending request');
    }
  };

  const handleCancelFriendRequest = async () => {
    if (!requestId) return;

    try {
      await deleteDoc(doc(db, 'friend_requests', requestId));
      setFriendRequestStatus(null);
      setRequestId(null);
      toast.success(t('requestCancelled') || 'Request cancelled');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error(t('errorCancellingRequest') || 'Error cancelling request');
    }
  };

  const handleSendMessage = () => {
    // فتح نافذة الدردشة (يمكن تطويرها لاحقاً)
    toast.info(t('openChatWidget') || 'Open chat widget to send a message');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return null;
  }

  const isOwnProfile = currentUser?.uid === userId;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back') || 'Back'}</span>
        </button>

        {/* بطاقة الملف الشخصي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-[2rem] overflow-hidden"
        >
          {/* الخلفية */}
          <div className="h-48 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
          </div>

          {/* المحتوى */}
          <div className="px-8 pb-8">
            {/* الصورة الشخصية */}
            <div className="relative -mt-20 mb-6">
              {profileUser.photoURL ? (
                <img
                  src={profileUser.photoURL}
                  alt={profileUser.displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-black"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center border-4 border-black">
                  <User className="w-16 h-16 text-black" />
                </div>
              )}
              
              {profileUser.isAdmin && (
                <div className="absolute bottom-2 right-2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                  Admin
                </div>
              )}
            </div>

            {/* الاسم والمعلومات الأساسية */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profileUser.displayName || profileUser.email}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-zinc-400">
                {profileUser.age && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{profileUser.age} {t('yearsOld') || 'years old'}</span>
                  </div>
                )}
                
                {profileUser.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profileUser.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* معلومات إضافية */}
            {profileUser.bio && (
              <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl">
                <p className="text-zinc-300">{profileUser.bio}</p>
              </div>
            )}

            {/* معلومات الاتصال (للمالك فقط) */}
            {isOwnProfile && (
              <div className="mb-6 space-y-3">
                {profileUser.phone && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Phone className="w-5 h-5" />
                    <span>{profileUser.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* أزرار التفاعل */}
            {!isOwnProfile && currentUser && (
              <div className="flex gap-3">
                {/* زر طلب الصداقة */}
                {friendRequestStatus === null && (
                  <button
                    onClick={handleSendFriendRequest}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{t('addFriend') || 'Add Friend'}</span>
                  </button>
                )}

                {friendRequestStatus === 'pending' && (
                  <button
                    onClick={handleCancelFriendRequest}
                    className="flex-1 bg-zinc-800 text-zinc-400 font-bold py-3 px-6 rounded-full hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>{t('requestPending') || 'Request Pending'}</span>
                  </button>
                )}

                {friendRequestStatus === 'accepted' && (
                  <button
                    disabled
                    className="flex-1 bg-green-500/20 text-green-500 font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>{t('friends') || 'Friends'}</span>
                  </button>
                )}

                {/* زر المراسلة */}
                <button
                  onClick={handleSendMessage}
                  className="bg-zinc-800 text-white font-bold py-3 px-6 rounded-full hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* زر تعديل الملف الشخصي */}
            {isOwnProfile && (
              <button
                onClick={() => navigate('/settings')}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform"
              >
                {t('editProfile') || 'Edit Profile'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
