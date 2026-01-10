import { useState, useEffect } from 'react';
import { db, auth, storage } from '../lib/firebase';
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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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
  LayoutDashboard,
  Upload,
  Music,
  Video,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle
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
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // image, audio, video
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(''); // success, error, or empty
  const [mediaPreview, setMediaPreview] = useState(null);

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

      const postsSnap = await getDocs(query(collection(db, 'admin_posts'), orderBy('createdAt', 'desc')));
      const postsList = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isSuspended: !currentStatus
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isSuspended: !currentStatus } : u));
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setUploadStatus('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    
    if (!postTitle || !postContent) {
      setUploadStatus('error');
      alert('Please fill in title and content');
      return;
    }

    if (!mediaFile && !postImage) {
      setUploadStatus('error');
      alert('Please upload a file or provide a media URL');
      return;
    }

    setUploading(true);
    setUploadStatus('');
    try {
      let finalMediaUrl = postImage;
      let finalMediaType = mediaType;

      if (mediaFile) {
        const storageRef = ref(storage, `admin_posts/${Date.now()}_${mediaFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, mediaFile);

        finalMediaUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            }, 
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              }).catch(reject);
            }
          );
        });
      }

      const postData = {
        title: postTitle,
        content: postContent,
        image: finalMediaUrl,
        mediaType: finalMediaType,
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
      
      setUploadStatus('success');
      setTimeout(() => {
        setIsPostModalOpen(false);
        setEditingPost(null);
        setPostTitle('');
        setPostContent('');
        setPostImage('');
        setMediaFile(null);
        setMediaPreview(null);
        setUploadProgress(0);
        setUploadStatus('');
        fetchData();
      }, 1500);
    } catch (error) {
      console.error("Error saving post:", error);
      setUploadStatus('error');
      alert("Error saving post: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'admin_posts', postId));
        setPosts(posts.filter(p => p.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const openCreatePostModal = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostContent('');
    setPostImage('');
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType('image');
    setUploadProgress(0);
    setUploadStatus('');
    setIsPostModalOpen(true);
  };

  const openEditPostModal = (post) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostImage(post.image);
    setMediaType(post.mediaType || 'image');
    setMediaFile(null);
    setMediaPreview(post.image);
    setUploadProgress(0);
    setUploadStatus('');
    setIsPostModalOpen(true);
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleToggleUserStatus(user.id, user.isSuspended)}
                      className={user.isSuspended ? "border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20" : "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"}
                    >
                      {user.isSuspended ? <><UserCheck className="w-4 h-4 mr-2" /> Activate</> : <><UserX className="w-4 h-4 mr-2" /> Suspend</>}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Button 
                onClick={openCreatePostModal}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Post
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <div key={post.id} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
                  <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                    {post.mediaType === 'video' ? (
                      <video src={post.image} controls className="w-full h-full object-contain" />
                    ) : post.mediaType === 'audio' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <div className="text-center">
                          <Music className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">Audio File</p>
                        </div>
                      </div>
                    ) : (
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-4 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-8 line-clamp-3 flex-1">{post.content}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditPostModal(post)}
                        className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePost(post.id)}
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
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !uploading && setIsPostModalOpen(false)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }} 
              className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl overflow-y-auto"
            >
              <button 
                onClick={() => !uploading && setIsPostModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-8">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              
              <form onSubmit={handleSavePost} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Title</label>
                  <Input 
                    value={postTitle} 
                    onChange={(e) => setPostTitle(e.target.value)} 
                    className="bg-white/5 border-white/10" 
                    placeholder="Enter post title"
                    required 
                  />
                </div>

                {/* Media Type Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Media Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['image', 'audio', 'video'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setMediaType(type);
                          setMediaFile(null);
                          setMediaPreview(null);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          mediaType === type 
                            ? 'border-yellow-500 bg-yellow-500/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {type === 'image' && <ImageIcon className="w-5 h-5" />}
                        {type === 'audio' && <Music className="w-5 h-5" />}
                        {type === 'video' && <Video className="w-5 h-5" />}
                        <span className="text-xs font-bold capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Upload File</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept={mediaType === 'image' ? 'image/*' : mediaType === 'audio' ? 'audio/*' : 'video/*'}
                      onChange={handleMediaFileChange}
                      className="hidden"
                      id="media-upload"
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="media-upload"
                      className="block w-full border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all"
                    >
                      <Upload className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-white mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">
                        {mediaType === 'image' && 'PNG, JPG, GIF up to 10MB'}
                        {mediaType === 'audio' && 'MP3, WAV, M4A up to 50MB'}
                        {mediaType === 'video' && 'MP4, WebM, MOV up to 100MB'}
                      </p>
                    </label>
                  </div>
                  {mediaFile && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-sm text-green-400">{mediaFile.name}</span>
                    </div>
                  )}
                </div>

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Preview</label>
                    <div className="bg-black rounded-xl overflow-hidden border border-white/10 p-2">
                      {mediaType === 'video' ? (
                        <video src={mediaPreview} controls className="w-full aspect-video rounded-lg" />
                      ) : mediaType === 'audio' ? (
                        <div className="bg-zinc-800 rounded-lg p-6 flex items-center gap-4">
                          <Music className="w-8 h-8 text-yellow-500 shrink-0" />
                          <audio src={mediaPreview} controls className="flex-1" />
                        </div>
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                      )}
                    </div>
                  </div>
                )}

                {/* Alternative URL Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Or Use Media URL</label>
                  <Input 
                    value={postImage} 
                    onChange={(e) => setPostImage(e.target.value)} 
                    placeholder="https://example.com/image.jpg" 
                    className="bg-white/5 border-white/10" 
                  />
                  <p className="text-xs text-gray-500">Leave empty if uploading a file</p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Description / Content</label>
                  <Textarea 
                    value={postContent} 
                    onChange={(e) => setPostContent(e.target.value)} 
                    className="bg-white/5 border-white/10 min-h-[150px]" 
                    placeholder="Write your post description here..."
                    required 
                  />
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Uploading...</span>
                      <span className="text-xs font-bold text-yellow-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-yellow-500 h-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                {uploadStatus === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm text-green-400">Post published successfully!</span>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-sm text-red-400">Error uploading post. Please try again.</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={uploading}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" /> {uploading ? 'Publishing...' : 'Publish Post'}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setIsPostModalOpen(false)} 
                    disabled={uploading}
                    variant="outline" 
                    className="flex-1 border-white/10 bg-white/5 disabled:opacity-50"
                  >
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
