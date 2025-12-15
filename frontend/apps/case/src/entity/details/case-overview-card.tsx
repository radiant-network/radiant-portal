import { ComponentProps } from 'react';
import { formatDate } from 'date-fns';

import { CaseEntity } from '@/api/api';
import AnalysisTypeCodeBadge, { AnalysisTypeCode } from '@/components/base/badges/analysis-type-code-badge';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

function CaseOverviewCard({ data, ...props }: { data: CaseEntity } & ComponentProps<'div'>) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle size="xl">{t('case_entity.details.case_overview')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Static information */}
          <div className="flex w-full justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              {data.case_id && (
                <InformationField label={t('case_entity.details.case_id')}>{data.case_id}</InformationField>
              )}

              {data.case_type && (
                <InformationField label={t('case_entity.details.case_type')}>
                  <AnalysisTypeCodeBadge code={data.case_type as AnalysisTypeCode} />
                </InformationField>
              )}

              {data.created_on && (
                <InformationField
                  label={t('case_entity.details.created_on_male')}
                  tooltipText={t('case_entity.details.date_format_tooltip')}
                >
                  {formatDate(data.created_on, t('common.date'))}
                </InformationField>
              )}

              {data.updated_on && (
                <InformationField
                  label={t('case_entity.details.last_update')}
                  tooltipText={t('case_entity.details.date_format_tooltip')}
                >
                  {formatDate(data.updated_on, t('common.date'))}
                </InformationField>
              )}

              {data.case_category_name && (
                <InformationField label={t('case_entity.details.pre_postnatal')}>
                  {data.case_category_name}
                </InformationField>
              )}

              {data.analysis_catalog_name && (
                <InformationField label={t('case_entity.details.requested_analysis')}>
                  {data.analysis_catalog_name}
                </InformationField>
              )}

              {data.panel_code && (
                <InformationField label={t('case_entity.details.panel')}>
                  {data.panel_code} - {data.panel_name}
                </InformationField>
              )}
            </div>
          </div>

          {/* Right side - Static information */}
          <div className="flex w-full justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              {data.prescriber && (
                <InformationField label={t('case_entity.details.prescriber')}>{data.prescriber}</InformationField>
              )}

              {data.ordering_organization_code && (
                <InformationField
                  label={t('case_entity.details.prescribing_inst')}
                  labelTooltipText={t('case_entity.details.prescribing_inst_tooltip')}
                  tooltipText={data.ordering_organization_name}
                >
                  {data.ordering_organization_code}
                </InformationField>
              )}

              {data.diagnosis_lab_code && (
                <InformationField
                  label={t('case_entity.details.diag_lab')}
                  tooltipText={data.diagnosis_lab_name}
                  labelTooltipText={t('case_entity.details.diag_lab_tooltip')}
                >
                  {data.diagnosis_lab_code}
                </InformationField>
              )}

              {data.project_code && (
                <InformationField label={t('case_entity.details.project_code')}>
                  {data.project_code} - {data.project_name}
                </InformationField>
              )}
            </div>
          </div>
        </div>

        {/* Case note */}
        <div className="flex flex-col p-4 gap-1.5 border rounded-md">
          <div className="text-foreground text-base font-semibold">{t('case_entity.details.case_note')}</div>
          <div className="text-foreground text-sm font-normal">{data.note}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CaseOverviewCard;
