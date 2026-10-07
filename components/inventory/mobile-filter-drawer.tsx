"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./filter-sidebar";

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const selectedMakes = searchParams.get("makes")?.split(",").filter(Boolean) || [];
  const maxPrice = searchParams.get("maxPrice");
  const minYear = searchParams.get("minYear");
  const fuelType = searchParams.get("fuelType");

  const activeCount =
    selectedMakes.length +
    (maxPrice ? 1 : 0) +
    (minYear ? 1 : 0) +
    (fuelType && fuelType !== "all" ? 1 : 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-[#121214] hover:bg-[#18181b] text-[#c5a880] border border-[rgba(237,232,223,0.12)] text-[10px] font-mono font-bold uppercase tracking-[0.18em] transition-colors"
        aria-label="Open filter parameters"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Criteria</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 bg-[#c5a880] text-[#09090a] text-[9px] flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <FilterSidebar onCloseMobile={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
