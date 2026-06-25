// ── Guide d'ajout d'un nouveau pays ─────────────────────────────────────────
// 1. MARQUEUR (épingle sur la carte) :
//      Ajouter un objet dans `markers` :
//        { name: 'Tokyo', coords: [35.7, 139.7] }
//      - name   : nom affiché dans le tooltip
//      - coords : [latitude, longitude]
//
// 2. PAYS COLORIÉ :
//      Ajouter le code ISO 3166-1 alpha-2 du pays dans `country_visited`
//      ex. 'JP' pour le Japon (référence : countrycode.org)
//
// Un marqueur et un pays colorié sont indépendants — tu peux avoir l'un
// sans l'autre (ex. ville dans un pays déjà listé, ou pays sans marqueur).
// ────────────────────────────────────────────────────────────────────────────


// ── Marqueurs (épingles) ─────────────────────────────────────────────────────

var markers = [
  { name: 'France',       coords: [47,    2.5]   },
  { name: 'Espagne',      coords: [40.5, -3.5]   },
  { name: 'Namibie',      coords: [-23,  17.2]   },
  { name: 'Berlin',       coords: [52.5, 13.4]   },
  { name: 'New York',     coords: [40.7, -74]    },
  { name: 'Las Vegas',    coords: [36.1, -115.2] },
  { name: 'Chicago',      coords: [41.8, -87.6]  },
  { name: 'Bâton-Rouge',  coords: [30.5, -91.1]  },
  { name: 'Houston',      coords: [29.7, -95.3]  },
  { name: 'Dallas',       coords: [32.8, -96.8]  },
  { name: 'Austin',       coords: [30.3, -97.7]  },
  { name: 'Maroc',        coords: [31,   -7]     },
  { name: 'Italie',       coords: [42.5, 13]     },
  { name: 'Portugal',     coords: [40,   -8.2]   },
  { name: 'Maldives',     coords: [3,    76]     },
  { name: 'Sri Lanka',    coords: [7.8,  80.7]   },
  { name: 'Costa Rica',   coords: [9.8,  -83.7]  },
  { name: 'Réunion',      coords: [-21,  55]     },
  { name: 'Île Maurice',  coords: [-19,  59]     },
  { name: 'Chypre',       coords: [34.9, 33.1]   },
  { name: 'Irlande',      coords: [53.4, -7.9]   },
  { name: 'Royaume-Uni',  coords: [52.9, -1.4]   },
  { name: 'Malte',        coords: [36,   14.5]   },
  { name: 'Vietnam',      coords: [14,  108.3]   },
  { name: 'Luxembourg',   coords: [49.8,  6.1]   },
  { name: 'Crète',        coords: [35.2, 24.9]   },
  { name: 'Cyclades',     coords: [37,   25]     },
  { name: 'Ouzbékistan',  coords: [41.5, 64.3]   },
];


// ── Pays colorés — codes ISO 3166-1 alpha-2 ──────────────────────────────────
// Note : la Guyane française est masquée dans world.js (code GUF)

var country_visited = [
  'FR', 'ES', 'NA', 'DE', 'US',
  'MA', 'IT', 'PT', 'LK', 'CR',
  'CY', 'IE', 'GR', 'GB', 'VN',
  'LU', 'UZ',
];


// ── Initialisation de la carte ───────────────────────────────────────────────

var map = new jsVectorMap({
  map: 'world',
  selector: '#map',
  draggable: true,
  zoomButtons: true,
  zoomOnScroll: false, // désactivé : le scroll de page déclenchait un zoom intempestif
  zoomOnScrollSpeed: 3,
  zoomMax: 12,
  zoomMin: 1,
  zoomAnimate: true,
  showTooltip: true,
  zoomStep: 1.5,
  bindTouchEvents: true,

  lineStyle: {
    stroke: '#808080',
    strokeWidth: 1,
    strokeLinecap: 'round',
  },

  markerStyle: {
    initial: {
      r: 7,
      fill: '#ff7967',
      fillOpacity: 1,
      stroke: '#FFF',
      strokeWidth: 5,
      strokeOpacity: .5,
    },
    hover: {
      fill: '#black',
      cursor: 'pointer',
    },
    selected: { fill: 'blue' },
    selectedHover: {},
  },

  markersSelectable: false,

  markerLabelStyle: {
    initial: {
      fontFamily: 'Verdana',
      fontSize: 12,
      fontWeight: 500,
      cursor: 'default',
      fill: '#164E42',
    },
    hover: { cursor: 'pointer' },
    selected: {},
    selectedHover: {},
  },

  markers: markers,
  labels: {},

  regionsSelectable: false,
  regionsSelectableOne: false,

  regionStyle: {
    initial: {
      fill: '#cecece',
      fillOpacity: 1,
      stroke: 'none',
      strokeWidth: 0,
      strokeOpacity: 1,
    },
    hover: {},
    selected: { fill: '#000' },
    selectedHover: {},
  },

  regionLabelStyle: {
    initial: {
      fontFamily: 'Verdana',
      fontSize: '12',
      fontWeight: 'bold',
      cursor: 'default',
      fill: '#164E42',
    },
    hover: { cursor: 'default' },
  },
});


// ── Helpers ──────────────────────────────────────────────────────────────────

// Génère un identifiant CSS-safe à partir d'un nom (ex. 'Île Maurice' → 'ilemaurice')
function slugify(str) {
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Relance fn toutes les 1 s jusqu'à ce que le sélecteur renvoie des éléments
function waitForElements(selector, fn) {
  var els = document.querySelectorAll(selector);
  if (!els.length) {
    setTimeout(function() { waitForElements(selector, fn); }, 1000);
    return;
  }
  fn(els);
}


// ── Coloration des pays visités ──────────────────────────────────────────────

function colorVisitedRegions() {
  waitForElements('.jvm-region', function(regions) {
    regions.forEach(function(region) {
      var code = region.getAttribute('data-code');
      if (country_visited.includes(code)) {
        region.style.fill = '#164E42';
        region.style.fillOpacity = 0.7;
      }
    });
  });
}
colorVisitedRegions();


// ── Classe CSS sur chaque marqueur (slug du nom) ─────────────────────────────

function addMarkerClasses() {
  waitForElements('.jvm-marker', function(markerEls) {
    markerEls.forEach(function(el, i) {
      el.classList.add(slugify(markers[i].name));
    });
  });
}
addMarkerClasses();
