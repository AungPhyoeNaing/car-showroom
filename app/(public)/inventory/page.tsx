import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { filterAndSortVehicles } from "@/lib/data/vehicles-service";
import { FilterSidebar } from "@/components/inventory/filter-sidebar";
import { ActiveFilters } from "@/components/inventory/active-filters";
import { SortDropdown } from "@/components/inventory/sort-dropdown";
import { InfiniteVehicleFeed } from "@/components/inventory/infinite-vehicle-feed";
import { MobileFilterDrawer } from "@/components/inventory/mobile-filter-drawer";
import { VehicleCardSkeleton } from "@/components/inventory/vehicle-card";
import { EditorialBadge } from "@/components/ui/editorial-badge";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ==========================================
// Dynamic SEO Metadata Generation
// ==========================================
export const metadata: Metadata = {
  title: "Exotic & Luxury Vehicle Portfolio | Apex Motors",
  description:
    "Browse our authenticated private inventory of hypercars, supercars, and bespoke grand tourers. Featuring Ferrari, Porsche, Rolls-Royce, Lamborghini, and Bugatti with white-glove delivery.",
  keywords: [
    "Luxury Cars",
    "Exotic Cars For Sale",
    "Hypercars",
    "Ferrari",
    "Porsche GT3 RS",
    "Rolls-Royce Spectre",
    "Apex Motors",
  ],
  openGraph: {
    title: "Exotic & Luxury Vehicle Portfolio | Apex Motors",
    description: "Curated collection of hypercars and luxury grand tourers with certified provenance.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Apex Motors Exotic Showroom Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exotic & Luxury Vehicle Portfolio | Apex Motors",
    description: "Curated collection of hypercars and luxury grand tourers with certified provenance.",
  },
  alternates: {
    canonical: "/inventory",
  },
};

// ==========================================
// Fallback Skeleton for Streaming Suspense
// ==========================================
function InventoryLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-14 bg-[#121214] border border-[rgba(237,232,223,0.08)]" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Async Server Component: SearchParams Dependent Section
// ==========================================
async function InventoryResultsSection({ searchParams }: PageProps) {
  const rawParams = await searchParams;

  const search = typeof rawParams.search === "string" ? rawParams.search : undefined;
  const makes = typeof rawParams.makes === "string" ? rawParams.makes : undefined;
  const fuelType = typeof rawParams.fuelType === "string" ? rawParams.fuelType : undefined;
  const condition = typeof rawParams.condition === "string" ? rawParams.condition : undefined;
  const status = typeof rawParams.status === "string" ? rawParams.status : undefined;
  const sortBy = typeof rawParams.sortBy === "string" ? rawParams.sortBy : "featured";
  const maxPrice = rawParams.maxPrice ? Number(rawParams.maxPrice) : undefined;
  const minYear = rawParams.minYear ? Number(rawParams.minYear) : undefined;

  // Build sanitized query string for client synchronization
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (makes) query.set("makes", makes);
  if (fuelType) query.set("fuelType", fuelType);
  if (condition) query.set("condition", condition);
  if (status) query.set("status", status);
  if (sortBy) query.set("sortBy", sortBy);
  if (maxPrice) query.set("maxPrice", maxPrice.toString());
  if (minYear) query.set("minYear", minYear.toString());
  const queryString = query.toString();

  // Perform server-side filtering for initial render & SEO
  const initialResult = filterAndSortVehicles({
    search,
    makes,
    fuelType,
    condition,
    status,
    sortBy,
    maxPrice,
    minYear,
    page: 1,
    pageSize: 6,
  });

  // Generate JSON-LD Schema.org ItemList for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialResult.data.map((car, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Car",
        name: `${car.year} ${car.make} ${car.model}`,
        manufacturer: car.make,
        model: car.model,
        vehicleIdentificationNumber: car.vin,
        productionDate: car.year.toString(),
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: car.mileage,
          unitCode: "SMI",
        },
        offers: {
          "@type": "Offer",
          price: car.price,
          priceCurrency: car.currency,
          availability:
            car.status === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        },
        image: car.imageUrls[0],
      },
    })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-5">
        {/* Top Toolbar: Results Count, Mobile Filter Trigger, and Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121214] border border-[rgba(237,232,223,0.08)] p-4 shadow-xl">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <span className="text-xs text-[#a39e93] font-mono tracking-wide">
              Showing <strong className="text-[#ede8df]">{initialResult.totalCount}</strong> authenticated exhibits
            </span>
            <Suspense fallback={null}>
              <MobileFilterDrawer />
            </Suspense>
          </div>

          {/* Sort By Dropdown */}
          <Suspense fallback={<div className="w-40 h-8 bg-[#18181b] animate-pulse" />}>
            <SortDropdown />
          </Suspense>
        </div>

        {/* Active Filters Bar (Client-Side Dismissable Chips) */}
        <Suspense fallback={null}>
          <ActiveFilters />
        </Suspense>

        {/* Infinite Scroll Vehicle Feed (Hydrated with Initial Server-Rendered Result) */}
        <InfiniteVehicleFeed
          initialResult={initialResult}
          queryString={queryString}
        />
      </div>
    </>
  );
}

// ==========================================
// Main Server Component: /inventory Page
// ==========================================
export default function InventoryPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-[#09090a] text-[#ede8df] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Static Header Section (Prerendered for instant LCP) */}
      <header className="border-b border-[rgba(237,232,223,0.08)] pb-8 space-y-3">
        <div className="flex items-center gap-3">
          <EditorialBadge variant="brass">
            CATALOGUE CURATION • SALON ACTIF
          </EditorialBadge>
          <span className="text-[10px] font-mono tracking-widest text-[#a39e93] uppercase">
            FORENSIC ARCHIVE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#ede8df] tracking-tight">
          Curated Exhibition Catalogue
        </h1>

        <p className="text-xs sm:text-sm text-[#a39e93] font-light max-w-2xl leading-relaxed">
          The verified registry of hypercars, motorsport icons, and bespoke grand tourers.
          Filtered and authenticated in real time with comprehensive forensic dossiers.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar (Sticky) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28">
          <Suspense fallback={<div className="h-96 bg-[#121214] border border-[rgba(237,232,223,0.08)] animate-pulse" />}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Results Feed Column (Wrapped in Suspense for Next.js 16 Partial Prefetching) */}
        <div className="lg:col-span-8 xl:col-span-9">
          <Suspense fallback={<InventoryLoadingSkeleton />}>
            <InventoryResultsSection searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
