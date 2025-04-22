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
