import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import axios from 'axios';
import type { RegisterFormValues } from '../types/auth';
import { registerSchema } from '../validation/authSchemas';
import { AuthErrorCode } from '../types/authErrors';
import { useMutation } from '@tanstack/react-query';

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
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setName = (name: string) => setValues((v) => ({ ...v, name }));
  const setEmail = (email: string) => setValues((v) => ({ ...v, email }));
  const setPassword = (password: string) => setValues((v) => ({ ...v, password }));
  const setConfirmPassword = (confirmPassword: string) => setValues((v) => ({ ...v, confirmPassword }));
  const { name, email, password, confirmPassword } = values;

  const mutation = useMutation<void, unknown, RegisterFormValues>({
    mutationFn: async (values: RegisterFormValues) => {
      await registerUser(values);
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(
          typeof err.response?.data?.errorKey === 'string' && Object.values(AuthErrorCode).includes(err.response.data.errorKey)
            ? err.response.data.errorKey
            : AuthErrorCode.GENERIC
        );
      } else if (err instanceof Error) {
        setError(AuthErrorCode.GENERIC);
      } else {
        setError(AuthErrorCode.UNKNOWN);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    // Validation Zod
    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const firstError = result.error.errors[0];
      setError(firstError.message);
      return;
    }
    await mutation.mutateAsync({ name, email, password, confirmPassword });
  };


  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    isLoading: mutation.status === 'pending',
    error, success, handleSubmit,
    values,
    fieldErrors: {},
  };
}
