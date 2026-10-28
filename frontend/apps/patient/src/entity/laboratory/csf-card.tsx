import type { PatientCsf } from '@/api/api';
import SkeletonCard from '@/components/base/cards/skeleton-card';
import Empty from '@/components/base/empties/empty';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import CsfCellFreeDnaSection from './sections/csf-cell-free-dna-section';
import CsfChemistrySection from './sections/csf-chemistry-section';
import CsfCytologySection from './sections/csf-cytology-section';

type CsfCardProps = {
  csf?: PatientCsf;
  canReadPhi: boolean;
  isLoading?: boolean;
} & CardProps;

function CsfCard({ csf, canReadPhi, isLoading, ...cardProps }: CsfCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return <SkeletonCard data-cy="csf-card" title={t('patient_entity.laboratory.csf.title')} rows={3} {...cardProps} />;
  }

  return (
    <Card data-cy="csf-card" {...cardProps}>
      <CardHeader bordered>
        <CardTitle>{t('patient_entity.laboratory.csf.title')}</CardTitle>
      </CardHeader>
      {csf ? (
        <CardContent className="flex flex-col gap-6">
          <CsfCytologySection cytology={csf.cytology} canReadPhi={canReadPhi} />
          <CsfChemistrySection csf={csf} canReadPhi={canReadPhi} />
          <CsfCellFreeDnaSection cellFreeDna={csf.cell_free_dna} canReadPhi={canReadPhi} />
        </CardContent>
      ) : (
        <CardContent>
          <Empty bordered showIcon={false} description={t('patient_entity.laboratory.csf.empty')} />
        </CardContent>
      )}
    </Card>
  );
}

export default CsfCard;
