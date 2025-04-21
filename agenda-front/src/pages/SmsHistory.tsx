import MainLayout from "../layouts/MainLayout";
import { MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

// Fausse data inspirée du screenshot
const smsReminders = [
  {
    id: 1,
    sentAt: "21.04.2025 09:00",
    patient: { name: "Alice Martin", phone: "+41 78 123 45 67" },
    appointment: "Consultation nutrition",
    message: "Rappel : Consultation nutrition avec Diet. Santé / agenda.ch le 21.04.2025 à 09:45",
    status: "Envoyé",
  },
  {
    id: 2,
    sentAt: "20.04.2025 17:30",
    patient: { name: "Marc Dupuis", phone: "+41 79 987 65 43" },
    appointment: "Massage thérapeutique",
    message: "Rappel : Massage thérapeutique avec Bien-Être / agenda.ch le 22.04.2025 à 14:00",
    status: "Envoyé",
  },
  {
    id: 3,
    sentAt: "19.04.2025 08:15",
    patient: { name: "Sophie Bernard", phone: "+41 76 555 12 34" },
    appointment: "Séance ostéopathie",
    message: "Rappel : Séance ostéopathie avec Cabinet Ostéo / agenda.ch le 23.04.2025 à 11:00",
    status: "Envoyé",
  },
];

const smsNotifications = [
  {
    id: 1,
    sentAt: "21.04.2025 09:01",
    phone: "+41 78 123 45 67",
    appointment: "Consultation nutrition",
    message: "Nouveau rdv : 21.04.2025 à 09:45 - MARTIN, Alice - Diet. Santé",
    status: "Envoyé",
  },
  {
    id: 2,
    sentAt: "20.04.2025 17:31",
    phone: "+41 79 987 65 43",
    appointment: "Massage thérapeutique",
    message: "Nouveau rdv : 22.04.2025 à 14:00 - DUPUIS, Marc - Bien-Être",
    status: "Envoyé",
  },
  {
    id: 3,
    sentAt: "19.04.2025 08:16",
    phone: "+41 76 555 12 34",
    appointment: "Séance ostéopathie",
    message: "Nouveau rdv : 23.04.2025 à 11:00 - BERNARD, Sophie - Cabinet Ostéo",
    status: "Envoyé",
  },
];

function formatDate(dateStr: string) {
  // Accepte '21.04.2025 09:00' ou '21/04/2025 09:00'
  const [date, time] = dateStr.split(' ');
  const [d, m, y] = date.includes('.') ? date.split('.') : date.split('/');
  return `${d}/${m}/${y}` + (time ? ` ${time}` : '');
}

import { useNavigate } from "react-router-dom";
import { mockClients } from "../features/clients/mockClients";

import { useTranslation } from 'react-i18next';

export default function SmsHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-0 px-0">
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <MessageSquare className="h-6 w-6 text-agenda-purple" />
    {t('smsHistory.title')}
  </h1>
</motion.div>


        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
>
  <h2 className="text-lg font-semibold text-agenda-purple mb-2">{t('smsHistory.reminders')}</h2>
  <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
    <span>{t('smsHistory.remindersCount', { count: 3, start: '19.04.2025', end: '21.04.2025' })}</span>
  </div>
  {/* Table des rappels SMS */}
  <div className="bg-white rounded-xl shadow mb-8 overflow-visible">
    <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 font-semibold text-left">#</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.sent')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.patient')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.appointment')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.message')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.status')}</th>
              </tr>
            </thead>
            <tbody>
              {smsReminders.map((rappel, i) => (
                <tr key={rappel.id} className="border-b hover:bg-agenda-purple/5 h-full">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(rappel.sentAt)}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      {(() => {
  const client = mockClients.find(c => `${c.firstName} ${c.lastName}`.toLowerCase() === rappel.patient.name.toLowerCase());
  return client ? (
    <span
      className="font-medium text-agenda-purple hover:underline cursor-pointer"
      onClick={() => navigate(`/clients/${client.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/clients/${client.id}`); }}
    >
      {rappel.patient.name}
    </span>
  ) : (
    <span className="font-medium text-gray-400 cursor-not-allowed">{rappel.patient.name}</span>
  );
})()}
                      <span className="text-xs text-gray-500">{rappel.patient.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{rappel.appointment}</td>
                  <td className="px-4 py-2 max-w-xs relative group">
  <span className="truncate block">{rappel.message}</span>
  <div className="absolute left-1/2 top-0 -translate-y-full mb-2 w-max max-w-xs transform -translate-x-1/2
    bg-agenda-purple text-white text-xs rounded-xl px-4 py-3 border border-agenda-purple/30 shadow-xl
    opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-200 z-20 whitespace-normal pointer-events-none flex flex-col items-center">
    {rappel.message}
    <div className="w-3 h-3 bg-agenda-purple rotate-45 absolute left-1/2 translate-x-[-50%] top-full -mt-1 border-l border-b border-agenda-purple/30"></div>
  </div>
</td>
                  <td className="px-4 py-2 text-green-600 h-full align-middle">
                    <div className="flex items-center justify-center gap-1 h-full">
                      <CheckCircle className="h-4 w-4" /> {rappel.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-agenda-purple mb-2">{t('smsHistory.notifications')}</h2>
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span>{t('smsHistory.notificationsCount', { count: 3, start: '19.04.2025', end: '21.04.2025' })}</span>
        </div>
        {/* Table des notifications SMS */}
        <div className="bg-white rounded-xl shadow overflow-visible">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 font-semibold text-left">#</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.sent')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.phone')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.appointment')}</th>
                <th className="px-4 py-2 font-semibold text-left">{t('smsHistory.message')}</th>
                <th className="px-4 py-2 font-semibold text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {smsNotifications.map((notif, i) => (
                <tr key={notif.id} className="border-b hover:bg-agenda-purple/5 h-full">
                  <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(notif.sentAt)}</td>
                  <td className="px-4 py-2">{notif.phone}</td>
                  <td className="px-4 py-2">{notif.appointment}</td>
                  <td className="px-4 py-2 max-w-xs relative group">
  <span className="truncate block">{notif.message}</span>
  <div className="absolute left-1/2 top-0 -translate-y-full mb-2 w-max max-w-xs transform -translate-x-1/2
    bg-agenda-purple text-white text-xs rounded-xl px-4 py-3 border border-agenda-purple/30 shadow-xl
    opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-200 z-20 whitespace-normal pointer-events-none flex flex-col items-center">
    {notif.message}
    <div className="w-3 h-3 bg-agenda-purple rotate-45 absolute left-1/2 translate-x-[-50%] top-full -mt-1 border-l border-b border-agenda-purple/30"></div>
  </div>
</td>
                  <td className="px-4 py-2 text-green-600 flex items-center justify-center gap-1 text-center w-24 h-full"><CheckCircle className="h-4 w-4" /> {notif.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      </div>
    </MainLayout>
  );
}
