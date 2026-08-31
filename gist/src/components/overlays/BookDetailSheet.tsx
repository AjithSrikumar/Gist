"use client";

import { useEffect, useState } from "react";
import { X, Share, Download, Bookmark, Clock3, ListOrdered, Lightbulb, Check } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { BookCover } from "@/components/BookCard";
import { loadBook, unitCount, unitTitle, bookDurationMin } from "@/data/books";
import { categoryById } from "@/data/catalog";
import { useStore } from "@/lib/store";
import type { Book } from "@/lib/types";

export function BookDetailSheet() {
  const id = useStore((s) => s.bookDetailId);
  const close = () => useStore.getState().openBookDetail(null);
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    setBook(null);
    if (!id) return;
    let cancelled = false;
    loadBook(id).then((b) => {
      if (!cancelled) setBook(b);
    });
    return () => { cancelled = true; };
  }, [id]);

  return (
    <Sheet open={!!id} onClose={close}>
      {!book ? (
        <div className="p-10 text-center text-ink-600">Loading…</div>
      ) : (
        <BookDetailContent
          book={book}
          saved={useStore.getState().library.savedForLater.includes(book.id)}
          done={useStore.getState().library.finished.includes(book.id)}
          onClose={close}
        />
      )}
    </Sheet>
  );
}

function BookDetailContent({
  book,
  saved,
  done,
  onClose,
}: {
  book: Book;
  saved: boolean;
  done: boolean;
  onClose: () => void;
}) {
  const openBookDetail = useStore((s) => s.openBookDetail);
  const openReader = useStore((s) => s.openReader);
  const removeFromLibrary = useStore((s) => s.removeFromLibrary);
  const saveToLibrary = useStore((s) => s.saveToLibrary);
  const cat = categoryById(book.categoryId);

  const user = useStore((s) => s.user);
  const openBook = () => {
    if (!user) {
      useStore.setState({ pendingBookId: book.id });
      useStore.getState().openPaywall("profile");
      return;
    }
    openBookDetail(null);
    openReader(book.id);
  };

  return (
    <div className="px-5 pb-8">
      <div className="flex items-center justify-between py-1">
        <button aria-label="Close" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full">
          <X size={22} />
        </button>
        <div className="flex items-center">
          {[Share, Download].map((Icon, i) => (
            <button key={i} aria-label="Share" className="flex h-11 w-11 items-center justify-center rounded-full">
              <Icon size={20} className="text-ink-600" />
            </button>
          ))}
          <button
            aria-label="Bookmark"
            onClick={() => (saved ? removeFromLibrary(book.id) : saveToLibrary(book.id))}
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            <Bookmark size={20} className={saved ? "fill-brand-blue text-brand-blue" : "text-ink-600"} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex gap-5">
        <BookCover book={book} className="h-[168px] w-[112px] shrink-0" />
        <div className="min-w-0 flex-1 pt-1">
          {cat && (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name.toUpperCase()}
            </span>
          )}
          <div className="mt-2 text-[11px] font-bold tracking-widest text-ink-600">SUMMARY</div>
          <h1 className="mt-0.5 text-[22px] leading-tight font-bold text-ink-900">{book.title}</h1>
          <p className="mt-1 text-[13px] text-ink-600">{book.author}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-around rounded-2xl bg-bg-cream px-4 py-3 text-[13px] font-medium text-ink-900">
        <Meta icon={<ListOrdered size={16} className="text-brand-blue" />} label={`${unitCount(book)} ${book.content.chapters ? "chapters" : "key points"}`} />
        <Divider />
        <Meta icon={<Clock3 size={16} className="text-accent-green" />} label={`${bookDurationMin(book)} min read`} />
        <Divider />
        <Meta icon={<Lightbulb size={16} className="text-accent-orange" />} label={`${book.insightsCount} insights`} />
      </div>

      <section className="mt-6">
        <h2 className="text-[17px] font-semibold text-ink-900">What&apos;s inside?</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{book.description}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-[17px] font-semibold text-ink-900">You&apos;ll learn</h2>
        <ul className="mt-3 space-y-3">
          {book.learnBullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-snug text-ink-900">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green/15">
                <Check size={12} strokeWidth={3} className="text-accent-green" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7">
        <button
          onClick={openBook}
          className="h-12 w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
        >
          Start reading
        </button>
      </div>

      <section className="mt-8 border-t border-divider pt-5">
        <h2 className="text-[17px] font-semibold text-ink-900">About the authors</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{book.content.aboutAuthor}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-[17px] font-semibold text-ink-900">
          {book.content.chapters ? `Chapters (${unitCount(book)})` : "Key points"}
        </h2>
        <ol className="mt-3 space-y-3">
          {[...Array(unitCount(book)).keys()].map((_, i) => (
            <li key={i} className="rounded-2xl bg-bg-cream p-4">
              <div className="text-[11px] font-bold tracking-widest text-ink-600">
                {book.content.chapters ? "CHAPTER" : "KEY POINT"} {i + 1}
              </div>
              <div className="mt-1 text-[14px] font-semibold text-ink-900">{unitTitle(book, i)}</div>
              {!book.content.chapters && null}
            </li>
          ))}
        </ol>
        {done && <div className="mt-3 text-[12px] text-accent-green">✓ Finished — in your Library</div>}
      </section>
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>{label}</span>
    </div>
  );
}
function Divider() {
  return <div className="h-5 w-px bg-divider" />;
}
