import type FullCalendar from '@fullcalendar/react';

export type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export interface UseCalendarViewReturn {
  viewType: CalendarViewType;
  setViewType: (view: CalendarViewType) => void;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  calendarRef: React.RefObject<FullCalendar | null>;
  updateCurrentDateTitle: () => void;
  changeView: (viewName: CalendarViewType) => void;
  goToToday: () => void;
  handlePrev: () => void;
  handleNext: () => void;
}
