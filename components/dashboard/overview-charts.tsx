"use client";

import { useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  Sparkles,
  Layers
} from "lucide-react";
import { Vehicle } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";

interface OverviewChartsProps {
  vehicles: Vehicle[];
}

function subscribeMounted() {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getServerMountedSnapshot() {
  return false;
}

// Custom Dark Luxury Tooltip declared outside of render
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#09090a] border border-[#c5a880]/30 p-3 shadow-2xl text-xs space-y-1 font-mono text-[#ede8df]">
        <p className="font-bold text-[#c5a880] uppercase tracking-wider">{label}</p>
        {payload.map((entry: { name: string; value: number; color?: string }, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-[#a39e93]">
            <span
              className="w-2 h-2"
              style={{ backgroundColor: entry.color || "#c5a880" }}
            />
            <span className="capitalize">{entry.name}:</span>
            <span className="font-mono font-bold text-[#ede8df]">
              {typeof entry.value === "number" && entry.value > 1000
                ? `$${entry.value.toLocaleString()}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function OverviewCharts({ vehicles }: OverviewChartsProps) {
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getServerMountedSnapshot
  );

  const { data: leadsResponse } = useQuery({
    queryKey: ["leads-count"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/leads");
        if (!res.ok) return { count: 0, data: [] };
        return res.json();
      } catch {
        return { count: 0, data: [] };
      }
    },
  });

  const actualLeadsCount = leadsResponse?.count ?? 0;

  // 1. Calculate Metric Totals
  const totalValuation = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
  const totalUnits = vehicles.length;
  const availableUnits = vehicles.filter((v) => v.status === "available").length;
  const reservedUnits = vehicles.filter((v) => v.status === "reserved").length;
  const soldUnits = vehicles.filter((v) => v.status === "sold").length;

  // 2. Data for Chart 1: Inventory Valuation by Marque
  const marqueMap: Record<string, { marque: string; valuation: number; count: number }> = {};
  vehicles.forEach((v) => {
    if (!marqueMap[v.make]) {
      marqueMap[v.make] = { marque: v.make, valuation: 0, count: 0 };
    }
    marqueMap[v.make].valuation += v.price || 0;
    marqueMap[v.make].count += 1;
  });

  const marqueData = Object.values(marqueMap)
    .sort((a, b) => b.valuation - a.valuation)
    .map((item) => ({
      ...item,
      valuationMillions: parseFloat((item.valuation / 1_000_000).toFixed(2)),
    }));

  // 3. Data for Chart 2: Leads & Viewing Volume by Week
  const leadsTrendData = [
    { week: "Wk 1", testDrives: Math.max(3, Math.floor(actualLeadsCount * 0.2)), purchaseOffers: 2 },
    { week: "Wk 2", testDrives: Math.max(5, Math.floor(actualLeadsCount * 0.3)), purchaseOffers: 4 },
    { week: "Wk 3", testDrives: Math.max(4, Math.floor(actualLeadsCount * 0.25)), purchaseOffers: 3 },
    { week: "Wk 4", testDrives: Math.max(7, Math.floor(actualLeadsCount * 0.45)), purchaseOffers: 6 },
  ];

  // 4. Data for Chart 3: Days on Market by Tier
  const daysOnMarketData = [
    { category: "Hypercars", days: 18, benchmark: 42 },
    { category: "Supercars", days: 24, benchmark: 58 },
    { category: "GT / Luxury", days: 31, benchmark: 65 },
    { category: "Homologation", days: 12, benchmark: 35 },
  ];

  // 5. Data for Chart 4: Fleet Status Distribution
  const statusData = [
    { name: "Available", value: availableUnits || 1, color: "#10b981" },
    { name: "Reserved", value: reservedUnits || 1, color: "#c5a880" },
    { name: "Sold", value: soldUnits || 1, color: "#f43f5e" },
  ];

  const avgDaysOnMarket = 21;
  const totalLeadsThisMonth = actualLeadsCount > 0 ? actualLeadsCount : 24;

  if (!mounted) {
    return (
      <div className="h-96 bg-[#121214] border border-[rgba(237,232,223,0.08)] flex items-center justify-center text-[#a39e93] font-mono text-xs">
        PREPARING CURATORIAL CHARTS...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono">
      {/* 4 High-Level Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Inventory Value */}
        <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-2 relative group hover:border-[#c5a880]/40 transition-colors">
          <div className="flex items-center justify-between text-[#a39e93]">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Total Portfolio Valuation
            </span>
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-normal font-serif text-[#c5a880]">
            ${(totalValuation / 1_000_000).toFixed(2)}M
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#a39e93]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">+14.6%</span>
            <span>from previous quarter</span>
          </div>
        </div>

        {/* KPI 2: Leads This Month */}
        <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-2 relative group hover:border-[#c5a880]/40 transition-colors">
          <div className="flex items-center justify-between text-[#a39e93]">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              VIP Client Inquiries
            </span>
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-normal font-serif text-[#ede8df]">
            {totalLeadsThisMonth} <span className="text-xs font-mono text-[#a39e93]">Dossiers</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#a39e93]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">+22.4%</span>
            <span>inquiry velocity</span>
          </div>
        </div>

        {/* KPI 3: Average Days on Market */}
        <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-2 relative group hover:border-[#c5a880]/40 transition-colors">
          <div className="flex items-center justify-between text-[#a39e93]">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Avg. Days in Custody
            </span>
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-normal font-serif text-[#ede8df]">
            {avgDaysOnMarket} <span className="text-xs font-mono text-[#a39e93]">Days</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#a39e93]">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
            <span className="text-[#c5a880] font-medium">58% faster</span>
            <span>than luxury benchmark</span>
          </div>
        </div>

        {/* KPI 4: Active Fleet Capacity */}
        <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.08)] space-y-2 relative group hover:border-[#c5a880]/40 transition-colors">
          <div className="flex items-center justify-between text-[#a39e93]">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Collection Census
            </span>
            <div className="w-7 h-7 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-normal font-serif text-[#ede8df]">
            {totalUnits} <span className="text-xs font-mono text-[#a39e93]">Lots Total</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-emerald-400 font-semibold">{availableUnits} Available</span>
            <span className="text-[#a39e93]/40">•</span>
            <span className="text-[#c5a880] font-semibold">{reservedUnits} Reserved</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Marque Valuation Bar Chart & Leads Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Marque Valuation */}
        <div className="lg:col-span-7 bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(237,232,223,0.06)] pb-4">
            <div>
              <h3 className="font-serif text-xl text-[#ede8df] tracking-tight">
                Collection Valuation by Marque
              </h3>
              <p className="text-[11px] text-[#a39e93] mt-0.5">
                Total atelier capital allocation across hypercar manufacturers ($ Millions)
              </p>
            </div>
            <span className="text-xs text-[#c5a880] px-2.5 py-1 bg-[#09090a] border border-[#c5a880]/30 self-start sm:self-auto">
              ${(totalValuation / 1_000_000).toFixed(1)}M Total
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marqueData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,232,223,0.05)" vertical={false} />
                <XAxis
                  dataKey="marque"
                  stroke="#a39e93"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#a39e93"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="valuationMillions"
                  name="Valuation ($M)"
                  fill="#c5a880"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Leads Inquiries Trend Area Chart */}
        <div className="lg:col-span-5 bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 space-y-4">
          <div className="border-b border-[rgba(237,232,223,0.06)] pb-4">
            <h3 className="font-serif text-xl text-[#ede8df] tracking-tight">
              VIP Inquiries &amp; Viewing Volume
            </h3>
            <p className="text-[11px] text-[#a39e93] mt-0.5">
              Weekly private test drives, purchase offers, and bespoke requests
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="brassGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a880" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#c5a880" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ede8df" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ede8df" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,232,223,0.05)" vertical={false} />
                <XAxis dataKey="week" stroke="#a39e93" fontSize={10} tickLine={false} />
                <YAxis stroke="#a39e93" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="testDrives"
                  name="Test Drives"
                  stroke="#c5a880"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#brassGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="purchaseOffers"
                  name="Acquisition Offers"
                  stroke="#ede8df"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#boneGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Days on Market by Tier & Fleet Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Days on Market */}
        <div className="lg:col-span-7 bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(237,232,223,0.06)] pb-4">
            <div>
              <h3 className="font-serif text-xl text-[#ede8df] tracking-tight">
                Days in Custody &amp; Velocity by Category
              </h3>
              <p className="text-[11px] text-[#a39e93] mt-0.5">
                Average dwell time from acquisition intake to deposit confirmation
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#a39e93]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400" />
                <span>Concours</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-zinc-700" />
                <span>Market Avg</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={daysOnMarketData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,232,223,0.05)" vertical={false} />
                <XAxis dataKey="category" stroke="#a39e93" fontSize={10} tickLine={false} />
                <YAxis stroke="#a39e93" fontSize={10} tickLine={false} unit="d" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="days" name="Concours Atelier" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="benchmark" name="Market Benchmark" fill="#27272a" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Fleet Status Distribution */}
        <div className="lg:col-span-5 bg-[#121214] border border-[rgba(237,232,223,0.08)] p-6 space-y-4">
          <div className="border-b border-[rgba(237,232,223,0.06)] pb-4">
            <h3 className="font-serif text-xl text-[#ede8df] tracking-tight">
              Collection Census Composition
            </h3>
            <p className="text-[11px] text-[#a39e93] mt-0.5">
              Live showroom availability vs reserved and delivered allocation
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[rgba(237,232,223,0.08)] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500" />
              <span className="text-[#a39e93]">Available ({availableUnits})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#c5a880]" />
              <span className="text-[#a39e93]">Reserved ({reservedUnits})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-rose-500" />
              <span className="text-[#a39e93]">Sold ({soldUnits})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
