# Système de thèmes — MJQbe WEB

> 10 thèmes CSS vanilla (5 sombres + 5 clairs).
> Chaque thème est un bloc `[data-theme="xxx"]` redéfinissant les CSS variables du `:root`.
> Le thème est appliqué via `document.documentElement.setAttribute('data-theme', theme)`.

---

## Variables CSS du système

```css
:root {
  /* Backgrounds */
  --color-bg: ...;
  --color-surface: ...;
  --color-surface-hover: ...;
  --color-border: ...;

  /* Textes */
  --color-text: ...;
  --color-text-muted: ...;
  --color-text-subtle: ...;

  /* Accent */
  --color-accent: ...;
  --color-accent-hover: ...;

  /* Danger */
  --color-danger: #d4183d;

  /* Layout */
  --sidebar-width: 256px;
  --sidebar-width-collapsed: 80px;
  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 10px;
  --radius-xl: 14px; --radius-full: 9999px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px; --space-12: 48px;
}
```

---

## Thèmes sombres (5)

### `dark` — Zinc sombre (thème par défaut existant)
```css
[data-theme="dark"] {
  --color-bg:            #09090b;
  --color-surface:       #18181b;
  --color-surface-hover: #27272a;
  --color-border:        #27272a;
  --color-text:          #fafafa;
  --color-text-muted:    #a1a1aa;
  --color-text-subtle:   #71717a;
  --color-accent:        #0ea5e9;
  --color-accent-hover:  #2563eb;
}
```

### `dark-blue` — Slate nuit
```css
[data-theme="dark-blue"] {
  --color-bg:            #0a0f1e;
  --color-surface:       #0f172a;
  --color-surface-hover: #1e293b;
  --color-border:        #1e293b;
  --color-text:          #f1f5f9;
  --color-text-muted:    #94a3b8;
  --color-text-subtle:   #64748b;
  --color-accent:        #60a5fa;
  --color-accent-hover:  #3b82f6;
}
```

### `dark-purple` — Violet profond
```css
[data-theme="dark-purple"] {
  --color-bg:            #0d0a1a;
  --color-surface:       #1a1030;
  --color-surface-hover: #261848;
  --color-border:        #261848;
  --color-text:          #f5f3ff;
  --color-text-muted:    #c4b5fd;
  --color-text-subtle:   #a78bfa;
  --color-accent:        #a78bfa;
  --color-accent-hover:  #7c3aed;
}
```

### `amoled` — Noir pur
```css
[data-theme="amoled"] {
  --color-bg:            #000000;
  --color-surface:       #0a0a0a;
  --color-surface-hover: #141414;
  --color-border:        #1a1a1a;
  --color-text:          #ffffff;
  --color-text-muted:    #999999;
  --color-text-subtle:   #666666;
  --color-accent:        #22d3ee;
  --color-accent-hover:  #06b6d4;
}
```

### `dark-green` — Forêt
```css
[data-theme="dark-green"] {
  --color-bg:            #052e16;
  --color-surface:       #14532d;
  --color-surface-hover: #166534;
  --color-border:        #166534;
  --color-text:          #f0fdf4;
  --color-text-muted:    #86efac;
  --color-text-subtle:   #4ade80;
  --color-accent:        #34d399;
  --color-accent-hover:  #10b981;
}
```

---

## Thèmes clairs (5)

### `light` — Gris clair (thème clair par défaut)
```css
[data-theme="light"] {
  --color-bg:            #f9fafb;
  --color-surface:       #ffffff;
  --color-surface-hover: #f3f4f6;
  --color-border:        #e5e7eb;
  --color-text:          #111827;
  --color-text-muted:    #6b7280;
  --color-text-subtle:   #9ca3af;
  --color-accent:        #0284c7;
  --color-accent-hover:  #0369a1;
}
```

### `light-warm` — Crème ambré
```css
[data-theme="light-warm"] {
  --color-bg:            #fffbeb;
  --color-surface:       #ffffff;
  --color-surface-hover: #fef3c7;
  --color-border:        #fde68a;
  --color-text:          #1c1917;
  --color-text-muted:    #78716c;
  --color-text-subtle:   #a8a29e;
  --color-accent:        #d97706;
  --color-accent-hover:  #b45309;
}
```

### `light-blue` — Ciel
```css
[data-theme="light-blue"] {
  --color-bg:            #f0f9ff;
  --color-surface:       #ffffff;
  --color-surface-hover: #e0f2fe;
  --color-border:        #bae6fd;
  --color-text:          #0c1a29;
  --color-text-muted:    #64748b;
  --color-text-subtle:   #94a3b8;
  --color-accent:        #0284c7;
  --color-accent-hover:  #0369a1;
}
```

### `light-purple` — Lavande
```css
[data-theme="light-purple"] {
  --color-bg:            #faf5ff;
  --color-surface:       #ffffff;
  --color-surface-hover: #f3e8ff;
  --color-border:        #e9d5ff;
  --color-text:          #1e0a3c;
  --color-text-muted:    #7c3aed;
  --color-text-subtle:   #a78bfa;
  --color-accent:        #7c3aed;
  --color-accent-hover:  #6d28d9;
}
```

### `light-green` — Menthe
```css
[data-theme="light-green"] {
  --color-bg:            #f0fdf4;
  --color-surface:       #ffffff;
  --color-surface-hover: #dcfce7;
  --color-border:        #bbf7d0;
  --color-text:          #052e16;
  --color-text-muted:    #16a34a;
  --color-text-subtle:   #4ade80;
  --color-accent:        #16a34a;
  --color-accent-hover:  #15803d;
}
```

---

## Implémentation (sprint 8)

### Application du thème
```js
// ThemeContext.jsx
document.documentElement.setAttribute('data-theme', theme);
```

### Valeurs acceptées pour settings.theme
```
'dark' | 'dark-blue' | 'dark-purple' | 'amoled' | 'dark-green'
| 'light' | 'light-warm' | 'light-blue' | 'light-purple' | 'light-green'
```

### Swatches dans la page Settings
Grille de 10 pastilles cliquables. Chaque swatch affiche :
- Couleur de fond = `--color-bg` du thème
- Point d'accent = `--color-accent` du thème
- Label = nom du thème
- Bordure mise en évidence si thème actif

### Noms affichés (i18n)
| Clé | FR | EN |
|-----|----|----|
| `dark` | Sombre | Dark |
| `dark-blue` | Bleu nuit | Dark Blue |
| `dark-purple` | Violet | Dark Purple |
| `amoled` | AMOLED | AMOLED |
| `dark-green` | Forêt | Dark Green |
| `light` | Clair | Light |
| `light-warm` | Chaud | Light Warm |
| `light-blue` | Ciel | Light Blue |
| `light-purple` | Lavande | Light Purple |
| `light-green` | Menthe | Light Green |
