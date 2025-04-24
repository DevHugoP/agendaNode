import { useState } from "react";
import { Pencil, Mail, Phone, MapPin, Building2, CalendarDays, CreditCard, ShieldCheck, Link2, UserRound } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import EditProfileForm from '../features/user/EditProfileForm';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Plus de mockUser ni d'état local inutile


const UserProfile = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [editing, setEditing] = useState(false);

  // Debug pour vérifier le fetch
  // (debug log supprimé)

  if (isLoading) return <div>Chargement…</div>;
  if (error) return <div>Erreur lors du chargement du profil</div>;

  // Déstructure tous les champs utiles depuis data (profil plat)
  const {
    avatar,
    fullName,
    profession,
    company,
    address,
    website,
    email,
    phone,
    bio,
    stripeConnected,
    googleCalendarSync,
    stats
  } = data || {};

  // Détecte si le profil est vide (aucun champ saisi ou data absent)
  const isProfileReallyEmpty =
    !data ||
    [
      data.fullName,
      data.profession,
      data.company,
      data.address,
      data.website,
      data.email,
      data.phone,
      data.bio,
      data.avatar
    ].every((v) => !v || v.trim?.() === '');

  // Affichage placeholder si profil vide et pas en mode édition
  if (!editing && isProfileReallyEmpty) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-16 flex flex-col items-center gap-6">
          <img
            src="/avatar-placeholder.png"
            alt="Avatar placeholder"
            className="w-28 h-28 rounded-full border-4 border-agenda-purple shadow"
          />
          <h2 className="text-2xl font-bold text-gray-800">{t('userProfile.empty.title', 'Profil incomplet')}</h2>
          <p className="text-gray-600 text-center">{t('userProfile.empty.desc', 'Complétez votre profil pour profiter pleinement du service.')}</p>
          <button
            className="mt-4 px-5 py-2 rounded-lg bg-agenda-purple text-white font-medium shadow hover:bg-agenda-purple-dark transition"
            onClick={() => setEditing(true)}
          >
            {t('userProfile.empty.cta', 'Compléter mon profil')}
          </button>
        </div>
      </MainLayout>
    );
  }


  // Handler d'enregistrement du profil
  async function handleSave(values: import('../types/profile').ProfileFormValues) {
    await updateProfile(values);
    toast.success(t('userProfile.success'));
    setEditing(false);
  }

  return (
    <MainLayout>
      <div className={`max-w-7xl mx-auto px-4${editing ? '' : ' py-8'}`}>

        {/* En-tête profil */}
        <div className={`flex items-center justify-between gap-6${editing ? '' : ' mb-8'}`}>
          {!editing && (
          <div className="flex items-center gap-6">
            <img
              src={avatar}
              alt="Avatar utilisateur"
              className="w-24 h-24 rounded-full object-cover border-4 border-agenda-purple shadow"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{fullName || t('userProfile.form.fullNamePlaceholder')}</h1>
              <p className="text-agenda-purple font-medium mt-1">{profession || t('userProfile.form.professionPlaceholder')}</p>
            </div>
          </div>
          )}
          <div className="flex items-center gap-4">
            {!editing && (
              <button
                className="inline-flex items-center px-4 py-2 rounded-lg bg-agenda-purple text-white hover:bg-agenda-purple-dark transition font-medium shadow"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t('userProfile.edit')}
              </button>
            )}

          </div>
        </div>
        {editing && (
          <EditProfileForm
            initialValues={{
              avatar,
              fullName,
              profession,
              company,
              address,
              website,
              email,
              phone,
              bio
            }}
            onCancel={() => setEditing(false)}
            onSave={handleSave}
          />
        )} 

        {/* Statistiques cards */}
        {!editing && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <CalendarDays className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.totalAppointments}</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.appointments')}</div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <UserRound className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.clients}</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.clients')}</div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <CreditCard className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.revenue.toLocaleString()} €</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.revenue')}</div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <CalendarDays className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{stats.upcoming}</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.upcoming')}</div>
            </div>
          </div>
        </div>
        )}

        {/* Détails utilisateur (grid) */}
        {!editing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5" />
              <span>{email || t('userProfile.form.emailPlaceholder')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="h-5 w-5" />
              <span>{phone || t('userProfile.form.phonePlaceholder')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Building2 className="h-5 w-5" />
              <span>{company || t('userProfile.form.companyPlaceholder')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5" />
              <span>{address || t('userProfile.form.addressPlaceholder')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Link2 className="h-5 w-5" />
              <a href={website || undefined} target="_blank" rel="noopener noreferrer" className="underline hover:text-agenda-purple">
  {website ? website.replace('https://', '') : t('userProfile.form.websitePlaceholder')}
</a>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <ShieldCheck className={stripeConnected ? 'text-green-500' : 'text-gray-400'} />
              <span>{stripeConnected ? t('userProfile.stripe.connected') : t('userProfile.stripe.notConnected')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CalendarDays className={googleCalendarSync ? 'text-green-500' : 'text-gray-400'} />
              <span>{googleCalendarSync ? t('userProfile.googleCalendar.synced') : t('userProfile.googleCalendar.notSynced')}</span>
            </div>
          </div>
        </div>
        )}

        {/* Bio */}
        {!editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{t('userProfile.about')}</h3>
          <p className="text-gray-700">{bio || t('userProfile.form.bioPlaceholder')}</p>
        </div>
        )}


      </div>
    </MainLayout>
  );
};

export default UserProfile;
