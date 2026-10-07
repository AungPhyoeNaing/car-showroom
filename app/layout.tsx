import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { QueryProvider } from "@/components/providers/query-provider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Apex Motors | Bespoke Automotive Atelier & Exotic Showroom",
    template: "%s | Apex Motors Atelier",
  },
  description: "Curators of premier exotic hypercars, supercars, and ultra-luxury grand tourers. Exclusive private showroom and white-glove acquisitions.",
  keywords: ["Luxury Cars", "Hypercars", "Ferrari", "Porsche", "Rolls-Royce", "Exotic Car Dealership", "Apex Motors"],
  authors: [{ name: "Apex Motors Automotive Atelier" }],
};

export const viewport: Viewport = {
  themeColor: "#09090a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Core Web Vitals Image CDN Preconnect */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#09090A] text-[#EDE8DF] selection:bg-[#C5A880] selection:text-[#09090A] font-sans">
        <QueryProvider>
          {/* Responsive Desktop & Mobile Top Navbar with Search */}
          <Navbar />

          {/* Main Viewport Content (with bottom padding for mobile navigation bar) */}
          <main className="flex-1 w-full pb-20 md:pb-0">
            {children}
          </main>

          {/* Dealership Information Footer */}
          <Footer />

          {/* Mobile-First Bottom Navigation Bar */}
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
