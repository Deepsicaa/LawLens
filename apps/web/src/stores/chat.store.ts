import { create } from "zustand";
import type { Message, Jurisdiction, Citation } from "types";

interface LastAnswer {
  confidenceScore: number;
  citations: Citation[];
  hasUnsupportedClaims: boolean;
}

interface ConversationState {
  conversationId: string | null;
  jurisdiction: Jurisdiction;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  lastAnswer: LastAnswer | null;

  setConversationId: (id: string | null) => void;
  setJurisdiction: (j: Jurisdiction) => void;
  addMessage: (message: Message) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreamChunk: (chunk: string) => void;
  finalizeStream: (message: Message) => void;
  setLastAnswer: (answer: LastAnswer) => void;
  reset: () => void;
}

export const useChatStore = create<ConversationState>((set, get) => ({
  conversationId: null,
  jurisdiction: "india",
  messages: [],
  isStreaming: false,
  streamingContent: "",
  lastAnswer: null,

  setConversationId: (id) => set({ conversationId: id }),
  setJurisdiction: (j) => set({ jurisdiction: j }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setStreaming: (streaming) => set({ isStreaming: streaming, streamingContent: "" }),
  appendStreamChunk: (chunk) => set((s) => ({ streamingContent: s.streamingContent + chunk })),

  finalizeStream: (message) => {
    set((s) => ({
      messages: [...s.messages, message],
      isStreaming: false,
      streamingContent: "",
      lastAnswer:
        message.confidenceScore != null
          ? {
              confidenceScore: message.confidenceScore,
              citations: message.citations ?? [],
              hasUnsupportedClaims: false,
            }
          : s.lastAnswer,
    }));

    // Persist to localStorage history
    // state.messages already contains message (added by set() above)
    const state = get();
    const allMessages = state.messages;
    const userMsg = allMessages.find((m) => m.role === "user");
    if (!userMsg) return;

    const title =
      userMsg.content.length > 72
        ? userMsg.content.slice(0, 72) + "…"
        : userMsg.content;

    // Import lazily to avoid circular deps
    import("@/stores/history.store").then(({ useHistoryStore }) => {
      const convId = get().conversationId ?? allMessages[0]?.id ?? crypto.randomUUID();
      if (!get().conversationId) set({ conversationId: convId });

      // Dedupe messages by ID before saving (guard against any future double-add)
      const seen = new Set<string>();
      const uniqueMessages = allMessages.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });

      useHistoryStore.getState().saveConversation({
        id: convId,
        title,
        jurisdiction: get().jurisdiction,
        messages: uniqueMessages,
        citations: message.citations ?? [],
        confidenceScore: message.confidenceScore ?? 0,
        createdAt: userMsg.createdAt,
        messageCount: uniqueMessages.length,
      });
    });
  },

  setLastAnswer: (answer) => set({ lastAnswer: answer }),

  reset: () =>
    set({
      conversationId: null,
      messages: [],
      isStreaming: false,
      streamingContent: "",
      lastAnswer: null,
    }),
}));
