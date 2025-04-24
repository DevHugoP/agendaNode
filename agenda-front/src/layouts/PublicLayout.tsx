import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const isLogin = location.pathname === '/login';
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
      <motion.header 
        className="bg-agenda-purple text-white py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold text-white drop-shadow-md hover:text-gray-200 transition-colors">
            {t('index.title')}
          </Link>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className={
                  isRegister
                    ? "bg-white text-agenda-purple py-2 px-4 rounded font-semibold drop-shadow hover:bg-gray-100 transition-colors"
                    : "text-white hover:text-gray-200 font-semibold transition-colors"
                }
                aria-current={isRegister ? "page" : undefined}
              >
                {t('login.signup')}
              </Link>
              <Link
                to="/login"
                className={
                  isLogin
                    ? "bg-white text-agenda-purple py-2 px-4 rounded font-semibold drop-shadow hover:bg-gray-100 transition-colors"
                    : "text-white hover:text-gray-200 font-semibold transition-colors"
                }
                aria-current={isLogin ? "page" : undefined}
              >
                {t('login.button')}
              </Link>
            </div>
            <div className="ml-10">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </motion.header>
      
      <main className="flex-grow">
        {children}
        <section className="mt-12 mb-20 px-4 sm:px-0 max-w-5xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md card-hover flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-agenda-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('index.calendarTitle')}</h3>
              <p className="text-gray-700">{t('index.calendarDesc')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md card-hover flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-agenda-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('index.smsTitle')}</h3>
              <p className="text-gray-700">{t('index.smsDesc')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md card-hover flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-agenda-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('index.statsTitle')}</h3>
              <p className="text-gray-700">{t('index.statsDesc')}</p>
            </div>
          </div>
        </section>
      </main>
      
      <motion.footer 
        className="bg-gray-100 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600">{t('publicLayout.copyright')}</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-agenda-purple">
                {t('publicLayout.help')}
              </a>
              <a href="#" className="text-gray-600 hover:text-agenda-purple">
                {t('publicLayout.terms')}
              </a>
              <a href="#" className="text-gray-600 hover:text-agenda-purple">
                {t('publicLayout.privacy')}
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default PublicLayout;