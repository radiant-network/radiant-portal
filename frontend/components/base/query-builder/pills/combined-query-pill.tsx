import { useCallback } from 'react';

import { QBActionType, useQBDispatch, useQBSqons } from '../hooks/use-query-builder';
import { getColorByIndex } from '../libs/theme';
import { ISyntheticSqon } from '../type';

import QueryPillContainer from './containers/query-pill-container';
import QueryPillValuesContainer from './containers/query-pill-values-container';

type CombinedQueryProps = {
  uuid: string;
  sqon: ISyntheticSqon;
};
function CombinedQueryPill({ uuid, sqon }: CombinedQueryProps) {
  const sqons = useQBSqons();
  const dispatch = useQBDispatch();
  const index = sqons.findIndex(s => s.id === sqon.id);
  const onRemovePill = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_COMBINED_PILL,
      payload: {
        uuid,
        sqon,
      },
    });
  }, [dispatch, sqon]);

  return (
    <QueryPillContainer onRemovePill={onRemovePill}>
      <div className="flex gap-2" style={{ color: getColorByIndex(index) }}>
        <QueryPillValuesContainer>Q{index + 1}</QueryPillValuesContainer>
      </div>
    </QueryPillContainer>
  );
}
export default CombinedQueryPill;
