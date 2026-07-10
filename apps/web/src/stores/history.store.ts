import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, Citation } from "types";

export interface SavedConversation {
  id: string;
  title: string;
  jurisdiction: string;
  messages: Message[];
  citations: Citation[];
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface HistoryState {
  conversations: SavedConversation[];
  saveConversation: (conv: Omit<SavedConversation, "updatedAt">) => void;
  updateConversation: (id: string, patch: Partial<SavedConversation>) => void;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
  getConversation: (id: string) => SavedConversation | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      conversations: [],

      saveConversation: (conv) =>
        set((s) => {
          const existing = s.conversations.find((c) => c.id === conv.id);
          const now = new Date().toISOString();
          if (existing) {
            return {
              conversations: s.conversations.map((c) =>
                c.id === conv.id ? { ...conv, updatedAt: now } : c
              ),
            };
          }
          return {
            conversations: [{ ...conv, updatedAt: now }, ...s.conversations].slice(0, 100),
          };
        }),

      updateConversation: (id, patch) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
          ),
        })),

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
        })),

      clearAll: () => set({ conversations: [] }),

      getConversation: (id) => get().conversations.find((c) => c.id === id),
    }),
    {
      name: "lawlens-history",
      version: 3,
      migrate(persisted) {
        const state = persisted as { conversations?: SavedConversation[] };
        const conversations = (state.conversations ?? []).map((conv) => {
          const seen = new Set<string>();
          const messages = (conv.messages ?? []).filter((m) => {
            if (!m?.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
          return { ...conv, messages, messageCount: messages.length };
        });
        return { conversations };
      },
    }
  )
);
