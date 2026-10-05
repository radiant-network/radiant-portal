import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

type CancerPredispositionsCardProps = {
  cancer_predisposition?: string[];
} & CardProps;

function CancerPredispositionsCard({ cancer_predisposition, ...cardProps }: CancerPredispositionsCardProps) {
  const { t } = useI18n();

  return (
    <Card data-cy="cancer-predispositions-card" {...cardProps}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle>{t('patient_entity.overview.cancer_predispositions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {cancer_predisposition && cancer_predisposition.length > 0 && (
          <InformationField label={t('patient_entity.overview.cancer_predispositions.cancer_predisposition')}>
            {cancer_predisposition.join(', ')}
          </InformationField>
        )}
      </CardContent>
    </Card>
  );
}

export default CancerPredispositionsCard;
