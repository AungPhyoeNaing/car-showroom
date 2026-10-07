import type { MetadataRoute } from "next";
import { MOCK_VEHICLES } from "@/lib/data/mock-vehicles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apexmotors.com";

  // Static Marketing & Discovery Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic Vehicle Detail Pages (VDP)
  const vehicleRoutes: MetadataRoute.Sitemap = MOCK_VEHICLES.map((car) => ({
    url: `${baseUrl}/inventory/${car.vin}`,
    lastModified: car.updatedAt || new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
