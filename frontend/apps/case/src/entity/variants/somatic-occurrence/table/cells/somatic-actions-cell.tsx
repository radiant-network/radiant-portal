import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Row } from '@tanstack/react-table';
import { ArrowUpRight, EyeIcon, FlipHorizontal2Icon } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import { useI18n } from '@/components/hooks/i18n';
import { SELECTED_VARIANT_PARAM } from '@/entity/variants/constants';
import { useCaseIdFromParam } from '@/utils/helper';
import IGVDialog from 'components/base/igv/igv-dialog';

type SomaticActionsMenuProps = {
  row: Row<GermlineSNVOccurrence>;
};

function SomaticActionsCell({ row }: SomaticActionsMenuProps) {
  const { t } = useI18n();
  const [igvOpen, setIgvOpen] = useState<boolean>(false);
  const caseId = useCaseIdFromParam();
  const { locus_id, chromosome, start, rsnumber, seq_id, locus } = row.original;
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePreview = useCallback(() => {
    searchParams.set(SELECTED_VARIANT_PARAM, locus_id);
    setSearchParams(searchParams, { replace: true });
  }, []);

  const handleNavigateToVariantPage = useCallback(() => {
    window.open(`/variants/entity/${locus_id}`, '_blank');
  }, [locus_id]);

  return (
    <>
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
        size="2xs"
        tooltip={t('variant.actions.view_variant')}
        tooltipSide="top"
        actions={[
          {
            icon: <EyeIcon />,
            label: t('variant.actions.preview'),
            onClick: handlePreview,
          },
          {
            icon: <ArrowUpRight />,
            label: t('variant.actions.view_variant'),
            onClick: handleNavigateToVariantPage,
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
        onDefaultAction={handleNavigateToVariantPage}
      >
        <ArrowUpRight size={16} />
      </ActionButton>
    </>
  );
}
export default SomaticActionsCell;
