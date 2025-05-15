import { Occurrence } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

type InterpretationVariantHeaderProps = {
  occurrence: Occurrence;
};

function InterpretationVariantHeader({ occurrence }: InterpretationVariantHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-4">
      <Button variant="link" className="px-0">
        <a href="#" className="flex text-lg gap-2 font-medium items-center justify-center outline-none">
          <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
          <SquareArrowOutUpRightIcon />
        </a>
      </Button>
      <Badge>{t('variant.interpretationForm.header.germline')}</Badge>
      <Separator className="h-6" orientation="vertical" />
      <span>Cas-index (123456)</span>
      <Badge variant="blue">TODO</Badge>
    </div>
  );
}

export default InterpretationVariantHeader;
