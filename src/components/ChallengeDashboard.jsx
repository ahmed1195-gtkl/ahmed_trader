import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, 
  CheckCircle, XCircle, Clock, Users, BarChart3, ArrowLeft, Plus,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { 
  getParticipantData, 
  getParticipantTrades,
  openTrade,
  closeTrade,
  updateOpenTrades
} from '../lib/challengeEngine';
import { 
  getAllSymbols, 
  getCurrentPrice,
  calculatePositionSize,
  calculateSLTP,
  priceStream
} from '../lib/marketDataService';
import Header from './Header';
import TeamManagement from './TeamManagement';
import ConnectDemoAccount from './ConnectDemoAccount';

function ChallengeDashboard() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [participant, setParticipant] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [trades, setTrades] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [marketPrices, setMarketPrices] = useState({});
  
  // Trade form state
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadData();
    
    // الاشتراك في التحديثات الفورية
    const unsubscribe = subscribeToUpdates();
    
    return () => {
      if (unsubscribe) unsubscribe();
      priceStream.disconnect();
    };
  }, [participantId, user]);

  const loadData = async () => {
    try {
      // تحميل بيانات المشارك
      const participantData = await getParticipantData(participantId);
      setParticipant(participantData);

      // تحميل بيانات التحدي
      const challengeDoc = await getDoc(doc(db, 'challenges', participantData.challengeId));
      setChallenge({ id: challengeDoc.id, ...challengeDoc.data() });

      // تحميل الصفقات
      const tradesData = await getParticipantTrades(participantId);
      setTrades(tradesData);

      // تحميل لوحة الصدارة
      const leaderboardDoc = await getDoc(doc(db, 'challenge_leaderboards', participantData.challengeId));
      if (leaderboardDoc.exists()) {
        setLeaderboard(leaderboardDoc.data().leaderboard || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    // الاشتراك في تحديثات المشارك
    const participantUnsub = onSnapshot(
      doc(db, 'challenge_participants', participantId),
      (doc) => {
        if (doc.exists()) {
          setParticipant(doc.data());
        }
      }
    );

    // الاشتراك في تحديثات الصفقات
    const tradesQuery = query(
      collection(db, 'challenge_trades'),
      where('participantId', '==', participantId),
      orderBy('openedAt', 'desc')
    );
    
    const tradesUnsub = onSnapshot(tradesQuery, (snapshot) => {
      const tradesData = snapshot.docs.map(doc => doc.data());
      setTrades(tradesData);
    });

    return () => {
      participantUnsub();
      tradesUnsub();
    };
  };

  const handleOpenTrade = async (e) => {
    e.preventDefault();
    
    if (!selectedSymbol || !stopLoss || !takeProfit) {
      alert(i18n.language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setSubmitting(true);

    try {
      // الحصول على السعر الحالي
      const priceData = await getCurrentPrice(selectedSymbol);
      const entryPrice = priceData.price;

      // حساب حجم الصفقة
      const size = calculatePositionSize(
        participant.balance,
        riskPercent,
        entryPrice,
        parseFloat(stopLoss)
      );

      if (size <= 0) {
        throw new Error('Invalid position size');
      }

      // فتح الصفقة
      await openTrade(participantId, {
        symbol: selectedSymbol,
        type: tradeType,
        size,
        entryPrice,
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit)
      });

      // إعادة تعيين النموذج
      setShowTradeModal(false);
      setSelectedSymbol('');
      setStopLoss('');
      setTakeProfit('');
      
      alert(i18n.language === 'ar' ? 'تم فتح الصفقة بنجاح' : 'Trade opened successfully');
    } catch (error) {
      console.error('Error opening trade:', error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTrade = async (tradeId, currentPrice) => {
    if (!confirm(i18n.language === 'ar' ? 'هل تريد إغلاق هذه الصفقة؟' : 'Close this trade?')) {
      return;
    }

    try {
      await closeTrade(tradeId, currentPrice);
      alert(i18n.language === 'ar' ? 'تم إغلاق الصفقة بنجاح' : 'Trade closed successfully');
    } catch (error) {
      console.error('Error closing trade:', error);
      alert(error.message);
    }
  };

  const handleSymbolChange = async (symbol) => {
    setSelectedSymbol(symbol);
    
    try {
      const priceData = await getCurrentPrice(symbol);
      const sltp = calculateSLTP(priceData.price, tradeType);
      setStopLoss(sltp.stopLoss.toString());
      setTakeProfit(sltp.takeProfit.toString());
    } catch (error) {
      console.error('Error calculating SL/TP:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!participant || !challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl">
            {i18n.language === 'ar' ? 'لم يتم العثور على التحدي' : 'Challenge not found'}
          </p>
        </div>
      </div>
    );
  }

  const progressPercent = (participant.profitLossPercent / challenge.profitTarget) * 100;
  const daysRemaining = challenge.endDate 
    ? Math.ceil((challenge.endDate.toDate() - new Date()) / (1000 * 60 * 60 * 24))
    : challenge.duration;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">
              {i18n.language === 'ar' ? 'العودة للتحديات' : 'Back to Challenges'}
            </span>
          </button>

          {/* Status Banner */}
          {participant.status === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-black text-red-500 uppercase mb-2">
                    {i18n.language === 'ar' ? 'فشل التحدي' : 'Challenge Failed'}
                  </h3>
                  <p className="text-red-400 text-sm">{participant.failureReason}</p>
                </div>
              </div>
            </motion.div>
          )}

          {participant.status === 'passed' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-black text-green-500 uppercase mb-2">
                    {i18n.language === 'ar' ? 'تهانينا! لقد نجحت' : 'Congratulations! You Passed'}
                  </h3>
                  <p className="text-green-400 text-sm">
                    {i18n.language === 'ar' 
                      ? 'لقد حققت جميع أهداف التحدي. سيتم الاتصال بك قريباً للحصول على حسابك الممول.'
                      : 'You achieved all challenge goals. You will be contacted soon for your funded account.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-amber-500" />
                <div className={`text-sm font-bold ${participant.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {participant.profitLoss >= 0 ? '+' : ''}{participant.profitLossPercent.toFixed(2)}%
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                ${participant.balance.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {i18n.language === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-blue-500" />
                <div className="text-sm font-bold text-blue-500">
                  {participant.winRate.toFixed(1)}%
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {participant.totalTrades}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {i18n.language === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div className="text-sm font-bold text-orange-500">
                  {challenge.maxDrawdown}% max
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {participant.maxDrawdown.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Max Drawdown
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-purple-500" />
                <div className="text-sm font-bold text-purple-500">
                  {challenge.duration} {i18n.language === 'ar' ? 'يوم' : 'days'}
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {daysRemaining}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {i18n.language === 'ar' ? 'أيام متبقية' : 'Days Remaining'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white uppercase">
                  {i18n.language === 'ar' ? 'تقدم الهدف' : 'Target Progress'}
                </h3>
                <p className="text-sm text-gray-500">
                  {i18n.language === 'ar' ? 'الهدف:' : 'Target:'} +{challenge.profitTarget}%
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-500">
                  {progressPercent.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {i18n.language === 'ar' ? 'مكتمل' : 'Complete'}
                </div>
              </div>
            </div>
            
            <div className="w-full h-4 bg-black rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${progressPercent >= 100 ? 'bg-green-500' : 'bg-amber-500'}`}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trades */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white uppercase">
                  {i18n.language === 'ar' ? 'الصفقات' : 'Trades'}
                </h2>
                
                {participant.status === 'active' && (
                  <button
                    onClick={() => setShowTradeModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-xl font-black text-sm uppercase hover:bg-amber-400 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    {i18n.language === 'ar' ? 'صفقة جديدة' : 'New Trade'}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {trades.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {i18n.language === 'ar' ? 'لا توجد صفقات بعد' : 'No trades yet'}
                    </p>
                  </div>
                ) : (
                  trades.map((trade) => (
                    <div
                      key={trade.id}
                      className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/20 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-black text-white">{trade.symbol}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              trade.type === 'buy' 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-red-500/10 text-red-500'
                            }`}>
                              {trade.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              trade.status === 'open' 
                                ? 'bg-blue-500/10 text-blue-500' 
                                : 'bg-gray-500/10 text-gray-500'
                            }`}>
                              {trade.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {i18n.language === 'ar' ? 'الحجم:' : 'Size:'} {trade.size} | 
                            {i18n.language === 'ar' ? ' الدخول:' : ' Entry:'} {trade.entryPrice.toFixed(5)}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-black ${trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)}
                          </div>
                          <div className={`text-sm font-bold ${trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">
                            {i18n.language === 'ar' ? 'السعر الحالي' : 'Current'}
                          </div>
                          <div className="text-white font-bold">{trade.currentPrice.toFixed(5)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Stop Loss</div>
                          <div className="text-red-500 font-bold">{trade.stopLoss.toFixed(5)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Take Profit</div>
                          <div className="text-green-500 font-bold">{trade.takeProfit.toFixed(5)}</div>
                        </div>
                      </div>

                      {trade.status === 'open' && participant.status === 'active' && (
                        <button
                          onClick={() => handleCloseTrade(trade.id, trade.currentPrice)}
                          className="w-full mt-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                        >
                          {i18n.language === 'ar' ? 'إغلاق الصفقة' : 'Close Trade'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Team Management */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-black text-white uppercase">
                  {i18n.language === 'ar' ? 'إدارة الفريق' : 'Team Management'}
                </h2>
              </div>
              <TeamManagement challengeId={participant.challengeId} participantId={participantId} />
            </div>

            {/* Connect Demo Account */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-black text-white uppercase">
                  {i18n.language === 'ar' ? 'ربط حساب ديمو' : 'Connect Demo Account'}
                </h2>
              </div>
              <ConnectDemoAccount participantId={participantId} onConnected={() => loadData()} />
            </div>

            {/* Leaderboard */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-black text-white uppercase">
                  {i18n.language === 'ar' ? 'الترتيب' : 'Leaderboard'}
                </h2>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`p-4 border-b border-white/5 last:border-0 ${
                      entry.userId === user.uid ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                          index === 0 ? 'bg-amber-500/20 text-amber-500' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-600/20 text-orange-600' :
                          'bg-white/5 text-gray-500'
                        }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">{entry.userName}</div>
                          <div className="text-xs text-gray-500">{entry.totalTrades} trades</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-black ${entry.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {entry.profitLossPercent >= 0 ? '+' : ''}{entry.profitLossPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <AnimatePresence>
        {showTradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowTradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black text-white uppercase mb-6">
                {i18n.language === 'ar' ? 'صفقة جديدة' : 'New Trade'}
              </h2>

              <form onSubmit={handleOpenTrade} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                    {i18n.language === 'ar' ? 'الرمز' : 'Symbol'}
                  </label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => handleSymbolChange(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                    required
                  >
                    <option value="">
                      {i18n.language === 'ar' ? 'اختر الرمز' : 'Select Symbol'}
                    </option>
                    {getAllSymbols().map(s => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                    {i18n.language === 'ar' ? 'النوع' : 'Type'}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTradeType('buy')}
                      className={`py-3 rounded-xl font-bold uppercase transition-all ${
                        tradeType === 'buy'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}
                    >
                      {i18n.language === 'ar' ? 'شراء' : 'Buy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('sell')}
                      className={`py-3 rounded-xl font-bold uppercase transition-all ${
                        tradeType === 'sell'
                          ? 'bg-red-500 text-white'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}
                    >
                      {i18n.language === 'ar' ? 'بيع' : 'Sell'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                    {i18n.language === 'ar' ? 'المخاطرة' : 'Risk'} (%)
                  </label>
                  <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                    min="0.1"
                    max={challenge.riskPerTrade}
                    step="0.1"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {i18n.language === 'ar' ? 'الحد الأقصى:' : 'Max:'} {challenge.riskPerTrade}%
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                      Stop Loss
                    </label>
                    <input
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      step="0.00001"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                      Take Profit
                    </label>
                    <input
                      type="number"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      step="0.00001"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowTradeModal(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase hover:bg-white/10 transition-all"
                  >
                    {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-amber-500 text-black rounded-xl font-bold uppercase hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {submitting 
                      ? (i18n.language === 'ar' ? 'جاري الفتح...' : 'Opening...')
                      : (i18n.language === 'ar' ? 'فتح الصفقة' : 'Open Trade')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChallengeDashboard;
