const fs = require('fs');
const path = require('path');

const EXTRACTED_DIR = 'D:\\Projects\\Book Summary\\extracted-books';
const OUTPUT_DIR = 'D:\\Projects\\Book Summary\\gist\\src\\data\\books';

function sanitizeId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseChapters(text) {
  // Try to parse epub-style chapters first (=== CHAPTER X: Title ===)
  const epubChapters = [];
  const epubRegex = /=== CHAPTER\s+(\d+):\s*([^=]+)===/g;
  let match;
  while ((match = epubRegex.exec(text)) !== null) {
    epubChapters.push({
      num: parseInt(match[1]),
      title: match[2].trim(),
      startIndex: match.index,
      matchLength: match[0].length
    });
  }
  
  if (epubChapters.length > 0) {
    // Extract content between chapters
    return epubChapters.map((ch, i) => {
      const start = ch.startIndex + ch.matchLength;
      const end = i + 1 < epubChapters.length ? epubChapters[i + 1].startIndex : text.length;
      const content = text.slice(start, end).trim();
      return { title: ch.title, content, num: ch.num };
    });
  }
  
  // Try to parse PDF page markers (-- N of M --)
  // This is harder, so we'll try to find chapter-like headers
  const lines = text.split('\n');
  const chapters = [];
  let currentChapter = { title: 'Introduction', content: '', num: 1 };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Look for chapter-like patterns
    if (line.match(/^(chapter|part)\s+\d+/i) || 
        line.match(/^\d+\.\s+[A-Z]/) ||
        (line.length > 10 && line.length < 100 && line === line.toUpperCase() && !line.includes(' '))) {
      if (currentChapter.content.trim()) {
        chapters.push(currentChapter);
      }
      currentChapter = { title: line, content: '', num: chapters.length + 1 };
    } else {
      currentChapter.content += line + '\n';
    }
  }
  if (currentChapter.content.trim()) {
    chapters.push(currentChapter);
  }
  
  return chapters.length > 1 ? chapters : [{ title: 'Full Text', content: text, num: 1 }];
}

// Test on one file
const testFile = 'the_tatas_how_a_family_built_a_business_and_a_nati.txt';
const text = fs.readFileSync(path.join(EXTRACTED_DIR, testFile), 'utf-8');
console.log('Text length:', text.length);

const chapters = parseChapters(text);
console.log('Found', chapters.length, 'chapters');
chapters.forEach((ch, i) => {
  console.log(`${i+1}. ${ch.title} (${ch.content.length} chars)`);
});