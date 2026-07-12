import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { LogoLockup } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#05071a] flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-blue-700/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <LogoLockup markSize={36} fontSize="1.1rem" gap="0.8rem" />
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-white/40">Sign in to your LawLens account</p>
          </div>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#2563eb",
              colorBackground: "#0d1130",
              colorInputBackground: "#111827",
              colorInputText: "#f9fafb",
              colorText: "#f9fafb",
              colorTextSecondary: "#9ca3af",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "shadow-none border border-white/[0.06]",
              rootBox: "w-full",
            },
          }}
        />
      </div>
    </main>
  );
}
