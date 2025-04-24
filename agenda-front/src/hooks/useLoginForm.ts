import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { useAuth } from '../store/auth';
import axios from 'axios';
import type { LoginFormValues } from '../types/auth';
import { loginSchema } from '../validation/authSchemas';

import { AuthErrorCode } from '../types/authErrors';
import { useMutation } from '@tanstack/react-query';

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
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const setEmail = (email: string) => setValues((v) => ({ ...v, email }));
  const setPassword = (password: string) => setValues((v) => ({ ...v, password }));
  const { email, password } = values;

  const mutation = useMutation<string, unknown, LoginFormValues>({
    mutationFn: async (values: LoginFormValues) => {
      const res = await loginUser(values);
      if (!res.accessToken || typeof res.accessToken !== 'string') {
        throw new Error(AuthErrorCode.INVALID_TOKEN);
      }
      return res.accessToken;
    },
    onSuccess: (accessToken) => {
      setAccessToken(accessToken);
      navigate('/dashboard');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(
          typeof err.response?.data?.errorKey === 'string' && Object.values(AuthErrorCode).includes(err.response.data.errorKey)
            ? err.response.data.errorKey
            : AuthErrorCode.GENERIC
        );
      } else if (err instanceof Error) {
        setError(err.message || AuthErrorCode.GENERIC);
      } else {
        setError(AuthErrorCode.UNKNOWN);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    // Validation Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const firstError = result.error.errors[0];
      setError(firstError.message);
      return;
    }
    await mutation.mutateAsync({ email, password });
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
    isLoading: mutation.status === 'pending',
    error,
    handleSubmit,
  };
}
