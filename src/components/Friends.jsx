import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { Users, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import FriendRequests from './FriendRequests';

const Friends = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // مراقبة المستخدم الحالي
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // جلب قائمة الأصدقاء
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchFriends = async () => {
      try {
        const requestsRef = collection(db, 'friend_requests');
        
        // جلب الطلبات المقبولة حيث المستخدم هو المرسل
        const q1 = query(
          requestsRef,
          where('senderId', '==', currentUser.uid),
          where('status', '==', 'accepted')
        );
        
        // جلب الطلبات المقبولة حيث المستخدم هو المستقبل
        const q2 = query(
          requestsRef,
          where('receiverId', '==', currentUser.uid),
          where('status', '==', 'accepted')
        );

        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(q1),
          getDocs(q2)
        ]);

        const friendsList = [];

        snapshot1.forEach(doc => {
          const data = doc.data();
          friendsList.push({
            id: data.receiverId,
            name: data.receiverName,
            photo: data.receiverPhoto || ''
          });
        });

        snapshot2.forEach(doc => {
          const data = doc.data();
          friendsList.push({
            id: data.senderId,
            name: data.senderName,
            photo: data.senderPhoto || ''
          });
        });

        setFriends(friendsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-400">{t('pleaseLogin') || 'Please login to view friends'}</p>
        </div>
      </div>
    );
  }

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

        {/* طلبات الصداقة */}
        <div className="mb-12">
          <FriendRequests />
        </div>

        {/* قائمة الأصدقاء */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            {t('myFriends') || 'My Friends'}
            <span className="text-sm font-normal text-zinc-400">({friends.length})</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl">
              <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">{t('noFriendsYet') || 'No friends yet'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-500/40 transition-colors"
                >
                  {/* الصورة الشخصية */}
                  {friend.photo ? (
                    <img
                      src={friend.photo}
                      alt={friend.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/20 cursor-pointer hover:border-amber-500/60 transition-colors"
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    />
                  ) : (
                    <div 
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    >
                      <User className="w-7 h-7 text-black" />
                    </div>
                  )}

                  {/* المعلومات */}
                  <div className="flex-1">
                    <h3 
                      className="text-white font-bold cursor-pointer hover:text-amber-500 transition-colors"
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    >
                      {friend.name}
                    </h3>
                    <p className="text-sm text-zinc-400">{t('friend') || 'Friend'}</p>
                  </div>

                  {/* زر المراسلة */}
                  <button
                    className="p-3 bg-amber-500 hover:bg-amber-600 text-black rounded-full transition-colors"
                    title={t('sendMessage') || 'Send Message'}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
