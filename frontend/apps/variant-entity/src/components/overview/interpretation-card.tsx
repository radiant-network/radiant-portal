import { useParams } from 'react-router';
import { HospitalIcon } from 'lucide-react';

import { VariantOverview } from '@/api/api';
import { Card, CardContent, CardHeader, CardProps } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { VariantEntityTabs } from '@/types';

import ClassificationSection from './classification-section';

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
          <span className="font-semibold">{t('variant_entity.overview.interpretation')}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ClassificationSection
          href={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`}
          title={t('variant_entity.overview.my_network')}
          counts={data.interpretation_classification_counts ?? {}}
          emptyText={t('variant_entity.overview.no_interpretation_network')}
        />
        {/*
        <ClassificationSection
          href={`/variants/entity/${params.locusId}#${VariantEntityTabs.EvidenceAndConditions}`}
          title={t('variant_entity.overview.clin_var')}
          counts={data.interpretation_classification_counts ?? {}}
          emptyText={t('variant_entity.overview.no_clin_var_interpretation')}
        />
        */}
      </CardContent>
    </Card>
  );
}

export default InterpretationCard;
