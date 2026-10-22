import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

import { Separator } from '@/components/base/shadcn/separator';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';
import { cn } from '@/components/lib/utils';

type BackLinkProps = {
  to: string;
  children: string;
  className?: string;
};

function BackLink({ to, children, className }: BackLinkProps) {
  const { t } = useI18n();
  const localPath = useLocalPath();

  return (
    <div className="flex items-center gap-4">
      <Link
        to={localPath(to)}
        aria-label={t('a11y.back_link.back_to', { page: children })}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 size-7 md:size-auto rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          className,
        )}
      >
        <ChevronLeft className="size-4 shrink-0" />
        <span className="hidden md:inline">{children}</span>
      </Link>
      <Separator orientation="vertical" className="hidden md:block h-5" />
    </div>
  );
}

export default BackLink;
