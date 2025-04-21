import { useState, useRef, useEffect, ChangeEvent } from "react";
import { createRoot } from "react-dom/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import "./calendar-custom.css"; // Nous allons créer ce fichier CSS pour les styles avancés

// Définir le type des événements
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    clientName?: string;
    type?: string;
    status?: "confirmed" | "pending" | "cancelled";
    notes?: string;
  };
}

interface CalendarComponentProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (start: Date, end: Date, allDay: boolean) => void;
  onNewAppointmentClick?: () => void;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
}

const CalendarComponent = ({
  events,
  onEventClick,
  onDateSelect,
  onNewAppointmentClick,
  onPrevClick,
  onNextClick,
  onEventDrop,
}: CalendarComponentProps) => {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  >("timeGridWeek");
  const [currentDate, setCurrentDate] = useState<string>("");
  // Month picker state for quick navigation
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [monthPickerValue, setMonthPickerValue] = useState<string>("");
  const calendarRef = useRef<any>(null);

  // Mettre à jour le titre de la date courante
  useEffect(() => {
    updateCurrentDateTitle();
  }, [viewType]);

  // Mettre à jour le titre avec la date actuelle
  const updateCurrentDateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      // Update displayed title
      const title = calendarApi.view.title;
      setCurrentDate(title);
      // Sync month picker input (YYYY-MM)
      const date = calendarApi.getDate();
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      setMonthPickerValue(`${yyyy}-${mm}`);
    }
  };

  // Gérer le clic sur un événement
  const handleEventClick = (info: any) => {
    if (onEventClick) {
      onEventClick(info.event.toPlainObject({ includePrivate: true }));
    }
  };

  // Gérer le déplacement (drag & drop) d'un événement
  const handleEventDrop = (info: any) => {
    if (onEventDrop) {
      const eventObj = info.event.toPlainObject({ includePrivate: true });
      onEventDrop(eventObj, info.event.start, info.event.end);
    }
  };

  // Gérer la sélection d'une plage de dates
  const handleDateSelect = (info: any) => {
    if (onDateSelect) {
      // Ne pas désélectionner - laisse la sélection active pour ouvrir la modal
      info.view.calendar.unselect = function () {};
      onDateSelect(info.start, info.end, info.allDay);
    }
  };

  // Changer la vue du calendrier
  const changeView = (
    viewName: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  ) => {
    setViewType(viewName);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewName);
      updateCurrentDateTitle();
    }
  };

  // Gérer la navigation vers aujourd'hui
  const goToToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateCurrentDateTitle();
    }
  };

  // Navigation précédent/suivant
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateCurrentDateTitle();
      if (onPrevClick) onPrevClick();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateCurrentDateTitle();
      if (onNextClick) onNextClick();
    }
  };
  // Ouvrir/fermer le sélecteur de mois
  const handleMonthPickerOpen = () => {
    if (calendarRef.current) {
      const date = calendarRef.current.getApi().getDate();
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      setMonthPickerValue(`${yyyy}-${mm}`);
    }
    setIsDatePickerOpen((prev) => !prev);
  };
  // Changer de mois via le sélecteur
  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // format YYYY-MM
    setMonthPickerValue(val);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(`${val}-01`);
      updateCurrentDateTitle();
    }
  };

  // Fonction pour obtenir le contenu du badge de statut
  const getStatusBadgeContent = (status: string, mode: "icon" | "full") => {
    const size = mode === "icon" ? 20 : 16;
    const marginStyle = { marginBottom: -1 };
    const textStyle = { color: "#fff" };

    switch (status) {
      case "confirmed":
        return mode === "icon" ? (
          <CheckCircle2 size={size} color="#22c55e" />
        ) : (
          <>
            <CheckCircle2 size={size} color="#22c55e" style={marginStyle} />{" "}
            <span style={textStyle}>Confirmé</span>
          </>
        );
      case "pending":
        return mode === "icon" ? (
          <Clock size={size} color="#f59e0b" />
        ) : (
          <>
            <Clock size={size} color="#f59e0b" style={marginStyle} />{" "}
            <span style={textStyle}>En attente</span>
          </>
        );
      case "cancelled":
        return mode === "icon" ? (
          <XCircle size={size} color="#6b7280" />
        ) : (
          <>
            <XCircle size={size} color="#6b7280" style={marginStyle} />{" "}
            <span style={textStyle}>Annulé</span>
          </>
        );
      default:
        return null;
    }
  };

  // Styles personnalisés pour les événements
  const eventDidMount = (info: any) => {
    const { event } = info;
    const status = event.extendedProps.status;
    // Base event class
    info.el.classList.add("calendar-event");
    // Ajouter une classe selon le statut (confirmed, pending, cancelled)
    if (status) {
      info.el.classList.add(`calendar-event--${status}`);
    }
    // Appliquer la couleur personnalisée si renseignée
    if (event.backgroundColor) {
      info.el.style.backgroundColor = event.backgroundColor;
    }
    // Ajout d'un badge statut, affichage adapté selon la vue
    const badge = document.createElement('span');
    badge.className = `calendar-event-status-badge calendar-event-status-badge--${status}`;
    let inserted = false;
    // Vue timeGrid/semaine/jour : badge à gauche avec texte
    const main = info.el.querySelector('.fc-event-main');
    if (main) {
      const content = getStatusBadgeContent(status, 'full');
      if (content) {
        createRoot(badge).render(content);
      }
      badge.style.marginRight = '6px';
      badge.style.verticalAlign = 'middle';
      main.insertBefore(badge, main.firstChild);

      // Ajout du nom de la personne sous le Prestation
      // On ne modifie que si on est en vue timeGrid (jour ou semaine)
      const calendarApi = info.view?.calendar;
      const viewType = calendarApi?.view?.type;
      if (viewType === 'timeGridDay' || viewType === 'timeGridWeek') {
        // Cherche le titre (type de RDV)
        const titleEl = main.querySelector('.fc-event-title');
        const clientName = event.extendedProps?.clientName;
        if (titleEl && clientName) {
          // Crée ou remplace un sous-titre pour le nom
          let subtitle = main.querySelector('.calendar-event-client-name');
          if (!subtitle) {
            subtitle = document.createElement('div');
            subtitle.className = 'calendar-event-client-name';
            subtitle.style.fontSize = '0.80em';
            subtitle.style.fontWeight = '400';
            subtitle.style.color = '#e0e7ef';
            subtitle.style.marginTop = '2px';
            subtitle.style.whiteSpace = 'normal';
            titleEl.insertAdjacentElement('afterend', subtitle);
          }
          subtitle.textContent = clientName;
        }
      }
      inserted = true;
    }
    // Vue liste : badge à droite, icône seule, taille plus grande
    if (!inserted) {
      const listTitle = info.el.querySelector('.fc-list-event-title');
      if (listTitle) {
        const icon = getStatusBadgeContent(status, 'icon');
        if (icon) {
          createRoot(badge).render(icon);
        }
        badge.classList.add('calendar-event-status-badge--list');
        badge.style.marginLeft = '10px';
        badge.style.marginRight = '0';
        badge.style.verticalAlign = 'middle';
        badge.style.display = 'inline-flex';
        listTitle.appendChild(badge);
        inserted = true;
      }
    }
    // Vue mois : badge à droite du titre, icône seule
    if (!inserted) {
      const monthTitle = info.el.querySelector('.fc-event-title');
      if (monthTitle) {
        const icon = getStatusBadgeContent(status, 'icon');
        if (icon) {
          import('react-dom/client').then(({ createRoot }) => {
            createRoot(badge).render(icon);
          });
        }
        badge.classList.add('calendar-event-status-badge--month');
        badge.style.marginLeft = '8px';
        badge.style.marginRight = '0';
        badge.style.verticalAlign = 'middle';
        badge.style.display = 'inline-flex';
        monthTitle.appendChild(badge);
      }
    }
  };

  return (
    <div className='calendar-container'>
      <motion.div
        className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <div className='flex items-center space-x-4'>
          {/* Titre et sélecteur de mois */}
          <div className='relative hidden sm:block'>
            <button
              onClick={handleMonthPickerOpen}
              className='flex items-center space-x-1 text-xl font-bold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors'>
              <span>{currentDate}</span>
              <CalendarIcon size={20} />
            </button>
            {isDatePickerOpen && (
              <input
                type='month'
                value={monthPickerValue}
                onChange={handleMonthChange}
                onBlur={() => setIsDatePickerOpen(false)}
                className='absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow p-1 z-10'
                autoFocus
              />
            )}
          </div>

          <div className='flex space-x-1 items-center'>
            <button
              onClick={handlePrev}
              className='p-1.5 rounded-full hover:bg-gray-200 transition-colors'
              aria-label='Précédent'>
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className='text-sm font-medium px-3 py-1.5 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-agenda-purple focus:ring-opacity-50 transition-all'>
              {t('calendar.today')}
            </button>
            <button
              onClick={handleNext}
              className='p-1.5 rounded-full hover:bg-gray-200 transition-colors'
              aria-label='Suivant'>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className='flex space-x-4 items-center'>
          <div className='bg-white shadow-sm rounded-full p-1 flex'>
            <button
              onClick={() => changeView("timeGridDay")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                viewType === "timeGridDay"
                  ? "bg-agenda-purple text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              {t('calendar.day')}
            </button>
            <button
              onClick={() => changeView("timeGridWeek")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                viewType === "timeGridWeek"
                  ? "bg-agenda-purple text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              {t('calendar.week')}
            </button>
            <button
              onClick={() => changeView("dayGridMonth")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                viewType === "dayGridMonth"
                  ? "bg-agenda-purple text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              {t('calendar.month')}
            </button>
            <button
              onClick={() => changeView("listWeek")}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                viewType === "listWeek"
                  ? "bg-agenda-purple text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              {t('calendar.list')}
            </button>
          </div>

          <button
            onClick={onNewAppointmentClick}
            className='px-3 py-1.5 text-sm bg-agenda-purple text-white rounded-full shadow-sm hover:bg-agenda-light-purple focus:outline-none focus:ring-2 focus:ring-agenda-purple focus:ring-opacity-50 flex items-center transition-all'>
            <Plus size={16} className='mr-1' />
            <span>{t('calendar.newAppointment')}</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        className='bg-white rounded-xl shadow-lg overflow-hidden'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          headerToolbar={false}
          initialView={viewType}
          locale={i18n.language === "en" ? enLocale : frLocale}
          events={events}
          height='auto'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          allDaySlot={false}
          slotDuration={"00:15:00"}
          slotLabelInterval={"01:00"}
          slotMinTime={"08:00:00"}
          slotMaxTime={"20:00:00"}
          eventClick={(info) => handleEventClick(info)}
          select={(info) => handleDateSelect(info)}
          eventDidMount={eventDidMount}
          eventDrop={handleEventDrop}
          datesSet={updateCurrentDateTitle}
          nowIndicator={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          firstDay={1} // Semaine commence le lundi
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Lundi au vendredi
            startTime: "09:00",
            endTime: "18:00",
          }}
          selectAllow={(selectInfo) => {
            // Permettre la sélection avec glissement uniquement dans les vues jour et semaine
            return viewType === "timeGridDay" || viewType === "timeGridWeek";
          }}
          dayHeaderClassNames='calendar-day-header'
          dayCellClassNames='calendar-day-cell'
          slotLabelClassNames='calendar-slot-label'
          eventClassNames='calendar-event'
          slotLaneClassNames='calendar-slot-lane'
          moreLinkClassNames='calendar-more-link'
          allDayClassNames='calendar-all-day'
        />
      </motion.div>
    </div>
  );
};

export default CalendarComponent;
