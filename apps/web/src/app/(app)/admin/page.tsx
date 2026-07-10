import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Users, MessageSquare, Globe, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Admin" };

interface PlatformStats {
  total_users: number;
  total_conversations: number;
  total_messages: number;
  total_queries: number;
  jurisdictions_breakdown: Record<string, number>;
}

async function fetchStats(token: string): Promise<PlatformStats | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return null;
    return res.json() as Promise<PlatformStats>;
  } catch {
    return null;
  }
}

const JURISDICTION_FLAGS: Record<string, string> = {
  india: "🇮🇳",
  uk: "🇬🇧",
  canada: "🇨🇦",
  australia: "🇦🇺",
};

export default async function AdminPage() {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) redirect("/sign-in");

  const stats = await fetchStats(token);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">Platform statistics and management.</p>
      </div>

      {!stats ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-white/30">Unable to load stats. Admin access required.</p>
        </div>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total users", value: stats.total_users, icon: Users },
              { label: "Conversations", value: stats.total_conversations, icon: MessageSquare },
              { label: "Total queries", value: stats.total_queries, icon: TrendingUp },
              { label: "Jurisdictions", value: Object.keys(stats.jurisdictions_breakdown).length, icon: Globe },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <Icon className="h-4 w-4 text-white/20 mb-3" />
                  <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-white/30">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Jurisdiction breakdown */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white/50 mb-5">Jurisdiction usage</h2>
            <div className="space-y-3">
              {Object.entries(stats.jurisdictions_breakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([j, count]) => {
                  const total = stats.total_conversations || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={j} className="flex items-center gap-4">
                      <span className="w-5">{JURISDICTION_FLAGS[j] ?? "🌐"}</span>
                      <span className="text-sm text-white/60 w-28 capitalize">{j}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-white/30 w-16 text-right">
                        {count.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
