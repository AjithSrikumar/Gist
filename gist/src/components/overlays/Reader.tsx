"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Link2,
  Bookmark,
  AlignLeft,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FullModal, Sheet } from "@/components/ui/Sheet";
import { BookCover } from "@/components/BookCard";
import { RatingStars } from "@/components/ui/Controls";
import { loadBook, BOOK_METAS, unitCount, unitTitle, unitBody, unitTakeaway, unitTakeaways } from "@/data/books";
import { categoryById } from "@/data/catalog";
import { useStore } from "@/lib/store";
import type { Book } from "@/lib/types";
import { Slider, SliderTrack, SliderRange, SliderThumb } from "@radix-ui/react-slider";

const THEMES = {
  cream: { bg: "#F7F3EA", text: "#16181D", sub: "#5B6068" },
};

const EMPTY_CHAPTERS: number[] = [];
  white: { bg: "#FFFFFF", text: "#16181D", sub: "#5B6068" },
  dark: { bg: "#16181D", text: "#F7F3EA", sub: "#9AA0A8" },
};

export function ReaderModal() {
  const id = useStore((s) => s.readerBookId);
  const [data, setData] = useState<{ loadedFor: string | null; book: Book | null; error: boolean }>({
    loadedFor: null,
    book: null,
    error: false,
  });
  const [page, setPage] = useState(0); // 0 intro, 1..n points, n+1 wrap-up

  useEffect(() => {
    setData({ loadedFor: id, book: null, error: false });
    setPage(0);
    if (!id) return;
    let cancelled = false;
    loadBook(id).then((b) => {
      if (cancelled) return;
      setData({ loadedFor: id, book: b, error: !b });
    }).catch(() => {
      if (!cancelled) setData({ loadedFor: id, book: null, error: true });
    });
    return () => { cancelled = true; };
  }, [id]);

  const book = data.book;

  const closeReader = () => {
    const s = useStore.getState();
    if (book && page > 1 && !s.library.finished.includes(book.id)) {
      const pct = Math.round((Math.min(page - 1, unitCount(book)) / unitCount(book)) * 100);
      s.upsertProgress(book.id, pct, Math.max(0, page - 2));
    }
    s.openReader(null);
    if (book) {
      setTimeout(() => s.openBookDetail(book.id), 100);
    }
  };

  return (
    <FullModal open={!!id} onClose={closeReader}>
      {!book ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-ink-600">
          {data.error ? (
            <>
              <p>Failed to load summary.</p>
              <button onClick={closeReader} className="h-10 rounded-button bg-brand-blue px-6 text-[14px] font-semibold text-white">
                Go back
              </button>
            </>
          ) : (
            <p>Loading…</p>
          )}
        </div>
      ) : (
        <ReaderBody book={book} page={page} setPage={setPage} onClose={closeReader} />
      )}
    </FullModal>
  );
}

function ReaderBody({
  book,
  page,
  setPage,
  onClose,
}: {
  book: Book;
  page: number;
  setPage: (n: number) => void;
  onClose: () => void;
}) {
  const theme = useStore((s) => THEMES[s.readerTheme]);
  const scale = useStore((s) => s.readerTextScale / 100);
  const isDark = useStore((s) => s.readerTheme === "dark");
  const total = Math.max(1, unitCount(book));
  const isIntro = page === 0;
  const isWrapUp = page === total + 1;
  const saved = useStore((s) => s.library.savedForLater.includes(book.id));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);

  // Scroll to top on chapter change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  useEffect(() => {
    if (page >= 1 && !isWrapUp) {
      useStore.getState().upsertProgress(book.id, Math.round((page / total) * 100), page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const point =
    !isIntro && !isWrapUp
      ? {
          heading: unitTitle(book, page - 1),
          body: unitBody(book, page - 1),
        }
      : null;

const nextPage = () => {
    if (isWrapUp) return;
    const next = Math.min(total + 1, page + 1);
    setPage(next);
  };
  const prevPage = () => setPage(Math.max(0, page - 1));

  const progress = isWrapUp ? 100 : (page / (total + 1)) * 100;

  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: theme.bg }}>
      {/* top bar */}
      <div className="flex items-center justify-between px-2 pt-3 pb-1">
        <button aria-label="Close reader" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full">
          <X size={22} style={{ color: theme.text }} />
        </button>
        <div className="flex items-center">
          <button
            aria-label="Share"
            onClick={async () => {
              try {
                await navigator.share({ title: book.title, text: `Check out "${book.title}" on Gist`, url: window.location.href });
              } catch {
                await navigator.clipboard.writeText(`Check out "${book.title}" on Gist — ${window.location.href}`);
                setShared(true);
                setTimeout(() => setShared(false), 1500);
              }
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            {shared ? (
              <Check size={19} className="text-accent-green" />
            ) : (
              <Link2 size={19} className="text-ink-600" />
            )}
          </button>
          <button
            aria-label="Bookmark"
            onClick={() => {
              const s = useStore.getState();
              if (s.library.savedForLater.includes(book.id)) {
                s.removeFromLibrary(book.id);
              } else {
                s.saveToLibrary(book.id);
              }
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            <Bookmark size={19} className={saved ? "fill-brand-blue text-brand-blue" : "text-ink-600"} />
          </button>
        </div>
      </div>

      {/* content */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-6"
        onClick={(e) => {
          const x = e.clientX - window.innerWidth / 2;
          if (!isIntro && Math.abs(e.clientY - window.innerHeight) < Infinity) {
            // tap zones only when not selecting text
            const sel = window.getSelection();
            if (sel && sel.toString().length > 0) return;
          }
          void x;
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.18 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 && !(isIntro && false)) nextPage();
              else if (info.offset.x > 70) prevPage();
            }}
          >
            {isIntro && <IntroPage book={book} onStart={nextPage} theme={theme} />}
            {point && (
              <div className="pt-4 pb-28">
                <p className="text-[12px] font-bold tracking-widest text-ink-600" style={{ color: theme.sub }}>
                  CHAPTER {page} OF {total}
                </p>
                <h1 className="mt-2 text-[24px] leading-tight font-bold" style={{ color: theme.text }}>
                  {point.heading}
                </h1>
                {unitBody(book, page - 1)
                  .split(/\n\n+/)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="mt-5 leading-[1.75]"
                      style={{ color: theme.text, fontSize: `${15 * scale}px` }}
                    >
                      {para}
                    </p>
                  ))}
                {(() => {
                  const takeaways = unitTakeaways(book, page - 1);
                  const fallback = unitTakeaway(book, page - 1) ?? point.heading;
                  const items = takeaways.length ? takeaways : fallback ? [fallback] : [];
                  return items.length > 0 ? (
                    <div
                      className="mt-6 rounded-card border-l-4 border-accent-green bg-bg-white/70 p-4"
                      style={isDark ? { backgroundColor: "#22262c" } : undefined}
                    >
                      <p className="text-[11px] font-bold tracking-widest text-accent-green">
                        {items.length === 1 ? "KEY TAKEAWAY" : "KEY TAKEAWAYS"}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {items.map((t, i) => (
                          <li key={i} className="flex gap-2 text-[14px] leading-snug font-medium" style={{ color: theme.text }}>
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}
                {page === 2 && <RememberPrompt bookId={book.id} pointIndex={1} snippet={unitTakeaway(book, 1) ?? unitTitle(book, 1)} />}
              </div>
            )}
            {isWrapUp && <WrapUp book={book} />}
          </motion.div>
        </AnimatePresence>

        {!isIntro && !isWrapUp && (
          <div className="pb-32 pt-2">
            <button
              onClick={nextPage}
              className="h-12 w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
            >
              {page === total ? "Finish summary" : "Next"}
            </button>
          </div>
        )}
      </div>

      {/* floating chapters button */}
      {!isIntro && (
        <button
          aria-label="Open chapters"
          onClick={() => useStore.getState().setContentsSheet(true)}
          className="absolute bottom-20 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-divider bg-bg-white/85 shadow-card backdrop-blur"
          style={{ borderColor: isDark ? "#33383f" : undefined }}
        >
          <AlignLeft size={20} style={{ color: theme.sub }} />
        </button>
      )}

      {/* thin progress bar pinned to very bottom */}
      <div className="h-[3px] w-full bg-divider/60">
        <motion.div className="h-full bg-brand-blue" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
      </div>

      <ContentsInsightsSheet book={book} onJump={(i) => setPage(i + 1)} currentPage={page} />
      <ReaderThemeSheet />
      {isWrapUp && <EndFlow book={book} />}
    </div>
  );
}

function RememberPrompt({ bookId, pointIndex, snippet }: { bookId: string; pointIndex: number; snippet: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const addHighlight = useStore((s) => s.addHighlight);
  return (
    <AnimatePresence>
      {!vote && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mt-8 rounded-card bg-bg-white p-4 shadow-card"
        >
          <p className="text-[13px] leading-snug text-ink-900">
            Remember this? <span className="font-semibold">“{snippet}”</span>
          </p>
          <div className="mt-3 flex gap-2">
<button
              aria-label="Save highlight"
              onClick={() => {
                addHighlight(bookId, pointIndex, snippet);
                setVote("up");
              }}
              className="flex h-10 items-center gap-2 rounded-full border border-divider px-4 text-[13px] font-semibold text-ink-900"
            >
              <ThumbsUp size={14} /> Save it
            </button>
            <button
              aria-label="Dismiss"
              onClick={() => setVote("down")}
              className="flex h-10 items-center gap-2 rounded-full border border-divider px-4 text-[13px] text-ink-600"
            >
              <ThumbsDown size={14} /> Not now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IntroPage({ book, onStart, theme }: { book: Book; onStart: () => void; theme: { text: string; sub: string } }) {
  const cat = categoryById(book.categoryId);
  return (
    <div className="pt-4 pb-28">
      <BookCover book={book} className="mx-auto aspect-[2/3] h-[220px]" />
      <div className="mt-5 text-center">
        {cat && (
          <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: cat.color }}>
            {cat.name.toUpperCase()}
          </span>
        )}
        <h1 className="mt-2 text-[26px] leading-tight font-bold" style={{ color: theme.text }}>
          {book.title}
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: theme.sub }}>
          {book.author}
        </p>
        <p className="mx-auto mt-4 max-w-[300px] text-[14px] leading-relaxed" style={{ color: theme.sub }}>
          {book.description}
        </p>
      </div>
      <div className="fixed inset-x-0 bottom-[130px] mx-auto flex max-w-[430px] px-6">
        <button onClick={onStart} className="h-12 w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk">
          Start reading
        </button>
      </div>
    </div>
  );
}

function WrapUp({ book }: { book: Book }) {
  return (
    <div className="pt-6 pb-10">
      <p className="text-[12px] font-bold tracking-widest text-ink-600">CONCLUSION</p>
      <h1 className="mt-2 text-[24px] leading-tight font-bold text-ink-900">The gist of it</h1>
      <p className="mt-5 text-[15px] leading-[1.75] text-ink-900">{book.content.conclusion}</p>
    </div>
  );
}

/** End-of-summary flow rendered over the wrap-up page: rating → celebration → next picks */
const EndFlow = React.memo(function EndFlow({ book }: { book: Book }) {
  const [stage, setStage] = useState<"rate" | "feedback" | "next">("rate");
  const rating = useStore((s) => s.ratings[book.id] ?? 0);
  const finishSummary = useStore((s) => s.finishSummary);
  const showCelebration = useStore((s) => s.showCelebration);
  const streakCount = useStore((s) => s.streakCount);
  return (
    <Sheet open maxHeight="92dvh" onClose={() => {}}>
      <div className="px-5 pb-10">
        {stage === "rate" && (
          <>
            <h2 className="mt-2 text-center text-[20px] font-bold text-ink-900">Rate this summary</h2>
            <p className="mt-1 mb-5 text-center text-[13px] text-ink-600">Rate it to get better recommendations</p>
            <RatingStars value={rating} onChange={() => setStage("feedback")} />
            <button onClick={() => setStage("next")} className="mt-8 h-12 w-full rounded-button border-2 border-divider text-[15px] font-semibold text-ink-600">
              Skip for now
            </button>
          </>
        )}
        {stage === "feedback" && (
          <>
            <div className="my-8 text-center text-[17px] font-semibold text-ink-900">Thanks for your feedback!</div>
            <p className="mb-5 text-center text-[13px] text-ink-600">Was this summary useful?</p>
            <div className="mb-8 flex justify-center gap-4">
              {[ThumbsUp, ThumbsDown].map((Icon, i) => (
                <motion.button whileTap={{ scale: 0.88 }} key={i} onClick={() => setStage("next")} aria-label={i === 0 ? "Yes" : "No"} className="flex h-14 w-14 items-center justify-center rounded-full border border-divider">
                  <Icon size={22} className="text-ink-900" />
                </motion.button>
              ))}
            </div>
          </>
        )}
        {stage === "next" && (
          <NextPicks
            onFinish={() => {
              const gained = finishSummary(book.id);
              showCelebration(streakCount);
              void gained;
            }}
          />
        )}
      </div>
    </Sheet>
  );
}

function NextPicks({ onFinish }: { onFinish: () => void }) {
  const finished = useStore((s) => s.library.finished);
  const picks = BOOK_METAS.filter((b) => !finished.some((f) => f.id === b.id)).slice(0, 6);
  return (
    <>
      <h2 className="text-[20px] font-bold text-ink-900">Choose your next summary</h2>
      <p className="mt-1 text-[13px] text-ink-600">Keep the momentum going</p>
      <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4">
        {picks.map((b) => (
          <button key={b.id} onClick={() => useStore.getState().openBookDetail(b.id)} className="text-left">
            <BookCover book={b} className="aspect-[2/3] w-full" />
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-tight font-semibold text-ink-900">{b.title}</p>
          </button>
        ))}
      </div>
      <button onClick={onFinish} className="mt-7 h-12 w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk">
        Done
      </button>
    </>
  );
}

const ContentsInsightsSheet = React.memo(function ContentsInsightsSheet({ book, onJump, currentPage }: { book: Book; onJump: (i: number) => void; currentPage: number }) {
  const open = useStore((s) => s.contentsSheetOpen);
  const close = () => useStore.getState().setContentsSheet(false);
  const readChapters = useStore((s) => {
    const entry = s.library.continuing.find((c) => c.bookId === book.id);
    return entry?.readChapters ?? EMPTY_CHAPTERS;
  });
  const total = unitCount(book);
  const readCount = readChapters.length;
  const pct = Math.round((readCount / total) * 100);

  return (
    <Sheet open={open} onClose={close}>
      <TabsRoot defaultValue="contents">
        <TabsList>
          <TabsTrigger value="contents">Contents</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="contents">
          <div className="px-5 pb-2">
            <div className="flex items-center justify-between text-[12px] text-ink-600">
              <span>{readCount} of {total} chapters read</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-divider">
              <div className="h-full rounded-full bg-accent-green" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <ul className="px-5 pb-6">
            {[...Array(total).keys()].map((_, i) => {
              const done = readChapters?.includes(i) ?? false;
              const active = currentPage === i + 1;
              return (
                <li key={i}>
                  <button
                    onClick={() => { onJump(i); close(); }}
                    className={`flex w-full items-start gap-3 py-3 text-left ${active ? "rounded-xl bg-brand-blue/5 -mx-1 px-1" : ""}`}
                  >
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? "bg-accent-green text-white" : active ? "bg-brand-blue text-white" : "bg-bg-cream text-ink-600"}`}>
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[14px] font-semibold ${active ? "text-brand-blue" : "text-ink-900"}`}>{unitTitle(book, i)}</span>
                      <span className="line-clamp-1 text-[12px] text-ink-600">{unitTakeaway(book, i) ?? unitBody(book, i)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </TabsContent>
        <TabsContent value="insights">
          <ul className="space-y-3 px-5 pb-6">
            {book.content.insights.map((ins, i) => (
              <li key={i} className="rounded-2xl bg-bg-cream p-4 text-[14px] leading-relaxed text-ink-900">
                <Lightbulb size={14} className="mr-1.5 inline text-accent-orange" />
                {ins}
              </li>
            ))}
          </ul>
        </TabsContent>
      </TabsRoot>
    </Sheet>
  );
}

const ReaderThemeSheet = React.memo(function ReaderThemeSheet() {
  const open = useStore((s) => s.themeSheetOpen);
  const close = () => useStore.getState().setThemeSheet(false);
  const theme = useStore((s) => s.readerTheme);
  const scale = useStore((s) => s.readerTextScale);
  return (
    <Sheet open={open} onClose={close}>
      <div className="px-5 pb-10">
        <h2 className="text-[17px] font-semibold text-ink-900">Background</h2>
        <div className="mt-3 flex gap-3">
          {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((t) => (
            <button
              key={t}
              onClick={() => useStore.getState().setReaderTheme(t)}
              aria-label={`${t} background`}
              className={`h-14 w-14 rounded-xl border-2 ${theme === t ? "border-brand-blue" : "border-transparent"}`}
              style={{
                background: THEMES[t].bg === "#FFFFFF" ? "#fff" : THEMES[t].bg,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
              }}
            >
              <span className="text-lg font-bold" style={{ color: THEMES[t].text }}>
                Aa
              </span>
            </button>
          ))}
        </div>
        <h2 className="mt-6 text-[17px] font-semibold text-ink-900">Text size {scale}%</h2>
        <Slider
          value={[scale]}
          min={80}
          max={140}
          step={10}
          onValueChange={([v]: number[]) => useStore.getState().setReaderTextScale(v)}
          className="relative mt-4 flex h-8 touch-none select-none items-center"
        >
          <SliderTrack className="relative h-[5px] w-full grow overflow-hidden rounded-full bg-divider">
            <SliderRange className="absolute h-full bg-brand-blue" />
          </SliderTrack>
          <SliderThumb className="block h-5 w-5 rounded-full bg-bg-white shadow ring-2 ring-brand-blue" aria-label="Text size" />
        </Slider>
      </div>
    </Sheet>
  );
}

/* Radix Tabs re-exports with styling */
import * as RadixTabs from "@radix-ui/react-tabs";
const TabsRoot = ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => (
  <RadixTabs.Root defaultValue={defaultValue}>{children}</RadixTabs.Root>
);
const TabsList = ({ children }: { children: React.ReactNode }) => (
  <RadixTabs.List className="sticky top-0 z-10 flex bg-bg-white">{children}</RadixTabs.List>
);
const TabsTrigger = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <RadixTabs.Trigger
    value={value}
    className="flex-1 border-b-2 border-divider py-3 text-[15px] font-semibold text-ink-600 data-[state=active]:border-brand-blue data-[state=active]:text-ink-900"
  >
    {children}
  </RadixTabs.Trigger>
);
const TabsContent = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <RadixTabs.Content value={value} className="pt-3 focus:outline-none">
    {children}
  </RadixTabs.Content>
);



