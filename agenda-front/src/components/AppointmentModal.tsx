import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Clock, User, FileText, Tag, Check, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { fr, enGB, de } from 'date-fns/locale';
import { useAppointmentForm } from '../hooks/useAppointmentForm';
import type { AppointmentFormData } from '../types/appointment';

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => void;
  onDelete?: () => void;
  startDate?: Date;
  endDate?: Date;
  editMode?: boolean;
  initialData?: Partial<AppointmentFormData>;
}


// Configuration des types de rendez-vous
const appointmentTypes = [
  { id: 'consultation', color: '#4285F4' },
  { id: 'massage', color: '#0F9D58' },
  { id: 'coaching', color: '#DB4437' },
  { id: 'therapie', color: '#F4B400' },
  { id: 'formation', color: '#7986CB' }
];

function formatLocalDateTimeInput(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('-') +
    'T' +
    [
      pad(date.getHours()),
      pad(date.getMinutes())
    ].join(':');
}

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  startDate,
  endDate,
  editMode = false,
  initialData 
}: AppointmentModalProps) => {
  // Toujours appeler les hooks en haut du composant, jamais dans une condition !
  const { t, i18n } = useTranslation();
  const {
    formData,
    handleChange,
    handleDateChange,
    handleTypeChange,
    error,
    setError,
    fieldErrors,
    setFieldErrors
  } = useAppointmentForm({ startDate, endDate, editMode, initialData });

  // Réinitialiser les erreurs à chaque ouverture de la modal
  useEffect(() => {
    if (isOpen) {
      setError('');
      setFieldErrors({});
    }
  }, [isOpen, setError, setFieldErrors]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Obtenir la durée du rendez-vous en minutes
  // Affiche la durée au format "1h 30min" ou "45min"
  const getDurationFormatted = () => {
    const durationMs = formData.end.getTime() - formData.start.getTime();
    const totalMinutes = Math.round(durationMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}min`;
  };

  // Formater la date pour l'affichage
  const formatDate = (date: Date) => {
    const locale =
      i18n.language === 'en'
        ? enGB
        : i18n.language === 'de'
        ? de
        : fr;
    return format(date, "EEEE d MMMM yyyy", { locale });
  };


  // Animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-2 max-h-[90vh] flex flex-col animate-fadeInUp p-0 overflow-x-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b bg-white/90 backdrop-blur-md">
              <h2 className="text-xl font-bold text-agenda-purple tracking-tight">
                {editMode ? t('appointmentModal.editTitle') : t('appointmentModal.newTitle')}
              </h2>
              <button
                onClick={onClose}
                aria-label="Fermer la modal"
                className="p-2 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-agenda-purple"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {error && Object.keys(fieldErrors).length === 0 && (
              <div className="px-6 pt-2 pb-1 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Date affichée (header secondaire) */}
            <div className="flex items-center px-6 pt-2 pb-1">

              <p className="text-sm text-gray-700 font-medium">
                {formatDate(formData.start)}
              </p>
            </div>

            {/* Formulaire */}
            <div className="p-6 pt-3 flex-1 overflow-y-auto overflow-x-hidden">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Prestation */}
                <div>
                  <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                    <Tag size={18} className="mr-2 text-agenda-purple" />
                    {t('appointmentModal.serviceLabel')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {appointmentTypes.map((type) => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => handleTypeChange(type.id)}
                        className={`flex items-center px-3 py-1.5 rounded-xl border-2 transition-all text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-agenda-purple/60 focus:border-agenda-purple/60 
      ${formData.appointmentType === type.id
        ? 'border-agenda-purple bg-agenda-purple/10 text-agenda-purple'
        : 'border-gray-200 bg-white text-gray-700 hover:border-agenda-purple/50'}
    `}
                        aria-pressed={formData.appointmentType === type.id}
                      >
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></span>
                        {t(`appointmentModal.types.${type.id}`)}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.appointmentType && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.appointmentType}</p>
                  )}
                </div>

                {/* Titre */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">

                    {t('appointmentModal.titleLabel')}
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={t('appointmentModal.titlePlaceholder')}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agenda-purple focus:border-agenda-purple shadow-sm transition-all hover:border-gray-300"
                    required
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
                  )}
                </div>

                {/* Client */}
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
  <User size={18} className="mr-2 text-agenda-purple" />
  {t('appointmentModal.clientLabel')}
</label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder={t('appointmentModal.clientPlaceholder')}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agenda-purple focus:border-agenda-purple shadow-sm transition-all hover:border-gray-300"
                    required
                  />
                  {fieldErrors.clientName && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.clientName}</p>
                  )}
                </div>

                {/* Dates & heures */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
  <Clock size={18} className="mr-2 text-agenda-purple" />
  {t('appointmentModal.startLabel')}
</label>
                    <input
                      id="start"
                      name="start"
                      type="datetime-local"
                      value={formData.start ? formatLocalDateTimeInput(new Date(formData.start)) : ''}
                      onChange={(e) => handleDateChange(e, 'start')}
                      className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agenda-purple focus:border-agenda-purple shadow-sm transition-all"
                      required
                    />
                    {fieldErrors.start && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.start}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
  <Clock size={18} className="mr-2 text-agenda-purple" />
  {t('appointmentModal.endLabel')}
</label>
                    <input
                      id="end"
                      name="end"
                      type="datetime-local"
                      value={formData.end ? formatLocalDateTimeInput(new Date(formData.end)) : ''}
                      onChange={(e) => handleDateChange(e, 'end')}
                      className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agenda-purple focus:border-agenda-purple shadow-sm transition-all"
                      required
                    />
                    {fieldErrors.end && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.end}</p>
                    )}
                  </div>
                </div>

                {/* Durée (calculée automatiquement) */}
                <div className="flex justify-center mt-2">
                  <span className="inline-flex items-center px-4 py-2 bg-agenda-purple/10 text-agenda-purple font-medium rounded-full">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    {t('appointmentModal.durationLabel', { duration: getDurationFormatted() })}
                  </span>
                </div>

                {/* Statut */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
  <Check size={18} className="mr-2 text-agenda-purple" />
  {t('appointmentModal.statusLabel')}
</label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full appearance-none px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agenda-purple focus:border-agenda-purple shadow-sm transition-all hover:border-gray-300 pr-10"
                    >
                      <option value="confirmed">{t('appointmentModal.statusConfirmed')}</option>
<option value="pending">{t('appointmentModal.statusPending')}</option>
<option value="cancelled">{t('appointmentModal.statusCancelled')}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    {fieldErrors.status && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.status}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
  <FileText size={18} className="mr-2 text-agenda-purple" />
  {t('appointmentModal.notesLabel')}
</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    placeholder={t('appointmentModal.notesPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agenda-purple focus:border-agenda-purple shadow-sm transition-all hover:border-gray-300"
                  />
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                  {editMode && onDelete && (
                    <button
  type="button"
  onClick={onDelete}
  className="px-5 py-2.5 border border-red-200 text-red-600 bg-white rounded-xl hover:bg-red-50 transition-colors shadow-sm font-medium"
>
  {t('appointmentModal.deleteButton')}
</button>
                  )}
                  <button
  type="button"
  onClick={onClose}
  className="px-5 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium"
>
  {t('appointmentModal.cancelButton')}
</button>
                  <button
  type="submit"
  className="px-5 py-2.5 bg-gradient-to-r from-agenda-purple to-agenda-light-purple text-white rounded-xl hover:opacity-90 transition-all shadow-md font-medium flex items-center"
>
  <Check className="mr-2 h-4 w-4" />
  {editMode ? t('appointmentModal.updateButton') : t('appointmentModal.createButton')}
</button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;