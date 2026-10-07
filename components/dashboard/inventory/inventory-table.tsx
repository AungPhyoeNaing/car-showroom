"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Search,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Check,
  X,
  Trash2,
  Copy,
  PlusCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Vehicle, VehicleStatus } from "@/types/inventory";

interface InventoryTableProps {
  vehicles: Vehicle[];
  onRefresh: () => void;
  onOpenAddWizard: () => void;
}

export function InventoryTable({
  vehicles,
  onRefresh,
  onOpenAddWizard,
}: InventoryTableProps) {
  // TanStack Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Inline Editing States
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [copiedVin, setCopiedVin] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVin(text);
    setTimeout(() => setCopiedVin(null), 2000);
  };

  // Inline Price Save Handler
  const handleSavePrice = async (vehicleId: string) => {
    if (!tempPrice || tempPrice <= 0) {
      showNotification("error", "Valuation must be a positive number.");
      return;
    }

    setSavingId(vehicleId);
    try {
      const res = await fetch("/api/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vehicleId, price: tempPrice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update valuation");

      showNotification("success", "Vehicle valuation updated live.");
      setEditingPriceId(null);
      onRefresh();
    } catch (err) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Error saving valuation"
      );
    } finally {
      setSavingId(null);
    }
  };

  // Inline Status Change Handler
  const handleUpdateStatus = async (vehicleId: string, newStatus: VehicleStatus) => {
    setSavingId(vehicleId);
    try {
      const res = await fetch("/api/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vehicleId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      showNotification("success", `Status changed to ${newStatus.toUpperCase()}`);
      onRefresh();
    } catch (err) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Error saving status"
      );
    } finally {
      setSavingId(null);
    }
  };

  // Bulk Status Update (e.g. Mark as Sold)
  const handleBulkMarkSold = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const ids = selectedRows.map((r) => r.original.id);
    try {
      const res = await fetch("/api/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_status", ids, status: "sold" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk update failed");

      showNotification(
        "success",
        `Marked ${ids.length} vehicle(s) as SOLD in fleet records.`
      );
      setRowSelection({});
      onRefresh();
    } catch (err) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Bulk action failed"
      );
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const ids = selectedRows.map((r) => r.original.id);
    if (!window.confirm(`Permanently remove ${ids.length} vehicle(s) from showroom collection?`)) {
      return;
    }

    try {
      const res = await fetch("/api/cars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      showNotification("success", `Removed ${ids.length} vehicle(s) from collection.`);
      setRowSelection({});
      onRefresh();
    } catch (err) {
      showNotification(
        "error",
        err instanceof Error ? err.message : "Delete failed"
      );
    }
  };

  // Export CSV Functionality
  const handleExportCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((r) => r.original)
        : table.getFilteredRowModel().rows.map((r) => r.original);

    if (dataToExport.length === 0) {
      showNotification("error", "No vehicle rows available to export.");
      return;
    }

    const headers = [
      "VIN",
      "Make",
      "Model",
      "Year",
      "Trim",
      "Condition",
      "Status",
      "Price",
      "Currency",
      "Mileage",
      "Fuel Type",
      "Transmission",
      "Drivetrain",
      "Exterior Color",
      "Interior Color",
      "Horsepower",
    ];

    const rows = dataToExport.map((v) => [
      `"${v.vin}"`,
      `"${v.make}"`,
      `"${v.model}"`,
      v.year,
      `"${v.trim || ""}"`,
      `"${v.condition}"`,
      `"${v.status}"`,
      v.price,
      `"${v.currency}"`,
      v.mileage,
      `"${v.fuelType}"`,
      `"${v.transmission}"`,
      `"${v.drivetrain}"`,
      `"${v.exteriorColor}"`,
      `"${v.interiorColor}"`,
      v.specs?.performance?.horsepower || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `lecurie-concours-fleet-export-2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(
      "success",
      `Exported ${dataToExport.length} vehicles to CSV successfully.`
    );
  };

  // Filter vehicles by status tab if set
  const filteredVehicles = useMemo(() => {
    if (statusFilter === "all") return vehicles;
    return vehicles.filter((v) => v.status === statusFilter);
  }, [vehicles, statusFilter]);

  // Column Definitions
  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      // 1. Selection Checkbox
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-3.5 h-3.5 bg-[#09090a] border-[rgba(237,232,223,0.2)] text-[#c5a880] focus:ring-0 cursor-pointer accent-[#c5a880]"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-3.5 h-3.5 bg-[#09090a] border-[rgba(237,232,223,0.2)] text-[#c5a880] focus:ring-0 cursor-pointer accent-[#c5a880]"
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },

      // 2. Image Column
      {
        accessorKey: "imageUrls",
        header: "Preview",
        cell: ({ row }) => {
          const vehicle = row.original;
          const img =
            vehicle.imageUrls[vehicle.primaryImageIndex || 0] ||
            vehicle.imageUrls[0] ||
            "/placeholder-car.jpg";
          return (
            <div className="relative w-16 h-11 overflow-hidden bg-[#09090a] border border-[rgba(237,232,223,0.1)] shrink-0 group">
              <Image
                src={img}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          );
        },
        enableSorting: false,
      },

      // 3. VIN Column
      {
        accessorKey: "vin",
        header: "Chassis VIN",
        cell: ({ row }) => {
          const vinVal = row.original.vin;
          const isCopied = copiedVin === vinVal;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#ede8df]">
              <Link
                href={`/inventory/${vinVal}`}
                className="hover:text-[#c5a880] transition-colors underline decoration-white/20 hover:decoration-[#c5a880]"
                title="View vehicle showroom page"
              >
                {vinVal}
              </Link>
              <button
                type="button"
                onClick={() => copyToClipboard(vinVal)}
                title="Copy VIN"
                className="text-[#a39e93] hover:text-[#c5a880] transition-colors p-1"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          );
        },
      },

      // 4. Make & Model
      {
        accessorKey: "model",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[#ede8df] hover:text-[#c5a880] font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Marque &amp; Model</span>
            <ArrowUpDown className="w-3 h-3 text-[#a39e93]" />
          </button>
        ),
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm text-[#ede8df] font-medium">
                  {v.year} {v.make} {v.model}
                </span>
                {v.condition === "certified" && (
                  <span className="px-1.5 py-0.2 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880] text-[9px] font-mono uppercase font-semibold">
                    Cert
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#a39e93] flex items-center gap-2 mt-0.5">
                {v.trim && <span>{v.trim}</span>}
                <span>•</span>
                <span>{v.specs?.performance?.horsepower} HP</span>
                <span>•</span>
                <span>{v.mileage.toLocaleString()} mi</span>
              </div>
            </div>
          );
        },
      },

      // 5. Price (with INLINE EDITING)
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-[#ede8df] hover:text-[#c5a880] font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Valuation</span>
            <ArrowUpDown className="w-3 h-3 text-[#a39e93]" />
          </button>
        ),
        cell: ({ row }) => {
          const v = row.original;
          const isEditing = editingPriceId === v.id;
          const isSaving = savingId === v.id;

          if (isEditing) {
            return (
              <div className="flex items-center gap-1.5 font-mono animate-in fade-in duration-150">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#c5a880]">
                    $
                  </span>
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(Number(e.target.value))}
                    min={1000}
                    step={1000}
                    className="w-28 pl-5 pr-2 py-1 bg-[#09090a] border border-[#c5a880] text-[#c5a880] text-xs font-mono outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSavePrice(v.id);
                      if (e.key === "Escape") setEditingPriceId(null);
                    }}
                  />
                </div>
                <button
                  onClick={() => handleSavePrice(v.id)}
                  disabled={isSaving}
                  title="Save valuation"
                  className="p-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingPriceId(null)}
                  title="Cancel"
                  className="p-1 bg-[#121214] text-[#a39e93] hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div className="group/price flex items-center gap-2 font-mono">
              <span className="font-bold text-[#c5a880] text-xs">
                ${v.price.toLocaleString()}
              </span>
              <button
                onClick={() => {
                  setEditingPriceId(v.id);
                  setTempPrice(v.price);
                }}
                title="Edit Price inline"
                className="opacity-0 group-hover/price:opacity-100 p-1 hover:bg-[#121214] text-[#a39e93] hover:text-[#c5a880] transition-all"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          );
        },
      },

      // 6. Status (with INLINE EDITING)
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const v = row.original;
          const isSaving = savingId === v.id;

          const statusStyles: Record<VehicleStatus, string> = {
            available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            reserved: "bg-amber-500/15 text-amber-400 border-amber-500/30",
            pending: "bg-sky-500/15 text-sky-400 border-sky-500/30",
            sold: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          };

          return (
            <div className="relative font-mono">
              <select
                value={v.status}
                disabled={isSaving}
                onChange={(e) =>
                  handleUpdateStatus(v.id, e.target.value as VehicleStatus)
                }
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border bg-[#09090a] cursor-pointer outline-none transition-all ${
                  statusStyles[v.status] || "border-white/10 text-[#ede8df]"
                }`}
                title="Change status inline"
              >
                <option value="available" className="bg-[#121214] text-emerald-400">
                  Available
                </option>
                <option value="reserved" className="bg-[#121214] text-amber-400">
                  Reserved
                </option>
                <option value="pending" className="bg-[#121214] text-sky-400">
                  Pending
                </option>
                <option value="sold" className="bg-[#121214] text-rose-400">
                  Sold
                </option>
              </select>
            </div>
          );
        },
      },

      // 7. Actions Column
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div className="flex items-center gap-1.5 justify-end font-mono">
              <Link
                href={`/inventory/${v.vin}`}
                target="_blank"
                title="View Public Page"
                className="p-1.5 bg-[#121214] hover:bg-[#18181b] text-[#ede8df] hover:text-[#c5a880] border border-[rgba(237,232,223,0.08)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {v.status !== "sold" && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(v.id, "sold")}
                  title="Mark as Sold"
                  className="px-2 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[9px] font-bold uppercase transition-colors"
                >
                  Mark Sold
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingPriceId, tempPrice, savingId, copiedVin]
  );

  const table = useReactTable({
    data: filteredVehicles,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4 font-mono">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 border text-xs flex items-center justify-between transition-all animate-in fade-in ${
            notification.type === "success"
              ? "bg-[#c5a880]/15 border-[#c5a880]/40 text-[#c5a880]"
              : "bg-rose-500/15 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[#a39e93] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a39e93]" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search VIN, make, model..."
              className="w-full pl-9 pr-4 py-2 bg-[#121214] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-xs text-[#ede8df] placeholder-[#a39e93]/50 outline-none transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-[#121214] p-1 border border-[rgba(237,232,223,0.08)] text-[10px] uppercase">
            {["all", "available", "reserved", "sold"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 transition-all ${
                  statusFilter === st
                    ? "bg-[#c5a880] text-[#09090a] font-bold"
                    : "text-[#a39e93] hover:text-[#ede8df]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.12)] hover:border-[#c5a880]/40 text-[#ede8df] text-[11px] uppercase tracking-wider flex items-center gap-2 transition-colors"
            title="Export filtered collection to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddWizard}
            className="px-4 py-2 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Floating Bulk Actions Ribbon (Appears when rows selected) */}
      {selectedCount > 0 && (
        <div className="p-3 bg-[#121214] border border-[#c5a880]/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-[#c5a880] animate-pulse" />
            <span className="text-[#ede8df] font-mono">
              [{selectedCount}] Lot{selectedCount > 1 ? "s" : ""} Selected
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase">
            <button
              onClick={handleBulkMarkSold}
              className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Mark Sold</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-[#09090a] hover:bg-[#18181b] text-[#ede8df] border border-[rgba(237,232,223,0.12)] font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Export Selected ({selectedCount})</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-[#09090a] hover:bg-rose-950/40 text-[#a39e93] hover:text-rose-400 border border-[rgba(237,232,223,0.12)] transition-colors"
              title="Delete Selected"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setRowSelection({})}
              className="px-2.5 py-1.5 text-[#a39e93] hover:text-white transition-colors"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-[rgba(237,232,223,0.08)] bg-[#09090a] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-[#121214] border-b border-[rgba(237,232,223,0.08)] text-[#a39e93] uppercase tracking-wider text-[10px]"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 px-4 font-normal">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[rgba(237,232,223,0.04)]">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#121214]/60 transition-colors ${
                      row.getIsSelected() ? "bg-[#c5a880]/10" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 text-[#ede8df]">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-[#a39e93] space-y-2"
                  >
                    <p className="text-sm">No vehicles match the selected criteria.</p>
                    <button
                      onClick={() => {
                        setGlobalFilter("");
                        setStatusFilter("all");
                      }}
                      className="text-[#c5a880] hover:underline text-xs"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-4 py-3 bg-[#121214] border-t border-[rgba(237,232,223,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a39e93]">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-mono text-[#ede8df] font-semibold">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>
            <span>to</span>
            <span className="font-mono text-[#ede8df] font-semibold">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>
            <span>of</span>
            <span className="font-mono text-[#ede8df] font-semibold">
              {table.getFilteredRowModel().rows.length}
            </span>
            <span>Lots</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-xs text-[#ede8df] outline-none"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} per page
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#a39e93] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#a39e93] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-mono text-[#ede8df]">
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount() || 1}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#a39e93] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#a39e93] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
