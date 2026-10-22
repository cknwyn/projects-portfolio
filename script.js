/**
 * ============================================================================
 * WERKSTATT // BAUHAUS GITHUB PORTFOLIO JAVASCRIPT
 * Pure Vanilla JavaScript — Zero external libraries, standard-compliant.
 * Features:
 *   - Interactive Bauhaus Kinetic Canvas & Geometric Composer
 *   - Curated & Dynamic GitHub Repository Showcase
 *   - Real-time Tag & Text Filtering
 *   - Web Audio API Mechanical Sound Synthesizer (0 external audio files)
 *   - Interactive In-Browser Developer Terminal
 *   - Project Detail Modal & One-Click Git Clone
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     01. APPLICATION CONFIGURATION & STATE
     -------------------------------------------------------------------------- */
  const CONFIG = {
    defaultGithubUser: 'octocat', // Default fallback username for cloning links
    enableSoundByDefault: false,
    maxCanvasNodes: 24,
    nodeConnectionDistance: 110,
    mouseRadius: 130
  };

  const STATE = {
    soundEnabled: false,
    activeFilter: 'all',
    searchQuery: '',
    audioCtx: null,
    repos: [],
    customGithubUser: null,
    isSyncing: false
  };

  /* --------------------------------------------------------------------------
     02. CURATED BAUHAUS PROJECT REPOSITORIES
     -------------------------------------------------------------------------- */
  const CURATED_PROJECTS = [
    {
      id: 'hypergrid-engine',
      name: 'hypergrid-engine',
      category: 'creative',
      colorBand: 'band-red',
      typeLabel: 'CREATIVE CODE',
      typeTagClass: 'tag-red',
      description: 'Hardware-accelerated WebGL 2D/3D vector rendering engine with procedural geometry generation and sub-millisecond draw calls.',
      tags: ['TypeScript', 'WebGL', 'Math', 'Zero-Dep'],
      primaryLang: 'TypeScript',
      license: 'MIT',
      dependencies: '0 (Pure WebGL/DOM)',
      stars: 482,
      forks: 43,
      githubUrl: 'https://github.com/octocat/hypergrid-engine',
      demoUrl: 'https://github.com',
      highlights: [
        'Custom batch renderer minimizing draw calls down to 1 per layer.',
        'Strict adherence to standard WebGL 2.0 and Canvas 2D contexts.',
        'Zero external runtime dependencies; bundle footprint under 14KB minified.'
      ]
    },
    {
      id: 'bauhaus-css-system',
      name: 'bauhaus-css-system',
      category: 'web',
      colorBand: 'band-blue',
      typeLabel: 'WEB DESIGN SYSTEM',
      typeTagClass: 'tag-blue',
      description: 'A modular, brutalist CSS framework honoring Weimar typography, strict grid geometry, and modern CSS custom properties.',
      tags: ['Modern CSS', 'Grid', 'Typography', 'A11y'],
      primaryLang: 'CSS / SCSS',
      license: 'Apache-2.0',
      dependencies: '0 (Pure CSS3)',
      stars: 320,
      forks: 28,
      githubUrl: 'https://github.com/octocat/bauhaus-css-system',
      demoUrl: 'https://github.com',
      highlights: [
        'Built entirely with native CSS custom properties and CSS Grid level 2.',
        'Fluid typography calculation with clamp() across all viewport widths.',
        'Guaranteed WCAG 2.1 AAA color contrast ratios across all primary tokens.'
      ]
    },
    {
      id: 'git-sentinel-cli',
      name: 'git-sentinel-cli',
      category: 'systems',
      colorBand: 'band-yellow',
      typeLabel: 'SYSTEMS & CLI',
      typeTagClass: 'tag-yellow',
      description: 'Ultra-fast Git pre-commit hook and repository security auditor written in Rust. Scans for high-entropy secrets and commit hygiene.',
      tags: ['Rust', 'CLI', 'Security', 'Git Hooks'],
      primaryLang: 'Rust',
      license: 'MIT',
      dependencies: 'Minimal (native libc)',
      stars: 591,
      forks: 64,
      githubUrl: 'https://github.com/octocat/git-sentinel-cli',
      demoUrl: 'https://github.com',
      highlights: [
        'Zero-allocation pattern matching using SIMD-accelerated regex algorithms.',
        'Executes full branch inspection in < 12ms across 50,000 file trees.',
        'Generates SARIF compliance reports compatible with GitHub Advanced Security.'
      ]
    },
    {
      id: 'synapse-router',
      name: 'synapse-router',
      category: 'tools',
      colorBand: 'band-black',
      typeLabel: 'DEV TOOLS',
      typeTagClass: 'tag-black',
      description: 'High-throughput trie-based HTTP router for Edge runtimes and Go microservices. Benchmark-verified zero heap allocations during route matching.',
      tags: ['Go (Golang)', 'Edge', 'HTTP', 'Performance'],
      primaryLang: 'Go',
      license: 'BSD-3-Clause',
      dependencies: '0 (Standard Library only)',
      stars: 274,
      forks: 19,
      githubUrl: 'https://github.com/octocat/synapse-router',
      demoUrl: 'https://github.com',
      highlights: [
        'Radix-tree routing algorithm with zero memory allocation on hot path.',
        'Seamless compatibility with Cloudflare Workers, Fastly, and native net/http.',
        '100% test coverage with automated fuzz testing via GitHub Actions.'
      ]
    },
    {
      id: 'chroma-palette-lab',
      name: 'chroma-palette-lab',
      category: 'web',
      colorBand: 'band-red',
      typeLabel: 'WEB APP',
      typeTagClass: 'tag-red',
      description: 'Algorithmic color science laboratory exploring OKLCH, CIELAB, and perceptual color uniformity for design systems.',
      tags: ['JavaScript', 'Color Science', 'OKLCH', 'PWA'],
      primaryLang: 'JavaScript',
      license: 'MIT',
      dependencies: '0 (Native Canvas)',
      stars: 198,
      forks: 15,
      githubUrl: 'https://github.com/octocat/chroma-palette-lab',
      demoUrl: 'https://github.com',
      highlights: [
        'Full implementation of OKLCH and CAM16 color models in vanilla ES6.',
        'Real-time gamut clipping and delta-E color distance visualization.',
        'Offline-capable PWA with service worker caching.'
      ]
    },
    {
      id: 'docker-minimalist',
      name: 'docker-minimalist',
      category: 'tools',
      colorBand: 'band-blue',
      typeLabel: 'CONTAINERS & CI',
      typeTagClass: 'tag-blue',
      description: 'A curated collection of micro-sized multi-stage Dockerfiles producing scratch and Alpine images under 5MB for polyglot runtimes.',
      tags: ['Docker', 'DevOps', 'Alpine', 'CI/CD'],
      primaryLang: 'Dockerfile / Shell',
      license: 'MIT',
      dependencies: 'None',
      stars: 412,
      forks: 52,
      githubUrl: 'https://github.com/octocat/docker-minimalist',
      demoUrl: 'https://github.com',
      highlights: [
        'Multi-stage build pipelines achieving non-root execution by default.',
        'Hardened base images with SBOM (Software Bill of Materials) generation.',
        'Automated vulnerability scanning through Trivy and GitHub Actions.'
      ]
    }
  ];

  /* --------------------------------------------------------------------------
     03. WEB AUDIO API SYNTHESIZER (Mechanical Bauhaus Clicks)
     -------------------------------------------------------------------------- */
  class SoundEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick(pitch = 800, duration = 0.04) {
      if (!STATE.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (_e) {
        // Silently continue if audio blocked by browser policy
      }
    }

    playSnap() {
      this.playClick(1200, 0.03);
    }

    playConfirm() {
      if (!STATE.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.06);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.15);
      } catch (_e) {}
    }
  }

  const sound = new SoundEngine();

  /* --------------------------------------------------------------------------
     04. INTERACTIVE KINETIC BAUHAUS CANVAS
     -------------------------------------------------------------------------- */
  class BauhausCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.nodes = [];
      this.mouse = { x: -1000, y: -1000, active: false };
      this.colors = ['#E63946', '#1D4ED8', '#F59E0B', '#111111'];

      this.initDimensions();
      this.createNodes();
      this.bindEvents();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initDimensions() {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * (window.devicePixelRatio || 1);
      this.canvas.height = rect.height * (window.devicePixelRatio || 1);
      this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      this.width = rect.width;
      this.height = rect.height;
    }

    createNodes() {
      this.nodes = [];
      for (let i = 0; i < CONFIG.maxCanvasNodes; i++) {
        this.nodes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() > 0.7 ? 4 : 2.5,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          shape: Math.random() > 0.5 ? 'circle' : 'square'
        });
      }
    }

    bindEvents() {
      const stage = document.getElementById('bauhausStage');
      if (!stage) return;

      stage.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.active = true;

        // Update CAD coordinates display in the hero
        const coordX = document.getElementById('coordX');
        const coordY = document.getElementById('coordY');
        if (coordX && coordY) {
          coordX.textContent = String(Math.floor(this.mouse.x)).padStart(3, '0');
          coordY.textContent = String(Math.floor(this.mouse.y)).padStart(3, '0');
        }
      });

      stage.addEventListener('mouseleave', () => {
        this.mouse.active = false;
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });

      window.addEventListener('resize', () => {
        this.initDimensions();
        this.createNodes();
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw subtle background geometric architectural grid
      this.drawGrid();

      // Update and draw nodes
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        // Boundary bounce
        if (node.x < 0 || node.x > this.width) node.vx *= -1;
        if (node.y < 0 || node.y > this.height) node.vy *= -1;

        // Mouse interaction: gentle repulsion
        if (this.mouse.active) {
          const dx = node.x - this.mouse.x;
          const dy = node.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.mouseRadius && dist > 0) {
            const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
            node.x += (dx / dist) * force * 1.5;
            node.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw connections between proximate nodes
        for (let j = i + 1; j < this.nodes.length; j++) {
          const other = this.nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.nodeConnectionDistance) {
            const alpha = 1 - (dist / CONFIG.nodeConnectionDistance);
            this.ctx.strokeStyle = `rgba(17, 17, 17, ${alpha * 0.18})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (this.mouse.active) {
          const dx = node.x - this.mouse.x;
          const dy = node.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.mouseRadius) {
            const alpha = 1 - (dist / CONFIG.mouseRadius);
            this.ctx.strokeStyle = `rgba(230, 57, 70, ${alpha * 0.4})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        }

        // Draw the geometric node
        this.ctx.fillStyle = node.color;
        if (node.shape === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.fillRect(node.x - node.radius, node.y - node.radius, node.radius * 2, node.radius * 2);
        }
      }

      requestAnimationFrame(this.animate);
    }

    drawGrid() {
      const step = 40;
      this.ctx.strokeStyle = 'rgba(17, 17, 17, 0.03)';
      this.ctx.lineWidth = 1;

      for (let x = 0; x < this.width; x += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
      for (let y = 0; y < this.height; y += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }
    }
  }

  /* --------------------------------------------------------------------------
     05. KINETIC BAUHAUS ART COMPOSER (Interactive Sculpture Shuffle)
     -------------------------------------------------------------------------- */
  function initArtComposer() {
    const shuffleBtn = document.getElementById('shuffleArtBtn');
    const wheel = document.getElementById('wheelElement');
    const square = document.getElementById('geoSquare');
    const triangle = document.getElementById('geoTriangle');
    const pillar = document.getElementById('geoPillar');
    const hollow = document.getElementById('geoHollow');

    if (!shuffleBtn) return;

    shuffleBtn.addEventListener('click', () => {
      sound.playSnap();

      // Generate dynamic random Bauhaus spatial coordinates
      const wheelRot = Math.floor(Math.random() * 360);
      const squareRot = Math.floor(Math.random() * 360);
      const squareScale = (0.8 + Math.random() * 0.4).toFixed(2);
      const squareX = (Math.random() * 60 - 30).toFixed(0);
      const squareY = (Math.random() * 60 - 30).toFixed(0);

      const triRot = (Math.random() * 60 - 30).toFixed(0);
      const triY = (Math.random() * 50 - 25).toFixed(0);

      const hollowScale = (0.7 + Math.random() * 0.6).toFixed(2);

      if (wheel) wheel.style.transform = `rotate(${wheelRot}deg)`;
      if (square) square.style.transform = `translate(${squareX}px, ${squareY}px) rotate(${squareRot}deg) scale(${squareScale})`;
      if (triangle) triangle.style.transform = `translateY(${triY}px) rotate(${triRot}deg)`;
      if (pillar) pillar.style.transform = `translateY(${Math.random() > 0.5 ? -10 : 10}px)`;
      if (hollow) hollow.style.transform = `scale(${hollowScale})`;

      showToast('Geometric composition reordered: Bauhaus synthesis updated.');
    });
  }

  /* --------------------------------------------------------------------------
     06. REPOSITORY RENDERING & FILTERING
     -------------------------------------------------------------------------- */
  function renderProjects(projectsToRender) {
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');
    if (!grid) return;

    grid.innerHTML = '';

    if (!projectsToRender || projectsToRender.length === 0) {
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    projectsToRender.forEach((repo) => {
      const card = document.createElement('article');
      card.className = 'repo-card';
      card.setAttribute('data-id', repo.id);
      card.setAttribute('data-category', repo.category);

      const tagsHtml = (repo.tags || [])
        .map((tag) => `<span class="tag-badge">${escapeHtml(tag)}</span>`)
        .join('');

      card.innerHTML = `
        <div class="card-band ${repo.colorBand || 'band-black'}"></div>
        <div class="card-inner">
          <div class="card-top-meta">
            <span class="repo-type-tag ${repo.typeTagClass || 'tag-black'}">${escapeHtml(repo.typeLabel || 'REPOSITORY')}</span>
            <div class="repo-stats">
              <span class="repo-stat-item" title="GitHub Stars">
                ★ ${repo.stars || 0}
              </span>
              <span class="repo-stat-item" title="Forks">
                ⑂ ${repo.forks || 0}
              </span>
            </div>
          </div>

          <h3 class="repo-title">
            <a href="${escapeHtml(repo.githubUrl)}" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(repo.name)}
            </a>
          </h3>

          <p class="repo-desc">${escapeHtml(repo.description)}</p>

          <div class="card-tags">
            ${tagsHtml}
          </div>

          <div class="card-actions">
            <a href="${escapeHtml(repo.demoUrl || repo.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card btn-card-demo">
              DEMO ↗
            </a>
            <a href="${escapeHtml(repo.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card btn-card-git" title="View Source on GitHub">
              REPO ↗
            </a>
            <button type="button" class="btn-card btn-card-info" data-action="quickview" data-id="${escapeHtml(repo.id)}" title="View Architectural Specifications">
              INFO ℹ
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Update filter counts
    updateFilterCounts();
  }

  function filterProjects() {
    const filtered = STATE.repos.filter((repo) => {
      const matchCategory =
        STATE.activeFilter === 'all' || repo.category === STATE.activeFilter;

      const q = STATE.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        repo.name.toLowerCase().includes(q) ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.tags && repo.tags.some((t) => t.toLowerCase().includes(q))) ||
        (repo.primaryLang && repo.primaryLang.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });

    renderProjects(filtered);
  }

  function updateFilterCounts() {
    const total = STATE.repos.length;
    const web = STATE.repos.filter((r) => r.category === 'web').length;
    const tools = STATE.repos.filter((r) => r.category === 'tools').length;
    const systems = STATE.repos.filter((r) => r.category === 'systems').length;
    const creative = STATE.repos.filter((r) => r.category === 'creative').length;

    const countAll = document.getElementById('countAll');
    const countWeb = document.getElementById('countWeb');
    const countTools = document.getElementById('countTools');
    const countSystems = document.getElementById('countSystems');
    const countCreative = document.getElementById('countCreative');

    if (countAll) countAll.textContent = `(${total})`;
    if (countWeb) countWeb.textContent = `(${web})`;
    if (countTools) countTools.textContent = `(${tools})`;
    if (countSystems) countSystems.textContent = `(${systems})`;
    if (countCreative) countCreative.textContent = `(${creative})`;
  }

  /* --------------------------------------------------------------------------
     07. DYNAMIC GITHUB API INTEGRATION
     -------------------------------------------------------------------------- */
  async function fetchGithubUserRepos(username) {
    if (!username || STATE.isSyncing) return;
    STATE.isSyncing = true;

    showToast(`Connecting to GitHub API for '${username}'...`);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user '${username}' not found.`);
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit reached. Reverting to curated archive.');
        } else {
          throw new Error(`HTTP Error ${response.status}`);
        }
      }

      const rawRepos = await response.json();
      if (!Array.isArray(rawRepos) || rawRepos.length === 0) {
        throw new Error(`No public repositories found for '${username}'.`);
      }

      // Map GitHub API response into Bauhaus project schema
      const mappedRepos = rawRepos.map((r, index) => {
        const bands = ['band-red', 'band-blue', 'band-yellow', 'band-black'];
        const tagClasses = ['tag-red', 'tag-blue', 'tag-yellow', 'tag-black'];

        const lang = r.language || 'Code';
        let inferredCategory = 'tools';
        if (['HTML', 'CSS', 'JavaScript', 'Vue', 'React'].includes(lang)) inferredCategory = 'web';
        if (['Rust', 'Go', 'C', 'C++', 'Shell'].includes(lang)) inferredCategory = 'systems';
        if (['GLSL', 'Processing', 'Python'].includes(lang)) inferredCategory = 'creative';

        return {
          id: String(r.id),
          name: r.name,
          category: inferredCategory,
          colorBand: bands[index % bands.length],
          typeLabel: inferredCategory.toUpperCase(),
          typeTagClass: tagClasses[index % tagClasses.length],
          description: r.description || 'Public open-source repository on GitHub.',
          tags: [lang, ...(r.topics || [])].slice(0, 4),
          primaryLang: lang,
          license: r.license ? r.license.spdx_id || r.license.name : 'Open Source',
          dependencies: 'Standard Runtime',
          stars: r.stargazers_count,
          forks: r.forks_count,
          githubUrl: r.html_url,
          demoUrl: r.homepage || r.html_url,
          highlights: [
            `Default branch: ${r.default_branch || 'main'}.`,
            `Open issues count: ${r.open_issues_count}.`,
            `Created: ${new Date(r.created_at).toLocaleDateString()} // Updated: ${new Date(r.updated_at).toLocaleDateString()}.`
          ]
        };
      });

      STATE.repos = mappedRepos;
      STATE.customGithubUser = username;

      // Update header GitHub link
      const headerLink = document.getElementById('headerGithubLink');
      if (headerLink) {
        headerLink.href = `https://github.com/${username}`;
      }

      const totalStars = mappedRepos.reduce((acc, curr) => acc + (curr.stars || 0), 0);
      const starBadge = document.getElementById('globalStarCount');
      if (starBadge) {
        starBadge.textContent = `★ ${totalStars}`;
      }

      const statRepoCount = document.getElementById('statRepoCount');
      if (statRepoCount) {
        statRepoCount.textContent = `${mappedRepos.length}`;
      }

      // Reset filters and render
      STATE.activeFilter = 'all';
      resetFilterUI();
      filterProjects();

      sound.playConfirm();
      showToast(`Loaded ${mappedRepos.length} live repositories for '${username}'.`);
    } catch (err) {
      sound.playClick(300, 0.1);
      showToast(`GitHub Sync Error: ${err.message}`);
      console.warn('GitHub API sync fallback:', err);
    } finally {
      STATE.isSyncing = false;
      const syncPanel = document.getElementById('syncPanel');
      if (syncPanel) syncPanel.hidden = true;
    }
  }

  function resetFilterUI() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach((c) => {
      const isAll = c.getAttribute('data-filter') === 'all';
      c.classList.toggle('active', isAll);
      c.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });
  }

  /* --------------------------------------------------------------------------
     08. PROJECT DETAIL MODAL
     -------------------------------------------------------------------------- */
  function openProjectModal(repoId) {
    const repo = STATE.repos.find((r) => r.id === repoId);
    if (!repo) return;

    sound.playSnap();

    const modal = document.getElementById('projectModal');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalStars = document.getElementById('modalStars');
    const modalDesc = document.getElementById('modalDesc');
    const modalLanguage = document.getElementById('modalLanguage');
    const modalLicense = document.getElementById('modalLicense');
    const modalDependencies = document.getElementById('modalDependencies');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalCloneCmd = document.getElementById('modalCloneCmd');
    const modalRepoLink = document.getElementById('modalRepoLink');
    const modalDemoLink = document.getElementById('modalDemoLink');

    if (modalTag) modalTag.textContent = repo.typeLabel || 'REPOSITORY';
    if (modalTitle) modalTitle.textContent = repo.name;
    if (modalStars) modalStars.textContent = `★ ${repo.stars} STARS  //  ⑂ ${repo.forks} FORKS`;
    if (modalDesc) modalDesc.textContent = repo.description;
    if (modalLanguage) modalLanguage.textContent = repo.primaryLang || 'TypeScript';
    if (modalLicense) modalLicense.textContent = repo.license || 'MIT';
    if (modalDependencies) modalDependencies.textContent = repo.dependencies || 'Zero external libraries';

    if (modalHighlights && repo.highlights) {
      modalHighlights.innerHTML = repo.highlights
        .map((h) => `<li>${escapeHtml(h)}</li>`)
        .join('');
    }

    const cloneCommand = `git clone ${repo.githubUrl}.git`;
    if (modalCloneCmd) modalCloneCmd.textContent = cloneCommand;
    if (modalRepoLink) modalRepoLink.href = repo.githubUrl;
    if (modalDemoLink) modalDemoLink.href = repo.demoUrl || repo.githubUrl;

    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      // Focus close button for accessibility
      const closeBtn = document.getElementById('modalCloseBtn');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal && !modal.hidden) {
      sound.playClick(400, 0.03);
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  /* --------------------------------------------------------------------------
     09. INTERACTIVE DEVELOPER TERMINAL
     -------------------------------------------------------------------------- */
  function initTerminal() {
    const form = document.getElementById('terminalForm');
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    const chips = document.querySelectorAll('.term-chip');
    const dotRed = document.getElementById('termDotRed');

    if (!form || !input || !output) return;

    function appendLine(content, cssClass = '') {
      const line = document.createElement('div');
      line.className = `term-line ${cssClass}`;
      line.innerHTML = content;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }

    function executeCommand(rawCmd) {
      const cmd = rawCmd.trim();
      if (!cmd) return;

      sound.playClick(600, 0.02);

      // Print prompt echo
      appendLine(`<span class="t-usr">developer@werkstatt</span>:<span class="t-dir">~</span>$ ${escapeHtml(cmd)}`, 'output-prompt');

      const parts = cmd.split(' ');
      const action = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').trim();

      switch (action) {
        case 'help':
          appendLine('AVAILABLE SYSTEM COMMANDS:', 'output-system');
          appendLine('  <span class="term-highlight">help</span>               - List all supported shell commands');
          appendLine('  <span class="term-highlight">repos</span>              - Print catalog of open-source projects');
          appendLine('  <span class="term-highlight">clone &lt;repo&gt;</span>        - Copy git clone instructions for a repository');
          appendLine('  <span class="term-highlight">philosophy</span>         - Print Walter Gropius Bauhaus Manifesto extract');
          appendLine('  <span class="term-highlight">skills</span>             - Print technical competencies');
          appendLine('  <span class="term-highlight">contact</span>            - Output correspondence coordinates');
          appendLine('  <span class="term-highlight">date</span>               - Print current ISO timestamp');
          appendLine('  <span class="term-highlight">whoami</span>             - Print identity credentials');
          appendLine('  <span class="term-highlight">clear</span>              - Clear terminal display buffer');
          break;

        case 'repos':
          appendLine(`WERKSTATT REPOSITORIES (${STATE.repos.length} TOTAL):`, 'output-info');
          STATE.repos.forEach((r, idx) => {
            appendLine(`  [${String(idx + 1).padStart(2, '0')}] <span class="term-highlight">${escapeHtml(r.name)}</span> (${escapeHtml(r.primaryLang)}) - ★ ${r.stars}`);
          });
          break;

        case 'clone':
          if (!arg) {
            appendLine('Usage: clone &lt;repo-name&gt; (e.g. clone hypergrid-engine)', 'output-error');
          } else {
            const found = STATE.repos.find((r) => r.name.toLowerCase().includes(arg.toLowerCase()));
            const targetUrl = found ? found.githubUrl : `https://github.com/octocat/${arg}`;
            const cloneCmd = `git clone ${targetUrl}.git`;
            copyToClipboard(cloneCmd);
            appendLine(`Copied to clipboard: <span class="term-highlight">${cloneCmd}</span>`, 'output-success');
          }
          break;

        case 'philosophy':
          appendLine('"Art and technology: a new unity. Form follows function. Zero bloat."', 'output-system');
          appendLine('— Walter Gropius & Bauhaus Masters of Digital Form, 1919-2026', 'output-info');
          break;

        case 'skills':
          appendLine('PRIMARY STACK & RUNTIMES:', 'output-info');
          appendLine('  [LANGUAGES]    TypeScript, Rust, Go, Python 3, Modern CSS');
          appendLine('  [SYSTEMS]      WebGL, Canvas 2D, Node.js, Web Workers, Linux');
          appendLine('  [DEPLOYMENT]   GitHub Pages, GitHub Actions CI, Docker');
          break;

        case 'contact':
          appendLine('CHANNELS FOR CORRESPONDENCE:', 'output-info');
          appendLine('  Email:   contact@werkstatt.dev');
          appendLine('  GitHub:  https://github.com');
          appendLine('  Status:  Available for high-impact contracts & systems work');
          break;

        case 'date':
          appendLine(new Date().toISOString(), 'output-system');
          break;

        case 'whoami':
          appendLine('developer@werkstatt [UID=1000 GID=1000] // Bauhaus Web Craftsman', 'output-system');
          break;

        case 'clear':
          output.innerHTML = '';
          appendLine('Terminal display buffer cleared.', 'output-system');
          break;

        default:
          appendLine(`command not found: ${escapeHtml(action)}. Type 'help' for available commands.`, 'output-error');
          break;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      executeCommand(val);
    });

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) executeCommand(cmd);
      });
    });

    if (dotRed) {
      dotRed.addEventListener('click', () => {
        output.innerHTML = '';
        appendLine('Terminal display buffer cleared.', 'output-system');
      });
    }
  }

  /* --------------------------------------------------------------------------
     10. CLIPBOARD HELPER & TOAST NOTIFICATION
     -------------------------------------------------------------------------- */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: "${text}"`);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Copied: "${text}"`);
    } catch (_e) {
      showToast('Failed to copy to clipboard.');
    }
    document.body.removeChild(ta);
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.hidden = false;

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     11. UTILITY: HTML ESCAPING
     -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* --------------------------------------------------------------------------
     12. EVENT LISTENERS & INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize projects state with curated projects
    STATE.repos = [...CURATED_PROJECTS];
    renderProjects(STATE.repos);

    // 2. Initialize interactive kinetic canvas
    new BauhausCanvas('bauhausCanvas');

    // 3. Initialize art composer shuffle
    initArtComposer();

    // 4. Initialize terminal
    initTerminal();

    // 5. Sound toggle button
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        STATE.soundEnabled = !STATE.soundEnabled;
        soundToggle.classList.toggle('sound-on', STATE.soundEnabled);
        if (STATE.soundEnabled) {
          sound.playConfirm();
          showToast('Mechanical sound effects enabled.');
        } else {
          showToast('Sound feedback muted.');
        }
      });
    }

    // 6. Filter chips click handling
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        sound.playSnap();
        filterChips.forEach((c) => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        STATE.activeFilter = chip.getAttribute('data-filter') || 'all';
        filterProjects();
      });
    });

    // 7. Search input handling with live filtering
    const searchInput = document.getElementById('projectSearch');
    const searchClear = document.getElementById('searchClear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        STATE.searchQuery = e.target.value;
        if (searchClear) searchClear.hidden = !STATE.searchQuery;
        filterProjects();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          STATE.searchQuery = '';
          searchClear.hidden = true;
          filterProjects();
          searchInput.focus();
        }
      });
    }

    // Reset filter button in empty state
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        STATE.activeFilter = 'all';
        STATE.searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.hidden = true;
        resetFilterUI();
        filterProjects();
      });
    }

    // 8. Dynamic GitHub sync panel toggles
    const syncGithubBtn = document.getElementById('syncGithubBtn');
    const syncPanel = document.getElementById('syncPanel');
    const btnSyncSubmit = document.getElementById('btnSyncSubmit');
    const btnSyncCancel = document.getElementById('btnSyncCancel');
    const ghUsernameInput = document.getElementById('ghUsernameInput');

    if (syncGithubBtn && syncPanel) {
      syncGithubBtn.addEventListener('click', () => {
        sound.playSnap();
        syncPanel.hidden = !syncPanel.hidden;
        if (!syncPanel.hidden && ghUsernameInput) {
          ghUsernameInput.focus();
        }
      });
    }

    if (btnSyncCancel && syncPanel) {
      btnSyncCancel.addEventListener('click', () => {
        syncPanel.hidden = true;
      });
    }

    if (btnSyncSubmit && ghUsernameInput) {
      const handleSync = () => {
        const u = ghUsernameInput.value.trim();
        if (u) {
          fetchGithubUserRepos(u);
        } else {
          showToast('Please enter a valid GitHub username.');
        }
      };

      btnSyncSubmit.addEventListener('click', handleSync);
      ghUsernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSync();
      });
    }

    // 9. Delegated click on project cards for quickview / modal
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
      projectsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="quickview"]');
        if (btn) {
          const repoId = btn.getAttribute('data-id');
          if (repoId) openProjectModal(repoId);
        }
      });
    }

    // 10. Modal close and copy handlers
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const projectModal = document.getElementById('projectModal');
    const modalCopyBtn = document.getElementById('modalCopyBtn');
    const modalCloneCmd = document.getElementById('modalCloneCmd');

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    if (projectModal) {
      projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
      });
    }

    if (modalCopyBtn && modalCloneCmd) {
      modalCopyBtn.addEventListener('click', () => {
        sound.playConfirm();
        copyToClipboard(modalCloneCmd.textContent);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
        const drawer = document.getElementById('mobileDrawer');
        if (drawer && drawer.classList.contains('open')) {
          closeMobileDrawer();
        }
      }
    });

    // 11. Mobile drawer hamburger navigation
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileDrawer() {
      sound.playSnap();
      if (mobileDrawer) {
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
      sound.playClick(400, 0.03);
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeMobileDrawer();
        } else {
          openMobileDrawer();
        }
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileDrawer);
    });

    // 12. Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        sound.playSnap();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 13. Active scrollspy on navbar links & sticky shadow
    const header = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;

      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${id}`);
          });
        }
      });
    });

    // 14. Floating interactive badge in hero visual
    const interactiveBadge = document.getElementById('interactiveBadge');
    if (interactiveBadge) {
      interactiveBadge.addEventListener('click', () => {
        sound.playConfirm();
        showToast('Bauhaus Werkstatt active: Move your cursor to bend geometric field lines.');
      });
    }
  });
})();