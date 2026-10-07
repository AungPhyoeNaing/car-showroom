"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { 
  PlusCircle, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Vehicle } from "@/types/inventory";
import { OverviewCharts } from "@/components/dashboard/overview-charts";

async function getCars(): Promise<{ data: Vehicle[] }> {
  const res = await fetch("/api/cars?pageSize=100");
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
}

export default function DashboardOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["cars-overview"],
    queryFn: getCars,
  });

  const cars = data?.data || [];
  const recentAcquisitions = cars.slice(0, 5);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(237,232,223,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880] text-[10px] uppercase font-bold tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Executive Operations
            </span>
            <span className="text-[10px] text-[#a39e93]">
              Live Telemetry &amp; Valuation Feed
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#ede8df] tracking-tight">
            Curatorial Command &amp; Portfolio Telemetry
          </h1>
          <p className="font-mono text-xs text-[#a39e93] mt-1">
            Real-time collection valuation, VIP client lead velocity, and inventory movement analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto font-mono">
          <Link
            href="/dashboard/inventory"
            className="px-4 py-2.5 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Collection</span>
          </Link>
        </div>
      </div>

      {/* Main Charts & KPIs (Total Inventory Value, Leads This Month, Avg Days on Market) */}
      {isLoading ? (
        <div className="h-96 bg-[#121214] border border-[rgba(237,232,223,0.08)] flex items-center justify-center text-[#a39e93] font-mono text-xs animate-pulse">
          INITIALIZING COLLECTION TELEMETRY...
        </div>
      ) : (
        <OverviewCharts vehicles={cars} />
      )}

      {/* Recent Showroom Acquisitions Table Preview */}
      <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgba(237,232,223,0.06)] pb-4 font-mono">
          <div>
            <h2 className="font-serif text-2xl text-[#ede8df] tracking-tight">
              Recent Collection Additions
            </h2>
            <p className="text-xs text-[#a39e93] mt-0.5">
              Latest authenticated lots integrated into the curatorial catalog
            </p>
          </div>

          <Link
            href="/dashboard/inventory"
            className="text-xs text-[#c5a880] hover:text-[#ede8df] font-semibold flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            <span>Catalogue Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[rgba(237,232,223,0.08)] bg-[#09090a] text-[#a39e93] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Motorcar</th>
                <th className="py-3 px-3">Chassis VIN</th>
                <th className="py-3 px-3">Valuation</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(237,232,223,0.04)]">
              {recentAcquisitions.map((car, idx) => {
                const img =
                  car.imageUrls[car.primaryImageIndex || 0] ||
                  car.imageUrls[0] ||
                  "/placeholder-car.jpg";
                return (
                  <tr key={car.id} className="hover:bg-[#18181b]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 overflow-hidden bg-[#09090a] shrink-0 border border-[rgba(237,232,223,0.1)]">
                          <Image src={img} alt={car.model} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-serif text-sm text-[#ede8df] block font-medium">
                            {car.year} {car.make} {car.model}
                          </span>
                          <span className="text-[10px] text-[#a39e93]">
                            {car.specs?.performance?.horsepower} HP • {car.mileage.toLocaleString()} mi
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#a39e93]">
                      {car.vin}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#c5a880]">
                      ${car.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                          car.status === "available"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : car.status === "reserved"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : car.status === "pending"
                            ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/inventory/${car.vin}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] text-[#a39e93] hover:text-[#c5a880] transition-colors uppercase"
                      >
                        <span>Examine</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
