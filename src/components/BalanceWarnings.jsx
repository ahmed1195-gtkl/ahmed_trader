import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, XCircle, Info } from 'lucide-react';

function BalanceWarnings({ participant }) {
  const { i18n } = useTranslation();
  const [showWarnings, setShowWarnings] = useState(true);

  if (!participant || !participant.warnings || participant.warnings.length === 0) {
    return null;
  }

  const warningCount = participant.balanceDiscrepancies || 0;
  const isDisqualified = participant.status === 'disqualified';
  const isCritical = warningCount >= 2;

  return (
    <AnimatePresence>
      {showWarnings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`border rounded-2xl p-6 mb-8 ${
            isDisqualified
              ? 'bg-red-500/10 border-red-500/20'
              : isCritical
              ? 'bg-orange-500/10 border-orange-500/20'
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {isDisqualified ? (
                <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              ) : (
                <AlertTriangle className={`w-8 h-8 flex-shrink-0 mt-1 ${
                  isCritical ? 'text-orange-500' : 'text-yellow-500'
                }`} />
              )}
              
              <div className="flex-1">
                <h3 className={`text-xl font-black uppercase mb-2 ${
                  isDisqualified
                    ? 'text-red-500'
                    : isCritical
                    ? 'text-orange-500'
                    : 'text-yellow-500'
                }`}>
                  {isDisqualified
                    ? (i18n.language === 'ar' ? '❌ تم الإقصاء من التحدي' : '❌ Challenge Disqualification')
                    : (i18n.language === 'ar' ? '⚠️ تحذيرات الرصيد' : '⚠️ Balance Warnings')}
                </h3>

                {isDisqualified ? (
                  <div className="space-y-3">
                    <p className="text-red-400 text-sm">
                      {participant.disqualificationReason}
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <p className="text-sm text-red-300">
                        {i18n.language === 'ar'
                          ? 'لقد تم إقصاؤك من التحدي بسبب اكتشاف تغييرات غير مبررة في رصيد حسابك. يرجى التأكد من عدم إجراء أي تعديلات يدوية على الحساب التجريبي أثناء التحدي.'
                          : 'You have been disqualified from the challenge due to unexplained changes in your account balance. Please ensure no manual modifications are made to the demo account during the challenge.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-black ${
                        isCritical
                          ? 'bg-orange-500/20 text-orange-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {i18n.language === 'ar' 
                          ? `تحذير ${warningCount} من 3`
                          : `Warning ${warningCount} of 3`}
                      </div>
                      {isCritical && (
                        <div className="text-xs text-orange-400 font-bold">
                          {i18n.language === 'ar'
                            ? 'تحذير نهائي! مخالفة واحدة أخرى ستؤدي إلى الإقصاء'
                            : 'Final warning! One more violation will result in disqualification'}
                        </div>
                      )}
                    </div>

                    <p className={`text-sm ${isCritical ? 'text-orange-400' : 'text-yellow-400'}`}>
                      {i18n.language === 'ar'
                        ? 'تم اكتشاف اختلافات في رصيد حسابك لا تتطابق مع نشاط التداول الخاص بك.'
                        : 'Discrepancies detected in your account balance that don\'t match your trading activity.'}
                    </p>

                    {/* Latest Warnings */}
                    <div className="space-y-2 mt-4">
                      {participant.warnings.slice(-3).reverse().map((warning, index) => (
                        <div
                          key={index}
                          className="bg-black/30 border border-white/10 rounded-xl p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="text-xs text-gray-500 mb-1">
                                {new Date(warning.timestamp).toLocaleString(i18n.language)}
                              </div>
                              <div className="text-sm text-white font-medium">
                                {warning.message}
                              </div>
                              {warning.expectedBalance && warning.verifiedBalance && (
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">
                                      {i18n.language === 'ar' ? 'المتوقع: ' : 'Expected: '}
                                    </span>
                                    <span className="text-white font-bold">
                                      ${warning.expectedBalance.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      {i18n.language === 'ar' ? 'الفعلي: ' : 'Actual: '}
                                    </span>
                                    <span className="text-white font-bold">
                                      ${warning.verifiedBalance.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-400">
                          {i18n.language === 'ar'
                            ? 'يتم مراقبة رصيدك تلقائياً كل 30 ثانية. إذا تم اكتشاف أي تغييرات يدوية أو إيداعات في الحساب التجريبي، سيتم تسجيل تحذير. بعد 3 تحذيرات، سيتم إقصاؤك تلقائياً من التحدي.'
                            : 'Your balance is automatically monitored every 30 seconds. If any manual changes or deposits are detected in the demo account, a warning will be logged. After 3 warnings, you will be automatically disqualified from the challenge.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isDisqualified && (
              <button
                onClick={() => setShowWarnings(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BalanceWarnings;
