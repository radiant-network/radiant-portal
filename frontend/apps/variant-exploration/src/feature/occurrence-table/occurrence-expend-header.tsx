import { Button } from '@/components/base/ui/button';
import { Download, SquareArrowOutUpRightIcon } from 'lucide-react';
import InterpretationDialogButton from '../interpretation/interpretation-dialog-button';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Occurrence } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { Separator } from '@/components/base/ui/separator';

type OccurrenceExpendHeaderProps = {
  occurrence: Occurrence;
};

export default function OccurrenceExpendHeader({ occurrence }: OccurrenceExpendHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-8">
      <Button variant="link" className="px-0">
        <a href="#" className="flex text-lg gap-2 font-medium items-center justify-center outline-none">
          <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
          <SquareArrowOutUpRightIcon />
        </a>
      </Button>
      <div className="flex gap-2">
        <InterpretationDialogButton color="primary" size="xs" occurrence={occurrence} />
        <Button color="primary" size="xs">
          <Download />
          {t('occurrenceExpend.actions.downloadReport')}
        </Button>
        <Button color="primary" size="xs">
          <VariantIcon />
          {t('occurrenceExpend.actions.openIGV')}
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <Separator orientation="vertical" className="h-5" />
        <Button variant="link" className="px-0">
          <a href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${occurrence.chromosome}%3A${occurrence.start}-${occurrence.start}`} className="flex gap-2 items-center justify-center outline-none">
            <span className="overflow-hidden text-ellipsis">UCSC</span>
          </a>
        </Button>
        {occurrence.rsnumber && (
          <Button variant="link" className="px-0">
            <a
              href={`https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${occurrence.rsnumber}`}
              className="flex gap-2 items-center justify-center outline-none"
            >
              <span className="overflow-hidden text-ellipsis">LitVar</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
