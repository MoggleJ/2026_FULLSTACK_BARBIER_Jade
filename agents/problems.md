# Journal des problèmes — MJQbe WEB

> Ce fichier recense chaque problème rencontré pendant le développement : symptôme, cause racine, solution appliquée, et règle à retenir.
> Il est lu comme contexte par l'agent IA à chaque session.

---

## 2026-03-25 — Unknown authentication strategy "google"

**Sprint :** 7
**Fichier(s) concerné(s) :** `backend/src/routes/auth.js`, `backend/src/config/passport.js`

**Symptôme :**
```
Error: Unknown authentication strategy "google"
    at attempt (passport/lib/middleware/authenticate.js:193:39)
```
Erreur levée au hit de `GET /api/auth/google`.

**Cause :**
Les stratégies Passport (`GoogleStrategy`, `GitHubStrategy`) sont enregistrées conditionnellement dans `passport.js` — seulement si `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont présentes dans les variables d'environnement. Mais les routes `/google` et `/github` dans `auth.js` étaient enregistrées **inconditionnellement**, sans la même garde. Quand les variables d'env sont absentes (ex: en dev sans OAuth configuré), Passport ne connaît pas la stratégie `"google"` et lève une erreur runtime.

**Solution :**
Entourer les routes OAuth avec le même `if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)` que dans `passport.js`. Routes et stratégies sont désormais conditionnelles de façon identique.

```js
// auth.js — APRÈS correction
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { ... }));
  router.get('/google/callback', passport.authenticate('google', { ... }), handler);
}
```

**À retenir :**
Toujours synchroniser la condition d'enregistrement des stratégies Passport avec celle des routes qui les utilisent. Si une stratégie est conditionnelle, sa route doit l'être aussi. Pattern général : **la route et la stratégie partagent la même condition de montage**.

---

## 2026-03-25 — Icônes d'applications absentes à l'affichage

**Sprint :** 7 (IHM)
**Fichier(s) concerné(s) :** `frontend/src/components/AppCard/AppCard.jsx`

**Symptôme :**
Les icônes des apps ne s'affichent plus dans la grille. L'espace est vide, aucun message d'erreur.

**Cause :**
L'image utilisait `loading="lazy"` combiné avec `style={{ display: 'none' }}` pendant le chargement (pour masquer l'image avant qu'elle soit prête). Le navigateur ne déclenche jamais le chargement d'une image lazy qui est cachée via `display: none` — l'image ne part jamais en réseau, donc le callback `onLoad` ne se déclenche jamais, et l'image reste cachée indéfiniment.

**Solution :**
Remplacer `display: 'none'` par `opacity: 0; position: absolute` pendant le chargement. L'image est dans le DOM et visible pour le navigateur (donc lazy loading se déclenche) mais invisible pour l'utilisateur.

```jsx
// AVANT (deadlock)
style={imgLoaded ? {} : { display: 'none' }}

// APRÈS (correct)
style={imgLoaded ? {} : { opacity: 0, position: 'absolute' }}
```

**À retenir :**
`loading="lazy"` ne fonctionne pas sur les éléments avec `display: none`. Pour masquer visuellement une image pendant son chargement tout en permettant le lazy loading, utiliser `opacity: 0` ou `visibility: hidden`.

---

## 2026-03-25 — Dialog natif du navigateur "Select which login to update"

**Sprint :** 7–8 (IHM)
**Fichier(s) concerné(s) :** `frontend/src/pages/Profile/Profile.jsx`

**Symptôme :**
Lors de la modification du profil ou du mot de passe, le navigateur affiche une popup native "Select which login to update" avec la liste des comptes enregistrés. L'utilisateur ne veut pas ce comportement.

**Cause :**
Le navigateur détecte tout formulaire contenant des champs `type="password"` et intercepte la soumission pour proposer de sauvegarder ou mettre à jour les identifiants. Les attributs `autocomplete` sur les inputs individuels ne suffisent pas à supprimer cette interception au niveau du formulaire.

**Solution :**
Ajouter `autoComplete="off"` sur les balises `<form>` elles-mêmes (formulaire profil + formulaire mot de passe). Cela indique au navigateur de ne pas tenter de gérer les credentials de ces formulaires.

```jsx
<form onSubmit={handleSaveProfile} className="profile-form" autoComplete="off">
<form onSubmit={handleSavePassword} className="profile-form" autoComplete="off">
```

**À retenir :**
`autocomplete="off"` sur les champs individuels ne supprime pas le gestionnaire de credentials natif. Il faut le mettre sur l'élément `<form>` lui-même. À appliquer sur tous les formulaires de changement de mot de passe ou de profil qui ne doivent pas interagir avec le password manager du navigateur.

---

## 2026-03-25 — Boutons OAuth toujours affichés même sans configuration

**Sprint :** 7 (IHM)
**Fichier(s) concerné(s) :** `frontend/src/pages/Auth/Login.jsx`, `frontend/.env.example`

**Symptôme :**
Les boutons "Continuer avec Google / GitHub" s'affichent sur la page de connexion même quand les variables d'environnement OAuth ne sont pas configurées. Cliquer dessus provoque une erreur 404 ou une erreur Passport côté backend.

**Cause :**
Les boutons OAuth étaient rendus inconditionnellement dans le JSX du formulaire de connexion, sans vérification que les providers étaient effectivement activés.

**Solution :**
Ajouter des variables d'environnement Vite (`VITE_OAUTH_GOOGLE_ENABLED`, `VITE_OAUTH_GITHUB_ENABLED`) lues au build-time. Conditionner l'affichage des boutons et du séparateur à ces variables.

```jsx
const OAUTH_GOOGLE = import.meta.env.VITE_OAUTH_GOOGLE_ENABLED === 'true';
const OAUTH_GITHUB = import.meta.env.VITE_OAUTH_GITHUB_ENABLED === 'true';
{(OAUTH_GOOGLE || OAUTH_GITHUB) && <div className="auth-divider">…</div>}
{OAUTH_GOOGLE && <a href="…/google">Google</a>}
```

**À retenir :**
Les routes backend OAuth sont conditionnelles (guard `if (process.env.GOOGLE_CLIENT_ID)`). Le frontend doit miroir cette condition via des variables d'env Vite. Toujours synchroniser la visibilité des boutons OAuth avec l'activation réelle des providers.

---

## 2026-03-25 — Lien "Profil" dans la sidebar + Settings pas au-dessus de l'horloge

**Sprint :** 7 (IHM)
**Fichier(s) concerné(s) :** `frontend/src/components/Sidebar/Sidebar.jsx`, `frontend/src/pages/Settings/Settings.jsx`

**Symptôme :**
1. Un lien "Profil" apparaissait dans la barre de navigation principale de la sidebar — l'utilisateur ne le voulait pas.
2. Le lien "Paramètres" était dans le nav principal au lieu d'être dans le footer de la sidebar, juste au-dessus de l'horloge.

**Cause :**
Architecture de navigation initiale qui traitait Settings et Profile comme des routes normales dans le nav.

**Solution :**
- Retirer NavLink `/profile` et `/settings` du `<nav>` principal.
- Déplacer le NavLink Settings dans `.sidebar-footer`, positionné avant le bouton d'horloge.
- Ajouter une **carte profil** en haut de la page Settings (avatar + pseudo + rôle + bouton "Modifier le profil" → `/profile`). Le profil n'est donc accessible que depuis Settings.

**À retenir :**
Selon les specs (section 7) : pas de lien Profil dans la navbar ; Settings se trouve au-dessus de l'horloge dans le footer sidebar ; la page Settings affiche la carte profil en haut.

---

## 2026-03-25 — Thèmes rougeâtres et hauts contrastes manquants

**Sprint :** 7 (IHM)
**Fichier(s) concerné(s) :** `frontend/src/index.css`, `frontend/src/pages/Settings/Settings.jsx`, `frontend/src/i18n/fr.js`, `frontend/src/i18n/en.js`

**Symptôme :**
L'utilisateur souhaitait des thèmes rouges (sombre et clair) et des thèmes à fort contraste (sombre et clair) qui n'existaient pas.

**Cause :**
Non implémentés dans le sprint initial des thèmes.

**Solution :**
Ajout de 4 nouveaux thèmes dans `index.css` (`[data-theme="dark-red"]`, `[data-theme="light-red"]`, `[data-theme="dark-contrast"]`, `[data-theme="light-contrast"]`), dans le tableau `THEMES` de `Settings.jsx`, et dans les traductions FR/EN.

**À retenir :**
Tout nouveau thème nécessite 3 modifications : (1) bloc CSS dans `index.css`, (2) entrée dans le tableau `THEMES` de `Settings.jsx` avec bg/accent pour le swatch, (3) clé de traduction dans `fr.js` et `en.js`.

---

## 2026-03-25 — CSS project-wide : valeurs en px au lieu de rem

**Sprint :** 7 (IHM)
**Fichier(s) concerné(s) :** Tous les fichiers CSS du frontend (`index.css`, `Sidebar.css`, `AppGrid.css`, `AppCard.css`, `MobileHeader.css`, `Layout.css`, `AdminApps.css`, `AdminUsers.css`, `AppViewer.css`, `Auth.css`, `Search.css`, `Profile.css`, `Settings.css`)

**Symptôme :**
Les fichiers CSS contenaient des valeurs en `px` pour les espacements, rayons, tailles d'icônes, media queries, tailles de composants. L'utilisateur veut uniquement des `rem`.

**Cause :**
Développement initial sans contrainte rem-only.

**Solution :**
Conversion systématique px → rem sur tous les fichiers CSS, avec les règles suivantes :
- Base composants : `1rem = 20px` (font-size défini sur `html`)
- Base media queries : `1rem = 16px` (base navigateur, non affectée par le font-size de `html`)
- Conversions clés : `4px=0.2rem`, `8px=0.4rem`, `16px=0.8rem`, `24px=1.2rem`, `48px=2.4rem`
- Media queries : `1023px=63.9375rem`, `767px=47.9375rem`, `600px=37.5rem`, `399px=24.9375rem`
- Borders : `1px=0.05rem`, `2px=0.1rem`, `3px=0.15rem`
- Exception maintenue : `--font-size-base: 20px` (définit la base rem — changer en rem serait circulaire)

**À retenir :**
Les media queries utilisent **toujours** la base du navigateur (16px) pour les rem, même si `html { font-size }` est surchargé. Ne jamais utiliser la base projet (20px) pour convertir des media queries en rem.

---

## 2026-03-25 — Profile.jsx perd ses styles après redirection OAuth

**Sprint :** 8 (OAuth reauth)
**Fichier(s) concerné(s) :** `frontend/src/pages/Profile/Profile.jsx`

**Symptôme :**
Après vérification d'identité via Google (flux reauth), le navigateur redirige vers `/profile?reauth=<token>`. La page Profile s'affiche avec de nombreux éléments sans style : boutons, sections, labels.

**Cause :**
`Profile.jsx` utilise des classes CSS de `Settings.css` (`settings-section`, `settings-section-title`, `settings-toggle-btn`, `settings-row-label`, `settings-row-desc`, `settings-logout-btn`) mais **n'importe pas** ce fichier. Lors d'une navigation SPA normale (l'utilisateur passe par la page Settings avant Profile), `Settings.css` est chargé et reste dans le DOM. Mais après la redirection OAuth, l'app recharge directement sur `/profile` — le chunk lazy de Settings n'est jamais chargé, donc `Settings.css` n'est jamais injecté.

**Solution :**
Importer `Settings.css` directement dans `Profile.jsx` :
```js
import '../Settings/Settings.css';
```
Vite déduplique les imports CSS — charger le même fichier depuis deux composants n'a aucun effet négatif.

**À retenir :**
Si un composant utilise des classes CSS définies dans le fichier d'un autre composant (lazy-loaded), il **doit** importer ce fichier CSS directement. Ne pas supposer que le CSS sera disponible parce qu'un autre composant l'a chargé auparavant — après une navigation directe ou un rechargement complet, cet autre composant peut ne jamais être rendu.

---

## 2026-03-25 — Google OAuth reauth : Error 400 redirect_uri_mismatch

**Sprint :** 8 (OAuth reauth)
**Fichier(s) concerné(s) :** Google Cloud Console (configuration externe), `backend/src/routes/auth.js`

**Symptôme :**
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```
Erreur Google lors du clic sur "Vérifier via Google" dans la page Profil.

**Cause :**
Le flux reauth utilise une `callbackURL` différente de celle du login normal : `/api/auth/google/reauth-callback`. Cette URL n'était pas enregistrée dans les **Authorized redirect URIs** du projet Google Cloud Console — seul `/api/auth/google/callback` l'était.

**Solution :**
Ajouter l'URI suivante dans Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client → Authorized redirect URIs :
```
http://localhost:5000/api/auth/google/reauth-callback
```
(ou l'équivalent avec le BACKEND_URL de prod)

**À retenir :**
Chaque `callbackURL` distincte utilisée par Passport Google doit être enregistrée séparément dans Google Cloud Console. Le reauth utilise une callback différente du login — toujours enregistrer les deux. Même règle pour GitHub (Settings → Developer Settings → OAuth Apps → Authorization callback URL).
