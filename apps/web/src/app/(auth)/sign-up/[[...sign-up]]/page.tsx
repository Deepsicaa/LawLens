import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { LogoLockup } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f5eef6] flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <LogoLockup markSize={36} fontSize="1.1rem" gap="0.8rem" />
          <div>
            <h1 className="text-2xl font-bold text-[#302a3c]">Get started</h1>
            <p className="mt-2 text-sm text-[#62596b]">Create your account to start researching law</p>
          </div>
        </div>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#704784",
              colorBackground: "#fffaf8",
              colorInputBackground: "#f4eff6",
              colorInputText: "#302a3c",
              colorText: "#302a3c",
              colorTextSecondary: "#675d70",
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
