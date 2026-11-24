import type { SomaticCNVOccurrence } from '@/api/api';

import OverlappingGeneLinkCell from '../../../germline-occurrence/table/cells/overlapping-gene-link-cell';

type SomaticCNVOverlappingGenesCellProps = {
  occurrence: SomaticCNVOccurrence;
  label?: string;
};

function SomaticCNVOverlappingGenesCell({ occurrence, label }: SomaticCNVOverlappingGenesCellProps) {
  return (
    <OverlappingGeneLinkCell occurrence={occurrence} somatic>
      {label ? <>{label}</> : undefined}
    </OverlappingGeneLinkCell>
  );
}

export default SomaticCNVOverlappingGenesCell;
