import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apexmotors.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/inventory", "/about", "/contact"],
        disallow: ["/dashboard", "/dashboard/*", "/api/*"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/inventory/*", "/placeholder-car.jpg"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
