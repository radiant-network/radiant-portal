import { Card, CardContent } from '@/components/base/ui/card';
import { BrainCircuit, Hospital } from 'lucide-react';
import { Button } from '@/components/base/ui/button';
import { Link, useParams } from 'react-router';
import { VariantEntityTabs } from '@/types';
import { Separator } from '@/components/base/ui/separator';
import NumberBadge from '@/components/base/number-badge';
import { useI18n } from '@/components/hooks/i18n';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import { VariantOverview } from '@/api/api';

type MyOrganizationCardProps = {
  data: VariantOverview;
};

function MyOrganizationCard({ data }: MyOrganizationCardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const exomiserCounts = data.exomiser_acmg_classification_counts ?? {};

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hospital className="text-accent-foreground opacity-50" />
              <span className="font-semibold">{t('variantEntity.overview.myOrganization')}</span>
            </div>
            <Link to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`}>
              <Button variant="outline" size="xs">
                {t('variantEntity.overview.details')}
              </Button>
            </Link>
          </div>
          <div className="ml-6">
            <div className="ml-3 flex items-center gap-3">
              <NumberBadge count={3} variant="ghost">
                <ClinVarBadge value="likely_pathogenic" abbreviated />
              </NumberBadge>
              <NumberBadge count={3} variant="ghost">
                <ClinVarBadge value="pathogenic" abbreviated />
              </NumberBadge>
              <NumberBadge count={3} variant="ghost">
                <ClinVarBadge value="uncertain_significance" abbreviated />
              </NumberBadge>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BrainCircuit className="text-accent-foreground opacity-50" />
            <span className="font-semibold">{t('variantEntity.overview.radiant')}</span>
          </div>
          <div className="ml-6 text-sm">
            <div className="ml-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="min-w-20 text-muted-foreground">Exomiser</span>
                {Object.keys(exomiserCounts).map(classification => (
                  <NumberBadge count={exomiserCounts[classification]} variant="ghost">
                    <ClinVarBadge id={classification} abbreviated value={classification}>
                      {classification}
                    </ClinVarBadge>
                  </NumberBadge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="min-w-20 text-muted-foreground">Phenovar</span>
                <ClinVarBadge value="likely_pathogenic" abbreviated />
              </div>
              <div className="flex items-center gap-2">
                <span className="min-w-20 text-muted-foreground">Franklin</span>
                <ClinVarBadge value="pathogenic" abbreviated />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MyOrganizationCard;
