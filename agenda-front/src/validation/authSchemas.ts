import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'login.errors.invalidEmail' }),
  password: z.string().min(6, { message: 'login.errors.passwordMin' }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'register.errors.nameMin' }),
  email: z.string().email({ message: 'register.errors.invalidEmail' }),
  password: z.string().min(6, { message: 'register.errors.passwordMin' }),
  confirmPassword: z.string().min(6, { message: 'register.errors.confirmPasswordMin' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'register.errors.passwordsDontMatch',
  path: ['confirmPassword'],
});
