import type { Book, BookContent, BookMeta, ChapterSummary } from "@/lib/types";

export const BOOK_METAS: BookMeta[] = [
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel with Blake Masters",
    categoryId: "business",
    cover: "/covers/zero-to-one.jpg",
    coverGradient: ["#1B3A6B", "#2F5FF6"],
    keyPointsCount: 6,
    durationMin: 18,
    insightsCount: 3,
    description:
      "Notes on startups, or how to build the future — Thiel's contrarian case that real progress comes from creating something new, not copying what works.",
    learnBullets: [
      "Why competition destroys profit and monopoly creates it",
      "How to find and dominate a small market first",
      "The power law logic behind bold decisions",
    ],
  },
  {
    id: "rework",
    title: "Rework",
    author: "Jason Fried & David Heinemeier Hansson",
    categoryId: "business",
    cover: "/covers/rework.jpg",
    coverGradient: ["#F5B301", "#FF8A3D"],
    keyPointsCount: 6,
    durationMin: 16,
    insightsCount: 3,
    description:
      "The anti-startup playbook from the founders of Basecamp — why planning is guessing, meetings are toxic, and small profitable businesses beat funded gambles.",
    learnBullets: [
      "How to launch a business without outside money",
      "Why underdoing the competition wins customers",
      "A saner way to run a company you want to keep",
    ],
    gift: true,
  },
  {
    id: "start-with-why",
    title: "Start With Why",
    author: "Simon Sinek",
    categoryId: "business",
    cover: "/covers/start-with-why.jpg",
    coverGradient: ["#0EA5E9", "#22D3EE"],
    keyPointsCount: 6,
    durationMin: 17,
    insightsCount: 3,
    description:
      "Great leaders and organizations start with purpose. Sinek's Golden Circle explains why some inspire loyalty while others rely on manipulation.",
    learnBullets: [
      "The Golden Circle framework: Why → How → What",
      "Why people buy belief before features",
      "How to filter every decision through your purpose",
    ],
  },
  {
    id: "tiny-habits",
    title: "Tiny Habits",
    author: "BJ Fogg",
    categoryId: "productivity",
    cover: "/covers/tiny-habits.jpg",
    coverGradient: ["#35C48B", "#2DB6A3"],
    keyPointsCount: 6,
    durationMin: 15,
    insightsCount: 3,
    description:
      "Stanford behavior scientist BJ Fogg shows how to change your life by starting absurdly small — no willpower required.",
    learnBullets: [
      "The B=MAP formula behind every habit",
      "Anchoring new behaviors to existing routines",
      "Why celebration wires habits faster than tracking",
    ],
  },
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    categoryId: "money",
    cover: "/covers/intelligent-investor.jpg",
    coverGradient: ["#92400E", "#F59E0B"],
    keyPointsCount: 6,
    durationMin: 20,
    insightsCount: 3,
    description:
      "The value-investing bible — Graham's timeless philosophy of margin of safety, Mr. Market, and temperament over technique.",
    learnBullets: [
      "Investing vs. speculation — and why it matters",
      "Exploiting Mr. Market's moods instead of following them",
      "The margin of safety in practice",
    ],
  },
  {
    id: "diamonds-in-the-dust",
    title: "Diamonds in the Dust",
    author: "Saurabh Mukherjea, Rakshit Ranjan & Salil Desai",
    categoryId: "money",
    cover: "/covers/diamonds-in-the-dust.jpg",
    coverGradient: ["#334155", "#94A3B8"],
    keyPointsCount: 6,
    durationMin: 19,
    insightsCount: 3,
    description:
      "Consistent compounding for extraordinary wealth creation — Marcellus's system for finding clean-account, cash-rich Indian franchises and holding them for decades.",
    learnBullets: [
      "Forensic red flags that expose dirty accounts",
      "What cash-flow quality says about a franchise",
      "Why doing nothing is a portfolio strategy",
    ],
  },
  {
    id: "principles-changing-world-order",
    title: "Principles for Dealing with the Changing World Order",
    author: "Ray Dalio",
    categoryId: "money",
    cover: "/covers/principles-changing-world-order.jpg",
    coverGradient: ["#7C2D12", "#DC8C4A"],
    keyPointsCount: 6,
    durationMin: 22,
    insightsCount: 3,
    description:
      "Dalio studies 500 years of empires to model how nations rise and fall — debt cycles, internal conflict, and great-power rivalry shaping everything.",
    learnBullets: [
      "The Big Cycle stages of rising and falling powers",
      "How long-term debt cycles end in currency debasement",
      "Diversifying across countries, not just assets",
    ],
  },
  {
    id: "the-big-short",
    title: "The Big Short",
    author: "Michael Lewis",
    categoryId: "personalities",
    cover: "/covers/the-big-short.jpg",
    coverGradient: ["#111827", "#374151"],
    keyPointsCount: 6,
    durationMin: 21,
    insightsCount: 3,
    description:
      "Inside the Doomsday Machine — the true story of the misfits who read subprime's fine print, bet against the housing bubble, and won billions.",
    learnBullets: [
      "How securitization hid rotten mortgages behind AAA labels",
      "Credit default swaps as instruments of doubt",
      "Why being right took two agonizing years",
    ],
  },
  {
    id: "business-adventures",
    title: "Business Adventures",
    author: "John Brooks",
    categoryId: "business",
    cover: "/covers/business-adventures.jpg",
    coverGradient: ["#166534", "#65A30D"],
    keyPointsCount: 6,
    durationMin: 24,
    insightsCount: 3,
    description:
      "Twelve classic tales from Wall Street — the Edsel, the 1962 flash crash, Xerox, Piggly Wiggly — proving markets never change, only their costumes.",
    learnBullets: [
      "Case-study lessons on hubris and herd behavior",
      "How insider-trading rules were forged in scandal",
      "Why culture becomes visible only in crises",
    ],
  },
  {
    id: "strategy-beyond-hockey-stick",
    title: "Strategy Beyond the Hockey Stick",
    author: "Chris Bradley, Martin Hirt & Sven Smit",
    categoryId: "business",
    cover: "/covers/strategy-beyond-hockey-stick.jpg",
    coverGradient: ["#1E40AF", "#38BDF8"],
    keyPointsCount: 6,
    durationMin: 23,
    insightsCount: 3,
    description:
      "McKinsey's data study of 2,393 companies reveals why most strategic plans show hockey sticks that never happen — and the big moves that actually shift the odds.",
    learnBullets: [
      "The economic-profit power curve and escaping the middle",
      "Trend, industry, and the three hidden power laws",
      "Bold resource reallocation as the strongest lever",
    ],
  },
  {
    id: "capital-allocators",
    title: "Capital Allocators",
    author: "Ted Seides",
    categoryId: "money",
    cover: "/covers/capital-allocators.jpg",
    coverGradient: ["#312E81", "#818CF8"],
    keyPointsCount: 6,
    durationMin: 18,
    insightsCount: 3,
    description:
      "How the world's elite money managers lead and invest — alignment, process, sizing, and relationships distilled from hundreds of top-manager interviews.",
    learnBullets: [
      "Screening managers for alignment before returns",
      "Position sizing as the purest signal of conviction",
      "Relationships as a compounding source of alpha",
    ],
  },
  {
    id: "mckinsey-mind",
    title: "The McKinsey Mind",
    author: "Ethan M. Rasiel & Paul N. Friga",
    categoryId: "productivity",
    cover: "/covers/mckinsey-mind.jpg",
    coverGradient: ["#1F2937", "#6B7280"],
    keyPointsCount: 6,
    durationMin: 17,
    insightsCount: 3,
    description:
      "The problem-solving tools of the world's top strategic consulting firm — MECE structuring, ruthless prioritization, and answer-first communication.",
    learnBullets: [
      "Structuring any problem MECE-ly",
      "The 80/20 hunt for vital-few drivers",
      "Presenting solutions as pyramids",
    ],
  },
  {
    id: "confessions-advertising-man",
    title: "Confessions of an Advertising Man",
    author: "David Ogilvy",
    categoryId: "marketing",
    cover: "/covers/confessions-advertising-man.jpg",
    coverGradient: ["#7F1D1D", "#EF4444"],
    keyPointsCount: 6,
    durationMin: 16,
    insightsCount: 3,
    description:
      "The advertising legend's candid manual — research before inspiration, brand image as long-term capital, headlines that sell, and leadership without politics.",
    learnBullets: [
      "Positioning before a single line of copy",
      "Headline craft backed by research data",
      "Ogilvy's rules for building an agency of 'gentlemen with brains'",
    ],
  },
  {
    id: "adweek-copywriting-handbook",
    title: "The Adweek Copywriting Handbook",
    author: "Joseph Sugarman",
    categoryId: "marketing",
    cover: "/covers/adweek-copywriting-handbook.jpg",
    coverGradient: ["#0C4A6E", "#0EA5E9"],
    keyPointsCount: 6,
    durationMin: 15,
    insightsCount: 3,
    description:
      "Direct-marketing master Joseph Sugarman teaches copy that pulls readers sentence by sentence toward the sale — emotion first, proof second, offer third.",
    learnBullets: [
      "The slippery-slide theory of reader momentum",
      "Selling benefits while proving features",
      "Offers that make buying feel like the reader's idea",
    ],
  },
  {
    id: "22-immutable-laws-marketing",
    title: "The 22 Immutable Laws of Marketing",
    author: "Al Ries & Jack Trout",
    categoryId: "marketing",
    cover: "/covers/22-immutable-laws-marketing.jpg",
    coverGradient: ["#78350F", "#F97316"],
    keyPointsCount: 6,
    durationMin: 14,
    insightsCount: 3,
    description:
      "Violate them at your own risk — Ries and Trout's ruthless laws about perception, focus, line extension, and why being first beats being better.",
    learnBullets: [
      "Why categories are remembered by their pioneers",
      "Owning one word in the prospect's mind",
      "The Law of the Opposite for number twos",
    ],
  },
  {
    id: "bhagavad-gita",
    title: "Bhagavad Gita",
    author: "Swami Mukundananda (trans.)",
    categoryId: "spirituality",
    cover: "/covers/bhagavad-gita.jpg",
    coverGradient: ["#B45309", "#FBBF24"],
    keyPointsCount: 6,
    durationMin: 25,
    insightsCount: 3,
    description:
      "The Song of God — Krishna's battlefield counsel to Arjuna on action without attachment, the eternal self, and mastery of the restless mind.",
    learnBullets: [
      "Karma yoga: acting well while releasing results",
      "Taming the mind through practice and detachment",
      "The three gunas and conscious living",
    ],
    gift: true,
  },
];

const contentRegistry: Record<string, () => Promise<{ default: BookContent }>> = {
  "zero-to-one": () => import("./zero-to-one.json"),
  rework: () => import("./rework.json"),
  "start-with-why": () => import("./start-with-why.json"),
  "tiny-habits": () => import("./tiny-habits.json"),
  "intelligent-investor": () => import("./intelligent-investor.json"),
  "diamonds-in-the-dust": () => import("./diamonds-in-the-dust.json"),
  "principles-changing-world-order": () => import("./principles-changing-world-order.json"),
  "the-big-short": () => import("./the-big-short.json"),
  "business-adventures": () => import("./business-adventures.json"),
  "strategy-beyond-hockey-stick": () => import("./strategy-beyond-hockey-stick.json"),
  "capital-allocators": () => import("./capital-allocators.json"),
  "mckinsey-mind": () => import("./mckinsey-mind.json"),
  "confessions-advertising-man": () => import("./confessions-advertising-man.json"),
  "adweek-copywriting-handbook": () => import("./adweek-copywriting-handbook.json"),
  "22-immutable-laws-marketing": () => import("./22-immutable-laws-marketing.json"),
  "bhagavad-gita": () => import("./bhagavad-gita.json"),
};

const cache = new Map<string, Book>();

export const bookMetaById = (id: string) => BOOK_METAS.find((b) => b.id === id);

const chaptersRegistry: Record<string, () => Promise<{ default: { chapters: ChapterSummary[] } }>> = {
  "zero-to-one": () => import("./zero-to-one.chapters.json"),
  "start-with-why": () => import("./start-with-why.chapters.json"),
  "tiny-habits": () => import("./tiny-habits.chapters.json"),
  "mckinsey-mind": () => import("./mckinsey-mind.chapters.json"),
  "intelligent-investor": () => import("./intelligent-investor.chapters.json"),
  "business-adventures": () => import("./business-adventures.chapters.json"),
  "22-immutable-laws-marketing": () => import("./22-immutable-laws-marketing.chapters.json"),
  "bhagavad-gita": () => import("./bhagavad-gita.chapters.json"),
  rework: () => import("./rework.chapters.json"),
  "the-big-short": () => import("./the-big-short.chapters.json"),
  "confessions-advertising-man": () => import("./confessions-advertising-man.chapters.json"),
  "capital-allocators": () => import("./capital-allocators.chapters.json"),
  "diamonds-in-the-dust": () => import("./diamonds-in-the-dust.chapters.json"),
  "strategy-beyond-hockey-stick": () => import("./strategy-beyond-hockey-stick.chapters.json"),
  "principles-changing-world-order": () => import("./principles-changing-world-order.chapters.json"),
  "adweek-copywriting-handbook": () => import("./adweek-copywriting-handbook.chapters.json"),
};

/** Reading units: full chapters when available, else key points. */
export function unitCount(book: Book): number {
  return book.content.chapters?.length ?? book.content.points.length;
}

export function unitTitle(book: Book, i: number): string {
  const ch = book.content.chapters;
  return ch ? ch[i].title : book.content.points[i].heading;
}

export function unitBody(book: Book, i: number): string {
  const ch = book.content.chapters;
  return ch ? ch[i].summary : book.content.points[i].body;
}

export function unitTakeaway(book: Book, i: number): string | null {
  return book.content.chapters?.[i]?.takeaway ?? null;
}

export function unitTakeaways(book: Book, i: number): string[] {
  const ch = book.content.chapters?.[i];
  if (!ch) return [];
  return ch.takeaways?.length ? ch.takeaways : ch.takeaway ? [ch.takeaway] : [];
}

/** Derived duration from actual word count (~150 wpm listening pace). */
export function bookDurationMin(book: Book): number {
  const words =
    unitCount(book) > 0
      ? [...Array(unitCount(book)).keys()].reduce(
          (acc, i) => acc + unitBody(book, i).split(/\s+/).length,
          0
        )
      : book.durationMin;
  return Math.max(8, Math.round(words / 150));
}

/** Seconds of audio per unit, proportional to length. */
export function unitSecondsMap(book: Book): number[] {
  const n = unitCount(book);
  const words = [...Array(n).keys()].map((i) => Math.max(60, unitBody(book, i).split(/\s+/).length));
  const totalWords = words.reduce((a, b) => a + b, 0);
  const totalSec = bookDurationMin(book) * 60;
  return words.map((w) => Math.max(45, Math.round((w / totalWords) * totalSec)));
}

export async function loadBook(id: string): Promise<Book | null> {
  if (cache.has(id)) return cache.get(id)!;
  const meta = bookMetaById(id);
  const loader = contentRegistry[id];
  if (!meta || !loader) return null;
  const mod = await loader();
  const content: BookContent = { ...mod.default };
  if (chaptersRegistry[id]) {
    try {
      content.chapters = (await chaptersRegistry[id]()).default.chapters;
    } catch {
      // fall back to key points if chapter data is unavailable
    }
  }
  const book: Book = { ...meta, content };
  cache.set(id, book);
  return book;
}

export function booksByCategory(categoryId: string) {
  return BOOK_METAS.filter((b) => b.categoryId === categoryId);
}

export function booksForGoal(goalId: string) {
  const goal = GOAL_CATEGORY(goalId);
  const primary = BOOK_METAS.filter((b) => b.categoryId === goal);
  const rest = BOOK_METAS.filter((b) => b.categoryId !== goal);
  return [...primary, ...rest].slice(0, 10);
}

function GOAL_CATEGORY(goalId: string): string {
  // mirrors catalog.goals mapping; kept local to avoid circular import weight
  const map: Record<string, string> = {
    "increase-productivity": "productivity",
    "successful-career": "business",
    "manage-money": "money",
    "boost-intelligence": "business",
    "life-balance": "spirituality",
    "persuade-people": "marketing",
    "healthy-relationships": "personalities",
  };
  return map[goalId] ?? "business";
}
