import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Heart, MessageCircle, Plus, Image as ImageIcon, Send, X, ShieldCheck } from 'lucide-react';

const Feed = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [user, setUser] = useState(null);

  // Admin check - You can change this to your specific admin email
  const isAdmin = user?.email === 'ahmed1195@gmail.com' || user?.email === 'admin@ahmedtrader.com';

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => setUser(u));
    
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isAdmin || (!newPost && !imageUrl)) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        text: newPost,
        image: imageUrl,
        author: user.displayName || 'Admin',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
      });
      setNewPost('');
      setImageUrl('');
      setShowUpload(false);
    } catch (error) {
      console.error("Error adding post: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, likes) => {
    if (!user) return;
    const postRef = doc(db, 'posts', postId);
    const isLiked = likes.includes(user.uid);

    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  const handleComment = async (postId) => {
    if (!user || !commentText[postId]) return;
    const postRef = doc(db, 'posts', postId);

    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          userId: user.uid,
          userName: user.displayName || 'User',
          text: commentText[postId],
          createdAt: new Date().toISOString()
        })
      });
      setCommentText({ ...commentText, [postId]: '' });
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <section className="py-12 md:py-20 relative bg-black">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            {t('feed.title')}
          </h2>
          
          {isAdmin && (
            <Button 
              onClick={() => setShowUpload(!showUpload)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full w-12 h-12 p-0 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-110"
            >
              {showUpload ? <X /> : <Plus />}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showUpload && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10"
            >
              <Card className="bg-zinc-900/50 border-yellow-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-yellow-500 uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> {t('feed.upload')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none min-h-[100px] transition-all"
                    placeholder={t('feed.placeholder')}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. https://...)" 
                      className="bg-transparent border-none outline-none text-white flex-1 text-sm"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button 
                    onClick={handleUpload}
                    disabled={loading || (!newPost && !imageUrl)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8"
                  >
                    {loading ? "..." : t('feed.post')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              {t('feed.noPosts')}
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/30 border-white/5 backdrop-blur-sm overflow-hidden hover:border-white/10 transition-all">
                  {post.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">
                        {post.author[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{post.author}</p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                          {post.createdAt?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {post.text}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col border-t border-white/5 pt-4">
                    <div className="flex items-center gap-6 w-full mb-4">
                      <button 
                        onClick={() => handleLike(post.id, post.likes || [])}
                        className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.likes?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}
                      >
                        <Heart className={`w-5 h-5 ${post.likes?.includes(user?.uid) ? 'fill-current' : ''}`} />
                        {post.likes?.length || 0}
                      </button>
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                        <MessageCircle className="w-5 h-5" />
                        {post.comments?.length || 0}
                      </div>
                    </div>

                    {/* Comments List */}
                    {post.comments?.length > 0 && (
                      <div className="w-full space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-3">
                            <p className="text-yellow-500/80 text-[10px] font-bold uppercase mb-1">{comment.userName}</p>
                            <p className="text-gray-300 text-xs">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    {user && (
                      <div className="flex items-center gap-2 w-full">
                        <Input 
                          placeholder={t('feed.comment')}
                          className="bg-white/5 border-white/10 h-10 text-sm"
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                        />
                        <Button 
                          onClick={() => handleComment(post.id)}
                          className="bg-white/10 hover:bg-white/20 text-white h-10 w-10 p-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Feed;
