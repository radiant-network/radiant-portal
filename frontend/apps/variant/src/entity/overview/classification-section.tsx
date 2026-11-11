import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import ClassificationBadge from '@/components/base/badges/classification-badge';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

type ClassificationSectionProps = {
  title: string;
  counts: Record<string, number>;
  emptyText: string;
  href?: string;
  dataCy?: string;
};

function ClassificationSection({ title, counts, emptyText, href, dataCy }: ClassificationSectionProps) {
  const { t } = useI18n();

  return (
    <div data-cy={dataCy} className="space-y-3">
      <div className="flex items-center gap-1">
        <span className="font-semibold text-sm">{title}</span>
        {href && (
          <Button asChild iconOnly size="xs" variant="ghost">
            <Link data-cy={`${dataCy}-link`} to={href} aria-label={t('a11y.classification_section.open', { title })}>
              <ArrowUpRight className="size-4!" />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(counts).length ? (
          Object.entries(counts).map(([key, count]) => (
            <ClassificationBadge key={key} data-cy={key} value={key} count={count > 1 ? count : undefined} />
          ))
        ) : (
          <span className="text-muted-foreground text-xs">{emptyText}</span>
        )}
      </div>
    </div>
  );
}

export default ClassificationSection;
