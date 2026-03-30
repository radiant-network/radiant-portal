import { useSearchParams } from 'react-router';

import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';

import { INTERPRETED_CASE_ID_PARAM, INTERPRETED_PATIENT_ID_PARAM } from '../../constants';

type CasePreviewCellProps = {
  caseId: number;
  patiendId: number;
  relationshipToProband: string | undefined;
};

function InterpretedCasePreviewCell({ caseId, patiendId, relationshipToProband }: CasePreviewCellProps) {
  const [_, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(INTERPRETED_PATIENT_ID_PARAM, patiendId.toString());
      prev.set(INTERPRETED_CASE_ID_PARAM, caseId.toString());
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
