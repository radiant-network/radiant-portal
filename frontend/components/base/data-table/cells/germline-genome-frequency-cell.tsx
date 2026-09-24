import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { CaseEntityCasesTabs } from '@/components/cores/types/case-tabs';
import { VariantEntityTabs } from '@/components/cores/types/variant-tabs';
import { useLocalPath } from '@/components/hooks/use-tenant';
import { toExponentialNotation } from '@/components/lib/number-format';

type GermlineGenomeFrequencyCellProps = {
  pc?: number;
  pf?: number;
  locusId?: string;
};

function GermlineGenomeFrequencyCell({ pc, pf, locusId }: GermlineGenomeFrequencyCellProps) {
  const localPath = useLocalPath();

  if (pc === undefined || locusId === undefined || pf === undefined) {
    return <EmptyCell />;
  }

  const scientificNotationPC = toExponentialNotation(pc);
  const scientificNotationPF = toExponentialNotation(pf);

  return (
    <AnchorLink
      size="sm"
      href={localPath(
        `/variants/entity/${locusId}?tab=${VariantEntityTabs.Cases}&cases=${CaseEntityCasesTabs.InterpretedCases}`,
      )}
      target="_blank"
    >
      {scientificNotationPC ? scientificNotationPC : pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </AnchorLink>
  );
}

export default GermlineGenomeFrequencyCell;
