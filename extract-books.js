const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const EPub = require('epub');

const BATCH_DIR = 'D:\\Projects\\Book Summary\\Books\\Batch2-29-08-2026';
const OUTPUT_DIR = 'D:\\Projects\\Book Summary\\extracted-books';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').toLowerCase();
}

async function extractPdf(filePath) {
  const data = fs.readFileSync(filePath);
  const result = await pdfParse(data);
  return result.text;
}

function extractEpub(filePath) {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    epub.on('end', () => {
      let fullText = '';
      const chapterPromises = [];
      
      epub.flow.forEach((chapter, index) => {
        const promise = new Promise((res) => {
          epub.getChapter(chapter.id, (err, text) => {
            if (!err && text) {
              fullText += `\n\n=== CHAPTER ${index + 1}: ${chapter.title || 'Untitled'} ===\n\n${text}`;
            }
            res();
          });
        });
        chapterPromises.push(promise);
      });
      
      Promise.all(chapterPromises).then(() => resolve(fullText));
    });
    
    epub.on('error', reject);
    epub.parse();
  });
}

async function extractBook(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);
  
  console.log(`Extracting: ${fileName}`);
  
  try {
    let text;
    if (ext === '.pdf') {
      text = await extractPdf(filePath);
    } else if (ext === '.epub') {
      text = await extractEpub(filePath);
    } else {
      console.log(`  Skipping unsupported format: ${ext}`);
      return;
    }
    
    const outputPath = path.join(OUTPUT_DIR, `${sanitizeFilename(fileName)}.txt`);
    fs.writeFileSync(outputPath, text);
    console.log(`  Saved to: ${outputPath} (${text.length} chars)`);
  } catch (err) {
    console.error(`  Error extracting ${fileName}:`, err.message);
  }
}

async function main() {
  const files = fs.readdirSync(BATCH_DIR);
  const bookFiles = files.filter(f => f.endsWith('.pdf') || f.endsWith('.epub'));
  
  console.log(`Found ${bookFiles.length} book files`);
  
  for (const file of bookFiles) {
    await extractBook(path.join(BATCH_DIR, file));
  }
  
  console.log('Extraction complete!');
}

main().catch(console.error);