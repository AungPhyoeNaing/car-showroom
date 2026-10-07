"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { X, RotateCcw } from "lucide-react";

const FUEL_LABELS: Record<string, string> = {
  gasoline: "Gasoline",
  plug_in_hybrid: "Plug-in Hybrid",
  electric: "100% Electric",
  hybrid: "Hybrid",
  diesel: "Diesel",
};

const SORT_LABELS: Record<string, string> = {
  price_asc: "Valuation: Ascending",
  price_desc: "Valuation: Descending",
  year_desc: "Newest Models",
  mileage_asc: "Lowest Mileage",
};

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const searchQuery = searchParams.get("search");
  const makes = searchParams.get("makes")?.split(",").filter(Boolean) || [];
  const maxPrice = searchParams.get("maxPrice");
  const minYear = searchParams.get("minYear");
  const fuelType = searchParams.get("fuelType");
  const sortBy = searchParams.get("sortBy");

  const totalActive =
    (searchQuery ? 1 : 0) +
    makes.length +
    (maxPrice ? 1 : 0) +
    (minYear ? 1 : 0) +
    (fuelType && fuelType !== "all" ? 1 : 0) +
    (sortBy && sortBy !== "featured" ? 1 : 0);

  if (totalActive === 0) return null;

  const removeParam = (key: string, specificValue?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "makes" && specificValue) {
      const currentMakes = params.get("makes")?.split(",").filter(Boolean) || [];
      const updated = currentMakes.filter((m) => m !== specificValue);
      if (updated.length > 0) {
        params.set("makes", updated.join(","));
      } else {
        params.delete("makes");
      }
    } else {
      params.delete(key);
    }

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div 
      className="flex flex-wrap items-center gap-2 p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)] text-xs font-mono"
      aria-label="Active filters bar"
    >
      <span className="text-[#a39e93] font-medium flex items-center gap-1.5 mr-1 text-[10px] uppercase tracking-wider">
        <span>Active Criteria</span>
        <span className="px-1.5 py-0.2 bg-[#c5a880]/20 text-[#c5a880]">
          {totalActive}
        </span>
        <span className="text-white/20">:</span>
      </span>

      {/* 1. Search Query Tag */}
      {searchQuery && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[#c5a880]/40 text-[#c5a880] text-[10px] uppercase tracking-wider">
          <span>Search: &ldquo;{searchQuery}&rdquo;</span>
          <button
            onClick={() => removeParam("search")}
            className="p-0.5 hover:text-white transition-colors"
            aria-label="Remove search filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* 2. Individual Make Tags */}
      {makes.map((make) => (
        <span
          key={make}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#ede8df] text-[10px] uppercase tracking-wider hover:border-[#c5a880]/50 transition-colors"
        >
          <span>{make}</span>
          <button
            onClick={() => removeParam("makes", make)}
            className="p-0.5 hover:text-[#c5a880] transition-colors"
            aria-label={`Remove ${make} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* 3. Max Price Tag */}
      {maxPrice && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#ede8df] text-[10px] uppercase tracking-wider">
          <span>Max: ${Number(maxPrice).toLocaleString()}</span>
          <button
            onClick={() => removeParam("maxPrice")}
            className="p-0.5 hover:text-[#c5a880] transition-colors"
            aria-label="Remove price ceiling filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* 4. Min Year Tag */}
      {minYear && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#ede8df] text-[10px] uppercase tracking-wider">
          <span>Year &ge; {minYear}</span>
          <button
            onClick={() => removeParam("minYear")}
            className="p-0.5 hover:text-[#c5a880] transition-colors"
            aria-label="Remove minimum year filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* 5. Fuel Type Tag */}
      {fuelType && fuelType !== "all" && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#ede8df] text-[10px] uppercase tracking-wider">
          <span>Unit: {FUEL_LABELS[fuelType] || fuelType}</span>
          <button
            onClick={() => removeParam("fuelType")}
            className="p-0.5 hover:text-[#c5a880] transition-colors"
            aria-label="Remove fuel type filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* 6. Sort By Tag */}
      {sortBy && sortBy !== "featured" && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#a39e93] text-[10px] uppercase tracking-wider">
          <span>Order: {SORT_LABELS[sortBy] || sortBy}</span>
          <button
            onClick={() => removeParam("sortBy")}
            className="p-0.5 hover:text-[#c5a880] transition-colors"
            aria-label="Reset sort order"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Clear All CTA */}
      <button
        onClick={clearAllFilters}
        className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#c5a880] hover:text-[#d8bf9a] uppercase tracking-wider transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset Criteria</span>
      </button>
    </div>
  );
}
