import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Key, User, Link as LinkIcon, AlertCircle, CheckCircle, Loader, ExternalLink } from 'lucide-react';
import { auth } from '../lib/firebase';
import { connectDemoAccount, fetchAccountData } from '../lib/mt4mt5Service';
import { useNavigate } from 'react-router-dom';

// قائمة البروكرات الموثوقة
const BROKERS = [
  {
    name: 'XM',
    logo: '🏆',
    demoUrl: 'https://www.xm.com/demo-account',
    description: 'Up to $100,000 demo balance'
  },
  {
    name: 'IC Markets',
    logo: '⭐',
    demoUrl: 'https://www.icmarkets.com/demo',
    description: 'Professional trading conditions'
  },
  {
    name: 'Exness',
    logo: '💎',
    demoUrl: 'https://www.exness.com/demo-account',
    description: 'Unlimited demo balance'
  },
  {
    name: 'FBS',
    logo: '🎯',
    demoUrl: 'https://fbs.com/demo-account',
    description: 'Up to $10,000 demo balance'
  },
  {
    name: 'FXTM',
    logo: '🔥',
    demoUrl: 'https://www.forextime.com/demo-account',
    description: 'Flexible demo accounts'
  }
];

function DemoAccountSetup({ onComplete }) {
  const [formData, setFormData] = useState({
    brokerName: '',
    accountNumber: '',
    investorPassword: '',
    serverName: '',
    platform: 'MT4',
    requiredBalance: 10000 // المبلغ المطلوب (يمكن تغييره)
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showBrokers, setShowBrokers] = useState(false);
  const [accountData, setAccountData] = useState(null);
  
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);
    setError('');
    setAccountData(null);

    try {
      // 1. ربط الحساب التجريبي
      const accountId = await connectDemoAccount(
        currentUser.uid,
        'temp',
        {
          brokerId: 'custom',
          brokerName: formData.brokerName,
          accountNumber: formData.accountNumber,
          investorPassword: formData.investorPassword,
          serverName: formData.serverName,
          platform: formData.platform
        }
      );

      // 2. جلب بيانات الحساب للتحقق من المبلغ
      const data = await fetchAccountData(accountId);
      setAccountData(data);

      // 3. التحقق من أن المبلغ يطابق المطلوب
      const accountBalance = data.balance || 0;
      const requiredBalance = parseFloat(formData.requiredBalance);

      if (accountBalance < requiredBalance * 0.9) { // هامش خطأ 10%
        setError(
          `Account balance ($${accountBalance.toFixed(2)}) is less than required ($${requiredBalance.toFixed(2)}). ` +
          `Please open a demo account with at least $${requiredBalance.toFixed(2)}.`
        );
        setLoading(false);
        return;
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
      setError(error.message || 'Failed to connect demo account');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-400 mb-4">You must be logged in to connect a demo account</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Server className="w-12 h-12 text-yellow-500" />
            <LinkIcon className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Connect Demo Account
          </h1>
          <p className="text-gray-400">Link your MT4/MT5 demo account to participate in challenges</p>
        </motion.div>

        {/* Don't have a demo account? */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700/50 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-purple-400 mb-1">Don't have a demo account?</h3>
              <p className="text-sm text-gray-400">Open a free demo account with one of our trusted brokers</p>
            </div>
            <button
              onClick={() => setShowBrokers(!showBrokers)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              {showBrokers ? 'Hide' : 'Show'} Brokers
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Brokers List */}
          {showBrokers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {BROKERS.map((broker) => (
                <a
                  key={broker.name}
                  href={broker.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{broker.logo}</span>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {broker.name}
                      </h4>
                      <p className="text-xs text-gray-500">{broker.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end text-xs text-purple-400">
                    Open Demo Account
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/50 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-400 mb-2">Important Information</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use your <strong>Investor Password</strong> (read-only), not your master password</li>
                <li>• We only read account data, we cannot execute trades</li>
                <li>• Your password is encrypted and stored securely</li>
                <li>• Only demo accounts are supported for challenges</li>
                <li>• Account balance must match the challenge requirements</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Platform
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: 'MT4' })}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    formData.platform === 'MT4'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  MetaTrader 4
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: 'MT5' })}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    formData.platform === 'MT5'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  MetaTrader 5
                </button>
              </div>
            </div>

            {/* Required Balance */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Required Balance (USD)
              </label>
              <select
                name="requiredBalance"
                value={formData.requiredBalance}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
              >
                <option value="10000">$10,000 (Bronze Challenge)</option>
                <option value="25000">$25,000 (Silver Challenge)</option>
                <option value="50000">$50,000 (Gold Challenge)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Your demo account balance must match this amount
              </p>
            </div>

            {/* Broker Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Broker Name
              </label>
              <input
                type="text"
                name="brokerName"
                value={formData.brokerName}
                onChange={handleChange}
                placeholder="e.g., XM, IC Markets, Exness"
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="12345678"
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
              />
            </div>

            {/* Server Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Server className="w-4 h-4 inline mr-2" />
                Server Name
              </label>
              <input
                type="text"
                name="serverName"
                value={formData.serverName}
                onChange={handleChange}
                placeholder="e.g., XM-Demo, ICMarkets-Demo01"
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
              />
            </div>

            {/* Investor Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Investor Password (Read-Only)
              </label>
              <input
                type="password"
                name="investorPassword"
                value={formData.investorPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Use your investor (read-only) password, NOT your master password
              </p>
            </div>

            {/* Account Data Display */}
            {accountData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-bold text-green-400 mb-3">Account Verified ✓</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Balance:</span>
                    <span className="ml-2 text-white font-bold">${accountData.balance?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Equity:</span>
                    <span className="ml-2 text-white font-bold">${accountData.equity?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Leverage:</span>
                    <span className="ml-2 text-white font-bold">1:{accountData.leverage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Currency:</span>
                    <span className="ml-2 text-white font-bold">{accountData.currency}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-400 text-sm">
                  Demo account connected successfully! Redirecting...
                </span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-6 h-6" />
                  <span>Connect & Verify Account</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>Need help finding your investor password?</p>
          <p className="mt-1">
            Check your broker's documentation or contact their support
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default DemoAccountSetup;
