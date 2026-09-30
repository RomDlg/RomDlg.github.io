# Romain Delage · Portfolio

Static one-page portfolio, built from the Claude Design "Portfolio F – Signature" mockup.
No framework and no build step: plain HTML, CSS and JS, ready for GitHub Pages.

```
index.html              page + all CSS (inlined for the fastest first paint)
assets/js/main.js       interactions (projects, quote builder, x-ray mode…)
assets/fonts/           self-hosted, subsetted woff2 fonts (~83 KB total)
assets/img/             favicon, Apple touch icon, social preview (og.png)
404.html, robots.txt, sitemap.xml, .nojekyll
```

## Deploy on GitHub Pages

1. Create a public repo named **`RomDlg.github.io`**, so the site lives at `https://romdlg.github.io/`.
2. Push this folder to the `main` branch.
3. In the repo, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then select `main` / `root`.

If you use another repo name (for example `portfolio`), the site is served at `https://romdlg.github.io/portfolio/`.
In that case, update the absolute URLs in `index.html` (canonical, `og:*`, JSON-LD), `robots.txt` and `sitemap.xml`, plus the `/` links in `404.html`.

## What to edit

| What | Where |
| --- | --- |
| Contact email | Search and replace `contact@romaindelage.fr` in `index.html` and `assets/js/main.js` |
| "Réserver un appel" link | `data-book` link in `index.html` (currently a `mailto:`; paste a Cal.com or Calendly URL there) |
| Case studies | `PROJECTS` in `main.js`; set `img: 'assets/img/projet-1.webp'` to show a screenshot (16:8 ratio) |
| Tab labels | The four `.tab` buttons in `index.html` |
| Prices and durations | `SERVICES` in `main.js`, plus the "dès … €" labels in `index.html` |
| Portrait | Replace the `.portrait` placeholder (see the HTML comment above it) |

Use WebP or AVIF images at about 1600 px wide for project screenshots, so the page stays fast.
