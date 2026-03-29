# MJQbe WEB

MJQbe WEB est un hub web unifié qui centralise l'accès à vos applications en ligne (streaming, productivité, outils) depuis une seule interface. L'application propose deux modes d'affichage — **MJ TV** (grandes icônes, lecture passive) et **MJ Desktop** (vue compacte, orientée productivité) — avec une personnalisation complète par utilisateur : thème, langue, favoris et profil.

---

## Lancement rapide

### 1. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# PostgreSQL (utilisé par docker-compose)
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=mjqbe

# BDD 
APP_ADMIN_USERNAME=this_is_an_admin               # A modifier
APP_ADMIN_PASSWORD=this_is_an_admin_password      # A modifier

APP_USER_USERNAME=this_is_a_user                  # A modifier
APP_USER_PASSWORD=this_is_a_user_password         # A modifier

# Backend
PORT=5000
JWT_SECRET=change_me_in_production                # Peut être modifé
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:5000/api

# OAuth Google
GOOGLE_CLIENT_ID=                              # A completer selon rapport
GOOGLE_CLIENT_SECRET=                          # A completer selon rapport
VITE_OAUTH_GOOGLE_ENABLED=false                # Passer à true après avoir renseigné les clés

# OAuth GitHub
GITHUB_CLIENT_ID=                              # A completer selon rapport
GITHUB_CLIENT_SECRET=                          # A completer selon rapport
VITE_OAUTH_GITHUB_ENABLED=false                # Passer à true après avoir renseigné les clés

# URL publique du backend (pour les callbacks OAuth)
BACKEND_URL=http://localhost:5000
# URL publique du frontend (pour les redirections OAuth)
FRONTEND_URL=http://localhost:5173
```

### 2. Lancer avec Docker

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Backend | http://localhost:5000/api/health |
| Base de données | réseau interne Docker uniquement |

### 3. Transformer un compte user en compte admin

Créer un compte via l'interface **Register**, puis le promouvoir directement en base :

```bash
docker exec -it mjqbe_db psql -U user -d mjqbe \
  -c "UPDATE users SET role = 'admin' WHERE username = 'votre_username';"
```

Autrement, utiliser un compte déjà admin et utiliser l'interface Admin de gestion des utilisateurs.

### Commandes utiles

```bash
# Lancer tout le projet
docker-compose up --build

# Vider la bdd
sudo docker-compose down -v

# Accès à la base de données en CLI
docker exec -it mjqbe_db psql -U user -d mjqbe

# Dev backend seul (sans Docker)
cd backend && nodemon src/index.js

# Dev frontend seul (sans Docker)
cd frontend && npm run dev

# Tests
npm run test:backend
npm run test:frontend
npm run test:all
```

---

## Fonctionnalités

### Pour tous les utilisateurs connectés

- **Hub d'applications** — parcourir et ouvrir des apps en mode TV ou Desktop
- **Recherche** — filtrer les applications par nom
- **Favoris** — épingler ses applications préférées
- **Applications récentes** — retrouver rapidement ce qui a été ouvert
- **Paramètres personnalisés** — 14 thèmes (sombres/clairs), mode d'affichage, taille des icônes, langue (fr/en), format de l'heure
- **Profil** — modifier son pseudo, son email, son avatar (upload) et son mot de passe

### Pour les administrateurs

- **Gestion des applications** — créer, modifier, supprimer des apps (nom, icône, URL, catégorie, mode, externe/iframe)
- **Gestion des catégories** — créer, modifier, supprimer des catégories par mode
- **Gestion des utilisateurs** — rechercher, changer le rôle, supprimer des comptes, avec pagination et tri par colonnes
- **Logs d'activité** — consulter les actions enregistrées (connexions, lancement d'apps)

---

## Technologies

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite, React Router v6, CSS vanilla |
| Backend | Node.js + Express, JWT, Bcrypt |
| OAuth | Passport.js (Google, GitHub) — optionnel |
| Upload | Multer (avatars) |
| Base de données | PostgreSQL 16 (driver `pg` natif) |
| Infrastructure | Docker + Docker Compose |
| Production | Nginx (sert le build statique Vite) |
| Tests | Jest (services backend), Vitest + Testing Library (frontend) |

---

## Routes frontend

`[auth]` = connexion requise.
`[admin]` = rôle admin requis.

### Publiques

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Connexion |
| `/register` | Register | Création de compte |
| `/oauth/callback` | OAuthCallback | Retour OAuth Google / GitHub |

### Utilisateur connecté `[auth]`

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Accueil — favoris + récents |
| `/apps` | AllApps | Toutes les apps par catégorie |
| `/search` | Search | Recherche en temps réel |
| `/settings` | Settings | Paramètres + carte profil |
| `/profile` | Profile | Modifier profil et mot de passe |
| `/viewer/:id` | AppViewer | Ouvrir une app (iframe ou externe) |

### Administration `[admin]`

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminBoard | Tableau de bord admin |
| `/admin/apps` | AdminApps | Gérer les applications |
| `/admin/categories` | AdminCategories | Gérer les catégories |
| `/admin/users` | AdminUsers | Gérer les utilisateurs |
| `/admin/logs` | AdminLogs | Consulter les logs d'activité |

---

## Routes API

Toutes les routes sont préfixées par `/api`.
`[auth]` = header `Authorization: Bearer <token>` obligatoire.
`[admin]` = rôle admin requis.
Le token JWT est retourné à la connexion et stocké côté client dans `localStorage` (clé : `mjqbe_token`). Il expire après **7 jours**.

### Auth — public

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter — retourne un JWT |
| POST | `/auth/logout` | Déconnexion (stateless) |
| GET | `/auth/me` | Profil de l'utilisateur connecté `[auth]` |
| GET | `/auth/google` | Connexion via Google |
| GET | `/auth/google/callback` | Callback OAuth Google |
| GET | `/auth/github` | Connexion via GitHub |
| GET | `/auth/github/callback` | Callback OAuth GitHub |

### Applications `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/apps` | Lister les apps |
| GET | `/apps/:id` | Détail d'une app |
| POST | `/apps` | Créer une app `[admin]` |
| PUT | `/apps/:id` | Modifier une app `[admin]` |
| DELETE | `/apps/:id` | Supprimer une app `[admin]` |

### Catégories `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/categories` | Lister les catégories |
| POST | `/categories` | Créer une catégorie `[admin]` |
| PUT | `/categories/:id` | Modifier une catégorie `[admin]` |
| DELETE | `/categories/:id` | Supprimer une catégorie `[admin]` |

### Paramètres `[auth]`

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

### Favoris `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/favorites` | Lister ses favoris |
| POST | `/favorites/:appId` | Ajouter un favori |
| DELETE | `/favorites/:appId` | Retirer un favori |

### Profil utilisateur `[auth]`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/profile` | Récupérer son profil |
| PUT | `/profile` | Modifier pseudo / email |
| PUT | `/users/password` | Changer son mot de passe |
| POST | `/users/avatar` | Uploader un avatar (multipart/form-data) |
| DELETE | `/users/avatar` | Supprimer son avatar |

### Administration `[admin]`

#### Applications

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/apps` | Créer une application |
| PUT | `/apps/:id` | Modifier une application |
| DELETE | `/apps/:id` | Supprimer une application |

#### Catégories

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/categories` | Créer une catégorie |
| PUT | `/categories/:id` | Modifier une catégorie |
| DELETE | `/categories/:id` | Supprimer une catégorie |

#### Utilisateurs

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/users?search=&page=&limit=` | Lister les utilisateurs (pagination + recherche) |
| POST | `/admin/users` | Créer un utilisateur |
| PUT | `/admin/users/:id` | Modifier un utilisateur |
| PUT | `/admin/users/:id/role` | Changer le rôle d'un utilisateur |
| DELETE | `/admin/users/:id` | Supprimer un utilisateur |

#### Logs

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/logs` | Consulter les logs d'activité |

---

## Apps standalone

Des mini-applications indépendantes, sans lien avec le serveur MJQbe. Chaque app est un dossier autonome dans `apps/`.

| App | Chemin | Description |
|-----|--------|-------------|
| Tasks | [`apps/tasks/index.html`](apps/tasks/index.html) | Gestionnaire de tâches — ajout, complétion, suppression, filtre. Données en `localStorage`. |

Ouvrir directement dans un navigateur ou servir via n'importe quel serveur statique.

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
└── utils/           # handle() — wrapper async / gestion d'erreurs
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
│   ├── AllApps/     # Toutes les apps par catégorie
│   ├── Search/      # Recherche en temps réel
│   ├── AppViewer/   # Iframe ou redirection externe
│   ├── Settings/    # Paramètres + carte profil
│   ├── Profile/     # Modification du profil et du mot de passe
│   ├── Admin/       # Tableau de bord admin (Apps, Catégories, Utilisateurs, Logs)
│   ├── Auth/        # Login / Register / OAuth
│   └── NotFound/    # Page 404
└── i18n/            # Traductions : fr.js / en.js
```

### Infrastructure Docker

```
[Navigateur]
     │
     ├── :80   → [Nginx]   → build Vite statique (prod)
     │   :5173 → [Vite]    → serveur de dev (dev)
     │
     └── :5000 → [Express / Backend]
                      │
               [db_network — isolé]
                      │
               [PostgreSQL]
```

Deux réseaux Docker :
- `app_network` — communication frontend ↔ backend
- `db_network` — communication backend ↔ base de données (isolé)

### Modèle de données

| Table | Contenu |
|-------|---------|
| `users` | Comptes utilisateurs (UUID, username, password_hash, role, email, avatar) |
| `settings` | Préférences par utilisateur (theme, mode, layout, icon_size, selected_apps) |
| `apps` | Applications référencées (name, icon, url, category_id, mode, is_external) |
| `categories` | Catégories d'apps par mode TV ou Desktop |
| `favorites` | Association user ↔ app |
| `logs` | Historique d'actions (login, app_launch) |
| `oauth_accounts` | Comptes OAuth liés (provider + provider_id) |
