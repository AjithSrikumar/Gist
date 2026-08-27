export interface Category {
  id: string;
  name: string;
  short?: string;
  color: string;
  icon: string;
}

export interface Goal {
  id: string;
  label: string;
  railTitle: string;
  icon: string;
  categoryId: string;
}

export interface BookMeta {
  id: string;
  title: string;
  author: string;
  categoryId: string;
  cover: string;
  coverGradient: [string, string];
  keyPointsCount: number;
  durationMin: number;
  insightsCount: number;
  description: string;
  learnBullets: string[];
  gift?: boolean;
}

export interface KeyPoint {
  heading: string;
  body: string;
}

export interface ChapterSummary {
  title: string;
  summary: string; // paragraphs separated by \n\n
  takeaway: string;
  takeaways?: string[];
}

export interface BookContent {
  id: string;
  aboutAuthor: string;
  points: KeyPoint[];
  insights: string[];
  conclusion: string;
  chapters?: ChapterSummary[];
}

export interface Book extends BookMeta {
  content: BookContent;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  tileGradient: [string, string];
  bookIds: string[];
}

export interface Challenge {
  id: string;
  title: string;
  days: number;
  progressDay: number;
}

export interface HighlightEntry {
  bookId: string;
  pointIndex: number;
  snippet: string;
}

export interface ContinuingEntry {
  bookId: string;
  progressPct: number;
  readChapters: number[];
}
