import { AuthProvider } from "@/lib/auth/auth-context";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#09090a] text-[#ede8df] flex flex-col selection:bg-[#c5a880] selection:text-[#09090a]">
        {/* Admin Top Navigation & RBAC Controls */}
        <DashboardHeader />

        {/* Main Admin Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
