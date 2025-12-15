import { ComponentProps } from 'react';
import { formatDate } from 'date-fns';

import { CaseEntity } from '@/api/api';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

function AnalysisCard({ data, ...props }: { data: CaseEntity } & ComponentProps<'div'>) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle size="xl">{t('case_entity.details.analysis_overview')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Title with codes */}
        <div className="text-base font-semibold">{`${data.analysis_catalog_code} - ${data.analysis_catalog_name}`}</div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Static information */}
          <div className="flex w-full justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <InformationField
                label={t('case_entity.details.created_on')}
                tooltipText={t('case_entity.details.date_format_tooltip')}
              >
                {data.created_on && formatDate(data.created_on, t('common.date'))}
              </InformationField>

              <InformationField
                label={t('case_entity.details.last_update')}
                tooltipText={t('case_entity.details.date_format_tooltip')}
              >
                {data.updated_on && formatDate(data.updated_on, t('common.date'))}
              </InformationField>

              <InformationField label={t('case_entity.details.prescriber')}>{data.prescriber}</InformationField>

              <InformationField
                label={t('case_entity.details.prescribing_inst')}
                labelTooltipText={t('case_entity.details.prescribing_inst_tooltip')}
                tooltipText={data.ordering_organization_name}
              >
                {data.ordering_organization_code}
              </InformationField>

              <InformationField
                label={t('case_entity.details.diag_lab')}
                tooltipText={data.diagnosis_lab_name}
                labelTooltipText={t('case_entity.details.diag_lab_tooltip')}
              >
                {data.diagnosis_lab_code}
              </InformationField>

              <InformationField label={t('case_entity.details.project_code')} tooltipText={data.project_name}>
                {data.project_code}
              </InformationField>
            </div>
          </div>

          {/* Right side - Status information with dropdowns */}
          {/* <div>
            <div className="grid md:grid-cols-[1fr_minmax(160px,180px)] grid-cols-2 gap-y-3 gap-x-2 text-sm items-center">
              ...
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default AnalysisCard;
