import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link2, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { auth } from '../lib/firebase';
import { connectDemoAccount, getAccountStatus, disconnectAccount } from '../lib/mt4mt5Service';
import { brokersData } from '../data/brokers';

function ConnectDemoAccount({ participantId, onConnected }) {
  const { i18n } = useTranslation();
  const brokers = brokersData[i18n.language] || brokersData.en;
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    brokerId: '',
    brokerName: '',
    accountNumber: '',
    investorPassword: '',
    serverName: '',
    platform: 'MT4'
  });

  useEffect(() => {
    loadAccountStatus();
  }, [participantId]);

  const loadAccountStatus = async () => {
    if (!user || !participantId) return;

    try {
      const status = await getAccountStatus(user.uid, participantId);
      setAccountStatus(status);
      setLoading(false);
    } catch (error) {
      console.error('Error loading account status:', error);
      setLoading(false);
    }
  };

  const handleBrokerChange = (brokerId) => {
    const broker = brokers.find(b => b.id === brokerId);
    if (broker) {
      setFormData({
        ...formData,
        brokerId: broker.id,
        brokerName: broker.name
      });
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setConnecting(true);

    try {
      await connectDemoAccount(user.uid, participantId, formData);
      
      alert(i18n.language === 'ar'
        ? 'تم ربط الحساب بنجاح!'
        : 'Account connected successfully!');

      setShowConnectModal(false);
      loadAccountStatus();
      
      if (onConnected) {
        onConnected();
      }
    } catch (error) {
      console.error('Error connecting account:', error);
      alert(error.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(i18n.language === 'ar'
      ? 'هل تريد قطع الاتصال بالحساب؟'
      : 'Disconnect the account?')) {
      return;
    }

    try {
      await disconnectAccount(user.uid, participantId);
      alert(i18n.language === 'ar' ? 'تم قطع الاتصال' : 'Disconnected successfully');
      loadAccountStatus();
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (accountStatus?.connected) {
    return (
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground uppercase">
                {i18n.language === 'ar' ? 'الحساب متصل' : 'Account Connected'}
              </h3>
              <p className="text-sm text-gray-500">
                {i18n.language === 'ar' ? 'يتم مزامنة البيانات تلقائياً' : 'Data syncing automatically'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
          >
            {i18n.language === 'ar' ? 'قطع الاتصال' : 'Disconnect'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">
              {i18n.language === 'ar' ? 'الوسيط' : 'Broker'}
            </div>
            <div className="text-sm font-bold text-white">
              {accountStatus.brokerName}
            </div>
          </div>

          <div className="bg-black border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">
              {i18n.language === 'ar' ? 'رقم الحساب' : 'Account Number'}
            </div>
            <div className="text-sm font-bold text-white">
              {accountStatus.accountNumber}
            </div>
          </div>

          <div className="bg-black border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">
              {i18n.language === 'ar' ? 'المنصة' : 'Platform'}
            </div>
            <div className="text-sm font-bold text-white">
              {accountStatus.platform}
            </div>
          </div>
        </div>

        {accountStatus.lastSyncAt && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            {i18n.language === 'ar' ? 'آخر مزامنة: ' : 'Last synced: '}
            {new Date(accountStatus.lastSyncAt.toDate()).toLocaleString(i18n.language)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
      <div className="text-center">
        <Link2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-foreground uppercase mb-2">
          {i18n.language === 'ar' ? 'ربط حساب ديمو' : 'Connect Demo Account'}
        </h3>
        <p className="text-gray-400 mb-6">
          {i18n.language === 'ar'
            ? 'اربط حسابك الديمو من أحد الوسطاء لمزامنة الصفقات تلقائياً'
            : 'Connect your demo account from a broker to sync trades automatically'}
        </p>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-8 py-4 bg-amber-500 text-black rounded-xl font-black text-sm uppercase hover:bg-amber-400 transition-all"
        >
          {i18n.language === 'ar' ? 'ربط الحساب' : 'Connect Account'}
        </button>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowConnectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-black text-foreground uppercase mb-6">
              {i18n.language === 'ar' ? 'ربط حساب ديمو' : 'Connect Demo Account'}
            </h2>

            <form onSubmit={handleConnect} className="space-y-6">
              {/* Broker Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                  {i18n.language === 'ar' ? 'اختر الوسيط' : 'Select Broker'}
                </label>
                <select
                  value={formData.brokerId}
                  onChange={(e) => handleBrokerChange(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-amber-500 outline-none"
                  required
                >
                  <option value="">
                    {i18n.language === 'ar' ? 'اختر وسيطاً' : 'Choose a broker'}
                  </option>
                  {brokers.map((broker) => (
                    <option key={broker.id} value={broker.id}>
                      {broker.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                  {i18n.language === 'ar' ? 'المنصة' : 'Platform'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: 'MT4' })}
                    className={`py-3 rounded-xl font-bold text-sm uppercase transition-all ${
                      formData.platform === 'MT4'
                        ? 'bg-amber-500 text-black'
                        : 'bg-black border border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    MetaTrader 4
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: 'MT5' })}
                    className={`py-3 rounded-xl font-bold text-sm uppercase transition-all ${
                      formData.platform === 'MT5'
                        ? 'bg-amber-500 text-black'
                        : 'bg-black border border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    MetaTrader 5
                  </button>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                  {i18n.language === 'ar' ? 'رقم الحساب' : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="12345678"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-amber-500 outline-none"
                  required
                />
              </div>

              {/* Investor Password */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                  {i18n.language === 'ar' ? 'كلمة مرور المستثمر' : 'Investor Password'}
                </label>
                <input
                  type="password"
                  value={formData.investorPassword}
                  onChange={(e) => setFormData({ ...formData, investorPassword: e.target.value })}
                  placeholder="********"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-amber-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {i18n.language === 'ar'
                    ? 'كلمة مرور القراءة فقط (للأمان)'
                    : 'Read-only password (for security)'}
                </p>
              </div>

              {/* Server Name */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                  {i18n.language === 'ar' ? 'اسم السيرفر' : 'Server Name'}
                </label>
                <input
                  type="text"
                  value={formData.serverName}
                  onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
                  placeholder="BrokerName-Demo01"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-foreground focus:border-amber-500 outline-none"
                  required
                />
              </div>

              {/* Warning */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-400">
                  {i18n.language === 'ar'
                    ? 'تأكد من استخدام كلمة مرور المستثمر (للقراءة فقط) وليس كلمة المرور الرئيسية. لن نتمكن من إجراء أي عمليات تداول، فقط قراءة البيانات.'
                    : 'Make sure to use the Investor Password (read-only), not the main password. We will only be able to read data, not execute trades.'}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-foreground rounded-xl font-bold uppercase hover:bg-white/10 transition-all"
                >
                  {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="flex-1 py-4 bg-amber-500 text-black rounded-xl font-bold uppercase hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      {i18n.language === 'ar' ? 'جاري الربط...' : 'Connecting...'}
                    </>
                  ) : (
                    i18n.language === 'ar' ? 'ربط الحساب' : 'Connect Account'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ConnectDemoAccount;
