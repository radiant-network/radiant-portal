import type { InputProps } from '@/components/base/shadcn/input';
import { Input } from '@/components/base/shadcn/input';
import { cn } from '@/lib/utils';

// Native time input without the browser's clock icon
function TimeInput({ className, step = 1, ...props }: Omit<InputProps, 'type'>) {
  return (
    <Input
      type="time"
      step={step}
      className={cn(
        'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
        className,
      )}
      {...props}
    />
  );
}

export default TimeInput;
