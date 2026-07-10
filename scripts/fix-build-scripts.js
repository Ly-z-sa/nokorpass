const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const BUILD_PAGES = {
  'build-account.js': 'account',
  'build-auth.js': 'auth',
  'build-booking.js': 'booking',
  'build-payment.js': 'payment',
  'build-tickets.js': 'tickets',
  'build-snacks.js': 'snacks',
  'build-privacy.js': 'legal',
  'build-terms.js': 'legal',
};

const LINKS = (page) =>
  `    <link rel="stylesheet" href="css/global.css" />\\n` +
  `    <link rel="stylesheet" href="css/pages/${page}.css" />\\n`;

for (const [file, page] of Object.entries(BUILD_PAGES)) {
  const filePath = path.join(ROOT, file);
  let src = fs.readFileSync(filePath, 'utf8');

  src = src.replace(
    /<style>[\s\S]*?\$\{css\}[\s\S]*?<\/style>/,
    LINKS(page)
  );
  src = src.replace(/<style>[\s\S]*?<\/style>/, LINKS(page));

  fs.writeFileSync(filePath, src, 'utf8');
  console.log('Updated', file);
}
