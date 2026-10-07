"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowDownUp } from "lucide-react";

const SORT_OPTIONS = [
  { value: "featured", label: "Curator's Choice (Default)" },
  { value: "price_asc", label: "Valuation: Ascending" },
  { value: "price_desc", label: "Valuation: Descending" },
  { value: "year_desc", label: "Model Year: Most Recent" },
  { value: "mileage_asc", label: "Mileage: Lowest Verified" },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sortBy") || "featured";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === "featured") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", value);
    }

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex items-center gap-2 font-mono">
      <label htmlFor="inventory-sort" className="text-[10px] text-[#a39e93] uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
        <ArrowDownUp className="w-3 h-3 text-[#c5a880]" />
        <span>Order:</span>
      </label>

      <div className="relative">
        <select
          id="inventory-sort"
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none bg-[#121214] border border-[rgba(237,232,223,0.12)] hover:border-[#c5a880]/50 text-[#ede8df] text-[11px] font-mono py-2 pl-3 pr-8 focus:outline-none focus:border-[#c5a880] transition-colors cursor-pointer uppercase tracking-wider"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#121214] text-[#ede8df]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#a39e93]">
          <svg className="w-3.5 h-3.5 text-[#c5a880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
