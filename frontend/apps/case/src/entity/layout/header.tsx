import { Users } from 'lucide-react';

import { CaseEntity } from '@/api/api';
import AssayStatusBadge, { AssayStatus } from '@/components/base/badges/assay-status-badge';
import PriorityIndicator, { PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';
import PageHeader from '@/components/base/page/page-header';
import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

export default function Header({ data, isLoading }: { data?: CaseEntity | null; isLoading: boolean }) {
  const { t } = useI18n();

  return (
    <PageHeader
      isLoading={isLoading}
      title={`${t('case_entity.header.case')} ${data?.case_id}`}
      badges={[
        {
          variant: 'secondary',
          className: 'h-5',
          children: (
            <>
              <Users />
              {t(`case_entity.header.${data?.case_type ?? 'unknown'}`)}
            </>
          ),
        },
        {
          variant: 'outline',
          className: 'h-5',
          children: data?.analysis_catalog_code,
          tooltipText: data?.analysis_catalog_name,
        },
      ]}
      statuses={[
        <Tooltip key="priority">
          <TooltipTrigger>
            <Badge variant="outline" className="px-3 py-2">
              <PriorityIndicator code={(data?.priority_code as PriorityIndicatorCode) || 'routine'} />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{t(`case_entity.header.priority_tooltip`)}</TooltipContent>
        </Tooltip>,
        <Tooltip key="status">
          <TooltipTrigger>
            <AssayStatusBadge className="px-3 py-2" status={(data?.status_code as AssayStatus) || 'unknown'} />
          </TooltipTrigger>
          <TooltipContent>{t(`case_entity.header.status_tooltip`)}</TooltipContent>
        </Tooltip>,
      ]}
    />
  );
}
