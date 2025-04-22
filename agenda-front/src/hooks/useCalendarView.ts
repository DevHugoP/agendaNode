import { useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';

export function useCalendarView(initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek' = 'timeGridWeek') {
  const [viewType, setViewType] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek">(initialView);
  const [currentDate, setCurrentDate] = useState<string>("");
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
