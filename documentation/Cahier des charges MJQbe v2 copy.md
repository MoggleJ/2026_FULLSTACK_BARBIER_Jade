# Cahier des charges — MJQbe WEB version 

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
* Architecture modulaire
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

---

## 7. Modèle de données

### Table Users
* id (UUID)
* username
* password_hash
* role

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
* theme
* mode (TV/Desktop)
* layout
* icon_size
* selected_apps

### Table Logs *(Release avancée 1)*
* id
* action
* timestamp
* user_id

---

## 8. Architecture logicielle
Le système est composé de plusieurs modules indépendants :
* Gestion des applications / Catégories / Recherche / Utilisateurs.
* API backend / Interface frontend.
* **Dockerisation** : Chaque module tourne dans son propre container pour faciliter la maintenance.

---

## 9. Limitations de la version WEB
Cette version ne prend pas en charge :
* Gestion du Wi-Fi / Bluetooth / Installation locale.
* Screen sharing / Terminal / Processus système.
* Hébergement de serveurs (Minecraft, DHCP, etc.) / Interaction matérielle.

---

## 10. Évolutions possibles

### Release avancée 1
* Système de **favoris** : Ajouter/Supprimer une application de ses favoris utilisateur
* Intégration **OAuth 2.0** (connexion via Google ou GitHub)
* Système de **Logs** : Enregistrement des actions utilisateurs (connexions, lancements d'apps)

### Release avancée 2
* **Thèmes personnalisés** avancés : sélection de thèmes par l'utilisateur
* Optimisations de performance (lazy loading, mise en cache des assets)
* Système de plugins
* Intégration d'API externes
* Synchronisation utilisateur avancée

---

## 11. Plan de développement 

### 🏃 Sprint 1 : Fondations & Dockerisation
*Objectif : Mettre en place l'environnement de développement et la communication de base.*

- [x] Configuration du dépôt Git et de l'arborescence (`/frontend`, `/backend`).
- [x] Création du `docker-compose.yml` (Services : Postgres, Node, React).
- [x] Initialisation de la base de données avec le script SQL des tables (`Users`, `Apps`, `Categories`, `Settings`).
- [x] Configuration du Backend Express (Connexion à la DB via `pg` ou `TypeORM/Prisma`).
- [x] Test de communication : Le Frontend affiche un message provenant de l'API.

---

### 🏃 Sprint 2 : Authentification & Sécurité (Core)
*Objectif : Sécuriser l'accès et permettre la personnalisation utilisateur.*

- [x] Mise en place du Hashage de mot de passe avec **Bcrypt**.
- [x] Création des routes API `Register` et `Login`.
- [x] Implémentation du système **JWT** (Génération du token et middleware de validation).
- [x] Création du store React (Context API ou Redux) pour gérer l'état de l'utilisateur.
- [x] Configuration des politiques **CORS** sur Express pour Docker.

---

### 🏃 Sprint 3 : Structure de l'Interface (Layout)
*Objectif : Construire la coque de MJQbe WEB.*

- [x] Création de la **Sidebar fixe** à gauche (Responsive).
- [x] Implémentation du **Titre Dynamique** (MJ TV / MJ Desktop) selon le mode actif.
- [x] Mise en place du système de routage (React Router) : Home, Search, Settings.
- [x] Création du switch de mode (TV / Desktop) dans la sidebar.
- [x] Intégration du système de Thème (Clair/Sombre) dans le CSS/Styled Components.

---

### 🏃 Sprint 4 : Gestion des Applications & Modes
*Objectif : Rendre le Hub fonctionnel avec des données réelles.*

- [x] CRUD API pour la table `Apps` (Admin peut ajouter/éditer une app).
- [x] Affichage de la **Grille d'applications** dynamique selon le mode sélectionné.
- [x] Logique d'ouverture : Script pour détecter si l'app s'ouvre en **Iframe** ou **Nouvel onglet** (`is_external`).
- [x] Mise en place du composant "App Card" (Icône, Nom, Catégorie).
- [x] Implémentation de la barre de recherche (`Search`) filtrant les apps en temps réel.

---

### 🏃 Sprint 5 : Personnalisation & Expérience Utilisateur
*Objectif : Finaliser les fonctionnalités de la release de base.*

- [x] Page **Settings** : Formulaire pour modifier le thème, la taille des icônes et le layout.
- [x] Persistance des réglages : Sauvegarde automatique dans la table `Settings` en DB.
- [x] Navigation au clavier (Flèches/Entrée) pour le **Mode TV**.

---

### 🏃 Sprint 6 : Polissage & Optimisation Nginx
*Objectif : Préparer le projet pour la production.*

- [x] Optimisation du Dockerfile Frontend (Utilisation de **Nginx** pour servir les fichiers statiques).
- [x] Gestion des erreurs (Pages 404, erreurs de chargement d'Iframe).
- [x] Test de la réactivité (Responsive) sur tablette et mobile.
- [x] Nettoyage du code et documentation de l'API (Swagger ou simple README).

---

### 🏃 Sprint 7 *(Release avancée 1)* : Favoris, OAuth & Logs
*Objectif : Enrichir l'application avec les fonctionnalités avancées de la release 1.*

- [x] Système de **Favoris** : Ajouter/Supprimer une application de ses favoris utilisateur.
- [x] Intégration **OAuth 2.0** : Connexion via Google ou GitHub.
- [x] Création de la table `Logs` et enregistrement des actions majeures (connexions, lancements d'apps).

---

### 🏃 Sprint 8 *(Release avancée 2)* : Thèmes & Optimisations
*Objectif : Finaliser les fonctionnalités avancées et optimiser les performances.*

- [ ] **Thèmes personnalisés** : Sélection et persistance du thème par l'utilisateur.
- [ ] Augmentation du nombre et election par l'utilisateur de thèmes disponibles, sombres et clairs. 
- [ ] Optimisations de performance (lazy loading, mise en cache des assets).
- [ ] **Profils personnalisés** : l'utilisateur peut changer sa photo de profil, son pseudo (en le gardant unique), son e-mail et Mot de Passe ou compte connecté (implicant une vérification d'identité avant le changement).
