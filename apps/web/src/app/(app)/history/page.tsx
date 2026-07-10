"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Clock, ChevronRight, Search, X } from "lucide-react";
import { useHistoryStore, type SavedConversation } from "@/stores/history.store";
import { useChatStore } from "@/stores/chat.store";
import { JURISDICTIONS } from "types";
import type { Jurisdiction } from "types";

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const JURISDICTION_COLORS: Record<string, string> = {
  india: "#f97316",
  uk: "#3b82f6",
  canada: "#ef4444",
  australia: "#10b981",
};

export default function HistoryPage() {
  const router = useRouter();
  const { conversations, deleteConversation, clearAll } = useHistoryStore();
  const { reset, setJurisdiction, setConversationId } = useChatStore();
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = conversations.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(search.toLowerCase())
  );

  function handleOpen(conv: SavedConversation) {
    reset();
    setJurisdiction(conv.jurisdiction as Jurisdiction);
    setConversationId(conv.id);
    // Restore messages from history
    import("@/stores/chat.store").then(({ useChatStore: store }) => {
      conv.messages.forEach((m) => store.getState().addMessage(m));
    });
    router.push("/ask");
  }

  return (
    <div style={{ padding: "2.5rem 3rem", maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f0ede8", letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
            Chat History
          </h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.32)" }}>
            {conversations.length} saved conversation{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>
        {conversations.length > 0 && (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {confirmClear ? (
              <>
                <span style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)" }}>Are you sure?</span>
                <button
                  onClick={() => { clearAll(); setConfirmClear(false); }}
                  style={{ fontSize: "0.78rem", color: "#ef4444", border: "none", cursor: "pointer", padding: "0.35rem 0.75rem", borderRadius: "0.5rem", background: "rgba(239,68,68,0.1)" }}
                >
                  Yes, clear all
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.28)", background: "none", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", padding: "0.4rem 0.85rem", borderRadius: "0.5rem" }}
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      {conversations.length > 0 && (
        <div style={{
          position: "relative", marginBottom: "1.5rem",
          display: "flex", alignItems: "center",
        }}>
          <Search size={14} style={{ position: "absolute", left: "1rem", color: "rgba(240,237,232,0.3)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            style={{
              width: "100%", padding: "0.7rem 2.5rem 0.7rem 2.5rem",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "0.75rem", fontSize: "0.85rem", color: "#f0ede8",
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,122,0.3)"; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: "0.75rem", background: "none", border: "none",
              color: "rgba(240,237,232,0.3)", cursor: "pointer", padding: "0.25rem",
            }}>
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {conversations.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "6rem", textAlign: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "1rem",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem",
          }}>
            <MessageSquare size={20} style={{ color: "rgba(240,237,232,0.25)" }} />
          </div>
          <p style={{ fontSize: "0.95rem", color: "rgba(240,237,232,0.45)", marginBottom: "0.5rem" }}>No conversations yet</p>
          <p style={{ fontSize: "0.8rem", color: "rgba(240,237,232,0.22)", marginBottom: "1.5rem" }}>
            Your chats will appear here automatically after you ask a question.
          </p>
          <button
            onClick={() => router.push("/ask")}
            style={{
              padding: "0.7rem 1.5rem", borderRadius: "999px",
              background: "#d4af7a", color: "#060608", fontWeight: 700,
              fontSize: "0.85rem", border: "none", cursor: "pointer",
            }}
          >
            Ask a Question
          </button>
        </div>
      )}

      {/* No search results */}
      {conversations.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: "3rem", color: "rgba(240,237,232,0.35)", fontSize: "0.88rem" }}>
          No conversations match &ldquo;{search}&rdquo;
        </div>
      )}

      {/* List */}
      <AnimatePresence initial={false}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((conv, i) => {
            const jMeta = JURISDICTIONS[conv.jurisdiction as keyof typeof JURISDICTIONS];
            const jColor = JURISDICTION_COLORS[conv.jurisdiction] ?? "#d4af7a";

            return (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                onClick={() => handleOpen(conv)}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.875rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "pointer", transition: "all 0.18s",
                  position: "relative",
                }}
                whileHover={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
              >
                {/* Jurisdiction dot */}
                <div style={{
                  width: 42, height: 42, borderRadius: "0.75rem", flexShrink: 0,
                  background: `${jColor}12`, border: `1px solid ${jColor}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem",
                }}>
                  {jMeta?.flag ?? "⚖️"}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: "0.875rem", fontWeight: 500, color: "#f0ede8",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    marginBottom: "0.25rem",
                  }}>
                    {conv.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{
                      fontSize: "0.65rem", padding: "0.18rem 0.55rem", borderRadius: "999px",
                      background: `${jColor}12`, border: `1px solid ${jColor}25`, color: jColor,
                      letterSpacing: "0.08em",
                    }}>
                      {jMeta?.name ?? conv.jurisdiction}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.28)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Clock size={11} />
                      {formatRelative(conv.updatedAt)}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.2)" }}>
                      {conv.messageCount} message{conv.messageCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem", opacity: 0, transition: "opacity 0.15s" }}
                  className="history-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    style={{
                      width: 30, height: 30, borderRadius: "0.5rem", display: "flex",
                      alignItems: "center", justifyContent: "center", background: "none",
                      border: "none", cursor: "pointer", color: "rgba(240,237,232,0.35)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget).style.color = "#ef4444"; (e.currentTarget).style.background = "rgba(239,68,68,0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.color = "rgba(240,237,232,0.35)"; (e.currentTarget).style.background = "none"; }}
                  >
                    <Trash2 size={13} />
                  </button>
                  <ChevronRight size={15} style={{ color: "rgba(240,237,232,0.25)" }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      <style>{`
        div:hover > .history-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
