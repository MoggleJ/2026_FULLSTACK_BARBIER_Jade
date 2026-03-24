# Contrat de projet Fullstack

**Nom :** BARBIER
**Prénom :** Jade

---

## 1. Décrivez en quelques lignes le système attendu, son domaine d'application et les différentes catégories d'utilisateurs.

**MJQbe WEB** est une application web servant de hub pour accéder à différentes applications en ligne (streaming, outils, ...) via une unique interface. Elle propose deux modes d'utilisation : un **mode TV** (orienté consommation de contenu : Netflix, YouTube, Twitch…) et un **mode Desktop** (orienté productivité, avec différents outils). Les catégories d'utilisateurs sont : les **utilisateurs standard** (accès au hub en lecture) et les **administrateurs** (gestion des applications, des utilisateurs, et des catégories).

---

## 2. Quelles sont les principales technologies utilisées en frontend ?

- **React** (vite)
- **React Router** 
- **CSS** 
- **ESLint** 

---

## 3. Quelles sont les principales technologies utilisées en backend ?

- **Node.js** avec **Express** (API REST)
- **JWT (JSON Web Tokens)** — authentification et protection des routes
- **Bcrypt** — hashage des mots de passe
- **pg** ou **Prisma/TypeORM** — gestion de la BDD PostgreSQL
- **Nodemon** — rechargement automatique en développement

---

## 4. Quelle est la technologie de base de données utilisée (instance dockerisée) ?

**PostgreSQL**, déployée dans un container Docker dédié. La base de données est isolée sur le réseau Docker interne et n'est accessible que par le service backend (pas d'exposition publique).

---

## 5. Y'a-t-il d'autres technologies importantes dans votre projet ?

- **Docker & Docker Compose** — conteneurisation de l'ensemble de la stack (Frontend/Nginx, Backend/Node, PostgreSQL)

---

## 6. Comment est prévue la gestion de projet (gestion du versioning, des issues, styling…) ?

- **Git** pour le versioning 
- **GitHub** pour la gestion des issues et des branches (feature branches par sprint)
- Découpage en **6 sprints** progressifs (Fondations → Auth → Layout → Apps → UX → Production)
- **ESLint** pour le respect des conventions de code
- Documentation de l'API via **Swagger** ou un README dédié

---

## RELEASE DE BASE PROPOSÉE

### 7. Quelles sont les principales informations et fonctionnalités accessibles de manière publique ?

- Page de **connexion** et d'**inscription** (Register / Login)
- Aucune autre fonctionnalité n'est accessible sans authentification

---

### 8. Quelles sont les principales informations et fonctionnalités accessibles de manière protégée ?

Pour les **utilisateurs authentifiés** :
- Accès au hub avec affichage de la grille d'applications (mode TV / Desktop)
- Navigation par catégories et recherche d'applications
- Ouverture des apps en nouvel onglet
- Page **Settings** : personnalisation des infos de users etc.
- Switch entre **Mode TV** et **Mode Desktop**

Pour les **administrateurs** :
- CRUD complet sur les applications, les utilisateurs et les catégories


---

### 9. Comment sont prévues les interactions avec la base de données (utilisation d'un ORM) ?

Utilisation de **pg** (driver natif PostgreSQL) ou d'un ORM léger comme **Prisma** ou **TypeORM** pour les interactions avec la base. Le schéma comprend 5 tables : `Users`, `Apps`, `Categories`, `Settings`. La base est initialisée via un **script SQL** au démarrage du container PostgreSQL.

---

### 10. Comment est prévue l'authentification ?

Authentification par **login / mot de passe** avec :
- Hash des mots de passe via **Bcrypt**
- Sessions gérées côté client via **JWT (JSON Web Tokens)** (génération à la connexion, validation par middleware Express sur chaque route protégée)
- Gestion des rôles : `admin` / `user`

---

## RELEASE AVANCÉE 1

### 11. Sur quoi travaillerez-vous pour une 1ère release avancée ?

- Intégration de **OAuth 2.0** (connexion via Google ou GitHub) pour simplifier l'authentification
- Système de **favoris** (ajout/suppression d'apps)
- Système de **Logs** : enregistrement des actions users (connexions)

---

## RELEASE AVANCÉE 2

### 12. Sur quoi travaillerez-vous pour une 2ème release avancée ?

- **Thèmes personnalisés** : Selection de thèmes par l'utilisateur
- Optimisations de performance (lazy loading, mise en cache des assets)
