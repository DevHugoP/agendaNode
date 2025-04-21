import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiArrowLeft, FiAlignLeft, FiTag } from 'react-icons/fi';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const NewAppointment = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler une création de rendez-vous
    try {
      // Ici, vous feriez un appel API pour créer un rendez-vous
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers le tableau de bord
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau Rendez-vous</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="bg-white shadow rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Titre"
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex: Rendez-vous médecin"
                icon={FiTag}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  label="Date"
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  icon={FiCalendar}
                  min={new Date().toISOString().split('T')[0]}
                />

                <FormInput
                  label="Heure"
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  icon={FiClock}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="form-control">
                  <label htmlFor="duration" className="form-label">Durée (en minutes)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiClock size={18} />
                    </div>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="form-input pl-10 w-full"
                      required
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="90">1 heure 30</option>
                      <option value="120">2 heures</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="description" className="form-label">Description (optionnelle)</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400">
                    <FiAlignLeft size={18} />
                  </div>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input pl-10 w-full h-24"
                    placeholder="Notes ou détails supplémentaires..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Annuler
                </Button>

                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Créer le rendez-vous
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NewAppointment;