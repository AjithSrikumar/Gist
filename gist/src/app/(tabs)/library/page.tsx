"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Share2, CheckCircle2, Trash2, Bookmark, RefreshCw } from "lucide-react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { ScreenPadding } from "@/components/AppShell";
import { Sheet } from "@/components/ui/Sheet";
import { BookCover } from "@/components/BookCard";
import { EmptyState } from "@/components/ui/Controls";
import { BOOK_METAS, bookMetaById } from "@/data/bookData";
import { useStore } from "@/lib/store";

export default function LibraryPage() {
  const store = useStore();
  const [menuBook, setMenuBook] = useState<string | null>(null);
  const counts = {
    summaries: store.library.continuing.length + store.library.savedForLater.length + store.library.finished.length,
    repetition: store.highlights.length,
    highlights: store.highlights.length,
  };

  return (
    <ScreenPadding>
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Library</h1>
        <button
          aria-label="Search"
          onClick={() => useStore.getState().setSearchOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full"
        >
          <Search size={22} className="text-ink-900" />
        </button>
      </header>

      <RadixTabs.Root defaultValue="summaries" className="px-4">
        <RadixTabs.List className="flex rounded-full bg-divider/60 p-1">
          {(
            [
              ["summaries", `Summaries (${counts.summaries})`],
              ["repetition", `Repetition (${counts.repetition})`],
              ["highlights", `Highlights (${counts.highlights})`],
            ] as const
          ).map(([v, label]) => (
            <RadixTabs.Trigger
              key={v}
              value={v}
              className="flex-1 rounded-full py-2 text-[12px] font-semibold text-ink-600 data-[state=active]:bg-white data-[state=active]:text-ink-900 data-[state=active]:shadow-card"
            >
              {label}
            </RadixTabs.Trigger>
          ))}
        </RadixTabs.List>

        <RadixTabs.Content value="summaries" className="pt-4 focus:outline-none">
          <Section title="Continue">
            {store.library.continuing.length === 0 && <Empty message="Nothing in progress yet. Start a summary!" />}
            {store.library.continuing.map(({ bookId, progressPct }) => (
              <Row
                key={bookId}
                bookId={bookId}
                progress={progressPct}
                onOpen={(id) => useStore.getState().openBookDetail(id)}
                onMenu={() => setMenuBook(bookId)}
              />
            ))}
          </Section>
          <Section title="Saved for later">
            {store.library.savedForLater.length === 0 && <Empty message="Tap the bookmark on any summary to save it here." />}
            {store.library.savedForLater.map((id) => (
              <Row key={id} bookId={id} onOpen={(x) => useStore.getState().openBookDetail(x)} onMenu={() => setMenuBook(id)} />
            ))}
          </Section>
          <Section title="Finished">
            {store.library.finished.length === 0 && <Empty message="Finish your first summary to see it here." />}
            {store.library.finished.map((id) => (
              <Row key={id} bookId={id} done onOpen={(x) => useStore.getState().openBookDetail(x)} onMenu={() => setMenuBook(id)} />
            ))}
          </Section>
        </RadixTabs.Content>

        <RadixTabs.Content value="repetition" className="pt-4 focus:outline-none">
          {store.highlights.length === 0 ? (
            <EmptyState
              icon={<RefreshCw />}
              message="Save key points while reading and they'll appear here for spaced review."
              action={
                <button
                  onClick={() => useStore.getState().openPaywall("profile")}
                  className="h-11 rounded-button bg-brand-blue px-6 text-[15px] font-semibold text-white active:bg-brand-blue-dk"
                >
                  Discover all summaries
                </button>
              }
            />
          ) : (
            <div className="space-y-3 pb-4">
              {store.highlights.map((h) => {
                const meta = bookMetaById(h.bookId);
                return (
                  <div key={`${h.bookId}-${h.pointIndex}`} className="rounded-card bg-white p-4 shadow-card">
                    <div className="flex items-center gap-3">
                      {meta && <BookCover book={meta} className="h-10 w-7 shrink-0" />}
                      <p className="text-[14px] font-semibold text-ink-900">{meta?.title}</p>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-900">{h.snippet}</p>
                    <div className="mt-3 flex gap-2">
                      <span className="rounded-full bg-bg-cream px-3 py-1 text-[11px] font-semibold text-accent-green">Again</span>
                      <span className="rounded-full bg-bg-cream px-3 py-1 text-[11px] font-semibold text-ink-600">Good</span>
                      <span className="rounded-full bg-bg-cream px-3 py-1 text-[11px] font-semibold text-brand-blue">Easy</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </RadixTabs.Content>

        <RadixTabs.Content value="highlights" className="pt-4 focus:outline-none">
          {store.highlights.length === 0 ? (
            <EmptyState
              icon={<Bookmark size={56} strokeWidth={1.2} />}
              message="Highlight the best — everything you highlight also saves here."
              action={
                <button
                  onClick={() => useStore.getState().openPaywall("profile")}
                  className="h-11 rounded-button bg-brand-blue px-6 text-[15px] font-semibold text-white active:bg-brand-blue-dk"
                >
                  Discover all summaries
                </button>
              }
            />
          ) : (
            <div className="space-y-3 pb-4">
              {store.highlights.map((h) => {
                const meta = bookMetaById(h.bookId);
                return (
                  <div key={`${h.bookId}-${h.pointIndex}`} className="rounded-card bg-white p-4 shadow-card">
                    <div className="flex items-center gap-3">
                      {meta && <BookCover book={meta} className="h-10 w-7 shrink-0" />}
                      <p className="text-[13px] font-semibold text-ink-600">{meta?.title}</p>
                    </div>
                    <p className="mt-3 border-l-[3px] border-accent-pink pl-3 text-[15px] leading-relaxed text-ink-900">
                      {h.snippet}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </RadixTabs.Content>
      </RadixTabs.Root>

      {/* context sheet */}
      <Sheet open={!!menuBook} onClose={() => setMenuBook(null)} maxHeight="45dvh">
        <div className="px-5 pb-10 pt-3">
          {[
            { label: "Share", icon: <Share2 size={20} />, action: () => {} },
            {
              label: "Mark as finished",
              icon: <CheckCircle2 size={20} />,
              action: () => menuBook && useStore.getState().markFinished(menuBook),
            },
            {
              label: "Remove from Library",
              icon: <Trash2 size={20} />,
              action: () => menuBook && useStore.getState().removeFromLibrary(menuBook),
              danger: true,
            },
          ].map((row) => (
            <button
              key={row.label}
              onClick={() => {
                row.action();
                setMenuBook(null);
              }}
              className={`flex h-14 w-full items-center gap-4 text-left text-[15px] font-medium ${row.danger ? "text-red-500" : "text-ink-900"}`}
            >
              {row.icon}
              {row.label}
            </button>
          ))}
        </div>
      </Sheet>
    </ScreenPadding>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-[17px] font-semibold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  bookId,
  progress,
  done,
  onOpen,
  onMenu,
}: {
  bookId: string;
  progress?: number;
  done?: boolean;
  onOpen: (id: string) => void;
  onMenu: () => void;
}) {
  const meta = BOOK_METAS.find((b) => b.id === bookId);
  if (!meta) return null;
  return (
    <div className="mb-3 flex items-center gap-3 rounded-card bg-white p-3 shadow-card">
      <button onClick={() => onOpen(bookId)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <BookCover book={meta} className="h-16 w-11 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-ink-900">{meta.title}</span>
          <span className="block truncate text-[12px] text-ink-600">{meta.author}</span>
          {progress !== undefined && !done && (
            <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-divider">
              <span className="block h-full rounded-full bg-brand-blue" style={{ width: `${Math.max(4, progress)}%` }} />
            </span>
          )}
          {done && <span className="mt-0.5 block text-[11px] font-semibold text-accent-green">Finished</span>}
        </span>
      </button>
      <button aria-label="More options" onClick={onMenu} className="flex h-11 w-11 items-center justify-center">
        <MoreHorizontal size={20} className="text-ink-600" />
      </button>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return <p className="rounded-card bg-white p-5 text-center text-[13px] text-ink-600 shadow-card">{message}</p>;
}

