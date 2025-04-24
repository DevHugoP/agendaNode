import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileSchema } from '../validation/profileSchemas';
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useTranslation } from "react-i18next";
import type { UserProfile } from "../types/profile";

interface EditProfileFormProps {
  initialValues: UserProfile;
  onCancel: () => void;
  onSave: (values: UserProfile) => void;
}

export function EditProfileForm({ initialValues, onCancel, onSave }: EditProfileFormProps) {
  const { t } = useTranslation();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const schema = createProfileSchema(t);

  const { register, handleSubmit, formState: { errors } } = useForm<UserProfile>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  function onSubmit(values: UserProfile) {
    updateProfile(values);
    onSave(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fullName")} placeholder={t('userProfile.form.fullName')} />
      {errors.fullName && <span>{errors.fullName.message}</span>}
      <input {...register("profession")} placeholder={t('userProfile.form.profession')} />
      {errors.profession && <span>{errors.profession.message}</span>}
      <input {...register("email")} placeholder={t('userProfile.form.email')} disabled />
      <input {...register("phone")} placeholder={t('userProfile.form.phone')} />
      {errors.phone && <span>{errors.phone.message}</span>}
      <input {...register("company")} placeholder={t('userProfile.form.company')} />
      {errors.company && <span>{errors.company.message}</span>}
      <input {...register("address")} placeholder={t('userProfile.form.address')} />
      {errors.address && <span>{errors.address.message}</span>}
      <input {...register("website")} placeholder={t('userProfile.form.website')} />
      {errors.website && <span>{errors.website.message}</span>}
      <input {...register("avatar")} placeholder={t('userProfile.form.avatar')} />
      {errors.avatar && <span>{errors.avatar.message}</span>}
      <textarea {...register("bio")} placeholder={t('userProfile.form.bio')} />
      {errors.bio && <span>{errors.bio.message}</span>}
      <button type="submit" disabled={isPending}>{t('common.save')}</button>
      {error && <div>{t('common.saveError')}</div>}
      <button type="button" onClick={onCancel}>{t('userProfile.form.cancel')}</button>
    </form>
  );
}
