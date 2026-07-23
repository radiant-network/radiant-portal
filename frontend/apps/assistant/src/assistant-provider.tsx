import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { mockEngine } from './engine/mock-engine';
import { type Message } from './types';

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
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

/**
 * Holds the assistant panel state: open/close plus the conversation.
 *
 * The reply comes from {@link mockEngine} — the UI never talks to a model
 * directly, it goes through the engine seam. P6 will add persistence here.
 */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState(false);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isResponding) {
        return;
      }

      const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
      setMessages(previous => [...previous, userMessage]);
      setIsResponding(true);

      mockEngine
        .reply(trimmed)
        .then(reply => {
          setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
        })
        .finally(() => setIsResponding(false));
    },
    [isResponding],
  );

  const value = useMemo<AssistantContextValue>(
    () => ({ open, setOpen, toggle: () => setOpen(previous => !previous), messages, send, isResponding }),
    [open, messages, send, isResponding],
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
