"use client";

import { BookDetailSheet } from "./BookDetailSheet";
import { SearchModal } from "./SearchModal";
import { ReaderModal } from "./Reader";
import { AudioPlayerModal, MiniPlayer, PlaybackTicker } from "./AudioPlayer";
import { PaywallModal, StreakCelebration } from "./Paywall";

/** Root-level host: mounts every global overlay + the playback engine. */
export function OverlayHost() {
  return (
    <>
      <PlaybackTicker />
      <BookDetailSheet />
      <SearchModal />
      <ReaderModal />
      <AudioPlayerModal />
      <MiniPlayer />
      <PaywallModal />
      <StreakCelebration />
    </>
  );
}
