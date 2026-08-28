const https = require('https');

const books = [
  { id: 'einstein', title: 'Einstein: His Life and Universe', author: 'Walter Isaacson' },
  { id: 'leonardo-da-vinci', title: 'Leonardo da Vinci', author: 'Walter Isaacson' },
  { id: 'mastering-the-market-cycle', title: 'Mastering the Market Cycle', author: 'Howard Marks' },
  { id: 'the-man-who-solved-the-market', title: 'The Man Who Solved the Market', author: 'Gregory Zuckerman' },
  { id: 'against-all-odds', title: 'Against All Odds', author: 'Kris Gopalakrishnan' },
  { id: 'non-consensus-investing', title: 'Non-Consensus Investing', author: 'Rupal Bhansali' },
  { id: 'the-big-bull-of-dalal-street', title: 'The Big Bull of Dalal Street', author: 'Neil Borate' },
  { id: 'warren-buffett-inside-the-ultimate-money-mind', title: 'Warren Buffett: Inside the Ultimate Money Mind', author: 'Robert Hagstrom' },
  { id: 'how-to-make-money-in-stocks-trilogy', title: 'How to Make Money in Stocks Trilogy', author: 'William O\'Neil' },
];

function searchGoogleBooks(title, author) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(data);
          if (r.items && r.items[0]) {
            const img = r.items[0].volumeInfo.imageLinks;
            if (img && img.thumbnail) {
              // Get larger image
              const largeUrl = img.thumbnail.replace('zoom=1', 'zoom=2').replace('edge=curl', '');
              resolve(largeUrl);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  for (const book of books) {
    console.log(`Searching Google Books: ${book.title}...`);
    const url = await searchGoogleBooks(book.title, book.author);
    console.log(`  ${book.id}: ${url || 'NOT FOUND'}`);
    await new Promise(r => setTimeout(r, 500));
  }
}

main();