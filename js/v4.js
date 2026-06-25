/* Portfolio v4 — Main JS */

// ─── Disable context menu ─────────────────────────────────────────────────────
document.addEventListener('contextmenu', e => e.preventDefault());

// ─── Loader ───────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 700);
});

// ─── Clean URL — support incoming /#ancre links from external sites ───────────
(function () {
  const hash = window.location.hash;
  if (!hash) return;
  history.replaceState(null, '', window.location.pathname + window.location.search);
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  window.addEventListener('load', () => setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 150));
})();

// ─── Scroll progress + sidebar form ───────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
const sidebar     = document.getElementById('sidebar');
const topbar      = document.getElementById('mobile-topbar');

function updateSidebarForm() {
  const t = Math.min(1, window.scrollY / (window.innerHeight * 0.35));
  const collapsed = t < 1;
  sidebar.classList.toggle('collapsed', collapsed);
  sidebar.style.setProperty('--sidebar-t', t.toFixed(3));
  const isDesktop = window.innerWidth >= 992;
  sidebar.style.background = (collapsed && isDesktop) ? `rgba(22,78,66,${t.toFixed(3)})` : '';
  topbar.style.setProperty('--topbar-t', t.toFixed(3));
}
updateSidebarForm();

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';

  updateSidebarForm();

  // When the page can't scroll further, force the last section active
  if (total > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
    sidebarLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#cv'));
  }
}, { passive: true });

// ─── Scroll spy (sidebar links) ───────────────────────────────────────────────
const sidebarLinks = document.querySelectorAll('.sidebar-link');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      sidebarLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

document.querySelectorAll('section[id]').forEach(s => spyObserver.observe(s));

// ─── Mobile sidebar ───────────────────────────────────────────────────────────
const burger  = document.getElementById('burger');
const overlay = document.getElementById('nav-overlay');

let menuPushedState = false;

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  history.pushState({ menuOpen: true }, '');
  menuPushedState = true;
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (menuPushedState) {
    menuPushedState = false;
    history.back();
  }
}

// Intercept Android back button when menu is open
window.addEventListener('popstate', () => {
  menuPushedState = false;
  if (sidebar.classList.contains('open')) closeSidebar();
});

burger.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
overlay.addEventListener('click', closeSidebar);

// Intercept all sidebar nav clicks to keep URL clean
sidebarLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  const target = document.getElementById(l.getAttribute('href').slice(1));
  if (window.innerWidth <= 991) {
    closeSidebar();
    // Délai pour laisser history.back() se terminer avant de scroller
    setTimeout(() => {
      target?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }, 50);
  } else {
    target?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}));

// Brand links — keep URL clean
document.querySelector('.sidebar-brand')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  history.replaceState(null, '', window.location.pathname + window.location.search);
  if (window.innerWidth <= 991) closeSidebar();
});

document.querySelector('.mobile-brand')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', window.location.pathname + window.location.search);
});

// ─── Reveal on scroll ─────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Projects data ────────────────────────────────────────────────────────────
const projects = [
  {
    name: 'Tonight',
    type: 'Application mobile',
    category: 'mobile',
    img: './assets/img/projets/tonight.png',
    desc: 'Application mobile contenant les meilleurs jeux de soirée à jouer entre amis. 100% gratuit, sans publicités.',
    stack: ['React Native', 'Express.js'],
    links: [
      { icon: 'ph ph-globe', url: 'https://playtonight.app/', title: 'Site web' },
      { icon: 'ph ph-download-simple', url: 'https://playtonight.app/download', title: 'Télécharger' }
    ]
  },
  {
    name: 'Stories',
    type: 'Programme',
    category: 'program',
    img: './assets/img/projets/stories.png',
    desc: 'Télécharge les stories Instagram à la une via webscraping pour les conserver localement.',
    stack: ['PHP', 'Python'],
    links: []
  },
  {
    name: 'Note2Film v3',
    type: 'Application mobile',
    category: 'mobile',
    img: './assets/img/projets/note2filmv2.png',
    desc: 'Refonte complète de Note2Film avec l\'IA pour un résultat proche des grands réseaux sociaux professionnels.',
    stack: ['React Native', 'Express.js'],
    links: [
      { icon: 'ph ph-globe', url: 'https://note2film.fr/', title: 'Site web' },
      { icon: 'ph ph-download-simple', url: 'https://note2film.fr/download', title: 'Télécharger' }
    ]
  },
  {
    name: 'Chaoui',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/chaoui.png',
    desc: 'Adaptation du jeu de cartes Chaoui réalisée lors de mon semestre d\'échange à la Louisiana State University.',
    stack: ['HTML/CSS/JS', 'Firebase'],
    links: [
      { icon: 'ph ph-globe', url: 'https://odyrac.github.io/CSC4330/', title: 'Site web' }
    ]
  },
  {
    name: 'AUTH',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/auth.png',
    desc: 'Système d\'authentification unifié pour l\'ensemble de mes projets.',
    stack: ['HTML/CSS/JS', 'PHP', 'MongoDB'],
    links: [
      { icon: 'ph ph-globe', url: 'https://auth.hlly.fr/', title: 'Site web' }
    ]
  },
  {
    name: 'Transfer Now',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/tnow.png',
    desc: 'Transfert d\'éléments entre vos appareils, simplement et rapidement.',
    stack: ['HTML/CSS/JS', 'PHP'],
    links: [
      { icon: 'ph ph-globe', url: 'https://tnow.hlly.fr/', title: 'Site web' },
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/tnow', title: 'GitHub' }
    ]
  },
  {
    name: "Bluff'UTT",
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/bluffutt.png',
    desc: 'Gestion du club de poker de l\'UTT : soirées, classements et statistiques.',
    stack: ['HTML/CSS/JS', 'PHP'],
    links: [
      { icon: 'ph ph-globe', url: 'https://bluffutt.hlly.fr/', title: 'Site web' },
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/BluffUTTWeb-v2', title: 'GitHub' }
    ]
  },
  {
    name: 'XYPASS v3',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/xypassv3.png',
    desc: 'Gestionnaire de mots de passe épuré, concentré sur les fonctionnalités essentielles.',
    stack: ['HTML/CSS/JS', 'PHP', 'MongoDB'],
    links: [
      { icon: 'ph ph-globe', url: 'https://xypass.hlly.fr/', title: 'Site web' }
    ]
  },
  {
    name: 'MyBank',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/mybank.png',
    desc: 'Gestion de patrimoine : suivez vos comptes et leur évolution dans le temps.',
    stack: ['HTML/CSS/JS', 'PHP', 'MongoDB'],
    links: [
      { icon: 'ph ph-globe', url: 'https://mybank.hlly.fr/', title: 'Site web' }
    ]
  },
  {
    name: 'Note2Film v2',
    type: 'Application mobile',
    category: 'mobile',
    img: './assets/img/projets/note2filmv2.png',
    desc: 'Refonte de Note2Film avec 500+ comptes : nouvelle interface et fonctionnalités sociales.',
    stack: ['React Native', 'Express.js'],
    links: [
      { icon: 'ph ph-globe', url: 'https://note2film.hlly.fr/', title: 'Site web' },
      { icon: 'ph ph-download-simple', url: 'https://note2film.hlly.fr/download.php', title: 'Télécharger' }
    ]
  },
  {
    name: 'BUDiscovery',
    type: 'Application tablette',
    category: 'mobile',
    img: './assets/img/projets/budiscovery.png',
    desc: 'Jeu de piste pour faire découvrir la bibliothèque universitaire aux nouveaux étudiants de l\'UTT.',
    stack: ['React Native', 'PHP'],
    links: [
      { icon: 'ph ph-globe', url: 'https://budiscovery.hlly.fr/', title: 'Site web' },
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/BUDiscovery', title: 'GitHub' }
    ]
  },
  {
    name: 'NoReels',
    type: 'Application mobile',
    category: 'mobile',
    img: './assets/img/projets/noreels.png',
    desc: 'Bloque les Reels sur Instagram & YouTube pour éviter les distractions.',
    stack: ['Java (Android)'],
    links: [
      { icon: 'ph ph-globe', url: 'https://noreels.hlly.fr/', title: 'Site web' },
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/NoReels', title: 'GitHub' }
    ]
  },
  {
    name: 'Karmaka',
    type: 'Programme',
    category: 'program',
    img: './assets/img/projets/karmaka.png',
    desc: 'Jeu de société Karmaka transposé en Java dans le cadre d\'un projet universitaire (semestre A23).',
    stack: ['Java'],
    links: [
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/LO02-Karmaka', title: 'GitHub' }
    ]
  },
  {
    name: 'InstaEyes',
    type: 'Programme',
    category: 'program',
    img: './assets/img/projets/instaeyes.png',
    desc: 'Outil de statistiques sur vos données Instagram (messages, vocaux, durées...).',
    stack: ['Node.js'],
    links: []
  },
  {
    name: 'Connect 4',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/connect4.png',
    desc: 'Puissance 4 développé en 3 heures dans le cadre d\'un entretien de stage.',
    stack: ['HTML/CSS/JS'],
    links: [
      { icon: 'ph ph-globe', url: 'https://connect4.hlly.fr/', title: 'Site web' }
    ]
  },
  {
    name: 'Note2Film',
    type: 'Application mobile',
    category: 'mobile',
    img: './assets/img/projets/note2film.png',
    desc: 'Version originale : répertoire de films et séries réalisé lors du semestre A22 à l\'UTT.',
    stack: ['React Native', 'Express.js', 'MongoDB', 'PHP'],
    links: [
      { icon: 'ph ph-globe', url: 'https://note2film.hlly.fr/v1/', title: 'Site web' }
    ]
  },
  {
    name: 'XYPASS v2',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/xypass.png',
    desc: 'Gestionnaire de mots de passe en ligne, successeur de Oxygen PY.',
    stack: ['HTML/CSS/JS', 'PHP', 'MongoDB'],
    links: []
  },
  {
    name: 'TapSpeed',
    type: 'Site web',
    category: 'web',
    img: './assets/img/projets/tapspeed.png',
    desc: 'Mini-jeu pour tester vos réflexes et votre réactivité entre amis.',
    stack: ['HTML/CSS/JS', 'PHP', 'MongoDB'],
    links: [
      { icon: 'ph ph-globe', url: 'https://tapspeed.hlly.fr/', title: 'Site web' }
    ]
  },
  {
    name: 'Jeu de fléchettes',
    type: 'Logiciel',
    category: 'program',
    img: './assets/img/projets/jeuflechettes.png',
    desc: 'Jeu de fléchettes réalisé en Python lors du semestre A21 à l\'UTT.',
    stack: ['Python', 'Tkinter'],
    links: []
  },
  {
    name: 'Oxygen PY',
    type: 'Logiciel',
    category: 'program',
    img: './assets/img/projets/oxygenpy.png',
    desc: 'Premier gestionnaire de mots de passe, distribué sur Windows. Ancêtre de XYPASS.',
    stack: ['Python', 'Tkinter', 'MongoDB'],
    links: []
  },
  {
    name: 'ScamTracker',
    type: 'Bot Discord',
    category: 'bot',
    img: './assets/img/projets/scamtracker.png',
    desc: 'Répertorie les mauvais joueurs sur Hypixel. Impact : 12 000+ personnes.',
    stack: ['JavaScript', 'discord.js', 'MongoDB'],
    links: [
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/ScamTracker-v2', title: 'GitHub' }
    ]
  },
  {
    name: 'SkyBlock Sniper',
    type: 'Bot Discord',
    category: 'bot',
    img: './assets/img/projets/sbsniper.png',
    desc: 'Traque les sous-cotations dans Hypixel SkyBlock pour réaliser de bonnes affaires.',
    stack: ['JavaScript', 'discord.js'],
    links: [
      { icon: 'ph ph-github-logo', url: 'https://github.com/Odyrac/SBSniper', title: 'GitHub' }
    ]
  }
];

// ─── Render projects ──────────────────────────────────────────────────────────
function renderProjects(filter, immediate) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  const list = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  list.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.setAttribute('role', 'listitem');
    card.style.transitionDelay = (i * 45) + 'ms';

    const linksHtml = p.links.map(l =>
      `<a href="${l.url}" ${l.local ? '' : 'target="_blank" rel="noopener"'} class="project-link" title="${l.title}">
         <i class="${l.icon}"></i>
       </a>`
    ).join('');

    const stackHtml = p.stack.map(s => `<span class="stack-tag">${s}</span>`).join('');

    card.innerHTML = `
      <div class="project-header">
        <img src="${p.img}" alt="${p.name}" class="project-icon" loading="lazy">
        <div class="project-meta">
          <div class="project-name">${p.name}</div>
          <div class="project-type">${p.type}</div>
        </div>
      </div>
      <p class="project-desc">${p.desc}</p>
      <div class="project-stack">${stackHtml}</div>
      ${linksHtml ? `<div class="project-links">${linksHtml}</div>` : ''}
    `;

    grid.appendChild(card);

    if (immediate) {
      setTimeout(() => card.classList.add('visible'), i * 45);
    } else {
      revealObserver.observe(card);
    }
  });
}

// ─── Filter buttons ───────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter, true);
  });
});

renderProjects('all', false);
