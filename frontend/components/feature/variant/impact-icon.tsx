import { VepImpact } from '@/api/api';
import ShapeTriangleUpIcon from '@/base/icons/shape-triangle-up-icon';
import ShapeTriangleDownIcon from '@/base/icons/shape-triangle-down-icon';
import ShapeDiamondIcon from '@/base/icons/shape-diamond-icon';
import ShapeCircleIcon from '@/base/icons/shape-circle-icon';
import { cn } from '@/lib/utils';

interface ImpactIconProps {
  value: VepImpact;
  size?: number;
  className?: string;
}

function ImpactIcon({ value, size = 10, className }: ImpactIconProps) {
  switch (value) {
    case VepImpact.HIGH:
      return <ShapeTriangleUpIcon size={size} className={cn('text-red-600 shrink-0', className)} />;
    case VepImpact.LOW:
      return <ShapeTriangleDownIcon size={size} className={cn('text-green-600 shrink-0', className)} />;
    case VepImpact.MODERATE:
      return <ShapeDiamondIcon size={size} className={cn('text-amber-500 shrink-0', className)} />;
    case VepImpact.MODIFIER:
      return <ShapeCircleIcon size={size} className={cn('text-slate-400 shrink-0', className)} />;
    default:
      return;
  }
}

export default ImpactIcon;
