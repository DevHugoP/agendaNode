import { useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';


import type { CalendarViewType, UseCalendarViewReturn } from '../types/calendarView';

export function useCalendarView(initialView: CalendarViewType = 'timeGridWeek'): UseCalendarViewReturn {
  // Typage explicite du retour du hook
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const [viewType, setViewType] = useState<CalendarViewType>(initialView);
  // Initialisation : titre semaine courante dès le premier render
  const getInitialWeekTitle = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const locale = navigator.language || 'fr-FR';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `${monday.toLocaleDateString(locale, options)} – ${sunday.toLocaleDateString(locale, options)} ${sunday.getFullYear()}`;
  };
  const [currentDate, setCurrentDate] = useState<string>(getInitialWeekTitle());
  const calendarRef = useRef<FullCalendar | null>(null);
  const updateCurrentDateTitle = useCallback(() => {
    if (calendarRef.current && typeof calendarRef.current.getApi === 'function') {
      const calendarApi = calendarRef.current.getApi();
      setCurrentDate(calendarApi.view.title);
    }
  }, []);
  const changeView = useCallback((viewName: typeof viewType) => {
    setViewType(viewName);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewName);
      updateCurrentDateTitle();
    }
  }, [updateCurrentDateTitle]);
  const goToToday = useCallback(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateCurrentDateTitle();
    }
  }, [updateCurrentDateTitle]);
  const handlePrev = useCallback(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateCurrentDateTitle();
    }
  }, [updateCurrentDateTitle]);
  const handleNext = useCallback(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateCurrentDateTitle();
    }
  }, [updateCurrentDateTitle]);
  return {
    viewType,
    setViewType,
    currentDate,
    setCurrentDate,
    calendarRef,
    updateCurrentDateTitle,
    changeView,
    goToToday,
    handlePrev,
    handleNext
  };
}
