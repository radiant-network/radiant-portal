import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import ClassificationBadge from '@/components/base/badges/classification-badge';
import { Button } from '@/components/base/ui/button';

type ClassificationSectionProps = {
  title: string;
  counts: Record<string, number>;
  emptyText: string;
  href?: string;
};

function ClassificationSection({ title, counts, emptyText, href }: ClassificationSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        <span className="font-semibold text-sm">{title}</span>
        {href && (
          <Link to={href}>
            <Button iconOnly size="xs" variant="ghost">
              <ArrowUpRight className="size-4!" />
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(counts).length ? (
          Object.entries(counts).map(([key, count]) => (
            <ClassificationBadge key={key} value={key} count={count > 1 ? count : undefined} />
          ))
        ) : (
          <span className="text-muted-foreground text-xs">{emptyText}</span>
        )}
      </div>
    </div>
  );
}

export default ClassificationSection;
