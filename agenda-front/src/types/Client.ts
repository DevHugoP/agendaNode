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

export interface Document {
  id: string;
  name: string;
  url: string;
}
