"use client";
import { ChatMessages, ChatInput, useChatSend } from "@/components/ai/chat";
import { LegalInsightPanel } from "@/components/ai/legal-insight-panel";
import { JurisdictionSelector } from "@/components/ai/jurisdiction-selector";
import { useChatStore } from "@/stores/chat.store";
import type { Jurisdiction } from "types";

const SIDEBAR_W = 224;
const RIGHT_W = 256;
const TOP_H = 58;
const INPUT_H = 110; // approx height of input bar

export default function AskPage() {
  const { jurisdiction, setJurisdiction, isStreaming, messages } = useChatStore();
  const { input, setInput, error, sendMessage } = useChatSend();

  return (
    <>
      {/* ── Top bar ── */}
      <div style={{
        position: "fixed",
        top: 0, left: SIDEBAR_W, right: RIGHT_W, height: TOP_H, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem",
        background: "rgba(8,9,12,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
      }}>
        <div>
          <h1 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f0ede8", letterSpacing: "-0.01em" }}>
            Legal Research
          </h1>
          <p style={{ fontSize: "0.7rem", color: "rgba(240,237,232,0.28)", marginTop: 1 }}>
            Answers retrieved from official legislation
          </p>
        </div>
        <JurisdictionSelector
          value={jurisdiction as Jurisdiction}
          onChange={setJurisdiction}
          disabled={isStreaming || messages.length > 0}
          compact
        />
      </div>

      {/* ── Scrollable messages — own independent scroll zone ── */}
      <div style={{
        position: "fixed",
        top: TOP_H,
        left: SIDEBAR_W,
        right: RIGHT_W,
        bottom: INPUT_H,
        overflowY: "scroll",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}>
        <ChatMessages onSend={(t) => void sendMessage(t)} />
      </div>

      {/* ── Input bar — sits at bottom, never overlaps scroll zone ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: SIDEBAR_W,
        right: RIGHT_W,
        height: INPUT_H,
        background: "rgba(8,9,12,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        zIndex: 20,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <ChatInput
          input={input}
          setInput={setInput}
          error={error}
          isStreaming={isStreaming}
          onSend={() => void sendMessage()}
        />
      </div>

      {/* ── Right panel ── */}
      <div style={{
        position: "fixed",
        top: 0, right: 0, bottom: 0,
        width: RIGHT_W,
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(8,9,12,0.97)",
        overflowY: "auto",
        zIndex: 10,
      }}>
        <LegalInsightPanel />
      </div>
    </>
  );
}

