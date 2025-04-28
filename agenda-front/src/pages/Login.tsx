import { useState } from "react";
import { loginUser } from "../services/auth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicLayout from "../layouts/PublicLayout";

import { useAuth } from "../store/auth";
import { useTranslation } from 'react-i18next';

import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const store = useAuth();
  const { t } = useTranslation();
  

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      
      const res = await loginUser({ email, password });
      
      if (!res.accessToken || typeof res.accessToken !== "string") {
        setError("Token d'accès manquant ou invalide dans la réponse.");
        return;
      }
      
      store.setAccessToken(res.accessToken);
      
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
const apiErrorKey = err.response?.data?.message || 'generic';
setError(apiErrorKey);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('login.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            {t('login.subtitle')}
          </p>
          <motion.div 
            className="h-1 w-24 bg-agenda-purple mx-auto rounded-full my-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.div>
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder={t('login.passwordPlaceholder')}
                required
                aria-required="true"
                aria-invalid={!!error}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                tabIndex={0}
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
                onChange={() => setRememberMe((v) => !v)}
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
            aria-busy={isLoading}
            aria-disabled={isLoading}
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
      </div>
    </PublicLayout>
  );
};

export default Login;
