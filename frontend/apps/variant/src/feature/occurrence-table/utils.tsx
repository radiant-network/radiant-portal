import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';
import ShapeTriangleDownIcon from '@/components/base/icons/shape-triangle-down-icon';
import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import ShapeCircleIcon from '@/components/base/icons/shape-circle-icon';
import { cn } from '@/components/lib/utils';
import { OccurrenceVepImpactEnum } from '@/api/api';

export function getImpactBadge(impact: OccurrenceVepImpactEnum, size: number = 10, className?: string) {
  switch (impact) {
    case OccurrenceVepImpactEnum.High:
      return <ShapeTriangleUpIcon size={size} className={cn('text-red', className)} />;
    case OccurrenceVepImpactEnum.Low:
      return <ShapeTriangleDownIcon size={size} className={cn('text-green', className)} />;
    case OccurrenceVepImpactEnum.Moderate:
      return <ShapeDiamondIcon size={size} className={cn('text-yellow', className)} />;
    case OccurrenceVepImpactEnum.Modifier:
      return <ShapeCircleIcon size={size} className={cn('text-slate', className)} />;
    default:
      return;
  }
}
