import { useState } from "react";
import { loginUser } from "../services/auth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiUserPlus } from "react-icons/fi";
import AuthLayout from "../layouts/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../store/auth";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      setToken(res.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t('login.error'));
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
    <AuthLayout title={t('login.welcome')}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm"
        >
          <p className="flex items-center">
            <span className="inline-block mr-2">⚠️</span>
            {error}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label={t('login.email')}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t('login.emailPlaceholder')}
          autoComplete="email"
          icon={FiMail}
        />

        <FormInput
          label={t('login.password')}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          icon={FiLock}
        />

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              {t('login.rememberMe')}
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="text-primary-600 hover:text-primary-700">
              {t('login.forgotPassword')}
            </a>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-2.5 flex items-center justify-center"
          isLoading={isLoading}
        >
          <FiLogIn className="mr-2" />
          {t('login.loginButton')}
        </Button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">{t('login.noAccount')}</span>
          <Link 
            to="/register" 
            className="font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center mt-2"
          >
            <FiUserPlus className="mr-2" />
            {t('login.createAccount')}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
