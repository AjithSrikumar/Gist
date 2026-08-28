const https = require('https');

const books = [
  { id: 'einstein', title: 'Einstein: His Life and Universe' },
  { id: 'leonardo-da-vinci', title: 'Leonardo da Vinci' },
  { id: 'mastering-the-market-cycle', title: 'Mastering the Market Cycle' },
  { id: 'the-man-who-solved-the-market', title: 'The Man Who Solved the Market' },
  { id: 'against-all-odds', title: 'Against All Odds: The IT Story of India' },
  { id: 'non-consensus-investing', title: 'Non-Consensus Investing' },
  { id: 'the-big-bull-of-dalal-street', title: 'The Big Bull of Dalal Street' },
  { id: 'warren-buffett-inside-the-ultimate-money-mind', title: 'Warren Buffett: Inside the Ultimate Money Mind' },
  { id: 'how-to-make-money-in-stocks-trilogy', title: 'How to Make Money in Stocks Trilogy' },
];

function searchGoogleBooks(title) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(`intitle:"${title}"`);
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
    console.log(`Searching: ${book.title}...`);
    const url = await searchGoogleBooks(book.title);
    console.log(`  ${book.id}: ${url || 'NOT FOUND'}`);
    await new Promise(r => setTimeout(r, 500));
  }
}

main();