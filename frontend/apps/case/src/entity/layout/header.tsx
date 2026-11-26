import { Biohazard, FlaskRound, Users } from 'lucide-react';

import type { CaseEntity } from '@/api/api';
import { PROBAND } from '@/components/base/constants';
import CasePriorityDropdown, { isCasePriority } from '@/components/base/dropdowns/case-priority-dropdown';
import CaseStatusDropdown from '@/components/base/dropdowns/case-status-dropdown';
import PriorityIndicator, { type PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';
import LibrechatButton from '@/components/base/librechat/librechat-button';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import CaseAssignment from '../../components/case-assignment';
import { useCanEditCase } from '../../permissions/use-case-permissions';

type HeaderProps = {
  data?: CaseEntity | null;
  isLoading: boolean;
  onStatusChange?: () => void;
  onPriorityChange?: () => void;
  onAssignmentChange?: () => void;
};

export default function Header({ data, isLoading, onStatusChange, onPriorityChange, onAssignmentChange }: HeaderProps) {
  const { t } = useI18n();
  const canEditCase = useCanEditCase(data?.diagnosis_lab_code);

  const probandSampleId = data?.sequencing_experiments.find(
    seqExp => seqExp.relationship_to_proband === PROBAND,
  )?.sample_submitter_id;

  return (
    <HeaderNavigation
      isLoading={isLoading}
      backLink={{ label: t('main_navbar.links.cases'), to: '/case' }}
      title={`${t('case_entity.header.case')} ${data?.case_id}`}
      metadata={
        probandSampleId ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 pr-2 text-base font-medium">
                <FlaskRound className="size-4" aria-hidden="true" />
                <span className="sr-only">{t('case_entity.details.sample_id')}</span>
                {probandSampleId}
              </span>
            </TooltipTrigger>
            <TooltipContent>{t('case_entity.details.sample_id')}</TooltipContent>
          </Tooltip>
        ) : undefined
      }
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
        ...(data
          ? [
              <CaseAssignment
                key="assignment"
                caseId={data.case_id}
                diagnosisLabCode={data.diagnosis_lab_code}
                assignees={data.assignees}
                buttonVariant="secondary"
                onSaved={onAssignmentChange}
              />,
            ]
          : []),
        data && canEditCase && isCasePriority(data.priority_code) ? (
          <CasePriorityDropdown
            key="priority"
            caseId={data.case_id}
            priority={data.priority_code}
            size="sm"
            onSaved={onPriorityChange}
          />
        ) : (
          <Tooltip key="priority">
            <TooltipTrigger>
              <Badge variant="outline" size="lg">
                <PriorityIndicator code={(data?.priority_code as PriorityIndicatorCode) || 'routine'} size="sm" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{t(`case_entity.header.priority_tooltip`)}</TooltipContent>
          </Tooltip>
        ),
        ...(data?.status_code
          ? [
              <CaseStatusDropdown
                key="status"
                caseId={data.case_id}
                status={data.status_code}
                canEdit={canEditCase}
                size="sm"
                readOnlyTooltip={t('case_entity.header.status_tooltip')}
                onSaved={onStatusChange}
              />,
            ]
          : []),
        ...(data?.case_id ? [<LibrechatButton key="librechat" size="sm" caseId={data.case_id} />] : []),
      ]}
    />
  );
}
