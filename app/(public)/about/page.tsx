import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Award, 
  Compass, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";
import { EditorialBadge } from "@/components/ui/editorial-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { MarqueeStrip } from "@/components/ui/marquee-strip";

export const metadata = {
  title: "Brand Heritage & Curatorial Atelier | L'Écurie Concours",
  description: "Explore the provenance, curatorial philosophy, and global private salons of L'Écurie Concours.",
};

const CURATORS = [
  {
    name: "Henri de Valois",
    role: "Chief Curatorial Officer & Archivist",
    background: "Former Head of Historical Collections at Pebble Beach Concours d'Elegance. 24 years curating pre-war and post-war homologation icons.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    badge: "Concours Juror",
  },
  {
    name: "Dr. Evelyn Vance",
    role: "Director of Mechanical Forensics",
    background: "Doctorate in Aerospace Metallurgy (ETH Zürich). Oversees dyno verification, non-destructive alloy stress tests, and chassis authenticity certification.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    badge: "FIA Inspector",
  },
  {
    name: "Matteo Casiraghi",
    role: "Private Treaty & Acquisitions Principal",
    background: "Monaco native facilitating closed-door off-market transfers for prominent single-marque collectors and sovereign family offices.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    badge: "Private Treaty",
  },
];

const PROTOCOLS = [
  {
    step: "01",
    title: "Chassis & Engine Stamp Verification",
    desc: "Direct physical inspection matching factory production books in Maranello, Stuttgart, Sant'Agata, and Gaydon to verify matching numbers.",
  },
  {
    step: "02",
    title: "Spectrometric Paint & Carbon Analysis",
    desc: "Digital ultrasonic micron depth mapping to identify unrecorded re-sprays, localized carbon weave repair, or body panel replacements.",
  },
  {
    step: "03",
    title: "Telemetry & Dyno Benchmarking",
    desc: "Full powertrain load testing verifying factory compression tolerances, torque delivery curve, and electronic control unit firmware integrity.",
  },
  {
    step: "04",
    title: "Custodial Provenance Ledger",
    desc: "Comprehensive title genealogy detailing every private owner, service atelier stamp, FIA passport entry, and international shipping manifest.",
  },
];

const SALONS = [
  {
    city: "Beverly Hills",
    country: "United States",
    address: "9600 Wilshire Boulevard, Suite 800",
    details: "Subterranean climate-controlled display vault featuring hermetic nitrogen preservation capsules for museum-grade specimens.",
    phone: "+1 (310) 555-0192",
    tag: "Americas Flagship",
  },
  {
    city: "Mayfair, London",
    country: "United Kingdom",
    address: "14 Berkeley Square, London W1J 5AW",
    details: "European private client suite specializing in bespoke homologation racers, Group B icons, and pre-war grand tourers.",
    phone: "+44 20 7946 0912",
    tag: "European Atelier",
  },
  {
    city: "Monaco Waterfront",
    country: "Principality of Monaco",
    address: "Quai Antoine 1er, Port Hercule",
    details: "Deep-water maritime reception facility with direct superyacht tender loading, bonded freeport transit, and helicopter landing pad.",
    phone: "+377 98 98 01 44",
    tag: "Maritime Terminal",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090a] text-[#ede8df] selection:bg-[#c5a880] selection:text-[#09090a]">
      {/* Editorial Ticker */}
      <MarqueeStrip />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-28">
        
        {/* Heritage Header */}
        <section className="space-y-8 max-w-4xl">
          <EditorialBadge variant="brass">
            CHRONICLES OF PROVENANCE • EST. 2012
          </EditorialBadge>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#ede8df] leading-[1.05]">
            Curating automotive monuments with forensic <span className="italic text-[#c5a880]">purity</span> and provenance.
          </h1>
          <p className="font-serif text-lg sm:text-xl text-[#a39e93] leading-relaxed max-w-3xl">
            L&apos;Écurie Concours was founded upon a singular imperative: to eliminate the compromises, 
            ambiguities, and commercial noise of traditional automobile transactions. We treat every motorcar 
            not as transactional inventory, but as an irreplaceable chapter in mechanical civilization.
          </p>
        </section>

        {/* Feature Split Narrative */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative h-[420px] sm:h-[540px] border border-[rgba(237,232,223,0.12)] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
              alt="L'Écurie Concours Private Vault"
              fill
              priority
              className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090a] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-6 bg-[#09090a]/90 backdrop-blur-md border border-[rgba(237,232,223,0.15)] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#c5a880] tracking-widest uppercase block">
                  Vault No. 04 • Subterranean Display
                </span>
                <span className="font-serif text-base text-[#ede8df]">
                  Beverly Hills Climate-Controlled Reserve
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#a39e93] border border-white/10 px-2 py-1">
                68°F / 45% RH
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#c5a880] block">
                [ THE DOCTRINE ]
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#ede8df] font-normal leading-tight">
                Mathematical rigor applied to rolling sculpture.
              </h2>
            </div>

            <p className="text-sm text-[#a39e93] leading-relaxed">
              Founded by endurance racing veterans and generational archivists, L&apos;Écurie Concours operates 
              at the intersection of historical scholarship and ultra-high-net-worth custodial care. 
              Our clients do not merely purchase machinery—they become custodians of verified heritage.
            </p>

            <p className="text-sm text-[#a39e93] leading-relaxed">
              Every specimen accepted into our permanent collection undergoes physical teardown analysis, 
              metallurgical spectroscopy, and exhaustive cross-referencing against manufacturer build books. 
              Less than four percent of vehicles submitted meet our threshold for acquisition.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[rgba(237,232,223,0.08)] font-mono">
              <div className="p-4 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
                <div className="text-2xl sm:text-3xl font-normal text-[#c5a880]">$140M+</div>
                <div className="text-[10px] text-[#a39e93] uppercase tracking-wider mt-1">
                  Private Transfers
                </div>
              </div>
              <div className="p-4 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
                <div className="text-2xl sm:text-3xl font-normal text-[#ede8df]">100%</div>
                <div className="text-[10px] text-[#a39e93] uppercase tracking-wider mt-1">
                  Title &amp; Custody Audit
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forensic Curation Protocol */}
        <section className="space-y-12">
          <SectionHeading
            numeral="01"
            tag="INSPECTION STANDARDS"
            title="The 100-Point Forensic Pipeline"
            subtitle="Our verification methodology exceeds international FIA Historic Vehicle standards, guaranteeing ironclad legitimacy."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROTOCOLS.map((item) => (
              <div
                key={item.step}
                className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/40 transition-colors space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-[rgba(237,232,223,0.06)] pb-3">
                  <span className="font-mono text-sm text-[#c5a880] tracking-wider">
                    [ PHASE {item.step} ]
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#c5a880]/60 group-hover:text-[#c5a880] transition-colors" />
                </div>
                <h3 className="font-serif text-lg text-[#ede8df] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#a39e93] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Curatorial Board */}
        <section className="space-y-12">
          <SectionHeading
            numeral="02"
            tag="CURATORIAL DESK"
            title="Archivists & Technical Principals"
            subtitle="Preserving authenticity through decades of motorsport engineering and historic provenance research."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CURATORS.map((curator) => (
              <div 
                key={curator.name}
                className="bg-[#121214] border border-[rgba(237,232,223,0.08)] overflow-hidden group hover:border-[#c5a880]/50 transition-colors"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={curator.image}
                    alt={curator.name}
                    fill
                    className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#09090a]/90 border border-[#c5a880]/40 text-[#c5a880]">
                    {curator.badge}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl text-[#ede8df]">
                    {curator.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[#c5a880] uppercase tracking-wider">
                    {curator.role}
                  </p>
                  <p className="text-xs text-[#a39e93] leading-relaxed pt-2 border-t border-[rgba(237,232,223,0.06)]">
                    {curator.background}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Ateliers & Vaults */}
        <section className="space-y-12">
          <SectionHeading
            numeral="03"
            tag="GLOBAL FOOTPRINT"
            title="Private Salons & Maritime Terminals"
            subtitle="Confidential viewings hosted across three continents in hermetically controlled architectural sanctuaries."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SALONS.map((salon) => (
              <div
                key={salon.city}
                className="p-8 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-6 hover:border-[rgba(237,232,223,0.2)] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#c5a880] uppercase tracking-widest">
                      {salon.tag}
                    </span>
                    <MapPin className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#ede8df]">
                      {salon.city}
                    </h3>
                    <p className="font-mono text-xs text-[#a39e93] mt-0.5">
                      {salon.address}
                    </p>
                  </div>
                  <p className="text-xs text-[#a39e93] leading-relaxed pt-3 border-t border-[rgba(237,232,223,0.06)]">
                    {salon.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(237,232,223,0.08)] flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#a39e93]">{salon.phone}</span>
                  <Link
                    href={`/contact?salon=${encodeURIComponent(salon.city)}`}
                    className="text-[#c5a880] hover:text-[#ede8df] inline-flex items-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Private Treaty Invitation CTA Banner */}
        <section className="p-8 sm:p-14 bg-[#121214] border border-[rgba(237,232,223,0.12)] relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="font-mono text-[10px] text-[#c5a880] uppercase tracking-widest block">
              [ PRIVATE COMMISSION &amp; CONSORTIUM ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#ede8df] leading-tight">
              Seeking an unlisted vehicle or commissioning a private de-accession?
            </h2>
            <p className="text-sm text-[#a39e93] leading-relaxed">
              Our confidential brokerage desk handles off-market transfers for landmark racing machines, 
              concept prototypes, and blue-chip collector portfolios worldwide.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <span>Initiate Confidential Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/inventory"
                className="px-6 py-3 bg-transparent border border-[rgba(237,232,223,0.15)] hover:border-[#c5a880] text-[#ede8df] font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <span>Examine Current Catalogue</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
