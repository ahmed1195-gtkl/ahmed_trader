import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Server, Key, DollarSign, CheckCircle, AlertCircle, Loader, ExternalLink, Info } from 'lucide-react';
import { auth } from '../lib/firebase';
import { connectDemoAccount } from '../lib/mt4mt5Service';
import { brokersData } from '../data/brokers';

function DemoAccountSetup({ onComplete }) {
  const [formData, setFormData] = useState({
    brokerName: '',
    accountNumber: '',
    password: '',
    serverName: '',
    platform: 'MT5'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [detectedBalance, setDetectedBalance] = useState(null);
  const [showBrokerLinks, setShowBrokerLinks] = useState(false);
  
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // جلب قائمة البروكرات من البيانات الموجودة
  const brokers = brokersData.ar || brokersData.en;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    // التحقق من الحقول المطلوبة
    if (!formData.brokerName || !formData.accountNumber || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // محاولة الاتصال بالحساب التجريبي
      const result = await connectDemoAccount(
        currentUser.uid,
        formData.brokerName,
        formData.accountNumber,
        formData.password,
        formData.serverName,
        formData.platform
      );

      if (!result.success) {
        setError(result.message || 'فشل الاتصال بالحساب التجريبي');
        setLoading(false);
        return;
      }

      // عرض الرصيد المكتشف
      if (result.balance) {
        setDetectedBalance(result.balance);
      }

      setSuccess(true);
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/join-challenge');
        }
      }, 2000);
    } catch (error) {
      setError(error.message || 'حدث خطأ أثناء الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Server className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            ربط الحساب التجريبي
          </h2>
          <p className="text-gray-400">
            قم بربط حساب MT4/MT5 التجريبي الخاص بك للمشاركة في التحديات
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-bold mb-1">يمكنك استخدام كلمة السر الرئيسية أو كلمة سر المستثمر</p>
            <p className="text-blue-400/80">سيتم جلب الرصيد تلقائياً من حسابك التجريبي</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Broker Selection */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              اختر الوسيط
            </label>
            <select
              name="brokerName"
              value={formData.brokerName}
              onChange={handleInputChange}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            >
              <option value="">اختر الوسيط...</option>
              {brokers.map(broker => (
                <option key={broker.id} value={broker.name}>
                  {broker.name}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              المنصة
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, platform: 'MT4' }))}
                className={`py-3 px-4 rounded-2xl font-bold transition-all ${
                  formData.platform === 'MT4'
                    ? 'bg-amber-500 text-black'
                    : 'bg-black/40 border border-white/10 text-white hover:border-amber-500/50'
                }`}
              >
                MetaTrader 4
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, platform: 'MT5' }))}
                className={`py-3 px-4 rounded-2xl font-bold transition-all ${
                  formData.platform === 'MT5'
                    ? 'bg-amber-500 text-black'
                    : 'bg-black/40 border border-white/10 text-white hover:border-amber-500/50'
                }`}
              >
                MetaTrader 5
              </button>
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              رقم الحساب التجريبي
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              placeholder="مثال: 12345678"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              كلمة السر (الرئيسية أو المستثمر)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          {/* Server Name (Optional) */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              اسم الخادم (اختياري)
            </label>
            <input
              type="text"
              name="serverName"
              value={formData.serverName}
              onChange={handleInputChange}
              placeholder="مثال: Equiti-Demo"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* Detected Balance */}
          {detectedBalance && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3"
            >
              <DollarSign className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-green-300 font-bold">تم اكتشاف الرصيد</p>
                <p className="text-2xl font-black text-green-400">${detectedBalance.toLocaleString()}</p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-300 font-bold">تم ربط الحساب بنجاح! جاري التحويل...</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                جاري الاتصال...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                تم بنجاح
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                ربط الحساب
              </>
            )}
          </button>
        </form>

        {/* Don't have an account? */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowBrokerLinks(!showBrokerLinks)}
            className="text-amber-500 hover:text-amber-400 font-bold text-sm transition-colors"
          >
            ليس لديك حساب تجريبي؟ افتح حساباً الآن
          </button>

          {showBrokerLinks && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3"
            >
              {brokers.map(broker => (
                <a
                  key={broker.id}
                  href={broker.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-black/40 border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={broker.logo}
                        alt={broker.name}
                        className="w-12 h-12 object-contain rounded-lg bg-white/5 p-2"
                      />
                      <div className="text-right">
                        <p className="font-bold text-white group-hover:text-amber-400 transition-colors">
                          {broker.name}
                        </p>
                        <p className="text-xs text-gray-400">افتح حساب تجريبي مجاني</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default DemoAccountSetup;
