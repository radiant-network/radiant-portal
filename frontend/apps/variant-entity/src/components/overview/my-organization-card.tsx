import { Card, CardContent, CardProps } from '@/components/base/ui/card';
import { BrainCircuit, Hospital } from 'lucide-react';
import { Button } from '@/components/base/ui/button';
import { Link, useParams } from 'react-router';
import { VariantEntityTabs } from '@/types';
import { Badge } from '@/components/base/ui/badge';
import { Separator } from '@/components/base/ui/separator';
import NumberBadge from '@/components/base/number-badge';
import { useI18n } from '@/components/hooks/i18n';

function MyOrganizationCard(props: CardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  return (
    <Card {...props}>
      <CardContent className="p-6">
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
              <NumberBadge count={12}>
                <Badge variant="orange">LP</Badge>
              </NumberBadge>
              <NumberBadge count={3}>
                <Badge variant="red">P</Badge>
              </NumberBadge>
              <NumberBadge count={3}>
                <Badge variant="yellow">VUS</Badge>
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
                <span className="min-w-20 text-muted-foreground">Exomiser</span> <Badge variant="red">P</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="min-w-20 text-muted-foreground">Phenovar</span> <Badge variant="orange">LP</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="min-w-20 text-muted-foreground">Franklin</span> <Badge variant="red">P</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MyOrganizationCard;
