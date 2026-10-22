## Highlights & Features

- **Bauhaus Design System**: Unapologetic primary palette (Vermilion Red `#E63946`, Cobalt Blue `#1D4ED8`, Sun Yellow `#F59E0B`, Pitch Black `#111111`, Paper Cream `#F7F4EB`), high-contrast structural grid borders, and geometric primitives.
- **Bold Smooth Typography**: Features `Syne` for ultra-bold architectural headlines, `Space Grotesk` for geometric body copy, and `JetBrains Mono` for code and telemetry.
- **Animated Landing Page**:
  - Interactive kinetic Bauhaus sculpture with continuous multi-layered rotating segmented discs and orbiting geometry.
  - Interactive background Canvas where geometric nodes and vector lines react dynamically to mouse position.
  - Interactive **"Compose Art"** button that randomly reconfigures the sculpture's geometric transforms.
  - Live CAD coordinate crosshair HUD tracking pointer coordinates in real time.
- **GitHub Projects Showcase**:
  - Filter by category: `All`, `Web Apps`, `Dev Tools`, `Systems & CLI`, `Creative Code`.
  - Real-time instant search by repository name, keyword, or language.
  - Detailed project modal dialog with architectural specifications and one-click `git clone` clipboard copy.
  - **Dynamic GitHub Live Sync**: Built-in feature to fetch any public GitHub user's real repositories live using the GitHub REST API!
- **Interactive Developer Terminal**: Fully functional in-browser command terminal supporting `help`, `repos`, `clone <repo>`, `philosophy`, `skills`, `contact`, and `clear`.
- **Zero Dependencies & Lightweight**: 0 npm packages, 0 heavy frameworks, 0 external audio files (uses the browser's native **Web Audio API** for tactile mechanical click sounds). Sub-50KB total footprint!
- **100% GitHub Pages Ready**: Pure static files (`index.html`, `style.css`, `script.js`, `favicon.svg`).

---

## Project Structure

```
webport/
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI/CD: Quality Gate (Lint) -> Deploy to Pages
├── .gitignore           # Ignores node_modules and OS files
├── .nojekyll           # Disables Jekyll processing for pure static assets
├── eslint.config.mjs    # ESLint 9+ flat configuration rules
├── package.json         # Scripts for testing and linting
├── package-lock.json    # Deterministic dependency lockfile
├── index.html          # Semantic HTML5 markup, ARIA landmarks, SEO meta
├── style.css           # Complete Bauhaus CSS design system & responsive layout
├── script.js           # Canvas physics, terminal, project filter, GitHub API sync
├── favicon.svg         # Bauhaus geometric vector favicon
└── README.md           # Documentation & GitHub Pages deployment guide
```

---

## Quick Start (Local Development)

Because Werkstatt is built with standard web technologies, no build step or package manager is required.

### Option 1: Double-click
Simply double-click `index.html` in your file explorer to open it directly in any modern browser.

### Option 2: Local HTTP Server
Using Python (pre-installed on most systems):
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

Or using Node:
```bash
npx serve .
```

---

## Deploying to GitHub Pages via GitHub Actions (Automated CI/CD)

The project includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically packages and publishes your site on every push:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial Bauhaus portfolio release"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```

2. **Enable GitHub Actions for Pages (One-time setup)**:
   - On GitHub, go to your repository **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **GitHub Actions**.
   - That's it! GitHub will automatically trigger the workflow and publish your site at:
     `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`

3. **Continuous Deployment with Quality Gate**:
   - Every time you push a new commit to `main` (or `master`), GitHub Actions runs the `lint` job first.
   - If ESLint or syntax validation fails, the deployment halts immediately to prevent broken code from being published.
   - If all checks pass, the `deploy` job packages and publishes the site to GitHub Pages automatically.

---

## Code Quality & Linting

You can run the exact same quality checks locally that GitHub Actions runs in CI:

```bash
# Run both syntax check and ESLint
npm test

# Run ESLint only
npm run lint

# Run Node syntax check only
npm run lint:syntax
```

---

## Browser Support

- Chrome / Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari & Android Chrome

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT). Created in the spirit of the Weimar Bauhaus movement (1919–1933).
