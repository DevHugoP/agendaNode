# AgendaNode Frontend

Application front-end du projet SaaS AgendaNode (prise de rendez-vous en ligne pour professionnels).

## 🚀 Stack technique
- **React 18** + **TypeScript**
- **Vite** (bundler)
- **Chakra UI** (UI kit)
- **React Router** (navigation)
- **Zustand** (état global)
- **React Query** (requêtes API/cache)
- **React Hook Form** + **Zod** (formulaires et validation)
- **Radix UI / Shadcn** (composants UI)

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

## 🛠️ Commandes utiles
- `npm install` — Installer les dépendances
- `npm run dev` — Lancer le serveur de dev (Vite)
- `npm run build` — Build production
- `npm run lint` — Linter le code

## 🔗 Lien vers le backend
Voir le dossier `../backend` (NestJS + Prisma + PostgreSQL)

## ✨ Fonctionnalités principales
- Authentification pro (JWT)
- Configuration des services
- Définition des dispos récurrentes
- Réservation publique sans compte
- Paiement Stripe
- Dashboard agenda (jour/semaine/mois)
- Rappels email automatisés
- Sync Google Calendar

## 🤝 Contribuer
1. Fork/clone le repo
2. Crée une branche (`feat/ma-feature`)
3. Fais tes modifs puis PR !

---

Pour toute question ou bug, ouvre une issue ou contacte le mainteneur du projet.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
