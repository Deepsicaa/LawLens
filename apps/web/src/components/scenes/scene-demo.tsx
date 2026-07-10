"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const DEMO_QA = [
  {
    q: "Can my employer terminate me without notice in India?",
    a: "Under the Industrial Disputes Act, 1947 (§ 25F), an employer must provide one month's written notice or payment in lieu of notice before terminating any workman who has been continuously employed for at least one year. Additionally, § 25N requires prior approval from the government for establishments with 100+ workers.",
    citations: ["§ 25F · Industrial Disputes Act, 1947", "§ 25N · Industrial Disputes Act, 1947"],
    confidence: 96,
    jurisdiction: "India",
  },
  {
    q: "What are my rights if a UK landlord refuses to return my deposit?",
    a: "Under the Housing Act 2004 (§ 213), landlords must protect tenancy deposits in a government-approved scheme within 30 days. Failure to do so entitles you to claim 1–3× the deposit amount. You can apply to the county court for the return of the deposit and compensation.",
    citations: ["§ 213 · Housing Act 2004", "§ 214 · Housing Act 2004"],
    confidence: 93,
    jurisdiction: "United Kingdom",
  },
];

type Message = { role: "user" | "ai"; text: string; citations?: string[]; confidence?: number; jurisdiction?: string };

function TypeWriter({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, 16);
    return () => clearInterval(id);
  }, [text, onDone]);

  return <span>{displayed}<span style={{ opacity: 0.6, animation: "pulse-ring 1s ease-in-out infinite" }}>|</span></span>;
}

export function SceneDemo() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [messages, setMessages] = useState<Message[]>([]);
  const [demoIndex, setDemoIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing-q" | "retrieving" | "typing-a" | "done">("idle");
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const timer = setTimeout(() => runDemo(0), 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  function runDemo(idx: number) {
    const qa = DEMO_QA[idx % DEMO_QA.length]!;
    setPhase("typing-q");
    setInputVal("");

    let i = 0;
    const typeQ = setInterval(() => {
      i++;
      setInputVal(qa.q.slice(0, i));
      if (i >= qa.q.length) {
        clearInterval(typeQ);
        setTimeout(() => {
          setMessages((m) => [...m, { role: "user", text: qa.q }]);
          setInputVal("");
          setPhase("retrieving");
          setTimeout(() => {
            setPhase("typing-a");
            setMessages((m) => [...m, {
              role: "ai", text: qa.a,
              citations: qa.citations, confidence: qa.confidence, jurisdiction: qa.jurisdiction
            }]);
          }, 1800);
        }, 400);
      }
    }, 28);
  }

  function handleNext() {
    const next = (demoIndex + 1) % DEMO_QA.length;
    setDemoIndex(next);
    setPhase("idle");
    setMessages([]);
    setTimeout(() => runDemo(next), 100);
  }

  return (
    <section
      ref={ref}
      id="demo"
      className="scene"
      style={{
        minHeight: "100vh", padding: "8rem 5rem",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.03) 50%, transparent 100%)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <span className="eyebrow" style={{ display: "block", marginBottom: "1.2rem" }}>Live Intelligence</span>
          <h2 style={{
            fontSize: "clamp(2.2rem, 4vw, 5rem)", fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.025em", color: "#f0ede8", marginBottom: "1rem"
          }}>
            Ask. Retrieve.{" "}
            <em className="font-serif" style={{ color: "#3b82f6", fontStyle: "italic", fontWeight: 400 }}>Know.</em>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(240,237,232,0.35)", maxWidth: 480, margin: "0 auto" }}>
            Watch LawLens retrieve from official legislation in real time.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: E }}
          style={{
            borderRadius: "1.5rem", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(6,6,8,0.92)",
            backdropFilter: "blur(32px)",
          }}
        >
          {/* Title bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.02)",
          }}>
            {["#ef4444", "#f97316", "#10b981"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
            <span style={{ marginLeft: "0.75rem", fontSize: "0.72rem", color: "rgba(240,237,232,0.25)", letterSpacing: "0.12em" }}>
              LAWLENS INTELLIGENCE TERMINAL
            </span>
          </div>

          {/* Messages */}
          <div style={{ minHeight: 360, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        maxWidth: "75%", padding: "0.9rem 1.2rem", borderRadius: "1rem 1rem 0 1rem",
                        background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
                        fontSize: "0.88rem", lineHeight: 1.7, color: "#f0ede8",
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        marginBottom: "0.6rem",
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af7a", boxShadow: "0 0 6px #d4af7a" }} />
                        <span style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#d4af7a", textTransform: "uppercase" }}>
                          LawLens · {msg.jurisdiction}
                        </span>
                        <span style={{
                          fontSize: "0.6rem", padding: "0.15rem 0.5rem", borderRadius: "999px",
                          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                          color: "#10b981",
                        }}>
                          {msg.confidence}% confidence
                        </span>
                      </div>
                      <div style={{
                        padding: "1rem 1.25rem", borderRadius: "0 1rem 1rem 1rem",
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(240,237,232,0.75)",
                      }}>
                        {i === messages.length - 1 && phase === "typing-a"
                          ? <TypeWriter text={msg.text} onDone={() => setPhase("done")} />
                          : msg.text
                        }
                        {msg.citations && (phase === "done" || i < messages.length - 1) && (
                          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {msg.citations.map((c) => (
                              <span key={c} style={{
                                fontSize: "0.62rem", padding: "0.2rem 0.55rem", borderRadius: "999px",
                                background: "rgba(212,175,122,0.08)", border: "1px solid rgba(212,175,122,0.18)",
                                color: "#d4af7a",
                              }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {phase === "retrieving" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4af7a" }}
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                        transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.28)", letterSpacing: "0.08em" }}>
                    Retrieving from official legislation…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: "1rem",
          }}>
            <div style={{
              flex: 1, padding: "0.8rem 1rem", borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              fontSize: "0.85rem", color: inputVal ? "#f0ede8" : "rgba(240,237,232,0.25)",
              fontFamily: "var(--font-sans)", letterSpacing: "0.005em",
            }}>
              {inputVal || "Ask a legal question…"}
            </div>
            {phase === "done" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                style={{
                  padding: "0.8rem 1.2rem", borderRadius: "0.75rem",
                  background: "#d4af7a", color: "#060608", border: "none",
                  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  boxShadow: "0 0 20px rgba(212,175,122,0.3)",
                }}
              >
                Try Another <ArrowRight size={13} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
