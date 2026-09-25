import { Biohazard, Users } from 'lucide-react';

import type { CaseEntity } from '@/api/api';
import CaseStatusDropdown from '@/components/base/dropdowns/case-status-dropdown';
import PriorityIndicator, { type PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { useCanEditCase } from '../../permissions/use-case-permissions';

type HeaderProps = {
  data?: CaseEntity | null;
  isLoading: boolean;
  onStatusChange?: () => void;
};

export default function Header({ data, isLoading, onStatusChange }: HeaderProps) {
  const { t } = useI18n();
  const canEditCase = useCanEditCase(data?.diagnosis_lab_code);

  return (
    <HeaderNavigation
      isLoading={isLoading}
      title={`${t('case_entity.header.case')} ${data?.case_id}`}
      badges={[
        {
          variant: 'secondary',
          className: 'h-5',
          children: (
            <>
              {data?.case_type === 'somatic' ? <Biohazard /> : <Users />}
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
        ...(data?.status_code
          ? [
              <CaseStatusDropdown
                key="status"
                caseId={data.case_id}
                status={data.status_code}
                canEdit={canEditCase}
                className="px-3 py-2"
                readOnlyTooltip={t('case_entity.header.status_tooltip')}
                onSaved={onStatusChange}
              />,
            ]
          : []),
      ]}
    />
  );
}
