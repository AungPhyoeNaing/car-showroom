"use client";

import React, { createContext, useContext, useState } from "react";
import { Vehicle } from "@/types/inventory";

export interface TestDriveTargetVehicle {
  id?: string;
  vin?: string;
  title: string;
  image?: string;
  price?: number;
}

interface TestDriveModalContextType {
  isOpen: boolean;
  targetVehicle: TestDriveTargetVehicle | null;
  openTestDriveModal: (vehicle?: Vehicle | TestDriveTargetVehicle) => void;
  closeTestDriveModal: () => void;
}

const TestDriveModalContext = createContext<TestDriveModalContextType | undefined>(
  undefined
);

export function TestDriveModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetVehicle, setTargetVehicle] =
    useState<TestDriveTargetVehicle | null>(null);

  const openTestDriveModal = (vehicle?: Vehicle | TestDriveTargetVehicle) => {
    if (!vehicle) {
      setTargetVehicle(null);
    } else if ("make" in vehicle) {
      // Vehicle object
      setTargetVehicle({
        id: vehicle.id,
        vin: vehicle.vin,
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        image: vehicle.imageUrls?.[0],
        price: vehicle.price,
      });
    } else {
      setTargetVehicle(vehicle);
    }
    setIsOpen(true);
  };

  const closeTestDriveModal = () => {
    setIsOpen(false);
  };

  return (
    <TestDriveModalContext.Provider
      value={{
        isOpen,
        targetVehicle,
        openTestDriveModal,
        closeTestDriveModal,
      }}
    >
      {children}
    </TestDriveModalContext.Provider>
  );
}

export function useTestDriveModal() {
  const context = useContext(TestDriveModalContext);
  if (!context) {
    throw new Error(
      "useTestDriveModal must be used within a TestDriveModalProvider"
    );
  }
  return context;
}
