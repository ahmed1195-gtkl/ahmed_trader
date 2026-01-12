import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Heart, MessageCircle, Share2, User, Clock, X } from 'lucide-react';
import CreatePost from './CreatePost';
import Comments from './Comments';

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const handleLike = async (postId, likes) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const postRef = doc(db, 'posts', postId);
    const isLiked = likes.includes(user.uid);
    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  return (
    <section className="min-h-screen flex flex-col items-center relative overflow-hidden py-20">
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight px-2"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed px-4"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Button - Only show if user is NOT logged in */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105 border-0"
              >
                {t('hero.cta')}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Feed Section */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 pb-20">
        <div className="max-w-2xl mx-auto space-y-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Post Header */}
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{post.userName}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {post.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-500 font-black">ID: {post.userNumericUID}</span>
              </div>

              {/* Post Image */}
              <div className="aspect-video relative overflow-hidden">
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Post Content */}
              <div className="p-8 text-left">
                <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{post.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{post.content}</p>

                {/* Interactions */}
                <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => handleLike(post.id, post.likes || [])}
                    className={`flex items-center gap-2 transition-colors ${post.likes?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Heart className={`w-5 h-5 ${post.likes?.includes(user?.uid) ? 'fill-current' : ''}`} />
                    <span className="text-xs font-black">{post.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-black">Comments</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {user && <CreatePost onPostCreated={() => {}} />}

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPost(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Comments</h2>
                <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <Comments postId={selectedPost.id} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  );
};

export default Hero;
