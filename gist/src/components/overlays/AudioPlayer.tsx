"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  ChevronDown,
  BookOpenText,
  Heart,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { FullModal, Sheet } from "@/components/ui/Sheet";
import { BookCover } from "@/components/BookCard";
import { loadBook, bookMetaById, unitCount, unitTitle, unitBody, unitSecondsMap } from "@/data/books";
import { useStore } from "@/lib/store";
import type { Book } from "@/lib/types";
import { Slider, SliderTrack, SliderRange, SliderThumb } from "@radix-ui/react-slider";

export const pointSeconds = (book: Book) => {
  const map = unitSecondsMap(book);
  return map[0] ?? 60;
};
export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Global ticker: advances simulated audio while playing. Lives above tab bar. */
export function PlaybackTicker() {
  useEffect(() => {
    const t = setInterval(() => useStore.getState().tickPlayback(1), 1000);
    return () => clearInterval(t);
  }, []);
  return null;
}

function usePlaybackBook(): { book: Book; pb: NonNullable<ReturnType<typeof useStore.getState>["playback"]> } | null {
  const pb = useStore((s) => s.playback);
  const bookId = pb?.bookId ?? null;
  const [state, setState] = useState<{ loadedFor: string | null; book: Book | null }>({
    loadedFor: null,
    book: null,
  });
  if (state.loadedFor !== bookId) {
    setState({ loadedFor: bookId, book: null });
  }
  useEffect(() => {
    if (bookId) loadBook(bookId).then((b) => setState({ loadedFor: bookId, book: b }));
  }, [bookId]);
  if (!pb || !state.book) return null;
  return { book: state.book, pb };
}

export function MiniPlayer() {
  const data = usePlaybackBook();
  const playerOpen = useStore((s) => s.playerOpen);
  const readerBookId = useStore((s) => s.readerBookId);
  // hidden while its own reader is open (reader has inline play controls)
  const suppressed = data && readerBookId === data.book.id;
  if (!data || playerOpen || suppressed) return null;
  const { book, pb } = data;
  const total = unitSecondsMap(book)[pb.pointIndex] ?? pointSeconds(book);
  const pct = Math.min(100, (pb.positionSec / total) * 100);

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 bottom-[70px] z-40 flex justify-center px-3"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => useStore.getState().setPlayerOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && useStore.getState().setPlayerOpen(true)}
        className="flex w-full max-w-[456px] items-center gap-3 rounded-2xl bg-ink-900 p-2 pr-3 text-white shadow-sheet"
      >
        <BookCover book={book} className="h-10 w-10 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{book.title}</p>
          <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-accent-green" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button
          aria-label={pb.playing ? "Pause" : "Play"}
          onClick={(e) => {
            e.stopPropagation();
            useStore.getState().togglePlay();
          }}
          className="flex h-10 w-10 items-center justify-center"
        >
          {pb.playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
        </button>
      </div>
    </motion.div>
  );
}

export function AudioPlayerModal() {
  const open = useStore((s) => s.playerOpen);
  const data = usePlaybackBook();
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <FullModal open={open} onClose={() => useStore.getState().setPlayerOpen(false)}>
      {!data ? (
        <CenteredClose />
      ) : (
        <PlayerBody book={data.book} onTranscript={() => setShowTranscript(true)} />
      )}
      {data && (
        <TranscriptSheet
          open={showTranscript}
          onClose={() => setShowTranscript(false)}
          book={data.book}
          pointIndex={data.pb.pointIndex}
        />
      )}
    </FullModal>
  );
}

function CenteredClose() {
  return (
    <div className="flex h-full items-center justify-center">
      <button aria-label="Close player" onClick={() => useStore.getState().setPlayerOpen(false)}>
        <X size={24} />
      </button>
    </div>
  );
}

function PlayerBody({ book, onTranscript }: { book: Book; onTranscript: () => void }) {
  const store = useStore();
  const pb = store.playback!;
  const secMap = unitSecondsMap(book);
  const total = secMap[pb.pointIndex] ?? pointSeconds(book);
  const pos = Math.min(pb.positionSec, total);
  const m = unitCount(book);

  const nextPoint = () => {
    if (pb.pointIndex >= m - 1) {
      finishFromPlayer(book.id);
    } else store.gotoPoint(pb.pointIndex + 1);
  };
  const prevPoint = () => store.gotoPoint(Math.max(0, pb.pointIndex - 1));

  const saved = store.library.savedForLater.includes(book.id) || store.library.finished.includes(book.id);

  return (
    <div className="flex h-full flex-col bg-ink-900 text-white">
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          aria-label="Minimize player"
          onClick={() => store.setPlayerOpen(false)}
          className="flex h-11 w-11 items-center justify-center rounded-full"
        >
          <ChevronDown size={24} />
        </button>
        <span className="text-[12px] font-bold tracking-widest text-white/70">
          CHAPTER {pb.pointIndex + 1} OF {m}
        </span>
        <div className="w-11" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8">
        <motion.div key={pb.pointIndex} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <BookCover book={book} className="h-64 w-64 shadow-sheet" />
        </motion.div>
        <h1 className="mt-6 text-center text-xl font-bold">{unitTitle(book, pb.pointIndex)}</h1>
        <p className="mt-1 text-sm text-white/60">{book.title}</p>
      </div>

      <div className="px-6 pb-8">
        <Slider
          value={[pos]}
          max={total}
          step={1}
          onValueChange={([v]: number[]) => store.seekTo(v)}
          className="relative flex h-8 touch-none select-none items-center"
        >
          <SliderTrack className="relative h-[5px] w-full grow overflow-hidden rounded-full bg-white/20">
            <SliderRange className="absolute h-full bg-accent-green" />
          </SliderTrack>
          <SliderThumb className="block h-4 w-4 rounded-full bg-accent-green shadow" aria-label="Seek" />
        </Slider>
        <div className="-mt-1 flex justify-between text-[12px] tabular-nums text-white/60">
          <span>{fmt(pos)}</span>
          <span>-{fmt(total - pos)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          <button aria-label="Previous point" onClick={prevPoint} className="flex h-12 w-12 items-center justify-center">
            <SkipBack size={26} fill="currentColor" />
          </button>
          <button
            aria-label="Rewind 15 seconds"
            onClick={() => store.seekTo(pos - 15)}
            className="relative flex h-12 w-12 items-center justify-center"
          >
            <RotateCcw size={28} strokeWidth={1.6} />
            <span className="absolute text-[9px] font-bold">15</span>
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label={pb.playing ? "Pause" : "Play"}
            onClick={store.togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue shadow-lg active:bg-brand-blue-dk"
          >
            {pb.playing ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
          </motion.button>
          <button
            aria-label="Forward 15 seconds"
            onClick={() => store.seekTo(pos + 15)}
            className="relative flex h-12 w-12 items-center justify-center"
          >
            <RotateCw size={28} strokeWidth={1.6} />
            <span className="absolute text-[9px] font-bold">15</span>
          </button>
          <button aria-label="Next point" onClick={nextPoint} className="flex h-12 w-12 items-center justify-center">
            <SkipForward size={26} fill="currentColor" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={store.cycleSpeed}
            className="rounded-full border border-white/30 px-4 py-1.5 text-[14px] font-semibold transition-transform active:scale-95"
          >
            {pb.speed}x
          </button>
          <span className="text-caption text-white/50">Tap to jump into reading below ↓</span>
          <div className="flex gap-1">
            <button aria-label="Show transcript" onClick={onTranscript} className="flex h-11 w-11 items-center justify-center rounded-full">
              <BookOpenText size={20} />
            </button>
            <button
              aria-label="Save summary"
              onClick={() => (saved ? undefined : store.saveToLibrary(book.id))}
              className="flex h-11 w-11 items-center justify-center rounded-full"
            >
              <Heart size={20} className={saved ? "fill-accent-pink text-accent-pink" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function finishFromPlayer(bookId: string) {
  const store = useStore.getState();
  const meta = bookMetaById(bookId);
  const gained = store.finishSummary(bookId);
  store.stopPlayback();
  store.setPlayerOpen(false);
  if (gained && meta && !store.isSubscribed) {
    // streak-extension nudge variant handled by celebration first
  }
  if (gained) store.showCelebration(store.streakCount);
}

function TranscriptSheet({
  open,
  onClose,
  book,
  pointIndex,
}: {
  open: boolean;
  onClose: () => void;
  book: Book;
  pointIndex: number;
}) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="px-5 pb-8">
        <h2 className="text-[17px] font-semibold text-ink-900">Chapter {pointIndex + 1}</h2>
        <h3 className="mt-1 font-semibold text-brand-blue">{unitTitle(book, pointIndex)}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{unitBody(book, pointIndex)}</p>
        <button
          onClick={() => {
            onClose();
            useStore.getState().setPlayerOpen(false);
            useStore.getState().openReader(book.id);
          }}
          className="mt-6 h-12 w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
        >
          Open full reader
        </button>
      </div>
    </Sheet>
  );
}


