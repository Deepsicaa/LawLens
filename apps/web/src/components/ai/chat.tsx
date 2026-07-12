"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useChatStore } from "@/stores/chat.store";
import { ChatMessage } from "@/components/ai/message";
import { LogoMark } from "@/components/ui/logo";
import type { LegalResponse, Message } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const SUGGESTIONS = [
  "Can my employer terminate me without notice in India?",
  "What are tenant rights if a UK landlord refuses repairs?",
  "What is the minimum wage in Canada?",
  "How do I register a business in Australia?",
];

// Shared send logic extracted to a hook so both components can use it
export function useChatSend() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    messages, isStreaming, streamingContent,
    jurisdiction, conversationId,
    addMessage, setStreaming, appendStreamChunk, finalizeStream, setJurisdiction,
  } = useChatStore();

  const sendMessage = useCallback(async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || isStreaming) return;

    setInput("");
    setError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    setStreaming(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/legal/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, jurisdiction, conversationId: conversationId ?? undefined }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Request failed: ${res.status}`);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No stream");

        let done = false;
        let finalized = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data) as { chunk?: string; final?: LegalResponse; error?: string };
                if (parsed.error) throw new Error(parsed.error);
                if (parsed.chunk) appendStreamChunk(parsed.chunk);
                if (parsed.final) {
                  // Sync jurisdiction if server auto-detected a different one
                  if (parsed.final.jurisdiction && parsed.final.jurisdiction !== jurisdiction) {
                    setJurisdiction(parsed.final.jurisdiction as Parameters<typeof setJurisdiction>[0]);
                  }
                  const assistantMsg: Message = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: parsed.final.answer,
                    citations: parsed.final.citations,
                    confidenceScore: parsed.final.confidenceScore,
                    createdAt: new Date().toISOString(),
                  };
                  finalizeStream(assistantMsg);
                  finalized = true;
                }
              } catch (parseErr) {
                if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
                  throw parseErr;
                }
              }
            }
          }
        }
        // Stream closed without a final payload — reset UI to avoid stuck state
        if (!finalized) {
          setStreaming(false);
          setError("The response stream closed unexpectedly. Please try again.");
        }
      } else {
        const data = (await res.json()) as LegalResponse;
        if (data.jurisdiction && data.jurisdiction !== jurisdiction) {
          setJurisdiction(data.jurisdiction as Parameters<typeof setJurisdiction>[0]);
        }
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          citations: data.citations,
          confidenceScore: data.confidenceScore,
          createdAt: new Date().toISOString(),
        };
        finalizeStream(assistantMsg);
      }
    } catch (err) {
      setStreaming(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }, [input, isStreaming, jurisdiction, conversationId, addMessage, setStreaming, appendStreamChunk, finalizeStream, setJurisdiction]);

  return { input, setInput, error, setError, sendMessage, messages, isStreaming, streamingContent };
}

// ─── Messages area (pure scroll container) ────────────────────────────────────
export function ChatMessages({ onSend }: { onSend: (text: string) => void }) {
  const { messages, isStreaming, streamingContent } = useChatStore();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Dedupe at render time — guard against any duplicate IDs in store
  const seen = new Set<string>();
  const uniqueMessages = messages.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
  const isEmpty = uniqueMessages.length === 0;

  return (
    <div style={{ padding: "1.5rem 2rem 1rem" }}>
      <AnimatePresence initial={false}>
        {isEmpty && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "2rem",
            }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: "1.4rem", marginBottom: "1.75rem",
              background: "linear-gradient(135deg, rgba(196,164,106,0.1) 0%, rgba(196,164,106,0.04) 100%)",
              border: "1px solid rgba(196,164,106,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 36px rgba(196,164,106,0.1)",
            }}>
              <LogoMark size={40} />
            </div>

            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f0ede8", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              Ask a legal question
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(240,237,232,0.32)", maxWidth: 360, lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Every answer is retrieved from official government legislation — not from model memory.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", maxWidth: 520 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: "0.75rem", padding: "0.85rem 1.1rem", borderRadius: "0.75rem",
                    textAlign: "left", background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(240,237,232,0.55)", fontSize: "0.83rem",
                    cursor: "pointer", transition: "all 0.15s", width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,175,122,0.25)";
                    e.currentTarget.style.color = "#f0ede8";
                    e.currentTarget.style.background = "rgba(212,175,122,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "rgba(240,237,232,0.55)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                  }}
                >
                  <span>{s}</span>
                  <ArrowRight size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {uniqueMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <ChatMessage message={msg} />
          </motion.div>
        ))}

        {isStreaming && streamingContent && (
          <motion.div
            key="stream"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: "1rem", border: "1px solid rgba(212,175,122,0.1)",
              background: "rgba(15,14,20,0.9)", overflow: "hidden", marginBottom: "1.25rem",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 1rem",
              borderBottom: "1px solid rgba(212,175,122,0.07)", background: "rgba(212,175,122,0.03)",
            }}>
              <Loader2 size={12} style={{ color: "#d4af7a", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#d4af7a", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                LawLens is analyzing…
              </span>
            </div>
            <div style={{ padding: "1rem", fontSize: "0.875rem", lineHeight: 1.85, color: "rgba(240,237,232,0.75)" }}>
              {streamingContent}
              <span style={{ display: "inline-block", width: 2, height: "1em", background: "#d4af7a", marginLeft: 2, verticalAlign: "text-bottom", animation: "blink 1s ease-in-out infinite" }} />
            </div>
          </motion.div>
        )}

        {isStreaming && !streamingContent && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex", alignItems: "center", gap: "0.85rem",
              padding: "0.85rem 1rem", borderRadius: "0.875rem",
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)", marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4af7a" }}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                  transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.35)" }}>
              Retrieving from official legislation…
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={endRef} />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ─── Input bar (fixed, no scroll involvement) ─────────────────────────────────
export function ChatInput({
  input, setInput, error, isStreaming, onSend,
}: {
  input: string;
  setInput: (v: string) => void;
  error: string | null;
  isStreaming: boolean;
  onSend: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ padding: "0 2rem 0.75rem" }}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              display: "flex", alignItems: "flex-start", gap: "0.6rem",
              marginBottom: "0.65rem", padding: "0.75rem 1rem",
              borderRadius: "0.75rem", border: "1px solid rgba(239,68,68,0.2)",
              background: "rgba(239,68,68,0.06)", fontSize: "0.82rem", color: "#fca5a5",
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        display: "flex", gap: "0.75rem", alignItems: "flex-end",
        padding: "0.85rem 1rem", borderRadius: "1rem",
        border: "1px solid rgba(212,175,122,0.14)",
        background: "rgba(10,10,16,0.98)",
        boxShadow: "0 -8px 24px rgba(8,9,12,0.6)",
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any legal question…"
          rows={1}
          disabled={isStreaming}
          style={{
            flex: 1, resize: "none", background: "transparent",
            fontSize: "0.875rem", color: "rgba(240,237,232,0.85)",
            outline: "none", lineHeight: 1.7, border: "none",
            fontFamily: "var(--font-geist, sans-serif)",
          }}
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || isStreaming}
          style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: "0.6rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none",
            cursor: !input.trim() || isStreaming ? "default" : "pointer",
            background: input.trim() && !isStreaming ? "#d4af7a" : "rgba(212,175,122,0.08)",
            color: input.trim() && !isStreaming ? "#060608" : "rgba(240,237,232,0.2)",
            transition: "all 0.15s",
            boxShadow: input.trim() && !isStreaming ? "0 0 14px rgba(212,175,122,0.35)" : "none",
          }}
        >
          {isStreaming
            ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            : <Send size={14} />}
        </button>
      </div>

      <p style={{ marginTop: "0.45rem", textAlign: "center", fontSize: "0.65rem", color: "rgba(240,237,232,0.12)", letterSpacing: "0.04em" }}>
        Answers sourced from official government legislation · Always verify with a qualified lawyer
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea::placeholder { color: rgba(240,237,232,0.2); }
      `}</style>
    </div>
  );
}

// ─── Legacy combined export (unused but keeps imports valid) ──────────────────
export function Chat() {
  const { input, setInput, error, sendMessage, isStreaming } = useChatSend();
  return (
    <>
      <ChatMessages onSend={(t) => void sendMessage(t)} />
      <ChatInput input={input} setInput={setInput} error={error} isStreaming={isStreaming} onSend={() => void sendMessage()} />
    </>
  );
}
