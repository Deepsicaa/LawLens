"use client";
import { ChatMessages, ChatInput, useChatSend } from "@/components/ai/chat";
import { LegalInsightPanel } from "@/components/ai/legal-insight-panel";
import { JurisdictionSelector } from "@/components/ai/jurisdiction-selector";
import { useChatStore } from "@/stores/chat.store";

export default function AskPage() {
  const { jurisdiction, setJurisdiction, isStreaming, messages } = useChatStore();
  const { input, setInput, error, sendMessage } = useChatSend();
  return (
    <div className="desk">
      <header className="desk-header">
        <div><h1 className="desk-title">Research desk</h1><p>Questions, legislation and sources</p></div>
        <JurisdictionSelector value={jurisdiction} onChange={setJurisdiction} disabled={isStreaming || messages.length > 0} compact />
      </header>
      <div className="desk-body">
        <section className="desk-thread" aria-label="Conversation" tabIndex={0}>
          <ChatMessages onSend={(text) => void sendMessage(text)} />
        </section>
        <section className="desk-sources" aria-label="Research insights"><LegalInsightPanel /></section>
      </div>
      <div className="desk-composer"><ChatInput input={input} setInput={setInput} error={error} isStreaming={isStreaming} onSend={() => void sendMessage()} /></div>
    </div>
  );
}
