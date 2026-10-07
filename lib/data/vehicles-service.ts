import { MOCK_VEHICLES } from "./mock-vehicles";
import { Vehicle } from "@/types/inventory";

export interface VehicleQueryOptions {
  search?: string;
  makes?: string[] | string;
  maxPrice?: number;
  minYear?: number;
  fuelType?: string;
  condition?: string;
  status?: string;
  sortBy?: "price_asc" | "price_desc" | "year_desc" | "mileage_asc" | "featured" | string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedVehiclesResult {
  data: Vehicle[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export function filterAndSortVehicles(
  options: VehicleQueryOptions = {},
  dataset: Vehicle[] = MOCK_VEHICLES
): PaginatedVehiclesResult {
  const {
    search,
    makes,
    maxPrice,
    minYear,
    fuelType,
    condition,
    status,
    sortBy = "featured",
    page = 1,
    pageSize = 6,
  } = options;

  let results = [...dataset];

  // 1. Text Search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter((v) => {
      const makeModel = `${v.make} ${v.model}`.toLowerCase();
      const vin = v.vin.toLowerCase();
      const engine = v.specs?.engine?.type?.toLowerCase() || "";
      const trim = v.trim?.toLowerCase() || "";
      return (
        makeModel.includes(q) ||
        vin.includes(q) ||
        engine.includes(q) ||
        trim.includes(q) ||
        v.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }

  // 2. Multi-Select Makes Filter
  if (makes) {
    const makeList = Array.isArray(makes)
      ? makes.map((m) => m.trim().toLowerCase()).filter(Boolean)
      : makes
          .split(",")
          .map((m) => m.trim().toLowerCase())
          .filter(Boolean);

    if (makeList.length > 0 && !makeList.includes("all")) {
      results = results.filter((v) => makeList.includes(v.make.toLowerCase()));
    }
  }

  // 3. Max Price Filter
  if (typeof maxPrice === "number" && !isNaN(maxPrice)) {
    results = results.filter((v) => v.price <= maxPrice);
  }

  // 4. Min Model Year Filter
  if (typeof minYear === "number" && !isNaN(minYear)) {
    results = results.filter((v) => v.year >= minYear);
  }

  // 5. Powertrain / Fuel Type Filter
  if (fuelType && fuelType !== "all") {
    results = results.filter((v) => v.fuelType.toLowerCase() === fuelType.toLowerCase());
  }

  // 6. Condition Filter
  if (condition && condition !== "all") {
    results = results.filter((v) => v.condition.toLowerCase() === condition.toLowerCase());
  }

  // 7. Status Filter
  if (status && status !== "all") {
    results = results.filter((v) => v.status === status);
  }

  // 8. Sorting
  switch (sortBy) {
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "year_desc":
      results.sort((a, b) => b.year - a.year);
      break;
    case "mileage_asc":
      results.sort((a, b) => a.mileage - b.mileage);
      break;
    case "featured":
    default:
      // Preserves curated order or sorts by highest horsepower / prestige
      results.sort((a, b) => (b.specs?.performance?.horsepower || 0) - (a.specs?.performance?.horsepower || 0));
      break;
  }

  // 9. Pagination
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = results.slice(startIndex, startIndex + pageSize);

  return {
    data: pagedData,
    page: currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasMore: currentPage < totalPages,
  };
}

/**
 * Generates an SVG Shimmer blurDataURL for Next.js <Image placeholder="blur" />
 * Produces an ultra-lightweight dark luxury placeholder preventing layout shifts.
 */
export function getLuxuryShimmerPlaceholder(w: number = 700, h: number = 475): string {
  const shimmerSvg = `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#0f172a" offset="20%" />
          <stop stop-color="#1e293b" offset="50%" />
          <stop stop-color="#0f172a" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#0f172a" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.4s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`;
}

import { unstable_cache } from "next/cache";

/**
 * Cached server function to fetch vehicle by VIN with revalidation tags
 */
export const getCachedVehicleByVin = async (vin: string): Promise<Vehicle | null> => {
  return unstable_cache(
    async () => {
      const clean = vin.trim().toLowerCase();
      const found = MOCK_VEHICLES.find(
        (v) => v.vin.toLowerCase() === clean || v.id.toLowerCase() === clean
      );
      return found || null;
    },
    [`vehicle-${vin}`],
    {
      tags: ["vehicles", `vehicle-${vin}`],
      revalidate: 3600,
    }
  )();
};

/**
 * Cached server function to retrieve similar vehicles based on make and price
 */
export const getCachedSimilarVehicles = async (
  currentVin: string,
  limit: number = 3
): Promise<Vehicle[]> => {
  return unstable_cache(
    async () => {
      const cleanVin = currentVin.trim().toLowerCase();
      const current = MOCK_VEHICLES.find(
        (v) => v.vin.toLowerCase() === cleanVin || v.id.toLowerCase() === cleanVin
      );
      if (!current) return MOCK_VEHICLES.slice(0, limit);

      return MOCK_VEHICLES
        .filter((v) => v.vin.toLowerCase() !== current.vin.toLowerCase())
        .sort((a, b) => {
          if (a.make === current.make && b.make !== current.make) return -1;
          if (b.make === current.make && a.make !== current.make) return 1;
          return Math.abs(a.price - current.price) - Math.abs(b.price - current.price);
        })
        .slice(0, limit);
    },
    [`similar-${currentVin}-${limit}`],
    {
      tags: ["vehicles"],
      revalidate: 3600,
    }
  )();
};

/**
 * Get all vehicle VINs for SSG generateStaticParams
 */
export async function getAllVehicleVins(): Promise<string[]> {
  return MOCK_VEHICLES.map((v) => v.vin);
}
