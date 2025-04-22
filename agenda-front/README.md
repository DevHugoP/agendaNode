# AgendaNode Frontend

Application front-end du SaaS AgendaNode (prise de rendez-vous en ligne pour professionnels).

## 🎯 Objectif
Permettre aux clients de réserver facilement un service, gérer les agendas pros et payer en ligne.

## 🚀 Stack technique
- React 18 + TypeScript
- Vite (bundler)
- Radix UI, Shadcn
- Zustand (état global)
- React Query (API/cache)
- React Hook Form + Zod (formulaires)

## 🛠️ Installation

```bash
cd agenda-front
npm install
```

## ▶️ Utilisation

### En développement
```bash
npm run dev
```

- Accès sur http://localhost:5173

### Build production
```bash
npm run build
```

### Variables d’environnement
- `.env` à la racine du dossier (`.env.example` fourni)
- Variables principales :
  - `VITE_API_URL` (URL de l’API backend)
  - `VITE_STRIPE_PUBLIC_KEY` (clé Stripe publique)

## 📁 Structure du dossier
```
agenda-front/
├── src/
│   ├── pages/        # Pages principales (Dashboard, Login, etc.)
│   ├── features/     # Fonctionnalités (auth, booking, calendar...)
│   ├── components/   # Composants réutilisables
│   ├── services/     # Appels API (axios)
│   ├── hooks/        # Custom hooks
│   ├── store/        # Zustand (état global)
│   └── utils/        # Fonctions utilitaires
```

## ✨ Fonctionnalités principales
- Auth pro (JWT)
- Config services
- Dispos récurrentes
- Réservation publique
- Paiement Stripe
- Dashboard agenda
- Rappels email
- Sync Google Calendar

## 🤝 Contribution
1. Fork/clone le repo
2. Crée une branche (`feat/ma-feature`)
3. PR bienvenue !

## 📄 Licence
MIT

---
Pour toute question ou bug, ouvre une issue ou contacte le mainteneur du projet.
