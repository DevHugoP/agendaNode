import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
