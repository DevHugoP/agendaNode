import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, "Le mot de passe est requis"),
  }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
