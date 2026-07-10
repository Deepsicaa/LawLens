import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#05071a] flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Get started</h1>
          <p className="mt-2 text-sm text-white/40">
            Create your account to start researching law
          </p>
        </div>
        <SignUp
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
