import * as React from 'react';
import { Button, ButtonProps } from '@/components/base/ui/button';
import { cn } from '@/components/lib/utils';

export interface MainNavbarButtonProps extends ButtonProps {
  title?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  active?: boolean;
}

function MainNavbarButton({ icon, rightIcon, title, iconOnly, active, className, ...props }: MainNavbarButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'text-muted-foreground text-base md:text-sm',
        {
          'h-10 py-2.5 px-2 md:px-3': !iconOnly,
          '[&_svg]:size-5': iconOnly,
          'text-primary': active,
        },
        className,
      )}
      iconOnly={iconOnly}
      {...props}
    >
      <span
        className={cn('flex flex-1 gap-2 items-center', {
          'justify-start md:justify-center': !iconOnly,
          'justify-center': iconOnly,
        })}
      >
        {icon} {iconOnly ? '' : title}
      </span>
      {rightIcon && <span className="[&_svg]:size-5">{rightIcon}</span>}
    </Button>
  );
}

export default MainNavbarButton;
