import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, storage } from '../lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Lock, Bell, User, Camera, Save, Loader2, CheckCircle2, AlertCircle, Globe, Calendar, Heart } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Settings = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Profile States
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    age: '',
    bio: '',
    photoURL: ''
  });

  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch additional data from Firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData({
              firstName: data.firstName || currentUser.displayName?.split(' ')[0] || '',
              lastName: data.lastName || currentUser.displayName?.split(' ')[1] || '',
              country: data.country || '',
              age: data.age || '',
              bio: data.bio || '',
              photoURL: data.photoURL || currentUser.photoURL || ''
            });
            setTwoFactor(data.twoFactorEnabled || false);
          } else {
            // Initialize with auth data if no firestore doc
            setProfileData(prev => ({
              ...prev,
              firstName: currentUser.displayName?.split(' ')[0] || '',
              lastName: currentUser.displayName?.split(' ')[1] || '',
              photoURL: currentUser.photoURL || ''
            }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    setSaving(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setProfileData(prev => ({ ...prev, photoURL: downloadURL }));
      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
      
      // Update Auth Profile
      await updateProfile(user, {
        displayName: fullName,
        photoURL: profileData.photoURL
      });

      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        ...profileData,
        displayName: fullName,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  const toggle2FA = async (checked) => {
    if (!user) return;
    setTwoFactor(checked);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        twoFactorEnabled: checked
      });
      setMessage({ type: 'success', text: `2FA ${checked ? 'enabled' : 'disabled'} successfully!` });
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      setTwoFactor(!checked); // Revert on error
      setMessage({ type: 'error', text: 'Failed to update 2FA settings' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {t('settings.title')}
            </h1>
            <Button 
              onClick={saveProfile} 
              disabled={saving}
              className="bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 px-8"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8">
            {/* Profile Section */}
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10 text-white overflow-hidden">
              <CardHeader className="border-b border-white/5 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500/20 group-hover:border-yellow-500/50 transition-all bg-zinc-800 flex items-center justify-center">
                      {profileData.photoURL ? (
                        <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-600" />
                      )}
                    </div>
                    <button 
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 p-3 bg-yellow-500 rounded-full text-black shadow-xl hover:scale-110 transition-transform active:scale-95"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <CardTitle className="text-3xl font-black uppercase tracking-tight">{profileData.firstName} {profileData.lastName}</CardTitle>
                    <CardDescription className="text-gray-400 font-medium text-lg">{user?.email}</CardDescription>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      {profileData.country && (
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-500 border border-yellow-500/20 flex items-center gap-2">
                          <Globe className="w-3 h-3" /> {profileData.country}
                        </span>
                      )}
                      {profileData.age && (
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-500 border border-yellow-500/20 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {profileData.age} Years
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">First Name</Label>
                      <Input 
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold" 
                        placeholder="Ahmed"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Last Name (Family Name)</Label>
                      <Input 
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold" 
                        placeholder="Trader"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Country</Label>
                      <Input 
                        name="country"
                        value={profileData.country}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold" 
                        placeholder="Algeria"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Age</Label>
                      <Input 
                        name="age"
                        type="number"
                        value={profileData.age}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold" 
                        placeholder="25"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Bio / About Me</Label>
                      <textarea 
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        className="w-full min-h-[100px] p-4 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold text-sm outline-none" 
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">{t('settings.security')}</span>
                </div>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription className="text-gray-400">Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-tight">Enable 2FA Protection</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                        Status: <span className={twoFactor ? 'text-green-500' : 'text-red-500'}>{twoFactor ? 'Active' : 'Inactive'}</span>
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={twoFactor} 
                    onCheckedChange={toggle2FA}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Bell className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Notifications</span>
                </div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription className="text-gray-400">Receive updates about your account and new courses.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl transition-all">
                  Manage Notification Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
