import { useSearchParams } from 'react-router';

import { GermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { SELECTED_VARIANT_PARAM } from '../../../constants';

type HgvsgCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function HgvsgCell({ occurrence }: HgvsgCellProps) {
  const [_, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_VARIANT_PARAM, occurrence.locus_id);
      return prev;
    });
  };

  return (
    <AnchorLink size="sm" variant="primary" className="overflow-hidden text-ellipsis" onClick={handleClick}>
      {occurrence.hgvsg}
    </AnchorLink>
  );
}

export default HgvsgCell;
