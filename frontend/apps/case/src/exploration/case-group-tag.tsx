import { Mail, X } from 'lucide-react';
import useSWR from 'swr';

import type { SearchCriterion } from '@/api/api';
import { CopyButton } from '@/components/base/buttons/copy-button';
import { badgeVariants } from '@/components/base/shadcn/badge';
import { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger } from '@/components/base/shadcn/hover-card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { caseApi } from '@/utils/api';

import { formatCaseGroupDate } from './case-group-date';

const STAT_CRITERION: SearchCriterion = { field: 'priority_code', operator: 'in', value: ['stat'] };

type CaseGroupTagProps = {
  name: string;
  createdOn?: string;
  loading?: boolean;
  criterion?: SearchCriterion;
  onRemove: () => void;
};

async function fetchCount(tenant: string, criteria: SearchCriterion[]) {
  const response = await caseApi.searchCases(tenant, { search_criteria: criteria, limit: 1 });
  return response.data.count;
}

function CaseGroupTag({ name, createdOn, loading = false, criterion, onRemove }: CaseGroupTagProps) {
  const { t, language } = useI18n();
  const { tenant } = useTenant();

  const { data: count = 0 } = useSWR(
    criterion ? ['case-group-count', tenant, name] : null,
    () => fetchCount(tenant, [criterion!]),
    { revalidateOnFocus: false },
  );
  const { data: statCount = 0 } = useSWR(
    criterion ? ['case-group-stat-count', tenant, name] : null,
    () => fetchCount(tenant, [criterion!, STAT_CRITERION]),
    { revalidateOnFocus: false },
  );

  if (loading) return <Skeleton className="h-8 w-72" />;

  const label = createdOn
    ? t('case_exploration.case_group.label', { date: formatCaseGroupDate(new Date(createdOn), language) })
    : name;
  const countLabel = t('case_exploration.case_group.count', { count });
  const statLabel = t('case_exploration.case_group.stat_count', { count: statCount });
  const styles = badgeVariants({ variant: 'default', size: 'lg', closable: true });

  return (
    <div className={styles.base({ className: 'h-8 gap-2 [&_svg]:size-4' })}>
      <HoverCard openDelay={200} closeDelay={200}>
        <HoverCardTrigger asChild>
          <span
            tabIndex={0}
            className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Mail aria-hidden />
            {label}
            <span className="sr-only">
              , {countLabel}
              {statCount > 0 && `, ${statLabel}`}
            </span>
          </span>
        </HoverCardTrigger>
        <HoverCardPortal>
          <HoverCardContent side="top" align="start" className="w-80 space-y-1">
            <p className="font-semibold">
              {countLabel}
              {statCount > 0 && (
                <>
                  {' • '}
                  <span className="text-indicator-red">{statLabel}</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="truncate font-mono text-sm text-muted-foreground" title={name}>
                {name}
              </span>
              <CopyButton value={name} ariaLabel={t('a11y.case_group_tag.copy_name')} />
            </div>
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCard>
      <button
        type="button"
        className={styles.closeIcon({ className: 'hover:cursor-pointer' })}
        aria-label={t('a11y.case_group_tag.remove')}
        onClick={onRemove}
      >
        <X />
      </button>
    </div>
  );
}

export default CaseGroupTag;
