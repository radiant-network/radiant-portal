import type { GermlineCNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { useI18n } from '@/components/hooks/i18n';
import { getClingenCnvUrl } from '@/components/lib/external-links';

type ClingenCellProps = {
  occurrence: GermlineCNVOccurrence;
};

function ClingenCell({ occurrence }: ClingenCellProps) {
  const { t } = useI18n();
  const { start, end, chromosome } = occurrence;

  return (
    <AnchorLink
      href={getClingenCnvUrl(chromosome, start, end)}
      target="_blank"
      external
      aria-label={t('a11y.clingen_cell.open')}
    />
  );
}
export default ClingenCell;
