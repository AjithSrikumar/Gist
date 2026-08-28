const fs = require('fs');
const path = require('path');
const https = require('https');

const BATCH_DIR = 'D:\\Projects\\Book Summary\\Books\\Batch2-29-08-2026';
const COVERS_DIR = 'D:\\Projects\\Book Summary\\gist\\public\\covers';

// Map book id to source filename
const BOOK_FILES = {
  'against-all-odds': 'Against all odds_gopalakrishnan, s. kris & dayasin.epub',
  'poor-charlies-almanack': "Charles T. Munger, Peter D. Kaufman (editor) - Poor Charlie’s Almanack_ The Essential Wit and Wisdom of Charles T. Munger (2023, Stripe Press) - libgen.li.epub",
  'einstein': 'einstein_walter isaacson.epub',
  'expectations-investing': 'expectations investing_michael j. mauboussin.epub',
  'the-man-who-solved-the-market': 'Gregory Zuckerman - The Man Who Solved the Market_ How Jim Simons Launched the Quant Revolution (2019, Portfolio) - libgen.li.epub',
  'leonardo-da-vinci': 'leonardo da vinci_isaacson, walter.epub',
  'mastering-the-market-cycle': 'mastering the market cycle_howard marks.epub',
  'richer-wiser-happier': 'Richer, Wiser, Happier How the Worlds Greatest Investors Win in Markets and Life by William Green.epub',
  'non-consensus-investing': 'Rupal J. Bhansali - Non-Consensus Investing_ Being Right When Everyone Else Is Wrong (2019, Columbia University Press) - libgen.li.epub',
  'sizing-people-up': 'Sizing people up _ a veteran FBI agent’s user manual for behavior prediction- Dreeke, Robin_ Stauth, Cameron -.epub',
  'super-thinking': 'Super Thinking The Big Book of Mental Models (2019, PORTFOLIO).epub',
  'the-big-bull-of-dalal-street': 'The Big Bull of Dalal Street -Neil Borate_ Aprajita Sharma_ Aditya Kondawar - (2023, Penguin Random House India Private Limited) - libgen.li.epub',
  'the-tatas': 'the tatas how a family built a business and a nati.epub',
  'the-unusual-billionaires': 'The Unusual Billionaires (Saurabh Mukherjea).epub',
  'warren-buffett-inside-the-ultimate-money-mind': 'Warren Buffet Inside the Ultimate Money Mind by Robert G. Hagstrom.epub',
  'what-my-mba-did-not-teach-me': 'what my mba did not teach me about money_sandeep s.epub',
  'how-to-make-money-in-stocks-trilogy': 'William ONeil, Matthew Galgani, Amy Smith - How to Make Money in Stocks Trilogy (2013, McGraw-Hill) - libgen.li.epub',
};

async function extractCover(bookId, filename) {
  const epubPath = path.join(BATCH_DIR, filename);
  if (!fs.existsSync(epubPath)) {
    console.log(`✗ ${bookId}: file not found: ${filename}`);
    return false;
  }

  const { EPub } = await import('epub');
  // Use JSZip directly to find cover image
  const JSZip = (await import('jszip')).default;
  const data = fs.readFileSync(epubPath);
  const zip = await JSZip.loadAsync(data);

  // Find all image files
  const imageFiles = Object.keys(zip.files).filter(f => 
    f.match(/\.(jpg|jpeg|png)$/i) && !zip.files[f].dir
  );

  if (imageFiles.length === 0) {
    console.log(`✗ ${bookId}: no images found`);
    return false;
  }

  // Prefer files with 'cover' in name, otherwise largest image
  let coverFile = imageFiles.find(f => f.toLowerCase().includes('cover'));
  
  if (!coverFile) {
    // Find largest image by size
    let maxSize = 0;
    for (const f of imageFiles) {
      const file = zip.files[f];
      // Use uncompressed size if available
      const size = file._data ? file._data.uncompressedSize || 0 : 0;
      if (size > maxSize) {
        maxSize = size;
        coverFile = f;
      }
    }
    if (!coverFile) coverFile = imageFiles[0];
  }

  console.log(`  ${bookId}: cover file = ${coverFile}`);

  const imageData = await zip.files[coverFile].async('nodebuffer');
  
  // Determine extension
  const ext = path.extname(coverFile).toLowerCase();
  // Always save as .jpg (convert if needed)
  const outPath = path.join(COVERS_DIR, `${bookId}.jpg`);
  
  // If it's PNG, we need to convert or just save as is but with jpg extension
  // Canvas can convert, but simpler: just save buffer directly
  // The browser will handle it, but better to ensure jpg
  if (ext === '.png') {
    // Try to convert PNG to JPG using canvas if available
    try {
      const { createCanvas, loadImage } = await import('canvas');
      const img = await loadImage(imageData);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      const jpgBuffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
      fs.writeFileSync(outPath, jpgBuffer);
      console.log(`  ✓ ${bookId}: extracted and converted PNG->JPG (${jpgBuffer.length} bytes)`);
    } catch (e) {
      fs.writeFileSync(outPath, imageData);
      console.log(`  ✓ ${bookId}: saved as-is (${imageData.length} bytes) - ${e.message}`);
    }
  } else {
    fs.writeFileSync(outPath, imageData);
    console.log(`  ✓ ${bookId}: extracted (${imageData.length} bytes)`);
  }
  return true;
}

async function main() {
  console.log('Extracting covers from EPUB files...\n');
  for (const [bookId, filename] of Object.entries(BOOK_FILES)) {
    try {
      await extractCover(bookId, filename);
    } catch (e) {
      console.log(`✗ ${bookId}: error - ${e.message}`);
    }
  }
  console.log('\nDone!');
}

main().catch(console.error);
