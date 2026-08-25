import type { Category, Collection, Challenge, Goal } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { id: "productivity", name: "Productivity", short: "Productivity", color: "#2DB6A3", icon: "zap" },
  { id: "business", name: "Business & Career", short: "Business", color: "#8B5CF6", icon: "briefcase" },
  { id: "money", name: "Money & Investments", short: "Money", color: "#35C48B", icon: "trending-up" },
  { id: "marketing", name: "Marketing & Copy", short: "Marketing", color: "#FF8A3D", icon: "megaphone" },
  { id: "spirituality", name: "Spirituality", short: "Spirituality", color: "#FF4FA0", icon: "flower" },
  { id: "personalities", name: "Personalities", short: "People", color: "#16181D", icon: "users" },
];

export const GOALS: Goal[] = [
  { id: "increase-productivity", label: "Increase productivity", railTitle: "To increase productivity", icon: "zap", categoryId: "productivity" },
  { id: "successful-career", label: "Have a successful career", railTitle: "To grow your career", icon: "briefcase", categoryId: "business" },
  { id: "manage-money", label: "Learn to manage money", railTitle: "To master your money", icon: "trending-up", categoryId: "money" },
  { id: "boost-intelligence", label: "Boost intelligence", railTitle: "To boost intelligence", icon: "brain", categoryId: "business" },
  { id: "life-balance", label: "Achieve life balance", railTitle: "To find life balance", icon: "flower", categoryId: "spirituality" },
  { id: "persuade-people", label: "Persuade & sell better", railTitle: "To persuade & sell", icon: "megaphone", categoryId: "marketing" },
  { id: "healthy-relationships", label: "Develop healthy relationships", railTitle: "To build relationships", icon: "users", categoryId: "personalities" },
];

export const goalById = (id: string) => GOALS.find((g) => g.id === id);
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);

export const COLLECTIONS: Collection[] = [
  {
    id: "money-mindset",
    title: "How to Manage Money",
    subtitle: "5 summaries · Wealth fundamentals",
    tileGradient: ["#1E3FCB", "#2F5FF6"],
    bookIds: ["intelligent-investor", "diamonds-in-the-dust", "principles-changing-world-order", "capital-allocators", "zero-to-one"],
  },
  {
    id: "build-the-business",
    title: "Build the Business",
    subtitle: "6 summaries · Founder essentials",
    tileGradient: ["#7C3AED", "#A78BFA"],
    bookIds: ["rework", "zero-to-one", "start-with-why", "strategy-beyond-hockey-stick", "business-adventures", "mckinsey-mind"],
  },
  {
    id: "words-that-sell",
    title: "Words That Sell",
    subtitle: "3 summaries · Persuasion craft",
    tileGradient: ["#F97316", "#FB923C"],
    bookIds: ["confessions-advertising-man", "adweek-copywriting-handbook", "22-immutable-laws-marketing"],
  },
  {
    id: "inner-calm",
    title: "Inner Calm",
    subtitle: "4 summaries · Mind & meaning",
    tileGradient: ["#DB2777", "#F472B6"],
    bookIds: ["bhagavad-gita", "tiny-habits", "start-with-why", "mckinsey-mind"],
  },
];

export const CHALLENGES: Challenge[] = [
  { id: "morning-routine", title: "Morning Routine", days: 5, progressDay: 2 },
  { id: "money-week", title: "Money Smart Week", days: 7, progressDay: 0 },
];

