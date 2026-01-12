import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Shield, Lock, Bell, User, Camera, Save, Globe, Calendar, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Settings = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: '',
    lastName: '',
    photoURL: '',
    country: '',
    age: '',
    twoFactorEnabled: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            fullName: data.fullName || currentUser.displayName || '',
            lastName: data.lastName || '',
            photoURL: data.photoURL || currentUser.photoURL || '',
            country: data.country || '',
            age: data.age || '',
            twoFactorEnabled: data.twoFactorEnabled || false
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: profileData.fullName,
        photoURL: profileData.photoURL
      });

      // Update Firestore Document
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        fullName: profileData.fullName,
        lastName: profileData.lastName,
        photoURL: profileData.photoURL,
        country: profileData.country,
        age: profileData.age,
        twoFactorEnabled: profileData.twoFactorEnabled,
        updatedAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
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
              {t('settings.title', 'Settings')}
            </h1>
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSaveProfile} className="grid gap-8">
            {/* Profile Section */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden">
              <CardHeader className="border-b border-white/5 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center overflow-hidden">
                      {profileData.photoURL ? (
                        <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-yellow-500" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">{profileData.fullName || 'User'}</CardTitle>
                    <CardDescription className="text-gray-400 font-medium">{user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">First Name</label>
                    <Input 
                      value={profileData.fullName} 
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Last Name</label>
                    <Input 
                      value={profileData.lastName} 
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Photo URL</label>
                    <Input 
                      value={profileData.photoURL} 
                      onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                      placeholder="https://..."
                      className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input 
                        value={profileData.country} 
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        className="pl-12 bg-white/5 border-white/10 focus:border-yellow-500/50 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input 
                        type="number"
                        value={profileData.age} 
                        onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                        className="pl-12 bg-white/5 border-white/10 focus:border-yellow-500/50 h-12"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">{t('settings.security', 'Security')}</span>
                </div>
                <CardTitle>{t('settings.2fa', 'Two-Factor Authentication')}</CardTitle>
                <CardDescription className="text-gray-400">Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-tight">Enable 2FA</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{profileData.twoFactorEnabled ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={profileData.twoFactorEnabled} 
                    onCheckedChange={(checked) => setProfileData({...profileData, twoFactorEnabled: checked})}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest px-12 h-14 rounded-2xl shadow-lg shadow-yellow-500/10"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
