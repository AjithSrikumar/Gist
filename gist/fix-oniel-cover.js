const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const COVERS_DIR = 'D:\\Projects\\Book Summary\\gist\\public\\covers';

const width = 400;
const height = 600;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Try to fetch from alternative source first - use a high-res placeholder with proper branding
// Blue gradient for O'Neil / IBD branding, with CAN SLIM hint
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#0F2A4D');
gradient.addColorStop(0.5, '#1B3A6B');
gradient.addColorStop(1, '#2F5FF6');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Subtle grid pattern
ctx.strokeStyle = 'rgba(255,255,255,0.04)';
ctx.lineWidth = 1;
for (let x = 0; x < width; x += 30) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}
for (let y = 0; y < height; y += 30) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Chart line watermark (representing stocks)
ctx.strokeStyle = 'rgba(255,255,255,0.08)';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(20, 450);
ctx.lineTo(80, 420);
ctx.lineTo(130, 440);
ctx.lineTo(180, 380);
ctx.lineTo(230, 400);
ctx.lineTo(280, 320);
ctx.lineTo(330, 340);
ctx.lineTo(380, 260);
ctx.stroke();

// Title
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// "How to Make" 
ctx.font = 'bold 38px "Georgia", serif';
ctx.fillText('How to Make', width/2, height/2 - 90);
ctx.fillText('Money in', width/2, height/2 - 45);
ctx.font = 'bold 44px "Georgia", serif';
ctx.fillStyle = '#FFD700';
ctx.fillText('Stocks', width/2, height/2 + 5);

// Subtitle
ctx.fillStyle = 'rgba(255,255,255,0.92)';
ctx.font = '16px "Georgia", serif';
ctx.fillText('A Winning System in Good Times', width/2, height/2 + 50);
ctx.fillText('and Bad — Fourth Edition', width/2, height/2 + 72);

// CAN SLIM badge
ctx.fillStyle = 'rgba(255,215,0,0.15)';
ctx.strokeStyle = 'rgba(255,215,0,0.5)';
ctx.lineWidth = 1.5;
const badgeW = 180;
const badgeH = 36;
const badgeX = width/2 - badgeW/2;
const badgeY = height/2 + 95;
ctx.beginPath();
ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
ctx.fill();
ctx.stroke();
ctx.fillStyle = '#FFD700';
ctx.font = 'bold 13px sans-serif';
ctx.fillText('CAN SLIM® SYSTEM', width/2, badgeY + 19);

// Author
ctx.fillStyle = 'rgba(255,255,255,0.75)';
ctx.font = 'italic 18px "Georgia", serif';
ctx.fillText('William J. O\'Neil', width/2, height - 70);

// Publisher hint
ctx.font = '10px sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.45)';
ctx.fillText('McGraw-Hill  •  2 Million Copies Sold', width/2, height - 45);
ctx.fillText('Gist', width/2, height - 28);

const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
const outPath = path.join(COVERS_DIR, 'how-to-make-money-in-stocks.jpg');
fs.writeFileSync(outPath, buffer);
console.log(`✓ Generated: how-to-make-money-in-stocks.jpg (${buffer.length} bytes)`);
