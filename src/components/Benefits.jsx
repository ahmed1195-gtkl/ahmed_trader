import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Users } from 'lucide-react';

const Benefits = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: CheckCircle,
      title: t('benefits.point1'),
      description: "Master the fundamentals of Forex and Cryptocurrency trading with our simplified approach."
    },
    {
      icon: TrendingUp,
      title: t('benefits.point2'),
      description: "Access cutting-edge AI-powered trading strategies that give you a competitive edge.",
      featured: true
    },
    {
      icon: Users,
      title: t('benefits.point3'),
      description: "Join our active community and receive continuous updates and support."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-12 md:py-20 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-background/30"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 px-4 uppercase tracking-tight">
            {t('benefits.title')}
          </h2>
          <div className="w-16 h-[2px] bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch"
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            const isFeatured = benefit.featured;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex"
              >
                <div className={`glass-card glass-card-hover p-6 md:p-8 text-center flex flex-col justify-between w-full relative ${
                  isFeatured 
                    ? 'border-primary/30 bg-primary/5 shadow-lg shadow-gold-glow md:-translate-y-2' 
                    : 'border-border'
                }`}>
                  {isFeatured && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest">
                      Core Benefit
                    </span>
                  )}
                  <div>
                    <div className="mb-6 flex justify-center">
                      <div className={`w-14 h-14 rounded-md flex items-center justify-center transition-all duration-300 ${
                        isFeatured 
                          ? 'bg-primary/20 text-primary border border-primary/25' 
                          : 'bg-secondary text-muted-foreground border border-border group-hover:border-primary/20'
                      }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-wider mb-4">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed text-wrap-pretty">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
