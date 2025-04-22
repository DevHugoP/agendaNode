import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues } from '../types/auth';
import { registerSchema } from '../validation/authSchemas';

export interface UseRegisterForm {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (c: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  isLoading: boolean;
  error: string;
  fieldErrors: Record<string, string>;
  success: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  values: RegisterFormValues;
}

export function useRegisterForm(): UseRegisterForm {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setName = (name: string) => setValues((v) => ({ ...v, name }));
  const setEmail = (email: string) => setValues((v) => ({ ...v, email }));
  const setPassword = (password: string) => setValues((v) => ({ ...v, password }));
  const setConfirmPassword = (confirmPassword: string) => setValues((v) => ({ ...v, confirmPassword }));
  const { name, email, password, confirmPassword } = values;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Validation Zod
    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const firstError = result.error.errors[0];
      setError(t(firstError.message));
      setIsLoading(false);
      return;
    }
    try {
      await registerUser({ name, email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t('register.error'));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('register.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    isLoading, error, success, handleSubmit,
    values,
    fieldErrors: {},
  };
}
