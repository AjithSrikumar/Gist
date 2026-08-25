/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const BOOKS_DIR = path.resolve(__dirname, "../../Books");
const OUT_DIR = path.resolve(__dirname, "extracted");
fs.mkdirSync(OUT_DIR, { recursive: true });

const SLUGS = {
  "zero to one": "zero-to-one",
  rework: "rework",
  "start with why": "start-with-why",
  "tiny habits": "tiny-habits",
  "intelligent investor": "intelligent-investor",
  "diamonds in the dust": "diamonds-in-the-dust",
  "changing world order": "principles-changing-world-order",
  "big short": "the-big-short",
  "business adventures": "business-adventures",
  "hockey stick": "strategy-beyond-hockey-stick",
  "capital allocators": "capital-allocators",
  "mckinsey mind": "mckinsey-mind",
  "confessions of an advertising man": "confessions-advertising-man",
  "adweek copywriting": "adweek-copywriting-handbook",
  "22 immutable laws": "22-immutable-laws-marketing",
  "immutable laws": "22-immutable-laws-marketing",
  "the-22-immutable": "22-immutable-laws-marketing",
  "the-adweek": "adweek-copywriting-handbook",
  "bhagavad gita": "bhagavad-gita",
};

function slugFor(filename) {
  const lower = filename.toLowerCase();
  for (const [key, slug] of Object.entries(SLUGS)) {
    if (lower.includes(key)) return slug;
  }
  return null;
}

(async () => {
  const files = fs.readdirSync(BOOKS_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));
  for (const f of files) {
    const slug = slugFor(f);
    if (!slug) {
      console.log(`SKIP (no slug match): ${f}`);
      continue;
    }
    try {
      const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(path.join(BOOKS_DIR, f))) });
      // TOC usually in first ~30 pages
      const result = await parser.getText({ first: 30 });
      fs.writeFileSync(path.join(OUT_DIR, `${slug}.txt`), result.text.slice(0, 20000), "utf8");
      console.log(`${slug}.txt: ok (${result.text.length} chars from first 30 pages)`);
      await parser.destroy();
    } catch (e) {
      console.log(`ERROR ${f}: ${e.message}`);
    }
  }
})();
