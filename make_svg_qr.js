const fs = require('fs');
const QRCode = require('/opt/homebrew/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode');
// QRErrorCorrectLevel: L=1, M=0, Q=3, H=2
const QRErrorCorrectLevel = require('/opt/homebrew/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel');

function generateQrSvg(url, title = 'AR ROAD LINE', subtitle = 'Scan to connect', options = {}) {
  const qr = new QRCode(-1, QRErrorCorrectLevel.H);
  qr.addData(url);
  qr.make();

  const count = qr.getModuleCount();
  const padding = 4;
  const cellSize = 12;
  const qrSize = count * cellSize;
  const totalQrWidth = (count + padding * 2) * cellSize;
  const cardWidth = 500;
  const cardHeight = 620;
  const qrStartX = (cardWidth - qrSize) / 2;
  const qrStartY = 130;

  let rects = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.modules[r][c]) {
        const x = qrStartX + c * cellSize;
        const y = qrStartY + r * cellSize;
        rects += `  <rect x="${x}" y="${y}" width="${cellSize - 0.5}" height="${cellSize - 0.5}" rx="2" fill="#0F172A" />\n`;
      }
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${cardHeight}" width="${cardWidth}" height="${cardHeight}">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="${cardWidth}" height="${cardHeight}" rx="32" fill="#FFFFFF"/>
  <rect x="2" y="2" width="${cardWidth - 4}" height="${cardHeight - 4}" rx="30" fill="none" stroke="#F1F5F9" stroke-width="4"/>

  <!-- Top Accent Bar -->
  <path d="M 0 32 Q 0 0 32 0 L ${cardWidth - 32} 0 Q ${cardWidth} 0 ${cardWidth} 32 L ${cardWidth} 10 L 0 10 Z" fill="url(#brandGrad)"/>

  <!-- Header -->
  <g transform="translate(${cardWidth / 2}, 60)" text-anchor="middle">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="24" fill="#0F172A" letter-spacing="1">AR ROAD LINE</text>
    <text y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="12" fill="#FF6B00" letter-spacing="2">LOGISTICS &amp; FREIGHT</text>
    <text y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="13" fill="#64748B">${subtitle}</text>
  </g>

  <!-- QR Background plate -->
  <rect x="${qrStartX - 16}" y="${qrStartY - 16}" width="${qrSize + 32}" height="${qrSize + 32}" rx="20" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- QR Matrix -->
  <g>
${rects}
  </g>

  <!-- Center Logo Badge -->
  <g transform="translate(${cardWidth / 2}, ${qrStartY + qrSize / 2})">
    <circle r="26" fill="#FFFFFF" stroke="#FF6B00" stroke-width="3"/>
    <text text-anchor="middle" dy="7" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#FF6B00">AR</text>
  </g>

  <!-- Footer Link -->
  <g transform="translate(${cardWidth / 2}, ${cardHeight - 45})" text-anchor="middle">
    <rect x="-180" y="-18" width="360" height="36" rx="18" fill="#F1F5F9"/>
    <text dy="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="12" fill="#334155">${url}</text>
  </g>
</svg>`;

  return svg;
}

const telegramSvg = generateQrSvg('https://t.me/Ar_road_line', 'AR ROAD LINE', 'Telegram Kanal &amp; Aloqa: @Ar_road_line');
fs.writeFileSync('/Users/bek/ar_road_line_links/qr_telegram.svg', telegramSvg);

const instagramSvg = generateQrSvg('https://www.instagram.com/ar_road_line', 'AR ROAD LINE', 'Instagram: @ar_road_line');
fs.writeFileSync('/Users/bek/ar_road_line_links/qr_instagram.svg', instagramSvg);

console.log('Generated SVGs successfully!');
