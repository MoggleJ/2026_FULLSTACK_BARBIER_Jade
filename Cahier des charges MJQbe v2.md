# Cahier des charges — MJQbe WEB version 2

## 1. Présentation générale du projet
Le projet **MJQbe WEB** consiste à concevoir une application web servant de hub permettant d'accéder à différentes applications en ligne via une interface.

Contrairement à ma version embarquée sur Raspberry Pi, cette version est **web**, accessible depuis un navigateur, sans interaction directe avec le matériel de l'utilisateur.

L'objectif est de proposer des services web (streaming, outils, apps).

---

## 2. Architecture globale
L'application repose sur une architecture web classique en trois couches, **entièrement conteneurisée avec Docker** :

* **Frontend** : React (déployé via un container Nginx)
* **Backend** : Node.js avec Express (API REST isolée)
* **Base de données** : PostgreSQL (avec persistance des données via Volumes Docker)

Je veux utiliser eslint et nodemon.

Le système est conçu pour être scalable et modulaire, permettant l'ajout futur de fonctionnalités sans refonte majeure.

---

## 3. Interface utilisateur (UI/UX)

### 3.1 Structure générale
L'interface est organisée autour d'une **sidebar fixe située à gauche**.

#### Sidebar
* Titre dynamique :
  * **MJ TV** (mode TV)
  * **MJ Desktop** (mode Desktop)

* Menu principal :
  * Home
  * All Apps
  * Search
  * MJ Desktop / MJ TV (switch de mode)

* Bas de la sidebar :
  * Profil *(Release avancée 2)*
  * Settings

### 3.2 Organisation du contenu
Le contenu principal est affiché sous forme de :
* Grilles d'applications
* Cartes avec icônes + noms
* Catégories visuellement séparées

L'interface doit être :
* Responsive (desktop, tablette, mobile)
* Fluide
* Minimaliste
* Optimisée pour souris/clavier uniquement (pas de navigation télécommande)
* **Note technique** : Les applications s'ouvrent soit en **Iframe** (intégration directe), soit en **nouvel onglet** si le site distant bloque l'affichage intégré (ex: Netflix).

---

## 4. Fonctionnalités

### 4.1 Fonctionnalités communes (Release de base)
* Affichage des applications disponibles
* Organisation par catégories
* Recherche d'applications
* Navigation entre modes (TV / Desktop)
* Interface personnalisable (thème)

### 4.2 Mode TV
Le mode TV propose une interface simplifiée orientée consommation de contenu.
Fonctionnalités :
* Accès à des applications web : Netflix, YouTube, Twitch, Crunchyroll, Disney+, Navigateur web.
* Affichage simplifié : icônes larges, catégories visibles.
⚠️ Limitations (version web) : Pas de screen sharing, pas de contrôle matériel, pas de gestion système.

### 4.3 Mode Desktop
Le mode Desktop offre une organisation plus dense et orientée productivité.
Fonctionnalités :
* Accès à des applications web ou outils en ligne.
* Organisation avancée par catégories.
* Interface plus compacte.
⚠️ Limitations (version web) : Pas de terminal, pas de gestion des processus, pas de serveurs locaux, pas d'accès système.

---

## 5. Contraintes techniques

### 5.1 Stack technologique
* **Frontend** : React avec **Vite** (bundler)
* **Backend** : Node.js avec Express
* **Base de données** : PostgreSQL
* **Déploiement** : **Docker & Docker Compose**

### 5.2 Contraintes générales
* Application accessible via navigateur
* Temps de chargement optimisé
* Architecture modulaire (Clean Architecture : repositories → services → controllers → routes)
* API REST entre frontend et backend
* **Network Docker** : Isolation de la DB pour qu'elle ne soit accessible que par le Backend.

---

## 6. Sécurité
* Authentification utilisateur (via **JWT - JSON Web Tokens**)
* Hash des mots de passe (**Bcrypt**)
* Protection des routes API
* Validation des entrées utilisateur
* Gestion des rôles (admin / utilisateur)
* **CORS Policy** : Restriction des accès API au domaine du frontend uniquement.
* **OAuth 2.0** réservé aux utilisateurs standard (rôle `user`) — les admins utilisent uniquement le login classique.
* Vérification d'identité obligatoire avant tout changement sensible du profil.

---

## 7. Modèle de données

### Table Users
* id (UUID)
* username (unique)
* password_hash (vide pour les comptes OAuth)
* role (`user` / `admin`)
* email (nullable, unique) *(Release avancée 2)*
* avatar (chemin fichier upload, nullable) *(Release avancée 2)*

### Table Apps
* id
* name
* icon
* url
* category_id
* mode (TV / Desktop)
* **is_external** (Boolean pour gérer l'ouverture hors-hub)

### Table Categories
* id
* name
* mode

### Table Settings
* id
* user_id
* theme (10 valeurs : `dark`, `dark-blue`, `dark-purple`, `amoled`, `dark-green`, `light`, `light-warm`, `light-blue`, `light-purple`, `light-green`)
* mode (TV/Desktop)
* layout
* icon_size
* selected_apps

### Table Favorites *(Release avancée 1)*
* id
* user_id
* app_id
* UNIQUE (user_id, app_id)

### Table Logs *(Release avancée 1)*
* id
* user_id (nullable)
* action (`login`, `app_launch`)
* metadata (JSONB)
* created_at

### Table OAuth Accounts *(Release avancée 1)*
* id
* user_id
* provider (`google` / `github`)
* provider_id (unique par provider)

---

## 8. Architecture logicielle
Le système est composé de plusieurs modules indépendants :
* Gestion des applications / Catégories / Recherche / Utilisateurs.
* API backend / Interface frontend.
* **Dockerisation** : Chaque module tourne dans son propre container pour faciliter la maintenance.
* **Clean Architecture** obligatoire : repositories → services → controllers → routes.
* **Dossier `agents/`** : Fichiers de spécifications techniques pour l'agent IA (specs.md, sprints.md, themes.md, problems.md).

---

## 9. Limitations de la version WEB
Cette version ne prend pas en charge :
* Gestion du Wi-Fi / Bluetooth / Installation locale.
* Screen sharing / Terminal / Processus système.
* Hébergement de serveurs (Minecraft, DHCP, etc.) / Interaction matérielle.

---

## 10. Évolutions

### Release avancée 1 ✅ (Sprint 7)
* Système de **favoris** : Ajouter/Supprimer une application de ses favoris utilisateur
* Intégration **OAuth 2.0** (connexion via Google ou GitHub — users standard uniquement)
* Système de **Logs** : Enregistrement des connexions et lancements d'apps

### Release avancée 2 (Sprint 8)
* **10 thèmes** : 5 sombres (`dark`, `dark-blue`, `dark-purple`, `amoled`, `dark-green`) + 5 clairs (`light`, `light-warm`, `light-blue`, `light-purple`, `light-green`)
* **Profils personnalisés** : photo de profil (upload), pseudo unique, email, mot de passe, compte OAuth connecté — avec vérification d'identité avant tout changement sensible
* Optimisations de performance : lazy loading pages (React.lazy) + lazy loading icônes apps

### Release avancée 3 (Sprint 9)
* **Interface admin enrichie** : barre de recherche, informations complètes (date création, dernière connexion, nombre de favoris), tri et pagination
* **Tests** : suite de tests backend (Jest) et frontend (Vitest + Testing Library) dans `/tests`

---

## 11. Plan de développement

### 🏃 Sprint 1 ✅ : Fondations & Dockerisation
*Objectif : Mettre en place l'environnement de développement et la communication de base.*

- [x] Configuration du dépôt Git et de l'arborescence (`/frontend`, `/backend`).
- [x] Création du `docker-compose.yml` (Services : Postgres, Node, React).
- [x] Initialisation de la base de données avec le script SQL des tables (`Users`, `Apps`, `Categories`, `Settings`).
- [x] Configuration du Backend Express (Connexion à la DB via `pg`).
- [x] Test de communication : Le Frontend affiche un message provenant de l'API.

---

### 🏃 Sprint 2 ✅ : Authentification & Sécurité
*Objectif : Sécuriser l'accès et permettre la gestion des utilisateurs.*

- [x] Hashage de mot de passe avec **Bcrypt**.
- [x] Routes API `Register` et `Login`.
- [x] Système **JWT** (génération du token et middleware de validation).
- [x] Store React (Context API) pour gérer l'état de l'utilisateur.
- [x] Politiques **CORS** sur Express pour Docker.

---

### 🏃 Sprint 3 ✅ : Structure de l'Interface (Layout)
*Objectif : Construire la coque de MJQbe WEB.*

- [x] **Sidebar fixe** à gauche (Responsive).
- [x] **Titre Dynamique** (MJ TV / MJ Desktop) selon le mode actif.
- [x] Routage React Router : Home, Search, Settings.
- [x] Switch de mode (TV / Desktop) dans la sidebar.
- [x] Système de thème (Clair/Sombre) en CSS vanilla.

---

### 🏃 Sprint 4 ✅ : Gestion des Applications & Modes
*Objectif : Rendre le Hub fonctionnel avec des données réelles.*

- [x] CRUD API pour la table `Apps` (admin).
- [x] Grille d'applications dynamique selon le mode sélectionné.
- [x] Logique d'ouverture : `is_external` → iframe ou nouvel onglet.
- [x] Composant AppCard (icône, nom, catégorie).
- [x] Barre de recherche filtrant les apps en temps réel.

---

### 🏃 Sprint 5 ✅ : Personnalisation & UX
*Objectif : Finaliser les fonctionnalités de la release de base.*

- [x] Page **Settings** : thème, taille des icônes, layout.
- [x] Persistance des réglages en DB (table `Settings`).
- [x] Navigation au clavier (Flèches/Entrée) pour le Mode TV.

---

### 🏃 Sprint 6 ✅ : Polissage & Nginx
*Objectif : Préparer le projet pour la production.*

- [x] Dockerfile frontend multi-stage (Nginx pour les fichiers statiques).
- [x] Gestion des erreurs (Pages 404, erreurs de chargement d'Iframe).
- [x] Tests de réactivité (Responsive) sur tablette et mobile.
- [x] Nettoyage du code et documentation de l'API.

---

### 🏃 Sprint 7 ✅ *(Release avancée 1)* : Favoris, OAuth & Logs
*Objectif : Enrichir l'application avec les fonctionnalités avancées de la release 1.*

- [x] Système de **Favoris** : Ajouter/Supprimer une application de ses favoris.
- [x] **OAuth 2.0** : Connexion via Google ou GitHub (users standard uniquement).
- [x] Table `Logs` et enregistrement des actions majeures (connexions, lancements d'apps).

---

### 🏃 Sprint 8 *(Release avancée 2)* : Thèmes & Profils
*Objectif : Personnalisation poussée de l'interface et du profil utilisateur.*

- [ ] **10 thèmes** : 5 sombres + 5 clairs avec swatches visuels dans Settings.
- [ ] Persistance du thème choisi en base de données.
- [ ] **Profil utilisateur** : page dédiée accessible depuis la sidebar.
- [ ] Upload de photo de profil (fichier, max 5MB, jpg/png/webp).
- [ ] Changement de pseudo (vérification d'unicité).
- [ ] Ajout/modification d'email (champ optionnel).
- [ ] Changement de mot de passe (vérification de l'ancien mot de passe).
- [ ] Vérification d'identité OAuth avant changement sensible (re-auth Google/GitHub).
- [ ] Lazy loading des pages React (`React.lazy` + `Suspense`).
- [ ] Lazy loading des icônes d'apps (`loading="lazy"` + skeleton).

---

### 🏃 Sprint 9 *(Release avancée 3)* : Admin enrichi & Tests
*Objectif : Améliorer l'expérience admin et assurer la qualité du code.*

- [ ] Barre de recherche sur la liste des utilisateurs (filtrage serveur).
- [ ] Barre de recherche sur la liste des applications (filtrage serveur).
- [ ] Informations complètes : date de création, dernière connexion, nombre de favoris.
- [ ] Tri par colonnes et pagination sur les listes admin.
- [ ] Suite de tests backend (`/tests/backend/`) avec **Jest**.
- [ ] Suite de tests frontend (`/tests/frontend/`) avec **Vitest** + Testing Library.
- [ ] Fichier de résultats `/tests/results.md` mis à jour après chaque run.
