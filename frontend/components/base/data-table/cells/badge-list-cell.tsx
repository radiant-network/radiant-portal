import { Badge, BadgeProps } from '@/components/base/shadcn/badge';

import EmptyCell from './empty-cell';

type BadgeListProps = BadgeProps & {
  badges?: string[];
};
function BadgeListCell({ badges, ...props }: BadgeListProps) {
  if (!badges || badges?.length === 0) return <EmptyCell />;

  return (
    <div className="flex gap-1">
      {badges.map((badge: string, index: number) => (
        <Badge key={index} className="capitalize" {...props}>
          {badge}
        </Badge>
      ))}
    </div>
  );
}
export default BadgeListCell;
