"use client";

import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { Switch as SwitchRoot, SwitchThumb } from "@radix-ui/react-switch";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export function CategoryChip({
  label,
  color,
  selected,
  onClick,
}: {
  label: string;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors ${
        selected ? "text-white" : "bg-bg-white text-ink-900 border border-divider"
      }`}
      style={selected ? { backgroundColor: color ?? "#2F5FF6" } : undefined}
    >
      {label}
    </button>
  );
}

export function RatingStars({
  value,
  onChange,
  size = 36,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex justify-center gap-2" role="radiogroup" aria-label="Rate this summary">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          whileTap={{ scale: 0.8 }}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-0.5"
        >
          <Star
            size={size}
            className={
              n <= value ? "fill-accent-orange text-accent-orange" : "fill-transparent text-divider"
            }
          />
        </motion.button>
      ))}
    </div>
  );
}

export function ToggleSwitchRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-4 border-b border-divider px-4 py-4 last:border-b-0 cursor-pointer">
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink-900">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-ink-600">{description}</span>}
      </span>
      <SwitchRoot
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="relative mt-0.5 h-[26px] w-[46px] shrink-0 rounded-full bg-divider transition-colors data-[state=checked]:bg-brand-blue"
      >
        <SwitchThumb className="block h-[22px] w-[22px] translate-x-0.5 rounded-full bg-bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
      </SwitchRoot>
    </label>
  );
}

export function EmptyState({
  icon,
  message,
  action,
}: {
  icon?: ReactNode;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 text-ink-600/50">{icon ?? <SearchX size={56} strokeWidth={1.2} />}</div>
      <p className="text-[15px] leading-relaxed text-ink-600">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AchievementBadge({
  name,
  unlocked,
  icon,
}: {
  name: string;
  unlocked: boolean;
  icon: ReactNode;
}) {
  const inner = (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-full border-4 ${
        unlocked ? "border-accent-green bg-surface-peach" : "border-divider bg-bg-cream grayscale"
      }`}
    >
      {unlocked ? icon : <span className="text-xl font-bold text-ink-600/40">?</span>}
    </div>
  );
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
      {inner}
      <span className={`text-[11px] leading-tight ${unlocked ? "font-semibold text-ink-900" : "text-ink-600/60"}`}>
        {name}
      </span>
    </div>
  );
}


