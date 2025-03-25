import { ReactNode } from "react";

export function TextMuted({ children }: { children?: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
