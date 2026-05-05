import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { toExponentialNotation } from '@/components/lib/number-format';

type GermlineGenomeFrequencyCellProps = {
  pc?: number;
  pf?: number;
  locusId?: string;
};

function GermlineGenomeFrequencyCell({ pc, pf, locusId }: GermlineGenomeFrequencyCellProps) {
  if (pc === undefined || locusId === undefined || pf === undefined) {
    return <EmptyCell />;
  }

  const scientificNotationPC = toExponentialNotation(pc);
  const scientificNotationPF = toExponentialNotation(pf);
  return (
    <AnchorLink size="sm" href={`/variants/entity/${locusId}?tab=patients&cases=InterpretedCases`} target="_blank">
      {scientificNotationPC ? scientificNotationPC : pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </AnchorLink>
  );
}

export default GermlineGenomeFrequencyCell;
