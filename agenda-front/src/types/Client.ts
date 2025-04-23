// Types centralisés pour les entités Client, Document, etc.

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  paid: boolean;
  url: string;
  name: string;
}

export interface PastConsult {
  id: string;
  date: string;
  duration: number;
  practitioner: string;
  notes?: string;
}

export interface UpcomingConsult {
  id: string;
  date: string;
  time: string;
  location: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
}
