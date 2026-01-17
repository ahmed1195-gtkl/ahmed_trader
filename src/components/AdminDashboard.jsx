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
  serverTimestamp,
  where
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
  Edit3, 
  X,
  Search,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Clock,
  Ban,
  MessageSquare,
  History,
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown
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
  const [botTrades, setBotTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // User Detail State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banDuration, setBanDuration] = useState('permanent'); // permanent, 1day, 7days, 30days
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);

      const adminPostsSnap = await getDocs(query(collection(db, 'admin_posts'), orderBy('createdAt', 'desc')));
      const userPostsSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      
      const adminPostsList = adminPostsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminPost: true }));
      const userPostsList = userPostsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), isAdminPost: false }));
      
      setPosts([...adminPostsList, ...userPostsList]);

      // محاكاة جلب صفقات البوت (يمكن ربطها بـ Firestore لاحقاً)
      const savedTrades = JSON.parse(localStorage.getItem('bot_trades_history') || '[]');
      setBotTrades(savedTrades.reverse());

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToXLS = () => {
    const headers = ['Asset', 'Type', 'Entry', 'Exit', 'Profit', 'Date'];
    const rows = botTrades.map(t => [
      t.asset,
      t.type,
      t.entryPrice || 'N/A',
      t.exitPrice || 'N/A',
      t.profit,
      new Date(t.timestamp).toLocaleString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bot_trades_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;
    try {
      let banUntil = null;
      if (banDuration !== 'permanent') {
        const days = parseInt(banDuration);
        banUntil = new Date();
        banUntil.setDate(banUntil.getDate() + days);
      }

      const banData = {
        isBanned: true,
        banType: banDuration,
        banUntil: banUntil ? banUntil.toISOString() : null,
        bannedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', selectedUser.id), banData);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...banData } : u));
      setIsBanModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const unbanData = {
        isBanned: false,
        banType: null,
        banUntil: null,
        bannedAt: null
      };
      await updateDoc(doc(db, 'users', userId), unbanData);
      setUsers(users.map(u => u.id === userId ? { ...u, ...unbanData } : u));
    } catch (error) {
      console.error("Error unbanning user:", error);
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
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Admin Control</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Management <span className="text-yellow-500">Center</span></h1>
          </div>
          
          <div className="flex flex-wrap bg-white/5 p-1 rounded-xl border border-white/10">
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
            <button 
              onClick={() => setActiveTab('bot_trades')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bot_trades' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <History className="w-4 h-4 inline-block mr-2" /> Bot Trades
            </button>
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Search users..." 
                className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl"
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
                  className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-yellow-500" />}
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-tight flex items-center gap-2">
                        {user.fullName || 'Anonymous'}
                        {user.isBanned && <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full">BANNED</span>}
                      </h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-[9px] font-black text-yellow-500/50 uppercase tracking-widest mt-1">UID: {user.numericUID || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => { setSelectedUser(user); setWarningMessage(user.warning || ''); }}
                      className="bg-white/5 hover:bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      <AlertCircle className="w-3 h-3 mr-2" /> Warn
                    </Button>
                    {user.isBanned ? (
                      <Button 
                        onClick={() => handleUnbanUser(user.id)}
                        className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black border border-green-500/20 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        <UserCheck className="w-3 h-3 mr-2" /> Unban
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => { setSelectedUser(user); setIsBanModalOpen(true); }}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        <Ban className="w-3 h-3 mr-2" /> Ban
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Card key={post.id} className="bg-zinc-900/40 border-white/5 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-tight line-clamp-1">{post.title || post.text?.substring(0, 30)}</CardTitle>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">By {post.author || post.userName}</p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4">{post.content || post.text}</p>
                  <Button 
                    className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <Trash2 className="w-3 h-3 mr-2" /> Delete Post
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'bot_trades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Bot Trading History</h2>
              <Button 
                onClick={exportToXLS}
                className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black border border-green-500/20 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                <Download className="w-3 h-3 mr-2" /> Export CSV (XLS)
              </Button>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset</th>
                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Profit/Loss</th>
                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {botTrades.length > 0 ? botTrades.map((trade, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 font-black uppercase text-xs">{trade.asset}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${trade.type === 'Buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className={`p-6 font-black text-xs ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.profit > 0 ? '+' : ''}{trade.profit}
                      </td>
                      <td className="p-6 text-[10px] text-gray-500 font-bold">{new Date(trade.timestamp).toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center text-gray-500 font-black uppercase tracking-widest text-xs">No trades recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ban Modal */}
        <AnimatePresence>
          {isBanModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBanModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Ban <span className="text-red-500">User</span></h2>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Duration</label>
                  <select 
                    value={banDuration} 
                    onChange={(e) => setBanDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-white outline-none focus:border-red-500/50"
                  >
                    <option value="permanent" className="bg-zinc-900">Permanent</option>
                    <option value="1" className="bg-zinc-900">1 Day</option>
                    <option value="7" className="bg-zinc-900">7 Days</option>
                    <option value="30" className="bg-zinc-900">30 Days</option>
                  </select>
                  <Button onClick={handleBanUser} className="w-full bg-red-500 hover:bg-red-600 text-white h-12 rounded-xl font-black uppercase tracking-widest mt-4">Confirm Ban</Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
