"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  RotateCw, 
  RotateCcw, 
  Eye, 
  Sun, 
  Moon, 
  Sparkles, 
  Info,
  X
} from "lucide-react";
import { Vehicle } from "@/types/inventory";

interface Viewer360Props {
  vehicle: Vehicle;
}

const HOTSPOTS = [
  { id: 1, title: "Carbon Aerodynamic Clamshell", description: "Active carbon aero balance channel generating up to 390kg downforce at speed.", angle: 45 },
  { id: 2, title: "Carbon-Ceramic Braking Array", description: "Brembo 398mm carbon discs with monobloc 6-piston forged lightweight calipers.", angle: 120 },
  { id: 3, title: "Titanium Inconel Exhaust", description: "Ultralight acoustic-tuned motorsport exhaust system with ceramic thermal coating.", angle: 220 },
  { id: 4, title: "Atelier Bespoke Cockpit", description: "Hand-stitched semi-aniline leather upholstery and exposed matte twill carbon appointments.", angle: 310 },
];

export function Viewer360({ vehicle }: Viewer360Props) {
  const [angle, setAngle] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [lightingMode, setLightingMode] = useState<"ambient" | "studio" | "spotlight">("studio");

  // Approximate image angle mapping using available images
  const images = vehicle.imageUrls;
  const currentImageIndex = Math.min(
    images.length - 1,
    Math.floor((angle / 360) * images.length)
  );

  const rotate = (delta: number) => {
    setAngle((prev) => (prev + delta + 360) % 360);
  };

  return (
    <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 shadow-xl space-y-6">
      {/* 360° Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(237,232,223,0.08)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
            <RotateCw className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#ede8df] tracking-tight">360&deg; Chassis Turntable Visualizer</h3>
              <span className="px-2 py-0.2 bg-[#c5a880]/15 text-[#c5a880] text-[9px] font-mono uppercase tracking-widest border border-[#c5a880]/30">
                Interactive
              </span>
            </div>
            <p className="text-[11px] text-[#a39e93] font-light mt-0.5">
              Drag scrub slider or rotate to inspect every chassis contour and aerodynamic channel.
            </p>
          </div>
        </div>

        {/* Lighting controls */}
        <div className="flex items-center gap-1 bg-[#09090a] border border-[rgba(237,232,223,0.08)] p-1 self-start sm:self-auto text-xs font-mono">
          <button
            onClick={() => setLightingMode("studio")}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${
              lightingMode === "studio" ? "bg-[#c5a880] text-[#09090a] font-semibold" : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setLightingMode("ambient")}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${
              lightingMode === "ambient" ? "bg-[#c5a880] text-[#09090a] font-semibold" : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Obsidian</span>
          </button>
          <button
            onClick={() => setLightingMode("spotlight")}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${
              lightingMode === "spotlight" ? "bg-[#c5a880] text-[#09090a] font-semibold" : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Glow</span>
          </button>
        </div>
      </div>

      {/* Main 360° Stage */}
      <div className={`relative aspect-[16/9] w-full overflow-hidden bg-[#050505] border border-[rgba(237,232,223,0.08)] flex items-center justify-center transition-all duration-500 ${
        lightingMode === "ambient" ? "brightness-90 contrast-125" : lightingMode === "spotlight" ? "shadow-[inset_0_0_80px_rgba(197,168,128,0.2)]" : ""
      }`}>
        {/* Active Angle Render */}
        <div className="relative w-full h-full">
          <Image
            src={images[currentImageIndex] || images[0]}
            alt={`${vehicle.make} ${vehicle.model} 360 Angle ${angle}`}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-opacity duration-300"
          />
        </div>

        {/* Ambient Ring Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Hotspot Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {HOTSPOTS.map((hs) => {
            const diff = Math.abs(angle - hs.angle);
            const isVisible = diff < 60 || diff > 300;
            if (!isVisible) return null;

            return (
              <button
                key={hs.id}
                onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
                className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  transform: `translate(${Math.sin((hs.angle * Math.PI) / 180) * 120}px, ${
                    Math.cos((hs.angle * Math.PI) / 180) * 40
                  }px)`,
                }}
                aria-label={hs.title}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-5 w-5 bg-[#c5a880] opacity-75"></span>
                  <div className="relative w-6 h-6 bg-black/90 border border-[#c5a880] text-[#c5a880] flex items-center justify-center text-xs">
                    <Eye className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Hotspot Tooltip */}
        {activeHotspot && (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/90 backdrop-blur-md border border-[#c5a880]/50 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#c5a880] font-mono">
                  Atelier Telemetry Highlight
                </span>
                <h4 className="text-sm font-serif text-[#ede8df]">
                  {HOTSPOTS.find((h) => h.id === activeHotspot)?.title}
                </h4>
                <p className="text-xs text-[#a39e93] font-light">
                  {HOTSPOTS.find((h) => h.id === activeHotspot)?.description}
                </p>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-[#a39e93] hover:text-[#ede8df] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Current Angle Readout Badge */}
        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-black/70 border border-white/10 text-[10px] text-[#c5a880] font-mono tracking-wider">
          {angle}&deg; Viewpoint
        </div>
      </div>

      {/* 360° Slider & Rotator Controls */}
      <div className="space-y-2.5 font-mono">
        <div className="flex items-center justify-between text-[11px] text-[#a39e93]">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Info className="w-3 h-3 text-[#c5a880]" />
            <span>Turntable scrub control</span>
          </span>
          <span className="text-[#ede8df]">{angle} / 360&deg;</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => rotate(-45)}
            className="p-2 bg-[#09090a] hover:bg-[#18181b] text-[#ede8df] hover:text-[#c5a880] border border-[rgba(237,232,223,0.08)] transition-colors"
            title="Rotate 45° Counter-Clockwise"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Scrub Slider */}
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-1 bg-[#18181b] appearance-none cursor-pointer accent-[#c5a880]"
            aria-label="Rotate vehicle 360 degrees"
          />

          <button
            onClick={() => rotate(45)}
            className="p-2 bg-[#09090a] hover:bg-[#18181b] text-[#ede8df] hover:text-[#c5a880] border border-[rgba(237,232,223,0.08)] transition-colors"
            title="Rotate 45° Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
