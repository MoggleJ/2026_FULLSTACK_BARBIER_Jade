# MJQbe WEB

**MJQbe WEB** est un hub web unifié permettant d'accéder à vos applications en ligne (streaming, productivité, outils) depuis une seule interface. L'application propose deux modes d'affichage : **MJ TV** orienté consommation de contenu (icônes larges, grand écran) et **MJ Desktop** orienté productivité (vue compacte). Chaque utilisateur peut personnaliser son thème, sa langue, ses favoris et son profil.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite, React Router v6, CSS vanilla |
| Backend | Node.js + Express, JWT, Bcrypt |
| OAuth | Passport.js (Google, GitHub) — optionnel |
| Upload | Multer (avatars) |
| Base de données | PostgreSQL 16 (driver `pg` natif) |
| Infra | Docker + Docker Compose |
| Prod | Nginx (sert le frontend statique) |

---

## Installation et lancement

### 1. Configurer les variables d'environnement

Copier et remplir les fichiers d'exemple :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env`** — variables obligatoires :

```env
PORT=5000
DATABASE_URL=postgresql://user:password@db:5432/mjqbe
JWT_SECRET=changez_moi_en_production
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# OAuth Google (laisser vide pour désactiver)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth GitHub (laisser vide pour désactiver)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**`frontend/.env`** :

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Lancer avec Docker

```bash
docker-compose up --build
```

- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend API : [http://localhost:5000/api](http://localhost:5000/api)
- Base de données : réseau interne Docker uniquement (non exposée)

### 3. Créer le premier compte admin

Au premier lancement, créez un compte via l'interface **Register**, puis promouvez-le en admin directement en base :

```bash
docker exec -it mjqbe_db psql -U user -d mjqbe \
  -c "UPDATE users SET role = 'admin' WHERE username = 'votre_username';"
```

Les comptes admin ont accès au tableau de bord d'administration via le menu de la sidebar.

---

## Ce que permet l'application

### Pour tous les utilisateurs connectés

- **Hub d'applications** : parcourir et ouvrir des applications en mode TV ou Desktop
- **Deux modes d'ouverture** : dans un iframe intégré, ou dans un nouvel onglet (selon la config de l'app)
- **Recherche** : filtrer les applications par nom
- **Favoris** : épingler ses applications préférées
- **Applications récentes** : retrouver rapidement ce qui a été ouvert
- **Paramètres personnalisés** : thème (14 options sombres/claires), mode, taille des icônes, langue (fr/en), format de l'heure
- **Profil** : modifier son pseudo, son email, son avatar (upload), son mot de passe

### Pour les administrateurs

- **Gestion des applications** : créer, modifier, supprimer des apps (nom, icône, URL, catégorie, mode, externe/iframe)
- **Gestion des catégories** : créer, modifier, supprimer des catégories par mode
- **Gestion des utilisateurs** : rechercher, changer le rôle, supprimer des comptes
- **Logs d'activité** : consulter les actions enregistrées (connexions, lancements d'apps)

---

## API REST

Toutes les routes sont préfixées par `/api`.

### Auth — public

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter — retourne un JWT |
| POST | `/auth/logout` | Déconnexion (stateless) |
| GET | `/auth/me` | Profil de l'utilisateur connecté `[auth]` |
| GET | `/auth/google` | Connexion via Google `[optionnel]` |
| GET | `/auth/google/callback` | Callback OAuth Google |
| GET | `/auth/github` | Connexion via GitHub `[optionnel]` |
| GET | `/auth/github/callback` | Callback OAuth GitHub |

### Applications — `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/apps` | Lister les apps |
| GET | `/apps/:id` | Détail d'une app |
| POST | `/apps` | Créer une app `[admin]` |
| PUT | `/apps/:id` | Modifier une app `[admin]` |
| DELETE | `/apps/:id` | Supprimer une app `[admin]` |

### Catégories — `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/categories` | Lister les catégories |
| POST | `/categories` | Créer une catégorie `[admin]` |
| PUT | `/categories/:id` | Modifier une catégorie `[admin]` |
| DELETE | `/categories/:id` | Supprimer une catégorie `[admin]` |

### Paramètres — `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/settings` | Récupérer les paramètres |
| PUT | `/settings` | Mettre à jour les paramètres |

Corps `PUT /settings` (tous les champs sont optionnels) :
```json
{
  "theme": "dark",
  "mode": "TV",
  "layout": "grid",
  "icon_size": { "TV": "medium", "Desktop": "medium" }
}
```

### Favoris — `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/favorites` | Lister ses favoris |
| POST | `/favorites/:appId` | Ajouter un favori |
| DELETE | `/favorites/:appId` | Retirer un favori |

### Profil utilisateur — `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/users/profile` | Récupérer son profil |
| PUT | `/users/profile` | Modifier pseudo / email |
| PUT | `/users/password` | Changer son mot de passe |
| POST | `/users/avatar` | Uploader un avatar (multipart/form-data) |
| DELETE | `/users/avatar` | Supprimer son avatar |

### Administration — `[admin]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/users` | Lister les utilisateurs (pagination + recherche) |
| PUT | `/admin/users/:id/role` | Changer le rôle d'un utilisateur |
| DELETE | `/admin/users/:id` | Supprimer un utilisateur |
| GET | `/logs` | Consulter les logs d'activité |

### Authentification des requêtes

Toutes les routes marquées `[auth]` nécessitent le header :
```
Authorization: Bearer <token>
```

Le token JWT est retourné lors du login et stocké côté client dans `localStorage` (clé : `mjqbe_token`). Il expire après **7 jours**.

---

## Architecture

### Backend — Clean Architecture

```
backend/src/
├── routes/          # Définition des routes + application des middlewares
├── controllers/     # Handlers HTTP — appellent les services, répondent
├── services/        # Logique métier et validation
├── repositories/    # Accès base de données (SQL uniquement)
├── middlewares/     # auth-middleware (JWT), role-middleware (admin)
├── config/          # Configuration Passport.js (OAuth)
└── utils/           # handle() — wrapper async/gestion d'erreurs
```

Flux d'une requête : `routes → middlewares → controllers → services → repositories → DB`

### Frontend — Structure par fonctionnalité

```
frontend/src/
├── api/             # Couche fetch centralisée (apiFetch avec JWT)
├── context/         # Providers globaux : Auth, Theme, Mode, Lang, ClockFormat, IconSize, Layout
├── hooks/           # Hooks métier : useSettings, useApps, useFavorites, useOpenApp, useRecentApps…
├── components/
│   ├── Layout/      # Conteneur principal (sidebar + contenu)
│   ├── Sidebar/     # Navigation, profil, horloge, footer
│   ├── MobileHeader/# En-tête responsive mobile
│   ├── AppGrid/     # Grille d'affichage des applications
│   └── AppCard/     # Carte individuelle d'une application
├── pages/
│   ├── Home/        # Page d'accueil — favoris + récents
│   ├── AllApps/     # Toutes les applications par catégorie
│   ├── Search/      # Recherche en temps réel
│   ├── AppViewer/   # Iframe ou redirection externe
│   ├── Settings/    # Paramètres + carte profil
│   ├── Profile/     # Modification du profil et du mot de passe
│   ├── Admin/       # Tableau de bord admin (Apps, Catégories, Utilisateurs, Logs)
│   ├── Auth/        # Login / Register / OAuth
│   └── NotFound/    # Page 404
└── i18n/            # Traductions fr.js / en.js
```

### Infrastructure Docker

```
[Navigateur]
     │
     ├── :80   → [Nginx]  → build Vite statique (prod)
     │   :5173 → [Vite]   → dev server (dev)
     │
     └── :5000 → [Express / Backend]
                      │
               [db_network isolé]
                      │
               [PostgreSQL]  ← non accessible publiquement
```

Deux réseaux Docker :
- `app_network` — communication frontend ↔ backend
- `db_network` — communication backend ↔ base de données (isolé)

### Modèle de données

| Table | Contenu |
|-------|---------|
| `users` | Comptes utilisateurs (id UUID, username, password_hash, role, email, avatar) |
| `settings` | Préférences par utilisateur (theme, mode, layout, icon_size, selected_apps) |
| `apps` | Applications référencées (name, icon, url, category_id, mode, is_external) |
| `categories` | Catégories d'apps par mode TV ou Desktop |
| `favorites` | Association user ↔ app |
| `logs` | Historique d'actions (login, app_launch) |
| `oauth_accounts` | Comptes OAuth liés (provider + provider_id) |

---

## Commandes utiles

```bash
# Lancer tout le projet
docker-compose up --build

# Accès à la base de données en CLI
docker exec -it mjqbe_db psql -U user -d mjqbe

# Dev backend seul (hors Docker)
cd backend && nodemon src/index.js

# Dev frontend seul (hors Docker)
cd frontend && npm run dev

# Linter
npm run lint

# Tests
npm run test:backend
npm run test:frontend
npm run test:all
```
