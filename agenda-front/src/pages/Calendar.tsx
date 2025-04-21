import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  UserRound,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import CalendarComponent, {
  CalendarEvent,
} from "../components/CalendarComponent";
import AppointmentModal, {
  AppointmentFormData,
} from "../components/AppointmentModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Style des types de rendez-vous
const appointmentTypes = [
  { id: "consultation", name: "Consultation", color: "#2563eb" }, // Bleu vif
  { id: "massage", name: "Massage", color: "#059669" }, // Vert foncé
  { id: "coaching", name: "Coaching", color: "#dc2626" }, // Rouge vif
  { id: "therapie", name: "Thérapie", color: "#f59e0b" }, // Jaune foncé
  { id: "formation", name: "Formation", color: "#4f46e5" }, // Indigo foncé
];

// Générer des événements factices
const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  const statuses: ("confirmed" | "pending" | "cancelled")[] = [
    "confirmed",
    "pending",
    "cancelled",
  ];
  const clientNames = [
    "Jean Dupont",
    "Marie Martin",
    "Sophie Dubois",
    "Michel Bernard",
    "Émilie Petit",
    "François Dubois",
    "Laura Moreau",
    "Thomas Leroy",
  ];

  // Ajout d'exemples explicites pour chaque statut (toujours visibles)
  events.push(
    {
      id: 'event-demo-confirmed',
      title: 'Consultation',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30, 0).toISOString(),
      backgroundColor: appointmentTypes[0].color,
      borderColor: appointmentTypes[0].color,
      extendedProps: {
        clientName: 'Jean Démo',
        type: 'consultation',
        status: 'confirmed',
        notes: 'Cas de statut confirmé',
      },
    },
    {
      id: 'event-demo-pending',
      title: 'Massage',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0, 0).toISOString(),
      backgroundColor: appointmentTypes[1].color,
      borderColor: appointmentTypes[1].color,
      extendedProps: {
        clientName: 'Marie Démo',
        type: 'massage',
        status: 'pending',
        notes: 'Cas de statut en attente',
      },
    },
    {
      id: 'event-demo-cancelled',
      title: 'Coaching',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0, 0).toISOString(),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0, 0).toISOString(),
      backgroundColor: appointmentTypes[2].color,
      borderColor: appointmentTypes[2].color,
      extendedProps: {
        clientName: 'Paul Démo',
        type: 'coaching',
        status: 'cancelled',
        notes: 'Cas de statut annulé',
      },
    }
  );

  // Générer des événements pour les 14 jours à venir
  for (let i = -3; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Jours ouvrables uniquement (lundi-vendredi)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      // Nombre aléatoire d'événements par jour (1 à 4)
      const numEvents = Math.floor(Math.random() * 4) + 1;

      for (let j = 0; j < numEvents; j++) {
        const typeIndex = Math.floor(Math.random() * appointmentTypes.length);
        const eventType = appointmentTypes[typeIndex];
        const startHour = 9 + Math.floor(Math.random() * 8); // Entre 9h et 17h
        const duration = [30, 45, 60, 90][Math.floor(Math.random() * 4)]; // Durées en minutes

        const startDate = new Date(date);
        startDate.setHours(startHour, Math.floor(Math.random() * 4) * 15, 0); // Heures pile et quarts d'heures

        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + duration);

        const clientName =
          clientNames[Math.floor(Math.random() * clientNames.length)];
        const status =
          Math.random() > 0.8
            ? statuses[Math.floor(Math.random() * 3)]
            : "confirmed"; // 80% confirmés, 20% autre statut

        events.push({
          id: `event-${i}-${j}`,
          title: `${eventType.name}`,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          backgroundColor: eventType.color,
          borderColor: eventType.color,
          extendedProps: {
            clientName,
            type: eventType.id,
            status,
            notes:
              Math.random() > 0.7 ? "Notes pour ce rendez-vous..." : undefined,
          },
        });
      }
    }
  }

  return events;
};

// Fonction utilitaire pour obtenir le type d'un événement
const getAppointmentTypeById = (typeId: string) => {
  return (
    appointmentTypes.find((type) => type.id === typeId) || appointmentTypes[0]
  );
};

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    appointmentTypes: appointmentTypes.map((type) => type.id), // Tous activés par défaut
    status: {
      confirmed: true,
      pending: true,
      cancelled: true,
    },
  });

  // États pour la modal de création de rendez-vous
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    undefined
  );

  // Charger les événements factices
  useEffect(() => {
    setIsLoading(true);

    // Simuler une requête API
    setTimeout(() => {
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Gérer les changements de filtres pour les types de rendez-vous
  const handleTypeFilterChange = (typeId: string) => {
    setFilters((prev) => {
      const types = [...prev.appointmentTypes];
      if (types.includes(typeId)) {
        // Retirer le type s'il est déjà inclus
        return {
          ...prev,
          appointmentTypes: types.filter((id) => id !== typeId),
        };
      } else {
        // Ajouter le type s'il n'est pas inclus
        return { ...prev, appointmentTypes: [...types, typeId] };
      }
    });
  };

  // Filtrer les événements
  const filteredEvents = events.filter((event) => {
  let status = event.extendedProps?.status;
  const type = event.extendedProps?.type || "consultation";

  // Normalise et sécurise le statut
  if (status !== "confirmed" && status !== "pending" && status !== "cancelled") {
    status = "confirmed";
  }

  return (
    filters.status[status as keyof typeof filters.status] === true &&
    filters.appointmentTypes.includes(type)
  );
});

  // Gérer le clic sur un événement
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  // Gérer la sélection d'une plage de dates par glissement
  const handleDateSelect = (start: Date, end: Date, allDay: boolean) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setIsNewAppointmentModalOpen(true);
  };

  // Ouvrir la modal de nouveau rendez-vous
  const handleNewAppointmentClick = () => {
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
    setIsNewAppointmentModalOpen(true);
  };

  // Créer ou éditer un rendez-vous
  const handleSaveAppointment = (appointmentData: AppointmentFormData) => {
    const typeInfo = getAppointmentTypeById(appointmentData.appointmentType);
    let isEdit = false;
    let updatedEvents = events;

    // Si on est en édition, remplacer l'événement existant
    if (
      appointmentData &&
      (appointmentData as any).id &&
      events.some((e) => e.id === (appointmentData as any).id)
    ) {
      isEdit = true;
      updatedEvents = events.map((event) =>
        event.id === (appointmentData as any).id
          ? {
              ...event,
              ...appointmentData,
              title: `${typeInfo.name} - ${appointmentData.clientName}`,
              backgroundColor: typeInfo.color,
              borderColor: typeInfo.color,
              extendedProps: {
                clientName: appointmentData.clientName,
                type: appointmentData.appointmentType,
                status: appointmentData.status,
                notes: appointmentData.notes,
              },
            }
          : event
      );
      setEvents(updatedEvents);
      toast.success("Rendez-vous modifié avec succès");
    } else {
      // Création
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: `${typeInfo.name} - ${appointmentData.clientName}`,
        start: appointmentData.start.toISOString(),
        end: appointmentData.end.toISOString(),
        backgroundColor: typeInfo.color,
        borderColor: typeInfo.color,
        extendedProps: {
          clientName: appointmentData.clientName,
          type: appointmentData.appointmentType,
          status: appointmentData.status,
          notes: appointmentData.notes,
        },
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success("Rendez-vous créé avec succès");
    }
    setIsNewAppointmentModalOpen(false);
    setSelectedEvent(null);
  };

  // Déplacement d'un rendez-vous (drag & drop)
  const handleEventDrop = (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents(prevEvents => prevEvents.map(e =>
      e.id === event.id
        ? {
            ...e,
            start: newStart.toISOString(),
            end: newEnd ? newEnd.toISOString() : undefined,
          }
        : e
    ));
    toast.success("Rendez-vous modifié avec succès");
  };

  // Suppression d'un rendez-vous
  const handleDeleteAppointment = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    toast.success("Rendez-vous supprimé avec succès");
    setSelectedEvent(null);
  };


  // Afficher le loader pendant le chargement
  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex justify-center items-center h-full py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-agenda-purple'></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='max-w-7xl mx-auto pb-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-wrap justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Calendrier</h1>
            <p className='mt-1 text-gray-600'>
              Gérez vos rendez-vous et votre planning
            </p>
          </div>

          <div className='flex mt-4 md:mt-0'>

          </div>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Filtres et actions */}
          <div className='lg:col-span-1'>
            <motion.div
              className='bg-white rounded-xl shadow-lg p-6 sticky top-0 lg:top-6 h-fit'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}>
              <h3 className='font-medium text-gray-900 mb-3'>
                Prestations
              </h3>

              <div className='space-y-3'>
                {appointmentTypes.map((type) => (
                  <label
                    key={type.id}
                    className='flex items-center cursor-pointer group'>
                    <input
                      type='checkbox'
                      className='rounded h-4 w-4'
                      checked={filters.appointmentTypes.includes(type.id)}
                      onChange={() => handleTypeFilterChange(type.id)}
                    />
                    <span className='ml-2 text-sm text-gray-700 group-hover:text-gray-900'>
                      {type.name}
                    </span>
                    <div
                      className='ml-auto w-4 h-4 rounded-full transition-transform group-hover:scale-125'
                      style={{ backgroundColor: type.color }}></div>
                  </label>
                ))}
              </div>

              <div className='h-px bg-gray-200 my-5' />

              <h3 className='font-medium text-gray-900 mb-3'>Statut</h3>
              <div className='space-y-3'>
                <label className='flex items-center cursor-pointer group'>
                  <input
                    type='checkbox'
                    className='rounded text-agenda-purple focus:ring-agenda-purple h-4 w-4'
                    checked={filters.status.confirmed}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: {
                          ...prev.status,
                          confirmed: !prev.status.confirmed,
                        },
                      }))
                    }
                  />
                  <span className='ml-2 text-sm text-gray-700 flex items-center group-hover:text-gray-900'>
                    <CheckCircle2 className='h-4 w-4 mr-1 text-green-500' />
                    Confirmés
                  </span>
                </label>
                <label className='flex items-center cursor-pointer group'>
                  <input
                    type='checkbox'
                    className='rounded text-agenda-purple focus:ring-agenda-purple h-4 w-4'
                    checked={filters.status.pending}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: {
                          ...prev.status,
                          pending: !prev.status.pending,
                        },
                      }))
                    }
                  />
                  <span className='ml-2 text-sm text-gray-700 flex items-center group-hover:text-gray-900'>
                    <HelpCircle className='h-4 w-4 mr-1 text-amber-500' />
                    En attente
                  </span>
                </label>
                <label className='flex items-center cursor-pointer group'>
                  <input
                    type='checkbox'
                    className='rounded text-agenda-purple focus:ring-agenda-purple h-4 w-4'
                    checked={filters.status.cancelled}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: {
                          ...prev.status,
                          cancelled: !prev.status.cancelled,
                        },
                      }))
                    }
                  />
                  <span className='ml-2 text-sm text-gray-700 flex items-center group-hover:text-gray-900'>
                    <XCircle className='h-4 w-4 mr-1 text-red-500' />
                    Annulés
                  </span>
                </label>
              </div>

              <div className='h-px bg-gray-200 my-5' />




              <div className='mt-6'>
                <button
                  type='button'
                  className='flex items-center gap-2 w-full px-3 py-2 text-sm font-medium bg-agenda-purple text-white rounded-md shadow-sm hover:bg-agenda-purple-dark focus:outline-none focus:ring-2 focus:ring-agenda-purple focus:ring-opacity-50 transition-colors justify-center'
                  onClick={handleNewAppointmentClick}
                >
                  <PlusCircle className='h-5 w-5' />
                  Nouveau RDV
                </button>
              </div>
            </motion.div>
          </div>

          {/* Calendrier principal */}
          <div className='lg:col-span-4'>
            <CalendarComponent
              events={filteredEvents}
              onEventClick={handleEventClick}
              onDateSelect={handleDateSelect}
              onNewAppointmentClick={handleNewAppointmentClick}
              onEventDrop={handleEventDrop}
            />
          </div>
        </div>

        {/* Modal d'édition d'un rendez-vous existant */}
        <AppointmentModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSaveAppointment}
          onDelete={selectedEvent ? () => handleDeleteAppointment(selectedEvent.id) : undefined}
          initialData={selectedEvent ? {
            id: selectedEvent.id,
            title: selectedEvent.title ?? '',
            clientName: selectedEvent.extendedProps?.clientName ?? '',
            start: selectedEvent.start ? new Date(selectedEvent.start) : new Date(),
            end: selectedEvent.end ? new Date(selectedEvent.end) : new Date(),
            appointmentType: selectedEvent.extendedProps?.type ?? 'consultation',
            status: selectedEvent.extendedProps?.status ?? 'confirmed',
            notes: selectedEvent.extendedProps?.notes ?? '',
          } : undefined}
          editMode={!!selectedEvent}
        />

        {/* Modal de création de rendez-vous */}
        <AppointmentModal
          isOpen={isNewAppointmentModalOpen}
          onClose={() => setIsNewAppointmentModalOpen(false)}
          onSave={handleSaveAppointment}
          startDate={selectedStartDate}
          endDate={selectedEndDate}
        />
      </div>
    </MainLayout>
);
};

export default Calendar;
