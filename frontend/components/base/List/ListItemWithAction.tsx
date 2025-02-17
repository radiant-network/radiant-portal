import React, { ReactNode } from "react";
import { IconButton } from "../Buttons";
import { Edit2Icon, Share2Icon, TrashIcon } from "lucide-react";
import { cn } from "@/components/lib/utils";
import ConditionalWrapper from "../ConditionalWrapper";

export type ListItemActionProps = Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  "onClick"
> & {
  title: ReactNode;
  description: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onClick?: () => void;
};

const ListItemAction = ({
  title,
  description,
  onEdit,
  onDelete,
  onShare,
  onClick,
  className,
  ...props
}: ListItemActionProps) => (
  <li
    className={cn(
      "flex border-b last:border-b-0 relative px-3 py-2 group",
      className
    )}
    {...props}
  >
    <div className="flex-1 gap-1 overflow-hidden">
      <ConditionalWrapper
        condition={!!onClick}
        wrapper={(children) => (
          <div
            onClick={onClick}
            className="underline hover:no-underline hover:cursor-pointer"
          >
            {children}
          </div>
        )}
      >
        <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </div>
      </ConditionalWrapper>
      <div className="text-xs">{description}</div>
    </div>
    <div className="flex items-start gap-1 ml-2">
      {onShare && <IconButton size="xs" icon={Share2Icon} onClick={onShare} />}
      {onEdit && <IconButton size="xs" icon={Edit2Icon} onClick={onEdit} />}
      {onDelete && <IconButton size="xs" icon={TrashIcon} onClick={onDelete} />}
    </div>
  </li>
);

export default ListItemAction;
