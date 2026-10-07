import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Gauge, 
  Timer, 
  Award, 
  CheckCircle2, 
  Layers, 
  ChevronRight 
} from "lucide-react";

import { 
  getCachedVehicleByVin, 
  getCachedSimilarVehicles, 
  getAllVehicleVins 
} from "@/lib/data/vehicles-service";

import { ImageGallery } from "@/components/inventory/detail/image-gallery";
import { Viewer360 } from "@/components/inventory/detail/viewer-360";
import { SpecsAccordion } from "@/components/inventory/detail/specs-accordion";
import { StickyInquiryCard } from "@/components/inventory/detail/sticky-inquiry-card";
import { SimilarVehicles } from "@/components/inventory/detail/similar-vehicles";
import { VdpHeaderActions } from "@/components/inventory/detail/vdp-header-actions";
import { EditorialBadge } from "@/components/ui/editorial-badge";

interface PageProps {
  params: Promise<{ vin: string }>;
}

// ==========================================
// Dynamic Static Param Generation (SSG)
// ==========================================
export async function generateStaticParams() {
  const vins = await getAllVehicleVins();
  return vins.map((vin) => ({
    vin,
  }));
}

// ==========================================
// Dynamic SEO & OpenGraph Metadata
// ==========================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vin } = await params;
  const vehicle = await getCachedVehicleByVin(vin);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | Apex Motors",
      description: "The requested exotic vehicle could not be located in our atelier collection.",
    };
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""} | Apex Motors`;
  const description = `Acquire this ${vehicle.condition.toUpperCase()} ${vehicle.year} ${vehicle.make} ${vehicle.model} finished in ${vehicle.exteriorColor}. ${vehicle.specs.performance.horsepower} HP, ${vehicle.mileage.toLocaleString()} miles. Available for private viewing at Apex Motors.`;
  const primaryImg =
    vehicle.imageUrls[vehicle.primaryImageIndex || 0] || vehicle.imageUrls[0] || "/placeholder-car.jpg";

  return {
    title,
    description,
    keywords: [
      vehicle.make,
      vehicle.model,
      `${vehicle.year} ${vehicle.make}`,
      "Apex Motors",
      "Exotic Hypercar",
      vehicle.exteriorColor,
      "Luxury Showroom",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: primaryImg,
          width: 1200,
          height: 630,
          alt: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImg],
    },
    alternates: {
      canonical: `/inventory/${vehicle.vin}`,
    },
  };
}

// Helper currency formatter
function formatCurrency(amount: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

// ==========================================
// Main Vehicle Detail Page (Server Component)
// ==========================================
export default async function VehicleDetailPage({ params }: PageProps) {
  const { vin } = await params;
  const vehicle = await getCachedVehicleByVin(vin);

  if (!vehicle) {
    notFound();
  }

  // Retrieve cached similar vehicles
  const similarVehicles = await getCachedSimilarVehicles(vehicle.vin, 3);

  // Format Transmission display label
  const formatTransmission = (t: string) => {
    const map: Record<string, string> = {
      dual_clutch: "Dual-Clutch",
      automatic: "Automatic",
      manual: "Manual",
      cvt: "CVT",
      direct_drive: "Direct-Drive",
    };
    return map[t] || t;
  };

  // Structured Data (JSON-LD) for Schema.org/Car
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""}`.trim(),
    vehicleIdentificationNumber: vehicle.vin,
    manufacturer: {
      "@type": "Organization",
      name: vehicle.make,
    },
    model: vehicle.model,
    productionDate: vehicle.year.toString(),
    vehicleModelDate: vehicle.year.toString(),
    itemCondition:
      vehicle.condition === "new"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    fuelType: vehicle.fuelType,
    vehicleTransmission: formatTransmission(vehicle.transmission),
    driveWheelConfiguration: vehicle.drivetrain.toUpperCase(),
    color: vehicle.exteriorColor,
    vehicleInteriorColor: vehicle.interiorColor,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    image: vehicle.imageUrls,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: vehicle.currency,
      availability:
        vehicle.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `https://apexmotors.com/inventory/${vehicle.vin}`,
      seller: {
        "@type": "AutoDealer",
        name: "Apex Motors Concierge Showroom",
        telephone: "+1-800-555-APEX",
        address: {
          "@type": "PostalAddress",
          streetAddress: "700 Hypercar Boulevard, Suite 100",
          addressLocality: "Beverly Hills",
          addressRegion: "CA",
          postalCode: "90210",
          addressCountry: "US",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#09090a] text-[#ede8df]">
      {/* JSON-LD Schema.org / Car */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-xs text-[#a39e93] font-mono">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              className="hover:text-[#c5a880] transition-colors uppercase tracking-wider text-[11px]"
            >
              Atelier
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <Link
              href="/inventory"
              className="hover:text-[#c5a880] transition-colors uppercase tracking-wider text-[11px]"
            >
              Catalogue
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <Link
              href={`/inventory?makes=${encodeURIComponent(vehicle.make)}`}
              className="hover:text-[#c5a880] transition-colors uppercase tracking-wider text-[11px]"
            >
              {vehicle.make}
            </Link>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-[#ede8df] font-medium truncate max-w-[200px] sm:max-w-xs text-[11px]">
              {vehicle.year} {vehicle.model}
            </span>
          </nav>

          <VdpHeaderActions vehicle={vehicle} />
        </div>

        {/* Vehicle Header & Identity */}
        <header className="mb-10 pb-8 border-b border-[rgba(237,232,223,0.08)]">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {/* Condition Badge */}
            <EditorialBadge variant={vehicle.condition === "certified" ? "brass" : "bone"}>
              {vehicle.condition === "certified"
                ? "Apex Certified Provenance"
                : vehicle.condition === "new"
                ? "New Allocation"
                : "Curated Provenance"}
            </EditorialBadge>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] border ${
                vehicle.status === "available"
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                  : "border-[#c5a880]/30 text-[#c5a880] bg-[#c5a880]/5"
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {vehicle.status === "available" ? "Showroom Ready" : vehicle.status}
            </span>

            {/* VIN Pill */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-mono text-[#a39e93] bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              VIN: {vehicle.vin}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[#c5a880] font-mono uppercase tracking-[0.25em] text-xs">
                {vehicle.year} {vehicle.make}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#ede8df] tracking-tight mt-1 leading-[1.08]">
                {vehicle.model}{" "}
                {vehicle.trim && (
                  <span className="font-light italic text-[#a39e93] text-2xl sm:text-4xl">
                    {vehicle.trim}
                  </span>
                )}
              </h1>
            </div>

            <div className="flex items-baseline gap-3 lg:text-right shrink-0">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#a39e93] block">
                  Atelier Valuation
                </span>
                <span className="text-3xl sm:text-5xl font-mono font-bold text-[#c5a880] tracking-tight">
                  {formatCurrency(vehicle.price, vehicle.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip Blueprint */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-[rgba(237,232,223,0.08)] text-xs font-mono">
            <div className="p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              <span className="text-[#a39e93] block text-[9px] uppercase tracking-wider">
                Odometer
              </span>
              <span className="text-sm font-bold text-[#ede8df] mt-1 block">
                {vehicle.mileage.toLocaleString()} mi
              </span>
            </div>

            <div className="p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              <span className="text-[#a39e93] block text-[9px] uppercase tracking-wider">
                Exterior Livery
              </span>
              <span className="text-xs font-semibold text-[#ede8df] mt-1 block truncate">
                {vehicle.exteriorColor}
              </span>
            </div>

            <div className="p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              <span className="text-[#a39e93] block text-[9px] uppercase tracking-wider">
                Interior Trim
              </span>
              <span className="text-xs font-semibold text-[#ede8df] mt-1 block truncate">
                {vehicle.interiorColor}
              </span>
            </div>

            <div className="p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              <span className="text-[#a39e93] block text-[9px] uppercase tracking-wider">
                Gearbox
              </span>
              <span className="text-xs font-semibold text-[#ede8df] mt-1 block truncate">
                {formatTransmission(vehicle.transmission)}
              </span>
            </div>

            <div className="p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              <span className="text-[#a39e93] block text-[9px] uppercase tracking-wider">
                Drivetrain
              </span>
              <span className="text-xs font-bold text-[#ede8df] mt-1 block uppercase">
                {vehicle.drivetrain}
              </span>
            </div>

            <div className="p-3 bg-[#121214] border border-[rgba(237,232,223,0.08)]">
              <span className="text-[#a39e93] block text-[9px] uppercase tracking-wider">
                Power Output
              </span>
              <span className="text-xs font-bold text-[#c5a880] mt-1 block truncate">
                {vehicle.specs.performance.horsepower} HP
              </span>
            </div>
          </div>
        </header>

        {/* Two-Column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ==========================================
              LEFT COLUMN: Media, 360, Specs, Features
             ========================================== */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            {/* 1. Sticky Image Gallery */}
            <div className="relative">
              <ImageGallery
                imageUrls={vehicle.imageUrls}
                vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                initialIndex={vehicle.primaryImageIndex || 0}
              />
            </div>

            {/* 2. Telemetry Performance Bar */}
            <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#c5a880] text-[10px] font-mono uppercase tracking-[0.25em]">
                <Gauge className="w-3.5 h-3.5" />
                <span>Certified Factory Telemetry Blueprint</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-[#09090a] border border-[rgba(237,232,223,0.06)] font-mono">
                  <div className="flex items-center justify-center gap-1 text-[9px] text-[#a39e93] uppercase tracking-wider mb-1">
                    <Timer className="w-3 h-3 text-[#c5a880]" />
                    <span>0–60 MPH</span>
                  </div>
                  <span className="text-2xl font-bold text-[#ede8df]">
                    {vehicle.specs.performance.zeroToSixtyMph
                      ? `${vehicle.specs.performance.zeroToSixtyMph}s`
                      : "2.8s"}
                  </span>
                </div>

                <div className="text-center p-3 bg-[#09090a] border border-[rgba(237,232,223,0.06)] font-mono">
                  <div className="flex items-center justify-center gap-1 text-[9px] text-[#a39e93] uppercase tracking-wider mb-1">
                    <Zap className="w-3 h-3 text-[#c5a880]" />
                    <span>Power</span>
                  </div>
                  <span className="text-2xl font-bold text-[#c5a880]">
                    {vehicle.specs.performance.horsepower} <span className="text-xs font-normal">HP</span>
                  </span>
                </div>

                <div className="text-center p-3 bg-[#09090a] border border-[rgba(237,232,223,0.06)] font-mono">
                  <div className="flex items-center justify-center gap-1 text-[9px] text-[#a39e93] uppercase tracking-wider mb-1">
                    <Gauge className="w-3 h-3 text-[#c5a880]" />
                    <span>Peak Torque</span>
                  </div>
                  <span className="text-2xl font-bold text-[#ede8df]">
                    {vehicle.specs.performance.torqueFtLbs} <span className="text-xs font-normal">LB-FT</span>
                  </span>
                </div>

                <div className="text-center p-3 bg-[#09090a] border border-[rgba(237,232,223,0.06)] font-mono">
                  <div className="flex items-center justify-center gap-1 text-[9px] text-[#a39e93] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-[#c5a880]" />
                    <span>Top Speed</span>
                  </div>
                  <span className="text-2xl font-bold text-[#ede8df]">
                    {vehicle.specs.performance.topSpeedMph
                      ? `${vehicle.specs.performance.topSpeedMph}`
                      : "211"}{" "}
                    <span className="text-xs font-normal">MPH</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Embedded 360° Interactive Visualizer */}
            <div className="space-y-3">
              <Viewer360
                vehicle={vehicle}
              />
            </div>

            {/* 4. Atelier Curated Overview & Provenance Narrative */}
            <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 sm:p-8 space-y-4">
              <EditorialBadge variant="brass">
                PROVENANCE &amp; CURATED LINEAGE
              </EditorialBadge>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#ede8df] tracking-tight">
                Curatorial Dossier — {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>

              <p className="text-[#a39e93] text-sm leading-relaxed font-light">
                Presented in immaculate condition with verified factory provenance, this{" "}
                <span className="font-semibold text-[#ede8df]">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </span>{" "}
                represents the apex of motorsport sculpture and engineering distinction. Finished in
                an exquisite <span className="text-[#c5a880] font-mono">{vehicle.exteriorColor}</span>{" "}
                livery paired with tailored <span className="text-[#c5a880] font-mono">{vehicle.interiorColor}</span>{" "}
                appointments, each surface has been preserved to Concours d&apos;Élégance standards.
              </p>

              <p className="text-[#a39e93] text-sm leading-relaxed font-light">
                Power is produced by a hand-assembled{" "}
                <span className="text-[#ede8df] font-mono">{vehicle.specs.engine.type}</span>{" "}
                power unit delivering {vehicle.specs.performance.horsepower} horsepower through an
                instantaneous {formatTransmission(vehicle.transmission)} gearbox. Verified by master technicians with 200-point forensic telemetry validation.
              </p>

              {/* Provenance Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[rgba(237,232,223,0.08)] text-xs text-[#ede8df] font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  <span>Single-ownership collector provenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  <span>Clean title &amp; verified historical ledger</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  <span>200-Point master atelier forensic inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                  <span>Climate-vault dehumidified preservation</span>
                </div>
              </div>
            </div>

            {/* 5. Bespoke Equipment & Factory Options */}
            <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880] mb-1">
                    BUILD SPECIFICATION
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#ede8df] tracking-tight">
                    Bespoke Factory Appointments
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#a39e93] px-2.5 py-1 bg-[#09090a] border border-[rgba(237,232,223,0.08)] uppercase tracking-wider">
                  {vehicle.features.length} Items Listed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 bg-[#09090a] border border-[rgba(237,232,223,0.06)] text-xs text-[#ede8df] font-mono"
                  >
                    <span className="w-1.5 h-1.5 bg-[#c5a880] shrink-0"></span>
                    <span className="text-[11px]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Comprehensive Technical Specifications Accordion */}
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880] mb-1">
                  ARCHITECTURAL MATRIX
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#ede8df] tracking-tight">
                  Comprehensive Technical Blueprint
                </h3>
              </div>

              <SpecsAccordion
                vehicle={vehicle}
              />
            </div>
          </div>

          {/* ==========================================
              RIGHT COLUMN: Sticky Inquiry & VIP Booking
             ========================================== */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
            <StickyInquiryCard vehicle={vehicle} />

            {/* Showroom Guarantee Card */}
            <div className="bg-[#121214] border border-[rgba(237,232,223,0.08)] p-5 space-y-3 text-xs text-[#a39e93]">
              <div className="flex items-center gap-2 text-[#ede8df] font-mono text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                <span>The Atelier Privilege</span>
              </div>
              <ul className="space-y-2 list-disc list-inside text-[#a39e93] text-[11px] font-light leading-relaxed">
                <li>Enclosed white-glove transport to your private estate or hangar.</li>
                <li>Comprehensive title exchange and bespoke concierge registration.</li>
                <li>Complimentary 12-month collector roadside and trackside assistance.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ==========================================
            BOTTOM SECTION: Similar Vehicles Recommendation
           ========================================== */}
        <SimilarVehicles vehicles={similarVehicles} />
      </div>
    </div>
  );
}
