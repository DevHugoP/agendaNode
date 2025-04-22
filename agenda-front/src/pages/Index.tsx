import { motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import { useTranslation } from 'react-i18next';
import PublicLayout from '../layouts/PublicLayout';

const Index = () => {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
        <motion.div 
          className="sm:mx-auto sm:w-full sm:max-w-md text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{t('index.title')}</h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            {t('index.subtitle')}
          </p>
          <motion.div 
            className="h-1 w-24 bg-agenda-purple mx-auto rounded-full my-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
        </div>
        
        <motion.div 
          className="mt-12 sm:mx-auto px-4 sm:px-0 sm:max-w-3xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-agenda-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('index.calendarTitle')}</h3>
              <p className="text-gray-600">{t('index.calendarDesc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-agenda-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('index.smsTitle')}</h3>
              <p className="text-gray-600">{t('index.smsDesc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-agenda-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('index.statsTitle')}</h3>
              <p className="text-gray-600">{t('index.statsDesc')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default Index;