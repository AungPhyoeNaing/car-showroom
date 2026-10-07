"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Scale, 
  Zap, 
  Timer, 
  Gauge, 
  Calendar, 
  ExternalLink,
  Flame
} from "lucide-react";
import { useCompare } from "@/lib/compare/compare-context";
import { useTestDriveModal } from "@/lib/modal/test-drive-modal-context";

export function CompareModal() {
  const { compareList, isCompareOpen, closeCompare, removeFromCompare } = useCompare();
  const { openTestDriveModal } = useTestDriveModal();

  if (!isCompareOpen) return null;

  // Determine winners among compared vehicles
  const fastest0To60 = Math.min(
    ...compareList.map((c) => c.specs?.performance?.zeroToSixtyMph || 99)
  );
  const highestHp = Math.max(
    ...compareList.map((c) => c.specs?.performance?.horsepower || 0)
  );
  const lowestPrice = Math.min(...compareList.map((c) => c.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#121214] border border-[rgba(237,232,223,0.15)] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#09090a] border-b border-[rgba(237,232,223,0.08)] flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#121214]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif text-[#ede8df] tracking-tight">
                Side-by-Side Chassis Benchmark
              </h2>
              <p className="text-[10px] text-[#a39e93] uppercase tracking-wider">
                Direct telemetry, powertrain blueprint, and valuation benchmark
              </p>
            </div>
          </div>

          <button
            onClick={closeCompare}
            className="w-8 h-8 border border-white/10 hover:border-white/30 text-[#a39e93] hover:text-[#ede8df] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Comparison Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {compareList.length === 0 ? (
            <div className="text-center py-16 text-[#a39e93] space-y-3 font-mono">
              <p className="text-xs">No vehicles currently selected for benchmark comparison.</p>
              <Link
                href="/inventory"
                onClick={closeCompare}
                className="inline-block px-4 py-2 bg-[#c5a880] text-[#09090a] font-bold text-[10px] uppercase tracking-widest"
              >
                Browse Exhibition Lots
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div
                className="grid gap-4 min-w-[640px] font-mono text-xs"
                style={{
                  gridTemplateColumns: `180px repeat(${compareList.length}, minmax(200px, 1fr))`,
                }}
              >
                {/* ROW 0: Vehicle Card Header */}
                <div className="font-bold text-[10px] uppercase tracking-wider text-[#a39e93] pt-2 flex items-center">
                  EXHIBIT LOT
                </div>
                {compareList.map((car, idx) => {
                  const img =
                    car.imageUrls[car.primaryImageIndex || 0] ||
                    car.imageUrls[0] ||
                    "/placeholder-car.jpg";
                  return (
                    <div
                      key={car.id}
                      className="bg-[#09090a] p-4 border border-[rgba(237,232,223,0.08)] space-y-3 relative group"
                    >
                      <button
                        onClick={() => removeFromCompare(car.id)}
                        className="absolute top-2 right-2 p-1 bg-[#121214] hover:bg-rose-950/40 border border-white/10 text-[#a39e93] hover:text-rose-400 transition-colors z-10"
                        title="Remove from comparison"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <div className="relative h-28 overflow-hidden bg-black border border-white/10">
                        <Image src={img} alt={car.model} fill className="object-cover" />
                      </div>

                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase text-[#c5a880] tracking-wider block">
                          LOT 0{idx + 1} &bull; {car.year} {car.make}
                        </span>
                        <h4 className="font-serif font-bold text-[#ede8df] text-base truncate mt-0.5">
                          {car.model}
                        </h4>
                        {car.trim && (
                          <p className="text-[10px] text-[#a39e93] truncate font-light italic">{car.trim}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[rgba(237,232,223,0.08)] flex items-center justify-between">
                        <span className="text-base font-bold font-mono text-[#c5a880]">
                          ${car.price.toLocaleString()}
                        </span>
                        {car.price === lowestPrice && compareList.length > 1 && (
                          <span className="px-1.5 py-0.2 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold uppercase">
                            Lowest
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* ROW 1: 0-60 MPH Acceleration */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] flex items-center gap-1.5 py-3 border-t border-[rgba(237,232,223,0.08)]">
                  <Timer className="w-3 h-3 text-[#c5a880]" />
                  <span>0–60 MPH</span>
                </div>
                {compareList.map((car) => {
                  const z60 = car.specs?.performance?.zeroToSixtyMph;
                  const isFastest = z60 && z60 === fastest0To60 && compareList.length > 1;
                  return (
                    <div
                      key={car.id}
                      className={`py-3 border-t border-[rgba(237,232,223,0.08)] flex items-center gap-2 font-bold ${
                        isFastest ? "text-[#c5a880]" : "text-[#ede8df]"
                      }`}
                    >
                      <span>{z60 ? `${z60}s` : "N/A"}</span>
                      {isFastest && (
                        <span className="px-1 py-0.2 bg-[#c5a880]/20 text-[#c5a880] text-[8px] uppercase">
                          Peak
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* ROW 2: Peak Horsepower */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] flex items-center gap-1.5 py-3 border-t border-[rgba(237,232,223,0.08)]">
                  <Zap className="w-3 h-3 text-[#c5a880]" />
                  <span>Horsepower</span>
                </div>
                {compareList.map((car) => {
                  const hp = car.specs?.performance?.horsepower;
                  const isHighest = hp && hp === highestHp && compareList.length > 1;
                  return (
                    <div
                      key={car.id}
                      className={`py-3 border-t border-[rgba(237,232,223,0.08)] flex items-center gap-2 font-bold ${
                        isHighest ? "text-[#c5a880]" : "text-[#ede8df]"
                      }`}
                    >
                      <span>{hp ? `${hp} HP` : "N/A"}</span>
                      {isHighest && (
                        <span className="px-1 py-0.2 bg-[#c5a880]/20 text-[#c5a880] text-[8px] uppercase">
                          Leader
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* ROW 3: Peak Torque */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] flex items-center gap-1.5 py-3 border-t border-[rgba(237,232,223,0.08)]">
                  <Flame className="w-3 h-3 text-[#c5a880]" />
                  <span>Peak Torque</span>
                </div>
                {compareList.map((car) => (
                  <div key={car.id} className="text-[#ede8df] py-3 border-t border-[rgba(237,232,223,0.08)]">
                    {car.specs?.performance?.torqueFtLbs
                      ? `${car.specs.performance.torqueFtLbs} LB-FT`
                      : "N/A"}
                  </div>
                ))}

                {/* ROW 4: Top Speed */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] flex items-center gap-1.5 py-3 border-t border-[rgba(237,232,223,0.08)]">
                  <Gauge className="w-3 h-3 text-[#c5a880]" />
                  <span>Top Speed</span>
                </div>
                {compareList.map((car) => (
                  <div key={car.id} className="text-[#ede8df] py-3 border-t border-[rgba(237,232,223,0.08)]">
                    {car.specs?.performance?.topSpeedMph
                      ? `${car.specs.performance.topSpeedMph} MPH`
                      : "N/A"}
                  </div>
                ))}

                {/* ROW 5: Engine Architecture */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] py-3 border-t border-[rgba(237,232,223,0.08)]">
                  Unit Blueprint
                </div>
                {compareList.map((car) => (
                  <div key={car.id} className="text-[#a39e93] py-3 border-t border-[rgba(237,232,223,0.08)] truncate font-serif text-[11px]">
                    {car.specs?.engine?.type || "Internal Combustion Unit"}
                  </div>
                ))}

                {/* ROW 6: Transmission & Drivetrain */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] py-3 border-t border-[rgba(237,232,223,0.08)]">
                  Gearbox &amp; Drive
                </div>
                {compareList.map((car) => (
                  <div key={car.id} className="text-[#ede8df] py-3 border-t border-[rgba(237,232,223,0.08)] text-[11px]">
                    <span className="capitalize">{car.transmission.replace("_", " ")}</span> •{" "}
                    <span className="uppercase">{car.drivetrain}</span>
                  </div>
                ))}

                {/* ROW 7: Odometer Mileage */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] py-3 border-t border-[rgba(237,232,223,0.08)]">
                  Odometer
                </div>
                {compareList.map((car) => (
                  <div key={car.id} className="text-[#ede8df] py-3 border-t border-[rgba(237,232,223,0.08)]">
                    {car.mileage.toLocaleString()} mi
                  </div>
                ))}

                {/* ROW 8: Condition Tier */}
                <div className="text-[10px] uppercase tracking-wider text-[#a39e93] py-3 border-t border-[rgba(237,232,223,0.08)]">
                  Lineage Tier
                </div>
                {compareList.map((car) => (
                  <div key={car.id} className="text-[#a39e93] py-3 border-t border-[rgba(237,232,223,0.08)] uppercase text-[10px]">
                    {car.condition === "certified"
                      ? "Apex Certified"
                      : car.condition === "new"
                      ? "New Allocation"
                      : "Curated Provenance"}
                  </div>
                ))}

                {/* ROW 9: Action CTAs */}
                <div className="py-4 border-t border-[rgba(237,232,223,0.08)]"></div>
                {compareList.map((car) => (
                  <div key={car.id} className="py-4 border-t border-[rgba(237,232,223,0.08)] space-y-2">
                    <button
                      onClick={() => {
                        closeCompare();
                        openTestDriveModal(car);
                      }}
                      className="w-full py-2.5 px-3 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Viewing</span>
                    </button>

                    <Link
                      href={`/inventory/${car.vin}`}
                      onClick={closeCompare}
                      className="w-full py-2 px-3 bg-[#18181b] hover:bg-[#242220] text-[#ede8df] text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-[rgba(237,232,223,0.08)]"
                    >
                      <span>Examine Dossier</span>
                      <ExternalLink className="w-3 h-3 text-[#c5a880]" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
