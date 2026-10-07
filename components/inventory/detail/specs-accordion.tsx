"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Gauge, 
  Flame, 
  Cog, 
  Fuel, 
  Layers
} from "lucide-react";
import { Vehicle } from "@/types/inventory";

interface SpecsAccordionProps {
  vehicle: Vehicle;
}

export function SpecsAccordion({ vehicle }: SpecsAccordionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    engine: true,
    performance: true,
    powertrain: false,
    dimensions: false,
    efficiency: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { specs } = vehicle;

  return (
    <div className="space-y-3 font-mono">
      {/* 1. Engine & Powertrain */}
      <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden">
        <button
          onClick={() => toggleSection("engine")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-serif text-sm text-[#ede8df] tracking-tight">Engine &amp; Mechanical Blueprint</h4>
              <p className="text-[10px] text-[#a39e93]">Displacement, induction system, and cylinder geometry</p>
            </div>
          </div>
          {openSections.engine ? <ChevronUp className="w-4 h-4 text-[#a39e93]" /> : <ChevronDown className="w-4 h-4 text-[#a39e93]" />}
        </button>

        {openSections.engine && (
          <div className="p-4 pt-0 border-t border-[rgba(237,232,223,0.08)]">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs">
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Configuration</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">{specs?.engine?.type || "Bespoke"}</dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Horsepower</dt>
                <dd className="font-bold text-[#c5a880] mt-0.5">{specs?.performance?.horsepower} HP</dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Peak Torque</dt>
                <dd className="font-bold text-[#c5a880] mt-0.5">{specs?.performance?.torqueFtLbs} lb-ft</dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Displacement</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">
                  {specs?.engine?.displacementLiters ? `${specs.engine.displacementLiters} Litres` : "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Cylinders</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">{specs?.engine?.cylinders || "Electric Vector"}</dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Aspiration</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">{specs?.engine?.forcedInduction || "Twin-Turbo"}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 2. Performance & Telemetry */}
      <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden">
        <button
          onClick={() => toggleSection("performance")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-serif text-sm text-[#ede8df] tracking-tight">Factory Verified Telemetry</h4>
              <p className="text-[10px] text-[#a39e93]">Acceleration metrics, top velocity, and odometer log</p>
            </div>
          </div>
          {openSections.performance ? <ChevronUp className="w-4 h-4 text-[#a39e93]" /> : <ChevronDown className="w-4 h-4 text-[#a39e93]" />}
        </button>

        {openSections.performance && (
          <div className="p-4 pt-0 border-t border-[rgba(237,232,223,0.08)]">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs">
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">0–60 MPH</dt>
                <dd className="font-bold text-[#c5a880] text-sm mt-0.5">
                  {specs?.performance?.zeroToSixtyMph ? `${specs.performance.zeroToSixtyMph}s` : "Under 3.0s"}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Top Speed</dt>
                <dd className="font-bold text-[#ede8df] text-sm mt-0.5">
                  {specs?.performance?.topSpeedMph ? `${specs.performance.topSpeedMph} MPH` : "200+ MPH"}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Odometer Ledger</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">
                  {vehicle.mileage.toLocaleString()} Verified mi
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 3. Transmission & Drivetrain */}
      <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden">
        <button
          onClick={() => toggleSection("powertrain")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Cog className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-serif text-sm text-[#ede8df] tracking-tight">Transmission &amp; Drivetrain Architecture</h4>
              <p className="text-[10px] text-[#a39e93]">Gearbox layout, axle ratio, and differential distribution</p>
            </div>
          </div>
          {openSections.powertrain ? <ChevronUp className="w-4 h-4 text-[#a39e93]" /> : <ChevronDown className="w-4 h-4 text-[#a39e93]" />}
        </button>

        {openSections.powertrain && (
          <div className="p-4 pt-0 border-t border-[rgba(237,232,223,0.08)]">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs">
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Gearbox Unit</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5 capitalize">
                  {vehicle.transmission.replace("_", "-")}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Drivetrain</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5 uppercase">
                  {vehicle.drivetrain}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Powertrain Platform</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5 capitalize">
                  {vehicle.fuelType.replace("_", " ")}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 4. Dimensions & Weight */}
      <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden">
        <button
          onClick={() => toggleSection("dimensions")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-serif text-sm text-[#ede8df] tracking-tight">Dimensions &amp; Carbon Monocoque</h4>
              <p className="text-[10px] text-[#a39e93]">Dry weight, chassis tub construction, and cabin capacity</p>
            </div>
          </div>
          {openSections.dimensions ? <ChevronUp className="w-4 h-4 text-[#a39e93]" /> : <ChevronDown className="w-4 h-4 text-[#a39e93]" />}
        </button>

        {openSections.dimensions && (
          <div className="p-4 pt-0 border-t border-[rgba(237,232,223,0.08)]">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs">
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Kerb Weight</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">
                  {specs?.dimensions?.curbWeightLbs ? `${specs.dimensions.curbWeightLbs.toLocaleString()} lbs` : "Bespoke Carbon"}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Seating</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">
                  {specs?.dimensions?.seatingCapacity || 2} Occupants
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Chassis Tub</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">Pre-Preg Carbon Fibre Monocoque</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* 5. Fuel & Efficiency */}
      <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden">
        <button
          onClick={() => toggleSection("efficiency")}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Fuel className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-serif text-sm text-[#ede8df] tracking-tight">Efficiency &amp; Hybrid Telemetry</h4>
              <p className="text-[10px] text-[#a39e93]">EPA estimates, hybrid kinetic recovery, and battery range</p>
            </div>
          </div>
          {openSections.efficiency ? <ChevronUp className="w-4 h-4 text-[#a39e93]" /> : <ChevronDown className="w-4 h-4 text-[#a39e93]" />}
        </button>

        {openSections.efficiency && (
          <div className="p-4 pt-0 border-t border-[rgba(237,232,223,0.08)]">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs">
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Combined Efficiency</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">
                  {specs?.efficiency?.mpgCombined ? `${specs.efficiency.mpgCombined} MPG` : "Performance Tuned"}
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Urban / Highway</dt>
                <dd className="font-semibold text-[#ede8df] mt-0.5">
                  {specs?.efficiency?.mpgCity || "--"} / {specs?.efficiency?.mpgHighway || "--"} MPG
                </dd>
              </div>
              <div>
                <dt className="text-[#a39e93] uppercase tracking-wider text-[9px]">Pure EV Range</dt>
                <dd className="font-semibold text-[#c5a880] mt-0.5">
                  {specs?.efficiency?.electricRangeMiles
                    ? `${specs.efficiency.electricRangeMiles} mi Electric Vector`
                    : "Kinetic E-Recovery"}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
