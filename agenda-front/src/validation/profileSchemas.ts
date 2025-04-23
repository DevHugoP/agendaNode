import * as z from 'zod';

import type { TFunction } from 'i18next';

export function createProfileSchema(t: TFunction) {
  return z.object({
    fullName: z.string().min(2, t('userProfile.form.fullNameRequired')),
    profession: z.string().min(2, t('userProfile.form.professionRequired')),
    email: z.string().email(t('userProfile.form.emailInvalid')),
    phone: z.string().min(6, t('userProfile.form.phoneRequired')),
    company: z.string().min(2, t('userProfile.form.companyRequired')),
    address: z.string().min(2, t('userProfile.form.addressRequired')),
    website: z.string().url(t('userProfile.form.websiteInvalid')).optional().or(z.literal('')),
    bio: z.string().max(500, t('userProfile.form.bioMax')).optional(),
    avatar: z.string().url(t('userProfile.form.avatarInvalid')).optional(),
    // Champs additionnels ignorés par défaut
    stats: z.any().optional(),
    stripeConnected: z.boolean().optional(),
    googleCalendarSync: z.boolean().optional(),
  });
}
