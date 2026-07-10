/**
 * Extracts page-specific CSS from HTML <style> blocks into css/pages/*.css
 * and replaces inline styles with stylesheet links.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'css', 'pages');

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

const GLOBAL_SELECTORS = new Set([
  '*', '*::before', '*::after', ':root', 'html', 'html::-webkit-scrollbar',
  '::-webkit-scrollbar', 'body', 'nav', 'footer', 'section',
  '.logo', '.logo img', '.nav-links', '.nav-links a', '.nav-links a:hover',
  '.nav-links a.active', '.btn-primary', '.btn-primary:hover', '.btn-ghost',
  '.btn-ghost:hover', '.btn-ghost:disabled', '.btn-outline-danger',
  '.btn-outline-danger:hover', '.section-tag', '.input-group',
  '.input-group label', '.input-group input', '.input-group select',
  '.settings-select', '.input-group input:focus', '.input-group small',
  '.screen-curve', '.screen-text', '.switch', '.switch input', '.slider',
  '.slider:before', 'input:checked + .slider', 'input:checked + .slider:before',
  '.toast', '.toast.show', '.footer-grid', '.footer-brand', '.footer-payments',
  '.footer-payments h4', '.payment-icons', '.payment-icons img',
  '.payment-icons img:hover', '.footer-links-group', '.footer-col',
  '.footer-brand .logo', '.footer-brand .logo img', '.footer-brand p',
  '.social-links', '.social-links a', '.social-links a:hover',
  '.footer-col h4', '.footer-col ul', '.footer-col ul li+li',
  '.footer-col ul a', '.footer-col ul a:hover', '.footer-bottom',
  '.footer-bottom a', '.footer-bottom a:hover',
]);

function parseRules(css) {
  const rules = [];
  let i = 0;
  const len = css.length;
  while (i < len) {
    while (i < len && /\s/.test(css[i])) i++;
    if (i >= len) break;
    if (css[i] === '@') {
      const start = i;
      let depth = 0;
      let j = i;
      while (j < len) {
        if (css[j] === '{') depth++;
        if (css[j] === '}') {
          depth--;
          if (depth === 0) {
            j++;
            break;
          }
        }
        j++;
      }
      const block = css.slice(start, j).trim();
      const header = block.split('{')[0].trim();
      if (header.startsWith('@media') || header.startsWith('@keyframes')) {
        rules.push({ type: 'at', content: block, header });
      }
      i = j;
      continue;
    }
    const selStart = i;
    while (i < len && css[i] !== '{') i++;
    if (i >= len) break;
    const selector = css.slice(selStart, i).trim();
    i++;
    let depth = 1;
    const bodyStart = i;
    while (i < len && depth > 0) {
      if (css[i] === '{') depth++;
      if (css[i] === '}') depth--;
      i++;
    }
    const body = css.slice(bodyStart, i - 1).trim();
    rules.push({ type: 'rule', selector, body });
  }
  return rules;
}

function isGlobalSelector(selector) {
  const parts = selector.split(',').map((s) => s.trim());
  return parts.every((p) => GLOBAL_SELECTORS.has(p));
}

function isGlobalAtRule(block) {
  if (!block.startsWith('@media')) return false;
  const inner = block.replace(/^@media[^{]+\{/, '').replace(/\}\s*$/, '');
  const innerRules = parseRules(inner);
  return innerRules.length > 0 && innerRules.every((r) => {
    if (r.type === 'at') return isGlobalAtRule(r.content);
    return isGlobalSelector(r.selector);
  });
}

function filterPageCss(css) {
  const rules = parseRules(css);
  const kept = [];
  for (const r of rules) {
    if (r.type === 'at') {
      if (r.header.startsWith('@keyframes')) {
        kept.push(r.content);
      } else if (!isGlobalAtRule(r.content)) {
        kept.push(r.content);
      }
    } else if (!isGlobalSelector(r.selector)) {
      kept.push(`${r.selector} {\n  ${r.body.replace(/\n/g, '\n  ')}\n}`);
    }
  }
  return kept.join('\n\n').trim();
}

function processHtml(filename) {
  const filePath = path.join(ROOT, filename);
  let html = fs.readFileSync(filePath, 'utf8');
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!m) {
    console.warn(`Skip ${filename}: no style`);
    return;
  }
  const pageSlug = PAGE_MAP[filename];
  const pageCss = filterPageCss(m[1]);
  fs.writeFileSync(path.join(PAGES_DIR, `${pageSlug}.css`), pageCss + '\n', 'utf8');
  const links =
    '  <link rel="stylesheet" href="css/global.css" />\n' +
    `  <link rel="stylesheet" href="css/pages/${pageSlug}.css" />\n`;
  html = html.replace(/<style>[\s\S]*?<\/style>\s*/i, links);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`OK ${filename} -> pages/${pageSlug}.css (${pageCss.length} chars)`);
}

if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });
Object.keys(PAGE_MAP).forEach(processHtml);
console.log('Done.');
