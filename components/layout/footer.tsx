"use client";

import Link from "next/link";
import { 
  Crown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-[rgba(237,232,223,0.08)] text-[#a39e93]">
      {/* 1px Fine Brass Accent Line */}
      <div className="h-px w-full bg-[#c5a880]/30" />

      {/* Main Dealership Information Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {/* Brand Info & Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 border border-[#c5a880]/40 flex items-center justify-center bg-[#121214] text-[#c5a880]">
                <Crown className="w-4 h-4 text-[#c5a880]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-serif tracking-[0.18em] text-[#ede8df] uppercase">
                  Apex <span className="font-light italic text-[#c5a880]">Motors</span>
                </span>
                <span className="text-[8px] tracking-[0.3em] text-[#a39e93] uppercase font-mono">
                  Atelier d&apos;Automobile
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-[#a39e93] leading-relaxed font-light">
              Curators of the world&apos;s most extraordinary automotive masterpieces. 
              Serving discerning collectors and connoisseurs with uncompromised provenance verification, 
              white-glove delivery, and confidential acquisitions across the globe.
            </p>

            <div className="flex items-center gap-2.5 text-[10px] text-[#c5a880] pt-1 font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Forensic Provenance Certified</span>
            </div>
          </div>

          {/* Dealership Locations & Concierge Contact */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#c5a880] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Global Salons
            </h3>
            
            <div className="space-y-4 text-xs text-[#a39e93]">
              <div className="border-l border-[#c5a880]/40 pl-3">
                <p className="font-medium text-[#ede8df] font-mono text-[11px] uppercase tracking-wider">Beverly Hills Atelier</p>
                <p className="text-[11px] text-[#a39e93] mt-0.5">9600 Wilshire Blvd, Beverly Hills, CA 90212</p>
              </div>
              
              <div className="border-l border-white/10 pl-3">
                <p className="font-medium text-[#ede8df] font-mono text-[11px] uppercase tracking-wider">London Mayfair Suite</p>
                <p className="text-[11px] text-[#a39e93] mt-0.5">14 Berkeley Square, Mayfair, London W1J 6BL</p>
              </div>

              <div className="border-l border-white/10 pl-3">
                <p className="font-medium text-[#ede8df] font-mono text-[11px] uppercase tracking-wider">Geneva Lakefront Salon</p>
                <p className="text-[11px] text-[#a39e93] mt-0.5">Quai du Mont-Blanc 19, 1201 Genève, Switzerland</p>
              </div>
            </div>
          </div>

          {/* Showroom Operating Hours & Direct VIP Contact */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#c5a880] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Private Salons Schedule
            </h3>
            
            <div className="space-y-2.5 text-xs text-[#a39e93] font-mono text-[11px]">
              <div className="flex justify-between border-b border-[rgba(237,232,223,0.06)] pb-1.5">
                <span>Mon – Fri</span>
                <span className="text-[#ede8df]">09:00 — 19:00 PST</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(237,232,223,0.06)] pb-1.5">
                <span>Saturday</span>
                <span className="text-[#ede8df]">10:00 — 18:00 PST</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(237,232,223,0.06)] pb-1.5">
                <span>Sunday</span>
                <span className="text-[#c5a880]">By Private Appointment</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <a 
                href="tel:+18005552739" 
                className="flex items-center gap-2 text-[#ede8df] hover:text-[#c5a880] transition-colors font-mono text-[11px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>+1 (800) 555-APEX</span>
              </a>
              <a 
                href="mailto:concierge@lecurie-concours.com" 
                className="flex items-center gap-2 text-[#ede8df] hover:text-[#c5a880] transition-colors font-mono text-[11px]"
              >
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>concierge@lecurie-concours.com</span>
              </a>
            </div>
          </div>

          {/* Curated Navigation & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#c5a880]">
              The Atelier
            </h3>

            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-[11px]">
              <li>
                <Link href="/inventory" className="hover:text-[#c5a880] transition-colors flex items-center justify-between">
                  <span>Current Catalogue</span>
                  <ArrowUpRight className="w-3 h-3 text-[#c5a880]/50" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#c5a880] transition-colors flex items-center justify-between">
                  <span>Provenance Standards</span>
                  <ArrowUpRight className="w-3 h-3 text-[#c5a880]/50" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c5a880] transition-colors flex items-center justify-between">
                  <span>Private Treaty &amp; Consignment</span>
                  <ArrowUpRight className="w-3 h-3 text-[#c5a880]/50" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#c5a880] transition-colors flex items-center justify-between">
                  <span>Executive Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-[#c5a880]/50" />
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 bg-[#09090a] border border-[rgba(237,232,223,0.08)] space-y-1.5">
                <p className="text-[10px] text-[#ede8df] font-mono uppercase tracking-wider">Private Dispatch</p>
                <p className="text-[10px] text-[#a39e93]">Receive confidential notifications of unlisted acquisitions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal Bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(237,232,223,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#a39e93] font-mono">
          <p>© 2026 L&apos;Écurie Concours Atelier d&apos;Automobile. All rights reserved.</p>
          <div className="flex items-center gap-6 uppercase tracking-wider">
            <Link href="/about" className="hover:text-[#c5a880] transition-colors">Privacy Protocol</Link>
            <Link href="/about" className="hover:text-[#c5a880] transition-colors">Terms of Stewardship</Link>
            <Link href="/sitemap.xml" className="hover:text-[#c5a880] transition-colors">Index</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
