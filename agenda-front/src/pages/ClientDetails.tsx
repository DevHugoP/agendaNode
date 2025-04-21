import { useParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { mockClients, mockDocuments, mockInvoices, mockPastConsults, mockUpcomingConsults } from "../features/clients/mockClients";
import MainLayout from '../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, CalendarDays, X, FilePlus, FileText, Download, Eye, CheckCircle, Clock } from 'lucide-react';

import { useState } from 'react';

function formatDateFr(dateStr: string) {
  if (!dateStr) return '';
  // Gère "2024-01-15" ou "2024-01-15T13:00:00"
  const [y, m, d] = dateStr.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

function handleUploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files && e.target.files[0];
  if (file) {
    // TODO: Envoyer le fichier au backend ou l'ajouter à la liste
    alert(`Fichier sélectionné : ${file.name}`);
  }
}

function handleDownloadPdf(doc: any) {
  // Pour mock, on utilise doc.url
  window.open(doc.url, '_blank');
}

export default function ClientDetails() {
  const { t } = useTranslation();
  // Gestion de la modal PDF
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const handleOpenModal = (doc: any) => {
    setSelectedDoc(doc);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoc(null);
  };

  const { id } = useParams();
  const client = mockClients.find((c) => c.id === id);
  const documents = mockDocuments[id] || [];
  const invoices = mockInvoices[id] || [];
  const pastConsults = mockPastConsults[id] || [];
  const upcomingConsults = mockUpcomingConsults[id] || [];

  if (!client) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-12 px-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-red-500 font-semibold">{t('clientDetails.notFound')}</p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-10 px-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/clients" className="text-agenda-purple hover:underline text-sm mb-2 inline-block">← {t('clientDetails.backToList')}</Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 mt-1">{client.firstName} {client.lastName}</h1>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex-1"
          >
            <div className="bg-white rounded-xl shadow p-6 h-full">
              <h2 className="text-md font-semibold text-agenda-purple mb-4">{t('clientDetails.personalInfo')}</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-5 w-5 text-agenda-purple" />
                  <span>{client.email || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-agenda-purple" />
                  <span>{client.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-agenda-purple" />
                  <span>{client.address || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CalendarDays className="h-5 w-5 text-agenda-purple" />
                  <span>{client.birthDate ? formatDateFr(client.birthDate) : "—"}</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex-1"
          >
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-md font-semibold text-agenda-purple">{t('clientDetails.documents')}</h2>
                <label htmlFor="upload-pdf" className="flex items-center gap-1 p-1 rounded-full text-agenda-purple hover:bg-agenda-purple/10 cursor-pointer text-sm font-medium transition h-8">
                  <span className="hidden sm:inline">{t('clientDetails.addPdf')}</span>
                  <FilePlus className="w-4 h-4" />
                  <input
                    id="upload-pdf"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUploadPdf}
                  />
                </label>
              </div>
              <ul className="divide-y divide-gray-100">
                {documents.length === 0 && (
                  <li className="text-gray-400 italic py-6 text-center">{t('clientDetails.noDocument')}</li>
                )}
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 py-2 group hover:bg-agenda-purple/5 transition rounded"
                  >
                    <FileText className="w-5 h-5 text-agenda-purple flex-shrink-0" />
                    <button
                      className="text-sm font-medium text-gray-900 truncate max-w-xs text-left hover:underline focus:outline-none"
                      title={doc.name}
                      onClick={() => handleOpenModal(doc)}
                    >
                      {doc.name}
                    </button>
                    <div className="ml-auto flex gap-1">
                      <button
                        className="p-1 rounded-full hover:bg-agenda-purple/10 text-agenda-purple transition"
                        onClick={() => handleOpenModal(doc)}
                        title="Aperçu"
                        aria-label="Aperçu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-agenda-purple/10 text-agenda-purple transition"
                        onClick={() => handleDownloadPdf(doc)}
                        title="Télécharger"
                        aria-label="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h2 className="text-lg font-bold text-agenda-purple mb-3">{t('clientDetails.invoices')}</h2>
          <div className="bg-white rounded-xl shadow overflow-visible mb-8">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.date')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.amount')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.status')}</th>
                  <th className="px-2 py-2 font-semibold text-right whitespace-nowrap">{t('clientDetails.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 && (
                  <tr><td colSpan={3}><span className="text-gray-400 italic">{t('clientDetails.noInvoice')}</span></td></tr>
                )}
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-agenda-purple/5 h-full">
                    <td className="px-4 py-2 whitespace-nowrap">{formatDateFr(inv.date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{inv.amount.toFixed(2)} €</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={inv.paid
                        ? "inline-flex items-center gap-1 bg-green-500 text-white rounded-full px-2.5 py-1 text-xs font-bold min-w-[80px] justify-center"
                        : "inline-flex items-center gap-1 bg-orange-400 text-white rounded-full px-2.5 py-1 text-xs font-bold min-w-[80px] justify-center"}
                        style={{ letterSpacing: 0.2 }}>
                        {inv.paid ? (
                          <CheckCircle className="w-4 h-4 mr-0.5 -ml-0.5" />
                        ) : (
                          <Clock className="w-4 h-4 mr-0.5 -ml-0.5" />
                        )}
                        <span>{inv.paid ? t('clientDetails.paid') : t('clientDetails.pending')}</span>
                      </span>
                    </td>
                    <td className="px-1 py-2 text-right align-middle">
                      <div className="flex justify-end items-center gap-0.5">
                        <button
                          className="p-1 rounded-full hover:bg-agenda-purple/10 text-agenda-purple transition"
                          title={t('clientDetails.preview')}
                          aria-label={t('clientDetails.preview')}
                          onClick={() => handleOpenModal(inv)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-agenda-purple/10 text-agenda-purple transition"
                          title={t('clientDetails.download')}
                          aria-label={t('clientDetails.download')}
                          onClick={() => handleDownloadPdf(inv)}
                        >
                          <Download className="w-4 h-4" />
                        </button>
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
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <h2 className="text-lg font-bold text-agenda-purple mb-3">{t('clientDetails.pastConsultations')}</h2>
          <div className="bg-white rounded-xl shadow overflow-visible mb-8">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.date')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.duration')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.practitioner')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.notes')}</th>
                </tr>
              </thead>
              <tbody>
                {pastConsults.length === 0 && (
  <tr>
    <td colSpan={4} className="py-8 text-center bg-gray-50 rounded-b-xl" style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 6.75v.008m0 10.492a8.25 8.25 0 110-16.5 8.25 8.25 0 010 16.5z" />
        </svg>
        <span className="italic">{t('clientDetails.noPastConsult')}</span>
      </div>
    </td>
  </tr>
)}
                {pastConsults.map((cons) => (
                  <tr key={cons.id} className="border-b hover:bg-agenda-purple/5 h-full">
                    <td className="px-4 py-2 whitespace-nowrap">{formatDateFr(cons.date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{cons.duration} min</td>
                    <td className="px-4 py-2 whitespace-nowrap">{cons.practitioner}</td>
                    <td className="px-4 py-2 max-w-xs">
  <span className="truncate block">{cons.notes || t('clientDetails.none')}</span>
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
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <h2 className="text-lg font-bold text-agenda-purple mb-3">{t('clientDetails.upcomingConsultations')}</h2>
          <div className="bg-white rounded-xl shadow overflow-visible">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.date')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.time')}</th>
                  <th className="px-4 py-2 font-semibold text-left">{t('clientDetails.location')}</th>
                </tr>
              </thead>
              <tbody>
                {upcomingConsults.length === 0 && (
  <tr>
    <td colSpan={3} className="py-8 text-center bg-gray-50 rounded-b-xl" style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 6.75v.008m0 10.492a8.25 8.25 0 110-16.5 8.25 8.25 0 010 16.5z" />
        </svg>
        <span className="italic">{t('clientDetails.noUpcomingConsult')}</span>
      </div>
    </td>
  </tr>
)}
                {upcomingConsults.map((cons) => (
                  <tr key={cons.id} className="border-b hover:bg-agenda-purple/5 h-full">
                    <td className="px-4 py-2 whitespace-nowrap">{formatDateFr(cons.date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{cons.time}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{cons.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      {/* Modal PDF */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-0 relative overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-agenda-purple">{t('clientDetails.documentPreview')}</h3>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-agenda-purple"
                  onClick={handleCloseModal}
                  aria-label={t('clientDetails.closeModal')}
                  type="button"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {/* Fausse preview PDF (iframe) */}
              <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
                <iframe
                  title={selectedDoc?.name || t('clientDetails.pdfPreview')}
                  src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  className="w-full h-full border-0 rounded-b-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

