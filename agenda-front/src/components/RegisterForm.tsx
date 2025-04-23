import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';

const RegisterForm = () => {
  const { t } = useTranslation();
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    isLoading, error, success, handleSubmit
  } = useRegisterForm();

  // Centralise les handlers de champ pour factoriser
  const handleFieldChange = (field: 'name' | 'email' | 'password' | 'confirmPassword') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (field) {
      case 'name': setName(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
    }
  };

  // Pour une future extension : gestion fieldErrors (voir hook)

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{t('register.createAccountTitle')}</h2>
      </div>
      
      {error && (
        <motion.div 
          className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          role="alert"
          aria-live="assertive"
        >
          <p>{error}</p>
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          className="bg-green-50 text-green-700 p-3 rounded-md mb-6 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p>{t('register.success')}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label htmlFor="name" className="form-label">
            {t('register.name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleFieldChange('name')}
            className="form-input focus:ring-2 focus:ring-agenda-purple focus:outline-none"
            placeholder={t('register.namePlaceholder')}
            required
            aria-required="true"
            aria-invalid={!!error}
            autoComplete="name"
          />
        </div>
        
        <div className="form-control">
          <label htmlFor="email" className="form-label">
            {t('login.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleFieldChange('email')}
            className="form-input focus:ring-2 focus:ring-agenda-purple focus:outline-none"
            placeholder={t('login.emailPlaceholder')}
            required
            aria-required="true"
            aria-invalid={!!error}
            autoComplete="email"
          />
        </div>
        
        <div className="form-control">
          <label htmlFor="password" className="form-label">
            {t('login.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleFieldChange('password')}
              className="form-input focus:ring-2 focus:ring-agenda-purple focus:outline-none"
              placeholder="••••••••"
              required
              aria-required="true"
              aria-invalid={!!error}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={0}
              aria-label={showPassword ? t('register.hidePassword') : t('register.showPassword')}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-agenda-purple"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        <div className="form-control">
          <label htmlFor="confirmPassword" className="form-label">
            {t('register.confirmPassword')}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleFieldChange('confirmPassword')}
              className="form-input focus:ring-2 focus:ring-agenda-purple focus:outline-none"
              placeholder="••••••••"
              required
              aria-required="true"
              aria-invalid={!!error}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={0}
              aria-label={showConfirmPassword ? t('register.hidePassword') : t('register.showPassword')}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-agenda-purple"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
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
              {t('register.loading')}
            </span>
          ) : (
            t('register.submit')
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t('register.alreadyAccount')}{' '}
          <Link to="/login" className="text-agenda-purple hover:text-agenda-light-purple">
            {t('login.loginButton')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm;