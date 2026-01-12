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
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { filterContent } from '../lib/bad_words';
import { AlertTriangle } from 'lucide-react';

const Comments = ({ postId }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
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
    });

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const { filteredText, hasBadWord } = filterContent(newComment);
    
    if (hasBadWord) {
      setNotification({
        type: 'warning',
        message: 'Your comment contains inappropriate language and has been filtered.'
      });
      setTimeout(() => setNotification(null), 5000);
    }

    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, 'comments'), {
        postId,
        userId: user.uid,
        userName: userData.fullName || user.displayName || 'User',
        userNumericUID: userData.numericUID || 'N/A',
        text: filteredText,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
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
            className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center gap-3 text-yellow-500 mb-6"
          >
            <AlertTriangle className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-widest">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2 mb-6 text-yellow-500">
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
            className="bg-white/5 border-white/10 focus:border-yellow-500/50 min-h-[100px] text-white"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading || !newComment.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6"
            >
              {loading ? '...' : <><Send className="w-4 h-4 mr-2" /> {t('comments.send', 'Send')}</>}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center mb-8">
          <p className="text-sm text-gray-400">
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
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{comment.userName}</span>
                    <span className="text-[9px] font-black text-yellow-500/50 uppercase tracking-tighter">
                      ID: {comment.userNumericUID}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600">
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
      </div>
    </div>
  );
};

export default Comments;
