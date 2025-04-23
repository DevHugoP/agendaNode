// Importations
import { useForm } from 'react-hook-form';
import { createProfileSchema } from '../../validation/profileSchemas';
import type { ProfileFormValues } from '../../types/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// Interface des props
interface EditProfileFormProps {
  initialValues: ProfileFormValues;
  onCancel: () => void;
  onSave: (values: ProfileFormValues) => Promise<void>;
}

// Helper pour générer un champ input standard
function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

// Composant principal
export default function EditProfileForm({ initialValues, onCancel, onSave }: EditProfileFormProps) {
  // Normalisation des valeurs null ou undefined pour les placeholders
  const normalizedValues = {
    ...initialValues,
    fullName: initialValues.fullName ?? '',
    profession: initialValues.profession ?? '',
    email: initialValues.email ?? '',
    phone: initialValues.phone ?? '',
    company: initialValues.company ?? '',
    address: initialValues.address ?? '',
    website: initialValues.website ?? '',
    bio: initialValues.bio ?? '',
    avatar: initialValues.avatar ?? ''
  };

  // Utilisation de la traduction
  const { t, i18n } = useTranslation();

  // Génération du schéma de validation en fonction de la langue
  const schema = useMemo(() => createProfileSchema(t), [i18n.language, t]);

  // Utilisation de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: normalizedValues,
  });

  // Vérification si le formulaire a changé
  const isFormChanged = (values: ProfileFormValues) =>
    (Object.keys(initialValues) as (keyof ProfileFormValues)[]).some(
      (key) => values[key] !== initialValues[key]
    );

  // Handler de soumission avec vérification de modification
  const handleSubmitWithCheck = async (values: ProfileFormValues) => {
    if (!isFormChanged(values)) return;
    await onSave(values);
  };

  // Rendu du formulaire
  return (
    <motion.form
      id="edit-profile-form"
      onSubmit={handleSubmit(handleSubmitWithCheck)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-8"
    >
      {/* Avatar */}
      <div className="bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-10 items-start">
        <div className="flex flex-col items-center gap-4 min-w-[140px]">
          <img
            src={initialValues.avatar || '/avatar-placeholder.png'}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-agenda-purple shadow"
          />
          <FormField label={t('userProfile.form.avatar')} error={errors.avatar?.message}>
            <input
              {...register('avatar')}
              type="url"
              className="input w-52 mt-2"
              placeholder={t('userProfile.form.avatarPlaceholder')}
            />
          </FormField>
        </div>

        {/* Infos principales */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField label={t('userProfile.form.fullName')} error={errors.fullName?.message}>
            <input
              {...register('fullName')}
              className="input w-full"
              placeholder={t('userProfile.form.fullNamePlaceholder')}
            />
          </FormField>
          <FormField label={t('userProfile.form.profession')} error={errors.profession?.message}>
            <input
              {...register('profession')}
              className="input w-full"
              placeholder={t('userProfile.form.professionPlaceholder')}
            />
          </FormField>
          <FormField label={t('userProfile.form.email')} error={errors.email?.message}>
            <input
              {...register('email')}
              className="input w-full"
              placeholder={t('userProfile.form.emailPlaceholder')}
            />
          </FormField>
          <FormField label={t('userProfile.form.phone')} error={errors.phone?.message}>
            <input
              {...register('phone')}
              className="input w-full"
              placeholder={t('userProfile.form.phonePlaceholder')}
            />
          </FormField>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FormField label={t('userProfile.form.company')} error={errors.company?.message}>
          <input
            {...register('company')}
            className="input w-full"
            placeholder={t('userProfile.form.companyPlaceholder')}
          />
        </FormField>
        <FormField label={t('userProfile.form.address')} error={errors.address?.message}>
          <input
            {...register('address')}
            className="input w-full"
            placeholder={t('userProfile.form.addressPlaceholder')}
          />
        </FormField>
        <FormField label={t('userProfile.form.website')} error={errors.website?.message}>
          <input
            {...register('website')}
            className="input w-full"
            placeholder={t('userProfile.form.websitePlaceholder')}
          />
        </FormField>
      </div>

      {/* Bio */}
      <FormField label={t('userProfile.form.bio')} error={errors.bio?.message}>
        <textarea
          {...register('bio')}
          rows={4}
          className="input w-full"
          maxLength={500}
          placeholder={t('userProfile.form.bioPlaceholder')}
        />
      </FormField>

      {/* Boutons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="bg-agenda-purple text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-agenda-purple-dark transition disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('userProfile.form.saving') : t('userProfile.form.save')}
        </button>
        <button
          type="button"
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
          onClick={onCancel}
        >
          {t('userProfile.form.cancel')}
        </button>
      </div>
    </motion.form>
  );
}
