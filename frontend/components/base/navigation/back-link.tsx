import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BackLinkProps = React.HTMLAttributes<HTMLDivElement>;

export default function BackLink({ children, ...props }: BackLinkProps) {
  return (
    <div {...props} className={cn('flex items-center gap-2.5 hover:cursor-pointer', props.className)}>
      <ChevronLeft size={15} className="text-muted-foreground" />
      <span className="text-sm text-muted-foreground hover:text-foreground">{children}</span>
    </div>
  );
}
