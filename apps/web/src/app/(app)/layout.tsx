import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#08090c" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 224, minHeight: "100vh", position: "relative" }}>
        {children}
      </main>
    </div>
  );
}
