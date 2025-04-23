import { useState, useEffect } from 'react';
import type { AppointmentFormData } from '../types/appointment';
import { appointmentSchema } from '../validation/appointmentSchema';
import { useTranslation } from 'react-i18next';

export interface UseAppointmentFormProps {
  startDate?: Date;
  endDate?: Date;
  editMode?: boolean;
  initialData?: Partial<AppointmentFormData>;
}

export type UseAppointmentFormReturn = {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => void;
  handleTypeChange: (typeId: string) => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export function useAppointmentForm({ startDate, endDate, editMode = false, initialData }: UseAppointmentFormProps): UseAppointmentFormReturn {

  const { t } = useTranslation();
  const [formData, setFormData] = useState<AppointmentFormData>({
    id: initialData?.id,
    title: '',
    clientName: '',
    start: startDate || new Date(),
    end: endDate || new Date(Date.now() + 30 * 60 * 1000),
    appointmentType: 'consultation',
    notes: '',
    status: 'confirmed',
  });
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (startDate) {
      setFormData(prev => ({
        ...prev,
        start: startDate,
        end: endDate || new Date(startDate.getTime() + 30 * 60 * 1000)
      }));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (editMode && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        id: initialData.id || prev.id,
      }));
    }
  }, [editMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      const result = appointmentSchema.safeParse(updated);
      if (!result.success) {
        // Générer les erreurs par champ
        const errors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[err.path[0]] = t(err.message);
          }
        });
        setFieldErrors(errors);
        setError(t(result.error.errors[0].message));
      } else {
        setFieldErrors({});
        setError('');
      }
      return updated;
    });
  };


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const [date, time] = e.target.value.split('T');
    setFormData(prev => {
      let updated: AppointmentFormData;
      if (field === 'start') {
        const newStart = new Date(date + 'T' + time);
        updated = {
          ...prev,
          start: newStart,
          end: prev.end <= newStart ? new Date(newStart.getTime() + 30 * 60 * 1000) : prev.end
        };
      } else {
        const newEnd = new Date(date + 'T' + time);
        updated = { ...prev, end: newEnd };
      }
      const result = appointmentSchema.safeParse(updated);
      if (!result.success) {
        const errors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[err.path[0]] = t(err.message);
          }
        });
        setFieldErrors(errors);
        setError(t(result.error.errors[0].message));
      } else {
        setFieldErrors({});
        setError('');
      }
      return updated;
    });
  };


  const handleTypeChange = (typeId: string) => {
    setFormData(prev => {
      const updated = { ...prev, appointmentType: typeId };
      const result = appointmentSchema.safeParse(updated);
      if (!result.success) {
        const errors: { [key: string]: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[err.path[0]] = t(err.message);
          }
        });
        setFieldErrors(errors);
        setError(t(result.error.errors[0].message));
      } else {
        setFieldErrors({});
        setError('');
      }
      return updated;
    });
  };


  return {
    formData,
    setFormData,
    handleChange,
    handleDateChange,
    handleTypeChange,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
  };
}

