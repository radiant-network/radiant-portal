import { useState } from 'react';
import { FlipHorizontal2Icon } from 'lucide-react';

import type { GermlineCNVOccurrence } from '@/api/api';
import IGVDialog from '@/components/base/igv/igv-dialog';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useCaseIdFromParam } from '@/utils/helper';

type CNVIGVCellProps = {
  occurrence: GermlineCNVOccurrence;
  hasIGVFiles: boolean;
};

function CNVIGVCell({ occurrence, hasIGVFiles }: CNVIGVCellProps) {
  const { t } = useI18n();
  const caseId = useCaseIdFromParam();
  const [igvOpen, setIGVOpen] = useState<boolean>(false);
  const { cnv_id, seq_id, chromosome, start, end } = occurrence;
  const label = t('variant.actions.open_in_igv');

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block">
            <Button
              type="button"
              variant="outline"
              size="2xs"
              iconOnly
              aria-label={label}
              disabled={!hasIGVFiles}
              onClick={() => setIGVOpen(true)}
            >
              <FlipHorizontal2Icon />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{hasIGVFiles ? label : t('variant.actions.open_in_igv_disabled_tooltip')}</TooltipContent>
      </Tooltip>
      {hasIGVFiles && (
        <IGVDialog
          context="cnv"
          open={igvOpen}
          setOpen={setIGVOpen}
          caseId={caseId}
          seqId={seq_id}
          locus={cnv_id}
          start={start}
          end={end}
          chromosome={chromosome}
        />
      )}
    </>
  );
}

export default CNVIGVCell;
