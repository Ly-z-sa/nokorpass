const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const legacy = fs.readFileSync(path.join(ROOT, 'global.css'), 'utf8');
const lines = legacy.split('\n');

function slice(start, end) {
  return lines.slice(start - 1, end).join('\n').replace(/\$\{css\}/g, '').trim() + '\n';
}

const pagesDir = path.join(ROOT, 'css', 'pages');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

// Line ranges from legacy global.css (1-indexed)
const slices = {
  'home.css': [[50, 241], [381, 565]],
  'movies.css': [704, 975],
  'cinemas.css': [1033, 1121],
  'movie-details.css': [1202, 1403],
};

for (const [file, ranges] of Object.entries(slices)) {
  const parts = (Array.isArray(ranges[0]) ? ranges : [ranges])
    .map(([s, e]) => slice(s, e));
  const content = `/* Page-specific: ${file.replace('.css', '')} */\n\n` + parts.join('\n\n');
  fs.writeFileSync(path.join(pagesDir, file), content, 'utf8');
  console.log('Wrote', file);
}

// Extend global with shared movie cards + modal from legacy (already in home slice — extract to global)
const sharedCards = slice(243, 379);
const sharedModal = slice(621, 691);
const globalPath = path.join(ROOT, 'css', 'global.css');
let global = fs.readFileSync(globalPath, 'utf8');
if (!global.includes('.movie-card')) {
  global += '\n\n/* ── SHARED MOVIE CARDS ── */\n' + sharedCards;
  global += '\n\n/* ── TRAILER MODAL ── */\n' + sharedModal;
  fs.writeFileSync(globalPath, global, 'utf8');
  console.log('Extended css/global.css with movie-card + modal');
}

console.log('Done. Review css/pages/*.css');
