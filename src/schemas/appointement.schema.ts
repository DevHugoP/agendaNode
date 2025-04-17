import { z } from "zod";

export const createAppointmentSchema = z.object({
  body: z.object({
    date: z.string().min(1, "Date is required"),
    client: z.string().min(1, "Client name is required"),
  }),
});

export type CreateAppointmentInput = z.infer<
  typeof createAppointmentSchema
>["body"];
