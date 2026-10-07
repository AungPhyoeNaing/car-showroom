import { describe, it, expect } from "vitest";
import { filterAndSortVehicles } from "@/lib/data/vehicles-service";
import { MOCK_VEHICLES } from "@/lib/data/mock-vehicles";

describe("filterAndSortVehicles Unit Tests", () => {
  it("should return all vehicles with default pagination when no filters are applied", () => {
    const result = filterAndSortVehicles({ page: 1, pageSize: 20 });
    expect(result.data.length).toBe(MOCK_VEHICLES.length);
    expect(result.totalCount).toBe(MOCK_VEHICLES.length);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(false);
  });

  it("should paginate correctly with smaller pageSize", () => {
    const pageSize = 4;
    const resultPage1 = filterAndSortVehicles({ page: 1, pageSize });
    expect(resultPage1.data.length).toBe(pageSize);
    expect(resultPage1.page).toBe(1);
    expect(resultPage1.hasMore).toBe(true);
    expect(resultPage1.totalPages).toBe(Math.ceil(MOCK_VEHICLES.length / pageSize));

    const resultPage2 = filterAndSortVehicles({ page: 2, pageSize });
    expect(resultPage2.data.length).toBe(pageSize);
    expect(resultPage2.page).toBe(2);
    // Ensure distinct items on page 2
    expect(resultPage2.data[0].id).not.toBe(resultPage1.data[0].id);
  });

  it("should filter by search query matching make, model, or VIN", () => {
    // Search by Make
    const ferrariSearch = filterAndSortVehicles({ search: "Ferrari" });
    expect(ferrariSearch.data.length).toBeGreaterThan(0);
    ferrariSearch.data.forEach((v) => {
      expect(
        v.make.toLowerCase().includes("ferrari") ||
        v.model.toLowerCase().includes("ferrari") ||
        v.vin.toLowerCase().includes("ferrari")
      ).toBe(true);
    });

    // Search by partial VIN
    const sampleVin = MOCK_VEHICLES[0].vin.slice(-5);
    const vinSearch = filterAndSortVehicles({ search: sampleVin });
    expect(vinSearch.data.length).toBeGreaterThan(0);
    expect(vinSearch.data.some((v) => v.vin.includes(sampleVin))).toBe(true);
  });

  it("should filter by comma-separated makes (multi-select)", () => {
    const result = filterAndSortVehicles({ makes: "Ferrari,Porsche" });
    expect(result.data.length).toBeGreaterThan(0);
    result.data.forEach((v) => {
      expect(["Ferrari", "Porsche"]).toContain(v.make);
    });
  });

  it("should filter by fuelType", () => {
    const hybridResult = filterAndSortVehicles({ fuelType: "hybrid" });
    hybridResult.data.forEach((v) => {
      expect(["hybrid", "plug_in_hybrid"]).toContain(v.fuelType);
    });

    const electricResult = filterAndSortVehicles({ fuelType: "electric" });
    electricResult.data.forEach((v) => {
      expect(v.fuelType).toBe("electric");
    });
  });

  it("should filter by condition tier", () => {
    const certifiedResult = filterAndSortVehicles({ condition: "certified" });
    certifiedResult.data.forEach((v) => {
      expect(v.condition).toBe("certified");
    });
  });

  it("should filter by maximum price ceiling", () => {
    const maxPrice = 500000;
    const result = filterAndSortVehicles({ maxPrice, pageSize: 50 });
    expect(result.data.length).toBeGreaterThan(0);
    result.data.forEach((v) => {
      expect(v.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  it("should filter by minimum production year", () => {
    const minYear = 2024;
    const result = filterAndSortVehicles({ minYear, pageSize: 50 });
    expect(result.data.length).toBeGreaterThan(0);
    result.data.forEach((v) => {
      expect(v.year).toBeGreaterThanOrEqual(minYear);
    });
  });

  it("should sort correctly by price ascending and descending", () => {
    const ascResult = filterAndSortVehicles({ sortBy: "price_asc", pageSize: 50 });
    for (let i = 0; i < ascResult.data.length - 1; i++) {
      expect(ascResult.data[i].price).toBeLessThanOrEqual(ascResult.data[i + 1].price);
    }

    const descResult = filterAndSortVehicles({ sortBy: "price_desc", pageSize: 50 });
    for (let i = 0; i < descResult.data.length - 1; i++) {
      expect(descResult.data[i].price).toBeGreaterThanOrEqual(descResult.data[i + 1].price);
    }
  });

  it("should sort correctly by mileage ascending", () => {
    const mileageResult = filterAndSortVehicles({ sortBy: "mileage_asc", pageSize: 50 });
    for (let i = 0; i < mileageResult.data.length - 1; i++) {
      expect(mileageResult.data[i].mileage).toBeLessThanOrEqual(mileageResult.data[i + 1].mileage);
    }
  });

  it("should sort correctly by year descending", () => {
    const yearResult = filterAndSortVehicles({ sortBy: "year_desc", pageSize: 50 });
    for (let i = 0; i < yearResult.data.length - 1; i++) {
      expect(yearResult.data[i].year).toBeGreaterThanOrEqual(yearResult.data[i + 1].year);
    }
  });

  it("should return empty array and 0 count when no vehicles match criteria", () => {
    const result = filterAndSortVehicles({ search: "NonExistentModelX999Z" });
    expect(result.data.length).toBe(0);
    expect(result.totalCount).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.hasMore).toBe(false);
  });
});
