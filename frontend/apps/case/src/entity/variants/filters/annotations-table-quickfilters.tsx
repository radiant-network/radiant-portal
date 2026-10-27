import { useEffect, useState } from 'react';

import { QBActionType, useQBDispatch } from 'components/base/query-builder/hooks/use-query-builder';

import { type AnnotationFilterName, INTERPRETATION_ITEM, NOTE_ITEM } from './annotation-filter-items';
import AnnotationsQuickfilters, { FLAG_VALUES } from './annotations-quickfilters';

type AnnotationsTableQuickfiltersProps = {
  disabled?: AnnotationFilterName[];
};

function AnnotationsTableQuickfilters({ disabled = [] }: AnnotationsTableQuickfiltersProps) {
  const dispatch = useQBDispatch();
  const [actives, setActives] = useState<string[]>([]);

  useEffect(() => {
    const flags = actives.filter(value => FLAG_VALUES.includes(value));
    const payload: Record<string, unknown> = {};
    if (actives.includes(NOTE_ITEM)) payload.with_note = true;
    if (actives.includes(INTERPRETATION_ITEM)) payload.with_interpretation = true;
    if (flags.length > 0) payload.with_flag = flags;

    dispatch({
      type: QBActionType.SET_EXTRA_BODY_PARAMS,
      payload,
    });

    dispatch({
      type: QBActionType.SET_EXTRA_TABLE_PROPS,
      payload: {
        quickfilters: {
          enabled: actives.length > 0,
        },
      },
    });
  }, [actives]);

  return <AnnotationsQuickfilters value={actives} onChange={setActives} disabled={disabled} />;
}
export default AnnotationsTableQuickfilters;
