"use client";

import { useMemo, useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FullModal } from "@/components/ui/Sheet";
import { BookCard } from "@/components/BookCard";
import { EmptyState } from "@/components/ui/Controls";
import { BOOK_METAS } from "@/data/books/index";
import { CATEGORIES } from "@/data/catalog";
import { useStore } from "@/lib/store";

export function SearchModal() {
  const open = useStore((s) => s.searchOpen);
  const close = () => useStore.getState().setSearchOpen(false);
  const openBook = (id: string) => {
    useStore.getState().openBookDetail(id);
  };

  return (
    <FullModal open={open} onClose={close}>
      <SearchContent onClose={close} onOpenBook={openBook} />
    </FullModal>
  );
}

function SearchContent({
  onClose,
  onOpenBook,
}: {
  onClose: () => void;
  onOpenBook: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [offersOpen, setOffersOpen] = useState(false);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return null;
    return BOOK_METAS.filter(
      (b) =>
        b.title.toLowerCase().includes(t) ||
        b.author.toLowerCase().includes(t) ||
        b.description.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <div className="flex h-12 flex-1 items-center gap-2 rounded-button bg-white border border-divider px-4">
          <Search size={18} className="shrink-0 text-ink-600" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type title, author, or keyword"
            className="h-full w-full bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-600/70"
          />
          {q && (
            <button aria-label="Clear" onClick={() => setQ("")} className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <X size={16} className="text-ink-600" />
            </button>
          )}
        </div>
        <button onClick={onClose} className="h-11 w-11 text-[15px] font-semibold text-brand-blue">
          Cancel
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-10">
        {results === null ? (
          <>
            <h2 className="text-[17px] font-semibold text-ink-900">I want to learn about…</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setQ(c.name.split(" ")[0].toLowerCase())}
                  className="flex min-h-[72px] items-center gap-3 rounded-card p-4 text-left"
                  style={{ backgroundColor: `${c.color}1A` }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: c.color }}>
                    <Search size={16} />
                  </span>
                  <span className="text-[14px] leading-tight font-semibold text-ink-900">{c.name}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-card bg-surface-peach">
              <button
                onClick={() => setOffersOpen((v) => !v)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-pink text-white">%</span>
                <span className="flex-1 text-[14px] font-semibold text-ink-900">Special offers</span>
                {offersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence initial={false}>
                {offersOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-[13px] leading-relaxed text-ink-600">
                      A gift for you: unlock a free premium summary every day. Start your 7-day free trial to read
                      and listen without limits.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : results.length === 0 ? (
          <EmptyState message="No summary found" />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {results.map((b) => (
              <BookCard key={b.id} book={b} width={undefined} onOpen={onOpenBook} showGift />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
