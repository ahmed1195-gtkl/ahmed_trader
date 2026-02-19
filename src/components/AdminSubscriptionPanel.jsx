import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, DollarSign, TrendingUp, Search, Filter } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminSubscriptionPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    pro: 0,
    alpha: 0,
    revenue: 0
  });

  // تحميل المستخدمين
  useEffect(() => {
    loadUsers();
  }, []);

  // تصفية المستخدمين
  useEffect(() => {
    let filtered = users;

    // تصفية حسب الخطة
    if (filterPlan !== 'all') {
      filtered = filtered.filter(u => u.subscription === filterPlan);
    }

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterPlan]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const usersData = [];
      let freeCount = 0, proCount = 0, alphaCount = 0;
      let totalRevenue = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        const subscription = data.subscription || 'free';
        
        usersData.push({
          id: doc.id,
          ...data,
          subscription
        });

        // حساب الإحصائيات
        if (subscription === 'free') freeCount++;
        else if (subscription === 'pro') {
          proCount++;
          totalRevenue += 49;
        } else if (subscription === 'alpha') {
          alphaCount++;
          totalRevenue += 99;
        }
      });

      setUsers(usersData);
      setFilteredUsers(usersData);
      setStats({
        total: usersData.length,
        free: freeCount,
        pro: proCount,
        alpha: alphaCount,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserSubscription = async (userId, newPlan) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscription: newPlan,
        subscriptionUpdatedAt: new Date(),
        subscriptionUpdatedBy: auth.currentUser.uid
      });

      // تحديث محلياً
      setUsers(users.map(u => 
        u.id === userId ? { ...u, subscription: newPlan } : u
      ));

      alert(`تم تحديث الاشتراك بنجاح إلى: ${newPlan}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('فشل تحديث الاشتراك');
    }
  };

  const getPlanBadge = (plan) => {
    const badges = {
      free: { label: 'مجاني', color: 'bg-gray-600' },
      pro: { label: 'Pro', color: 'bg-blue-600' },
      alpha: { label: 'Alpha', color: 'bg-purple-600' }
    };
    const badge = badges[plan] || badges.free;
    return (
      <span className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Crown className="text-yellow-500" size={32} />
          إدارة الاشتراكات
        </h1>
        <button
          onClick={loadUsers}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          تحديث
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-500" size={24} />
            <span className="text-gray-400 text-sm">إجمالي المستخدمين</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl border border-gray-600"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-400 text-sm">مجاني</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.free}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-xl border border-blue-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <Crown className="text-blue-400" size={20} />
            <span className="text-gray-300 text-sm">Pro</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.pro}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-800 to-pink-900 p-6 rounded-xl border border-purple-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <Crown className="text-purple-400" size={20} />
            <span className="text-gray-300 text-sm">Alpha</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.alpha}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-xl border border-green-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-400" size={24} />
            <span className="text-gray-300 text-sm">الإيرادات الشهرية</span>
          </div>
          <p className="text-3xl font-bold text-white">${stats.revenue}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث بالبريد الإلكتروني أو الاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">جميع الخطط</option>
            <option value="free">مجاني</option>
            <option value="pro">Pro</option>
            <option value="alpha">Alpha</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-right text-gray-400 text-sm font-semibold px-6 py-4">المستخدم</th>
                <th className="text-right text-gray-400 text-sm font-semibold px-6 py-4">البريد الإلكتروني</th>
                <th className="text-center text-gray-400 text-sm font-semibold px-6 py-4">الخطة الحالية</th>
                <th className="text-center text-gray-400 text-sm font-semibold px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.displayName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.displayName || 'مستخدم'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    {getPlanBadge(user.subscription)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        value={user.subscription}
                        onChange={(e) => updateUserSubscription(user.id, e.target.value)}
                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="free">مجاني</option>
                        <option value="pro">Pro</option>
                        <option value="alpha">Alpha</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            لا توجد نتائج
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionPanel;
