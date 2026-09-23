import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { CaseEntityCasesTabs } from '@/components/cores/types/case-tabs';
import { VariantEntityTabs } from '@/components/cores/types/variant-tabs';
import { useTenantPath } from '@/components/hooks/use-tenant';
import { toExponentialNotation } from '@/components/lib/number-format';

type NumberCellProps = {
  pc?: number;
  pf?: number;
  locusId?: string;
};

function SomaticGermlineFrequencyCell({ pc, pf, locusId }: NumberCellProps) {
  const tenantPath = useTenantPath();

  if (pc === undefined || locusId === undefined || pf === undefined) {
    return <EmptyCell />;
  }

  const scientificNotationPF = toExponentialNotation(pf);
  return (
    <AnchorLink
      size="sm"
      href={tenantPath(
        `/variants/entity/${locusId}?tab=${VariantEntityTabs.Cases}&cases=${CaseEntityCasesTabs.InterpretedCases}`,
      )}
      target="_blank"
    >
      {pc} ({scientificNotationPF ? scientificNotationPF : pf})
    </AnchorLink>
  );
}

export default SomaticGermlineFrequencyCell;
