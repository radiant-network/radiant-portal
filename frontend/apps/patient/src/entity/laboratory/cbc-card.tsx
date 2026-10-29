import type { PatientCbc } from '@/api/api';
import SkeletonCard from '@/components/base/cards/skeleton-card';
import Empty from '@/components/base/empties/empty';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import CbcTile from './tiles/cbc-tile';

type CbcAnalyteKey = 'wbc' | 'hemoglobin' | 'platelets' | 'anc';

const CBC_ANALYTES: ReadonlyArray<{ key: CbcAnalyteKey; normaliseAsCount: boolean }> = [
  { key: 'wbc', normaliseAsCount: true },
  { key: 'hemoglobin', normaliseAsCount: false },
  { key: 'platelets', normaliseAsCount: true },
  { key: 'anc', normaliseAsCount: true },
];

type CbcCardProps = {
  cbc?: PatientCbc;
  isLoading?: boolean;
} & CardProps;

function CbcCard({ cbc, isLoading, ...cardProps }: CbcCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return <SkeletonCard data-cy="cbc-card" title={t('patient_entity.laboratory.cbc.title')} rows={2} {...cardProps} />;
  }

  return (
    <Card data-cy="cbc-card" {...cardProps}>
      <CardHeader bordered>
        <CardTitle>{t('patient_entity.laboratory.cbc.title')}</CardTitle>
      </CardHeader>
      {cbc ? (
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CBC_ANALYTES.map(({ key, normaliseAsCount }) => (
              <CbcTile
                key={key}
                result={cbc[key]}
                day={cbc.day}
                date={cbc.date}
                label={t(`patient_entity.laboratory.cbc.analytes.${key}`)}
                normaliseAsCount={normaliseAsCount}
              />
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <Empty bordered showIcon={false} description={t('patient_entity.laboratory.cbc.empty')} />
        </CardContent>
      )}
    </Card>
  );
}

export default CbcCard;
