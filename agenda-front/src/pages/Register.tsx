import { motion } from 'framer-motion';
import RegisterForm from '../components/RegisterForm';
import PublicLayout from '../layouts/PublicLayout';

import { useTranslation } from 'react-i18next';

const Register = () => {
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
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{t('register.title')}</h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            {t('register.subtitle')}
          </p>
          <motion.div 
            className="h-1 w-24 bg-agenda-purple mx-auto rounded-full my-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;