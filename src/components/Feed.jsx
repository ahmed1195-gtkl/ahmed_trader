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
  arrayRemove,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Heart, MessageCircle, Plus, Image as ImageIcon, Send, X, Music, Video, Loader2, User, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const docSnap = await getDoc(doc(db, 'users', u.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setIsAdmin(data.isAdmin === true);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
    });
    
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

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ahmed_trader_preset');
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/ahmed-trader/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('feed-file-input');
    const file = fileInput?.files[0];
    
    if (!user || (!newPost && !imageUrl && !file)) return;

    if (userData?.isBanned) {
      alert(i18n.language === 'ar' ? "تم حظر حسابك من النشر." : "Your account is banned from posting.");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      
      if (file) {
        const uploadedUrl = await uploadToCloudinary(file);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      await addDoc(collection(db, 'posts'), {
        text: newPost,
        image: finalImageUrl || null,
        mediaType: finalImageUrl ? mediaType : 'text',
        author: userData?.fullName || user.displayName || 'User',
        authorId: user.uid,
        authorPhoto: userData?.photoURL || user.photoURL || null,
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
      });

      setNewPost('');
      setImageUrl('');
      setShowUpload(false);
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Error adding post: " + error.message);
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
    if (userData?.isBanned) {
      alert(i18n.language === 'ar' ? "تم حظر حسابك من التعليق." : "Your account is banned from commenting.");
      return;
    }

    const postRef = doc(db, 'posts', postId);
    const text = commentText[postId];
    setCommentText({ ...commentText, [postId]: '' });

    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          userId: user.uid,
          userName: userData?.fullName || user.displayName || 'User',
          userPhoto: userData?.photoURL || user.photoURL || null,
          text: text,
          createdAt: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!isAdmin) return;
    if (window.confirm(i18n.language === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert("Failed to delete post.");
      }
    }
  };

  const renderTextWithLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-yellow-500 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <section className="py-12 md:py-20 relative bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            {i18n.language === 'ar' ? 'خلاصة' : 'Community'} <span className="text-yellow-500">{i18n.language === 'ar' ? 'المجتمع' : 'Feed'}</span>
          </h2>
          
          <div className="flex items-center gap-3">
            {user && isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-white/5 hover:bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full w-12 h-12 p-0 shadow-lg transition-transform hover:scale-110"
                title={i18n.language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
              >
                <LayoutDashboard className="w-6 h-6" />
              </Button>
            )}
            {user && (
              <Button 
                onClick={() => setShowUpload(!showUpload)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full w-12 h-12 p-0 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-110"
              >
                {showUpload ? <X /> : <Plus />}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showUpload && user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10"
            >
              <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-yellow-500 uppercase flex items-center gap-2">
                    <Plus className="w-4 h-4" /> {i18n.language === 'ar' ? 'إنشاء منشور جديد' : 'Create New Post'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-yellow-500/50 outline-none min-h-[120px] transition-all resize-none"
                    placeholder={i18n.language === 'ar' ? 'بماذا تفكر؟ (رابط الصورة اختياري)' : "What's on your mind? (Image URL optional)"}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12">
                    <select 
                      value={mediaType} 
                      onChange={(e) => setMediaType(e.target.value)}
                      className="bg-transparent border-none outline-none text-white flex-1 text-xs font-bold uppercase tracking-widest"
                    >
                      <option value="image" className="bg-zinc-900">Image URL</option>
                      <option value="audio" className="bg-zinc-900">Audio URL</option>
                      <option value="video" className="bg-zinc-900">Video URL</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder={i18n.language === 'ar' ? 'رابط الوسائط أو اختر ملفاً' : "Media URL or choose file"}
                      className="bg-transparent border-none outline-none text-white flex-1 text-xs"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <input 
                      type="file" 
                      id="feed-file-input"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files[0]) setImageUrl(e.target.files[0].name);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] text-yellow-500"
                      onClick={() => document.getElementById('feed-file-input').click()}
                    >
                      {i18n.language === 'ar' ? 'اختر ملف' : 'File'}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-end p-6 bg-white/[0.02]">
                  <Button 
                    onClick={handleUpload}
                    disabled={loading || (!newPost && !imageUrl)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest px-10 h-12 rounded-xl transition-all"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (i18n.language === 'ar' ? 'انشر الآن' : 'Post Now')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-white/5">
              <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">
                {i18n.language === 'ar' ? 'لا توجد منشورات بعد. كن أول من يشارك!' : 'No posts yet. Be the first to share!'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md overflow-hidden hover:border-yellow-500/20 transition-all duration-500 rounded-[2.5rem]">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center overflow-hidden">
                          {post.authorPhoto ? <img src={post.authorPhoto} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-yellow-500" />}
                        </div>
                        <div>
                          <p className="text-white font-black text-sm uppercase tracking-tight">{post.author}</p>
                          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">{post.createdAt?.toDate().toLocaleDateString()}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Button 
                          onClick={() => handleDeletePost(post.id)}
                          variant="ghost"
                          className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full w-8 h-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-6 font-medium">
                      {renderTextWithLinks(post.text)}
                    </p>
                    {post.image && (
                      <div className="w-full rounded-3xl overflow-hidden bg-black border border-white/5">
                        {post.mediaType === 'video' ? (
                          <video src={post.image} controls className="w-full aspect-video" />
                        ) : post.mediaType === 'audio' ? (
                          <div className="p-6 bg-zinc-800/50 flex items-center gap-4">
                            <Music className="w-8 h-8 text-yellow-500 shrink-0" />
                            <audio src={post.image} controls className="w-full" />
                          </div>
                        ) : (
                          <img src={post.image} alt="Post" className="w-full object-cover max-h-[500px]" />
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col border-t border-white/5 p-6 bg-white/[0.01]">
                    <div className="flex items-center gap-8 w-full mb-6">
                      <button onClick={() => handleLike(post.id, post.likes || [])} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${post.likes?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}>
                        <Heart className={`w-4 h-4 ${post.likes?.includes(user?.uid) ? 'fill-current' : ''}`} />
                        {post.likes?.length || 0} {i18n.language === 'ar' ? 'إعجاب' : 'Likes'}
                      </button>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments?.length || 0} {i18n.language === 'ar' ? 'تعليق' : 'Comments'}
                      </div>
                    </div>

                    {user && (
                      <div className="flex gap-3 w-full">
                        <input 
                          type="text"
                          placeholder={i18n.language === 'ar' ? 'اكتب تعليقاً...' : "Write a comment..."}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-yellow-500/50 outline-none transition-all"
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                        />
                        <Button onClick={() => handleComment(post.id)} disabled={!commentText[post.id]} className="bg-yellow-500 hover:bg-yellow-600 text-black w-10 h-10 p-0 rounded-xl shrink-0">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {post.comments?.length > 0 && (
                      <div className="mt-6 space-y-4 w-full">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                              {comment.userPhoto ? <img src={comment.userPhoto} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-gray-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-white uppercase tracking-tight mb-0.5">{comment.userName}</p>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                {renderTextWithLinks(comment.text)}
                              </p>
                            </div>
                          </div>
                        ))}
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
