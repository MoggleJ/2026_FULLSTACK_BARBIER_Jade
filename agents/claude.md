# claude.md — Mémoire projet pour Claude Code

## Projet : MJQbe WEB
Application web hub permettant d'accéder à différentes applications en ligne (streaming, outils) via une interface unifiée. Deux modes : **MJ TV** (consommation) et **MJ Desktop** (productivité).

> Ce fichier est lu automatiquement par Claude Code au démarrage. Il contient le contexte, les conventions et les règles du projet.

---

## Stack

- **Frontend** : React + Vite, React Router, CSS, ESLint
- **Backend** : Node.js + Express, JWT, Bcrypt, Nodemon
- **Base de données** : PostgreSQL (driver `pg` ou Prisma)
- **Infra** : Docker, Docker Compose, Nginx (prod)

## Conventions de code

### Nommage
- Composants React : `PascalCase` (`AppCard.jsx`, `Sidebar.jsx`)
- Fonctions et variables JS : `camelCase`
- Fichiers non-composants : `kebab-case` (`auth-middleware.js`)
- Variables d'environnement : `SCREAMING_SNAKE_CASE`

### React
- Composants fonctionnels uniquement (pas de classes)
- Un composant = un fichier
- Les hooks customs sont dans `src/hooks/`
- Pas de logique métier dans les composants — déléguer aux hooks ou au contexte

### Express
- Une route = un fichier dans `/routes`
- La logique est dans `/controllers`, pas dans les routes
- Tout middleware d'auth s'applique au niveau du router, pas de chaque route individuellement

### CSS
- Un fichier CSS par composant (`AppCard.css` à côté de `AppCard.jsx`)
- Variables CSS dans `:root` pour le thème (couleurs, tailles)
- Pas de styles inline sauf cas exceptionnel justifié

---

## Variables d'environnement attendues

### Backend (`.env`)
```
PORT=5000
DATABASE_URL=postgresql://user:password@db:5432/mjqbe
JWT_SECRET=ton_secret_jwt
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Routes API (release de base)

### Auth (public)
```
POST /api/auth/register
POST /api/auth/login
```

### Apps (authentifié)
```
GET    /api/apps              # Liste selon mode (TV/Desktop)
GET    /api/apps/:id
POST   /api/apps              # Admin uniquement
PUT    /api/apps/:id          # Admin uniquement
DELETE /api/apps/:id          # Admin uniquement
```

### Categories (authentifié)
```
GET    /api/categories
POST   /api/categories        # Admin uniquement
PUT    /api/categories/:id    # Admin uniquement
DELETE /api/categories/:id    # Admin uniquement
```

### Settings (authentifié)
```
GET  /api/settings            # Récupère les settings de l'utilisateur connecté
PUT  /api/settings            # Met à jour les settings
```

---

## Comportements clés à respecter

### Ouverture des apps
```js
// is_external === true  → window.open(url, '_blank')
// is_external === false → afficher dans un <iframe>
```

### Titre dynamique de la sidebar
```js
// mode === 'TV'      → titre = "MJ TV"
// mode === 'Desktop' → titre = "MJ Desktop"
```

### Authentification JWT
- Le token est stocké côté client (évaluer `httpOnly cookie` vs `memory`)
- Chaque requête protégée envoie le token dans le header : `Authorization: Bearer <token>`
- Le middleware backend vérifie et décode le token avant chaque route protégée

### Rôles
- `user` : lecture seule (apps, catégories, settings perso)
- `admin` : CRUD complet sur apps, catégories, utilisateurs

---

## Docker — rappel de la topologie réseau

```yaml
# Réseau interne : backend ↔ db uniquement
# Le frontend et le backend sont exposés publiquement
# La DB n'est JAMAIS exposée sur un port public
networks:
  app_network:    # frontend <-> backend
  db_network:     # backend <-> db (isolé)
```

---

## Périmètre actuel (release de base — Sprints 1 à 6)

✅ À implémenter maintenant :
- Authentification Register/Login (JWT + Bcrypt)
- Sidebar fixe + switch TV/Desktop
- Grille d'apps dynamique par mode
- Recherche en temps réel
- Ouverture Iframe / nouvel onglet
- Page Settings (thème, layout, icon_size)
- Dockerisation complète

❌ Hors périmètre pour l'instant (releases avancées) :
- Favoris utilisateur
- OAuth 2.0 (Google / GitHub)
- Table Logs
- Thèmes personnalisés avancés
- Lazy loading / cache assets

---

## Commandes utiles

```bash
# Lancer tout le projet
docker-compose up --build

# Lancer uniquement le backend en dev
cd backend && nodemon src/index.js

# Lancer uniquement le frontend en dev
cd frontend && npm run dev

# Linter
npm run lint

# Accéder à la DB en CLI
docker exec -it mjqbe_db psql -U user -d mjqbe
```

---

## À ne pas oublier
- Toujours valider les entrées côté backend (ne jamais faire confiance au client)
- Ne jamais commiter `.env` — utiliser `.env.example` comme référence
- ESLint doit passer sans erreur avant chaque commit
- La DB est initialisée via `db/init.sql` au premier démarrage du container PostgreSQL
- Il faut que le projet suive la Clean Architecture
- Toujours Tester la conformité avec les attendus dans le cahier des charges et le contrat de projet a chaque appel
- Des que deux elements, (ex Jsx et css) vont ensemble, les placer dans un répertoire distinct.
- A chaque fin de sprint X, commit et push sur une branche associée au sprint X.
- A chaque début de sprint X, commit sur la branche X-1 et dev.

