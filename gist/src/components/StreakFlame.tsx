"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakFlame({ count, size = "md" }: { count: number; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-7 px-2 text-xs gap-0.5" : "h-9 px-2.5 text-sm gap-1";
  const icon = size === "sm" ? 14 : 16;
  return (
    <motion.div
      key={count}
      initial={{ scale: 0.7 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className={`flex items-center rounded-full bg-accent-orange/20 font-bold text-accent-orange ${dim}`}
    >
      <span>{count}</span>
      <Flame size={icon} fill="currentColor" strokeWidth={0} />
    </motion.div>
  );
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function StreakWeek({ week, count }: { week: boolean[]; count: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-accent-orange">
        <Flame size={28} fill="currentColor" strokeWidth={0} />
        <span className="text-4xl font-bold text-ink-900">{count}</span>
      </div>
      <div className="text-caption text-ink-600">day streak</div>
      <div className="mt-1 flex gap-2.5">
        {DAYS.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                week[i] ? "bg-surface-peach text-accent-orange" : "border border-divider bg-white"
              }`}
            >
              {week[i] ? (
                <Flame size={18} fill="currentColor" strokeWidth={0} />
              ) : (
                <div className="h-2 w-2 rounded-full bg-divider" />
              )}
            </div>
            <span className={`text-[11px] ${week[i] ? "font-semibold text-accent-orange" : "text-ink-600"}`}>
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
