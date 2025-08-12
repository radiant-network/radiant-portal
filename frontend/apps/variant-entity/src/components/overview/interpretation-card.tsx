import { Card, CardContent, CardHeader, CardProps } from '@/components/base/ui/card';
import { HospitalIcon } from 'lucide-react';
import { useI18n } from '@/components/hooks/i18n';
import { VariantOverview } from '@/api/api';
import ClassificationSection from './classification-section';
import { useParams } from 'react-router';
import { VariantEntityTabs } from '@/types';

type InterpretationCardProps = CardProps & {
  data: VariantOverview;
};

function InterpretationCard({ data, ...props }: InterpretationCardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <HospitalIcon />
          <span className="font-semibold">{t('variantEntity.overview.interpretation')}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ClassificationSection
          href={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`}
          title={t('variantEntity.overview.myNetwork')}
          counts={data.interpretation_classification_counts ?? {}}
          emptyText={t('variantEntity.overview.noInterpretationNetwork')}
        />
        {/*
        <ClassificationSection
          href={`/variants/entity/${params.locusId}#${VariantEntityTabs.EvidenceAndConditions}`}
          title={t('variantEntity.overview.clinVar')}
          counts={data.interpretation_classification_counts ?? {}}
          emptyText={t('variantEntity.overview.noClinVarInterpretation')}
        />
        */}
      </CardContent>
    </Card>
  );
}

export default InterpretationCard;
