
import { Badge, BadgeProps } from "../../ui/badge";
import EmptyCell from "./empty-cell";

type BadgeListProps = BadgeProps & {
  badges?: string[];
};
function BadgeListCell({ badges, ...props }: BadgeListProps) {

  if (!badges || badges?.length === 0) return <EmptyCell />;

  return (
    <div className="flex gap-1">
      {badges.map(badge => (
        <Badge className="capitalize" {...props}>{badge}</Badge>
      ))}
    </div>
  );
};
export default BadgeListCell;
