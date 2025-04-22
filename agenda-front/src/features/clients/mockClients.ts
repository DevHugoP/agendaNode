// Données mockées pour clients, documents, factures et consultations
import { Client, Document } from '../../types/Client';

export const mockClients: Client[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Martin",
    email: "alice.martin@email.com",
    phone: "0601020304",
    address: "12 rue des Lilas, 75012 Paris",
    birthDate: "1987-05-14",
  },
  {
    id: "2",
    firstName: "Bruno",
    lastName: "Durand",
    email: "bruno.durand@email.com",
    phone: "0605060708",
    address: "8 avenue Victor Hugo, 69006 Lyon",
    birthDate: "1978-11-30",
  },
];

export const mockDocuments: Record<string, Document[]> = {
  "1": [
    { id: "d1", name: "Bilan sanguin 2024.pdf", url: "/docs/bilan-sanguin.pdf" },
    { id: "d2", name: "Radio épaule.jpg", url: "/docs/radio-epaule.jpg" },
  ],
  "2": [
    { id: "d3", name: "Compte-rendu IRM.pdf", url: "/docs/irm.pdf" },
  ],
};

export const mockInvoices: Record<string, Array<{ id: string; date: string; amount: number; paid: boolean }>> = {
  "1": [
    { id: "f1", date: "2024-03-10", amount: 65, paid: true },
    { id: "f2", date: "2024-04-05", amount: 70, paid: false },
  ],
  "2": [
    { id: "f3", date: "2024-01-15", amount: 80, paid: true },
  ],
};

export const mockPastConsults: Record<string, Array<{ id: string; date: string; duration: number; practitioner: string; notes?: string }>> = {
  "1": [
    { id: "c1", date: "2024-03-10", duration: 30, practitioner: "Dr. Dupont", notes: "Douleurs persistantes" },
  ],
  "2": [
    { id: "c2", date: "2024-01-15", duration: 45, practitioner: "Dr. Leroy" },
  ],
};

export const mockUpcomingConsults: Record<string, Array<{ id: string; date: string; time: string; location: string }>> = {
  "1": [
    { id: "u1", date: "2025-05-02", time: "14:00", location: "Cabinet Paris 12" },
  ],
  "2": [],
};
