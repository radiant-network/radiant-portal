import { BrainCircuit } from 'lucide-react';

import { VariantOverview } from '@/api/api';
import { Card, CardContent, CardHeader, CardProps } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import ClassificationSection from './classification-section';

type ClassificationCardProps = CardProps & {
  data: VariantOverview;
};

function ClassificationCard({ data, ...props }: ClassificationCardProps) {
  const { t } = useI18n();

  return (
    <Card data-cy="classification-card" {...props}>
      <CardHeader>
        <div className="flex items-center gap-6">
          <BrainCircuit />
          <span className="font-semibold">{t('variant_entity.overview.classification')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ClassificationSection
          title={t('variant_entity.overview.exomiser')}
          counts={data.exomiser_acmg_classification_counts ?? {}}
          emptyText={t('variant_entity.overview.no_exomiser_score')}
        />
      </CardContent>
    </Card>
  );
}

export default ClassificationCard;
