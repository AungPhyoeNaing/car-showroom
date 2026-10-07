"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Gauge, 
  Fuel, 
  Cog, 
  ArrowRight, 
  Calendar,
  Scale,
  Zap
} from "lucide-react";
import { Vehicle, VehicleCondition, VehicleStatus } from "@/types/inventory";
import { getLuxuryShimmerPlaceholder } from "@/lib/data/vehicles-service";
import { useTestDriveModal } from "@/lib/modal/test-drive-modal-context";
import { useCompare } from "@/lib/compare/compare-context";

export interface VehicleCardProps {
  vehicle?: Vehicle;
  isLoading?: boolean;
  priority?: boolean;
  lotIndex?: number;
  onSelect?: (vehicle: Vehicle) => void;
  onBookTestDrive?: (vehicle: Vehicle) => void;
}

// Currency Symbol Helper
function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

// Format Transmission Label
function formatTransmission(transmission: string): string {
  const map: Record<string, string> = {
    dual_clutch: "Dual-Clutch",
    automatic: "Automatic",
    manual: "Manual",
    cvt: "CVT",
    direct_drive: "Direct-Drive",
  };
  return map[transmission] || transmission;
}

// Condition Badge Component
function ConditionBadge({ condition }: { condition: VehicleCondition }) {
  const styles: Record<VehicleCondition, { label: string; className: string }> = {
    new: {
      label: "New Allocation",
      className: "border-[#ede8df]/30 text-[#ede8df] bg-black/40",
    },
    certified: {
      label: "Apex Certified",
      className: "border-[#c5a880]/50 text-[#c5a880] bg-black/40",
    },
    used: {
      label: "Curated Provenance",
      className: "border-white/10 text-[#a39e93] bg-black/40",
    },
  };

  const current = styles[condition] || styles.used;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] border backdrop-blur-md ${current.className}`}
    >
      {current.label}
    </span>
  );
}

// Status Indicator Badge
function StatusBadge({ status }: { status: VehicleStatus }) {
  const styles: Record<VehicleStatus, { label: string; className: string }> = {
    available: {
      label: "Available",
      className: "border-emerald-500/30 text-emerald-400 bg-emerald-950/40",
    },
    reserved: {
      label: "Reserved",
      className: "border-[#c5a880]/40 text-[#c5a880] bg-[#c5a880]/10",
    },
    sold: {
      label: "Private Treaty (Sold)",
      className: "border-white/10 text-white/40 bg-black/50",
    },
    pending: {
      label: "Pending",
      className: "border-sky-500/30 text-sky-400 bg-sky-950/40",
    },
  };

  const current = styles[status] || styles.available;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] border backdrop-blur-md ${current.className}`}
    >
      {current.label}
    </span>
  );
}

// Skeleton Loading State Component
export function VehicleCardSkeleton() {
  return (
    <div 
      role="status" 
      aria-label="Loading vehicle card"
      className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden animate-pulse flex flex-col justify-between"
    >
      <div>
        {/* Image Skeleton */}
        <div className="relative aspect-[16/10] w-full bg-[#18181b]" />

        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-[#242220]" />
              <div className="h-5 w-44 bg-[#242220]" />
            </div>
            <div className="space-y-1.5 text-right">
              <div className="h-3 w-12 bg-[#242220] ml-auto" />
              <div className="h-5 w-24 bg-[#242220] ml-auto" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[rgba(237,232,223,0.08)]">
            <div className="space-y-1.5 text-center">
              <div className="h-2.5 w-10 bg-[#242220] mx-auto" />
              <div className="h-3.5 w-14 bg-[#242220] mx-auto" />
            </div>
            <div className="space-y-1.5 text-center border-x border-[rgba(237,232,223,0.08)]">
              <div className="h-2.5 w-12 bg-[#242220] mx-auto" />
              <div className="h-3.5 w-16 bg-[#242220] mx-auto" />
            </div>
            <div className="space-y-1.5 text-center">
              <div className="h-2.5 w-10 bg-[#242220] mx-auto" />
              <div className="h-3.5 w-14 bg-[#242220] mx-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="h-10 w-full bg-[#18181b]" />
      </div>
    </div>
  );
}

// Main VehicleCard Component
export function VehicleCard({
  vehicle,
  isLoading = false,
  priority = false,
  lotIndex,
  onSelect,
  onBookTestDrive,
}: VehicleCardProps) {
  const { openTestDriveModal } = useTestDriveModal();
  const { isInCompare, addToCompare } = useCompare();

  if (isLoading || !vehicle) {
    return <VehicleCardSkeleton />;
  }

  const isCompared = isInCompare(vehicle.id);

  // Safely resolve primary image URL
  const primaryIdx =
    typeof vehicle.primaryImageIndex === "number" &&
    vehicle.primaryImageIndex >= 0 &&
    vehicle.primaryImageIndex < vehicle.imageUrls.length
      ? vehicle.primaryImageIndex
      : 0;

  const imageUrl = vehicle.imageUrls[primaryIdx] || "/placeholder-car.jpg";

  // Calculate or display MPG
  const mpgDisplay = vehicle.specs?.efficiency?.mpgCombined
    ? `${vehicle.specs.efficiency.mpgCombined} MPG`
    : vehicle.fuelType === "electric"
    ? `${vehicle.specs?.efficiency?.electricRangeMiles || 260} mi EV`
    : "V12/V8 Twin-Turbo";

  return (
    <article className="group bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-xl">
      <div>
        {/* Image Container with Hover Zoom Effect */}
        <div className="relative aspect-[16/10] w-full bg-[#050505] overflow-hidden">
          <Link href={`/inventory/${vehicle.vin}`} className="block absolute inset-0 cursor-pointer">
            <Image
              src={imageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL={getLuxuryShimmerPlaceholder(640, 400)}
              priority={priority}
            />

            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090a] via-transparent to-black/30 pointer-events-none" />
          </Link>

          {/* Top Left: Lot indicator or Condition */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            {typeof lotIndex === "number" && (
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] bg-black/60 border border-[rgba(237,232,223,0.15)] text-[#c5a880]">
                LOT {String(lotIndex).padStart(2, "0")}
              </span>
            )}
            <ConditionBadge condition={vehicle.condition} />
          </div>

          {/* Top Right: Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={vehicle.status} />
          </div>

          {/* Bottom Overlay: VIN & Horsepower */}
          <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-[10px] text-[#a39e93] font-mono">
            <span className="px-1.5 py-0.5 bg-black/60 border border-white/10 tracking-widest">
              VIN: ...{vehicle.vin.slice(-6)}
            </span>
            {vehicle.specs?.performance?.horsepower && (
              <span className="px-1.5 py-0.5 bg-black/60 border border-[#c5a880]/30 text-[#c5a880] flex items-center gap-1 tracking-wider">
                <Zap className="w-2.5 h-2.5 text-[#c5a880]" />
                {vehicle.specs.performance.horsepower} HP
              </span>
            )}
          </div>
        </div>

        {/* Vehicle Body Info */}
        <div className="p-5 space-y-4">
          {/* Make, Model, Year & Price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
                {vehicle.year} {vehicle.make}
              </span>
              <h3 className="text-xl font-serif tracking-tight text-[#ede8df] group-hover:text-[#c5a880] transition-colors line-clamp-1 mt-0.5">
                {vehicle.model}
              </h3>
              {vehicle.trim && (
                <p className="text-[11px] text-[#a39e93] line-clamp-1 font-light italic">{vehicle.trim}</p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] text-[#a39e93] font-mono uppercase tracking-[0.2em] block">
                Valuation
              </span>
              <span className="text-lg font-mono font-bold text-[#c5a880] tracking-tight">
                {formatCurrency(vehicle.price, vehicle.currency)}
              </span>
            </div>
          </div>

          {/* Key Specs Grid Blueprint: MPG/Powertrain, Transmission, Mileage */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[rgba(237,232,223,0.08)] text-xs text-[#a39e93]">
            {/* Spec 1: Powertrain */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#a39e93] flex items-center gap-1">
                <Fuel className="w-2.5 h-2.5 text-[#c5a880]" />
                <span>Unit</span>
              </span>
              <span className="font-mono text-[#ede8df] mt-0.5 text-[11px] truncate max-w-full">
                {mpgDisplay}
              </span>
            </div>

            {/* Spec 2: Transmission */}
            <div className="flex flex-col items-center justify-center text-center border-x border-[rgba(237,232,223,0.08)] px-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#a39e93] flex items-center gap-1">
                <Cog className="w-2.5 h-2.5 text-[#c5a880]" />
                <span>Gearbox</span>
              </span>
              <span className="font-mono text-[#ede8df] mt-0.5 text-[11px] truncate max-w-full">
                {formatTransmission(vehicle.transmission)}
              </span>
            </div>

            {/* Spec 3: Mileage */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#a39e93] flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5 text-[#c5a880]" />
                <span>Odometer</span>
              </span>
              <span className="font-mono text-[#ede8df] mt-0.5 text-[11px] truncate max-w-full">
                {vehicle.mileage.toLocaleString()} mi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-5 pt-0 flex items-center gap-2">
        {onSelect ? (
          <button
            onClick={() => onSelect(vehicle)}
            className="flex-1 py-2.5 px-3 bg-[#18181b] hover:bg-[#c5a880] text-[#ede8df] hover:text-[#09090a] text-[11px] font-mono uppercase tracking-[0.2em] transition-all border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880] flex items-center justify-center gap-2 group/btn"
          >
            <span>Examine Lot</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        ) : (
          <Link
            href={`/inventory/${vehicle.vin}`}
            className="flex-1 py-2.5 px-3 bg-[#18181b] hover:bg-[#c5a880] text-[#ede8df] hover:text-[#09090a] text-[11px] font-mono uppercase tracking-[0.2em] transition-all border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880] flex items-center justify-center gap-2 group/btn"
          >
            <span>Examine Lot</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Compare Toggle Button */}
        <button
          onClick={() => addToCompare(vehicle)}
          title={isCompared ? "Remove from comparison" : "Add to vehicle comparison"}
          className={`py-2.5 px-3 text-xs font-mono transition-all flex items-center justify-center border ${
            isCompared
              ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
              : "bg-[#18181b] hover:bg-[#242220] border-[rgba(237,232,223,0.08)] text-[#a39e93] hover:text-white"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        {/* Schedule Test Drive Button */}
        <button
          onClick={() => {
            if (onBookTestDrive) {
              onBookTestDrive(vehicle);
            } else {
              openTestDriveModal(vehicle);
            }
          }}
          title="Schedule VIP Private Viewing & Inspection"
          className="py-2.5 px-3 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] transition-all flex items-center justify-center border border-[#d8bf9a]"
        >
          <Calendar className="w-3.5 h-3.5 text-[#09090a]" />
        </button>
      </div>
    </article>
  );
}
