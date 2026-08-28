const https = require('https');

const titles = [
  { id: 'einstein', search: 'Einstein Walter Isaacson' },
  { id: 'leonardo-da-vinci', search: 'Leonardo da Vinci Walter Isaacson' },
  { id: 'mastering-the-market-cycle', search: 'Mastering the Market Cycle Howard Marks' },
  { id: 'the-man-who-solved-the-market', search: 'The Man Who Solved the Market Gregory Zuckerman' },
  { id: 'against-all-odds', search: 'Against All Odds IT Story India' },
  { id: 'non-consensus-investing', search: 'Non Consensus Investing' },
  { id: 'the-big-bull-of-dalal-street', search: 'Big Bull Dalal Street' },
  { id: 'warren-buffett-inside-the-ultimate-money-mind', search: 'Warren Buffett Money Mind' },
  { id: 'how-to-make-money-in-stocks-trilogy', search: 'How to Make Money in Stocks Trilogy' },
];

async function search(title) {
  return new Promise((resolve) => {
    https.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(data);
          if (r.docs && r.docs[0]) {
            if (r.docs[0].cover_i) {
              resolve(`COVER: ${r.docs[0].cover_i}`);
            } else if (r.docs[0].isbn && r.docs[0].isbn[0]) {
              resolve(`ISBN: ${r.docs[0].isbn[0]}`);
            } else {
              resolve('NO COVER');
            }
          } else {
            resolve('NO RESULTS');
          }
        } catch(e) { resolve('ERROR'); }
      });
    }).on('error', () => resolve('ERROR'));
  });
}

async function main() {
  for (const item of titles) {
    const result = await search(item.search);
    console.log(`${item.id}: ${result}`);
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();