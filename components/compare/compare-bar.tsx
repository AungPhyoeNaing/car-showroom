"use client";

import Image from "next/image";
import { Scale, X, ArrowRight, AlertCircle } from "lucide-react";
import { useCompare } from "@/lib/compare/compare-context";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, openCompare, alertMessage } =
    useCompare();

  if (compareList.length === 0 && !alertMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="pointer-events-auto bg-[#09090a]/95 border border-[#c5a880]/50 p-3 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Car Badges */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-7 h-7 border border-[#c5a880]/40 bg-[#121214] flex items-center justify-center text-[#c5a880] shrink-0">
            <Scale className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {compareList.map((car) => {
              const img =
                car.imageUrls[car.primaryImageIndex || 0] ||
                car.imageUrls[0] ||
                "/placeholder-car.jpg";
              return (
                <div
                  key={car.id}
                  className="group relative flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-[#121214] border border-[rgba(237,232,223,0.08)] text-xs text-[#ede8df] shrink-0 font-mono"
                >
                  <div className="relative w-6 h-4 bg-black shrink-0 border border-white/10">
                    <Image src={img} alt={car.model} fill className="object-cover" />
                  </div>
                  <span className="font-medium text-[10px] truncate max-w-[90px] uppercase">
                    {car.model}
                  </span>
                  <button
                    onClick={() => removeFromCompare(car.id)}
                    className="text-[#a39e93] hover:text-rose-400 p-0.5"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}

            {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
              <div
                key={idx}
                className="hidden sm:flex items-center justify-center w-20 h-7 border border-dashed border-[rgba(237,232,223,0.15)] text-[9px] font-mono text-[#a39e93] uppercase"
              >
                Slot Available
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-mono">
          <button
            onClick={clearCompare}
            className="text-[#a39e93] hover:text-[#ede8df] text-[10px] uppercase tracking-wider px-2 py-1 transition-colors"
          >
            Clear
          </button>

          <button
            onClick={openCompare}
            className="px-4 py-2 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Compare ({compareList.length}/3)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {alertMessage && (
        <div className="mt-2 p-2 bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs text-center font-mono shadow-lg flex items-center justify-center gap-1.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{alertMessage}</span>
        </div>
      )}
    </div>
  );
}
