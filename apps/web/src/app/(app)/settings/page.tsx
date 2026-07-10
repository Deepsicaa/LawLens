"use client";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Trash2, LogOut, Check, ChevronRight, ExternalLink } from "lucide-react";
import { useJurisdictionStore } from "@/stores/jurisdiction.store";
import { JURISDICTIONS, type Jurisdiction } from "@/types";

type Section = "profile" | "preferences" | "security";

const JURISDICTION_COLORS: Record<string, string> = {
  india: "#f97316", uk: "#3b82f6", canada: "#ef4444", australia: "#10b981",
};

const NAV: { id: Section; label: string; Icon: typeof User }[] = [
  { id: "profile",     label: "Profile",     Icon: User   },
  { id: "preferences", label: "Preferences", Icon: Bell   },
  { id: "security",    label: "Security",    Icon: Shield },
];

// ─── Profile ─────────────────────────────────────────────────────────────────
function ProfileSection() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const rows = [
    { label: "Email",        value: user?.primaryEmailAddress?.emailAddress ?? "—" },
    { label: "Member since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
    { label: "User ID",      value: user?.id ? user.id.slice(0, 24) + "…" : "—", mono: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Avatar card */}
      <div style={{
        display: "flex", alignItems: "center", gap: "1.25rem",
        padding: "1.5rem", borderRadius: "1.1rem",
        border: "1px solid rgba(212,175,122,0.15)",
        background: "linear-gradient(135deg, rgba(212,175,122,0.07) 0%, rgba(8,8,12,0) 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.4), transparent)" }} />
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="Avatar" style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(212,175,122,0.3)", flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #d4af7a, #8a5a20)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem", fontWeight: 700, color: "#060608",
            border: "2px solid rgba(212,175,122,0.3)",
          }}>
            {user?.firstName?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f0ede8", marginBottom: "0.2rem", letterSpacing: "-0.01em" }}>
            {user?.fullName ?? user?.username ?? "—"}
          </p>
          <p style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.38)" }}>
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      {/* Account details */}
      <div>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,232,0.22)", marginBottom: "0.75rem" }}>
          Account details
        </p>
        <div style={{ borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          {rows.map((r, i) => (
            <div key={r.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.9rem 1.1rem",
              borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              background: "rgba(255,255,255,0.015)",
            }}>
              <span style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.38)" }}>{r.label}</span>
              <span style={{ fontSize: r.mono ? "0.72rem" : "0.82rem", fontFamily: r.mono ? "monospace" : undefined, color: "rgba(240,237,232,0.65)", letterSpacing: r.mono ? "0.02em" : undefined }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,232,0.22)", marginBottom: "0.75rem" }}>
          Actions
        </p>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            width: "100%", padding: "0.9rem 1.1rem",
            borderRadius: "0.875rem", textAlign: "left",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            fontSize: "0.85rem", color: "rgba(240,237,232,0.5)",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f0ede8";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(240,237,232,0.5)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Preferences ─────────────────────────────────────────────────────────────
function PreferencesSection() {
  const { selected, setJurisdiction } = useJurisdictionStore();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,232,0.22)", marginBottom: "0.75rem" }}>
          Default jurisdiction
        </p>
        <p style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.3)", marginBottom: "1.1rem", lineHeight: 1.6 }}>
          The jurisdiction selected when you start a new chat.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {(Object.keys(JURISDICTIONS) as Jurisdiction[]).map((key) => {
            const j = JURISDICTIONS[key];
            const col = JURISDICTION_COLORS[key] ?? "#d4af7a";
            const active = selected === key;
            return (
              <button
                key={key}
                onClick={() => setJurisdiction(key)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.9rem 1.1rem", borderRadius: "0.875rem", textAlign: "left",
                  border: `1px solid ${active ? col + "40" : "rgba(255,255,255,0.06)"}`,
                  background: active ? `${col}10` : "rgba(255,255,255,0.02)",
                  cursor: "pointer", transition: "all 0.18s",
                  boxShadow: active ? `0 0 20px ${col}18` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = `${col}28`;
                    e.currentTarget.style.background = `${col}06`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{j.flag}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400, color: active ? col : "rgba(240,237,232,0.55)", flex: 1 }}>
                  {j.name}
                </span>
                {active && (
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: col, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={10} style={{ color: "#060608" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <button
          onClick={handleSave}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.7rem 1.5rem", borderRadius: "999px",
            border: `1px solid ${saved ? "rgba(16,185,129,0.3)" : "rgba(212,175,122,0.3)"}`,
            background: saved ? "rgba(16,185,129,0.1)" : "#d4af7a",
            color: saved ? "#10b981" : "#060608",
            fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: saved ? "0 0 16px rgba(16,185,129,0.2)" : "0 0 20px rgba(212,175,122,0.3)",
          }}
        >
          {saved ? <><Check size={13} /> Saved</> : "Save preferences"}
        </button>
      </div>
    </div>
  );
}

// ─── Security ────────────────────────────────────────────────────────────────
function SecuritySection() {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Auth provider */}
      <div>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,232,0.22)", marginBottom: "0.75rem" }}>
          Authentication
        </p>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "1rem",
          padding: "1.1rem 1.25rem", borderRadius: "1rem",
          border: "1px solid rgba(16,185,129,0.15)",
          background: "rgba(16,185,129,0.05)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "0.6rem", flexShrink: 0,
            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={14} style={{ color: "#10b981" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0ede8", marginBottom: "0.3rem" }}>
              Secured by Clerk
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(240,237,232,0.38)", lineHeight: 1.6 }}>
              Password, two-factor authentication, and active sessions are managed through Clerk's secure portal.
            </p>
          </div>
        </div>

        <a
          href="https://accounts.clerk.dev/user"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: "0.6rem", padding: "0.9rem 1.1rem",
            borderRadius: "0.875rem", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            fontSize: "0.85rem", color: "rgba(240,237,232,0.45)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#f0ede8";
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,237,232,0.45)";
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.02)";
          }}
        >
          <span>Manage account security</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Danger zone */}
      <div>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", marginBottom: "0.75rem" }}>
          Danger zone
        </p>
        <div style={{
          padding: "1.25rem", borderRadius: "1rem",
          border: "1px solid rgba(239,68,68,0.18)",
          background: "rgba(239,68,68,0.04)",
        }}>
          <p style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.4)", lineHeight: 1.6, marginBottom: "1rem" }}>
            Permanently delete your account and all associated conversations. This action cannot be undone.
          </p>
          <AnimatePresence mode="wait">
            {!confirmDelete ? (
              <motion.button
                key="delete-btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setConfirmDelete(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.6rem 1.1rem", borderRadius: "0.65rem",
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.08)",
                  fontSize: "0.82rem", color: "#ef4444",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              >
                <Trash2 size={13} /> Delete account
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}
              >
                <span style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.4)" }}>Are you sure?</span>
                <button
                  style={{
                    padding: "0.5rem 1rem", borderRadius: "0.55rem",
                    border: "1px solid rgba(239,68,68,0.4)",
                    background: "rgba(239,68,68,0.15)",
                    fontSize: "0.78rem", color: "#ef4444", cursor: "pointer",
                  }}
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    padding: "0.5rem 1rem", borderRadius: "0.55rem",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "transparent",
                    fontSize: "0.78rem", color: "rgba(240,237,232,0.4)", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");

  return (
    <div style={{ padding: "2.5rem 3rem", maxWidth: 820, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0ede8", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>
          Settings
        </h1>
        <p style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.3)" }}>
          Manage your account and preferences
        </p>
      </div>

      <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>
        {/* Sidebar nav */}
        <nav style={{ width: 168, flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {NAV.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.65rem",
                  padding: "0.65rem 0.9rem", borderRadius: "0.75rem",
                  border: `1px solid ${isActive ? "rgba(212,175,122,0.2)" : "transparent"}`,
                  background: isActive ? "rgba(212,175,122,0.08)" : "transparent",
                  color: isActive ? "#d4af7a" : "rgba(240,237,232,0.38)",
                  fontSize: "0.83rem", fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", width: "100%", textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(240,237,232,0.75)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgba(240,237,232,0.38)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === "profile"     && <ProfileSection />}
              {active === "preferences" && <PreferencesSection />}
              {active === "security"    && <SecuritySection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
