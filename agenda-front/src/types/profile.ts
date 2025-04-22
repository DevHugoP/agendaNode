import type { z } from "zod";
import type { profileSchema } from "../validation/profileSchemas";

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type UserProfileStats = {
  totalAppointments: number;
  upcoming: number;
  clients: number;
  revenue: number;
};

export type UserProfileData = ProfileFormValues & {
  stats: UserProfileStats;
  stripeConnected: boolean;
  googleCalendarSync: boolean;
};
