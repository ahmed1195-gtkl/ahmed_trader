import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, User, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { filterContent } from '../lib/bad_words';

const Comments = ({ postId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    }, (error) => {
      console.error("Error fetching comments:", error);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    if (userData?.isBanned) {
      alert("Your account is banned from commenting.");
      return;
    }

    const { filteredText, hasBadWord } = filterContent(newComment);
    
    if (hasBadWord) {
      setNotification({
        type: 'warning',
        message: t('comments.badWordWarning', 'Your comment contains inappropriate language and has been filtered.')
      });
      setTimeout(() => setNotification(null), 5000);
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        userId: user.uid,
        userName: userData?.fullName || user.displayName || 'User',
        userPhoto: userData?.photoURL || user.photoURL || null,
        userNumericUID: userData?.numericUID || 'N/A',
        text: filteredText,
        createdAt: serverTimestamp()
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setNotification({
        type: 'error',
        message: t('comments.error', 'Failed to post comment. Please try again.')
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-white/5">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl flex items-center gap-3 mb-6 border ${
              notification.type === 'warning' 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-widest">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-6 text-amber-500">
        <MessageSquare className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {comments.length} {t('comments.title', 'Comments')}
        </span>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comments.placeholder', 'Write a comment...')}
            className="bg-white/5 border-white/10 focus:border-amber-500/50 min-h-[100px] text-foreground rounded-2xl"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading || !newComment.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 h-12 rounded-xl transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> {t('comments.send', 'Send')}</>}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center mb-8">
          <p className="text-sm text-gray-400 font-medium">
            {t('comments.loginRequired', 'Please login to add a comment.')}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                {comment.userPhoto ? (
                  <img src={comment.userPhoto} alt="" className="w-full h-full object-cover" decoding="async" loading="lazy" />
                ) : (
                  <User className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{comment.userName}</span>
                    <span className="text-[9px] font-black text-amber-500/50 uppercase tracking-tighter">
                      ID: {comment.userNumericUID}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium">
                    {comment.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {comments.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-black">No comments yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
