# MJQbe WEB

Hub web unifié pour accéder à vos applications en ligne (streaming, productivité, outils) depuis une interface unique.
Deux modes : **MJ TV** (grand écran, icônes larges) et **MJ Desktop** (compact, orienté productivité).

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite, React Router v6, CSS vanilla |
| Backend | Node.js + Express, JWT, Bcrypt |
| Base de données | PostgreSQL 16 |
| Infra | Docker + Docker Compose, Nginx (prod) |

---

## Lancer le projet

### Développement

```bash
# Copier les fichiers d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Lancer tous les services
docker-compose up --build
```

- Frontend : http://localhost:5173
- Backend  : http://localhost:5000
- DB       : interne uniquement (non exposée)

### Production

```bash
# Définir l'URL de l'API publique
export VITE_API_URL=https://votre-domaine.com/api

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

- Frontend servi par Nginx sur le port **80**

---

## Créer un compte admin

Au premier lancement, créez un compte via l'interface Register, puis passez le rôle en `admin` directement en base :

```bash
docker exec -it mjqbe_db psql -U user -d mjqbe \
  -c "UPDATE users SET role = 'admin' WHERE username = 'votre_username';"
```

Les admins peuvent créer, modifier et supprimer des applications et catégories via l'API.

---

## API REST

Toutes les routes sont préfixées par `/api`.

### Auth (public)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter, retourne un JWT |
| POST | `/auth/logout` | Déconnexion (stateless) |
| GET  | `/auth/me` | Profil de l'utilisateur connecté |

### Applications (authentifié)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | `/apps?mode=TV\|Desktop` | Lister les apps par mode |
| GET    | `/apps/:id` | Détail d'une app |
| POST   | `/apps` | Créer une app *(admin)* |
| PUT    | `/apps/:id` | Modifier une app *(admin)* |
| DELETE | `/apps/:id` | Supprimer une app *(admin)* |

### Catégories (authentifié)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | `/categories?mode=TV\|Desktop` | Lister les catégories |
| POST   | `/categories` | Créer une catégorie *(admin)* |
| PUT    | `/categories/:id` | Modifier une catégorie *(admin)* |
| DELETE | `/categories/:id` | Supprimer une catégorie *(admin)* |

### Paramètres (authentifié)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/settings` | Récupérer les paramètres de l'utilisateur |
| PUT | `/settings` | Mettre à jour les paramètres |

**Corps PUT /settings (partiel accepté) :**
```json
{
  "theme": "dark | light",
  "mode": "TV | Desktop",
  "layout": "grid | list",
  "icon_size": { "TV": "small | medium | large", "Desktop": "small | medium | large" }
}
```

### Authentification

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer <token>
```

---

## Architecture

```
backend/src/
├── repositories/   # Accès DB (SQL uniquement)
├── services/       # Logique métier + validation
├── controllers/    # Handlers HTTP (délèguent aux services)
├── routes/         # Définition des routes + middlewares
├── middlewares/    # auth-middleware, role-middleware
└── utils/          # handle() wrapper async/erreurs

frontend/src/
├── api/            # Couche fetch centralisée (apiFetch)
├── context/        # 6 providers : Auth, Theme, Mode, Lang, ClockFormat, IconSize, Layout
├── hooks/          # Hooks métier (useSettings, useApps, useOpenApp…)
├── components/     # Sidebar, Layout, AppGrid, AppCard
└── pages/          # Home, AllApps, Search, Settings, AppViewer, NotFound
```

---

## Variables d'environnement

### Backend (`backend/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://user:password@db:5432/mjqbe
JWT_SECRET=change_me_in_production
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```
