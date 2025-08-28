import { VariantProps } from 'tailwind-variants';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontalIcon } from 'lucide-react';
import { actionButtonVariants } from './button.variants';

interface Action {
  label: string;
  onClick: () => void;
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
            <MoreHorizontalIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {actions.map((action, index) => (
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ActionButton;
