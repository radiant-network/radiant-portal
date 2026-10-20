import { Fragment } from 'react';
import { MoreVerticalIcon } from 'lucide-react';
import type { VariantProps } from 'tailwind-variants';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Separator } from '@/components/base/shadcn/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

import { actionButtonVariants } from './button.variants';

interface Action {
  id: string;
  label: string;
  icon?: React.ReactElement;
  onClick: () => void;
  hasSeparator?: boolean;
  tooltip?: string;
  disabled?: boolean;
}

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof actionButtonVariants> {
  children: React.ReactNode;
  actions: Action[];
  onDefaultAction: () => void;
  className?: string;
  tooltip?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  dataCy?: string;
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
  dataCy,
  ...btnProps
}: ActionButtonProps) {
  const { t } = useI18n();
  const style = actionButtonVariants({ size, variant, disabled: btnProps.disabled });

  const defaultButton = (
    <button onClick={onDefaultAction} data-cy={dataCy} className={cn(style.base(), 'rounded-r-none')} {...btnProps}>
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
            <button
              className={cn(style.base(), style.actionsButton())}
              {...btnProps}
              aria-label={t('a11y.action_button.more')}
            >
              <MoreVerticalIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="py-1 px-0">
            {actions.map((action, index) => (
              <Fragment key={index}>
                {action.tooltip ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        data-cy={`menu-item-${action.id}`}
                        disabled={action.disabled ?? false}
                        onClick={action.disabled ? undefined : action.onClick}
                      >
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>{action.tooltip}</TooltipContent>
                  </Tooltip>
                ) : (
                  <DropdownMenuItem
                    data-cy={`menu-item-${action.id}`}
                    disabled={action.disabled ?? false}
                    onClick={action.disabled ? undefined : action.onClick}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                )}
                {action.hasSeparator && <Separator className="my-1" />}
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

export default ActionButton;
