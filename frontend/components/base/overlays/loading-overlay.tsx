import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  loading: boolean;
  children: ReactNode;
}

export function LoadingOverlay({ loading, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sx">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
