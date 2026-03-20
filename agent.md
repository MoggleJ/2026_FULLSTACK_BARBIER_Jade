# agent.md — MJQbe WEB

---

## 1. Instructions pour l'agent IA (Cursor / Copilot / Claude Code)

### Rôle
Tu es un assistant de développement fullstack intégré au projet **MJQbe WEB**. Tu aides à concevoir, coder, déboguer et documenter cette application web hub permettant d'accéder à des applications en ligne via une interface unifiée.

### Stack imposée — ne pas dévier sans validation

| Couche | Technologie |
|--------|-------------|
| Frontend | React + **Vite** |
| Routing | React Router |
| State | Context API (ou Redux si complexité justifiée) |
| Style | CSS vanilla |
| Linting | ESLint |
| Backend | Node.js + Express |
| Auth | JWT + Bcrypt |
| Dev server | Nodemon |
| Base de données | PostgreSQL |
| ORM / Driver | `pg` natif ou Prisma (rester cohérent dans tout le projet) |
| Conteneurisation | Docker + Docker Compose |
| Serveur static | Nginx (prod frontend) |

### Règles de comportement

- Ne pas ajouter de bibliothèques non listées sans en discuter d'abord
- Ne jamais hardcoder de secrets — toujours passer par les variables d'environnement (`.env`)
- Ne jamais commiter `.env` — utiliser `.env.example` comme référence
- ESLint doit passer sans erreur avant chaque commit
- Ne pas implémenter les fonctionnalités des releases avancées tant que la release de base n'est pas validée
- Ne pas stocker le JWT en `localStorage` sans évaluation de sécurité — préférer `httpOnly cookie`
- Ne jamais exposer la DB sur un port public dans Docker
- Il faut que le projet suive la Clean Architecture
- Toujours Tester la conformité avec les attendus dans le cahier des charges et le contrat de projet a chaque appel
- Des que deux elements, (ex Jsx et css) vont ensemble, les placer dans un répertoire distinct.

### Conventions de code

**Nommage**
- Composants React : `PascalCase` (`AppCard.jsx`, `Sidebar.jsx`)
- Fonctions et variables JS : `camelCase`
- Fichiers non-composants : `kebab-case` (`auth-middleware.js`)
- Variables d'environnement : `SCREAMING_SNAKE_CASE`

**React**
- Composants fonctionnels uniquement (pas de classes)
- Un composant = un fichier
- Les hooks customs sont dans `src/hooks/`
- Pas de logique métier dans les composants — déléguer aux hooks ou au contexte

**Express**
- Une ressource = un fichier dans `/routes`
- La logique est dans `/controllers`, pas dans les routes
- Tout middleware d'auth s'applique au niveau du router

**CSS**
- Un fichier CSS par composant (`AppCard.css` à côté de `AppCard.jsx`)
- Variables CSS dans `:root` pour le thème (couleurs, tailles)
- Pas de styles inline sauf cas exceptionnel justifié

### Comportements clés

```js
// Ouverture des apps
// is_external === true  → window.open(url, '_blank')
// is_external === false → afficher dans un <iframe>

// Titre dynamique sidebar
// mode === 'TV'      → "MJ TV"
// mode === 'Desktop' → "MJ Desktop"

// Auth JWT
// Header : Authorization: Bearer <token>
// Middleware vérifie et décode avant chaque route protégée
```

### Périmètre actuel (release de base — Sprints 1 à 6)

✅ À implémenter :
- Authentification Register / Login (JWT + Bcrypt)
- Sidebar fixe + switch TV / Desktop
- Grille d'apps dynamique par mode
- Recherche en temps réel
- Ouverture Iframe / nouvel onglet
- Page Settings (thème, layout, icon_size)
- Dockerisation complète

❌ Hors périmètre pour l'instant :
- Favoris utilisateur
- OAuth 2.0 (Google / GitHub)
- Table Logs
- Thèmes personnalisés avancés
- Lazy loading / cache assets

---

## 2. Rôles et responsabilités de l'équipe

| Rôle | Responsabilités |
|------|----------------|
| **Lead Dev / Jade** | Architecture globale, revue de code, décisions techniques, merge des PRs |
| **Dev Frontend** | Composants React, routing, CSS, intégration des données API |
| **Dev Backend** | Routes Express, controllers, middleware JWT, connexion DB |
| **Dev DevOps** | Docker Compose, Dockerfiles, Nginx, déploiement |
| **Admin BDD** | Schéma SQL, migrations, init.sql, optimisations requêtes |

### Workflow Git

```
main              ← production stable
└── dev           ← intégration sprint en cours
    ├── feature/sprint1-docker
    ├── feature/sprint2-auth
    ├── feature/sprint3-layout
    └── ...
```

- Une **feature branch par sprint** (ou par fonctionnalité si le sprint est large)
- Les PRs sont relues avant merge sur `dev`
- Merge sur `main` uniquement à la fin d'un sprint validé
- Les issues GitHub tracent chaque tâche des sprints

### Sprints et ownership

| Sprint | Thème | Owner principal |
|--------|-------|----------------|
| 1 | Fondations & Docker | DevOps + Lead |
| 2 | Auth & Sécurité | Backend |
| 3 | Layout & Sidebar | Frontend |
| 4 | Apps & Modes | Frontend + Backend |
| 5 | Settings & UX | Frontend |
| 6 | Polissage & Nginx | DevOps + Frontend |
| 7 *(avancée 1)* | Favoris, OAuth, Logs | Backend + Frontend |
| 8 *(avancée 2)* | Thèmes & Optimisations | Frontend |

---

## 3. Documentation technique des services

### Service Frontend (`/frontend`)

- **Technologie** : React + Vite
- **Port dev** : `5173`
- **Port prod** : `80` (servi par Nginx)
- **Dockerfile** : build multi-stage — Vite build → Nginx static serving
- **Variables d'env** :
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

---

### Service Backend (`/backend`)

- **Technologie** : Node.js + Express
- **Port** : `5000`
- **Dockerfile** : image Node, nodemon en dev, node en prod
- **Variables d'env** :
  ```
  PORT=5000
  DATABASE_URL=postgresql://user:password@db:5432/mjqbe
  JWT_SECRET=ton_secret_jwt
  BCRYPT_ROUNDS=10
  CORS_ORIGIN=http://localhost:5173
  ```
 
- **Routes exposées** :
  ```
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/apps
  POST   /api/apps            (admin)
  PUT    /api/apps/:id        (admin)
  DELETE /api/apps/:id        (admin)
  GET    /api/categories
  POST   /api/categories      (admin)
  GET    /api/settings
  PUT    /api/settings
  ```

---

### Service Base de données (`/db`)

- **Technologie** : PostgreSQL
- **Port** : `5432` (interne Docker uniquement — non exposé publiquement)
- **Réseau** : `db_network` (accessible uniquement par le backend)
- **Init** : `db/init.sql` exécuté au premier démarrage du container
- **Persistance** : Volume Docker `pgdata`
- **Tables (release de base)** :

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL
);

CREATE TABLE apps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon TEXT,
  url TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  mode VARCHAR(20) NOT NULL,
  is_external BOOLEAN DEFAULT FALSE
);

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  theme VARCHAR(20) DEFAULT 'dark',
  mode VARCHAR(20) DEFAULT 'TV',
  layout VARCHAR(20) DEFAULT 'grid',
  icon_size VARCHAR(20) DEFAULT 'medium',
  selected_apps JSONB
);
```

> **Release avancée 1** : ajouter tables `logs` et `favorites`.

---

### Topologie réseau Docker

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

### Commandes utiles

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

# Rebuild un seul service
docker-compose up --build backend
```
