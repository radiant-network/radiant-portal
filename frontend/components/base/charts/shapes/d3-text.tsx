import { cn } from '@/components/lib/utils';

type D3TextProps = {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  disabled?: boolean;
  children: React.ReactNode;
};

function D3Text({ x, y, anchor = 'middle', disabled = false, children }: D3TextProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={cn('text-sm font-semibold pointer-events-none', {
        'fill-muted-foreground': disabled,
        'fill-foreground': !disabled,
      })}
    >
      {children}
    </text>
  );
}

export default D3Text;
