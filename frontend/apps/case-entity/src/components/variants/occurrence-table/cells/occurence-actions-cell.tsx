import { CellContext } from '@tanstack/react-table';
import { ArrowUpRight } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import { useI18n } from '@/components/hooks/i18n';

function OccurenceActionsMenu({ row }: CellContext<GermlineSNVOccurrence, any>) {
  const { t } = useI18n();

  const { locus_id, chromosome, start, rsnumber } = row.original;

  const onNavigateToVariantPage = () => {
    window.open(`/variants/entity/${locus_id}`, '_blank');
  };

  return (
    <ActionButton
      className="px-0"
      variant="outline"
      size="xxs"
      actions={[
        // @TODO: to be added when the slider is implemented https://d3b.atlassian.net/browse/SJRA-558
        // {
        //   label: t('variant.actions.preview'),
        //   onClick: () => { },
        // },
        {
          label: t('variant.actions.open_page'),
          onClick: onNavigateToVariantPage,
        },
        //@TODO: to be added when IGV view is implemented https://d3b.atlassian.net/browse/SJRA-650
        // {
        //   label: t('variant.actions.open_in_igv'),
        //   onClick: () => { },
        // },
        {
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
  );
}
export default OccurenceActionsMenu;
