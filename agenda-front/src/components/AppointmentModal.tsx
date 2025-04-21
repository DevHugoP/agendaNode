import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, Tag, Check, CalendarClock, CalendarDays, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { enGB } from 'date-fns/locale';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: AppointmentFormData) => void;
  onDelete?: () => void;
  startDate?: Date;
  endDate?: Date;
  editMode?: boolean;
  initialData?: Partial<AppointmentFormData>;
}

export interface AppointmentFormData {
  id?: string;
  title: string;
  clientName: string;
  start: Date;
  end: Date;
  appointmentType: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
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
  const { t, i18n } = useTranslation();
  // État du formulaire
  const [formData, setFormData] = useState<AppointmentFormData>({
    id: initialData?.id,
    title: '',
    clientName: '',
    start: startDate || new Date(),
    end: endDate || new Date(Date.now() + 30 * 60 * 1000), // +30 min par défaut
    appointmentType: 'consultation',
    notes: '',
    status: 'confirmed'
  });

  // Mettre à jour les dates de début et de fin lorsqu'elles changent
  useEffect(() => {
    if (startDate) {
      setFormData(prev => ({ 
        ...prev, 
        start: startDate,
        // Si la date de fin n'est pas définie, on ajoute 30 minutes par défaut
        end: endDate || new Date(startDate.getTime() + 30 * 60 * 1000)
      }));
    }
  }, [startDate, endDate]);

  // Charger les données initiales (en mode édition)
  useEffect(() => {
    if (editMode && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        id: initialData.id || prev.id,
      }));
    }
  }, [editMode, initialData]);

  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer les changements de date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const [date, time] = e.target.value.split('T');
    
    if (field === 'start') {
      const newStart = new Date(date + 'T' + time);
      setFormData(prev => ({ 
        ...prev, 
        start: newStart,
        // Ajuster la fin si nécessaire pour garantir que end > start
        end: prev.end <= newStart ? new Date(newStart.getTime() + 30 * 60 * 1000) : prev.end
      }));
    } else {
      const newEnd = new Date(date + 'T' + time);
      setFormData(prev => ({ 
        ...prev, 
        end: newEnd 
      }));
    }
  };

  // Gérer le choix du Prestation (avec un sélecteur de couleur)
  const handleTypeChange = (typeId: string) => {
    setFormData(prev => ({ ...prev, appointmentType: typeId }));
  };

  // Gérer la soumission du formulaire
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
    const locale = i18n.language === 'en' ? enGB : fr;
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

            {/* Date affichée (header secondaire) */}
            <div className="flex items-center px-6 pt-2 pb-1">
              <CalendarDays className="h-4 w-4 mr-2 opacity-80 text-agenda-purple" />
              <p className="text-sm text-gray-700 font-medium">
                {formatDate(formData.start)}
              </p>
            </div>

            {/* Formulaire */}
            <div className="p-6 pt-3 flex-1 overflow-y-auto overflow-x-hidden">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Prestation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                </div>

                {/* Titre */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
  <CalendarCheck size={18} className="mr-2 text-agenda-purple" />
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