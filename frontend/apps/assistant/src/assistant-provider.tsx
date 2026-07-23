import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { mockEngine } from './engine/mock-engine';
import { type Message } from './types';

const STORAGE_KEY = 'radiant.assistant.conversation';

/** Read the persisted conversation. Called from an effect, so browser-only. */
function loadConversation(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

type AssistantContextValue = {
  /** Whether the assistant side panel is open. */
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  /** The conversation so far. */
  messages: Message[];
  /** Send a user message and trigger the (mock) assistant reply. */
  send: (text: string) => void;
  /** True while the assistant is producing a reply. */
  isResponding: boolean;
  /** Clear the conversation and its persisted copy (used on logout). */
  reset: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

/**
 * Holds the assistant panel state: open/close plus the conversation.
 *
 * The reply comes from {@link mockEngine} — the UI never talks to a model
 * directly, it goes through the engine seam. The conversation is persisted to
 * sessionStorage so it survives a refresh, and cleared on logout via reset().
 */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const skipNextPersist = useRef(true);

  // Restore the conversation once, after mount (sessionStorage is browser-only).
  useEffect(() => {
    const stored = loadConversation();
    if (stored.length) {
      setMessages(stored);
    }
  }, []);

  // Persist on every change, skipping the initial mount render.
  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage errors in the POC
    }
  }, [messages]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isResponding) {
        return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        blocks: [{ type: 'text', content: trimmed }],
      };
      setMessages(previous => [...previous, userMessage]);
      setIsResponding(true);

      mockEngine
        .reply(trimmed)
        .then(blocks => {
          setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'assistant', blocks }]);
        })
        .finally(() => setIsResponding(false));
    },
    [isResponding],
  );

  const reset = useCallback(() => {
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors in the POC
    }
  }, []);

  const value = useMemo<AssistantContextValue>(
    () => ({ open, setOpen, toggle: () => setOpen(previous => !previous), messages, send, isResponding, reset }),
    [open, messages, send, isResponding, reset],
  );

  return <AssistantContext value={value}>{children}</AssistantContext>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
