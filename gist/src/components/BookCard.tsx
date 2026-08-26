"use client";

import Image from "next/image";
import type { BookMeta } from "@/lib/types";
import { categoryById } from "@/data/catalog";
import { motion } from "framer-motion";

export function BookCover({
  book,
  className = "",
}: {
  book: Pick<BookMeta, "cover" | "coverGradient" | "title">;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-card ${className}`}
      style={{ background: `linear-gradient(160deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})` }}
    >
      <Image
        src={book.cover}
        alt={book.title}
        fill
        sizes="(max-width:480px) 40vw, 200px"
        className="object-cover"
      />
    </div>
  );
}

export function BookCard({
  book,
  width = 120,
  onOpen,
  showGift = false,
  lastRead = false,
}: {
  book: BookMeta;
  width?: number;
  onOpen: (id: string) => void;
  showGift?: boolean;
  lastRead?: boolean;
}) {
  const cat = categoryById(book.categoryId);
  const gift = showGift && book.gift;
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onOpen(book.id)}
      className="relative flex shrink-0 snap-start-always flex-col text-left active:opacity-90"
      style={{ width }}
    >
      <div className="relative">
        <BookCover book={book} className="aspect-[2/3] w-full" />
        {lastRead && (
          <div className="absolute -top-1 right-1.5 rounded-full bg-brand-blue px-2 py-0.5 text-[8px] font-bold tracking-wide text-white shadow">
            LAST READ
          </div>
        )}
        {gift && (
          <div className="absolute -top-1 right-1.5 rounded-full bg-accent-pink px-2 py-0.5 text-[8px] font-bold tracking-wide text-white shadow">
            GIFT
          </div>
        )}
      </div>
      {cat && (
        <span
          className="mt-2 w-fit max-w-full truncate rounded-full px-2 py-[3px] text-[9px] leading-none font-bold tracking-wide text-white"
          style={{ backgroundColor: cat.color }}
        >
          {(cat.short ?? cat.name).toUpperCase()}
        </span>
      )}
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug font-semibold text-ink-900">{book.title}</p>
      <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-600">{book.author}</p>
    </motion.button>
  );
}
