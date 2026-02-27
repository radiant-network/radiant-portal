// eslint-disable-next-line simple-import-sort/imports
import { useSearchParams } from 'react-router';

import AnchorLink from '@/components/base/navigation/anchor-link';

import { SELECTED_UNINTERPRETED_CASE_PARAM } from '../../constants';
import { useI18n } from '@/components/hooks/i18n';

type CasePreviewCellProps = {
  caseId: number;
  patientId: number;
  seqId: number;
};

/**
 * @DESCRIPTION: Use patient_id as unique id since case_id can be present multiple times in the table (case *n patient)
 */
function UninterpretedCasePreviewCell({ caseId, patientId, seqId }: CasePreviewCellProps) {
  const [_, setSearchParams] = useSearchParams();
  const { t } = useI18n();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_UNINTERPRETED_CASE_PARAM, patientId.toString());
      return prev;
    });
  };

  return (
    <>
      <AnchorLink mono size="sm" onClick={handleClick}>
        {caseId}
      </AnchorLink>
      <div className="text-muted-foreground font-mono text-xs">
        {t('variant_entity.cases.other_table.seq_id_abrv')} {seqId}
      </div>
    </>
  );
}

export default UninterpretedCasePreviewCell;
