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
  {
    id: "against-all-odds",
    title: "Against All Odds: The IT Story of India",
    author: "Kris Gopalakrishnan, N. Dayasindhu & Krishnan Narayanan",
    categoryId: "business",
    cover: "/covers/against-all-odds.jpg",
    coverGradient: ["#1B3A6B", "#2F5FF6"],
    keyPointsCount: 6,
    durationMin: 22,
    insightsCount: 3,
    description:
      "The definitive history of India's IT revolution — from the first computer in 1955 to a $200B industry, told by Infosys co-founder Kris Gopalakrishnan and ITiHAASA historians.",
    learnBullets: [
      "How the License Raj nearly killed Indian IT before it began",
      "The NASSCOM-STPI partnership that unlocked global delivery",
      "Y2K as the breakthrough that opened Fortune 500 doors",
    ],
  },
  {
    id: "poor-charlies-almanack",
    title: "Poor Charlie's Almanack",
    author: "Charlie Munger (ed. Peter Kaufman)",
    categoryId: "money",
    cover: "/covers/poor-charlies-almanack.jpg",
    coverGradient: ["#7C2D12", "#DC8C4A"],
    keyPointsCount: 6,
    durationMin: 24,
    insightsCount: 3,
    description:
      "Charlie Munger's multidisciplinary mental models for worldly wisdom — inversion, lattice of models, and elementary worldly wisdom from the Berkshire Hathaway vice chairman.",
    learnBullets: [
      "Inversion: solve problems by avoiding stupidity rather than seeking brilliance",
      "The lattice of mental models across disciplines",
      "Opportunity cost and the power of patience",
    ],
  },
  {
    id: "einstein",
    title: "Einstein: His Life and Universe",
    author: "Walter Isaacson",
    categoryId: "personalities",
    cover: "/covers/einstein.jpg",
    coverGradient: ["#111827", "#374151"],
    keyPointsCount: 6,
    durationMin: 26,
    insightsCount: 3,
    description:
      "The definitive biography of Einstein — from patent clerk to icon, revealing how his rebellious personality fueled his scientific imagination.",
    learnBullets: [
      "How a patent office job gave Einstein time to think about light",
      "The miracle year 1905: relativity, photoelectric effect, Brownian motion",
      "Why he spent decades fighting quantum mechanics he helped birth",
    ],
  },
  {
    id: "expectations-investing",
    title: "Expectations Investing",
    author: "Michael Mauboussin & Alfred Rappaport",
    categoryId: "money",
    cover: "/covers/expectations-investing.jpg",
    coverGradient: ["#312E81", "#818CF8"],
    keyPointsCount: 6,
    durationMin: 20,
    insightsCount: 3,
    description:
      "Read stock prices for better returns — reverse-engineer market expectations instead of forecasting cash flows, then invest where expectations are wrong.",
    learnBullets: [
      "Stock price = present value of future expectations, not past results",
      "How to build an expectations infrastructure for any company",
      "Finding mispriced stocks by stress-testing implied expectations",
    ],
  },
  {
    id: "the-man-who-solved-the-market",
    title: "The Man Who Solved the Market",
    author: "Gregory Zuckerman",
    categoryId: "personalities",
    cover: "/covers/the-man-who-solved-the-market.jpg",
    coverGradient: ["#7C2D12", "#DC8C4A"],
    keyPointsCount: 6,
    durationMin: 23,
    insightsCount: 3,
    description:
      "How Jim Simons built Renaissance Technologies, the most successful quant fund in history — 66% annual returns for decades by applying math to markets.",
    learnBullets: [
      "Why Simons hired scientists, not traders — and what that changed",
      "The Medallion Fund's secret: short-term patterns at massive scale",
      "How Renaissance pioneered alternative data before it had a name",
    ],
  },
  {
    id: "leonardo-da-vinci",
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    categoryId: "personalities",
    cover: "/covers/leonardo-da-vinci.jpg",
    coverGradient: ["#B45309", "#FBBF24"],
    keyPointsCount: 6,
    durationMin: 25,
    insightsCount: 3,
    description:
      "From the Vitruvian Man to the Mona Lisa — how Leonardo's interdisciplinary curiosity across art, anatomy, engineering, and theater created genius.",
    learnBullets: [
      "Why he dissected 30+ corpses to paint the perfect smile",
      "The notebook habit: 7,200 pages of questions, not answers",
      "How theater and hydraulics informed his art and engineering",
    ],
  },
  {
    id: "mastering-the-market-cycle",
    title: "Mastering the Market Cycle",
    author: "Howard Marks",
    categoryId: "money",
    cover: "/covers/mastering-the-market-cycle.jpg",
    coverGradient: ["#1E40AF", "#38BDF8"],
    keyPointsCount: 6,
    durationMin: 21,
    insightsCount: 3,
    description:
      "Oaktree Capital's Howard Marks on recognizing where we are in any cycle — credit, equity, real estate, and the psychology that drives them all.",
    learnBullets: [
      "The pendulum: cycles swing between optimism and pessimism",
      "Why 'this time is different' is the four most dangerous words",
      "Positioning for the cycle you're in, not the one you want",
    ],
  },
  {
    id: "richer-wiser-happier",
    title: "Richer, Wiser, Happier",
    author: "William Green",
    categoryId: "money",
    cover: "/covers/richer-wiser-happier.jpg",
    coverGradient: ["#065F46", "#34D399"],
    keyPointsCount: 6,
    durationMin: 22,
    insightsCount: 3,
    description:
      "What the world's greatest investors (Munger, Pabrai, Spier, Greenblatt, Miller) teach about wealth, wisdom, and a well-lived life — beyond returns.",
    learnBullets: [
      "Cloning: copy the best ideas shamelessly, then improve them",
      "The inner scorecard: measure yourself by your own standards",
      "Inversion and checklists as daily decision tools",
    ],
  },
  {
    id: "non-consensus-investing",
    title: "Non-Consensus Investing",
    author: "Rupal J. Bhansali",
    categoryId: "money",
    cover: "/covers/non-consensus-investing.jpg",
    coverGradient: ["#7C2D12", "#DC8C4A"],
    keyPointsCount: 6,
    durationMin: 19,
    insightsCount: 3,
    description:
      "Ariel Investments' CIO reveals how to find value where everyone else is wrong — contrarian frameworks for spotting mispriced quality.",
    learnBullets: [
      "Consensus is the enemy: the best bets are where everyone disagrees",
      "Quality + cheap + misunderstood = the non-consensus sweet spot",
      "Why catalysts matter more than valuation for turning points",
    ],
  },
  {
    id: "sizing-people-up",
    title: "Sizing People Up",
    author: "Robin Dreeke & Cameron Stauth",
    categoryId: "personalities",
    cover: "/covers/sizing-people-up.jpg",
    coverGradient: ["#1B3A6B", "#2F5FF6"],
    keyPointsCount: 6,
    durationMin: 18,
    insightsCount: 3,
    description:
      "FBI behavioral analysis chief's system for predicting behavior — six signs of trustworthiness, the trust equation, and reading people in any setting.",
    learnBullets: [
      "The 6 signs: vesting, longevity, reliability, actions, language, stability",
      "Trust = competence + character + consistency over time",
      "How to spot deception without becoming paranoid",
    ],
  },
  {
    id: "super-thinking",
    title: "Super Thinking",
    author: "Gabriel Weinberg & Lauren McCann",
    categoryId: "productivity",
    cover: "/covers/super-thinking.jpg",
    coverGradient: ["#0C4A6E", "#0EA5E9"],
    keyPointsCount: 6,
    durationMin: 20,
    insightsCount: 3,
    description:
      "300+ mental models from physics, psychology, economics, and biology — DuckDuckGo's CEO and a statistician's cheat code for better decisions.",
    learnBullets: [
      "First principles, inversion, and Occam's razor as thinking primitives",
      "Models for systems, markets, psychology, and probability",
      "Building your own mental model lattice for any domain",
    ],
  },
  {
    id: "the-big-bull-of-dalal-street",
    title: "The Big Bull of Dalal Street",
    author: "Neil Borate, Aprajita Sharma & Aditya Kondawar",
    categoryId: "personalities",
    cover: "/covers/the-big-bull-of-dalal-street.jpg",
    coverGradient: ["#7F1D1D", "#EF4444"],
    keyPointsCount: 6,
    durationMin: 17,
    insightsCount: 3,
    description:
      "Rakesh Jhunjhunwala's journey from ₹5,000 to ₹46,000 crore — India's Warren Buffett on contrarian bets, leverage, and conviction.",
    learnBullets: [
      "How he spotted Titan, Lupin, and CRISIL before the crowd",
      "The role of leverage in amplifying conviction bets",
      "Why he bought when others panicked — and sold when they cheered",
    ],
  },
  {
    id: "the-business-of-venture-capital",
    title: "The Business of Venture Capital",
    author: "Mahendra Ramsinghani",
    categoryId: "business",
    cover: "/covers/the-business-of-venture-capital.jpg",
    coverGradient: ["#1E40AF", "#38BDF8"],
    keyPointsCount: 6,
    durationMin: 24,
    insightsCount: 3,
    description:
      "The complete VC lifecycle — fundraising, deal structuring, portfolio management, and exits. Used in MBA programs worldwide.",
    learnBullets: [
      "LP fundraising: thesis, track record, and terms that matter",
      "Deal structure: preferences, anti-dilution, and board control",
      "Portfolio strategy: reserves, follow-ons, and power-law math",
    ],
  },
  {
    id: "the-tatas",
    title: "The Tatas: How a Family Built a Business and a Nation",
    author: "Girish Kuber",
    categoryId: "business",
    cover: "/covers/the-tatas.jpg",
    coverGradient: ["#166534", "#65A30D"],
    keyPointsCount: 6,
    durationMin: 19,
    insightsCount: 3,
    description:
      "From a small trading firm to a global conglomerate — how the Tata family built steel, airlines, hotels, software, and modern India while keeping philanthropy at the core.",
    learnBullets: [
      "Jamsetji's vision: steel, hydroelectric power, and a world-class institute",
      "The trust structure: 66% of profits flow to philanthropy",
      "Ratan Tata's globalization: Tetley, Corus, JLR, and Nano",
    ],
  },
  {
    id: "the-unusual-billionaires",
    title: "The Unusual Billionaires",
    author: "Saurabh Mukherjea",
    categoryId: "money",
    cover: "/covers/the-unusual-billionaires.jpg",
    coverGradient: ["#334155", "#94A3B8"],
    keyPointsCount: 6,
    durationMin: 20,
    insightsCount: 3,
    description:
      "Seven Indian companies (Asian Paints, HDFC Bank, Marico, Page Industries, Axis Bank, Astral, Berger) that delivered 15%+ ROCE for a decade — the formula for greatness.",
    learnBullets: [
      "The coffee can filter: 10% revenue growth + 15% ROCE for 10 years",
      "Why clean accounting and promoter integrity are non-negotiable",
      "Capital allocation discipline as the differentiator",
    ],
  },
  {
    id: "peaceful-investing",
    title: "Peaceful Investing",
    author: "Vijay Malik",
    categoryId: "money",
    cover: "/covers/peaceful-investing.jpg",
    coverGradient: ["#065F46", "#34D399"],
    keyPointsCount: 6,
    durationMin: 16,
    insightsCount: 3,
    description:
      "A SEBI-registered advisor's simple approach: buy quality businesses at reasonable prices, hold long-term, ignore market noise — no stress required.",
    learnBullets: [
      "Quality checklist: moat, management, moat, financials, valuation",
      "Why doing nothing is the hardest and most profitable skill",
      "Behavioral traps: recency bias, loss aversion, and FOMO",
    ],
  },
  {
    id: "warren-buffett-inside-the-ultimate-money-mind",
    title: "Warren Buffett: Inside the Ultimate Money Mind",
    author: "Robert G. Hagstrom",
    categoryId: "money",
    cover: "/covers/warren-buffett-inside-the-ultimate-money-mind.jpg",
    coverGradient: ["#92400E", "#F59E0B"],
    keyPointsCount: 6,
    durationMin: 21,
    insightsCount: 3,
    description:
      "Beyond The Warren Buffett Way — Hagstrom explores Buffett's mental models, psychological edge, and the 'money mind' that drives superior capital allocation.",
    learnBullets: [
      "The money mind: temperament > IQ for investing success",
      "Circle of competence, margin of safety, and Mr. Market as tools",
      "Why Buffett reads 500 pages a day and how to build your lattice",
    ],
  },
  {
    id: "what-my-mba-did-not-teach-me",
    title: "What My MBA Did Not Teach Me About Money",
    author: "Sandeep S.",
    categoryId: "money",
    cover: "/covers/what-my-mba-did-not-teach-me.jpg",
    coverGradient: ["#312E81", "#818CF8"],
    keyPointsCount: 6,
    durationMin: 18,
    insightsCount: 3,
    description:
      "Practical financial wisdom missing from B-school — personal finance, investing psychology, and wealth-building frameworks for real life, not theory.",
    learnBullets: [
      "Why net worth ≠ self-worth and how to decouple them",
      "The behavior gap: your returns vs. the fund's returns",
      "Building anti-fragile finances that survive any market",
    ],
  },
  {
    id: "how-to-make-money-in-stocks",
    title: "How to Make Money in Stocks",
    author: "William J. O'Neil",
    categoryId: "money",
    cover: "/covers/how-to-make-money-in-stocks.jpg",
    coverGradient: ["#1B3A6B", "#2F5FF6"],
    keyPointsCount: 6,
    durationMin: 22,
    insightsCount: 3,
    description:
      "The CAN SLIM system — combining fundamental and technical analysis to find winning growth stocks before they break out. Founder of Investor's Business Daily.",
    learnBullets: [
      "CAN SLIM: Current earnings, Annual earnings, New products, Supply, Leaders, Institutional, Market",
      "How to read charts for proper buy points and sell rules",
      "The 7-8% loss rule: cut losses short, let winners run",
    ],
  },
  {
    id: "how-to-make-money-in-stocks-trilogy",
    title: "How to Make Money in Stocks Trilogy",
    author: "William J. O'Neil, Matthew Galgani & Amy Smith",
    categoryId: "money",
    cover: "/covers/how-to-make-money-in-stocks-trilogy.jpg",
    coverGradient: ["#1B3A6B", "#2F5FF6"],
    keyPointsCount: 6,
    durationMin: 25,
    insightsCount: 3,
    description:
      "The trilogy expands CAN SLIM with advanced chart patterns, portfolio management, and real trade examples from IBD's publisher and research team.",
    learnBullets: [
      "Advanced bases: cup-with-handle, double bottom, flat base, high-tight flag",
      "Portfolio management: concentration, pyramiding, and when to sell",
      "Model stock studies: Nvidia, Apple, Amazon, and other winners dissected",
    ],
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
  "against-all-odds": () => import("./against-all-odds.json"),
  "poor-charlies-almanack": () => import("./poor-charlies-almanack.json"),
  "einstein": () => import("./einstein.json"),
  "expectations-investing": () => import("./expectations-investing.json"),
  "the-man-who-solved-the-market": () => import("./the-man-who-solved-the-market.json"),
  "leonardo-da-vinci": () => import("./leonardo-da-vinci.json"),
  "mastering-the-market-cycle": () => import("./mastering-the-market-cycle.json"),
  "richer-wiser-happier": () => import("./richer-wiser-happier.json"),
  "non-consensus-investing": () => import("./non-consensus-investing.json"),
  "sizing-people-up": () => import("./sizing-people-up.json"),
  "super-thinking": () => import("./super-thinking.json"),
  "the-big-bull-of-dalal-street": () => import("./the-big-bull-of-dalal-street.json"),
  "the-business-of-venture-capital": () => import("./the-business-of-venture-capital.json"),
  "the-tatas": () => import("./the-tatas.json"),
  "the-unusual-billionaires": () => import("./the-unusual-billionaires.json"),
  "peaceful-investing": () => import("./peaceful-investing.json"),
  "warren-buffett-inside-the-ultimate-money-mind": () => import("./warren-buffett-inside-the-ultimate-money-mind.json"),
  "what-my-mba-did-not-teach-me": () => import("./what-my-mba-did-not-teach-me.json"),
  "how-to-make-money-in-stocks": () => import("./how-to-make-money-in-stocks.json"),
  "how-to-make-money-in-stocks-trilogy": () => import("./how-to-make-money-in-stocks-trilogy.json"),
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
  "against-all-odds": () => import("./against-all-odds.chapters.json"),
  "poor-charlies-almanack": () => import("./poor-charlies-almanack.chapters.json"),
  "einstein": () => import("./einstein.chapters.json"),
  "expectations-investing": () => import("./expectations-investing.chapters.json"),
  "the-man-who-solved-the-market": () => import("./the-man-who-solved-the-market.chapters.json"),
  "leonardo-da-vinci": () => import("./leonardo-da-vinci.chapters.json"),
  "mastering-the-market-cycle": () => import("./mastering-the-market-cycle.chapters.json"),
  "richer-wiser-happier": () => import("./richer-wiser-happier.chapters.json"),
  "non-consensus-investing": () => import("./non-consensus-investing.chapters.json"),
  "sizing-people-up": () => import("./sizing-people-up.chapters.json"),
  "super-thinking": () => import("./super-thinking.chapters.json"),
  "the-big-bull-of-dalal-street": () => import("./the-big-bull-of-dalal-street.chapters.json"),
  "the-business-of-venture-capital": () => import("./the-business-of-venture-capital.chapters.json"),
  "the-tatas": () => import("./the-tatas.chapters.json"),
  "the-unusual-billionaires": () => import("./the-unusual-billionaires.chapters.json"),
  "peaceful-investing": () => import("./peaceful-investing.chapters.json"),
  "warren-buffett-inside-the-ultimate-money-mind": () => import("./warren-buffett-inside-the-ultimate-money-mind.chapters.json"),
  "what-my-mba-did-not-teach-me": () => import("./what-my-mba-did-not-teach-me.chapters.json"),
  "how-to-make-money-in-stocks": () => import("./how-to-make-money-in-stocks.chapters.json"),
  "how-to-make-money-in-stocks-trilogy": () => import("./how-to-make-money-in-stocks-trilogy.chapters.json"),
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

/** Derived duration from actual word count (~200 wpm reading pace). */
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
  try {
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
  } catch {
    return null;
  }
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
