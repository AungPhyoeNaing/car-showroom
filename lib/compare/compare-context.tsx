"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import { Vehicle } from "@/types/inventory";

interface CompareContextType {
  compareList: Vehicle[];
  addToCompare: (vehicle: Vehicle) => boolean;
  removeFromCompare: (vehicleId: string) => void;
  clearCompare: () => void;
  isInCompare: (vehicleId: string) => boolean;
  isCompareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;
  alertMessage: string | null;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

function subscribeCompare(callback: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }
  return () => {};
}

function getStoredCompareSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem("apex_compare_list") || "[]";
}

function getServerCompareSnapshot(): string {
  return "[]";
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const storedJson = useSyncExternalStore(
    subscribeCompare,
    getStoredCompareSnapshot,
    getServerCompareSnapshot
  );

  const [localOverride, setLocalOverride] = useState<Vehicle[] | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const compareList: Vehicle[] =
    localOverride ??
    (() => {
      try {
        const parsed = JSON.parse(storedJson);
        return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
      } catch {
        return [];
      }
    })();

  const saveToStorage = (list: Vehicle[]) => {
    setLocalOverride(list);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("apex_compare_list", JSON.stringify(list));
        window.dispatchEvent(new Event("storage"));
      } catch {
        // Ignore storage errors
      }
    }
  };

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const addToCompare = (vehicle: Vehicle): boolean => {
    if (compareList.some((v) => v.id === vehicle.id)) {
      removeFromCompare(vehicle.id);
      return false;
    }

    if (compareList.length >= 3) {
      showAlert("You can compare up to 3 vehicles concurrently.");
      return false;
    }

    const updated = [...compareList, vehicle];
    saveToStorage(updated);
    return true;
  };

  const removeFromCompare = (vehicleId: string) => {
    const updated = compareList.filter((v) => v.id !== vehicleId);
    saveToStorage(updated);
  };

  const clearCompare = () => {
    saveToStorage([]);
  };

  const isInCompare = (vehicleId: string): boolean => {
    return compareList.some((v) => v.id === vehicleId);
  };

  const openCompare = () => setIsCompareOpen(true);
  const closeCompare = () => setIsCompareOpen(false);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        openCompare,
        closeCompare,
        alertMessage,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
