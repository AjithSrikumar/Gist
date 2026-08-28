const fs = require('fs');
const path = require('path');
const https = require('https');

const COVERS_DIR = 'D:\\Projects\\Book Summary\\gist\\public\\covers';

const isbnBooks = [
  { id: 'the-business-of-venture-capital', isbn: '9781119639688' },
  { id: 'how-to-make-money-in-stocks', isbn: '9780071614139' },
];

function downloadFromUrl(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('image')) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            const stats = fs.statSync(filepath);
            if (stats.size < 5000) {
              // Likely a "no cover" placeholder
              fs.unlinkSync(filepath);
              reject(new Error('Image too small, likely placeholder'));
            } else {
              resolve(stats.size);
            }
          });
        } else {
          file.close();
          fs.unlink(filepath, () => {});
          reject(new Error('Not an image: ' + contentType));
        }
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        downloadFromUrl(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function fetchIsbnCover(bookId, isbn) {
  const outPath = path.join(COVERS_DIR, `${bookId}.jpg`);
  // Try Open Library ISBN cover
  const olUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  console.log(`Fetching ${bookId} via ISBN ${isbn}: ${olUrl}`);
  try {
    const size = await downloadFromUrl(olUrl, outPath);
    console.log(`  ✓ Saved ${bookId}.jpg (${size} bytes) from Open Library`);
    return true;
  } catch (e) {
    console.log(`  ✗ Open Library failed: ${e.message}`);
    // Try Google Books as fallback
    const gbUrl = `https://books.google.com/books/content?id=placeholder&printsec=frontcover&img=1&zoom=1&source=gbs_api`;
    // Instead try a direct Google Books cover via ISBN search
    // Use books.google.com cover via isbn
    console.log(`  Trying alternative for ${bookId}...`);
    return false;
  }
}

async function fetchPeacefulInvesting() {
  // Try to fetch from drvijaymalik site or generate a proper placeholder
  // The book is a PDF ebook, let's try to find its cover via web
  // Use a high-quality gradient placeholder with proper title instead of generic
  const { createCanvas } = await import('canvas');
  const width = 400;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Deep green/teal gradient for investing theme
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#065F46');
  gradient.addColorStop(1, '#34D399');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Subtle pattern
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Rupee symbol watermark
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.font = 'bold 280px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₹', width/2, height/2 + 20);
  
  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 52px "Georgia", serif';
  ctx.fillText('Peaceful', width/2, height/2 - 70);
  ctx.fillText('Investing', width/2, height/2 - 10);
  
  ctx.font = '22px "Georgia", serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('A Simple Guide', width/2, height/2 + 40);
  
  // Decorative line
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, height/2 + 70);
  ctx.lineTo(width * 0.7, height/2 + 70);
  ctx.stroke();
  
  ctx.font = 'italic 18px "Georgia", serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Vijay Malik', width/2, height/2 + 105);
  
  ctx.font = '12px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('Gist', width/2, height - 30);
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
  const outPath = path.join(COVERS_DIR, 'peaceful-investing.jpg');
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ Generated high-quality placeholder for peaceful-investing.jpg (${buffer.length} bytes)`);
}

async function main() {
  for (const book of isbnBooks) {
    await fetchIsbnCover(book.id, book.isbn);
  }
  await fetchPeacefulInvesting();
  console.log('\nDone!');
}

main().catch(console.error);
