"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Car, 
  Search, 
  Calendar, 
  LayoutDashboard 
} from "lucide-react";
import { SearchDialog } from "@/components/ui/search-dialog";

export function BottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090a]/95 backdrop-blur-md border-t border-[rgba(237,232,223,0.08)] px-3 py-2"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 ${
              isActive("/") 
                ? "text-[#c5a880] font-semibold" 
                : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <div className={`p-1 ${isActive("/") ? "text-[#c5a880]" : ""}`}>
              <Home className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">Atelier</span>
          </Link>

          {/* Showroom */}
          <Link
            href="/inventory"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 ${
              isActive("/inventory") 
                ? "text-[#c5a880] font-semibold" 
                : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <div className={`p-1 ${isActive("/inventory") ? "text-[#c5a880]" : ""}`}>
              <Car className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">Lots</span>
          </Link>

          {/* Center Search Action Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center -mt-4 group"
            aria-label="Search Catalogue"
          >
            <div className="w-10 h-10 bg-[#c5a880] flex items-center justify-center text-[#09090a] border border-[#d8bf9a] group-active:scale-95 transition-transform shadow-lg shadow-black/60">
              <Search className="w-4 h-4 font-bold" />
            </div>
            <span className="text-[9px] text-[#c5a880] font-mono uppercase tracking-widest mt-1">Search</span>
          </button>

          {/* Concierge / Booking */}
          <Link
            href="/contact"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 ${
              isActive("/contact") 
                ? "text-[#c5a880] font-semibold" 
                : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <div className={`p-1 ${isActive("/contact") ? "text-[#c5a880]" : ""}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">Salon</span>
          </Link>

          {/* Admin Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 ${
              isActive("/dashboard") 
                ? "text-[#c5a880] font-semibold" 
                : "text-[#a39e93] hover:text-[#ede8df]"
            }`}
          >
            <div className={`p-1 ${isActive("/dashboard") ? "text-[#c5a880]" : ""}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">Portal</span>
          </Link>
        </div>
      </nav>

      {/* Global Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
