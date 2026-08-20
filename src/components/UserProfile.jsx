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
import Header from './Header';
import Footer from './Footer';

import UserBadge, { getBadgeConfig } from './ui/UserBadge';
import { Linkedin, Facebook, Send, Instagram, Video as TiktokIcon } from 'lucide-react';

function sanitizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) return null;
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

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
        receiverName: profileUser.displayName || 'User',
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
    toast.info(t('openChatWidget') || 'Open chat widget to send a message');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return null;
  }

  const isOwnProfile = currentUser?.uid === userId;
  const isStaffProfile = profileUser.role === 'admin' || profileUser.role === 'account_manager' || profileUser.isAdmin === true || profileUser.isAccountManager === true;
  const socialLinks = profileUser.socialLinks || {};

  const validLinkedIn = sanitizeUrl(socialLinks.linkedin);
  const validTikTok = sanitizeUrl(socialLinks.tiktok);
  const validFacebook = sanitizeUrl(socialLinks.facebook);
  const validTelegram = sanitizeUrl(socialLinks.telegram);
  const validInstagram = sanitizeUrl(socialLinks.instagram);

  const hasAnySocial = validLinkedIn || validTikTok || validFacebook || validTelegram || validInstagram;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* زر الرجوع */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back') || 'Back'}</span>
          </button>

          {/* بطاقة الملف الشخصي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl"
          >
            {/* الخلفية */}
            <div className="h-44 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,185,50,0.1),transparent_50%)]" />
            </div>

            {/* المحتوى */}
            <div className="px-8 pb-8">
              {/* الصورة الشخصية وشارة الحساب */}
              <div className="relative -mt-16 mb-6 flex items-end justify-between">
                <div className="relative">
                  {profileUser.photoURL ? (
                    <img
                      src={profileUser.photoURL}
                      alt={profileUser.displayName || 'User'}
                      className="w-28 h-28 rounded-full object-cover border-4 border-background shadow-xl"
                      decoding="async"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center text-primary">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="pb-2">
                  <UserBadge userData={profileUser} className="text-xs px-3 py-1" />
                </div>
              </div>

              {/* الاسم والشارة */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 flex items-center gap-3">
                  <span>{profileUser.displayName || (isOwnProfile ? profileUser.email : 'Anonymous Trader')}</span>
                </h1>

                {/* Private info only for owner */}
                {isOwnProfile && (
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                    {profileUser.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span>{profileUser.email}</span>
                      </div>
                    )}
                    {profileUser.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        <span>{profileUser.phone}</span>
                      </div>
                    )}
                    {profileUser.age && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{profileUser.age} {t('yearsOld') || 'years old'}</span>
                      </div>
                    )}
                    {profileUser.country && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{profileUser.country}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bio (Owner or if present) */}
              {isOwnProfile && profileUser.bio && (
                <div className="mb-6 p-4 bg-secondary/60 rounded-xl border border-border/60">
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{profileUser.bio}</p>
                </div>
              )}

              {/* Staff Social Media Links (Admin & Account Manager only) */}
              {isStaffProfile && hasAnySocial && (
                <div className="mb-6 p-4 bg-secondary/40 rounded-xl border border-border/60">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                    {isAr ? 'روابط التواصل الرسمية' : 'Official Staff Links'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {validLinkedIn && (
                      <a
                        href={validLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all"
                      >
                        <Linkedin className="w-4 h-4 text-blue-400" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {validTikTok && (
                      <a
                        href={validTikTok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all"
                      >
                        <TiktokIcon className="w-4 h-4 text-pink-400" />
                        <span>TikTok</span>
                      </a>
                    )}
                    {validFacebook && (
                      <a
                        href={validFacebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all"
                      >
                        <Facebook className="w-4 h-4 text-blue-500" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {validTelegram && (
                      <a
                        href={validTelegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all"
                      >
                        <Send className="w-4 h-4 text-sky-400" />
                        <span>Telegram</span>
                      </a>
                    )}
                    {validInstagram && (
                      <a
                        href={validInstagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all"
                      >
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions for non-owner */}
              {!isOwnProfile && currentUser && (
                <div className="flex gap-3 mt-6">
                  {friendRequestStatus === null && (
                    <button
                      onClick={handleSendFriendRequest}
                      className="flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{t('addFriend') || 'Add Friend'}</span>
                    </button>
                  )}

                  {friendRequestStatus === 'pending' && (
                    <button
                      onClick={handleCancelFriendRequest}
                      className="flex-1 bg-secondary text-muted-foreground font-bold py-3 px-6 rounded-xl border border-border hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('requestPending') || 'Request Pending'}</span>
                    </button>
                  )}

                  {friendRequestStatus === 'accepted' && (
                    <button
                      disabled
                      className="flex-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('friends') || 'Friends'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleSendMessage}
                    className="bg-secondary text-foreground border border-border font-bold py-3 px-6 rounded-xl hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Edit profile button for owner */}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full mt-4 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:brightness-110 transition-all border-0 cursor-pointer text-xs uppercase tracking-wider"
                >
                  {t('editProfile') || 'Edit Profile'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
