import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { useAuth } from '../store/auth';
import axios from 'axios';
import type { LoginFormValues } from '../types/auth';
import { loginSchema } from '../validation/authSchemas';
import { useTranslation } from 'react-i18next';

export interface UseLoginForm {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  isLoading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useLoginForm(): UseLoginForm {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const setEmail = (email: string) => setValues((v) => ({ ...v, email }));
  const setPassword = (password: string) => setValues((v) => ({ ...v, password }));
  const { email, password } = values;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Validation Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const firstError = result.error.errors[0];
      setError(t(firstError.message));
      setIsLoading(false);
      return;
    }
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.token);
      setToken(res.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t('login.errors.generic'));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('login.errors.unknown'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    error,
    handleSubmit,
  };
}
