# WERKSTATT // Bauhaus GitHub Portfolio

> **"Form follows function. Art and technology: a new unity."**  
> A lightweight, static portfolio website engineered for GitHub Pages, inspired by classic Bauhaus Weimar design principles, bold typography, and modern web standards.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

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
├── index.html        # Semantic HTML5 markup, ARIA landmarks, SEO meta
├── style.css         # Complete Bauhaus CSS design system & responsive layout
├── script.js         # Canvas physics, terminal, project filter, GitHub API sync
├── favicon.svg       # Bauhaus geometric vector favicon
└── README.md         # Documentation & GitHub Pages deployment guide
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

## Deploying to GitHub Pages (2 Minutes)

1. **Create a GitHub Repository**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name your repo (e.g., `portfolio` or `<your-username>.github.io`).

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial Bauhaus portfolio release"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - On GitHub, go to your repository **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
   - Your website will be live in ~60 seconds at `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`!

---

## Customization Guide

### 1. Personalizing Profile & Repositories
Open `script.js` and edit the `CURATED_PROJECTS` array to replace the default projects with your own repositories, description, live links, and star counts.

### 2. Updating Header Links & Socials
In `index.html`:
- Search for `https://github.com` and replace with your personal GitHub URL (e.g. `https://github.com/your-username`).
- Update the email address in `#terminal` and the footer: `contact@werkstatt.dev` → `your-email@example.com`.

### 3. Fetching Real GitHub Repos Automatically
In `script.js`, you can call `fetchGithubUserRepos('your-username')` directly in `DOMContentLoaded` if you want the site to automatically populate with your live public GitHub repositories on load!

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
