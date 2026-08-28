const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const COVERS_DIR = 'D:\\Projects\\Book Summary\\gist\\public\\covers';

const books = [
  { id: 'against-all-odds', title: 'Against All Odds', subtitle: 'The IT Story of India', colors: ['#1B3A6B', '#2F5FF6'] },
  { id: 'einstein', title: 'Einstein', subtitle: 'His Life and Universe', colors: ['#111827', '#374151'] },
  { id: 'leonardo-da-vinci', title: 'Leonardo da Vinci', subtitle: '', colors: ['#B45309', '#FBBF24'] },
  { id: 'mastering-the-market-cycle', title: 'Mastering the', subtitle: 'Market Cycle', colors: ['#1E40AF', '#38BDF8'] },
  { id: 'the-man-who-solved-the-market', title: 'The Man Who', subtitle: 'Solved the Market', colors: ['#7C2D12', '#DC8C4A'] },
  { id: 'non-consensus-investing', title: 'Non-Consensus', subtitle: 'Investing', colors: ['#7C2D12', '#DC8C4A'] },
  { id: 'the-big-bull-of-dalal-street', title: 'The Big Bull', subtitle: 'of Dalal Street', colors: ['#7F1D1D', '#EF4444'] },
  { id: 'warren-buffett-inside-the-ultimate-money-mind', title: 'Warren Buffett', subtitle: 'Inside the Ultimate Money Mind', colors: ['#92400E', '#F59E0B'] },
  { id: 'how-to-make-money-in-stocks-trilogy', title: 'How to Make', subtitle: 'Money in Stocks Trilogy', colors: ['#1B3A6B', '#2F5FF6'] },
];

function generateCover(book) {
  const width = 400;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, book.colors[0]);
  gradient.addColorStop(1, book.colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Subtle pattern
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const titleLines = book.title.split('\n');
  const subtitleLines = book.subtitle ? book.subtitle.split('\n') : [];
  
  const fontSize = titleLines.length > 1 ? 42 : 56;
  ctx.font = `bold ${fontSize}px "Georgia", serif`;
  
  let y = height / 2 - (titleLines.length * (fontSize + 8) + subtitleLines.length * 28) / 2;
  
  for (const line of titleLines) {
    ctx.fillText(line, width / 2, y);
    y += fontSize + 8;
  }
  
  if (subtitleLines.length > 0) {
    ctx.font = `28px "Georgia", serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const line of subtitleLines) {
      y += 16;
      ctx.fillText(line, width / 2, y);
      y += 36;
    }
  }
  
  // Decorative line
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, y + 20);
  ctx.lineTo(width * 0.7, y + 20);
  ctx.stroke();
  
  // Author placeholder at bottom
  ctx.font = 'italic 20px "Georgia", serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('Gist', width / 2, height - 50);
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const filepath = path.join(COVERS_DIR, `${book.id}.jpg`);
  fs.writeFileSync(filepath, buffer);
  console.log(`✓ Generated: ${book.id}.jpg`);
}

for (const book of books) {
  const filepath = path.join(COVERS_DIR, `${book.id}.jpg`);
  if (!fs.existsSync(filepath)) {
    generateCover(book);
  } else {
    console.log(`✓ ${book.id}.jpg already exists`);
  }
}

console.log('Done!');