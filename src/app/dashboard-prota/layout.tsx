import Sidebar from "@/components/Sidebar";

export default function DashboardProtaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto p-2 md:p-4 ml-16 md:ml-64">
        {children}
      </main>
    </div>
  );
}
