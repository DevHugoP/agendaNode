// Librairies externes
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

// FullCalendar & plugins
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';

// Hooks & outils internes
import { useCalendarView } from '../hooks/useCalendarView';
import useBadgeStatus from '../hooks/useBadgeStatus.tsx';
import { useClickOutside } from '../hooks/useClickOutside';

// Types & styles
import type { CalendarEvent } from '../types/Calendar';
import "./calendar-custom.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface CalendarComponentProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onDateSelect?: (start: Date, end: Date) => void;
}

const CalendarComponent = ({ events, onEventClick, onEventDrop, onDateSelect }: CalendarComponentProps) => {
  // --- Hooks principaux ---
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const pickerRef = useRef<HTMLElement>(null);
  const {
    viewType,
    currentDate,
    calendarRef,
    updateCurrentDateTitle,
    changeView,
    goToToday,
    handlePrev,
    handleNext
  } = useCalendarView("timeGridWeek");
  const getStatusBadgeContent = useBadgeStatus();

  // --- Helpers ---
  function getCalendarTitle(viewType: string, date: Date | string, locale: string): string {
    // Vue semaine : si date string (titre FC), retourne tel quel
    if (viewType === "timeGridWeek" && !(date instanceof Date) && typeof date === "string") return date;
    let d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
      if (typeof date === 'string') {
        const iso = Date.parse(date);
        if (!isNaN(iso)) {
          d = new Date(iso);
        } else {
          return date;
        }
      } else {
        return '';
      }
    }
    if (viewType === "timeGridWeek") {
      const day = d.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(d);
      monday.setDate(d.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
      return `${monday.toLocaleDateString(locale, options)} – ${sunday.toLocaleDateString(locale, options)} ${sunday.getFullYear()}`;
    }
    if (viewType === "dayGridMonth") {
      return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }
    if ((viewType === "timeGridDay" || viewType.startsWith("list")) && date) {
      const parsed = date instanceof Date ? date : new Date(date);
      if (!isNaN(parsed.getTime())) {
        try {
          return parsed.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
          return parsed.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
      }
      return typeof date === 'string' ? date : '';
    }
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  useClickOutside(pickerRef as React.RefObject<HTMLElement>, () => setIsDatePickerOpen(false), isDatePickerOpen);

  // --- Handlers extraits pour clarté ---
  const handleEventClick = (info: EventClickArg) => {
    if (!onEventClick) return;
    onEventClick({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      backgroundColor: info.event.backgroundColor,
      borderColor: info.event.borderColor,
      extendedProps: info.event.extendedProps as CalendarEvent['extendedProps'],
    });
  };
  const handleEventDrop = (info: EventDropArg) => {
    if (!onEventDrop) return;
    onEventDrop({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      backgroundColor: info.event.backgroundColor,
      borderColor: info.event.borderColor,
      extendedProps: info.event.extendedProps as CalendarEvent['extendedProps'],
    }, info.event.start, info.event.end);
  };
  const handleDateSelect = (info: DateSelectArg) => {
    if (onDateSelect && info.start && info.end) {
      onDateSelect(info.start, info.end);
    }
  };
  const eventDidMount = (info: EventMountArg) => {
    // Ajoute les badges de statut sur les événements selon leur type
    const { event } = info;
    const status = event.extendedProps?.status;
    info.el.classList.add("calendar-event");
    if (status) info.el.classList.add(`calendar-event--${status}`);
    if (event.backgroundColor) (info.el as HTMLElement).style.backgroundColor = event.backgroundColor;
    const badge = document.createElement('span');
    badge.className = `calendar-event-status-badge calendar-event-status-badge--${status}`;
    let inserted = false;
    const main = info.el.querySelector('.fc-event-main');
    if (main) {
      const content = getStatusBadgeContent(status, 'full');
      if (content) import('react-dom/client').then(({ createRoot }) => { createRoot(badge).render(content); });
      (badge as HTMLElement).style.marginRight = '6px';
      (badge as HTMLElement).style.verticalAlign = 'middle';
      main.insertBefore(badge, main.firstChild);
      inserted = true;
    }
    if (!inserted) {
      const listTitle = info.el.querySelector('.fc-list-event-title');
      if (listTitle) {
        const icon = getStatusBadgeContent(status, 'icon');
        if (icon) import('react-dom/client').then(({ createRoot }) => { createRoot(badge).render(icon); });
        badge.classList.add('calendar-event-status-badge--list');
        badge.style.marginLeft = '10px';
        badge.style.marginRight = '0';
        badge.style.verticalAlign = 'middle';
        badge.style.display = 'inline-flex';
        listTitle.appendChild(badge);
        inserted = true;
      }
    }
    if (!inserted) {
      const monthTitle = info.el.querySelector('.fc-event-title');
      if (monthTitle) {
        const icon = getStatusBadgeContent(status, 'icon');
        if (icon) import('react-dom/client').then(({ createRoot }) => { createRoot(badge).render(icon); });
        (badge as HTMLElement).classList.add('calendar-event-status-badge--month');
        (badge as HTMLElement).style.marginLeft = '8px';
        (badge as HTMLElement).style.marginRight = '0';
        (badge as HTMLElement).style.verticalAlign = 'middle';
        (badge as HTMLElement).style.display = 'inline-flex';
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
          <div className='relative flex items-center' ref={pickerRef as React.RefObject<HTMLDivElement>}>
            <button
              onClick={() => setIsDatePickerOpen((prev) => !prev)}
              className='p-2 rounded-full hover:bg-gray-200 transition-colors'
              aria-label='Ouvrir le sélecteur de date/mois'>
              <CalendarIcon size={22} />
            </button>
            <span
              className="ml-2 text-xl font-bold text-gray-900 select-none"
            >
              {getCalendarTitle(viewType, currentDate, i18n.language)}
            </span>
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-white rounded shadow-lg border border-gray-200">
                <DatePicker
                  selected={selectedDate !== null ? selectedDate : undefined}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setIsDatePickerOpen(false);
                    if (date) {
                      if (viewType === "dayGridMonth") {
                        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                        calendarRef.current?.getApi()?.gotoDate(firstDay);
                      } else if (viewType === "timeGridWeek" || viewType === "listWeek") {
                        const monday = new Date(date);
                        const day = monday.getDay();
                        const diff = (day === 0 ? -6 : 1) - day;
                        monday.setDate(monday.getDate() + diff);
                        calendarRef.current?.getApi()?.gotoDate(monday);
                      } else {
                        calendarRef.current?.getApi()?.gotoDate(date);
                      }
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  className="border rounded px-2 py-1"
                  onCalendarClose={() => setIsDatePickerOpen(false)}
                />
              </div>
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
          views={{
            dayGridMonth: {
              dayHeaderContent: (args) => {
                // Nom du jour complet dans la langue courante
                return args.date.toLocaleDateString(i18n.language, { weekday: 'long' });
              },
            },
            timeGridWeek: {
              dayHeaderContent: ({ date }) => {
                let day;
                if (i18n.language === 'de') {
                  // Forcer 3 lettres allemandes : Don, Mit, Sam, etc.
                  const full = date.toLocaleDateString('de', { weekday: 'long' });
                  // Tableau mapping court -> long
                  const map: Record<string, string> = {
                    'Mo': 'Mon',
                    'Di': 'Die',
                    'Mi': 'Mit',
                    'Do': 'Don',
                    'Fr': 'Fre',
                    'Sa': 'Sam',
                    'So': 'Son',
                  };
                  const short = date.toLocaleDateString('de', { weekday: 'short' }).replace('.', '');
                  day = map[short] ?? full.slice(0, 3);
                } else {
                  day = date.toLocaleDateString(i18n.language, { weekday: 'short' }).slice(0, 3);
                }
                const datePart = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                return `${day} ${datePart}`;
              },
            },
            timeGridDay: {
              dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
            },
            listWeek: {
              dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
            },
            listDay: {
              dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
            },
          }}
          headerToolbar={false}
          initialView={viewType}
          locale={i18n.language === 'fr' ? frLocale : enLocale}
          events={events as CalendarEvent[]}
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
          eventClick={handleEventClick}
          select={handleDateSelect}
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
          firstDay={1} 
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "09:00",
            endTime: "18:00",
          }}
          selectAllow={() => {
            // Permettre la sélection avec glissement uniquement dans les vues jour et semaine
            return viewType === "timeGridDay" || viewType === "timeGridWeek";
          }}
          dayHeaderClassNames='calendar-day-header'
          dayCellClassNames='calendar-day-cell'
          slotLabelClassNames='calendar-slot-label'
        />
      </motion.div>
    </div>
  );
};

export default CalendarComponent;
