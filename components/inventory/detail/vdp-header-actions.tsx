"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Scale, Calendar, Check } from "lucide-react";
import { useState } from "react";
import { Vehicle } from "@/types/inventory";
import { useCompare } from "@/lib/compare/compare-context";
import { useTestDriveModal } from "@/lib/modal/test-drive-modal-context";

interface VdpHeaderActionsProps {
  vehicle: Vehicle;
}

export function VdpHeaderActions({ vehicle }: VdpHeaderActionsProps) {
  const { isInCompare, addToCompare } = useCompare();
  const { openTestDriveModal } = useTestDriveModal();
  const [copied, setCopied] = useState(false);

  const isCompared = isInCompare(vehicle.id);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121214] hover:bg-[#18181b] text-[#ede8df] border border-[rgba(237,232,223,0.1)] transition-colors uppercase tracking-wider text-[11px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return</span>
      </Link>

      <button
        type="button"
        onClick={() => addToCompare(vehicle)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors uppercase tracking-wider text-[11px] ${
          isCompared
            ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880] font-semibold"
            : "bg-[#121214] hover:bg-[#18181b] text-[#ede8df] border-[rgba(237,232,223,0.1)]"
        }`}
        title={isCompared ? "In Comparison List" : "Add to Comparison"}
      >
        <Scale className="w-3.5 h-3.5 text-[#c5a880]" />
        <span>{isCompared ? "Compared" : "Compare"}</span>
      </button>

      <button
        type="button"
        onClick={() => openTestDriveModal(vehicle)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-semibold uppercase text-[11px] tracking-[0.18em] transition-all"
        title="Schedule VIP Private Viewing"
      >
        <Calendar className="w-3.5 h-3.5 text-[#09090a]" />
        <span>Book Viewing</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121214] hover:bg-[#18181b] text-[#ede8df] border border-[rgba(237,232,223,0.1)] transition-colors uppercase tracking-wider text-[11px]"
        title="Copy Permanent Link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Archived</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-[#a39e93]" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
