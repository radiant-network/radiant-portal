import { useSearchParams } from 'react-router';

import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { SELECTED_UNINTERPRETED_CASE_PARAM } from '../../constants';

type CasePreviewCellProps = {
  caseId: number;
  patientId: number;
  relationshipToProband: string | undefined;
};

/**
 * @DESCRIPTION: Use patient_id as unique id since case_id can be present multiple times in the table (case *n patient)
 */
function UninterpretedCasePreviewCell({ caseId, patientId, relationshipToProband }: CasePreviewCellProps) {
  const [_, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_UNINTERPRETED_CASE_PARAM, patientId.toString());
      return prev;
    });
  };

  return (
    <RelationshipToProbandCell relationship={relationshipToProband}>
      <AnchorLink mono size="xs" onClick={handleClick}>
        {thousandNumberFormat(caseId)}
      </AnchorLink>
    </RelationshipToProbandCell>
  );
}

export default UninterpretedCasePreviewCell;
