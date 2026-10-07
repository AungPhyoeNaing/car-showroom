"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  UserCheck,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LeadRecord } from "@/lib/data/leads-store";

async function fetchLeads(): Promise<{ success: boolean; count: number; data: LeadRecord[] }> {
  const res = await fetch("/api/leads");
  if (!res.ok) throw new Error("Failed to load client leads");
  return res.json();
}

export default function LeadsDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["vip-leads"],
    queryFn: fetchLeads,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadRecord["status"] }) => {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vip-leads"] });
      setNotification(`Dossier status marked as ${variables.status.toUpperCase()}`);
      setTimeout(() => setNotification(null), 3500);
      if (selectedLead && selectedLead.id === variables.id) {
        setSelectedLead((prev) => prev ? { ...prev, status: variables.status } : null);
      }
    },
  });

  const leads = data?.data || [];

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.confirmationCode.toLowerCase().includes(term) ||
      (lead.vehicleTitle && lead.vehicleTitle.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const scheduledLeads = leads.filter((l) => l.status === "appointment_scheduled").length;
  const completedLeads = leads.filter((l) => l.status === "completed").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(237,232,223,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880] text-[10px] uppercase font-bold tracking-widest">
              <Users className="w-3 h-3" />
              VIP Client Protocol
            </span>
            <span className="text-[10px] text-[#a39e93]">
              Concierge Liaison Registry • Session: {user.name} ({user.role.toUpperCase()})
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#ede8df] tracking-tight">
            Client Inquiries &amp; Test Drive Dossiers
          </h1>
          <p className="font-mono text-xs text-[#a39e93] mt-1">
            Real-time confidential bookings, private viewing requests, and acquisition dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3.5 py-2 bg-[#121214] border border-[rgba(237,232,223,0.12)] hover:border-[#c5a880]/40 text-[#ede8df] transition-colors flex items-center gap-2 uppercase text-[11px] tracking-wider"
            title="Refresh dossiers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#c5a880]" : "text-[#a39e93]"}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Live Notification */}
      {notification && (
        <div className="p-3 bg-[#c5a880]/10 border border-[#c5a880]/30 font-mono text-xs text-[#c5a880] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#a39e93] hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-1">
          <div className="text-[10px] text-[#a39e93] uppercase tracking-wider">Total Client Requests</div>
          <div className="font-serif text-3xl text-[#ede8df]">{totalLeads}</div>
          <div className="text-[10px] text-[#c5a880]">Active Database Records</div>
        </div>

        <div className="p-5 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-1">
          <div className="text-[10px] text-[#a39e93] uppercase tracking-wider">New Action Required</div>
          <div className="font-serif text-3xl text-amber-400">{newLeads}</div>
          <div className="text-[10px] text-amber-400/80">Pending Concierge Review</div>
        </div>

        <div className="p-5 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-1">
          <div className="text-[10px] text-[#a39e93] uppercase tracking-wider">Scheduled Viewings</div>
          <div className="font-serif text-3xl text-sky-400">{scheduledLeads}</div>
          <div className="text-[10px] text-sky-400/80">Confirmed Salon Dates</div>
        </div>

        <div className="p-5 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-1">
          <div className="text-[10px] text-[#a39e93] uppercase tracking-wider">Completed Transfers</div>
          <div className="font-serif text-3xl text-emerald-400">{completedLeads}</div>
          <div className="text-[10px] text-emerald-400/80">Archived Acquisitions</div>
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a39e93]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client name, email, code, vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-[#121214] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-xs text-[#ede8df] placeholder-[#a39e93]/50 outline-none transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-[#121214] p-1 border border-[rgba(237,232,223,0.08)] text-[10px] uppercase">
          {[
            { id: "all", label: "All Dossiers" },
            { id: "new", label: "New" },
            { id: "contacted", label: "Contacted" },
            { id: "appointment_scheduled", label: "Scheduled" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 transition-colors ${
                statusFilter === tab.id
                  ? "bg-[#c5a880] text-[#09090a] font-bold"
                  : "text-[#a39e93] hover:text-[#ede8df]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ledger Table & Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Dossier Table */}
        <div className={`space-y-4 ${selectedLead ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {isLoading ? (
            <div className="h-64 bg-[#121214] border border-[rgba(237,232,223,0.08)] flex items-center justify-center font-mono text-xs text-[#a39e93] animate-pulse">
              RETRIEVING VIP CLIENT DOSSIERS...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-3 font-mono">
              <p className="text-sm text-[#ede8df]">No dossiers matched your active query.</p>
              <p className="text-xs text-[#a39e93]">Try broadening the filter criteria or searching another parameter.</p>
            </div>
          ) : (
            <div className="border border-[rgba(237,232,223,0.08)] bg-[#09090a] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[rgba(237,232,223,0.08)] bg-[#121214] text-[#a39e93] text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Code / Client</th>
                    <th className="py-3 px-4">Vehicle of Interest</th>
                    <th className="py-3 px-4">Preferred Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(237,232,223,0.04)]">
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#c5a880]/10"
                            : "hover:bg-[#121214]/60"
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] text-[#c5a880] block font-mono">
                            [{lead.confirmationCode}]
                          </span>
                          <span className="font-serif text-sm text-[#ede8df] font-medium block">
                            {lead.name}
                          </span>
                          <span className="text-[10px] text-[#a39e93]">
                            {lead.email}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-[#ede8df] block">
                            {lead.vehicleTitle || "General Acquisition Inquiry"}
                          </span>
                          {lead.vehicleVin && (
                            <span className="text-[10px] text-[#a39e93]">
                              VIN: {lead.vehicleVin}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#ede8df] text-[11px]">
                          <div>{lead.preferredDate}</div>
                          <div className="text-[10px] text-[#a39e93]">{lead.preferredTime}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                              lead.status === "new"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                : lead.status === "contacted"
                                ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                                : lead.status === "appointment_scheduled"
                                ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {lead.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(lead);
                            }}
                            className="px-2.5 py-1 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.1)] text-[#c5a880] text-[10px] uppercase tracking-wider inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inspection Drawer / Detailed Card */}
        {selectedLead && (
          <div className="lg:col-span-5 bg-[#121214] border border-[rgba(237,232,223,0.12)] p-6 space-y-6 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between border-b border-[rgba(237,232,223,0.08)] pb-4 font-mono">
              <div>
                <span className="text-[10px] text-[#c5a880] uppercase tracking-widest block">
                  DOSSIER #{selectedLead.confirmationCode}
                </span>
                <h3 className="font-serif text-2xl text-[#ede8df] mt-0.5">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-[#a39e93] hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Client Communications */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#ede8df]">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <a href={`mailto:${selectedLead.email}`} className="hover:underline">
                  {selectedLead.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#ede8df]">
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                  {selectedLead.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#ede8df]">
                <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Requested: {selectedLead.preferredDate} ({selectedLead.preferredTime})</span>
              </div>
            </div>

            {/* Vehicle Brief */}
            {selectedLead.vehicleTitle && (
              <div className="p-4 bg-[#09090a] border border-[rgba(237,232,223,0.08)] space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a880]">
                  Vehicle In Question
                </span>
                <div className="font-serif text-lg text-[#ede8df]">
                  {selectedLead.vehicleTitle}
                </div>
                {selectedLead.vehicleVin && (
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#a39e93]">VIN: {selectedLead.vehicleVin}</span>
                    <Link
                      href={`/inventory/${selectedLead.vehicleVin}`}
                      target="_blank"
                      className="text-[#c5a880] hover:text-white flex items-center gap-1 uppercase tracking-wider"
                    >
                      <span>Public Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Confidential Client Message */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#a39e93] flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-[#c5a880]" />
                Client Confidential Message
              </span>
              <div className="p-4 bg-[#09090a] border border-[rgba(237,232,223,0.08)] text-xs text-[#a39e93] leading-relaxed font-sans">
                &ldquo;{selectedLead.message}&rdquo;
              </div>
            </div>

            {/* Status Modification Controls */}
            {user.role !== "viewer" && (
              <div className="space-y-3 pt-4 border-t border-[rgba(237,232,223,0.08)] font-mono">
                <span className="text-[10px] uppercase tracking-wider text-[#a39e93] block">
                  Modify Dossier Lifecycle:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase">
                  {(["new", "contacted", "appointment_scheduled", "completed"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateStatusMutation.mutate({ id: selectedLead.id, status: st })}
                      disabled={selectedLead.status === st || updateStatusMutation.isPending}
                      className={`py-2 px-3 border transition-colors flex items-center justify-center gap-1.5 ${
                        selectedLead.status === st
                          ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880] font-bold"
                          : "bg-[#09090a] border-[rgba(237,232,223,0.1)] hover:border-white/20 text-[#a39e93]"
                      }`}
                    >
                      {selectedLead.status === st && <Check className="w-3 h-3" />}
                      <span>{st.replace("_", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
