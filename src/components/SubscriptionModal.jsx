import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Rocket } from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose, currentPlan = 'free' }) => {
  const plans = [
    {
      id: 'free',
      name: 'مجاني',
      nameEn: 'Free',
      price: 0,
      icon: Zap,
      color: 'from-gray-500 to-gray-600',
      features: [
        'تحليل أساسي للسوق',
        'إشارات محدودة (5 يومياً)',
        'مؤشرات فنية أساسية',
        'دعم عبر البريد الإلكتروني'
      ],
      limitations: [
        'لا يوجد تتبع للصفقات الحية',
        'لا يوجد FVG',
        'لا يوجد تعلم متقدم'
      ]
    },
    {
      id: 'pro',
      name: 'احترافي',
      nameEn: 'Pro',
      price: 49,
      icon: Crown,
      color: 'from-blue-500 to-blue-600',
      popular: true,
      features: [
        'تحليل متقدم 7 أبعاد',
        'إشارات غير محدودة',
        'تتبع الصفقات الحية',
        'FVG (Fair Value Gap)',
        'مؤشرات فنية متقدمة',
        'إحصائيات أداء شاملة',
        'دعم ذو أولوية'
      ],
      limitations: []
    },
    {
      id: 'alpha',
      name: 'ألفا',
      nameEn: 'Alpha',
      price: 99,
      icon: Rocket,
      color: 'from-purple-500 to-pink-600',
      features: [
        'كل ميزات Pro',
        'محرك التكيف الاستراتيجي',
        'تعلم معزز متقدم',
        'Trailing Stop & Break-Even',
        'Partial Take Profit',
        'Kelly Criterion',
        'Backtesting Engine',
        'دعم مخصص 24/7',
        'إشعارات فورية',
        'API Access'
      ],
      limitations: []
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden pointer-events-auto border border-gray-700">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-amber-500 transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-foreground text-center mb-2">
                  اختر خطتك المثالية
                </h2>
                <p className="text-white/90 text-center">
                  ابدأ رحلتك نحو التداول الاحترافي مع Phoenix Engine V2.0
                </p>
              </div>

              {/* Plans Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrentPlan = currentPlan === plan.id;

                    return (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className={`relative rounded-xl p-6 ${
                          plan.popular
                            ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500'
                            : 'bg-gray-800/50 border border-gray-700'
                        } backdrop-blur-sm`}
                      >
                        {/* Popular Badge */}
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                              الأكثر شعبية ⭐
                            </span>
                          </div>
                        )}

                        {/* Current Plan Badge */}
                        {isCurrentPlan && (
                          <div className="absolute -top-3 right-4">
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              خطتك الحالية ✓
                            </span>
                          </div>
                        )}

                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 mx-auto`}>
                          <Icon size={32} className="text-white" />
                        </div>

                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold text-foreground text-center mb-2">
                          {plan.name}
                        </h3>

                        {/* Price */}
                        <div className="text-center mb-6">
                          {plan.price === 0 ? (
                            <span className="text-3xl font-bold text-white">مجاني</span>
                          ) : (
                            <>
                              <span className="text-4xl font-bold text-white">${plan.price}</span>
                              <span className="text-gray-400">/شهر</span>
                            </>
                          )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                          {plan.limitations.map((limitation, index) => (
                            <li key={`limit-${index}`} className="flex items-start gap-2 text-gray-500">
                              <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm line-through">{limitation}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <button
                          disabled={isCurrentPlan}
                          className={`w-full py-3 rounded-lg font-bold transition-all ${
                            isCurrentPlan
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : plan.popular
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                              : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500'
                          }`}
                        >
                          {isCurrentPlan ? 'خطتك الحالية' : plan.price === 0 ? 'البدء مجاناً' : 'ترقية الآن'}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    💡 يمكنك الترقية أو الإلغاء في أي وقت. جميع الأسعار بالدولار الأمريكي.
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    للمزيد من المعلومات أو للحصول على خطة مخصصة، تواصل مع الدعم.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
