import { Card, CardContent, CardHeader, CardProps } from '@/components/base/ui/card';
import { BrainCircuit } from 'lucide-react';
import { useI18n } from '@/components/hooks/i18n';
import { VariantOverview } from '@/api/api';
import ClassificationSection from './classification-section';
import { useParams } from 'react-router';

type ClassificationCardProps = CardProps & {
  data: VariantOverview;
};

function ClassificationCard({ data, ...props }: ClassificationCardProps) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <BrainCircuit />
          <span className="font-semibold">{t('variantEntity.overview.classification')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ClassificationSection
          title={t('variantEntity.overview.exomiser')}
          counts={data.exomiser_acmg_classification_counts ?? {}}
          emptyText={t('variantEntity.overview.noExomiserScore')}
        />
      </CardContent>
    </Card>
  );
}

export default ClassificationCard;
