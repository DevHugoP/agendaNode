import type { z } from "zod";
import type { profileSchema } from "../validation/profileSchemas";

export type UserProfile = {
  id?: number;
  email: string;
  phone?: string;
  fullName?: string;
  profession?: string;
  company?: string;
  address?: string;
  website?: string;
  bio?: string;
  avatar?: string;
  // Champs additionnels pour dashboard
  stats?: UserProfileStats;
  stripeConnected?: boolean;
  googleCalendarSync?: boolean;
};

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type UserProfileStats = {
  totalAppointments: number;
  upcoming: number;
  clients: number;
  revenue: number;
};
