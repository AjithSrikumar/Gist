"use client";

import { BookDetailSheet } from "./BookDetailSheet";
import { SearchModal } from "./SearchModal";
import { ReaderModal } from "./Reader";
import { PaywallModal, StreakCelebration } from "./Paywall";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

/** Root-level host: mounts every global overlay. */
export function OverlayHost() {
  return (
    <>
      <BookDetailSheet />
      <SearchModal />
      <ErrorBoundary label="Reader">
        <ReaderModal />
      </ErrorBoundary>
      <PaywallModal />
      <StreakCelebration />
    </>
  );
}
