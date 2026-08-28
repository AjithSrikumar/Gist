const fs = require('fs');
const path = require('path');
const https = require('https');

const COVERS_DIR = 'D:\\Projects\\Book Summary\\gist\\public\\covers';

const books = [
  { id: 'against-all-odds', searchTitle: 'Against All Odds IT Story India' },
  { id: 'poor-charlies-almanack', searchTitle: 'Poor Charlie Almanack' },
  { id: 'einstein', searchTitle: 'Einstein His Life Universe' },
  { id: 'expectations-investing', searchTitle: 'Expectations Investing' },
  { id: 'the-man-who-solved-the-market', searchTitle: 'The Man Who Solved the Market' },
  { id: 'leonardo-da-vinci', searchTitle: 'Leonardo da Vinci' },
  { id: 'mastering-the-market-cycle', searchTitle: 'Mastering the Market Cycle' },
  { id: 'richer-wiser-happier', searchTitle: 'Richer Wiser Happier' },
  { id: 'non-consensus-investing', searchTitle: 'Non Consensus Investing' },
  { id: 'sizing-people-up', searchTitle: 'Sizing People Up' },
  { id: 'super-thinking', searchTitle: 'Super Thinking' },
  { id: 'the-big-bull-of-dalal-street', searchTitle: 'The Big Bull of Dalal Street' },
  { id: 'the-business-of-venture-capital', searchTitle: 'The Business of Venture Capital' },
  { id: 'the-tatas', searchTitle: 'The Tatas' },
  { id: 'the-unusual-billionaires', searchTitle: 'The Unusual Billionaires' },
  { id: 'peaceful-investing', searchTitle: 'Peaceful Investing' },
  { id: 'warren-buffett-inside-the-ultimate-money-mind', searchTitle: 'Warren Buffett Ultimate Money Mind' },
  { id: 'what-my-mba-did-not-teach-me', searchTitle: 'What MBA Did Not Teach Me' },
  { id: 'how-to-make-money-in-stocks', searchTitle: 'How to Make Money in Stocks' },
  { id: 'how-to-make-money-in-stocks-trilogy', searchTitle: 'How to Make Money in Stocks Trilogy' },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
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

function searchOpenLibrary(searchTitle) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(searchTitle);
    const url = `https://openlibrary.org/search.json?title=${query}&limit=3`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.docs && result.docs.length > 0) {
            for (const doc of result.docs) {
              if (doc.cover_i) {
                const coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
                resolve(coverUrl);
                return;
              }
              if (doc.isbn && doc.isbn.length > 0) {
                const coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
                resolve(coverUrl);
                return;
              }
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  for (const book of books) {
    const filepath = path.join(COVERS_DIR, `${book.id}.jpg`);
    
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${book.id} already exists`);
      continue;
    }
    
    console.log(`Searching for: ${book.searchTitle}...`);
    const coverUrl = await searchOpenLibrary(book.searchTitle);
    
    if (coverUrl) {
      console.log(`  Downloading from: ${coverUrl}`);
      try {
        await downloadImage(coverUrl, filepath);
        console.log(`  ✓ Saved: ${book.id}.jpg`);
      } catch (err) {
        console.log(`  ✗ Failed: ${err.message}`);
      }
    } else {
      console.log(`  ✗ No cover found`);
    }
    
    await new Promise(r => setTimeout(r, 400));
  }
  console.log('Done!');
}

main().catch(console.error);