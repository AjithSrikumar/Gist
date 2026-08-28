import { PDFParse } from 'pdf-parse';
import fs from 'fs';
const data = fs.readFileSync('D:/Projects/Book Summary/Books/Batch2-29-08-2026/Tiny Habits.pdf');
const parser = new PDFParse({ data, verbosity: 0 });
const result = await parser.getText();
console.log('text length:', result.text?.length);
console.log('num pages:', result.total);