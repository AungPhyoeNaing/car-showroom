import React from "react";

const DEFAULT_MARQUES = [
  "FERRARI",
  "PORSCHE",
  "ASTON MARTIN",
  "BUGATTI",
  "MCLAREN",
  "PAGANI",
  "ROLLS-ROYCE",
  "KOENIGSEGG",
  "LAMBORGHINI",
  "BENTLEY",
];

interface MarqueeStripProps {
  items?: string[];
  className?: string;
  speed?: "normal" | "slow";
}

export function MarqueeStrip({
  items = DEFAULT_MARQUES,
  className = "",
}: MarqueeStripProps) {
  // Duplicate for seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[rgba(237,232,223,0.08)] bg-[#09090a] py-4 select-none ${className}`}
    >
      {/* Subtle fade masks on edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#09090a] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#09090a] to-transparent z-10" />

      <div className="flex w-max animate-marquee space-x-12 sm:space-x-16 items-center">
        {duplicatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-12 sm:gap-16 text-xs sm:text-sm font-serif tracking-[0.3em] uppercase text-[#a39e93]/70 hover:text-[#c5a880] transition-colors"
          >
            <span>{item}</span>
            <span className="text-[#c5a880]/40 font-mono text-[10px]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
