# Agenda API

Une API RESTful pour gérer les rendez-vous, construite avec Express.js et Prisma.

## 🚀 Fonctionnalités

- 🔐 Authentification des utilisateurs
- 📅 Gestion des rendez-vous (CRUD)
- 👤 Profil utilisateur
- 🛡️ Sécurité avec middleware d'authentification

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL
- pnpm (ou npm/yarn)

## 🛠️ Installation

1. Cloner le repository :

```bash
git clone https://github.com/votre-username/agenda-api.git
cd agenda-api
```

2. Installer les dépendances :

```bash
pnpm install
```

3. Configurer l'environnement :

```bash
cp .env.example .env
```

Puis éditer le fichier `.env` avec vos configurations.

4. Initialiser la base de données :

```bash
pnpm prisma migrate dev
```

5. Lancer le serveur de développement :

```bash
pnpm dev
```

## 📚 Documentation API

### Authentification

- `POST /auth/login` - Connexion utilisateur
- `POST /auth/register` - Inscription utilisateur

### Rendez-vous

- `GET /appointments` - Liste des rendez-vous
- `POST /appointments` - Créer un rendez-vous
- `GET /appointments/:id` - Détails d'un rendez-vous
- `DELETE /appointments/:id` - Supprimer un rendez-vous

### Utilisateurs

- `GET /api/users/me` - Profil de l'utilisateur connecté

## 🧪 Tests

```bash
pnpm test
```

## 📦 Déploiement

1. Construire l'application :

```bash
pnpm build
```

2. Lancer en production :

```bash
pnpm start
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
