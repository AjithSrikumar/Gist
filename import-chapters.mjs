import fs from "fs";
import path from "path";

const SUPABASE_URL = "https://xmetbuknlbddeczwakdb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXRidWtubGJkZGVjendha2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODQxMDksImV4cCI6MjEwMzI2MDEwOX0.sbgWiak32S2F-C_slVQSerCnErDuFEh6REcVnyYTpIQ";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const booksDir = "D:\\Projects\\Book Summary\\gist\\src\\data\\books";

// Step 1: Get all books with their IDs
async function getBooks() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?select=id,slug`, { headers });
  return res.json();
}

// Step 2: Read chapter files and insert
async function importChapters() {
  const books = await getBooks();
  const bookMap = {};
  books.forEach(b => { bookMap[b.slug] = b.id; });

  const files = fs.readdirSync(booksDir).filter(f => f.endsWith(".chapters.json"));
  let totalInserted = 0;

  for (const file of files) {
    const slug = file.replace(".chapters.json", "");
    const bookId = bookMap[slug];
    if (!bookId) {
      console.log(`⚠ No book found for ${slug}, skipping`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(path.join(booksDir, file), "utf8"));
    const chapters = data[0]?.chapters || data.chapters || [];

    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      const row = {
        book_id: bookId,
        title: ch.title,
        summary: ch.summary,
        takeaway: ch.takeaway,
        order: i + 1,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/chapters`, {
        method: "POST",
        headers,
        body: JSON.stringify(row),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed ${slug} chapter ${i+1}: ${err}`);
      } else {
        totalInserted++;
      }
    }
    console.log(`✅ ${slug}: ${chapters.length} chapters`);
  }

  console.log(`\nDone! Total chapters inserted: ${totalInserted}`);
}

importChapters().catch(console.error);