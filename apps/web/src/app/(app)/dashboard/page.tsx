"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, GitCompare, Clock, Zap, Globe, FileText, ChevronRight } from "lucide-react";
import { useHistoryStore } from "@/stores/history.store";
import { JURISDICTIONS } from "types";
import type { Jurisdiction } from "types";

const JURISDICTION_COLORS: Record<string, string> = {
  india: "#f97316", uk: "#3b82f6", canada: "#ef4444", australia: "#10b981",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const E = [0.22, 1, 0.36, 1] as const;

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const conversations = useHistoryStore((s) => s.conversations);

  const firstName = user?.firstName ?? "there";
  const totalMessages = conversations.reduce((a, c) => a + c.messageCount, 0);
  const usedJurisdictions = new Set(conversations.map((c) => c.jurisdiction)).size;
  const totalCitations = conversations.reduce((a, c) => a + c.citations.length, 0);
  const avgConfidence = conversations.length
    ? Math.round((conversations.reduce((a, c) => a + c.confidenceScore, 0) / conversations.length) * 100)
    : 0;

  const recent = conversations.slice(0, 4);

  return (
    <div style={{ padding: "2.5rem 2.75rem", maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#d4af7a", marginBottom: "0.4rem" }}>
              {getGreeting()}
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f0ede8", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {firstName}
            </h1>
            <p style={{ fontSize: "0.83rem", color: "rgba(240,237,232,0.3)", marginTop: "0.4rem" }}>
              What legal question can we answer today?
            </p>
          </div>
          <div style={{
            padding: "0.55rem 1.1rem",
            borderRadius: "999px",
            border: "1px solid rgba(212,175,122,0.2)",
            background: "rgba(212,175,122,0.06)",
            fontSize: "0.72rem", color: "#d4af7a", letterSpacing: "0.06em",
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
            System operational
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.07 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem" }}>
          {[
            { href: "/ask", icon: MessageSquare, label: "Ask a Question", desc: "Research any legal topic with RAG", color: "#d4af7a", glow: "rgba(212,175,122,0.12)", accent: true },
            { href: "/compare", icon: GitCompare, label: "Compare Laws", desc: "How four countries answer one question", color: "#7c3aed", glow: "rgba(124,58,237,0.1)", accent: false },
            { href: "/history", icon: Clock, label: "Chat History", desc: `${conversations.length} saved conversation${conversations.length !== 1 ? "s" : ""}`, color: "#10b981", glow: "rgba(16,185,129,0.1)", accent: false },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <Link href={a.href} style={{
                  display: "flex", flexDirection: "column", gap: "1rem",
                  padding: "1.4rem 1.5rem",
                  borderRadius: "1.1rem",
                  border: `1px solid ${a.color}22`,
                  background: a.accent
                    ? `linear-gradient(135deg, ${a.color}14 0%, rgba(8,8,12,0.6) 100%)`
                    : `rgba(255,255,255,0.02)`,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: a.accent ? `0 0 32px ${a.glow}` : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${a.color}44`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px ${a.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${a.color}22`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = a.accent ? `0 0 32px ${a.glow}` : "none";
                  }}
                >
                  {a.accent && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${a.color}60, transparent)` }} />
                  )}
                  <div style={{
                    width: 36, height: 36, borderRadius: "0.65rem",
                    background: `${a.color}14`, border: `1px solid ${a.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} style={{ color: a.color }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f0ede8" }}>{a.label}</span>
                      <ArrowRight size={13} style={{ color: "rgba(240,237,232,0.2)" }} />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.35)", lineHeight: 1.5 }}>{a.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
          {[
            { label: "Questions asked", value: totalMessages, icon: MessageSquare, color: "#d4af7a" },
            { label: "Jurisdictions used", value: usedJurisdictions, icon: Globe, color: "#3b82f6" },
            { label: "Citations received", value: totalCitations, icon: FileText, color: "#7c3aed" },
            { label: "Avg. confidence", value: avgConfidence > 0 ? `${avgConfidence}%` : "—", icon: Zap, color: "#10b981" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                style={{
                  padding: "1.25rem 1.35rem",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "0.5rem",
                    background: `${s.color}10`, border: `1px solid ${s.color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={13} style={{ color: s.color }} />
                  </div>
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f0ede8", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.68rem", color: "rgba(240,237,232,0.28)", marginTop: "0.4rem" }}>{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent conversations */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,232,0.22)" }}>
            Recent conversations
          </p>
          {conversations.length > 0 && (
            <Link href="/history" style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              fontSize: "0.72rem", color: "rgba(240,237,232,0.3)", textDecoration: "none", transition: "color 0.15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#d4af7a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,237,232,0.3)"; }}
            >
              View all <ChevronRight size={11} />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div style={{
            borderRadius: "1.1rem", border: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.015)",
            padding: "3.5rem 2rem", textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "1rem",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.1rem",
            }}>
              <MessageSquare size={18} style={{ color: "rgba(240,237,232,0.18)" }} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(240,237,232,0.3)", marginBottom: "0.4rem" }}>No conversations yet</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.15)", marginBottom: "1.5rem" }}>
              Your chats will appear here after you ask a question
            </p>
            <button
              onClick={() => router.push("/ask")}
              style={{
                padding: "0.65rem 1.5rem", borderRadius: "999px",
                background: "#d4af7a", color: "#060608",
                fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer",
                boxShadow: "0 0 20px rgba(212,175,122,0.3)",
              }}
            >
              Ask your first question
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recent.map((conv, i) => {
              const jMeta = JURISDICTIONS[conv.jurisdiction as keyof typeof JURISDICTIONS];
              const jColor = JURISDICTION_COLORS[conv.jurisdiction] ?? "#d4af7a";
              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
                  onClick={() => router.push("/history")}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.9rem 1.1rem", borderRadius: "0.875rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  whileHover={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.09)" }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: "0.65rem", flexShrink: 0,
                    background: `${jColor}12`, border: `1px solid ${jColor}22`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                  }}>
                    {jMeta?.flag ?? "⚖️"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.83rem", fontWeight: 500, color: "#f0ede8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0.2rem" }}>
                      {conv.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.62rem", color: jColor, padding: "0.15rem 0.5rem", borderRadius: "999px", background: `${jColor}12`, border: `1px solid ${jColor}22` }}>
                        {jMeta?.name ?? conv.jurisdiction}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "rgba(240,237,232,0.25)" }}>
                        {formatRelative(conv.updatedAt)}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "rgba(240,237,232,0.18)" }}>
                        {conv.messageCount} msgs
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: jColor }}>
                        {Math.round(conv.confidenceScore * 100)}%
                      </div>
                      <div style={{ fontSize: "0.6rem", color: "rgba(240,237,232,0.2)" }}>confidence</div>
                    </div>
                    <ChevronRight size={13} style={{ color: "rgba(240,237,232,0.2)" }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Bottom banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <div style={{
          borderRadius: "1.1rem",
          border: "1px solid rgba(212,175,122,0.12)",
          background: "linear-gradient(135deg, rgba(212,175,122,0.05) 0%, rgba(8,8,12,0) 100%)",
          padding: "1.35rem 1.75rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem",
          flexWrap: "wrap",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.4), transparent)" }} />
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0ede8", marginBottom: "0.25rem" }}>
              Powered by official government legislation
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.3)", lineHeight: 1.5 }}>
              India · United Kingdom · Canada · Australia — every answer grounded in law, not model memory.
            </p>
          </div>
          <Link href="/ask" style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.65rem 1.35rem", borderRadius: "999px",
            background: "#d4af7a", color: "#060608", fontWeight: 700, fontSize: "0.82rem",
            textDecoration: "none", whiteSpace: "nowrap",
            boxShadow: "0 0 20px rgba(212,175,122,0.25)",
            transition: "box-shadow 0.2s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(212,175,122,0.45)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(212,175,122,0.25)"; }}
          >
            Ask a question <ArrowRight size={13} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
