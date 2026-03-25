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
