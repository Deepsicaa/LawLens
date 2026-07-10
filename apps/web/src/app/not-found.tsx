import Link from "next/link";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05071a] flex flex-col items-center justify-center text-center px-4">
      <div className="size-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
        <Scale className="size-7 text-blue-400" />
      </div>

      <p className="text-6xl font-bold text-white/10 mb-4">404</p>
      <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
      <p className="text-sm text-white/40 mb-8 max-w-sm">
        This section of law doesn't exist — or hasn't been enacted yet.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-white/70
                     hover:bg-white/[0.1] hover:text-white transition-all"
        >
          Go home
        </Link>
        <Link
          href="/ask"
          className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sm text-blue-400
                     hover:bg-blue-600/30 transition-all"
        >
          Ask a question
        </Link>
      </div>
    </div>
  );
}
