import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import shukritradeLogo from '../assets/shukritrade_logo.svg';
import { Send, Instagram } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const socialLinks = [
    { name: 'TikTok', icon: '🎵', url: 'https://www.tiktok.com/@ahmed.trader123' },
    { name: 'Telegram', icon: <Send className="w-4 h-4" />, url: 'https://t.me/ahmed_trader_123' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://www.instagram.com/mohamed_chokry' }
  ];

  return (
    <footer className="relative py-12 md:py-16 border-t border-border bg-card">
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left rtl:md:text-right space-y-4">
            <img src={shukritradeLogo} 
              alt="Shukritrade" 
              className="h-10 md:h-12 w-auto object-contain"
              decoding="async" 
              loading="lazy" 
            />
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              {isAr 
                ? 'منصتك الشاملة لتعلم التداول وتحقيق أرباح مستدامة باستخدام بوت الذكاء الاصطناعي والتحليلات المتقدمة.'
                : 'Your comprehensive platform to learn trading and achieve sustainable profits with AI assistance and advanced analytics.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <h4 className="text-foreground text-xs font-black uppercase tracking-widest">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-xs">
              <Link to="/brokers" className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-wider font-bold">
                {isAr ? 'الوسطاء' : 'Brokers'}
              </Link>
              <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-wider font-bold">
                {isAr ? 'أخبار السوق' : 'Market News'}
              </Link>
              <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-wider font-bold">
                {isAr ? 'الكورسات' : 'Courses'}
              </Link>
              <Link to="/books" className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-wider font-bold">
                {isAr ? 'الكتب' : 'Books'}
              </Link>
            </div>
          </div>

          {/* Socials & Community */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right rtl:md:text-left space-y-4">
            <h4 className="text-foreground text-xs font-black uppercase tracking-widest">
              {isAr ? 'تواصل معنا' : 'Connect'}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              {isAr ? 'انضم إلى مجتمع التداول الخاص بنا اليوم' : 'Join our trading community today.'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border mb-8"></div>

        {/* Bottom copyright section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-muted-foreground/80 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Shukritrade. {t('footer.rights')}.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 rtl:space-x-reverse">
            <Link to="/privacy" className="text-muted-foreground/85 hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
              {t('footer.privacy')}
            </Link>
            <Link to="/privacy" className="text-muted-foreground/85 hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
              {t('footer.terms')}
            </Link>
            <a href="https://t.me/ahmed_trader_123" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/85 hover:text-primary transition-colors text-xs font-semibold uppercase tracking-wider">
              {t('footer.contact')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
