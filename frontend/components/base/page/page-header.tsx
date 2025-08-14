import { tv, VariantProps } from 'tailwind-variants';

import { cn } from '@/components/lib/utils';

import Container from '../container';
import { Badge, BadgeProps } from '../ui/badge';
import { Button, ButtonProps } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const pageHeaderVariants = tv({
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

type PageHeaderBadge = BadgeProps & { tooltipText?: string };

interface EntityHeaderProps extends VariantProps<typeof pageHeaderVariants> {
  isLoading?: boolean;
  badges?: PageHeaderBadge[];
  buttons?: ButtonProps[];
  title?: string;
  description?: string;
}

function PageHeader({ title, badges, buttons, description, isLoading = true, variant }: EntityHeaderProps) {
  const style = pageHeaderVariants({ variant });

  if (isLoading) {
    return (
      <div className={style.container()}>
        <Container>
          <div className="flex flex-col gap-4 pt-4 px-3">
            <Skeleton className="w-96 h-8" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={style.container()}>
      <Container>
        <div className="flex flex-col gap-4 pt-4 px-3">
          <div className="flex justify-between">
            <div className={cn('flex flex-col', { 'gap-3': !!description })}>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{title}</h1>
                <div className="flex items-center gap-2">
                  {(badges ?? []).map((badgeProps, index) => {
                    if (badgeProps.tooltipText) {
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger>
                            <Badge {...badgeProps} />
                          </TooltipTrigger>
                          <TooltipContent>{badgeProps.tooltipText}</TooltipContent>
                        </Tooltip>
                      );
                    }
                    return <Badge key={index} {...badgeProps} />;
                  })}
                </div>
              </div>
              <h2 className="text-sm text-muted-foreground">{description}</h2>
            </div>
            <div className="flex items-center gap-2">
              {(buttons ?? []).map((buttonProps, index) => (
                <Button key={buttonProps.key ?? index} {...buttonProps} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default PageHeader;
