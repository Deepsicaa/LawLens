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
    india: "#f97316", uk: "#3b82f6", canada: "#ef4444", australia: "#267554",
  };

  function startNewChat() {
    reset();
    router.push("/ask");
  }

  return (
    <>
    <aside style={{
      position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 30,
      width: 224, display: "flex", flexDirection: "column",
      background: "#f0e9f3",
      borderRight: "1px solid rgba(97,74,108,0.055)",
      backdropFilter: "blur(24px)",
    }}>
      {/* Logo */}
      <div style={{
        height: 58, display: "flex", alignItems: "center",
        padding: "0 1.1rem",
        borderBottom: "1px solid rgba(97,74,108,0.05)",
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
                  background: active ? "rgba(118,75,138,0.12)" : "rgba(118,75,138,0.07)",
                  border: `1px solid ${active ? "rgba(118,75,138,0.3)" : "rgba(118,75,138,0.18)"}`,
                  color: "#704784", fontSize: "0.82rem", fontWeight: 600,
                  cursor: "pointer", width: "100%", textAlign: "left",
                  transition: "all 0.15s",
                  boxShadow: active ? "0 0 16px rgba(118,75,138,0.12)" : "none",
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
                background: active ? "rgba(118,75,138,0.08)" : "transparent",
                border: `1px solid ${active ? "rgba(118,75,138,0.18)" : "transparent"}`,
                color: active ? "#704784" : "#62596b",
                fontSize: "0.82rem", fontWeight: active ? 600 : 400,
                textDecoration: "none", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#302a3c";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(97,74,108,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#62596b";
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
            textTransform: "uppercase", color: "#62596b",
            padding: "0 0.85rem", marginBottom: "0.5rem",
          }}>
            Recent
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            {recentConvs.map((conv) => {
              const jColor = JCOLOR[conv.jurisdiction] ?? "#704784";
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
                    textDecoration: "none", transition: "all 0.12s", color: "#62596b",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.background = "rgba(97,74,108,0.04)";
                    (e.currentTarget).style.color = "#302a3c";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.background = "transparent";
                    (e.currentTarget).style.color = "#62596b";
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
                fontSize: "0.72rem", color: "#62596b",
                textDecoration: "none", transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.color = "#704784"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.color = "#62596b"; }}
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
      <div style={{ padding: "0.6rem", borderTop: "1px solid rgba(97,74,108,0.05)" }}>
        <Link
          href="/settings"
          style={{
            display: "flex", alignItems: "center", gap: "0.7rem",
            padding: "0.6rem 0.85rem", borderRadius: "0.65rem",
            color: "#62596b", fontSize: "0.82rem",
            textDecoration: "none", transition: "all 0.15s", marginBottom: "0.2rem",
          }}
          onMouseEnter={(e) => { (e.currentTarget).style.color = "#62596b"; (e.currentTarget).style.background = "rgba(97,74,108,0.04)"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.color = "#62596b"; (e.currentTarget).style.background = "transparent"; }}
        >
          <Settings size={14} />
          Settings
        </Link>

        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.6rem 0.85rem",
        }}>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-6 h-6" } }} />
          <span style={{ fontSize: "0.78rem", color: "#62596b" }}>Account</span>
        </div>
      </div>
    </aside>
    <nav className="mobile-nav" aria-label="Workspace">
      {NAV.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} onClick={() => { if (href === "/ask") reset(); }} aria-current={pathname === href ? "page" : undefined}>
          <Icon size={17} />{label}
        </Link>
      ))}
      <Link href="/settings"><Settings size={17} />Settings</Link>
    </nav>
    </>
  );
}
