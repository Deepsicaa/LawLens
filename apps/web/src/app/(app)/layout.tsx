import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio">
      <Sidebar />
      <main className="studio-main">
        {children}
      </main>
    </div>
  );
}
