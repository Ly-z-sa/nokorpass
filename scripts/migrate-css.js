/**
 * Migrates inline <style> blocks to css/global.css + css/pages/*.css
 * Run: node scripts/migrate-css.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSS_DIR = path.join(ROOT, 'css');
const PAGES_DIR = path.join(CSS_DIR, 'pages');

const GLOBAL_LINK = '  <link rel="stylesheet" href="css/global.css" />\n';
const FONTS_LINK =
  '  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />\n';

const PAGE_MAP = {
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

const BUILD_MAP = {
  'build-account.js': { page: 'account', cssVar: 'css' },
  'build-auth.js': { page: 'auth', cssVar: 'css' },
  'build-booking.js': { page: 'booking', cssVar: 'css' },
  'build-payment.js': { page: 'payment', cssVar: 'css' },
  'build-tickets.js': { page: 'tickets', cssVar: 'css' },
  'build-snacks.js': { page: 'snacks', cssVar: 'css' },
  'build-privacy.js': { page: 'legal', cssVar: 'css' },
  'build-terms.js': { page: 'legal', cssVar: 'css' },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extractStyleBlock(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1].trim() : null;
}

function stripGlobalFromPageCss(css) {
  const markers = [
    /\*,\s*\*::before,\s*\*::after[\s\S]*?padding:\s*0;\s*\}/,
    /:root\s*\{[\s\S]*?\}/,
    /html\s*\{[\s\S]*?scrollbar-width:\s*none;[\s\S]*?\}/,
    /html::-webkit-scrollbar\s*\{[\s\S]*?\}/,
    /::-webkit-scrollbar\s*\{[\s\S]*?\}/,
    /\*\s*\{[\s\S]*?scrollbar-width:\s*none;[\s\S]*?\}/,
    /body\s*\{[\s\S]*?overflow-x:\s*hidden;\s*\}/,
    /nav\s*\{[\s\S]*?border-bottom:[\s\S]*?\}/,
    /\.logo\s*\{[\s\S]*?text-decoration:\s*none;\s*\}/,
    /\.logo img\s*\{[\s\S]*?\}/,
    /\.nav-links\s*\{[\s\S]*?list-style:\s*none;\s*\}/,
    /\.nav-links a\s*\{[\s\S]*?transition:[\s\S]*?\}/,
    /\.nav-links a:hover[\s\S]*?\}/,
    /\.nav-links a\.active[\s\S]*?\}/,
    /\/\*\s*FOOTER[\s\S]*?\.footer-bottom a:hover[\s\S]*?\}/,
    /footer\s*\{[\s\S]*?padding:[\s\S]*?\}/,
    /\.footer-grid[\s\S]*?\.footer-bottom a:hover[\s\S]*?\}/,
    /\.btn-primary\s*\{[\s\S]*?\}/,
    /\.btn-primary:hover[\s\S]*?\}/,
    /\.btn-ghost\s*\{[\s\S]*?\}/,
    /\.btn-ghost:hover[\s\S]*?\}/,
    /\.btn-ghost:disabled[\s\S]*?\}/,
    /\.section-tag\s*\{[\s\S]*?\}/,
  ];
  let out = css;
  for (const re of markers) {
    out = out.replace(re, '');
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function replaceStyleWithLinks(html, pageSlug) {
  const pageLink = pageSlug
    ? `  <link rel="stylesheet" href="css/pages/${pageSlug}.css" />\n`
    : '';
  return html.replace(
    /<style>[\s\S]*?<\/style>\s*/i,
    GLOBAL_LINK + pageLink
  );
}

function updateHtmlFile(filename) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  const style = extractStyleBlock(html);
  if (!style) {
    console.warn(`No style block in ${filename}`);
    return;
  }
  const pageSlug = PAGE_MAP[filename];
  const pageCss = stripGlobalFromPageCss(style);
  if (pageSlug && pageCss) {
    const outPath = path.join(PAGES_DIR, `${pageSlug}.css`);
    if (!fs.existsSync(outPath)) {
      fs.writeFileSync(outPath, pageCss, 'utf8');
      console.log(`Wrote ${outPath}`);
    }
  }
  html = replaceStyleWithLinks(html, pageSlug);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${filename}`);
}

function updateBuildFile(filename, config) {
  const filePath = path.join(ROOT, filename);
  let src = fs.readFileSync(filePath, 'utf8');
  const cssVarMatch = src.match(
    new RegExp(`const ${config.cssVar} = \`([\\s\\S]*?)\`;`)
  );
  if (!cssVarMatch) {
    console.warn(`No ${config.cssVar} in ${filename}`);
    return;
  }
  const pageCss = cssVarMatch[1].trim();
  const outPath = path.join(PAGES_DIR, `${config.page}.css`);
  fs.writeFileSync(outPath, pageCss, 'utf8');
  console.log(`Wrote ${outPath} from ${filename}`);

  const headLinks =
    `    <link rel="stylesheet" href="css/global.css" />\\n` +
    `    <link rel="stylesheet" href="css/pages/${config.page}.css" />\\n`;

  src = src.replace(
    /<style>[\s\S]*?\$\{css\}[\s\S]*?<\/style>/,
    headLinks.trim()
  );
  src = src.replace(
    /<style>[\s\S]*?<\/style>/,
    headLinks.trim()
  );

  fs.writeFileSync(filePath, src, 'utf8');
  console.log(`Updated ${filename}`);
}

ensureDir(CSS_DIR);
ensureDir(PAGES_DIR);

// Write global.css from index.html shared extraction (done once manually via separate step)
const globalPath = path.join(CSS_DIR, 'global.css');
if (!fs.existsSync(globalPath)) {
  console.error('css/global.css must exist before running migration');
  process.exit(1);
}

Object.keys(PAGE_MAP).forEach(updateHtmlFile);
Object.entries(BUILD_MAP).forEach(([f, cfg]) => updateBuildFile(f, cfg));

console.log('Migration complete.');
