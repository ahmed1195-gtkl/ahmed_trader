import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Shield, Lock, Bell, User } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Settings = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {t('settings.title')}
          </h1>

          <div className="grid gap-6">
            {/* Profile Section */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 text-white">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>{user?.displayName || 'User'}</CardTitle>
                  <CardDescription className="text-gray-400">{user?.email}</CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Security Section */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">{t('settings.security')}</span>
                </div>
                <CardTitle>{t('settings.2fa')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.2fa.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between p-6 bg-white/5 rounded-xl mx-6 mb-6 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold">{t('settings.2fa')}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">{twoFactor ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch 
                  checked={twoFactor} 
                  onCheckedChange={setTwoFactor}
                  className="data-[state=checked]:bg-yellow-500"
                />
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Bell className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Notifications</span>
                </div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription className="text-gray-400">Receive updates about your account and new courses.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white/5 rounded-xl mx-6 mb-6 border border-white/5">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 text-white font-bold">
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
