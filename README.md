# Ritik Kumar — Portfolio

Personal developer portfolio for Ritik Kumar (Full-Stack Developer, AI focus).
Built as a static, no-build-step site — plain HTML/CSS/JS — so it's easy to
extend, host anywhere, and version control cleanly.

## 🗂️ Project structure

```
ritik-portfolio/
├── index.html              # Main page (all sections)
├── assets/
│   ├── css/
│   │   └── style.css       # All site styling
│   ├── js/
│   │   └── main.js         # All site behavior (animations, tilt, modal, etc.)
│   └── images/
│       ├── hero-bg.jpg
│       ├── hero-character-1.png
│       ├── hero-character-2.png
│       ├── about-bg.jpg
│       ├── skills-bg.jpg
│       ├── projects-bg.jpg
│       ├── education-gojo-bg.jpg
│       ├── contact-bg.jpg
│       ├── contact-figure.png
│       └── buddy-companion.png
├── package.json             # optional — only used for local dev server / scripts
├── .gitignore
├── LICENSE
└── README.md
```

Everything is a flat, static file — there's no build step, no bundler,
no framework. Open `index.html` in a browser and it works. This also makes
it trivial to drop in new pages later (e.g. `resume.html`, `blog/index.html`)
without restructuring anything.

### Adding new files/sections
- New pages → add a `.html` file at the root (or a subfolder) and link to it from `index.html`'s nav.
- New images → drop them in `assets/images/` and reference as `assets/images/your-file.jpg`.
- New scripts → add a file in `assets/js/` and include it with a `<script src="assets/js/your-file.js"></script>` tag before `</body>`.
- New styles → either extend `assets/css/style.css` or add a new stylesheet and link it in `<head>`.

## 🛠️ Tech used

- HTML5 / CSS3 (custom properties, grid, flexbox, CSS 3D transforms)
- Vanilla JavaScript (no framework — canvas particle background, 3D tilt cards, scroll reveals, tech-info modal)
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll-triggered animations
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- [Simple Icons](https://simpleicons.org/) (via CDN) — brand logos for the tech-stack chips
- Google Fonts: Orbitron, Poppins, JetBrains Mono

All third-party libraries are loaded via CDN `<script>`/`<link>` tags in
`index.html` — nothing to install for the site itself to run.

## ▶️ Running locally

You can just open `index.html` directly in a browser. If you'd rather serve
it (recommended, some browsers restrict local `file://` behavior):

```bash
# Option 1 — no install needed
npx serve .

# Option 2 — if you've run `npm install` (installs the optional dev server)
npm install
npm run dev
```

Then visit the printed local URL (usually `http://localhost:3000`).

## 🚀 Deploying

This is a fully static site, so any static host works. A few easy options:

### GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", set **Source: Deploy from a branch**.
4. Pick your default branch and `/ (root)` folder → **Save**.
5. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repo.
2. Framework preset: **Other** (it's static — no build command needed).
3. Deploy. Done.

### Netlify
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Connect the repo. Build command: leave blank. Publish directory: `/` (root).
3. Deploy.

## 📌 Notes

- The tech-stack chip icons load from `cdn.simpleicons.org` at runtime, so an
  internet connection is needed to see them (they fail gracefully/hide if offline).
- GSAP/ScrollTrigger/Lenis are also loaded from CDN; if they fail to load for
  any reason, the site falls back to a simpler scroll-reveal system automatically.
- Update the contact email/social links in `index.html` (search for `mailto:`
  and the GitHub/LinkedIn `<a>` tags in the Contact section) with your real URLs.

## 📄 License

MIT — see [LICENSE](./LICENSE). Feel free to fork and adapt for your own portfolio.
