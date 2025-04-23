import { useNavigate } from "react-router-dom";
import { mockClients } from "../features/clients/mockClients";
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Users, Eye } from "lucide-react";

import { useTranslation } from 'react-i18next';

import { ReactElement } from "react";
import { Client } from "../types/Client";

export default function ClientsList(): ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Users className="h-6 w-6 text-agenda-purple" />
            {t('clientsList.title')}
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className=""
        >
          <div className="bg-white rounded-xl shadow overflow-visible">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
  <th className="px-4 py-3 font-semibold text-left w-10"></th>
  <th className="px-4 py-3 font-semibold text-left">{t('clientsList.lastName')}</th>
  <th className="px-4 py-3 font-semibold text-left">{t('clientsList.firstName')}</th>
  <th className="px-4 py-3 font-semibold text-left">{t('clientsList.email')}</th>
  <th className="px-4 py-3 font-semibold text-left">{t('clientsList.phone')}</th>
  <th className="px-4 py-3 font-semibold text-left"></th>
</tr>
              </thead>
              <tbody className="gap-y-1">
                {mockClients.map((client) => (
  <tr
    key={client.id}
    className="border-b hover:bg-agenda-purple/5 h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-agenda-purple active:bg-agenda-purple/10"
    tabIndex={0}
    onClick={() => navigate(`/clients/${client.id}`)}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        navigate(`/clients/${client.id}`);
      }
    }}
  >
    <td className="px-4 py-3">
      <button
        className="rounded-full p-2 border border-agenda-purple text-agenda-purple hover:bg-agenda-purple hover:text-white transition focus:outline-none focus:ring-2 focus:ring-agenda-purple"
        aria-label={t('clientsList.seeDetails')}
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          navigate(`/clients/${client.id}`);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            navigate(`/clients/${client.id}`);
          }
        }}
        type="button"
      >
        <Eye className="w-4 h-4" />
      </button>
    </td>
    <td className="px-4 py-3">{client.lastName}</td>
    <td className="px-4 py-3">{client.firstName}</td>
    <td className="px-4 py-3">{client.email}</td>
    <td className="px-4 py-3">{client.phone}</td>
    <td className="px-4 py-3 text-right"></td>
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
