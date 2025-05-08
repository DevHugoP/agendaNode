# AgendaNode

🚧 Projet en Cours 🚧
(ce projet est un projet personnel ayant pour but unique de m'entrainer sur certaines technos)
 
Plateforme SaaS de gestion de rendez-vous pour professionnels, inspirée d’agenda.ch. Permet la prise de rendez-vous en ligne, la gestion d’agenda, les paiements et rappels automatisés, avec une expérience fluide pour les clients comme pour les pros.

## 🚀 Fonctionnalités principales prévues

- Authentification des professionnels (inscription, connexion, gestion du profil)
- Configuration des services proposés (nom, durée, prix, description, lieu)
- Définition des disponibilités récurrentes (jours ouvrés, horaires, pauses)
- Interface publique de réservation sans création de compte client
- Moteur de réservation intelligent (créneaux disponibles, confirmation)
- Paiement en ligne (Stripe)
- Dashboard agenda (vue jour/semaine/mois)
- Rappels automatiques par email (confirmation, rappel avant RDV)
- Synchronisation bidirectionnelle Google Calendar

## 🛠️ Stack technique

- **Frontend** :
  - React 18 + TypeScript
  - Vite
  - Tailwind CSS
  - Zustand (state)
  - React Query (API/cache)
  - React Hook Form + Zod (validation)
  - Radix UI / Shadcn (UI)
- **Backend** :
  - Node.js (API REST)
  - Prisma ORM + PostgreSQL
  - Authentification JWT
  - Stripe API (paiement)
  - BullMQ + Redis (tâches asynchrones, rappels)
  - Google Calendar API
  - NodeMailer (emails)

## 📁 Structure du monorepo

```
agendaNode/
├── frontend/    # Application React (prise de RDV, dashboard, etc.)
│   └── src/
├── backend/     # API  (services, users, bookings, etc.)
│   └── src/
└── prisma/      # Schémas & migrations DB
```

## ⚡ Démarrage rapide

1. **Cloner le repo**
2. Installer les dépendances :
   - Frontend : `cd agenda-front && npm install`
   - Backend : `cd agenda-api && npm install`
3. Configurer les variables d’environnement (voir `.env.example` dans chaque dossier)
4. Lancer la base de données (PostgreSQL)
5. Démarrer le backend : `npm run dev` (dans `agenda-api/`)
6. Démarrer le frontend : `npm run dev` (dans `agenda-front/`)

## 🔗 Liens internes

- [Frontend (React)](./agenda-front/README.md)
- [Backend Node](./agenda-api/README.md)
- [Prisma Schema](./prisma/schema.prisma)


## 📝 Structure du Projet

```
agenda/
├── agenda-front/          # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── store/        # État global (Zustand)
│   │   ├── styles/       # Styles CSS
│   │   └── types/        # Types TypeScript
│   └── public/           # Fichiers statiques
│
└── agenda-api/           # API Node.js
    ├── src/
    │   ├── controllers/  # Contrôleurs
    │   ├── models/       # Modèles MongoDB
    │   ├── routes/       # Routes API
    │   └── middlewares/  # Middlewares Express
    └── .env             # Variables d'environnement
```


