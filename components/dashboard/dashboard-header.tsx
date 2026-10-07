"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Car, 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  ChevronDown,
  Inbox
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { UserRole } from "@/types/inventory";

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, setRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: { value: UserRole; label: string; desc: string; icon: typeof ShieldCheck }[] = [
    {
      value: "admin",
      label: "Admin",
      desc: "Full root access, inventory editing, additions & deletions",
      icon: ShieldCheck,
    },
    {
      value: "sales",
      label: "Sales Concierge",
      desc: "Read leads, client appointments, view inventory only",
      icon: UserCheck,
    },
    {
      value: "viewer",
      label: "Showroom Viewer",
      desc: "Read-only access, no inventory modifications",
      icon: Eye,
    },
  ];

  return (
    <div className="bg-[#050505] border-b border-[rgba(237,232,223,0.08)] px-4 sm:px-6 lg:px-8 py-3.5 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Dealership Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] bg-[#121214]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm tracking-wider text-[#ede8df] uppercase">
                  L&apos;Écurie Concours <span className="text-[#c5a880]">Portal</span>
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880]">
                  Executive
                </span>
              </div>
              <p className="text-[10px] text-[#a39e93]">Fleet Logistics &amp; Provenance Console</p>
            </div>
          </div>

          {/* Mobile Role Badge */}
          <div className="md:hidden">
            <span className="text-[9px] font-mono px-2 py-1 bg-[#121214] border border-[rgba(237,232,223,0.12)] text-[#c5a880]">
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Navigation & Role Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-end">
          {/* Nav links */}
          <Link
            href="/dashboard"
            className={`px-3.5 py-1.5 border transition-all flex items-center gap-1.5 text-[11px] uppercase tracking-wider ${
              pathname === "/dashboard"
                ? "bg-[#c5a880]/15 border-[#c5a880]/40 text-[#c5a880]"
                : "bg-[#121214] border-[rgba(237,232,223,0.08)] hover:border-white/20 text-[#a39e93]"
            }`}
          >
            <LayoutDashboard className="w-3 h-3 text-[#c5a880]" />
            <span>Overview</span>
          </Link>

          <Link
            href="/dashboard/inventory"
            className={`px-3.5 py-1.5 border transition-all flex items-center gap-1.5 text-[11px] uppercase tracking-wider ${
              pathname === "/dashboard/inventory"
                ? "bg-[#c5a880]/15 border-[#c5a880]/40 text-[#c5a880]"
                : "bg-[#121214] border-[rgba(237,232,223,0.08)] hover:border-white/20 text-[#a39e93]"
            }`}
          >
            <Car className="w-3 h-3 text-[#c5a880]" />
            <span>Inventory Fleet</span>
            {user.role !== "admin" && (
              <span className="w-1.5 h-1.5 bg-rose-500" title="Protected Route" />
            )}
          </Link>

          <Link
            href="/dashboard/leads"
            className={`px-3.5 py-1.5 border transition-all flex items-center gap-1.5 text-[11px] uppercase tracking-wider ${
              pathname === "/dashboard/leads"
                ? "bg-[#c5a880]/15 border-[#c5a880]/40 text-[#c5a880]"
                : "bg-[#121214] border-[rgba(237,232,223,0.08)] hover:border-white/20 text-[#a39e93]"
            }`}
          >
            <Inbox className="w-3 h-3 text-[#c5a880]" />
            <span>VIP Inquiries</span>
          </Link>

          {/* Interactive RBAC Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-3 py-1.5 bg-[#121214] border border-[rgba(237,232,223,0.12)] hover:border-[#c5a880]/40 text-[#ede8df] transition-all flex items-center gap-2 text-[11px] uppercase tracking-wider"
              title="Switch user role to test permissions"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#a39e93]">Role:</span>
                <span
                  className={`font-bold capitalize ${
                    user.role === "admin"
                      ? "text-[#c5a880]"
                      : user.role === "sales"
                      ? "text-sky-400"
                      : "text-[#a39e93]"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#a39e93] transition-transform" />
            </button>

            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#09090a] border border-[rgba(237,232,223,0.15)] shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[9px] uppercase font-bold text-[#a39e93] tracking-widest border-b border-white/10 mb-1">
                    Select Role (RBAC Simulation)
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isActive = user.role === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => {
                          setRole(r.value);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 transition-all flex items-start gap-2.5 ${
                          isActive
                            ? "bg-[#c5a880]/15 border border-[#c5a880]/30 text-white"
                            : "hover:bg-[#121214] text-[#a39e93]"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isActive ? "text-[#c5a880]" : "text-[#a39e93]"
                          }`}
                        />
                        <div>
                          <div className="text-[11px] font-semibold flex items-center gap-1.5 uppercase">
                            <span>{r.label}</span>
                            {isActive && (
                              <span className="text-[8px] px-1 py-0.2 bg-[#c5a880]/20 text-[#c5a880]">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#a39e93] leading-tight mt-0.5">
                            {r.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Link back to public showroom */}
          <Link
            href="/"
            className="px-3 py-1.5 bg-[#121214] hover:bg-[#18181b] text-[#ede8df] border border-[rgba(237,232,223,0.08)] transition-colors flex items-center gap-1.5 text-[11px] uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Showroom</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
