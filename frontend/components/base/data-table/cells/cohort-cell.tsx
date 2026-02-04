import { useI18n } from '@/components/hooks/i18n';

import AnchorLink from '../../navigation/anchor-link';

import EmptyCell from './empty-cell';
import TextCell from './text-cell';

type CohortCellProps = {
  cohort?: string;
  locusId?: string;
};

const getCohortLink = (cohort: string, locusId?: string) => {
  if (!locusId) return undefined;
  switch (cohort) {
    case 'topmed_bravo':
      return `https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/${locusId}`;
    case 'gnomad_genomes_v3':
      return `https://gnomad.broadinstitute.org/region/${locusId}?dataset=gnomad_r3`;
    default:
      return undefined;
  }
};

function CohortCell({ cohort, locusId }: CohortCellProps) {
  const { t } = useI18n();

  if (!cohort) return <EmptyCell />;

  const cohortLink = getCohortLink(cohort, locusId);
  if (!cohortLink) {
    return <TextCell>{t(`variant_entity.frequency.public_cohorts.${cohort}`)}</TextCell>;
  }

  return (
    <AnchorLink size="sm" href={cohortLink} className="hover:underline" target="_blank" rel="noreferrer">
      {t(`variant_entity.frequency.public_cohorts.${cohort}`)}
    </AnchorLink>
  );
}

export default CohortCell;
