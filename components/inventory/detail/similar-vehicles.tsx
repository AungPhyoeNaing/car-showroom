import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Vehicle } from "@/types/inventory";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { SectionHeading } from "@/components/ui/section-heading";

interface SimilarVehiclesProps {
  vehicles: Vehicle[];
}

export function SimilarVehicles({ vehicles }: SimilarVehiclesProps) {
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <section className="pt-20 pb-12 border-t border-[rgba(237,232,223,0.08)]">
      <SectionHeading
        numeral="04"
        tag="PEER CURATION"
        title="Peer Acquisition Lots"
        subtitle="Examine alternative chassis matching this performance tier, rarity status, and valuation category."
        action={
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121214] hover:bg-[#18181b] text-[#ede8df] border border-[rgba(237,232,223,0.12)] hover:border-[#c5a880] text-[10px] font-mono font-semibold uppercase tracking-[0.2em] transition-all group shrink-0"
          >
            <span>Catalogue Registry</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c5a880] group-hover:translate-x-1 transition-transform" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {vehicles.map((v, idx) => (
          <VehicleCard key={v.id} vehicle={v} lotIndex={idx + 1} />
        ))}
      </div>
    </section>
  );
}
