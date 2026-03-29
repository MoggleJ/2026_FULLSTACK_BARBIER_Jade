# Plan de sprints — MJQbe WEB

> Plan complet du projet, sprints 1 à 9.
> Release de base : sprints 1–6. Release avancée 1 : sprint 7. Release avancée 2 : sprint 8. Sprint final : sprint 9.

---

## 🏃 Sprint 1 ✅ — Fondations & Docker
*Mettre en place l'environnement de développement et la communication de base.*

- [x] Configuration du dépôt Git et de l'arborescence (`/frontend`, `/backend`, `/db`)
- [x] Création du `docker-compose.yml` (services : Postgres, Node, React)
- [x] Initialisation de la base de données avec le script SQL (`init.sql`)
- [x] Configuration du backend Express (connexion DB via `pg`)
- [x] Test de communication : le frontend affiche un message provenant de l'API

---

## 🏃 Sprint 2 ✅ — Authentification & Sécurité
*Sécuriser l'accès et permettre la gestion des utilisateurs.*

- [x] Hashage des mots de passe avec **Bcrypt**
- [x] Routes `POST /api/auth/register` et `POST /api/auth/login`
- [x] Système **JWT** : génération à la connexion, middleware de validation
- [x] Store React (Context API) pour gérer l'état utilisateur
- [x] Politique **CORS** configurée sur Express pour Docker

---

## 🏃 Sprint 3 ✅ — Structure de l'Interface (Layout)
*Construire la coque de MJQbe WEB.*

- [x] **Sidebar fixe** à gauche, responsive
- [x] **Titre dynamique** : "MJ TV" / "MJ Desktop" selon le mode
- [x] Routage React Router : Home, Search, Settings
- [x] Switch de mode (TV / Desktop) dans la sidebar
- [x] Système de thème Clair/Sombre (CSS variables)

---

## 🏃 Sprint 4 ✅ — Gestion des Applications & Modes
*Rendre le Hub fonctionnel avec des données réelles.*

- [x] CRUD API `Apps` (admin)
- [x] Grille d'applications dynamique selon le mode
- [x] Logique d'ouverture : `is_external` → iframe ou nouvel onglet
- [x] Composant `AppCard` (icône, nom, catégorie)
- [x] Barre de recherche filtrant les apps en temps réel

---

## 🏃 Sprint 5 ✅ — Personnalisation & UX
*Finaliser les fonctionnalités de la release de base.*

- [x] Page **Settings** : thème, taille des icônes, layout
- [x] Persistance des réglages en DB (table `settings`)
- [x] Navigation au clavier (flèches/entrée) pour le Mode TV

---

## 🏃 Sprint 6 ✅ — Polissage & Nginx
*Préparer le projet pour la production.*

- [x] Dockerfile frontend multi-stage (Vite build → Nginx)
- [x] Gestion des erreurs : pages 404, erreurs de chargement d'iframe
- [x] Tests de réactivité (responsive tablette + mobile)
- [x] Nettoyage du code, documentation API (README)

---

## 🏃 Sprint 7 ✅ — Release avancée 1 : Favoris, OAuth & Logs
*Enrichir l'application avec les fonctionnalités avancées de la release 1.*

- [x] Système de **Favoris** : ajouter/supprimer une app (table `favorites`)
- [x] **OAuth 2.0** : connexion via Google ou GitHub (users standard uniquement — les admins sont bloqués avec erreur `oauth_admin`)
- [x] Système de **Logs** : enregistrement des connexions (`login`) et lancement d'apps (`app_launch`) (table `logs`)
- [x] Routes logs accessibles aux admins uniquement (`GET /api/logs`)
- [x] Variables d'env OAuth dans `docker-compose.yml` + `.env.example`

---

## 🏃 Sprint 8 ✅ — Release avancée 2 : Thèmes & Profils
*Personnalisation poussée de l'interface et du profil utilisateur.*

### Thèmes (14 thèmes — 10 requis + 4 ajoutés sur demande utilisateur)
- [x] 7 thèmes sombres : `dark`, `dark-blue`, `dark-purple`, `amoled`, `dark-green`, `dark-red`, `dark-contrast`
- [x] 7 thèmes clairs : `light`, `light-warm`, `light-blue`, `light-purple`, `light-green`, `light-red`, `light-contrast`
- [x] CSS variables par thème via `[data-theme="xxx"]` dans `index.css`
- [x] Application via `document.documentElement.setAttribute('data-theme', theme)`
- [x] Sélection via swatches visuels (grille de pastilles) dans la page Settings — triés dark d'abord, puis light
- [x] Persistance en DB (colonne `settings.theme`) — contrainte CHECK retirée

### Profil utilisateur
- [x] Colonnes `email` (VARCHAR nullable unique), `avatar` (TEXT nullable), `created_at` ajoutées à la table `users`
- [x] Upload avatar : `multer`, max 5MB, formats jpg/png/webp, stocké dans `/backend/uploads/avatars/`
- [x] Volume Docker `uploads:/app/uploads` + route statique Express pour servir les fichiers
- [x] `GET /api/users/profile` — récupère le profil complet
- [x] `PUT /api/users/profile` — modifie pseudo et/ou email (vérification d'identité obligatoire)
- [x] `PUT /api/users/password` — change le mot de passe (vérification de l'ancien mot de passe)
- [x] `POST /api/users/avatar` — upload multipart/form-data
- [x] `DELETE /api/users/avatar` — supprime et remet à null
- [x] **Vérification d'identité** pour comptes classiques : re-saisie du mot de passe actuel
- [x] **Vérification d'identité** pour comptes OAuth : re-auth Google/GitHub (`/api/auth/google/reauth`, `/api/auth/github/reauth`)
- [x] Nouvelle page frontend `/profile` avec sections : avatar, pseudo/email, mot de passe / compte OAuth
- ~~[ ] Lien "Profil" ajouté dans la sidebar~~ — **supprimé sur demande** : profil accessible via carte dans Settings (voir specs §7)

### Performance
- [x] `React.lazy` + `Suspense` sur toutes les pages dans `App.jsx`
- [x] `loading="lazy"` sur les `<img>` dans `AppCard.jsx`
- [x] Skeleton CSS pendant le chargement des icônes d'apps

---

## 🏃 Sprint 9 — Interface Admin enrichie & Tests
*Finaliser l'expérience admin et assurer la qualité du code.*

### Interface admin enrichie
- [x] Barre de recherche sur la liste des utilisateurs (filtrage côté serveur)
- [x] Informations complètes sur les utilisateurs : date de création, dernière connexion (from logs), nombre de favoris
- [x] Tri par colonnes (username, rôle, date de création, dernière connexion, favoris)
- [x] Pagination (page + limit) sur les listes admin
- [x] `GET /api/admin/users?search=&page=&limit=` — liste paginée + filtrée
- [x] `PUT /api/admin/users/:id/role` — changer le rôle d'un utilisateur
- [x] `DELETE /api/admin/users/:id` — supprimer un utilisateur

### Tests
- [x] Dossier `/tests/backend/` — tests **Jest** sur services
  - Auth : register, login, JWT
  - Favorites : add, remove, duplicate handling
  - Logs : insertion, graceful failure, pagination
  - Settings : persistance thème (10 valeurs)
- [x] Dossier `/tests/frontend/` — tests **Vitest** + Testing Library
  - Hook : `useAuth`
  - Composants : `AppCard`, `Login`
- [x] Fichier `/tests/results.md` mis à jour après chaque run de tests
- [x] Scripts npm : `test:backend`, `test:frontend`, `test:all`
