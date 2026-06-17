import { Check } from 'lucide-react';

import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { cn } from '@/components/lib/utils';

interface BooleanCellProps {
  value: boolean;
  className?: string;
}

/** Renders a checkmark when true, the empty-cell placeholder otherwise. */
function BooleanCell({ value, className }: BooleanCellProps) {
  return value ? <Check size={16} className={cn('text-primary', className)} /> : <EmptyCell className={className} />;
}

export default BooleanCell;
