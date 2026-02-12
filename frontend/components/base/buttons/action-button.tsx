import { MoreVerticalIcon } from 'lucide-react';
import { VariantProps } from 'tailwind-variants';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Separator } from '@/components/base/shadcn/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { cn } from '@/lib/utils';

import { actionButtonVariants } from './button.variants';

interface Action {
  label: string;
  icon?: React.ReactElement;
  onClick: () => void;
  hasSeparator?: boolean;
}

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof actionButtonVariants> {
  children: React.ReactNode;
  actions: Action[];
  onDefaultAction: () => void;
  className?: string;
  tooltip?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

function ActionButton({
  actions,
  className,
  children,
  onDefaultAction,
  size,
  variant,
  tooltip,
  tooltipSide = 'top',
  ...btnProps
}: ActionButtonProps) {
  const style = actionButtonVariants({ size, variant, disabled: btnProps.disabled });

  const defaultButton = (
    <button onClick={onDefaultAction} className={cn(style.base(), 'rounded-r-none')} {...btnProps}>
      {children}
    </button>
  );

  return (
    <TooltipProvider>
      <div className={style.container({ className })}>
        {/* Default Action Button */}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>{defaultButton}</TooltipTrigger>
            <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
          </Tooltip>
        ) : (
          defaultButton
        )}

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
    </TooltipProvider>
  );
}

export default ActionButton;
