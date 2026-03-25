# Specs techniques — MJQbe WEB

> Référence technique complète du projet. Ce fichier est la source de vérité pour l'agent IA.
> Il remplace et enrichit `claude.md` et `agent.md` à la racine.

---

## 1. Présentation

**MJQbe WEB** est une application web hub permettant d'accéder à différentes applications en ligne (streaming, outils, apps) via une interface unifiée. Deux modes : **MJ TV** (consommation de contenu) et **MJ Desktop** (productivité).

Catégories d'utilisateurs :
- **user** : accès en lecture au hub, personnalisation de son profil et de ses favoris
- **admin** : CRUD complet sur apps, catégories et utilisateurs

---

## 2. Stack technique (ne pas dévier sans validation)

| Couche | Technologie |
|--------|-------------|
| Frontend | React + **Vite** |
| Routing | React Router |
| State | Context API |
| Style | **CSS vanilla** (pas Tailwind, pas CSS-in-JS) |
| Linting | ESLint |
| Backend | Node.js + Express |
| Auth | JWT + Bcrypt |
| OAuth | Passport.js (passport-google-oauth20, passport-github2) |
| Upload | Multer (sprint 8) |
| Dev server | Nodemon |
| Base de données | PostgreSQL (driver `pg` natif) |
| Conteneurisation | Docker + Docker Compose |
| Serveur static | Nginx (prod frontend) |

---

## 3. Conventions de code

### Nommage
- Composants React : `PascalCase` (`AppCard.jsx`, `Sidebar.jsx`)
- Fonctions et variables JS : `camelCase`
- Fichiers non-composants : `kebab-case` (`auth-middleware.js`, `log-service.js`)
- Variables d'environnement : `SCREAMING_SNAKE_CASE`

### React
- Composants fonctionnels uniquement (pas de classes)
- Un composant = un fichier
- Hooks customs dans `src/hooks/`
- Pas de logique métier dans les composants — déléguer aux hooks ou au contexte
- JSX + CSS colocalisés dans un dossier dédié (`AppCard/AppCard.jsx` + `AppCard/AppCard.css`)

### Express (Clean Architecture obligatoire)
```
repositories → services → controllers → routes
```
- Une ressource = un fichier dans `/routes`
- La logique métier est dans `/services`, pas dans les controllers ni les routes
- Les requêtes SQL sont dans `/repositories`
- Les controllers ne font qu'appeler les services et répondre
- Tout middleware d'auth s'applique au niveau du router

### CSS
- Un fichier CSS par composant, colocalisé
- Variables CSS dans `:root` pour le thème
- Pas de styles inline sauf cas exceptionnel justifié
- Thèmes via `[data-theme="xxx"]` sur `document.documentElement`

---

## 4. Modèle de données

### Table `users`
```sql
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',   -- vide pour comptes OAuth
  role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email         VARCHAR(255) UNIQUE,         -- nullable, ajouté sprint 8
  avatar        TEXT                          -- chemin fichier upload, ajouté sprint 8
);
```

### Table `categories`
```sql
CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('TV', 'Desktop'))
);
```

### Table `apps`
```sql
CREATE TABLE IF NOT EXISTS apps (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  icon        TEXT,
  url         TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  mode        VARCHAR(20) NOT NULL CHECK (mode IN ('TV', 'Desktop')),
  is_external BOOLEAN NOT NULL DEFAULT FALSE
);
```

### Table `settings`
```sql
CREATE TABLE IF NOT EXISTS settings (
  id            SERIAL PRIMARY KEY,
  user_id       UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme         VARCHAR(20) NOT NULL DEFAULT 'dark',
  mode          VARCHAR(20) NOT NULL DEFAULT 'TV',
  layout        VARCHAR(20) NOT NULL DEFAULT 'grid',
  icon_size     JSONB NOT NULL DEFAULT '{"TV":"medium","Desktop":"medium"}',
  selected_apps JSONB
);
-- Sprint 8 : theme accepte 10 valeurs (retirer CHECK ou l'élargir)
```

### Table `favorites`
```sql
CREATE TABLE IF NOT EXISTS favorites (
  id      SERIAL PRIMARY KEY,
  user_id UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id  INTEGER NOT NULL REFERENCES apps(id)  ON DELETE CASCADE,
  UNIQUE (user_id, app_id)
);
```

### Table `logs`
```sql
CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  user_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
  action     VARCHAR(50) NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Actions enregistrées : 'login', 'app_launch'
```

### Table `oauth_accounts`
```sql
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id          SERIAL PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(20) NOT NULL,
  provider_id VARCHAR(200) NOT NULL,
  UNIQUE (provider, provider_id)
);
```

---

## 5. Routes API complètes

### Auth (public)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me                         (requireAuth)
GET  /api/auth/google                     (si GOOGLE_CLIENT_ID présent)
GET  /api/auth/google/callback
GET  /api/auth/github                     (si GITHUB_CLIENT_ID présent)
GET  /api/auth/github/callback
GET  /api/auth/google/reauth              (sprint 8 — vérif identité)
GET  /api/auth/google/reauth-callback
GET  /api/auth/github/reauth              (sprint 8 — vérif identité)
GET  /api/auth/github/reauth-callback
```

### Apps (requireAuth)
```
GET    /api/apps
GET    /api/apps/:id
POST   /api/apps              (requireRole('admin'))
PUT    /api/apps/:id          (requireRole('admin'))
DELETE /api/apps/:id          (requireRole('admin'))
```

### Categories (requireAuth)
```
GET    /api/categories
POST   /api/categories        (requireRole('admin'))
PUT    /api/categories/:id    (requireRole('admin'))
DELETE /api/categories/:id    (requireRole('admin'))
```

### Settings (requireAuth)
```
GET  /api/settings
PUT  /api/settings
```

### Favorites (requireAuth)
```
GET    /api/favorites
POST   /api/favorites/:appId
DELETE /api/favorites/:appId
```

### Logs (requireAuth + requireRole('admin'))
```
GET /api/logs
```

### Users / Profil — sprint 8 (requireAuth)
```
GET    /api/users/profile
PUT    /api/users/profile        (pseudo, email — vérif identité requise)
PUT    /api/users/password       (vérif ancien mot de passe)
POST   /api/users/avatar         (multipart/form-data)
DELETE /api/users/avatar
```

### Admin Users — sprint 9 (requireAuth + requireRole('admin'))
```
GET    /api/admin/users?search=&page=&limit=
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

---

## 6. Variables d'environnement

### Backend `.env`
```
PORT=5000
DATABASE_URL=postgresql://user:password@db:5432/mjqbe
JWT_SECRET=change_me_in_production
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# OAuth (optionnel — laisser vide pour désactiver)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Comportements clés

### Ouverture des apps
```js
// is_external === true  → window.open(url, '_blank')
// is_external === false → afficher dans un <iframe>
```

### Titre dynamique sidebar
```js
// mode === 'TV'      → "MJ TV"
// mode === 'Desktop' → "MJ Desktop"
```

### JWT
```
Header : Authorization: Bearer <token>
Expiration : 7j (classique), 7j (OAuth)
Stockage : localStorage (clé : mjqbe_token)
```

### Rôles
```
user  → lecture hub, favoris, settings, profil
admin → tout + CRUD apps/catégories/users, lecture logs
```

### OAuth
- Réservé aux `user` uniquement — les comptes `admin` sont bloqués dans le callback avec redirection `?error=oauth_admin`
- Routes conditionnelles : enregistrées seulement si les vars d'env correspondantes sont définies
- Création automatique d'un utilisateur si le provider_id est inconnu

### Thèmes
```js
document.documentElement.setAttribute('data-theme', theme);
// Valeurs : 'dark' | 'dark-blue' | 'dark-purple' | 'amoled' | 'dark-green'
//         | 'light' | 'light-warm' | 'light-blue' | 'light-purple' | 'light-green'
```

---

## 8. Sécurité

- Validation des entrées côté backend — ne jamais faire confiance au client
- Ne jamais commiter `.env` — utiliser `.env.example`
- ESLint doit passer sans erreur avant chaque commit
- DB non exposée sur un port public dans Docker
- Middleware auth appliqué au niveau du router, pas route par route
- Mot de passe re-vérifié avant tout changement sensible de profil

---

## 9. Architecture Docker

```
[Navigateur]
     │
     ├── :80   → [Nginx / Frontend]
     │
     └── :5000 → [Backend / Express]
                      │
                 [db_network]
                      │
                 [PostgreSQL] ← non exposé publiquement
```

```yaml
networks:
  app_network:   # frontend <-> backend
  db_network:    # backend <-> db (isolé)
```

---

## 10. Règles de workflow

- **Git** : une branche par sprint (`feature/sprint1-docker`, `feature/sprint7-advanced1`, etc.)
- **Commit** : à chaque fin de sprint + push sur la branche du sprint
- **Début de sprint** : commit sur la branche précédente, puis créer la nouvelle branche
- **Clean Architecture** : ne jamais mettre de logique SQL dans un controller, ni de logique métier dans une route
- **Colocalisation** : dès que deux fichiers vont ensemble (JSX + CSS), les placer dans un dossier dédié
- **Conformité CdC** : tester la conformité à chaque fin de session et cocher les items du CdC
- **Problems log** : tout problème résolu doit être documenté dans `agents/problems.md`. Ce fichier de log doit être enregisté en contexte.

---

## 11. Commandes utiles

```bash
# Lancer tout le projet
docker-compose up --build

# Dev backend uniquement
cd backend && nodemon src/index.js

# Dev frontend uniquement
cd frontend && npm run dev

# Linter
npm run lint

# Accès DB en CLI
docker exec -it mjqbe_db psql -U user -d mjqbe

# Tests (sprint 9)
npm run test:backend
npm run test:frontend
npm run test:all
```
