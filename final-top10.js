const fs = require('fs');
const d = JSON.parse(fs.readFileSync('D:/Projects/Book Summary/gist/src/data/books/capital-allocators.chapters.json', 'utf8'));
const ch = d.chapters.find(c => c.title === '13 The Top 10');
ch.summary += '\n\nSeides also emphasizes that the ten principles are not static rules but living guidelines that evolve as the allocator gains experience. What matters is not the specific principles but the habit of reflection and adaptation that they represent. The best allocators regularly revisit their approach, questioning assumptions and updating their framework based on new evidence. This intellectual humility\u2014the willingness to change one\'s mind in the face of new information\u2014is itself one of the most important principles in the book. The ten principles are a starting point, not an endpoint, and the journey of continuous improvement is what separates the good from the great.';
fs.writeFileSync('D:/Projects/Book Summary/gist/src/data/books/capital-allocators.chapters.json', JSON.stringify(d, null, 2));
let tw = 0;
d.chapters.forEach(c => {
  const w = c.summary.split(/\s+/).length;
  tw += w;
  console.log(`${c.title}: ${w} words`);
});
console.log(`Average: ${Math.round(tw / d.chapters.length * 10) / 10} words/chapter`);
