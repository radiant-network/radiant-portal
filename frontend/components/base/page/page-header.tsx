import { VariantProps, tv } from 'tailwind-variants';
import Container from '../container';
import { Skeleton } from '../ui/skeleton';
import { Button, ButtonProps } from '../ui/button';
import { Badge, BadgeProps } from '../ui/badge';
import { cn } from '@/components/lib/utils';
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

type PageHeaderBadge = BadgeProps & { tooltipsText?: string };

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
                  {(badges ?? []).map(badgeProps => {
                    if (badgeProps.tooltipsText) {
                      return (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge {...badgeProps} />
                          </TooltipTrigger>
                          <TooltipContent>{badgeProps.tooltipsText}</TooltipContent>
                        </Tooltip>
                      );
                    }
                    return <Badge {...badgeProps} />;
                  })}
                </div>
              </div>
              <h2 className="text-sm text-muted-foreground">{description}</h2>
            </div>
            <div className="flex items-center gap-2">
              {(buttons ?? []).map(buttonProps => (
                <Button {...buttonProps} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default PageHeader;
