"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { TestDriveModalProvider } from "@/lib/modal/test-drive-modal-context";
import { CompareProvider } from "@/lib/compare/compare-context";
import { ScheduleTestDriveModal } from "@/components/modals/schedule-test-drive-modal";
import { CompareBar } from "@/components/compare/compare-bar";
import { CompareModal } from "@/components/compare/compare-modal";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TestDriveModalProvider>
        <CompareProvider>
          {children}
          {/* Global VIP Booking & Vehicle Comparison Overlays */}
          <ScheduleTestDriveModal />
          <CompareBar />
          <CompareModal />
        </CompareProvider>
      </TestDriveModalProvider>
    </QueryClientProvider>
  );
}
