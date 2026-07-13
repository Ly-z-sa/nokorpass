const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const svgPath = path.join(root, 'assets', 'favicon.svg');

const FAVICON_LINKS = `  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48" />
  <link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192" />
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
  <link rel="apple-touch-icon" href="/favicon-192.png" />
  <link rel="manifest" href="/site.webmanifest" />`;

const toIco = require('to-ico');

async function generateFavicons() {
  const sharp = require('sharp');

  const sizes = [
    { file: 'favicon-48.png', size: 48 },
    { file: 'favicon-192.png', size: 192 },
  ];

  const pngBuffers = [];

  for (const { file, size } of sizes) {
    const buffer = await sharp(svgPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(root, file), buffer);
    pngBuffers.push({ size, buffer });
    console.log(`Created ${file}`);
  }

  const ico = await toIco(pngBuffers.map(({ buffer }) => buffer));
  fs.writeFileSync(path.join(root, 'favicon.ico'), ico);
  console.log('Created favicon.ico');
  return true;
}

function writeManifest() {
  const manifest = {
    name: 'NokorPass',
    short_name: 'NokorPass',
    description: 'Book movie and event tickets in Cambodia',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#e8490f',
    icons: [
      { src: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
    ],
  };

  fs.writeFileSync(path.join(root, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log('Created site.webmanifest');
}

if (require.main === module) {
  writeManifest();
  generateFavicons().then((ok) => {
    if (!ok) process.exit(1);
  });
}

module.exports = { FAVICON_LINKS, generateFavicons, writeManifest };
