export function LogoMark({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Gist logo" className={className}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFFFFF" opacity="0.14" />
      <path d="M18 20 h28 M18 32 h22 M18 44 h16" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
