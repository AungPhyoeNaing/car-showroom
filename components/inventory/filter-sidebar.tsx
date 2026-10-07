"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState } from "react";
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Calendar, 
  Fuel, 
  Car,
  X
} from "lucide-react";

export interface FilterSidebarProps {
  availableMakes?: string[];
  minPriceLimit?: number;
  maxPriceLimit?: number;
  minYearLimit?: number;
  maxYearLimit?: number;
  className?: string;
  onCloseMobile?: () => void;
}

const DEFAULT_MAKES = [
  "Ferrari",
  "Porsche",
  "Rolls-Royce",
  "Aston Martin",
  "Lamborghini",
  "Bentley",
  "McLaren",
  "Mercedes-Maybach",
];

const FUEL_TYPES: { label: string; value: string }[] = [
  { label: "All Powertrains", value: "all" },
  { label: "Gasoline / Petrol", value: "gasoline" },
  { label: "Plug-in Hybrid (PHEV)", value: "plug_in_hybrid" },
  { label: "Pure Electric (EV)", value: "electric" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Diesel", value: "diesel" },
];

export function FilterSidebar({
  availableMakes = DEFAULT_MAKES,
  minPriceLimit = 150000,
  maxPriceLimit = 1000000,
  minYearLimit = 2020,
  maxYearLimit = 2026,
  className = "",
  onCloseMobile,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Collapsible section toggles
  const [makesExpanded, setMakesExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [yearExpanded, setYearExpanded] = useState(true);
  const [fuelExpanded, setFuelExpanded] = useState(true);

  // Read current filter state from URL search params
  const selectedMakes = searchParams.get("makes") 
    ? searchParams.get("makes")!.split(",").filter(Boolean) 
    : [];

  const currentMaxPrice = searchParams.get("maxPrice") 
    ? Number(searchParams.get("maxPrice")) 
    : maxPriceLimit;

  const currentMinYear = searchParams.get("minYear") 
    ? Number(searchParams.get("minYear")) 
    : minYearLimit;

  const currentFuelType = searchParams.get("fuelType") || "all";

  // Active filters count
  const activeFiltersCount = 
    selectedMakes.length + 
    (currentMaxPrice < maxPriceLimit ? 1 : 0) + 
    (currentMinYear > minYearLimit ? 1 : 0) + 
    (currentFuelType !== "all" ? 1 : 0);

  // Update URL helper
  const updateUrlParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Reset pagination if present
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  // Multi-select toggle for Makes
  const handleToggleMake = (make: string) => {
    let updated: string[];
    if (selectedMakes.includes(make)) {
      updated = selectedMakes.filter((m) => m !== make);
    } else {
      updated = [...selectedMakes, make];
    }
    updateUrlParam("makes", updated.length > 0 ? updated.join(",") : null);
  };

  // Price slider change
  const handlePriceChange = (value: number) => {
    updateUrlParam("maxPrice", value >= maxPriceLimit ? null : value.toString());
  };

  // Year slider change
  const handleYearChange = (value: number) => {
    updateUrlParam("minYear", value <= minYearLimit ? null : value.toString());
  };

  // Fuel type radio change
  const handleFuelChange = (fuel: string) => {
    updateUrlParam("fuelType", fuel === "all" ? null : fuel);
  };

  // Reset all filters
  const handleResetFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <aside 
      className={`w-full bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 flex flex-col gap-6 shadow-xl ${className}`}
      aria-label="Vehicle Inventory Filters"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(237,232,223,0.08)]">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a880]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ede8df]">
            Curatorial Criteria
          </h2>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#c5a880] text-[#09090a]">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-mono uppercase tracking-wider text-[#a39e93] hover:text-[#c5a880] flex items-center gap-1 transition-colors"
              title="Reset all filter parameters"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#a39e93] hover:text-white"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Multi-Select Checkboxes: Marques (Make) */}
      <div className="space-y-3">
        <button
          onClick={() => setMakesExpanded(!makesExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#ede8df] hover:text-[#c5a880] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Marques &amp; Ateliers</span>
          </span>
          {makesExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#a39e93]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#a39e93]" />}
        </button>

        {makesExpanded && (
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 pt-1">
            {availableMakes.map((make) => {
              const isChecked = selectedMakes.includes(make);
              return (
                <label
                  key={make}
                  className="flex items-center justify-between px-3 py-2 bg-[#09090a] hover:bg-[#18181b] border border-[rgba(237,232,223,0.06)] hover:border-[#c5a880]/30 cursor-pointer transition-colors group select-none"
                >
                  <span className={`text-[11px] font-mono tracking-wider ${isChecked ? "text-[#c5a880] font-semibold" : "text-[#a39e93] group-hover:text-[#ede8df]"}`}>
                    {make}
                  </span>
                  
                  <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-all ${
                    isChecked 
                      ? "bg-[#c5a880] border-[#c5a880] text-[#09090a]" 
                      : "border-white/20 bg-[#121214] group-hover:border-white/40"
                  }`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleMake(make)}
                      className="sr-only"
                    />
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-[rgba(237,232,223,0.08)]" />

      {/* 2. Range Slider: Maximum Price */}
      <div className="space-y-3">
        <button
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#ede8df] hover:text-[#c5a880] transition-colors"
        >
          <span className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Valuation Ceiling</span>
          </span>
          {priceExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#a39e93]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#a39e93]" />}
        </button>

        {priceExpanded && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#a39e93] text-[10px] uppercase">Cap:</span>
              <span className="font-bold text-[#c5a880]">
                ${currentMaxPrice.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={minPriceLimit}
              max={maxPriceLimit}
              step={25000}
              value={currentMaxPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full h-1 bg-[#18181b] appearance-none cursor-pointer accent-[#c5a880]"
              aria-label="Filter by maximum price"
            />

            <div className="flex justify-between text-[10px] text-[#a39e93] font-mono">
              <span>${(minPriceLimit / 1000).toFixed(0)}k</span>
              <span>${(maxPriceLimit / 1000).toFixed(0)}k+</span>
            </div>
          </div>
        )}
      </div>

      <hr className="border-[rgba(237,232,223,0.08)]" />

      {/* 3. Range Slider: Minimum Model Year */}
      <div className="space-y-3">
        <button
          onClick={() => setYearExpanded(!yearExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#ede8df] hover:text-[#c5a880] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Vintage &amp; Year</span>
          </span>
          {yearExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#a39e93]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#a39e93]" />}
        </button>

        {yearExpanded && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#a39e93] text-[10px] uppercase">From Year:</span>
              <span className="font-bold text-[#ede8df]">
                {currentMinYear} or Newer
              </span>
            </div>

            <input
              type="range"
              min={minYearLimit}
              max={maxYearLimit}
              step={1}
              value={currentMinYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="w-full h-1 bg-[#18181b] appearance-none cursor-pointer accent-[#c5a880]"
              aria-label="Filter by minimum year"
            />

            <div className="flex justify-between text-[10px] text-[#a39e93] font-mono">
              <span>{minYearLimit}</span>
              <span>{maxYearLimit}</span>
            </div>
          </div>
        )}
      </div>

      <hr className="border-[rgba(237,232,223,0.08)]" />

      {/* 4. Radio Buttons: Powertrain / Fuel Type */}
      <div className="space-y-3">
        <button
          onClick={() => setFuelExpanded(!fuelExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#ede8df] hover:text-[#c5a880] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Fuel className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Powertrain Type</span>
          </span>
          {fuelExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#a39e93]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#a39e93]" />}
        </button>

        {fuelExpanded && (
          <div className="space-y-1.5 pt-1">
            {FUEL_TYPES.map((fuel) => {
              const isSelected = currentFuelType === fuel.value;
              return (
                <label
                  key={fuel.value}
                  className="flex items-center justify-between px-3 py-2 bg-[#09090a] hover:bg-[#18181b] border border-[rgba(237,232,223,0.06)] hover:border-[#c5a880]/30 cursor-pointer transition-colors group select-none"
                >
                  <span className={`text-[11px] font-mono tracking-wider ${isSelected ? "text-[#c5a880] font-semibold" : "text-[#a39e93] group-hover:text-[#ede8df]"}`}>
                    {fuel.label}
                  </span>

                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#c5a880] bg-[#c5a880]/20"
                      : "border-white/20 bg-[#121214] group-hover:border-white/40"
                  }`}>
                    <input
                      type="radio"
                      name="fuelType"
                      value={fuel.value}
                      checked={isSelected}
                      onChange={() => handleFuelChange(fuel.value)}
                      className="sr-only"
                    />
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Shareable Link Indicator */}
      <div className="mt-auto pt-4 border-t border-[rgba(237,232,223,0.08)] text-[10px] font-mono text-[#a39e93] flex items-center justify-between">
        <span className="uppercase tracking-wider">URL TELEMETRY SYNC</span>
        <span className="text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ACTIVE
        </span>
      </div>
    </aside>
  );
}
