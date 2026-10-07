import React from "react";

interface EditorialBadgeProps {
  children: React.ReactNode;
  variant?: "brass" | "bone" | "muted" | "status-available" | "status-reserved" | "status-sold";
  size?: "sm" | "md";
  className?: string;
}

export function EditorialBadge({
  children,
  variant = "muted",
  size = "sm",
  className = "",
}: EditorialBadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "text-[10px] tracking-[0.2em] px-2.5 py-1"
      : "text-xs tracking-[0.22em] px-3.5 py-1.5";

  const variantClasses = {
    brass:
      "border border-[#c5a880]/40 text-[#c5a880] bg-[#c5a880]/5 uppercase font-mono",
    bone: "border border-[#ede8df]/25 text-[#ede8df] bg-[#ede8df]/5 uppercase font-mono",
    muted:
      "border border-white/10 text-[#a39e93] bg-white/[0.02] uppercase font-mono",
    "status-available":
      "border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 uppercase font-mono",
    "status-reserved":
      "border border-[#c5a880]/50 text-[#c5a880] bg-[#c5a880]/10 uppercase font-mono",
    "status-sold":
      "border border-rose-500/30 text-rose-400 bg-rose-500/5 uppercase font-mono",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium uppercase transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
