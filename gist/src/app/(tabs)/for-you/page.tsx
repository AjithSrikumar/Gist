"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Flame, Gift, BookOpen } from "lucide-react";
import { ScreenPadding } from "@/components/AppShell";
import { StreakFlame } from "@/components/StreakFlame";
import { HorizontalRail } from "@/components/HorizontalRail";
import { BookCard, BookCover } from "@/components/BookCard";
import { BOOK_METAS, booksForGoal } from "@/data/books";
import { GOALS, goalById, categoryById } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function ForYouPage() {
  const store = useStore();
  const router = useRouter();
  const goals = store.selectedGoals.length ? store.selectedGoals : ["increase-productivity"];
  const upNext = BOOK_METAS.filter(
    (b) => !store.library.finished.includes(b.id)
  ).slice(0, 8);
  const daily = BOOK_METAS.find((b) => b.gift) ?? BOOK_METAS[0];
  const pointsLeft = Math.max(1, 3 - (store.streakCount % 3));

  return (
    <ScreenPadding>
      <header className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white">
            <BookOpen size={18} strokeWidth={2.4} />
          </div>
          <span className="text-[22px] font-extrabold tracking-tight text-ink-900">Gist</span>
        </div>
        <StreakFlame count={store.streakCount} />
      </header>

      {/* streak banner */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          const b = upNext[0];
          if (!b) return;
          useStore.getState().openReader(b.id);
        }}
        className="mx-4 mt-4 flex w-[calc(100%-32px)] items-center gap-3 rounded-card bg-surface-peach p-4 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-orange/20 text-accent-orange">
          <Flame size={20} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold text-ink-900">
            {pointsLeft} key point{pointsLeft > 1 ? "s" : ""} left to get a streak
          </span>
          <span className="text-[12px] text-ink-600">Finish one summary today</span>
        </span>
        <ArrowRight size={18} className="shrink-0 text-accent-orange" />
      </motion.button>

      {/* free daily summary promo */}
      <button
        onClick={() => useStore.getState().openBookDetail(daily.id)}
        className="mx-4 mt-3 flex w-[calc(100%-32px)] items-center gap-3 rounded-card bg-brand-blue p-4 text-left"
      >
        <BookCover book={daily} className="h-16 w-11 shrink-0 rounded-md" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold tracking-widest text-white/70">FREE DAILY SUMMARY</span>
          <span className="mt-0.5 block truncate text-[15px] font-bold text-white">{daily.title}</span>
          <span className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-white/90">
            Get it now <ArrowRight size={14} />
          </span>
        </span>
        <Gift size={22} className="shrink-0 text-white/80" />
      </button>

      {/* categories you're interested in */}
      <section className="mt-6 px-4">
        <h2 className="text-[17px] font-semibold text-ink-900">Categories you&apos;re interested in</h2>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {goals
            .map((g) => goalById(g))
            .filter(Boolean)
            .map((g) => {
              const cat = categoryById(g!.categoryId)!;
              return (
              <button
                key={g!.id}
                onClick={() => router.push("/explore")}
                className="h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold text-white"
                style={{ backgroundColor: cat.color }}
              >
                  {cat.name}
                </button>
              );
            })}
        </div>
      </section>

      {/* up next rail */}
      <HorizontalRail title="Up next" subtitle="Queued for your daily growth">
        {upNext.map((b) => (
          <BookCard key={b.id} book={b} onOpen={(id) => useStore.getState().openBookDetail(id)} showGift />
        ))}
      </HorizontalRail>

      {/* colorful circular goal/category row */}
      <section className="mt-7 px-4">
        <h2 className="text-[17px] font-semibold text-ink-900">Explore by goal</h2>
        <div className="no-scrollbar mt-3 flex gap-5 overflow-x-auto pb-1">
          {GOALS.map((g) => {
            const cat = categoryById(g.categoryId)!;
            const Icon = ICONS[g.icon];
            return (
              <button key={g.id} className="flex w-[72px] shrink-0 flex-col items-center gap-2" aria-label={g.label}>
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
                >
                  <Icon size={24} />
                </span>
                <span className="line-clamp-2 text-center text-[11px] leading-tight font-medium text-ink-900">{g.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* one rail per selected goal */}
      {goals.map((gid) => {
        const g = goalById(gid);
        if (!g) return null;
        return (
          <HorizontalRail
            key={gid}
            title={g.railTitle}
            subtitle="Top-rated summaries for this goal"
          >
            {booksForGoal(gid).map((b) => (
              <BookCard key={b.id} book={b} onOpen={(id) => useStore.getState().openBookDetail(id)} showGift />
            ))}
          </HorizontalRail>
        );
      })}

      {/* daily microlearning session */}
      <HorizontalRail title="Daily microlearning session" subtitle="Quick takeaways from the books you love">
        {MICRO_TIPS.map((tip, i) => (
          <motion.button
            whileTap={{ scale: 0.94 }}
            key={i}
            onClick={() => useStore.getState().openBookDetail(tip.bookId)}
            className="relative h-28 w-28 shrink-0 snap-start-always overflow-hidden rounded-2xl border-2 border-white/60 shadow-card"
            style={{ background: `linear-gradient(150deg, ${PASTELS[i % PASTELS.length]}, ${PASTELS[(i + 2) % PASTELS.length]})` }}
          >
            <div className="flex h-full flex-col items-center justify-center px-2.5 text-center">
              <span className="text-[22px]">{tip.emoji}</span>
              <span className="mt-1 line-clamp-2 text-[9px] leading-tight font-semibold text-ink-900/80">{tip.title}</span>
            </div>
          </motion.button>
        ))}
      </HorizontalRail>
    </ScreenPadding>
  );
}

const PASTELS = ["#FFD9E8", "#CDE4FF", "#D6F5E3", "#FFE8CC", "#EBDFFF", "#FFF3B0"];

const MICRO_TIPS = [
  { emoji: "🎯", title: "Start absurdly small", bookId: "tiny-habits" },
  { emoji: "💰", title: "Margin of safety", bookId: "intelligent-investor" },
  { emoji: "🔑", title: "Start with Why", bookId: "start-with-why" },
  { emoji: "📈", title: "Monopoly over competition", bookId: "zero-to-one" },
  { emoji: "✍️", title: "Emotion first, proof second", bookId: "adweek-copywriting-handbook" },
  { emoji: "🧠", title: "MECE structuring", bookId: "mckinsey-mind" },
];

import { Zap, Briefcase, TrendingUp, Brain, Flower2, Megaphone, Users, type LucideIcon } from "lucide-react";
const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  brain: Brain,
  flower: Flower2,
  megaphone: Megaphone,
  users: Users,
};

