[README.md](https://github.com/user-attachments/files/29934814/README.md)
# Ritik Kumar — Portfolio

Personal developer portfolio for Ritik Kumar — Full-Stack Developer specializing in AI.

** 🟢 Live:** [myportfolio-rxritik.vercel.app](https://myportfolio-rxritik.vercel.app/)

A static, no-build-step site — plain HTML/CSS/JS. No framework, no bundler, nothing to install to run it.


## Stack

- HTML5 / CSS3 — custom properties, grid, flexbox, 3D transforms
- Vanilla JS — particle background, 3D tilt cards, scroll reveals, tech-info modal
- [GSAP](https://gsap.com/) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering/) — animation & smooth scroll
- [Simple Icons](https://simpleicons.org/) (CDN) — tech-stack logos
- Google Fonts — Orbitron, Poppins, JetBrains Mono

Everything above is loaded via CDN in `index.html`.

## Run locally

```bash
npx serve .
```

Opens at `http://localhost:3000`. (Opening `index.html` directly also works, but some browsers restrict local `file://` behavior.)

## Deploy

**Vercel** — import the repo at [vercel.com/new](https://vercel.com/new), framework preset **Other**, deploy. No config needed.

**Netlify** — [app.netlify.com](https://app.netlify.com) → Add new site → import repo → leave build command blank, publish directory `/`.

**GitHub Pages** — Settings → Pages → Source: Deploy from a branch → select `main` / `root`.

## Notes

- Tech-chip icons and animation libraries load from CDN at runtime — need internet on first load. If GSAP fails to load, animations fall back automatically.
- Update the email/GitHub/LinkedIn links in the Contact section of `index.html` with your real URLs.

## License

MIT — see [LICENSE](./LICENSE).
