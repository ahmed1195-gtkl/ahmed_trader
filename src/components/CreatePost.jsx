import { useState, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Plus, Image as ImageIcon, X, Send, Loader2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

const CreatePost = ({ onPostCreated }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ahmed_trader_preset'); // تأكد من استخدام الـ preset الصحيح الخاص بك
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dmrrj3rpl/image/upload`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1611974714024-462cd297c8aa?q=80&w=800';
      
      // إذا كانت هناك صورة مختارة، نقوم برفعها إلى Cloudinary
      if (fileInputRef.current?.files[0]) {
        const uploadedUrl = await uploadToCloudinary(fileInputRef.current.files[0]);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, 'posts'), {
        text: `${title}\n\n${content}`,
        image: finalImageUrl,
        mediaType: 'image',
        author: userData.fullName || user.displayName || 'User',
        authorId: user.uid,
        authorPhoto: userData.photoURL || user.photoURL || null,
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
      });

      setTitle('');
      setContent('');
      setImagePreview('');
      setIsOpen(false);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-amber-500 text-black rounded-full shadow-2xl shadow-amber-500/20 flex items-center justify-center hover:bg-amber-400 transition-all"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  Create <span className="text-amber-500">Post</span>
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Post Title</label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="What's on your mind?"
                    className="bg-white/5 border-white/10 focus:border-amber-500/50 h-12 text-white"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Post Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all overflow-hidden group"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Click to upload image</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Content</label>
                  <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Tell us more..."
                    className="bg-white/5 border-white/10 focus:border-amber-500/50 min-h-[120px] text-white"
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-lg shadow-amber-500/10"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Share Post</>}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreatePost;
