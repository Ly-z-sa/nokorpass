const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
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

for (const [file, page] of Object.entries(map)) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, 'utf8');
  const replacement =
    `<link rel="stylesheet" href="css/global.css" />\\n` +
    `    <link rel="stylesheet" href="css/pages/${page}.css" />`;
  s = s.replace(
    /<link rel="stylesheet" href="global\.css" \/>/g,
    replacement
  );
  fs.writeFileSync(p, s, 'utf8');
  console.log('Fixed', file);
}
