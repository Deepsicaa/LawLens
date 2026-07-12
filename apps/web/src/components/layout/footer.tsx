"use client";
import Link from "next/link";
import { LogoLockup } from "@/components/ui/logo";

const LINKS = {
  Product: [
    { label: "Features",      href: "#features" },
    { label: "How it works",  href: "#how-it-works" },
    { label: "Jurisdictions", href: "#jurisdictions" },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
    { label: "Disclaimer",        href: "/disclaimer" },
  ],
  Company: [
    { label: "About",    href: "/about" },
    { label: "Research", href: "/research" },
    { label: "Contact",  href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "#05060f",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.35), transparent)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4.5rem 3rem 2.5rem" }}>
        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", textDecoration: "none", marginBottom: "1.1rem" }}>
              <LogoLockup markSize={30} fontSize="0.95rem" gap="0.7rem" />
            </Link>
            <p style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.32)", lineHeight: 1.75, maxWidth: 280, marginBottom: "1.5rem" }}>
              AI-powered legal intelligence backed by official government legislation.
              Every answer grounded in evidence, not model memory.
            </p>
            {/* Country pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {[["🇮🇳","India"],["🇬🇧","UK"],["🇨🇦","Canada"],["🇦🇺","Australia"]].map(([flag, name]) => (
                <span key={name} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  fontSize: "0.65rem", padding: "0.25rem 0.6rem", borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(240,237,232,0.3)",
                }}>
                  {flag} {name}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 style={{
                fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(240,237,232,0.22)",
                marginBottom: "1.1rem",
              }}>
                {category}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} style={{
                      fontSize: "0.82rem", color: "rgba(240,237,232,0.38)",
                      textDecoration: "none", transition: "color 0.15s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#d4af7a"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(240,237,232,0.38)"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: "1.75rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <p style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.18)" }}>
              LawLens is not a law firm and does not provide legal advice.
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.18)" }}>
              © {new Date().getFullYear()} LawLens. All rights reserved.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "rgba(240,237,232,0.22)" }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#10b981",
              boxShadow: "0 0 8px rgba(16,185,129,0.6)", display: "inline-block",
            }} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
