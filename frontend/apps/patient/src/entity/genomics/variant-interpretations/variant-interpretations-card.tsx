import { useMemo } from 'react';

import type { PatientInterpretation } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { defaultSettings, getVariantInterpretationsColumns } from './variant-interpretations-table-settings';

type VariantInterpretationsCardProps = {
  interpretations: PatientInterpretation[];
  isLoading: boolean;
};

function VariantInterpretationsCard({ interpretations, isLoading }: VariantInterpretationsCardProps) {
  const { t } = useI18n();

  const columns = useMemo(() => getVariantInterpretationsColumns(t), [t]);

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{t('patient_entity.genomics.interpretations.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          id="patient-variant-interpretations"
          columns={columns}
          data={interpretations}
          defaultColumnSettings={defaultSettings}
          loadingStates={{ total: isLoading, list: isLoading }}
          pagination={{ type: 'hidden' }}
          total={interpretations.length}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default VariantInterpretationsCard;
