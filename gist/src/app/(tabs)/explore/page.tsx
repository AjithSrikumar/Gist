"use client";

import { useMemo, useState } from "react";
import { Search, Dices, Gift, Clock3, Zap, Briefcase, TrendingUp, Brain, Flower2, Megaphone, Users, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ScreenPadding } from "@/components/AppShell";
import { HorizontalRail } from "@/components/HorizontalRail";
import { BookCard, BookCover } from "@/components/BookCard";
import { CATEGORIES, COLLECTIONS, CHALLENGES } from "@/data/catalog";
import { BOOK_METAS } from "@/data/books";
import { useStore } from "@/lib/store";

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  brain: Brain,
  flower: Flower2,
  megaphone: Megaphone,
  users: Users,
};

export default function ExplorePage() {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter ? BOOK_METAS.filter((b) => b.categoryId === filter) : BOOK_METAS),
    [filter]
  );

  const rollDice = () => {
    const pick = BOOK_METAS[Math.floor(Math.random() * BOOK_METAS.length)];
    useStore.getState().openBookDetail(pick.id);
  };

  return (
    <ScreenPadding>
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Explore</h1>
        <button
          aria-label="Search"
          onClick={() => useStore.getState().setSearchOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full"
        >
          <Search size={22} className="text-ink-900" />
        </button>
      </header>

      {/* category icon grid */}
      <section className="px-4">
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={c.id}
              onClick={() => setFilter((f) => (f === c.id ? null : c.id))}
              aria-pressed={filter === c.id}
              className={`flex flex-col items-center gap-2 rounded-card p-3 ${
                filter === c.id ? "ring-2" : ""
              }`}
              style={filter === c.id ? { backgroundColor: `${c.color}14`, boxShadow: `inset 0 0 0 2px ${c.color}` } : undefined}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: c.color }}
              >
                {(() => { const Icon = ICONS[c.icon]; return Icon ? <Icon size={22} /> : c.name.slice(0, 1); })()}
              </span>
              <span className="text-center text-[11px] leading-tight font-semibold text-ink-900">{c.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* to get you started */}
      <HorizontalRail title="To get you started" subtitle="Crowd favorites across every goal">
        {(filter ? filtered : BOOK_METAS.slice(0, 10)).map((b) => (
          <BookCard key={b.id} book={b} onOpen={(id) => useStore.getState().openBookDetail(id)} showGift />
        ))}
      </HorizontalRail>

      {/* personalized challenges */}
      <section className="mt-6 px-4">
        <h2 className="text-[17px] font-semibold text-ink-900">Personalized challenges</h2>
        <div className="mt-3 space-y-3">
          {CHALLENGES.map((ch) => (
            <button
              key={ch.id}
              onClick={() => useStore.getState().openPaywall("profile")}
              className="flex w-full items-center gap-4 rounded-card bg-bg-white p-4 text-left shadow-card"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-peach text-accent-orange">
                <Clock3 size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink-900">{ch.title}</span>
                <span className="text-[12px] text-ink-600">
                  {ch.days}-day challenge{ch.progressDay > 0 ? ` · day ${ch.progressDay + 1} of ${ch.days}` : " · start today"}
                </span>
                <span className="mt-2 flex gap-1.5">
                  {[...Array(ch.days)].map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${i < ch.progressDay ? "bg-accent-green" : "bg-divider"}`}
                    />
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* collections grid */}
      <section className="mt-7 px-4 pb-4">
        <h2 className="text-[17px] font-semibold text-ink-900">Collections made for you</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {COLLECTIONS.map((col) => (
            <motion.button
              whileTap={{ scale: 0.97 }}
              key={col.id}
              onClick={() =>
                useStore.getState().openBookDetail(col.bookIds[0])
              }
              className="relative overflow-hidden rounded-card p-4 text-left"
              style={{
                minHeight: 140,
                background: `linear-gradient(150deg, ${col.tileGradient[0]}, ${col.tileGradient[1]})`,
              }}
            >
              <p className="text-[16px] font-bold text-white drop-shadow">{col.title}</p>
              <p className="mt-1 text-[11px] font-medium text-white/80">{col.subtitle}</p>
              <span className="absolute right-3 bottom-3 -mb-3 -mr-2 flex gap-1 opacity-60">
                {col.bookIds.slice(0, 3).map((id) => {
                  const b = BOOK_METAS.find((x) => x.id === id)!;
                  return <BookCover key={id} book={b} className="h-12 w-8 rounded-sm" />;
                })}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* floating action row */}
      <div className="fixed inset-x-0 bottom-[82px] z-30 flex justify-center">
        <div className="mx-3 flex w-full max-w-[456px] gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={rollDice}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 text-[13px] font-bold text-white shadow-sheet"
          >
            <Dices size={18} /> Roll the dice — random summary
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => useStore.getState().openPaywall("discount")}
            aria-label="Gift for you"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-pink text-white shadow-sheet"
          >
            <Gift size={20} />
          </motion.button>
        </div>
      </div>
    </ScreenPadding>
  );
}



