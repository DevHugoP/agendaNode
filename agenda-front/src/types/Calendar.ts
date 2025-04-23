// Types centralisés pour le calendrier et les événements
import { EventClickArg as FCEventClickArg, DateSelectArg as FCDateSelectArg, EventApi } from '@fullcalendar/core';

export interface CalendarComponentProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  onDateSelect?: (start: Date, end: Date, allDay: boolean) => void;
}

/**
 * Événement métier utilisé dans l'app (stockage, manipulation, etc.)
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    clientName?: string;
    type?: string;
    status?: 'confirmed' | 'pending' | 'cancelled';
    notes?: string;
  };
}

/**
 * Argument du handler de clic sur événement (FullCalendar)
 * Voir https://fullcalendar.io/docs/eventClick
 */
export type EventClickArg = FCEventClickArg;
export type EventDropArg = import('@fullcalendar/core').EventDropArg;
export type EventMountArg = import('@fullcalendar/core').EventMountArg;

/**
 * Argument du handler de sélection de dates (FullCalendar)
 * Voir https://fullcalendar.io/docs/select-callback
 */
export type DateSelectArg = FCDateSelectArg;

/**
 * API d'un événement FullCalendar (pour accès avancés)
 */
export type FullCalendarEventApi = EventApi;
