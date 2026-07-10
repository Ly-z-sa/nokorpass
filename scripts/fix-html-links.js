const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PAGE_CSS = {
  'index.html': 'home',
  'auth.html': 'auth',
  'account.html': 'account',
  'booking.html': 'booking',
  'payment.html': 'payment',
  'tickets.html': 'tickets',
  'snacks.html': 'snacks',
  'privacy.html': 'legal',
  'terms.html': 'legal',
  'movies.html': 'movies',
  'cinemas.html': 'cinemas',
  'movie-details.html': 'movie-details',
};

const GLOBAL_LINKS = `  <link rel="stylesheet" href="css/global.css" />\n`;

function fixFile(filename) {
  const filePath = path.join(ROOT, filename);
  let html = fs.readFileSync(filePath, 'utf8');
  const pageSlug = PAGE_CSS[filename];

  // Remove wrong global.css links and duplicate style blocks
  html = html.replace(
    /\s*<link[^>]*href=["']global\.css["'][^>]*>\s*/gi,
    '\n'
  );
  html = html.replace(/<style>[\s\S]*?<\/style>\s*/gi, '');

  const pageLink = pageSlug
    ? `  <link rel="stylesheet" href="css/pages/${pageSlug}.css" />\n`
    : '';

  const insertAfter = html.match(
    /fonts\.googleapis\.com[^>]*>\s*/i
  );
  const bundle = GLOBAL_LINKS + pageLink;
  if (insertAfter) {
    const idx = insertAfter.index + insertAfter[0].length;
    if (!html.includes('css/global.css')) {
      html = html.slice(0, idx) + bundle + html.slice(idx);
    }
  } else {
    html = html.replace('</head>', bundle + '</head>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Fixed', filename);
}

Object.keys(PAGE_CSS).forEach(fixFile);
