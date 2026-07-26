# Portfolio — Romain Delage

Portfolio personnel, en ligne sur **https://romdlg.github.io**.

Next.js 16 (App Router) + Tailwind CSS 4, exporté en statique.

## Développement

```bash
npm install
npm run dev
```

Puis http://localhost:3000. La page vit dans `app/page.tsx`.

## Build

```bash
npm run build
```

`output: "export"` produit un site statique dans `out/`. Pour le vérifier avant de pousser :

```bash
npx serve out
```

## Déploiement

Automatique : chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui build et publie `out/` sur GitHub Pages.

Deux détails à ne pas casser :

- `public/.nojekyll` — sans lui, GitHub Pages ignore le dossier `_next/` et le site perd son CSS et son JS.
- `images.unoptimized: true` dans `next.config.ts` — l'optimisation d'images de Next.js exige un serveur, absent sur Pages.
