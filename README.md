# AgendaNode

Plateforme SaaS de gestion de rendez-vous pour professionnels, inspirée d’agenda.ch. Permet la prise de rendez-vous en ligne, la gestion d’agenda, les paiements et rappels automatisés, avec une expérience fluide pour les clients comme pour les pros.

## 🚀 Fonctionnalités principales

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
  - Node.js + NestJS (API REST)
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
   - Frontend : `cd frontend && npm install`
   - Backend : `cd backend && npm install`
3. Configurer les variables d’environnement (voir `.env.example` dans chaque dossier)
4. Lancer la base de données (PostgreSQL)
5. Démarrer le backend : `npm run start:dev` (dans `backend/`)
6. Démarrer le frontend : `npm run dev` (dans `frontend/`)

## 🔗 Liens internes

- [Frontend (React)](./frontend/README.md)
- [Backend (NestJS)](./backend/README.md)
- [Prisma Schema](./prisma/schema.prisma)

## ✨ Fonctionnalités principales

- Auth pro, config de services, dispos récurrentes
- Réservation publique, paiement Stripe
- Dashboard agenda, rappels email, sync Google Calendar

## 🤝 Contribution

1. Fork/clone le repo
2. Crée une branche (`feat/ma-feature`)
3. PR bienvenue !

## 📄 Licence

MIT

## 📞 Contact

Pour toute question, ouvre une issue ou contacte le mainteneur du projet.

## 🚀 Fonctionnalités

- 📅 Calendrier interactif avec vue jour/semaine/mois
- 👤 Gestion des utilisateurs (médecins et patients)
- 🔐 Authentification sécurisée
- 📱 Interface responsive
- 🎨 Design moderne avec Tailwind CSS
- 📊 Tableau de bord avec statistiques

## 🛠️ Technologies

- Frontend:

  - React
  - TypeScript
  - Tailwind CSS
  - FullCalendar
  - React Router
  - Zustand (gestion d'état)

- Backend:
  - Node.js
  - Express
  - JWT (authentification)

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

## 🔧 Installation

1. Cloner le repository

```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances du frontend

```bash
cd agenda-front
npm install
```

3. Installer les dépendances du backend

```bash
cd agenda-api
npm install
```

4. Créer un fichier `.env` dans le dossier backend avec les variables suivantes :

```
PORT=3000
JWT_SECRET=votre_secret_jwt
```

5. Lancer le backend

```bash
cd agenda-api
npm run dev
```

6. Lancer le frontend

```bash
cd agenda-front
npm run dev
```

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

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
