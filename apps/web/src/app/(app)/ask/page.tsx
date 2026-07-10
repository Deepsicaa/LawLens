"use client";
import { useRef, useEffect } from "react";
import { ChatMessages, ChatInput, useChatSend } from "@/components/ai/chat";
import { LegalInsightPanel } from "@/components/ai/legal-insight-panel";
import { JurisdictionSelector } from "@/components/ai/jurisdiction-selector";
import { useChatStore } from "@/stores/chat.store";
import type { Jurisdiction } from "types";

const RIGHT_W = 256;
const TOP_H = 58;
const INPUT_H = 110;

export default function AskPage() {
  const { jurisdiction, setJurisdiction, isStreaming, messages } = useChatStore();
  const { input, setInput, error, sendMessage } = useChatSend();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Non-passive listener so we control scroll explicitly — works even when
    // the browser routes wheel events to a parent scroll container instead.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* ── Top bar ── */}
      <div style={{
        flexShrink: 0,
        height: TOP_H,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem",
        background: "rgba(8,9,12,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
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

      {/* ── Main content row: messages + right panel ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── Messages — explicit wheel listener guarantees touchpad/trackpad scroll ── */}
        <div
          ref={scrollRef}
          tabIndex={0}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minWidth: 0,
            outline: "none",
          }}
        >
          <ChatMessages onSend={(t) => void sendMessage(t)} />
        </div>

        {/* ── Right panel ── */}
        <div style={{
          width: RIGHT_W,
          flexShrink: 0,
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(8,9,12,0.97)",
          overflowY: "auto",
        }}>
          <LegalInsightPanel />
        </div>
      </div>

      {/* ── Input bar ── */}
      <div style={{
        flexShrink: 0,
        height: INPUT_H,
        background: "rgba(8,9,12,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
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
    </div>
  );
}
