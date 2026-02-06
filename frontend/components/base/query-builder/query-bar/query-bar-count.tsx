import { useEffect, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';

import { Sqon } from '@/api/api';
import { Spinner } from '@/components/base/spinner';
import { resolveSyntheticSqon } from '@/components/cores/query-builder';
import { ISqonGroupFilter } from '@/components/cores/sqon';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';

import { useQueryBuilderContext } from '../query-builder-context';

import { useQueryBarContext } from './query-bar-context';

function QueryBarCount() {
  const { queryBuilder, queryCountIcon, fetchQueryCount, loading: QBLoading } = useQueryBuilderContext();
  const { query } = useQueryBarContext();

  const previousQuery = useRef<ISqonGroupFilter | null>(null);
  const [total, setTotal] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    if (QBLoading) {
      return;
    }

    if (queryBuilder.getRawQueries().find(q => q.id === query.id)) {
      const previous = previousQuery.current;
      const resolvedCurrent = resolveSyntheticSqon(query.raw(), queryBuilder.getRawQueries());

      if (!previousQuery.current || !isEqual(previous, resolvedCurrent)) {
        previousQuery.current = resolvedCurrent;
        setLoadingCount(true);
        fetchQueryCount(resolvedCurrent as Sqon)
          .then(setTotal)
          .finally(() => {
            setLoadingCount(false);
          });
      }
    }
  }, [fetchQueryCount, query.raw(), queryBuilder.getRawQueries(), QBLoading]);

  return (
    <div className="flex items-center gap-1">
      {loadingCount ? (
        <Spinner />
      ) : (
        <>
          {queryCountIcon}
          <span className="font-medium">{numberFormatWithAbbrv(total)}</span>
        </>
      )}
    </div>
  );
}

export default QueryBarCount;
