"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowLeft, 
  PlusCircle, 
  Lock, 
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Vehicle } from "@/types/inventory";
import { InventoryTable } from "@/components/dashboard/inventory/inventory-table";
import { AddVehicleWizard } from "@/components/dashboard/inventory/add-vehicle-wizard";

async function fetchFleetCars(): Promise<{ data: Vehicle[] }> {
  const res = await fetch("/api/cars?pageSize=100");
  if (!res.ok) throw new Error("Failed to load inventory fleet");
  return res.json();
}

export default function ProtectedInventoryPage() {
  const { user, isAdmin, setRole } = useAuth();
  const queryClient = useQueryClient();
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["fleet-cars"],
    queryFn: fetchFleetCars,
  });

  const vehicles = data?.data || [];

  // ==========================================
  // ACCESS DENIED GATE: Non-Admin Role Protection
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-[#121214] border border-[rgba(237,232,223,0.12)] p-8 sm:p-10 text-center space-y-6 shadow-2xl relative font-mono">
          <div className="w-14 h-14 border border-rose-500/40 bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Role-Based Access Control</span>
            </div>
            <h1 className="font-serif text-3xl text-[#ede8df] tracking-tight">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-[#a39e93] leading-relaxed">
              Authenticated session: <span className="text-[#c5a880] uppercase font-bold">{user.role}</span>. 
              The <span className="text-[#ede8df]">/dashboard/inventory</span> console is strictly reserved 
              for accredited curatorial administrators.
            </p>
          </div>

          <div className="p-4 bg-[#09090a] border border-[rgba(237,232,223,0.08)] text-left space-y-1.5 text-xs">
            <div className="text-[#ede8df] flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Restricted Curatorial Actions</span>
            </div>
            <p className="text-[11px] text-[#a39e93] leading-relaxed">
              Live valuation modification, lifecycle alterations, new accession onboarding, 
              and fleet CSV data ledger extraction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setRole("admin")}
              className="w-full sm:w-auto px-5 py-3 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to Admin Role</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-5 py-3 bg-[#09090a] hover:bg-[#18181b] text-[#ede8df] border border-[rgba(237,232,223,0.12)] text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Overview</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHORIZED ADMIN FLEET MANAGEMENT VIEW
  // ==========================================
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Status Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(237,232,223,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase font-bold tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Protected Admin Realm
            </span>
            <span className="text-[10px] text-[#a39e93]">
              Curator: <span className="text-[#ede8df]">{user.name}</span>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#ede8df] tracking-tight">
            Curatorial Collection Management
          </h1>
          <p className="font-mono text-xs text-[#a39e93] mt-1">
            Real-time TanStack data table with inline valuation and status editing, bulk actions, and multi-step lot onboarding.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto font-mono">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 bg-[#121214] border border-[rgba(237,232,223,0.12)] hover:border-[#c5a880]/40 text-[#ede8df] transition-colors"
            title="Refresh collection data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-[#c5a880]" : ""}`} />
          </button>

          <button
            onClick={() => setIsAddWizardOpen(true)}
            className="px-4 py-2.5 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Commission New Lot</span>
          </button>
        </div>
      </div>

      {/* TanStack Table Section */}
      {isLoading ? (
        <div className="h-96 bg-[#121214] border border-[rgba(237,232,223,0.08)] flex items-center justify-center text-[#a39e93] font-mono text-xs animate-pulse">
          LOADING CURATORIAL INVENTORY...
        </div>
      ) : (
        <InventoryTable
          vehicles={vehicles}
          onRefresh={() => {
            queryClient.invalidateQueries({ queryKey: ["fleet-cars"] });
            queryClient.invalidateQueries({ queryKey: ["cars-overview"] });
          }}
          onOpenAddWizard={() => setIsAddWizardOpen(true)}
        />
      )}

      {/* Multi-Step Add Vehicle Wizard Modal */}
      <AddVehicleWizard
        isOpen={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["fleet-cars"] });
          queryClient.invalidateQueries({ queryKey: ["cars-overview"] });
        }}
      />
    </div>
  );
}
