const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'css', 'pages');

const map = {
  'build-account.js': 'account',
  'build-auth.js': 'auth',
  'build-booking.js': 'booking',
  'build-payment.js': 'payment',
  'build-tickets.js': 'tickets',
  'build-snacks.js': 'snacks',
  'build-privacy.js': 'legal',
  'build-terms.js': 'legal',
};

if (!fs.existsSync(PAGES)) fs.mkdirSync(PAGES, { recursive: true });

for (const [file, slug] of Object.entries(map)) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const m = src.match(/const css = `([\s\S]*?)`;/);
  if (!m) {
    console.warn('No css in', file);
    continue;
  }
  const out = path.join(PAGES, `${slug}.css`);
  let content = m[1].trim();
  if (slug === 'legal' && fs.existsSync(out)) {
    // terms and privacy share legal.css — keep longer file
    if (content.length <= fs.readFileSync(out, 'utf8').length) continue;
  }
  fs.writeFileSync(out, content + '\n', 'utf8');
  console.log('Wrote', out);
}
