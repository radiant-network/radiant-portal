import { Button } from '@/components/base/ui/button';
import { Edit2Icon } from 'lucide-react';
import InterpretationDialog from '../interpretation/interpretation-dialog';
import { Occurrence } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { Separator } from '@/components/base/ui/separator';
import { Link } from 'react-router';
import AnchorLink from '@/components/base/navigation/anchor-link';

type OccurrenceExpandHeaderProps = {
  occurrence: Occurrence;
};

export default function OccurrenceExpandHeader({ occurrence }: OccurrenceExpandHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-8">
      <AnchorLink component={Link} to={`/variants/entity/${occurrence.locus_id}`} size="lg" target='_blank' external>
        <span className="max-w-72 overflow-hidden text-ellipsis">{occurrence.hgvsg}</span>
      </AnchorLink>
      <div className="flex items-center gap-5">
        <div className="flex gap-2">
          <InterpretationDialog
            occurrence={occurrence}
            renderTrigger={handleOpen => (
              <Button size="xs" onClick={handleOpen}>
                <Edit2Icon /> {t('occurrenceExpand.actions.interpret')}
              </Button>
            )}
          />
          {/* SJRA-389 <Button color="primary" size="xs">
            <Download />
            {t('occurrenceExpand.actions.downloadReport')}
          </Button>
          <Button color="primary" size="xs">
            <VariantIcon />
            {t('occurrenceExpand.actions.openIGV')}
          </Button> */}
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
