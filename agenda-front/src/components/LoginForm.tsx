import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { t } = useTranslation();
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    isLoading, error, handleSubmit
  } = useLoginForm();

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{t('login.title')}</h2>
        <p className="text-gray-500">{t('login.subtitle')}</p>
      </div>
      
      {error && (
        <motion.div 
          className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p>{t(`login.errors.${error}`) || t('login.errors.generic')}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label htmlFor="email" className="form-label">
            {t('login.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder={t('login.emailPlaceholder')}
            required
          />
        </div>
        
        <div className="form-control">
          <label htmlFor="password" className="form-label">
            {t('login.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder={t('login.passwordPlaceholder')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-agenda-purple focus:ring-agenda-purple border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              {t('login.rememberMe')}
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-agenda-purple hover:text-agenda-light-purple">
              {t('login.forgotPassword')}
            </a>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-agenda-purple text-white rounded-md hover:bg-agenda-light-purple focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('login.loading')}
            </span>
          ) : (
            t('login.button')
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="text-agenda-purple hover:text-agenda-light-purple">
            {t('login.signup')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;