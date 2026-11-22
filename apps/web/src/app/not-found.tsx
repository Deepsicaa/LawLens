import Link from "next/link";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5eef6] flex flex-col items-center justify-center text-center px-4">
      <div className="size-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-6">
        <Scale className="size-7 text-purple-800" />
      </div>

      <p className="text-6xl font-bold text-purple-300 mb-4">404</p>
      <h1 className="text-xl font-semibold text-stone-800 mb-2">Page not found</h1>
      <p className="text-sm text-stone-600 mb-8 max-w-sm">
        This section of law doesn&apos;t exist — or hasn&apos;t been enacted yet.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-stone-700
                     hover:bg-white/[0.1] hover:text-stone-800 transition-all"
        >
          Go home
        </Link>
        <Link
          href="/ask"
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-sm text-purple-800
                     hover:bg-purple-600/30 transition-all"
        >
          Ask a question
        </Link>
      </div>
    </div>
  );
}
