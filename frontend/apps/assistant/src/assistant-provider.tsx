import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

type AssistantContextValue = {
  /** Whether the assistant side panel is open. */
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

/**
 * Holds the assistant panel state. Wraps the app tree so any component
 * (e.g. a navbar button) can open the panel via {@link useAssistant}.
 *
 * P1 scope: open/close only. Conversation state lands in P2.
 */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<AssistantContextValue>(
    () => ({ open, setOpen, toggle: () => setOpen(previous => !previous) }),
    [open],
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
