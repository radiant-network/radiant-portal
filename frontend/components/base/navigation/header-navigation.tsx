import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { tv, VariantProps } from 'tailwind-variants';

import { Badge, BadgeProps } from '@/components/base/shadcn/badge';
import { Button, ButtonProps } from '@/components/base/shadcn/button';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { cn } from '@/components/lib/utils';

import Container from '../container';

import AnchorLink from './anchor-link';

const headerNavigationVariants = tv({
  slots: {
    container: 'bg-background',
  },
  variants: {
    variant: {
      navigation: {
        container: '',
      },
      info: {
        container: 'border-b pb-4',
      },
    },
  },
  defaultVariants: {
    variant: 'navigation',
  },
});

type HeaderNavigationBadge = BadgeProps & { tooltipText?: string };

interface EntityHeaderProps extends VariantProps<typeof headerNavigationVariants> {
  isLoading?: boolean;
  badges?: HeaderNavigationBadge[];
  buttons?: ButtonProps[];
  statuses?: ReactNode[];
  title?: string;
  description?: string;
  previousPageUrl?: string;
}

function HeaderNavigation({
  title,
  badges,
  buttons,
  previousPageUrl,
  statuses,
  description,
  isLoading = true,
  variant,
}: EntityHeaderProps) {
  const style = headerNavigationVariants({ variant });

  if (isLoading) {
    return (
      <div className={style.container()}>
        <Container>
          <div className="flex flex-col gap-4 pt-4 px-6">
            <Skeleton className="w-96 h-8" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={style.container()}>
      <Container>
        <div className="flex flex-col gap-4 pt-4 px-6">
          <div className="flex justify-between">
            <div className={cn('flex flex-col', { 'gap-3': !!description })}>
              <div className="flex items-center gap-4 flex-wrap">
                {previousPageUrl && (
                  <AnchorLink href={previousPageUrl}>
                    <ArrowLeft size={20} />
                  </AnchorLink>
                )}
                <h1 className="text-2xl font-bold max-w-md text-ellipsis overflow-hidden whitespace-nowrap">{title}</h1>
                <div className="flex items-center gap-2">
                  {(badges ?? []).map((badgeProps, index) => {
                    const { tooltipText, ...restBadgeProps } = badgeProps;
                    if (tooltipText) {
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger>
                            <Badge {...restBadgeProps} />
                          </TooltipTrigger>
                          <TooltipContent>{tooltipText}</TooltipContent>
                        </Tooltip>
                      );
                    }
                    return <Badge key={index} {...restBadgeProps} />;
                  })}
                </div>
              </div>
              <h2 className="text-sm text-muted-foreground">{description}</h2>
            </div>
            <div className="flex items-center gap-2">
              {statuses && statuses.length > 0 && statuses.map((status, index) => <div key={index}>{status}</div>)}
              {buttons &&
                buttons.length > 0 &&
                buttons.map((buttonProps, index) => <Button key={buttonProps.key ?? index} {...buttonProps} />)}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default HeaderNavigation;
