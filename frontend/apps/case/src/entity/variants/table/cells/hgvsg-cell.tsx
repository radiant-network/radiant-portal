import { useSearchParams } from 'react-router';

import AnchorLink from '@/components/base/navigation/anchor-link';

import { SELECTED_VARIANT_PARAM } from '../../constants';

type HgvsgCellProps = {
  locusId: string;
  hgvsg: string;
};

function HgvsgCell({ locusId, hgvsg }: HgvsgCellProps) {
  const [_, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_VARIANT_PARAM, locusId);
      return prev;
    });
  };

  return (
    <AnchorLink size="sm" variant="primary" className="overflow-hidden text-ellipsis" onClick={handleClick}>
      {hgvsg}
    </AnchorLink>
  );
}

export default HgvsgCell;
