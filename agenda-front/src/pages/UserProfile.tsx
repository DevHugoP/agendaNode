import { useState } from "react";
import { Pencil, Mail, Phone, MapPin, Building2, CalendarDays, CreditCard, ShieldCheck, LogOut, Link2, UserRound } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import EditProfileForm from '../features/user/EditProfileForm';
import type { UserProfileData, ProfileFormValues } from '../types/profile';
import { toast } from 'sonner';

// Exemple d'utilisateur (à remplacer par l'utilisateur connecté)

const mockUser: UserProfileData = {
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  fullName: "Jean Dupont",
  profession: "Ostéopathe D.O.",
  email: "jean.dupont@cabinet-demo.fr",
  phone: "+33 6 12 34 56 78",
  company: "Cabinet Dupont Santé",
  address: "12 rue des Lilas, 75012 Paris",
  website: "https://cabinet-dupont.fr",
  bio: "Passionné par la santé et le bien-être, j'accompagne mes patients depuis plus de 10 ans. Spécialisé en ostéopathie et thérapies douces.",
  stats: {
    totalAppointments: 1242,
    upcoming: 7,
    clients: 356,
    revenue: 48230,
  },
  stripeConnected: true,
  googleCalendarSync: true,
};



import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>(mockUser);

  const handleSave = async (values: ProfileFormValues) => {
    // Liste des champs éditables du formulaire
    const editableKeys = [
      'avatar', 'fullName', 'profession', 'email', 'phone', 'company', 'address', 'website', 'bio'
    ];
    const hasChanged = editableKeys.some(
      (key) => values[key as keyof ProfileFormValues] !== profile[key as keyof ProfileFormValues]
    );
    setEditing(false); // Toujours revenir à la vue profil
    if (!hasChanged) return; // Pas de toast ni update
    setProfile((prev) => ({
      ...prev,
      ...Object.fromEntries(editableKeys.map((key) => [key, values[key as keyof ProfileFormValues]])),
    }));
    toast.success(t('userProfile.success'));
  };

  return (
    <MainLayout>
      <div className={`max-w-7xl mx-auto px-4${editing ? '' : ' py-8'}`}>

        {/* En-tête profil */}
        <div className={`flex items-center justify-between gap-6${editing ? '' : ' mb-8'}`}>
          {!editing && (
          <div className="flex items-center gap-6">
            <img
              src={profile.avatar}
              alt="Avatar utilisateur"
              className="w-24 h-24 rounded-full object-cover border-4 border-agenda-purple shadow"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
              <p className="text-agenda-purple font-medium mt-1">{profile.profession}</p>
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
        {editing ? (
          <EditProfileForm
            initialValues={profile}
            onCancel={() => setEditing(false)}
            onSave={handleSave}
          />
        ) : null}

        {/* Statistiques cards */}
        {!editing && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <CalendarDays className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{profile.stats.totalAppointments}</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.appointments')}</div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <UserRound className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{profile.stats.clients}</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.clients')}</div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <CreditCard className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{profile.stats.revenue.toLocaleString()} €</div>
              <div className="text-sm text-gray-500">{t('userProfile.stats.revenue')}</div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <CalendarDays className="h-6 w-6 text-agenda-purple" />
            <div>
              <div className="text-lg font-bold text-gray-900">{profile.stats.upcoming}</div>
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
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="h-5 w-5" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Building2 className="h-5 w-5" />
              <span>{profile.company}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5" />
              <span>{profile.address}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Link2 className="h-5 w-5" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-agenda-purple">
                {profile.website?.replace('https://', '')}
              </a>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <ShieldCheck className={profile.stripeConnected ? 'text-green-500' : 'text-gray-400'} />
              <span>{profile.stripeConnected ? t('userProfile.stripe.connected') : t('userProfile.stripe.notConnected')}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CalendarDays className={profile.googleCalendarSync ? 'text-green-500' : 'text-gray-400'} />
              <span>{profile.googleCalendarSync ? t('userProfile.googleCalendar.synced') : t('userProfile.googleCalendar.notSynced')}</span>
            </div>
          </div>
        </div>
        )}

        {/* Bio */}
        {!editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{t('userProfile.about')}</h3>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
        )}


      </div>
    </MainLayout>
  );
};

export default UserProfile;
