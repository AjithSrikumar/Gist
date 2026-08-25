"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Timer, X } from "lucide-react";
import { useStore, type PaywallVariant } from "@/lib/store";

/* Original sprout illustration — grows with commitment length */
export function GrowthTree({ stage }: { stage: 1 | 2 | 3 }) {
  return (
    <div className="relative flex h-40 w-full items-end justify-center">
      <svg viewBox="0 0 200 150" className="h-full">
        {/* ground */}
        <ellipse cx="100" cy="138" rx="70" ry="8" fill="#ECE7DD" />
        <path d="M96 138 L104 138 L102 110 L98 110 Z" fill="#8B5A2B" />
        {stage >= 1 && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
            <path d="M100 112 C90 100 84 92 86 80 C94 82 99 88 100 96 Z" fill="#35C48B" />
          </motion.g>
        )}
        {stage >= 2 && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.12, type: "spring", stiffness: 200, damping: 14 }}>
            <path d="M100 108 C110 96 116 88 114 76 C106 78 101 84 100 92 Z" fill="#2DB6A3" />
            <circle cx="100" cy="74" r="16" fill="#35C48B" />
            <circle cx="86" cy="84" r="11" fill="#4AD79E" />
            <circle cx="114" cy="84" r="11" fill="#4AD79E" />
          </motion.g>
        )}
        {stage >= 3 && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.24, type: "spring", stiffness: 200, damping: 14 }}>
            <circle cx="100" cy="58" r="22" fill="#2F5FF6" opacity="0.9" />
            <circle cx="78" cy="72" r="14" fill="#5B85FF" />
            <circle cx="122" cy="72" r="14" fill="#5B85FF" />
            <circle cx="100" cy="58" r="9" fill="#FF4FA0" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}

const FEATURES = [
  { title: "Read with no limits", body: "Every summary, every key point — unlocked." },
  { title: "Listen on the go", body: "Turn commutes into learning time." },
  { title: "Grow your intelligence", body: "Daily microlearning built around your goals." },
  { title: "Improve relationships", body: "Ideas you can actually use with people." },
];

const COPY: Record<PaywallVariant, { headline: string; sub?: string }> = {
  onboarding: {
    headline: "Start your free trial to keep growing",
    sub: "You're one tap away from unlimited key ideas.",
  },
  streak: {
    headline: "Only 2 key points left to extend your streak!",
    sub: "Go unlimited to finish what you started.",
  },
  profile: {
    headline: "Unlock Full Access",
    sub: "Read and listen without limits, forever curious.",
  },
  discount: {
    headline: "Last minute discount — 67% off",
    sub: "This offer disappears when the timer hits zero.",
  },
};

export function PaywallContent({
  variant,
  onStarted,
}: {
  variant: PaywallVariant;
  onStarted?: () => void;
}) {
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");
  const [featurePage, setFeaturePage] = useState(0);
  const store = useStore();
  const copy = COPY[variant];

  const startTrial = () => {
    store.startTrial();
    onStarted?.();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {(variant === "discount" || variant === "streak") && (
        <div
          className={`flex items-center justify-center gap-2 py-2 text-[13px] font-bold text-white ${
            variant === "discount" ? "bg-accent-pink" : "bg-accent-orange"
          }`}
        >
          {variant === "discount" ? (
            <>
              <Timer size={15} /> Last minute discount — 67% off ends soon
            </>
          ) : (
            <>
              <Flame size={15} fill="currentColor" strokeWidth={0} /> Your streak is waiting!
            </>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="mx-auto max-w-[300px]">
          <GrowthTree stage={plan === "yearly" ? 3 : 1} />
        </div>

        <h1 className="mt-3 text-center text-[26px] leading-tight font-bold text-ink-900">{copy.headline}</h1>
        {copy.sub && <p className="mt-2 text-center text-[14px] text-ink-600">{copy.sub}</p>}

        {/* swipeable feature pagination */}
        <div
          className="no-scrollbar snap-x-mandatory mt-5 flex overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setFeaturePage(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="w-full shrink-0 snap-start-always px-8 text-center">
              <div className="rounded-card bg-bg-cream p-4">
                <p className="text-[15px] font-semibold text-ink-900">{f.title}</p>
                <p className="mt-1 text-[13px] text-ink-600">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          {FEATURES.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === featurePage ? "w-4 bg-brand-blue" : "w-1.5 bg-divider"}`} />
          ))}
        </div>

        {/* plans */}
        <div className="mt-5 space-y-2.5">
          <PlanRow
            selected={plan === "yearly"}
            onSelect={() => setPlan("yearly")}
            badge="BEST VALUE"
            title="Yearly"
            price="$39.99 / year"
            note="7 days free"
          />
          <PlanRow
            selected={plan === "monthly"}
            onSelect={() => setPlan("monthly")}
            title="Monthly"
            price="$7.99 / month"
            note="7 days free"
          />
        </div>

        <p className="mt-3 text-center text-[12px] text-ink-600">
          {plan === "yearly"
            ? "7 days free, then $39.99/year — only $0.77/week"
            : "7 days free, then $7.99/month — cancel anytime"}
        </p>
        {variant === "discount" && (
          <p className="mt-1 text-center text-[13px] font-bold text-accent-pink">
            <span className="text-ink-600 line-through">$119.99</span> $39.99 — save 67%
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={startTrial}
          className="mt-4 h-[54px] w-full rounded-button bg-brand-blue text-[17px] font-bold text-white shadow-lg active:bg-brand-blue-dk"
        >
          Start Free Trial
        </motion.button>
        <button className="mx-auto mt-3 block h-11 text-[14px] font-semibold text-brand-blue">View other plans</button>
      </div>

      <div className="safe-bottom border-t border-divider px-6 py-3">
        <div className="flex justify-center gap-6 text-[11px] text-ink-600">
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
          <span>Restore purchase</span>
        </div>
      </div>
    </div>
  );
}

function PlanRow({
  selected,
  onSelect,
  title,
  price,
  note,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  price: string;
  note: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-card border-2 px-4 py-3 text-left transition-colors ${
        selected ? "border-brand-blue bg-brand-blue/5" : "border-divider"
      }`}
    >
      <span className={`h-5 w-5 shrink-0 rounded-full border-2 ${selected ? "border-brand-blue bg-brand-blue ring-2 ring-inset ring-white" : "border-divider"}`} />
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-ink-900">
          {title}{" "}
          {badge && <span className="ml-1 rounded-full bg-accent-green px-1.5 py-0.5 align-middle text-[9px] font-bold text-white">{badge}</span>}
        </span>
        <span className="text-[12px] text-ink-600">{note}</span>
      </span>
      <span className="text-[15px] font-bold text-ink-900">{price}</span>
    </button>
  );
}

/** Full-screen paywall modal for mid-app trigger points */
export function PaywallModal() {
  const variant = useStore((s) => s.paywall);
  const close = () => useStore.getState().openPaywall(null);
  return (
    <AnimatePresenceContent open={!!variant}>
      {variant && (
        <div className="relative mx-auto h-full max-w-[480px]">
          <button
            aria-label="Close paywall"
            onClick={close}
            className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-ink-900"
          >
            <X size={18} />
          </button>
          <PaywallContent variant={variant} onStarted={close} />
        </div>
      )}
    </AnimatePresenceContent>
  );
}

function AnimatePresenceContent({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      className={`fixed inset-0 z-[80] bg-black/50 ${open ? "" : "pointer-events-none"}`}
      animate={{ opacity: open ? 1 : 0 }}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 mx-auto h-full max-w-[480px] overflow-hidden bg-white"
        initial={{ y: "100%" }}
        animate={{ y: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Big animated streak celebration */
export function StreakCelebration() {
  const days = useStore((s) => s.celebrationStreak);
  const clear = () => useStore.getState().showCelebration(null);
  return (
    <AnimatePresenceContent open={days !== null}>
      {days !== null && (
        <div className="relative flex h-full flex-col items-center justify-center bg-surface-peach">
          {[...Array(18)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-2.5 w-2.5 rounded-sm"
              style={{
                backgroundColor: ["#FF4FA0", "#2F5FF6", "#35C48B", "#FF8A3D", "#8B5CF6"][i % 5],
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
              }}
              initial={{ y: -20 - i * 10, opacity: 0, rotate: i * 40 }}
              animate={{ y: 0, opacity: [0, 1, 0], rotate: i * 120 }}
              transition={{ duration: 1.6, delay: i * 0.05 }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 12 }}
          >
            <Flame size={110} className="text-accent-orange" fill="currentColor" strokeWidth={0} />
          </motion.div>
          <motion.h1
            key={days}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
            className="mt-4 text-[34px] font-bold text-ink-900"
          >
            {days} day streak!
          </motion.h1>
          <p className="mt-1 text-[14px] text-ink-600">Keep it up tomorrow</p>
          <button
            onClick={clear}
            className="mt-8 h-12 w-56 rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
          >
            Continue
          </button>
        </div>
      )}
    </AnimatePresenceContent>
  );
}
