import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Nom requis'),
  profession: z.string().min(2, 'Profession requise'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(6, 'Téléphone requis'),
  company: z.string().min(2, 'Société requise'),
  address: z.string().min(2, 'Adresse requise'),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  bio: z.string().max(500, 'Max 500 caractères').optional(),
  avatar: z.string().url('URL avatar invalide').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  initialValues: ProfileFormValues;
  onCancel: () => void;
  onSave: (values: ProfileFormValues) => Promise<void>;
}

export default function EditProfileForm({ initialValues, onCancel, onSave }: EditProfileFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  // Compare les valeurs du formulaire avec les initialValues
  function isFormChanged(values: ProfileFormValues) {
    return Object.keys(initialValues).some(
      (key) => (values as any)[key] !== (initialValues as any)[key]
    );
  }

  async function handleSubmitWithCheck(values: ProfileFormValues) {
    if (!isFormChanged(values)) {
      // Pas de changement, on ne fait rien
      return;
    }
    await onSave(values);
  }

  return (
    <motion.form
      id="edit-profile-form"
      onSubmit={handleSubmit(handleSubmitWithCheck)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-10 items-start">
        {/* Avatar à gauche */}
        <div className="flex flex-col items-center gap-4 min-w-[140px]">
          <img
            src={initialValues.avatar || '/avatar-placeholder.png'}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-agenda-purple shadow"
          />
          <input
            {...register('avatar')}
            type="url"
            placeholder="URL de l’avatar"
            className="input w-52 mt-2"
          />
          {errors.avatar && <span className="text-red-500 text-xs">{errors.avatar.message}</span>}
        </div>
        {/* Infos principales */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input {...register('fullName')} className="input w-full" />
            {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profession</label>
            <input {...register('profession')} className="input w-full" />
            {errors.profession && <span className="text-red-500 text-xs">{errors.profession.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...register('email')} className="input w-full" />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input {...register('phone')} className="input w-full" />
            {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <label className="block text-sm font-medium mb-1">Société</label>
          <input {...register('company')} className="input w-full" />
          {errors.company && <span className="text-red-500 text-xs">{errors.company.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input {...register('address')} className="input w-full" />
          {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Site web</label>
          <input {...register('website')} className="input w-full" />
          {errors.website && <span className="text-red-500 text-xs">{errors.website.message}</span>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea {...register('bio')} rows={4} className="input w-full" maxLength={500} />
        {errors.bio && <span className="text-red-500 text-xs">{errors.bio.message}</span>}
      </div>
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="bg-agenda-purple text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-agenda-purple-dark transition disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </motion.form>
  );
}
