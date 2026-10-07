import React from "react";

interface SectionHeadingProps {
  numeral?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  numeral,
  tag,
  title,
  subtitle,
  action,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`relative pb-8 ${isCentered ? "text-center mx-auto max-w-3xl" : ""} ${className}`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${
          isCentered ? "sm:justify-center" : ""
        }`}
      >
        <div className="space-y-3">
          <div
            className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] font-mono text-[#c5a880] ${
              isCentered ? "justify-center" : ""
            }`}
          >
            {numeral && (
              <span className="text-[#a39e93]/70 font-semibold">{numeral}</span>
            )}
            {numeral && tag && <span className="text-white/20">/</span>}
            {tag && <span>{tag}</span>}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#ede8df] leading-[1.08]">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm sm:text-base text-[#a39e93] font-light max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className={`mt-2 sm:mt-0 ${isCentered ? "mx-auto" : ""}`}>
            {action}
          </div>
        )}
      </div>

      <div className="mt-8 h-px w-full bg-[rgba(237,232,223,0.08)]" />
    </div>
  );
}
