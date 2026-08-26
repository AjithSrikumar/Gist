"use client";

import { BookDetailSheet } from "./BookDetailSheet";
import { SearchModal } from "./SearchModal";
import { ReaderModal } from "./Reader";
import { PaywallModal, StreakCelebration } from "./Paywall";

/** Root-level host: mounts every global overlay. */
export function OverlayHost() {
  return (
    <>
      <BookDetailSheet />
      <SearchModal />
      <ReaderModal />
      <PaywallModal />
      <StreakCelebration />
    </>
  );
}
