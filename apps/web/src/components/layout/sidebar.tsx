"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Plus, Clock, GitCompare, Compass, Settings, ChevronRight,
} from "lucide-react";
import { useHistoryStore } from "@/stores/history.store";
import { useChatStore } from "@/stores/chat.store";
import { LogoLockup } from "@/components/ui/logo";

const NAV = [
  { href: "/ask",      icon: Plus,       label: "New Chat",    accent: true },
  { href: "/history",  icon: Clock,      label: "Chat History" },
  { href: "/compare",  icon: GitCompare, label: "Compare Laws" },
  { href: "/dashboard",icon: Compass,    label: "Dashboard" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const conversations = useHistoryStore((s) => s.conversations);
  const reset = useChatStore((s) => s.reset);
  const recentConvs = conversations.slice(0, 5);

  const JCOLOR: Record<string, string> = {
    india: "#f97316", uk: "#3b82f6", canada: "#ef4444", australia: "#10b981",
  };

  function startNewChat() {
    reset();
    router.push("/ask");
  }

  return (
    <aside style={{
      position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 30,
      width: 224, display: "flex", flexDirection: "column",
      background: "rgba(8,8,12,0.95)",
      borderRight: "1px solid rgba(255,255,255,0.055)",
      backdropFilter: "blur(24px)",
    }}>
      {/* Logo */}
      <div style={{
        height: 58, display: "flex", alignItems: "center",
        padding: "0 1.1rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <LogoLockup markSize={26} fontSize="0.88rem" gap="0.6rem" />
      </div>

      {/* Primary nav */}
      <nav style={{ padding: "0.75rem 0.6rem 0", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/ask" && pathname.startsWith(item.href));

          if (item.accent) {
            return (
              <button
                key={item.href}
                onClick={startNewChat}
                style={{
                  display: "flex", alignItems: "center", gap: "0.7rem",
                  padding: "0.65rem 0.85rem", borderRadius: "0.65rem",
                  background: active ? "rgba(212,175,122,0.12)" : "rgba(212,175,122,0.07)",
                  border: `1px solid ${active ? "rgba(212,175,122,0.3)" : "rgba(212,175,122,0.18)"}`,
                  color: "#d4af7a", fontSize: "0.82rem", fontWeight: 600,
                  cursor: "pointer", width: "100%", textAlign: "left",
                  transition: "all 0.15s",
                  boxShadow: active ? "0 0 16px rgba(212,175,122,0.12)" : "none",
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.7rem",
                padding: "0.65rem 0.85rem", borderRadius: "0.65rem",
                background: active ? "rgba(212,175,122,0.08)" : "transparent",
                border: `1px solid ${active ? "rgba(212,175,122,0.18)" : "transparent"}`,
                color: active ? "#d4af7a" : "rgba(240,237,232,0.42)",
                fontSize: "0.82rem", fontWeight: active ? 600 : 400,
                textDecoration: "none", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,237,232,0.75)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,237,232,0.42)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }
              }}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Recent conversations */}
      {recentConvs.length > 0 && (
        <div style={{ padding: "1.25rem 0.6rem 0" }}>
          <div style={{
            fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(240,237,232,0.2)",
            padding: "0 0.85rem", marginBottom: "0.5rem",
          }}>
            Recent
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            {recentConvs.map((conv) => {
              const jColor = JCOLOR[conv.jurisdiction] ?? "#d4af7a";
              return (
                <Link
                  key={conv.id}
                  href="/ask"
                  onClick={() => {
                    useChatStore.getState().reset();
                    useChatStore.getState().setConversationId(conv.id);
                    conv.messages.forEach((m) => useChatStore.getState().addMessage(m));
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.5rem 0.85rem", borderRadius: "0.55rem",
                    textDecoration: "none", transition: "all 0.12s", color: "rgba(240,237,232,0.38)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget).style.color = "rgba(240,237,232,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.background = "transparent";
                    (e.currentTarget).style.color = "rgba(240,237,232,0.38)";
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: jColor, flexShrink: 0 }} />
                  <span style={{
                    fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden",
                    textOverflow: "ellipsis", flex: 1,
                  }}>
                    {conv.title}
                  </span>
                </Link>
              );
            })}
          </div>
          {conversations.length > 5 && (
            <Link
              href="/history"
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                padding: "0.4rem 0.85rem", marginTop: "0.25rem",
                fontSize: "0.72rem", color: "rgba(240,237,232,0.25)",
                textDecoration: "none", transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.color = "#d4af7a"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.color = "rgba(240,237,232,0.25)"; }}
            >
              View all {conversations.length} conversations
              <ChevronRight size={11} />
            </Link>
          )}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Settings + Account */}
      <div style={{ padding: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link
          href="/settings"
          style={{
            display: "flex", alignItems: "center", gap: "0.7rem",
            padding: "0.6rem 0.85rem", borderRadius: "0.65rem",
            color: "rgba(240,237,232,0.32)", fontSize: "0.82rem",
            textDecoration: "none", transition: "all 0.15s", marginBottom: "0.2rem",
          }}
          onMouseEnter={(e) => { (e.currentTarget).style.color = "rgba(240,237,232,0.65)"; (e.currentTarget).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.color = "rgba(240,237,232,0.32)"; (e.currentTarget).style.background = "transparent"; }}
        >
          <Settings size={14} />
          Settings
        </Link>

        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.6rem 0.85rem",
        }}>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-6 h-6" } }} />
          <span style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.25)" }}>Account</span>
        </div>
      </div>
    </aside>
  );
}
