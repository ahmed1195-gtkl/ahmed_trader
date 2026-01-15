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
    twoFactorEnabled: false
  });

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

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
              twoFactorEnabled: data.twoFactorEnabled || false
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12 max-w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <AnimatePresence>
              {message.text && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        
          <form onSubmit={handleSaveProfile} className="grid gap-8">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white overflow-hidden rounded-[2rem]">
              <CardHeader className="border-b border-white/5 pb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center overflow-hidden shadow-2xl shadow-yellow-500/5">
                      {profileData.photoURL ? (
                        <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
                      ) : (
                        <User className="w-10 h-10 text-yellow-500" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg hover:bg-yellow-400 transition-all"
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
                    <CardDescription className="text-gray-400 font-medium">{user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">First Name</label>
                    <Input value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Last Name</label>
                    <Input value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select 
                        value={profileData.country} 
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        className="w-full pl-12 pr-4 bg-white/5 border border-white/10 focus:border-yellow-500/50 h-12 rounded-xl text-white appearance-none outline-none"
                      >
                        <option value="" className="bg-zinc-900">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country} className="bg-zinc-900">{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input type="number" value={profileData.age} onChange={(e) => setProfileData({...profileData, age: e.target.value})} className="pl-12 bg-white/5 border-white/10 focus:border-yellow-500/50 h-12 rounded-xl" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 text-white rounded-[2rem]">
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Security</span>
                </div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription className="text-gray-400">Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
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
                  <Switch checked={profileData.twoFactorEnabled} onCheckedChange={(checked) => setProfileData({...profileData, twoFactorEnabled: checked})} className="data-[state=checked]:bg-yellow-500" />
                </div>
              </CardContent>
            </Card>
        
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest px-12 h-14 rounded-2xl shadow-lg shadow-yellow-500/20 transition-all active:scale-95">
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
