import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import teamLogo from '../assets/team_logo.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative py-8 md:py-12 border-t border-white/10">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Team Logo */}
          <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6">
            <img 
              src={teamLogo} 
              alt="Team Logo" 
              className="h-12 w-12 rounded-lg object-cover"
            />
            <span className="text-white font-bold text-lg md:text-xl">Valcons Trading Team</span>
          </div>

          {/* Team Description */}
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('footer.team')}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 AI Trader Course. {t('footer.rights')}.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 rtl:space-x-reverse">
              <Link to="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm">
                {t('footer.privacy')}
              </Link>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm">
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
