import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Newspaper, 
  Plus, 
  Trash2, 
  UserX, 
  UserCheck, 
  Eye, 
  Edit3, 
  Save, 
  X,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Post Form State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');

  // User Detail State
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);

      // Fetch both admin and user posts
      const adminPostsSnap = await getDocs(query(collection(db, 'admin_posts'), orderBy('createdAt', 'desc')));
      const userPostsSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      
      const adminPostsList = adminPostsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminPost: true }));
      const userPostsList = userPostsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminPost: false }));
      
      setPosts([...adminPostsList, ...userPostsList]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus, type = 'permanent') => {
    try {
      const suspensionData = {
        isSuspended: !currentStatus,
        suspensionType: !currentStatus ? type : null,
        suspendedAt: !currentStatus ? serverTimestamp() : null
      };
      await updateDoc(doc(db, 'users', userId), suspensionData);
      setUsers(users.map(u => u.id === userId ? { ...u, ...suspensionData } : u));
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        title: postTitle,
        content: postContent,
        image: postImage || 'https://images.unsplash.com/photo-1611974714024-462cd297c8aa?q=80&w=800',
        updatedAt: serverTimestamp()
      };

      if (editingPost) {
        await updateDoc(doc(db, 'admin_posts', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'admin_posts'), {
          ...postData,
          createdAt: serverTimestamp(),
          author: 'Admin'
        });
      }
      
      setIsPostModalOpen(false);
      setEditingPost(null);
      setPostTitle('');
      setPostContent('');
      setPostImage('');
      fetchData();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleDeletePost = async (postId, isAdminPost) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const collectionName = isAdminPost ? 'admin_posts' : 'posts';
        await deleteDoc(doc(db, collectionName, postId));
        setPosts(posts.filter(p => p.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.numericUID?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Control Center</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admin <span className="text-yellow-500">Dashboard</span></h1>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Users className="w-4 h-4 inline-block mr-2" /> Users
            </button>
            <button 
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Newspaper className="w-4 h-4 inline-block mr-2" /> Posts
            </button>
          </div>
        </div>

        {activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Search by name, email or UID..." 
                className="pl-12 bg-white/5 border-white/10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {filteredUsers.map(user => (
                <motion.div 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <span className="text-yellow-500 font-black">{user.fullName?.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {user.fullName}
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 text-gray-500">ID: {user.numericUID}</span>
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedUser(user)}
                      className="border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Details
                    </Button>
                    {user.isSuspended ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleUserStatus(user.id, user.isSuspended)}
                        className="border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      >
                        <UserCheck className="w-4 h-4 mr-2" /> Activate
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleUserStatus(user.id, user.isSuspended, 'temporary')}
                          className="border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                        >
                          Temp
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleUserStatus(user.id, user.isSuspended, 'permanent')}
                          className="border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        >
                          Perm
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  setEditingPost(null);
                  setPostTitle('');
                  setPostContent('');
                  setPostImage('');
                  setIsPostModalOpen(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Post
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <div key={post.id} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
                  <div className="aspect-video relative">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-4 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-8 line-clamp-3 flex-1">{post.content}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditingPost(post);
                          setPostTitle(post.title);
                          setPostContent(post.content);
                          setPostImage(post.image);
                          setIsPostModalOpen(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePost(post.id, post.isAdminPost)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Post Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPostModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <form onSubmit={handleSavePost} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Title</label>
                  <Input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="bg-white/5 border-white/10" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Image URL</label>
                  <Input value={postImage} onChange={(e) => setPostImage(e.target.value)} placeholder="https://..." className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Content</label>
                  <Textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} className="bg-white/5 border-white/10 min-h-[200px]" required />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest">
                    <Save className="w-4 h-4 mr-2" /> Save Post
                  </Button>
                  <Button type="button" onClick={() => setIsPostModalOpen(false)} variant="outline" className="flex-1 border-white/10 bg-white/5">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
                    <span className="text-3xl text-yellow-500 font-black">{selectedUser.fullName?.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                  <span className="text-xs text-yellow-500 font-black uppercase tracking-widest">ID: {selectedUser.numericUID}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-sm font-medium truncate">{selectedUser.email}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Phone</p>
                    <p className="text-sm font-medium">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Country</p>
                    <p className="text-sm font-medium">{selectedUser.country || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Status</p>
                    <p className={`text-sm font-black ${selectedUser.isSuspended ? 'text-red-500' : 'text-green-500'}`}>
                      {selectedUser.isSuspended ? 'Suspended' : 'Active'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Joined At</p>
                  <p className="text-sm font-medium">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
