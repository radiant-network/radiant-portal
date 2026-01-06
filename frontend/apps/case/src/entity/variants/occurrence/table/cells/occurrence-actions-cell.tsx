import { useState } from 'react';
import { CellContext } from '@tanstack/react-table';
import { ArrowUpRight, EyeIcon, FlipHorizontal2Icon } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import { useI18n } from '@/components/hooks/i18n';
import { useCaseIdFromParam } from '@/utils/helper';
import IGVDialog from 'components/base/igv/igv-dialog';

import OccurrenceSliderSheet from '../../slider/slider-occurrence-sheet';

function OccurrenceActionsMenu({ row }: CellContext<GermlineSNVOccurrence, any>) {
  const { t } = useI18n();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [igvOpen, setIgvOpen] = useState<boolean>(false);

  const caseId = useCaseIdFromParam();

  const { locus_id, chromosome, start, rsnumber, seq_id, locus } = row.original;

  const onNavigateToVariantPage = () => {
    window.open(`/variants/entity/${locus_id}`, '_blank');
  };

  return (
    <>
      <OccurrenceSliderSheet
        open={sheetOpen}
        setOpen={setSheetOpen}
        occurrence={row.original as GermlineSNVOccurrence}
      />
      {caseId && (
        <IGVDialog
          open={igvOpen}
          setOpen={setIgvOpen}
          caseId={caseId}
          seqId={seq_id}
          locus={locus}
          start={start}
          chromosome={chromosome}
        />
      )}
      <ActionButton
        className="px-0"
        variant="outline"
        size="xxs"
        actions={[
          {
            icon: <EyeIcon />,
            label: t('variant.actions.preview'),
            onClick: () => setSheetOpen(true),
          },
          {
            icon: <ArrowUpRight />,
            label: t('variant.actions.open_page'),
            onClick: onNavigateToVariantPage,
            hasSeparator: true,
          },
          {
            icon: <FlipHorizontal2Icon />,
            label: t('variant.actions.open_in_igv'),
            onClick: () => setIgvOpen(true),
          },
          {
            icon: <ArrowUpRight />,
            label: t('variant.actions.ucsc'),
            onClick: () => {
              window.open(
                `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${chromosome}%3A${start}-${start}`,
                '_blank',
                'noopener noreferrer',
              );
            },
          },
          {
            icon: <ArrowUpRight />,
            label: t('variant.actions.litvar'),
            onClick: () => {
              window.open(
                `https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${rsnumber}`,
                '_blank',
                'noopener noreferrer',
              );
            },
          },
        ]}
        onDefaultAction={onNavigateToVariantPage}
      >
        <ArrowUpRight size={16} />
      </ActionButton>
    </>
  );
}
export default OccurrenceActionsMenu;
