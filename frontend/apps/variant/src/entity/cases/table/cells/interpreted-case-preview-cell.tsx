import { useSearchParams } from 'react-router';

import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { SELECTED_INTERPRETED_CASE_PARAM } from '../../constants';

type CasePreviewCellProps = {
  caseId: number;
  patiendId: number;
  relationshipToProband: string | undefined;
};

function InterpretedCasePreviewCell({ caseId, patiendId, relationshipToProband }: CasePreviewCellProps) {
  const [_, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_INTERPRETED_CASE_PARAM, patiendId.toString());
      return prev;
    });
  };

  return (
    <RelationshipToProbandCell relationship={relationshipToProband}>
      <AnchorLink mono size="xs" onClick={handleClick}>
        {caseId}
      </AnchorLink>
    </RelationshipToProbandCell>
  );
}

export default InterpretedCasePreviewCell;
