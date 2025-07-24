
import { Badge, BadgeProps } from "../../ui/badge";

type BadgeListProps = BadgeProps & {
  badges: string[];
};
function BadgeListCell({ badges, ...props }: BadgeListProps) {
  return (
    <div className="flex gap-1">
      {badges.map(badge => (
        <Badge className="capitalize" {...props}>{badge}</Badge>
      ))}
    </div>
  );
};
export default BadgeListCell;
