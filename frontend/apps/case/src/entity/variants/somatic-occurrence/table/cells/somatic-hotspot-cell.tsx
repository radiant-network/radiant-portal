import { Flame } from 'lucide-react';

import { cn } from '@/components/lib/utils';

type SomaticHotspotCellProps = {
  value: boolean;
};
function SomaticHotspotCell({ value }: SomaticHotspotCellProps) {
  return (
    <Flame
      className={cn({ 'text-indicator-red fill-indicator-red': value, 'text-muted-foreground/40': !value })}
      size={16}
    />
  );
}
export default SomaticHotspotCell;
