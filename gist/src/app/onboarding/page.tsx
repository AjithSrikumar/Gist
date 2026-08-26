"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Zap,
  Briefcase,
  TrendingUp,
  Brain,
  Flower2,
  Megaphone,
  Users,
  Check,
} from "lucide-react";
import { GOALS } from "@/data/catalog";
import { BOOK_METAS, booksForGoal } from "@/data/books";
import { BookCover } from "@/components/BookCard";
import { PaywallContent } from "@/components/overlays/Paywall";
import { LogoMark } from "@/components/LogoMark";
import { useStore } from "@/lib/store";

type Step =
  | "intro"
  | "gender" | "age" | "goals" | "celebrate"
  | "booksPerYear" | "notifications"
  | "reassure" | "picks" | "crafting" | "paywall";

const STEP_ORDER: Step[] = [
  "intro",
  "gender", "age", "goals", "celebrate",
  "booksPerYear", "notifications",
  "reassure", "picks", "crafting", "paywall",
];

const SLIDES = [
  { title: "Get the key ideas from bestselling books", body: "15-minute summaries you'll actually finish.", accent: "#2F5FF6" },
  { title: "Read on the go", body: "Bite-sized key points, perfect for a coffee break.", accent: "#35C48B" },
];

export default function OnboardingPage() {
  const [idx, setIdx] = useState(0);
  const step = STEP_ORDER[idx];
  const go = (d: number) => setIdx((i) => Math.min(STEP_ORDER.length - 1, Math.max(0, i + d)));
  const router = useRouter();
  const store = useStore();

  const [goals, setGoals] = useState<string[]>([]);
  const [pickIds, setPickIds] = useState<string[] | null>(null);

  const finishOnboarding = () => {
    store.completeOnboarding({ goals, email: null });
    router.replace("/for-you");
  };

  return (
    <div className="relative mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-ink-900">
      {idx > 0 && (
        <button
          aria-label="Back"
          onClick={() => go(-1)}
          className="absolute top-3 left-2 z-20 flex h-11 w-11 items-center justify-center text-white/80"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="min-h-0 flex-1 overflow-y-auto no-scrollbar"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.22 }}
        >
          {step === "intro" && (
            <IntroSlides onDone={() => go(1)} />
          )}

          {(step === "gender" || step === "age") && (
            <QuizPills
              title={step === "gender" ? "Choose your gender" : "How old are you?"}
              options={
                step === "gender"
                  ? ["Female", "Male", "Non-binary", "Prefer not to say"]
                  : ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"]
              }
              onSelect={() => setTimeout(() => go(1), 250)}
            />
          )}

          {step === "goals" && (
            <GoalPicker
              goals={goals}
              toggle={(g) =>
                setGoals((cur) =>
                  cur.includes(g) ? cur.filter((x) => x !== g) : cur.length >= 3 ? cur : [...cur, g]
                )
              }
              onNext={() => go(1)}
            />
          )}

          {step === "celebrate" && (
            <Centered dark>
              <Mascot />
              <h1 className="mt-6 text-[28px] font-bold text-white">Great job!</h1>
              <p className="mt-2 text-[14px] text-white/60">Your goals will shape everything you see.</p>
              <AutoAdvance seconds={1.8} onDone={() => go(1)} />
            </Centered>
          )}

          {step === "booksPerYear" && (
            <QuizPills
              title="How many books do you read per year?"
              options={["None yet", "1–2", "3–5", "6–12", "12+"]}
              onSelect={() => setTimeout(() => go(1), 250)}
            />
          )}

          {step === "notifications" && (
            <Centered dark>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue">
                <Zap size={44} className="text-white" fill="currentColor" strokeWidth={0} />
              </div>
              <h1 className="mt-6 px-8 text-center text-[26px] leading-tight font-bold text-white">
                Don&apos;t break the habit you&apos;re building
              </h1>
              <p className="mt-3 px-8 text-center text-[14px] leading-relaxed text-white/60">
                We&apos;ll send one gentle reminder a day — just enough to keep your streak alive.
              </p>
              <button
                onClick={async () => {
                  try {
                    if ("Notification" in window) await Notification.requestPermission();
                  } catch {}
                  go(1);
                }}
                className="mt-8 h-[52px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
              >
                Allow notifications
              </button>
              <button onClick={() => go(1)} className="mx-auto mt-4 block h-11 px-6 text-[14px] font-semibold text-white/50">
                Not now
              </button>
            </Centered>
          )}

          {step === "reassure" && (
            <Centered dark>
              <Mascot />
              <h1 className="mt-6 px-6 text-center text-[26px] leading-tight font-bold text-white">
                We know how hard growth can get
              </h1>
              <p className="mt-3 px-8 text-center text-[14px] leading-relaxed text-white/60">
                So we picked a few summaries matched to your goals. Small steps, every day.
              </p>
              <button
                onClick={() => {
                  if (!pickIds) setPickIds(picksFor(goals));
                  go(1);
                }}
                className="mt-8 h-[52px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
              >
                Show my picks
              </button>
            </Centered>
          )}

          {step === "picks" && (
            <PicksCarousel
              ids={pickIds ?? picksFor(goals)}
              onAdd={(id) => useStore.getState().saveToLibrary(id)}
              onNext={() => go(1)}
            />
          )}

          {step === "crafting" && <Crafting onDone={() => go(1)} />}

          {step === "paywall" && (
            <div className="flex min-h-full flex-col bg-white">
              <PaywallContent variant="onboarding" onStarted={finishOnboarding} />
              <button onClick={finishOnboarding} className="py-3 text-center text-[13px] font-semibold text-ink-600">
                Skip — explore free first
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function picksFor(goals: string[]): string[] {
  const ids = new Set<string>();
  goals.forEach((g) => booksForGoal(g).slice(0, 3).forEach((b) => ids.add(b.id)));
  return [...ids].slice(0, 5);
}

/* ---------- pieces ---------- */

function IntroSlides({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0);
  return (
    <div className="flex h-full flex-col bg-ink-900">
      <div className="pt-16 pb-4 text-center">
        <LogoMark size={44} className="" />
      </div>
      <div
        className="no-scrollbar snap-x-mandatory min-h-0 flex-1 overflow-y-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setSlide(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="flex h-full w-full shrink-0 snap-start-always flex-col items-center justify-center px-8 text-center">
              <Illustration kind={i} />
              <h1 className="mt-8 text-[30px] leading-tight font-bold text-white">{s.title}</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="safe-bottom px-6 pb-8">
        <Dots count={SLIDES.length} index={slide} />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="mt-5 h-[54px] w-full rounded-button bg-brand-blue text-[17px] font-bold text-white active:bg-brand-blue-dk"
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}

function Illustration({ kind }: { kind: number }) {
  const illustrations = [
    // Slide 0: Open book with light rays
    <svg key="book" viewBox="0 0 200 200" className="h-52 w-auto">
      <defs>
        <linearGradient id="pageGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8F0FE" />
          <stop offset="100%" stopColor="#C2D9FF" />
        </linearGradient>
        <linearGradient id="coverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F5FF6" />
          <stop offset="100%" stopColor="#1B3A6B" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="90" r="70" fill="#2F5FF6" opacity="0.08" />
      <circle cx="100" cy="90" r="50" fill="#2F5FF6" opacity="0.06" />
      <rect x="95" y="60" width="10" height="100" rx="2" fill="#1B3A6B" />
      <path d="M95 60 Q50 55 30 70 L30 155 Q50 145 95 150 Z" fill="url(#pageGrad)" />
      <line x1="45" y1="85" x2="85" y2="82" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="45" y1="98" x2="85" y2="95" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="45" y1="111" x2="85" y2="108" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="45" y1="124" x2="75" y2="121" stroke="#B0C4DE" strokeWidth="1.5" />
      <path d="M105 60 Q150 55 170 70 L170 155 Q150 145 105 150 Z" fill="url(#pageGrad)" />
      <line x1="115" y1="82" x2="155" y2="85" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="115" y1="95" x2="155" y2="98" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="115" y1="108" x2="155" y2="111" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="115" y1="121" x2="145" y2="124" stroke="#B0C4DE" strokeWidth="1.5" />
      <motion.g animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }}>
        <line x1="100" y1="30" x2="100" y2="10" stroke="#FFC94D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="40" x2="55" y2="25" stroke="#FFC94D" strokeWidth="2" strokeLinecap="round" />
        <line x1="130" y1="40" x2="145" y2="25" stroke="#FFC94D" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="60" x2="38" y2="50" stroke="#FFC94D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="145" y1="60" x2="162" y2="50" stroke="#FFC94D" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
      <motion.circle cx="60" cy="35" r="3" fill="#FFC94D" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
      <motion.circle cx="145" cy="30" r="2.5" fill="#FF4FA0" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.8 }} />
      <motion.circle cx="100" cy="15" r="2" fill="#35C48B" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.3 }} />
    </svg>,

    // Slide 1: Phone with book content
    <svg key="phone" viewBox="0 0 200 200" className="h-52 w-auto">
      <defs>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
      </defs>
      <rect x="55" y="25" width="90" height="150" rx="16" fill="url(#phoneGrad)" />
      <rect x="60" y="35" width="80" height="125" rx="4" fill="#F8F6F0" />
      <rect x="85" y="25" width="30" height="6" rx="3" fill="#111827" />
      <rect x="70" y="48" width="60" height="6" rx="2" fill="#2F5FF6" opacity="0.8" />
      <rect x="70" y="62" width="50" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="70" width="55" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="78" width="45" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="86" width="60" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="94" width="40" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="108" width="60" height="6" rx="2" fill="#35C48B" opacity="0.8" />
      <rect x="70" y="122" width="50" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="130" width="55" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="138" width="42" height="3" rx="1" fill="#D1D5DB" />
      <rect x="85" y="158" width="30" height="4" rx="2" fill="#D1D5DB" />
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <circle cx="35" cy="70" r="12" fill="#FF4FA0" opacity="0.2" />
        <text x="35" y="75" textAnchor="middle" fontSize="14">📖</text>
      </motion.g>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}>
        <circle cx="168" cy="100" r="10" fill="#2F5FF6" opacity="0.2" />
        <text x="168" y="105" textAnchor="middle" fontSize="12">☕</text>
      </motion.g>
    </svg>,
  ];

  return illustrations[kind] || illustrations[0];
}

export function Mascot() {
  // original round character: a cheerful speech-bubble blob
  return (
    <motion.svg
      viewBox="0 0 120 110"
      className="h-32 w-auto"
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
    >
      <ellipse cx="60" cy="52" rx="42" ry="38" fill="#FF4FA0" />
      <circle cx="47" cy="48" r="5" fill="#16181D" />
      <circle cx="73" cy="48" r="5" fill="#16181D" />
      <path d="M48 63 Q60 72 72 63" stroke="#16181D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M50 86 L46 104 L68 96 L74 82 Z" fill="#FF4FA0" />
      <circle cx="92" cy="24" r="7" fill="#FFC94D" />
    </motion.svg>
  );
}

function Centered({
  children,
  dark = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  void dark;
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">{children}</div>
  );
}

function Dots({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-brand-blue" : "w-1.5 bg-divider"}`} />
      ))}
    </div>
  );
}

function AutoAdvance({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, seconds * 1000);
    return () => clearTimeout(t);
  }, [seconds, onDone]);
  return null;
}

const GOAL_ICONS: Record<string, React.ReactNode> = {
  zap: <Zap size={20} />,
  briefcase: <Briefcase size={20} />,
  "trending-up": <TrendingUp size={20} />,
  brain: <Brain size={20} />,
  flower: <Flower2 size={20} />,
  megaphone: <Megaphone size={20} />,
  users: <Users size={20} />,
};

function GoalPicker({
  goals,
  toggle,
  onNext,
}: {
  goals: string[];
  toggle: (g: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <h1 className="text-[28px] leading-tight font-bold text-white">What do you want to achieve?</h1>
      <p className={`mt-2 text-[13px] ${goals.length >= 3 ? "font-semibold text-accent-pink" : "text-white/50"}`}>
        Pick up to 3 goals · {goals.length}/3 selected
      </p>
      <div className="mt-6 flex-1 space-y-3">
        {GOALS.map((g) => {
          const sel = goals.includes(g.id);
          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={g.id}
              onClick={() => toggle(g.id)}
              aria-pressed={sel}
              className={`flex w-full items-center gap-3 rounded-card border-2 p-4 text-left ${
                sel ? "border-accent-green bg-accent-green/10" : "border-transparent bg-white/5"
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${sel ? "bg-accent-green text-white" : "bg-white/10 text-white/70"}`}>
                {GOAL_ICONS[g.icon]}
              </span>
              <span className="flex-1 text-[15px] font-medium text-white">{g.label}</span>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${sel ? "border-accent-green bg-accent-green" : "border-white/30"}`}>
                {sel && <Check size={14} strokeWidth={3} className="text-white" />}
              </span>
            </motion.button>
          );
        })}
      </div>
      <button
        disabled={goals.length === 0}
        onClick={onNext}
        className={`mt-6 h-[52px] w-full rounded-button text-[16px] font-semibold ${
          goals.length ? "bg-brand-blue text-white active:bg-brand-blue-dk" : "bg-white/15 text-white/40"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function QuizPills({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: string[];
  onSelect: (o: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <h1 className="text-[28px] leading-tight font-bold text-white">{title}</h1>
      <div className="mt-6 flex-1 space-y-3">
        {options.map((o) => (
          <motion.button
            whileTap={{ scale: 0.98 }}
            key={o}
            onClick={() => {
              setPicked(o);
              onSelect(o);
            }}
            aria-pressed={picked === o}
            className={`block h-[56px] w-full rounded-button border-2 text-left px-4 text-[15px] font-medium ${
              picked === o ? "border-brand-blue bg-brand-blue/20 text-white" : "border-transparent bg-white/5 text-white/85"
            }`}
          >
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PicksCarousel({
  ids,
  onAdd,
  onNext,
}: {
  ids: string[];
  onAdd: (id: string) => void;
  onNext: () => void;
}) {
  const books = ids.map((id) => BOOK_METAS.find((b) => b.id === id)!).filter(Boolean);
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <h1 className="text-[28px] leading-tight font-bold text-white">Picked for you</h1>
      <p className="mt-2 text-[14px] text-white/60">Based on your goals — save any you like</p>
      <div className="no-scrollbar snap-x-mandatory mt-6 flex gap-4 overflow-x-auto pb-2">
        {books.map((b) => (
          <div key={b.id} className="w-[150px] shrink-0 snap-start-always">
            <BookCover book={b} className="aspect-[2/3] w-full" />
            <p className="mt-2 line-clamp-2 text-[14px] leading-tight font-semibold text-white">{b.title}</p>
            <p className="line-clamp-1 text-[12px] text-white/50">{b.author}</p>
            <button
              onClick={() => onAdd(b.id)}
              className="mt-2 h-9 w-full rounded-full border border-white/40 text-[13px] font-semibold text-white"
            >
              Add to Library
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="mt-auto h-[52px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
      >
        Continue
      </button>
    </div>
  );
}

const CRAFT_STEPS = [
  "Analyzing your goals…",
  "Matching summaries to your taste…",
  "Building your daily plan…",
];

function Crafting({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 4;
      });
    }, 90);
    return () => clearInterval(iv);
  }, [onDone]);
  const label = CRAFT_STEPS[Math.min(CRAFT_STEPS.length - 1, Math.floor(progress / 34))];
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-ink-900 px-8">
      <Mascot />
      <h1 className="mt-6 text-[26px] font-bold text-white">Crafting your experience</h1>
      <div className="mt-8 h-2 w-full max-w-[280px] overflow-hidden rounded-full bg-white/15">
        <motion.div className="h-full rounded-full bg-brand-blue" animate={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-[13px] text-white/60">{label}</p>
    </div>
  );
}


