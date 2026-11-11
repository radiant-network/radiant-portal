import type { ReactNode } from 'react';

type SidebarItemProps = {
  label: string;
  description: ReactNode;
  action: ReactNode;
};

function SidebarItem({ label, description, action }: SidebarItemProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      {action}
    </div>
  );
}

export default SidebarItem;
