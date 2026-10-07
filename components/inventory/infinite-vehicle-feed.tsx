"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { 
  Car as CarIcon, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ArrowDown, 
  Loader2, 
  PhoneCall,
  LayoutGrid,
  List,
  ArrowRight,
  X,
  Zap,
  Gauge
} from "lucide-react";
import { Vehicle } from "@/types/inventory";
import { PaginatedVehiclesResult, getLuxuryShimmerPlaceholder } from "@/lib/data/vehicles-service";
import { VehicleCard, VehicleCardSkeleton } from "@/components/inventory/vehicle-card";

interface InfiniteVehicleFeedProps {
  initialResult: PaginatedVehiclesResult;
  queryString: string;
}

async function fetchVehiclesPage(queryString: string, page: number): Promise<PaginatedVehiclesResult> {
  const params = new URLSearchParams(queryString);
  params.set("page", page.toString());
  params.set("pageSize", "6");

  const res = await fetch(`/api/cars?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch vehicles page");
  return res.json();
}

export function InfiniteVehicleFeed({
  initialResult,
  queryString,
}: InfiniteVehicleFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // TanStack React Query: useInfiniteQuery with initialData from Server Component
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["infinite-vehicles", queryString],
    queryFn: ({ pageParam = 1 }) => fetchVehiclesPage(queryString, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialData: {
      pages: [initialResult],
      pageParams: [1],
    },
  });

  // Infinite Scroll Trigger via IntersectionObserver
  useEffect(() => {
    const observerTarget = observerTargetRef.current;
    if (!observerTarget) return;

    const handler = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    const observer = new IntersectionObserver(handler, {
      threshold: 0.2,
      rootMargin: "250px",
    });
    observer.observe(observerTarget);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all fetched pages
  const allVehicles = data?.pages.flatMap((page) => page.data) || initialResult.data;
  const totalCount = data?.pages[0]?.totalCount ?? initialResult.totalCount;

  // Active filters for contextual suggestions in empty state
  const hasSearch = !!searchParams.get("search");
  const hasMakes = !!searchParams.get("makes");
  const hasMaxPrice = !!searchParams.get("maxPrice");
  const hasMinYear = !!searchParams.get("minYear");
  const hasFuelType = searchParams.get("fuelType") && searchParams.get("fuelType") !== "all";

  // Graceful Empty State Handler
  if (status === "success" && allVehicles.length === 0) {
    return (
      <div className="py-16 px-6 sm:px-12 text-center bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-6">
        <div className="w-12 h-12 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] mx-auto bg-[#09090a]">
          <CarIcon className="w-6 h-6 text-[#c5a880]" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="text-2xl font-serif text-[#ede8df]">No Matching Acquisitions Found</h3>
          <p className="text-xs sm:text-sm text-[#a39e93] font-light leading-relaxed">
            We currently do not hold inventory matching this specific curation filter.
            Our acquisition ledger is updated weekly with off-market private treaty vehicles.
          </p>
        </div>

        {/* Actionable Suggestions to Broaden Filters */}
        <div className="p-4 bg-[#09090a] border border-[rgba(237,232,223,0.08)] max-w-md mx-auto text-left space-y-2.5 text-xs text-[#ede8df] font-mono">
          <div className="font-semibold text-[#c5a880] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>Curatorial Suggestions:</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-[#a39e93] text-[11px]">
            {hasMaxPrice && (
              <li>
                Adjust valuation cap (${Number(searchParams.get("maxPrice")).toLocaleString()})
              </li>
            )}
            {hasMakes && (
              <li>Include other peer marques in your search</li>
            )}
            {hasFuelType && (
              <li>Broaden powertrain parameter to all configurations</li>
            )}
            {hasMinYear && (
              <li>Adjust vintage year threshold</li>
            )}
            {hasSearch && (
              <li>Verify spelling or search by marque instead</li>
            )}
            {!hasMaxPrice && !hasMakes && !hasFuelType && !hasMinYear && !hasSearch && (
              <li>Reset criteria to view full atelier exhibition</li>
            )}
          </ul>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.push("/inventory")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-mono font-semibold text-xs uppercase tracking-[0.2em] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Parameters</span>
          </button>

          <button
            onClick={() => router.push("/contact?type=bespoke-order")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#18181b] hover:bg-[#242220] text-[#ede8df] border border-[rgba(237,232,223,0.12)] font-mono text-xs uppercase tracking-[0.2em] transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Request Bespoke Sourcing</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(237,232,223,0.08)]">
        <div className="text-[10px] font-mono text-[#a39e93] uppercase tracking-widest">
          EXHIBITION VIEW: <span className="text-[#ede8df] font-bold">{allVehicles.length} OF {totalCount} LOTS</span>
        </div>

        <div className="flex items-center gap-1 bg-[#121214] border border-[rgba(237,232,223,0.08)] p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 transition-colors ${
              viewMode === "grid"
                ? "bg-[#c5a880] text-[#09090a]"
                : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
            title="Exhibition Gallery Wall"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 transition-colors ${
              viewMode === "table"
                ? "bg-[#c5a880] text-[#09090a]"
                : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
            title="Editorial Catalogue Ledger"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* View Mode 1: Exhibition Gallery Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allVehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              lotIndex={index + 1}
              priority={index < 3}
              onSelect={(v) => setSelectedVehicle(v)}
              onBookTestDrive={(v) => router.push(`/contact?carId=${encodeURIComponent(v.id)}`)}
            />
          ))}

          {/* Loading Skeletons for Next Page */}
          {isFetchingNextPage && (
            <>
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
            </>
          )}
        </div>
      ) : (
        /* View Mode 2: Editorial Catalogue Table / Ledger */
        <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(237,232,223,0.08)] text-[10px] text-[#a39e93] uppercase tracking-wider bg-[#09090a]">
                <th className="py-3 px-4">Lot</th>
                <th className="py-3 px-4">Artwork</th>
                <th className="py-3 px-4">Marque &amp; Chassis</th>
                <th className="py-3 px-4 hidden sm:table-cell">Powertrain</th>
                <th className="py-3 px-4 hidden md:table-cell">Odometer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Valuation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(237,232,223,0.06)]">
              {allVehicles.map((vehicle, index) => {
                const img = vehicle.imageUrls[vehicle.primaryImageIndex || 0] || vehicle.imageUrls[0];
                return (
                  <tr key={vehicle.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-4 text-[#c5a880] font-bold">
                      0{index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="relative w-14 h-9 bg-black overflow-hidden border border-[rgba(237,232,223,0.08)]">
                        <Image src={img} alt={vehicle.model} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-serif text-sm text-[#ede8df] group-hover:text-[#c5a880] transition-colors">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-[10px] text-[#a39e93] font-mono">
                        VIN: {vehicle.vin}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-[#a39e93]">
                      <div>{vehicle.specs.performance.horsepower} HP</div>
                      <div className="text-[10px] text-[#a39e93]/70">{vehicle.specs.engine.type}</div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-[#ede8df]">
                      {vehicle.mileage.toLocaleString()} mi
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[9px] uppercase border ${
                        vehicle.status === "available"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                          : "border-[#c5a880]/30 text-[#c5a880] bg-[#c5a880]/5"
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#c5a880]">
                      ${vehicle.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/inventory/${vehicle.vin}`}
                        className="inline-flex items-center gap-1 text-[10px] text-[#ede8df] hover:text-[#c5a880] uppercase tracking-wider transition-colors"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Infinite Scroll Sentinel / Load More Controls */}
      <div ref={observerTargetRef} className="py-8 text-center space-y-4">
        {hasNextPage ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#121214] hover:bg-[#18181b] text-[#c5a880] border border-[rgba(237,232,223,0.15)] hover:border-[#c5a880] text-xs font-mono uppercase tracking-[0.2em] transition-all disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c5a880]" />
                  <span>Curating Additional Lots...</span>
                </>
              ) : (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Reveal Next Lots ({allVehicles.length} of {totalCount})</span>
                </>
              )}
            </button>
            <p className="text-[10px] font-mono text-[#a39e93] uppercase tracking-wider">
              Scroll downward to dynamically unseal remaining catalogue lots
            </p>
          </div>
        ) : (
          allVehicles.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#121214] border border-[rgba(237,232,223,0.08)] text-[10px] font-mono text-[#a39e93] uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Full Exhibition Catalogue Displayed ({totalCount} Authenticated Lots)</span>
            </div>
          )
        )}
      </div>

      {/* Vehicle Detailed Specs Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-3xl w-full bg-[#121214] border border-[rgba(237,232,223,0.15)] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="relative aspect-[16/9] w-full bg-[#050505] shrink-0">
              <Image
                src={selectedVehicle.imageUrls[selectedVehicle.primaryImageIndex || 0] || selectedVehicle.imageUrls[0]}
                alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={getLuxuryShimmerPlaceholder(768, 320)}
              />
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/70 border border-white/20 text-[#ede8df] flex items-center justify-center hover:bg-[#c5a880] hover:text-[#09090a] transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md text-[#c5a880] font-mono text-xs border border-white/10">
                VIN: {selectedVehicle.vin}
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
                    {selectedVehicle.year} {selectedVehicle.make}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#ede8df] tracking-tight">
                    {selectedVehicle.model} {selectedVehicle.trim && `— ${selectedVehicle.trim}`}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#a39e93] block">Valuation</span>
                  <div className="text-2xl font-mono font-bold text-[#c5a880]">
                    ${selectedVehicle.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#09090a] border border-[rgba(237,232,223,0.08)]">
                  <div className="text-[9px] text-[#a39e93] font-mono uppercase">Engine</div>
                  <div className="font-serif text-sm text-[#ede8df] mt-1">{selectedVehicle.specs.engine.type}</div>
                </div>
                <div className="p-3 bg-[#09090a] border border-[rgba(237,232,223,0.08)]">
                  <div className="text-[9px] text-[#a39e93] font-mono uppercase">Output</div>
                  <div className="font-mono text-sm text-[#c5a880] mt-1">{selectedVehicle.specs.performance.horsepower} HP</div>
                </div>
                <div className="p-3 bg-[#09090a] border border-[rgba(237,232,223,0.08)]">
                  <div className="text-[9px] text-[#a39e93] font-mono uppercase">0–60 MPH</div>
                  <div className="font-mono text-sm text-[#ede8df] mt-1">{selectedVehicle.specs.performance.zeroToSixtyMph}s</div>
                </div>
                <div className="p-3 bg-[#09090a] border border-[rgba(237,232,223,0.08)]">
                  <div className="text-[9px] text-[#a39e93] font-mono uppercase">Top Speed</div>
                  <div className="font-mono text-sm text-[#ede8df] mt-1">{selectedVehicle.specs.performance.topSpeedMph} MPH</div>
                </div>
              </div>

              {/* Bespoke Features */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] mb-2">Bespoke Specifications</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a39e93]">
                  {selectedVehicle.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#c5a880]"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[rgba(237,232,223,0.08)]">
                <button
                  onClick={() => {
                    const id = selectedVehicle.id;
                    setSelectedVehicle(null);
                    router.push(`/contact?carId=${encodeURIComponent(id)}`);
                  }}
                  className="w-full sm:flex-1 py-3 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all"
                >
                  Book Private Viewing &amp; Test Drive
                </button>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#18181b] hover:bg-[#242220] text-[#ede8df] font-mono text-xs uppercase tracking-wider border border-[rgba(237,232,223,0.08)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
