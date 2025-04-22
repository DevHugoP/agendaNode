import { z } from 'zod';

export const appointmentSchema = z.object({
  title: z.string().min(2, { message: 'appointment.errors.titleMin' }),
  clientName: z.string().min(2, { message: 'appointment.errors.clientNameMin' }),
  start: z.date({ required_error: 'appointment.errors.startRequired' }),
  end: z.date({ required_error: 'appointment.errors.endRequired' }),
  appointmentType: z.string().min(2, { message: 'appointment.errors.typeMin' }),
  notes: z.string().optional(),
  status: z.enum(['confirmed', 'pending', 'cancelled'], { message: 'appointment.errors.statusInvalid' }),
}).refine((data) => data.end > data.start, {
  message: 'appointment.errors.endAfterStart',
  path: ['end'],
});
