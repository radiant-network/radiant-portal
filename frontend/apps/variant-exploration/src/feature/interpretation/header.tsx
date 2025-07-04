import { Occurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import { Link } from 'react-router';

type InterpretationVariantHeaderProps = {
  occurrence: Occurrence;
};

function InterpretationVariantHeader({ occurrence }: InterpretationVariantHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-4">
      <AnchorLink component={Link} to={`/variants/entity/${occurrence.locus_id}`} size="lg">
        <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
      </AnchorLink>
      <Badge>{t('variant.interpretationForm.header.germline')}</Badge>
      <Separator className="h-6" orientation="vertical" />
      <span>Cas-index (123456)</span>
      <Badge variant="blue">TODO</Badge>
    </div>
  );
}

export default InterpretationVariantHeader;
