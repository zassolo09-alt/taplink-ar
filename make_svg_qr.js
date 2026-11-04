const fs = require('fs');
const QRCode = require('/opt/homebrew/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode');
const QRErrorCorrectLevel = require('/opt/homebrew/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel');

function generateMinimalSvg(url, title, subtitle) {
  const qr = new QRCode(-1, QRErrorCorrectLevel.M);
  qr.addData(url);
  qr.make();

  const count = qr.getModuleCount();
  const cellSize = 10;
  const qrSize = count * cellSize;
  const cardWidth = 440;
  const cardHeight = 540;
  const qrStartX = (cardWidth - qrSize) / 2;
  const qrStartY = 110;

  let rects = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.modules[r][c]) {
        const x = qrStartX + c * cellSize;
        const y = qrStartY + r * cellSize;
        rects += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#000000" />\n`;
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${cardHeight}" width="${cardWidth}" height="${cardHeight}">
  <!-- Background -->
  <rect width="${cardWidth}" height="${cardHeight}" fill="#FFFFFF"/>
  <rect x="1" y="1" width="${cardWidth - 2}" height="${cardHeight - 2}" fill="none" stroke="#E5E5E5" stroke-width="1"/>

  <!-- Header -->
  <g transform="translate(${cardWidth / 2}, 55)" text-anchor="middle">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-weight="700" font-size="18" fill="#000000" letter-spacing="2">AR ROAD LINE</text>
    <text y="22" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-weight="400" font-size="12" fill="#737373" letter-spacing="0.5">${subtitle}</text>
  </g>

  <!-- QR Matrix -->
  <g>
${rects}
  </g>

  <!-- Footer Link -->
  <g transform="translate(${cardWidth / 2}, ${cardHeight - 35})" text-anchor="middle">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-weight="500" font-size="11" fill="#737373" letter-spacing="0.5">${url}</text>
  </g>
</svg>`;
}

fs.writeFileSync('/Users/bek/ar_road_line_links/qr_telegram.svg', generateMinimalSvg('https://t.me/Ar_road_line', 'AR ROAD LINE', 'TELEGRAM'));
fs.writeFileSync('/Users/bek/ar_road_line_links/qr_instagram.svg', generateMinimalSvg('https://www.instagram.com/ar_road_line', 'AR ROAD LINE', 'INSTAGRAM'));

console.log('Minimalist SVGs generated.');
