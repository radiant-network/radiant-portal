import { useI18n } from '@/components/hooks/i18n';
import { getCohortUrl } from '@/components/lib/external-links';

import AnchorLink from '../../navigation/anchor-link';

import EmptyCell from './empty-cell';
import TextCell from './text-cell';

type CohortCellProps = {
  cohort?: string;
  locusId?: string;
};

function CohortCell({ cohort, locusId }: CohortCellProps) {
  const { t } = useI18n();

  if (!cohort) return <EmptyCell />;

  const cohortLink = getCohortUrl(cohort, locusId);
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
