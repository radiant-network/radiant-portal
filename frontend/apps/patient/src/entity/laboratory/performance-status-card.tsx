import type { PatientPerformanceScore } from '@/api/api';
import SkeletonCard from '@/components/base/cards/skeleton-card';
import Empty from '@/components/base/empties/empty';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import PerfSection from './sections/perf-section';

type PerformanceStatusCardProps = {
  performanceStatus?: PatientPerformanceScore[];
  isLoading?: boolean;
} & CardProps;

function PerformanceStatusCard({ performanceStatus, isLoading, ...cardProps }: PerformanceStatusCardProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <SkeletonCard
        data-cy="performance-status-card"
        title={t('patient_entity.laboratory.performance_status.title')}
        rows={2}
        {...cardProps}
      />
    );
  }

  const scores = performanceStatus ?? [];

  return (
    <Card data-cy="performance-status-card" {...cardProps}>
      <CardHeader bordered>
        <CardTitle>{t('patient_entity.laboratory.performance_status.title')}</CardTitle>
      </CardHeader>
      {scores.length === 0 ? (
        <CardContent>
          <Empty bordered showIcon={false} description={t('patient_entity.laboratory.performance_status.empty')} />
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex flex-col gap-3">
            {scores.map((score, index) => (
              <PerfSection key={`${score.scale}-${index}`} score={score} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default PerformanceStatusCard;
