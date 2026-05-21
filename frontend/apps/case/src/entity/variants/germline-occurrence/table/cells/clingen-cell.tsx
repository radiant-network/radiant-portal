import { GermlineCNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

/**
 * @TODO: genome_build will be added later in API
 */
const genome_build = `GRCh38`;
type ClingenCellProps = {
  occurrence: GermlineCNVOccurrence;
};

/**
 * Url: https://search.clinicalgenome.org/kb/regions?page=1&type=genome_build&region=chrchromosome%3Astart-end&size=25&search=
 */
function ClingenCell({ occurrence }: ClingenCellProps) {
  const { start, end, chromosome } = occurrence;
  return (
    <AnchorLink
      href={`https://search.clinicalgenome.org/kb/regions?page=1&type=${genome_build}&region=chr${chromosome}%3A${start}-${end}&size=25&search=`}
      target="_blank"
      external
    />
  );
}
export default ClingenCell;
