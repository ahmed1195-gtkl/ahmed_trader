import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Shield, Lock, User, Camera, Save, Globe, Calendar, CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Settings = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    fullName: '',
    lastName: '',
    photoURL: '',
    country: '',
    age: '',
    twoFactorEnabled: false,
    role: 'user',
    isAccountManager: false,
    isAdmin: false,
    socialLinks: {
      linkedin: '',
      tiktok: '',
      facebook: '',
      telegram: '',
      instagram: ''
    }
  });

  const sanitizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) return '';
    return trimmed;
  };

  const isStaff = profileData.role === 'admin' || profileData.role === 'account_manager' || profileData.isAdmin || profileData.isAccountManager;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
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
              twoFactorEnabled: data.twoFactorEnabled || false,
              role: data.role || (data.isAdmin ? 'admin' : data.isAccountManager ? 'account_manager' : 'user'),
              isAccountManager: data.isAccountManager || false,
              isAdmin: data.isAdmin || false,
              socialLinks: {
                linkedin: data.socialLinks?.linkedin || '',
                tiktok: data.socialLinks?.tiktok || '',
                facebook: data.socialLinks?.facebook || '',
                telegram: data.socialLinks?.telegram || '',
                instagram: data.socialLinks?.instagram || ''
              }
            });
          } else {
            setProfileData(prev => ({
              ...prev,
              fullName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || ''
            }));
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photoURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      const updatePayload = {
        fullName: profileData.fullName,
        lastName: profileData.lastName,
        photoURL: profileData.photoURL,
        country: profileData.country,
        age: profileData.age,
        twoFactorEnabled: profileData.twoFactorEnabled,
        updatedAt: new Date().toISOString()
      };

      if (isStaff) {
        updatePayload.socialLinks = {
          linkedin: sanitizeUrl(profileData.socialLinks?.linkedin),
          tiktok: sanitizeUrl(profileData.socialLinks?.tiktok),
          facebook: sanitizeUrl(profileData.socialLinks?.facebook),
          telegram: sanitizeUrl(profileData.socialLinks?.telegram),
          instagram: sanitizeUrl(profileData.socialLinks?.instagram)
        };
      }

      if (docSnap.exists()) {
        await updateDoc(docRef, updatePayload);
      } else {
        await setDoc(docRef, {
          ...updatePayload,
          email: user.email,
          createdAt: new Date().toISOString(),
          onboardingCompleted: true
        });
      }

      try {
        await updateProfile(user, {
          displayName: profileData.fullName,
          photoURL: profileData.photoURL
        });
      } catch (authErr) {
        console.warn("Auth profile update failed, but Firestore was updated:", authErr);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12 max-w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tighter">
              Settings
            </h1>
            <AnimatePresence>
              {message.text && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`flex items-center gap-2 px-4 py-2 rounded-md border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        
          <form onSubmit={handleSaveProfile} className="grid gap-8">
            <Card className="bg-card backdrop-blur-xl border-border text-foreground overflow-hidden rounded-xl">
              <CardHeader className="border-b border-border pb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/5">
                      {profileData.photoURL ? (
                        <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" decoding="async" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
                      ) : (
                        <User className="w-10 h-10 text-primary" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:brightness-110 transition-all cursor-pointer border-0"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">{profileData.fullName || 'User'}</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">{user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">First Name</label>
                    <Input value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} className="bg-secondary border-border focus-visible:border-primary/50 h-12 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Last Name</label>
                    <Input value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="bg-secondary border-border focus-visible:border-primary/50 h-12 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select 
                        value={profileData.country} 
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        className="w-full pl-12 pr-4 bg-secondary border border-border focus:border-primary/50 h-12 rounded-md text-foreground appearance-none outline-none text-sm"
                      >
                        <option value="" className="bg-card">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country} className="bg-card">{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="number" value={profileData.age} onChange={(e) => setProfileData({...profileData, age: e.target.value})} className="pl-12 bg-secondary border-border focus-visible:border-primary/50 h-12 rounded-md" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        
            {isStaff && (
              <Card className="bg-card backdrop-blur-xl border-border text-foreground rounded-xl">
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Globe className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Staff Profile</span>
                  </div>
                  <CardTitle>Official Social Media Links</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    As an authorized staff member ({profileData.role === 'admin' ? 'Admin' : 'Account Manager'}), you can configure your public social profile links.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">LinkedIn URL</label>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        value={profileData.socialLinks.linkedin}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                        })}
                        className="bg-secondary border-border h-11 rounded-md text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">TikTok URL</label>
                      <Input
                        placeholder="https://tiktok.com/@username"
                        value={profileData.socialLinks.tiktok}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, tiktok: e.target.value }
                        })}
                        className="bg-secondary border-border h-11 rounded-md text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Facebook URL</label>
                      <Input
                        placeholder="https://facebook.com/username"
                        value={profileData.socialLinks.facebook}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, facebook: e.target.value }
                        })}
                        className="bg-secondary border-border h-11 rounded-md text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Telegram URL</label>
                      <Input
                        placeholder="https://t.me/username"
                        value={profileData.socialLinks.telegram}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, telegram: e.target.value }
                        })}
                        className="bg-secondary border-border h-11 rounded-md text-sm"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Instagram URL</label>
                      <Input
                        placeholder="https://instagram.com/username"
                        value={profileData.socialLinks.instagram}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, instagram: e.target.value }
                        })}
                        className="bg-secondary border-border h-11 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="w-full sm:w-auto bg-primary text-primary-foreground hover:brightness-110 font-black uppercase tracking-widest px-12 h-12 rounded-md shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer border-0">
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
