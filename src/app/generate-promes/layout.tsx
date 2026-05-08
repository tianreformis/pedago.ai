import Sidebar from "@/components/Sidebar";

export default function GeneratePromesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="md:ml-64">
        {children}
      </main>
    </div>
  );
}
