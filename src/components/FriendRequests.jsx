import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { UserPlus, Check, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const FriendRequests = () => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // مراقبة المستخدم الحالي
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // جلب طلبات الصداقة
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const requestsRef = collection(db, 'friend_requests');
    const q = query(
      requestsRef,
      where('receiverId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriendRequests(requests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'friend_requests', requestId), {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
      toast.success(t('friendRequestAccepted') || 'Friend request accepted!');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error(t('errorAcceptingRequest') || 'Error accepting request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'friend_requests', requestId));
      toast.success(t('friendRequestRejected') || 'Friend request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(t('errorRejectingRequest') || 'Error rejecting request');
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">{t('pleaseLogin') || 'Please login to view friend requests'}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (friendRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400">{t('noFriendRequests') || 'No friend requests'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-amber-500" />
        {t('friendRequests') || 'Friend Requests'}
        <span className="text-sm font-normal text-zinc-400">({friendRequests.length})</span>
      </h2>

      <AnimatePresence>
        {friendRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4"
          >
            {/* الصورة الشخصية */}
            {request.senderPhoto ? (
              <img
                src={request.senderPhoto}
                alt={request.senderName}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                <User className="w-7 h-7 text-black" />
              </div>
            )}

            {/* المعلومات */}
            <div className="flex-1">
              <h3 className="text-white font-bold">{request.senderName}</h3>
              <p className="text-sm text-zinc-400">
                {t('wantsToBeYourFriend') || 'wants to be your friend'}
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAcceptRequest(request.id)}
                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                title={t('accept') || 'Accept'}
              >
                <Check className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                title={t('reject') || 'Reject'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FriendRequests;
