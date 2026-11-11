import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export type SpinnerProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const Spinner = ({ size = 16, className, ...props }: SpinnerProps) => {
  return <Loader2 size={size} className={cn('animate-spin', className)} {...props} />;
};
