import { useEffect, useState } from 'react';
import { useAuth } from '../store/auth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home } from "lucide-react";
import { Calendar, Users, Clock, CreditCard } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

interface AppointmentType {
  id: number;
  title: string;
  date: string;
  time: string;
  client: string;
}

import { ReactElement } from "react";

const Dashboard = (): ReactElement => {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentType[]>([]);

  const { accessToken, isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading || !accessToken) return;
    // Définir le message de salutation en fonction de l'heure
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return t('dashboard.greeting.morning');
      if (hour < 18) return t('dashboard.greeting.afternoon');
      return t('dashboard.greeting.evening');
    };
    
    setGreeting(getGreeting());
    
    // Simuler le chargement des rendez-vous
    setTimeout(() => {
      setUpcomingAppointments([
        {
          id: 1,
          title: 'Consultation',
          date: '2025-04-20',
          time: '09:00',
          client: 'Jean Dupont'
        },
        {
          id: 2,
          title: 'Massage thérapeutique',
          date: '2025-04-20',
          time: '11:30',
          client: 'Marie Martin'
        },
        {
          id: 3,
          title: 'Séance de coaching',
          date: '2025-04-21',
          time: '14:00',
          client: 'Sophie Dubois'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Home className="h-6 w-6 text-agenda-purple" />
            {t('dashboard.title')}
          </div>
          <p className="mt-1 text-gray-600">{greeting}, Dr. Dupont</p> {/* TODO: remplacer Dr. Dupont par le nom du pro connecté */}
        </motion.div>

        {/* Résumé statistiques */}
        <motion.div 
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-agenda-purple" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('dashboard.todayAppointments')}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">6</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-agenda-purple" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('dashboard.newClients')}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">2</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-agenda-purple" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('dashboard.hoursWorked')}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">5.5 h</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-agenda-purple" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('dashboard.todayRevenue')}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">450 CHF</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Prochains rendez-vous */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-lg font-medium text-gray-900">{t('dashboard.upcomingAppointments')}</h2>
          
          {isLoading ? (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-agenda-purple"></div>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{t('dashboard.col.appointment')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('dashboard.col.client')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('dashboard.col.date')}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('dashboard.col.time')}</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">{t('dashboard.col.actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {upcomingAppointments.map((appointment) => (
                    <motion.tr 
                      key={appointment.id}
                      whileHover={{ backgroundColor: 'rgba(94, 53, 177, 0.03)' }}
                      className="transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{appointment.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.client}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(appointment.date)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.time}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-agenda-purple hover:text-agenda-light-purple">{t('dashboard.details')}</a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;