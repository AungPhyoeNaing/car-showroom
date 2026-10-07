"use client";

import { useState, useEffect } from "react";
import { Search, X, Car as CarIcon, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { INITIAL_CARS } from "@/lib/data/mock-cars";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCars = query.trim()
    ? INITIAL_CARS.filter(
        (car) =>
          car.make.toLowerCase().includes(query.toLowerCase()) ||
          car.model.toLowerCase().includes(query.toLowerCase()) ||
          car.category.toLowerCase().includes(query.toLowerCase()) ||
          car.engine.toLowerCase().includes(query.toLowerCase())
      )
    : INITIAL_CARS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl bg-[#121214] border border-[rgba(237,232,223,0.15)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[rgba(237,232,223,0.08)] flex items-center gap-3 bg-[#09090a]">
          <Search className="w-4 h-4 text-[#c5a880]" />
          <input
            type="text"
            placeholder="Search make, model, e.g. Ferrari, V12, GT3 RS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#ede8df] placeholder-[#6e695f] text-sm font-mono focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 border border-white/10 hover:border-white/30 text-[#a39e93] hover:text-[#ede8df] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#c5a880] px-2 mb-2">
            {query.trim() ? "Search Results" : "Featured Exhibition Lots"}
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-10 text-[#a39e93] font-mono">
              <CarIcon className="w-8 h-8 mx-auto mb-2 text-[#6e695f]" />
              <p className="text-xs">No acquisitions found matching &ldquo;{query}&rdquo;</p>
              <p className="text-[10px] text-[#6e695f] mt-1">Try querying Ferrari, Porsche, Rolls-Royce, or V12</p>
            </div>
          ) : (
            filteredCars.map((car, idx) => (
              <Link
                key={car.id}
                href={`/inventory?search=${encodeURIComponent(car.model)}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 bg-[#09090a] hover:bg-[#18181b] border border-[rgba(237,232,223,0.06)] hover:border-[#c5a880]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black flex items-center justify-center text-[#c5a880] overflow-hidden border border-white/10 font-mono text-[10px]">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="font-serif text-sm text-[#ede8df] group-hover:text-[#c5a880] transition-colors">
                      {car.year} {car.make} {car.model}
                    </div>
                    <div className="text-[10px] text-[#a39e93] font-mono flex items-center gap-2 mt-0.5">
                      <span>{car.category}</span>
                      <span>•</span>
                      <span>{car.horsepower} HP</span>
                      <span>•</span>
                      <span className="text-[#c5a880] font-bold">${car.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#c5a880] uppercase tracking-wider">
                  <span className="hidden sm:inline">Examine</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="p-3 bg-[#09090a] border-t border-[rgba(237,232,223,0.08)] flex items-center justify-between text-[10px] font-mono text-[#a39e93] px-4">
          <div className="flex items-center gap-1.5 text-[#c5a880]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Forensic Certified Registry</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#a39e93]">
            <kbd className="px-1.5 py-0.5 bg-[#121214] border border-white/10 text-[9px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
