"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Gauge, 
  Zap, 
  Calendar,
  Compass,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Lock
} from "lucide-react";
import { INITIAL_CARS } from "@/lib/data/mock-cars";
import { SectionHeading } from "@/components/ui/section-heading";
import { MarqueeStrip } from "@/components/ui/marquee-strip";
import { EditorialBadge } from "@/components/ui/editorial-badge";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", "Hypercar", "Supercar", "Grand Tourer"];

  const featuredCars = INITIAL_CARS.filter(c => c.featured);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroCars = featuredCars.slice(0, 3);
  const currentHeroCar = heroCars[activeHeroIndex] || featuredCars[0];

  const displayCars = activeCategory === "All" 
    ? featuredCars 
    : featuredCars.filter(c => c.category === activeCategory);

  return (
    <div className="flex flex-col w-full bg-[#09090a] text-[#ede8df] overflow-hidden selection:bg-[#c5a880] selection:text-[#09090a]">
      {/* 1. ARCHITECTURAL HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col justify-between border-b border-[rgba(237,232,223,0.08)] bg-[#09090a] pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Subtle radial ambient light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#c5a880]/5 blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and Curatorial Metadata */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <EditorialBadge variant="brass">
                  LOT {String(activeHeroIndex + 1).padStart(2, "0")} / 12 — THE ATELIER CURATION
                </EditorialBadge>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-[#a39e93] uppercase">
                  SALON D&apos;AUTOMOBILE
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif tracking-tight leading-[1.04] text-[#ede8df]">
                The Fine Art of <br />
                <span className="italic font-normal text-[#c5a880]">Mechanical Perfection.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#a39e93] font-light max-w-xl leading-relaxed">
                Curators of rare hypercars, homologation specials, and bespoke grand tourers. 
                Every vehicle is authenticated with full forensic telemetry and archived factory provenance.
              </p>

              {/* Technical Blueprint Metrics */}
              <div className="grid grid-cols-3 gap-6 py-4 border-y border-[rgba(237,232,223,0.08)] max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#c5a880]">
                    {currentHeroCar.horsepower} <span className="text-xs text-[#a39e93] font-normal">HP</span>
                  </div>
                  <div className="text-[10px] text-[#a39e93] font-mono uppercase tracking-[0.2em] mt-1">
                    Peak Power
                  </div>
                </div>

                <div className="border-x border-[rgba(237,232,223,0.08)] px-4">
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#ede8df]">
                    {currentHeroCar.acceleration}
                  </div>
                  <div className="text-[10px] text-[#a39e93] font-mono uppercase tracking-[0.2em] mt-1">
                    0–60 MPH
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#c5a880]">
                    100%
                  </div>
                  <div className="text-[10px] text-[#a39e93] font-mono uppercase tracking-[0.2em] mt-1">
                    Forensic Proof
                  </div>
                </div>
              </div>

              {/* Curated Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/inventory"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all group"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Examine Catalogue ({INITIAL_CARS.length} Lots)</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#121214] hover:bg-[#1a1918] text-[#ede8df] hover:text-[#c5a880] border border-[rgba(237,232,223,0.12)] font-mono text-xs uppercase tracking-[0.2em] transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Salon Appointment</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Spotlight Artwork Display with Interactive Lot Selector */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-[#121214] border border-[rgba(237,232,223,0.1)] p-4 sm:p-5 shadow-2xl">
                {/* Lot Header & Status */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(237,232,223,0.08)]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c5a880]">
                    FEATURED EXHIBIT / LOT {String(activeHeroIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                    [ AVAILABLE ]
                  </span>
                </div>

                {/* Spotlight Vehicle Photography with AnimatePresence */}
                <div className="relative aspect-[16/10] w-full bg-[#050505] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentHeroCar.id}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={currentHeroCar.images[0]}
                        alt={`${currentHeroCar.make} ${currentHeroCar.model}`}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Identity & Technical Specs */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#a39e93]">
                        {currentHeroCar.year} {currentHeroCar.make}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif text-[#ede8df] tracking-tight">
                        {currentHeroCar.model}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#a39e93] block">
                        Valuation
                      </span>
                      <div className="text-lg font-mono font-bold text-[#c5a880]">
                        ${currentHeroCar.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Lot Selector Thumbnails */}
                  <div className="pt-2 border-t border-[rgba(237,232,223,0.08)]">
                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#a39e93] mb-2">
                      SELECT EXHIBIT LOT:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {heroCars.map((car, idx) => (
                        <button
                          key={car.id}
                          onClick={() => setActiveHeroIndex(idx)}
                          className={`p-1.5 border text-left transition-all ${
                            activeHeroIndex === idx
                              ? "border-[#c5a880] bg-[#c5a880]/10 text-[#ede8df]"
                              : "border-[rgba(237,232,223,0.08)] bg-[#09090a] text-[#a39e93] hover:border-white/20"
                          }`}
                        >
                          <div className="text-[9px] font-mono font-bold">LOT 0{idx + 1}</div>
                          <div className="text-[10px] truncate font-serif">{car.model}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/inventory?search=${encodeURIComponent(currentHeroCar.model)}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#18181b] hover:bg-[#c5a880] hover:text-[#09090a] text-[#ede8df] text-[10px] font-mono uppercase tracking-[0.2em] transition-all border border-[rgba(237,232,223,0.08)] group"
                  >
                    <span>Examine Full Dossier</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Editorial Note */}
        <div className="max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#a39e93] border-t border-[rgba(237,232,223,0.06)]">
          <span className="uppercase tracking-widest">
            FORENSIC CHASSIS ARCHIVE • CONCOURS D&apos;ÉLÉGANCE
          </span>
          <span className="uppercase tracking-widest">
            PRIVATE TREATY • WHITE-GLOVE AIR LOGISTICS
          </span>
        </div>
      </section>

      {/* 2. EDITORIAL MARQUEE STRIP */}
      <MarqueeStrip />

      {/* 3. PROVENANCE PROTOCOL (THE FOUR PILLARS) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeading
          numeral="01"
          tag="PROVENANCE PROTOCOL"
          title="An Uncompromised Standard of Stewardship"
          subtitle="We operate beyond traditional automotive brokerages. Every chassis consigned to our salons undergoes exhaustive forensic analysis."
        />

        {/* Editorial Pull Quote */}
        <div className="my-12 py-10 px-8 bg-[#121214] border-l-2 border-[#c5a880] border-y border-r border-[rgba(237,232,223,0.08)]">
          <blockquote className="text-xl sm:text-2xl font-serif italic text-[#ede8df] leading-relaxed max-w-3xl">
            &ldquo;A motorcar of this calibre is never simply bought. It is placed into trusted stewardship, bearing testament to the peak of human engineering.&rdquo;
          </blockquote>
          <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
            — Curatorial Board, Apex Motors Atelier
          </div>
        </div>

        {/* 4 Forensic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/40 transition-colors space-y-4">
            <div className="text-[10px] font-mono text-[#c5a880] tracking-widest uppercase">
              [ PILLAR 01 ]
            </div>
            <h3 className="text-lg font-serif text-[#ede8df]">
              Forensic Telemetry
            </h3>
            <p className="text-xs text-[#a39e93] leading-relaxed font-light">
              Exhaustive ECU interrogation, over-rev recording verification, and micrometer paint depth mapping across every carbon fiber panel.
            </p>
          </div>

          <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/40 transition-colors space-y-4">
            <div className="text-[10px] font-mono text-[#c5a880] tracking-widest uppercase">
              [ PILLAR 02 ]
            </div>
            <h3 className="text-lg font-serif text-[#ede8df]">
              Authenticated Lineage
            </h3>
            <p className="text-xs text-[#a39e93] leading-relaxed font-light">
              Complete historical ledgers from assembly line to present date. Original window stickers, factory certificates, and single-owner titles.
            </p>
          </div>

          <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/40 transition-colors space-y-4">
            <div className="text-[10px] font-mono text-[#c5a880] tracking-widest uppercase">
              [ PILLAR 03 ]
            </div>
            <h3 className="text-lg font-serif text-[#ede8df]">
              Concours Preservation
            </h3>
            <p className="text-xs text-[#a39e93] leading-relaxed font-light">
              Maintained in climate-sealed dehumidified facilities with trickled battery circuits and regular factory master-technician inspections.
            </p>
          </div>

          <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/40 transition-colors space-y-4">
            <div className="text-[10px] font-mono text-[#c5a880] tracking-widest uppercase">
              [ PILLAR 04 ]
            </div>
            <h3 className="text-lg font-serif text-[#ede8df]">
              Enclosed Vault Delivery
            </h3>
            <p className="text-xs text-[#a39e93] leading-relaxed font-light">
              Single-vehicle climate-controlled enclosed transporters or private international air transport directly to your private estate or airport hangar.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CURRENT EXHIBITION LOTS (FEATURED FLEET) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-[rgba(237,232,223,0.08)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            numeral="02"
            tag="EXHIBITION"
            title="Salon Exhibition Lots"
            subtitle="Current certified acquisitions available for immediate private treaty acquisition."
            className="pb-0"
          />

          {/* Minimalist Category Tabs */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  activeCategory === cat
                    ? "border-[#c5a880] bg-[#c5a880] text-[#09090a] font-semibold"
                    : "border-[rgba(237,232,223,0.08)] bg-[#121214] text-[#a39e93] hover:text-[#ede8df] hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCars.map((car, idx) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col justify-between bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/50 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-[#050505] overflow-hidden group">
                  <Image
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 border border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
                    LOT 0{idx + 1}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 border border-emerald-500/30 text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                    {car.status}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
                      {car.year} {car.make}
                    </span>
                    <h3 className="text-xl font-serif text-[#ede8df] tracking-tight mt-0.5">
                      {car.model}
                    </h3>
                    <p className="text-xs text-[#a39e93] font-light line-clamp-2 mt-2 leading-relaxed">
                      {car.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[rgba(237,232,223,0.08)] text-center text-xs">
                    <div>
                      <div className="text-[9px] text-[#a39e93] font-mono uppercase tracking-wider">Power</div>
                      <div className="font-mono text-[#ede8df] text-xs font-semibold mt-0.5">{car.horsepower} HP</div>
                    </div>
                    <div className="border-x border-[rgba(237,232,223,0.08)]">
                      <div className="text-[9px] text-[#a39e93] font-mono uppercase tracking-wider">0–60</div>
                      <div className="font-mono text-[#c5a880] text-xs font-semibold mt-0.5">{car.acceleration}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#a39e93] font-mono uppercase tracking-wider">Odometer</div>
                      <div className="font-mono text-[#ede8df] text-xs font-semibold mt-0.5">{car.mileage.toLocaleString()} mi</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-[#a39e93] font-mono uppercase tracking-widest">Valuation</div>
                  <div className="text-xl font-mono font-bold text-[#c5a880]">
                    ${car.price.toLocaleString()}
                  </div>
                </div>

                <Link
                  href={`/inventory?search=${encodeURIComponent(car.model)}`}
                  className="px-4 py-2 bg-[#18181b] hover:bg-[#c5a880] hover:text-[#09090a] text-[#ede8df] text-[10px] font-mono uppercase tracking-[0.2em] transition-all border border-[rgba(237,232,223,0.08)] flex items-center gap-1.5"
                >
                  <span>Examine</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.15)] hover:border-[#c5a880] text-[#ede8df] font-mono text-xs uppercase tracking-[0.22em] transition-all"
          >
            <span>Explore Complete Catalogue ({INITIAL_CARS.length} Lots)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
          </Link>
        </div>
      </section>

      {/* 5. PRIVATE TREATY & CONSIGNMENT BANNER */}
      <section className="py-24 bg-[#050505] border-t border-[rgba(237,232,223,0.08)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-4">
              <EditorialBadge variant="brass">
                DISCREET CONSIGNMENTS &amp; OFF-MARKET SOURCING
              </EditorialBadge>

              <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#ede8df]">
                Seeking an Unlisted Chassis or Bespoke Allocation?
              </h2>

              <p className="text-sm sm:text-base text-[#a39e93] font-light max-w-2xl leading-relaxed">
                Many of our most celebrated motorcars trade discreetly without ever appearing on public records.
                Our curatorial advisory connects private collectors across Geneva, London, Beverly Hills, and Dubai.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Initiate Private Inquiry</span>
              </Link>

              <a
                href="tel:+18005552739"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#121214] hover:bg-[#18181b] text-[#ede8df] font-mono text-[11px] uppercase tracking-[0.2em] border border-[rgba(237,232,223,0.08)] transition-all"
              >
                <span>Direct Hotline: +1 (800) 555-APEX</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
