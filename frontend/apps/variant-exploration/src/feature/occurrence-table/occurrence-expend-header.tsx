import { Button } from '@/components/base/ui/button';
import { Download, Edit2Icon, SquareArrowOutUpRightIcon } from 'lucide-react';
import InterpretationDialogButton from '../interpretation/interpretation-dialog-button';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Occurrence } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { Separator } from '@/components/base/ui/separator';
import { Link } from 'react-router';

type OccurrenceExpendHeaderProps = {
  occurrence: Occurrence;
};

export default function OccurrenceExpendHeader({ occurrence }: OccurrenceExpendHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-8">
      <Button variant="link" className="px-0">
        <Link
          to={`/variants/entity/${occurrence.locus_id}`}
          className="flex text-lg gap-2 font-medium items-center justify-center outline-none"
        >
          <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
          <SquareArrowOutUpRightIcon />
        </Link>
      </Button>
      <div className="flex items-center gap-5">
        <div className="flex gap-2">
          <InterpretationDialogButton color="primary" size="xs" occurrence={occurrence}>
            <Edit2Icon /> {t('occurrenceExpend.actions.interpret')}
          </InterpretationDialogButton>
          <Button color="primary" size="xs">
            <Download />
            {t('occurrenceExpend.actions.downloadReport')}
          </Button>
          <Button color="primary" size="xs">
            <VariantIcon />
            {t('occurrenceExpend.actions.openIGV')}
          </Button>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex gap-4 items-center">
          <Button variant="link" className="px-0">
            <a
              href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${occurrence.chromosome}%3A${occurrence.start}-${occurrence.start}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              UCSC
            </a>
          </Button>
          {occurrence.rsnumber && (
            <Button variant="link" className="px-0">
              <a
                href={`https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${occurrence.rsnumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LitVAR
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
