"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { LogoLockup } from "@/components/ui/logo";

const LINKS = [
  { href: "#pipeline",      label: "How It Works" },
  { href: "#jurisdictions", label: "Countries" },
  { href: "#demo",          label: "Demo" },
  { href: "#trust",         label: "Research" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -68, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 0.4s, border-color 0.4s",
          background: scrolled ? "rgba(6,6,8,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(28px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        <nav style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 2.5rem",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem",
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <LogoLockup markSize={30} fontSize="0.92rem" gap="0.7rem" />
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, justifyContent: "center" }}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  padding: "0.5rem 0.9rem", borderRadius: "0.5rem",
                  fontSize: "0.82rem", color: "rgba(240,237,232,0.42)",
                  textDecoration: "none", transition: "color 0.2s, background 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "#f0ede8";
                  (e.target as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "rgba(240,237,232,0.42)";
                  (e.target as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            {isLoaded && (
              isSignedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Link href="/ask" style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.4)", textDecoration: "none" }}>
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button style={{
                      fontSize: "0.82rem", color: "rgba(240,237,232,0.42)", background: "none",
                      border: "none", cursor: "pointer", padding: "0.5rem 0.75rem",
                    }}>
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      fontSize: "0.82rem", fontWeight: 700, padding: "0.6rem 1.1rem",
                      borderRadius: "999px", background: "#d4af7a", color: "#060608",
                      border: "none", cursor: "pointer",
                      boxShadow: "0 0 16px rgba(212,175,122,0.35)",
                      transition: "all 0.2s",
                    }}>
                      Get Started <ArrowRight size={13} />
                    </button>
                  </SignUpButton>
                </>
              )
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none", padding: "0.5rem", background: "none", border: "none",
              color: "rgba(240,237,232,0.6)", cursor: "pointer",
            }}
            className="mobile-burger"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: 64, left: 0, right: 0, zIndex: 40,
              background: "rgba(6,6,8,0.96)", backdropFilter: "blur(28px)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              padding: "1.5rem 2.5rem",
              display: "flex", flexDirection: "column", gap: "0.75rem",
            }}
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{ fontSize: "0.95rem", color: "rgba(240,237,232,0.5)", textDecoration: "none", padding: "0.5rem 0" }}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {isLoaded && !isSignedIn && (
              <SignUpButton mode="modal">
                <button style={{
                  marginTop: "0.5rem", width: "100%", padding: "0.85rem",
                  borderRadius: "999px", background: "#d4af7a", color: "#060608",
                  fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer",
                }}>
                  Get Started
                </button>
              </SignUpButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
