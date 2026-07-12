import { useState, useEffect } from 'react';
import Header from './Header';
import { motion } from 'framer-motion';
import { Trophy, Key, Link as LinkIcon, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { auth } from '../lib/firebase';
import { findChallengeByInviteCode, joinChallenge } from '../lib/challengeEngine';
import { getAccountStatus } from '../lib/mt4mt5Service';
import { useNavigate } from 'react-router-dom';

function JoinChallengeWithCode() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [demoAccount, setDemoAccount] = useState(null);
  const [checkingAccount, setCheckingAccount] = useState(true);
  
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    checkDemoAccount();
  }, [currentUser]);

  const checkDemoAccount = async () => {
    if (!currentUser) {
      setCheckingAccount(false);
      return;
    }

    try {
      // البحث عن حساب تجريبي مربوط
      const accountStatus = await getAccountStatus(currentUser.uid, 'temp');
      setDemoAccount(accountStatus.connected ? accountStatus : null);
    } catch (error) {
      console.error('Error checking demo account:', error);
      setDemoAccount(null);
    } finally {
      setCheckingAccount(false);
    }
  };

  const handleFindChallenge = async (e) => {
    e.preventDefault();
    
    if (!inviteCode || inviteCode.length !== 6) {
      setError('Invite code must be 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setChallenge(null);

    try {
      const foundChallenge = await findChallengeByInviteCode(inviteCode);
      setChallenge(foundChallenge);
      setSuccess(false);
    } catch (error) {
      setError(error.message || 'Invalid invite code');
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async () => {
    if (!currentUser) {
      setError('You must be logged in to join a challenge');
      return;
    }

    if (!demoAccount) {
      setError('You must connect a demo account before joining');
      navigate('/demo-account-setup'); // توجيه لصفحة ربط الحساب
      return;
    }

    if (!challenge) {
      setError('No challenge selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const demoAccountId = `${currentUser.uid}_temp`;
      const userName = currentUser.displayName || currentUser.email || 'User';
      
      await joinChallenge(
        challenge.id,
        currentUser.uid,
        userName,
        demoAccountId
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/challenge-dashboard');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to join challenge');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-400 mb-4">You must be logged in to join a challenge</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-bold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-amber-500" />
            <Key className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Join Challenge
          </h1>
          <p className="text-gray-400">Enter your invite code to join a trading challenge</p>
        </motion.div>

        {/* Demo Account Status */}
        {checkingAccount ? (
          <div className="glass-card border border-border rounded-xl p-6 mb-6 flex items-center justify-center gap-3">
            <Loader className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-muted-foreground">Checking demo account...</span>
          </div>
        ) : demoAccount ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700/50 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-bold text-green-400">Demo Account Connected</h3>
                <p className="text-sm text-muted-foreground">
                  {demoAccount.brokerName} - {demoAccount.accountNumber}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/50 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-bold text-red-400">No Demo Account Connected</h3>
                <p className="text-sm text-muted-foreground">
                  You must connect a demo account before joining a challenge
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/demo-account-setup')}
              className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-bold"
            >
              Connect Demo Account
            </button>
          </motion.div>
        )}

        {/* Invite Code Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-border rounded-xl p-8 mb-6"
        >
          <form onSubmit={handleFindChallenge} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-amber-500"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Enter the 6-character invite code
              </p>
            </div>

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

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-400 text-sm">
                  Successfully joined! Redirecting...
                </span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !inviteCode || inviteCode.length !== 6}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5" />
                  <span>Find Challenge</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Challenge Details */}
        {challenge && !success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-amber-500/30 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-amber-500" />
              <div>
                <h2 className="text-2xl font-bold">{challenge.name}</h2>
                <p className="text-muted-foreground text-sm">{challenge.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Initial Balance</p>
                <p className="text-xl font-bold text-amber-500">
                  ${challenge.initialBalance?.toLocaleString()}
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Profit Target</p>
                <p className="text-xl font-bold text-green-500">
                  {challenge.profitTargetPercent}%
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="text-xl font-bold">{challenge.duration} days</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Participants</p>
                <p className="text-xl font-bold">
                  {challenge.currentParticipants} / {challenge.maxParticipants}
                </p>
              </div>
            </div>

            <button
              onClick={handleJoinChallenge}
              disabled={loading || !demoAccount}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-6 h-6" />
                  <span>Join Challenge</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}

export default JoinChallengeWithCode;
