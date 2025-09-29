import { MoreVerticalIcon } from 'lucide-react';
import { VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';

import { actionButtonVariants } from './button.variants';

interface Action {
  label: string;
  icon?: React.ReactElement;
  onClick: () => void;
  hasSeparator?: boolean;
}

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  children: React.ReactNode;
  actions: Action[];
  onDefaultAction: () => void;
  className?: string;
}

function ActionButton({
  actions,
  className,
  children,
  onDefaultAction,
  size,
  variant,
  ...btnProps
}: ActionButtonProps) {
  const style = actionButtonVariants({ size, variant, disabled: btnProps.disabled });

  return (
    <div className={style.container({ className })}>
      {/* Default Action Button */}
      <button onClick={onDefaultAction} className={cn(style.base(), 'rounded-r-none')} {...btnProps}>
        {children}
      </button>

      {/* Dropdown Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={btnProps.disabled}>
          <button className={cn(style.base(), style.actionsButton())} {...btnProps}>
            <MoreVerticalIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="py-1 px-0">
          {actions.map((action, index) => (
            <>
              <DropdownMenuItem key={index} onClick={action.onClick}>
                {action.icon}
                {action.label}
              </DropdownMenuItem>
              {action.hasSeparator && <Separator className="my-1" />}
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ActionButton;
