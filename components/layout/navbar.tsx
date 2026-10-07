"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Menu, 
  X, 
  Crown, 
  Phone, 
  Calendar,
  Sparkles
} from "lucide-react";
import { SearchDialog } from "@/components/ui/search-dialog";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Showroom", href: "/inventory" },
    { name: "Brand Heritage", href: "/about" },
    { name: "VIP Concierge", href: "/contact" },
    { name: "Admin Portal", href: "/dashboard", badge: "Management" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(237,232,223,0.08)] bg-[#09090a]/92 backdrop-blur-md transition-all">
        {/* Top VIP Hotline Banner */}
        <div className="hidden lg:flex items-center justify-between border-b border-[rgba(237,232,223,0.06)] px-8 py-2 text-[11px] text-[#a39e93] bg-[#050505]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#c5a880] tracking-wider uppercase font-mono text-[10px]">
              <Sparkles className="w-3 h-3 text-[#c5a880]" />
              Private Client Showroom &amp; Bespoke Acquisitions
            </span>
            <span className="text-white/15">|</span>
            <span className="tracking-widest uppercase text-[10px]">Geneva • Mayfair • Beverly Hills • Dubai</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px]">
            <a 
              href="tel:+18005552739" 
              className="flex items-center gap-1.5 hover:text-[#c5a880] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#c5a880]" />
              <span>VIP DESK: +1 (800) 555-APEX</span>
            </a>
            <span className="text-white/15">|</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PRIVATE VIEWINGS AVAILABLE TODAY
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 border border-[#c5a880]/40 flex items-center justify-center bg-[#121214] text-[#c5a880] group-hover:border-[#c5a880] transition-colors">
                <Crown className="w-4 h-4 text-[#c5a880] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif tracking-[0.15em] text-[#ede8df] group-hover:text-[#c5a880] transition-colors uppercase">
                  Apex <span className="font-light italic text-[#c5a880]">Motors</span>
                </span>
                <span className="text-[9px] tracking-[0.3em] text-[#a39e93] uppercase font-mono">
                  Atelier d&apos;Automobile
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] transition-all ${
                      active
                        ? "text-[#c5a880] bg-white/[0.03] border-b border-[#c5a880]"
                        : "text-[#a39e93] hover:text-[#ede8df] hover:bg-white/[0.02]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="ml-2 text-[9px] uppercase px-1.5 py-0.5 border border-[#c5a880]/30 text-[#c5a880] font-mono">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Search and Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Responsive Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-[#121214] hover:bg-[#1a1918] text-[#a39e93] hover:text-[#ede8df] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/40 transition-all text-xs font-mono group"
                aria-label="Search Vehicles"
              >
                <Search className="w-3.5 h-3.5 text-[#c5a880] group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline text-[11px] text-[#a39e93] tracking-wider uppercase">Search Catalogue...</span>
                <span className="hidden sm:inline-block xl:hidden text-[11px] text-[#a39e93]">Search</span>
                <kbd className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 bg-[#09090a] border border-white/10 text-[#a39e93] font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* VIP Viewing CTA */}
              <Link
                href="/contact"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#09090a] bg-[#c5a880] hover:bg-[#d8bf9a] transition-all duration-200"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Viewing</span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#a39e93] hover:text-[#ede8df] hover:bg-white/[0.04] border border-[rgba(237,232,223,0.08)] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[rgba(237,232,223,0.08)] bg-[#09090a] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 text-xs font-mono uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "text-[#c5a880] bg-white/[0.03] border-l-2 border-[#c5a880]"
                        : "text-[#a39e93] hover:text-[#ede8df] hover:bg-white/[0.02]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 border border-[#c5a880]/40 text-[#c5a880]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[rgba(237,232,223,0.08)] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#121214] text-[#ede8df] text-xs font-mono uppercase tracking-wider border border-[rgba(237,232,223,0.08)]"
              >
                <Search className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Search Catalogue</span>
              </button>
              
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#c5a880] text-[#09090a] font-mono text-xs uppercase tracking-[0.2em] font-semibold"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Private Viewing</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
