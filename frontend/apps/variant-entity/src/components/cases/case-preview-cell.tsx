import { useSearchParams } from 'react-router';

import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { SELECTED_CASE_PARAM } from './constants';

type CasePreviewCellProps = {
  caseId: number;
  relationshipToProband: string | undefined;
};

function CasePreviewCell({ caseId, relationshipToProband }: CasePreviewCellProps) {
  const [, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_CASE_PARAM, caseId.toString());
      return prev;
    });
  };

  return (
    <span>
      <RelationshipToProbandCell relationship={relationshipToProband}>
        <AnchorLink mono size="xs" variant="secondary" onClick={handleClick}>
          {caseId}
        </AnchorLink>
      </RelationshipToProbandCell>
    </span>
  );
}

export default CasePreviewCell;
