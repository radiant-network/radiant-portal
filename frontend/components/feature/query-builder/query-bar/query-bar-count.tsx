import { useEffect, useRef, useState } from 'react';
import { useQueryBuilderContext } from '../query-builder-context';
import { useQueryBarContext } from './query-bar-context';
import { Spinner } from '@/components/base/spinner';
import { ISqonGroupFilter } from '@/components/model/sqon';
import isEqual from 'lodash/isEqual';
import { resolveSyntheticSqon } from '@/components/model/query-builder-core';
import { Sqon } from '@/api/api';
import { numberFormat } from '@/components/lib/number-format';

function QueryBarCount() {
  const { queryBuilder, queryCountIcon, fetchQueryCount } = useQueryBuilderContext();
  const { query } = useQueryBarContext();

  const previousQuery = useRef<ISqonGroupFilter | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (queryBuilder.getRawQueries().find(q => q.id === query.id)) {
      const previous = previousQuery.current;
      const resolvedCurrent = resolveSyntheticSqon(query.raw(), queryBuilder.getRawQueries());

      if (!previousQuery.current || !isEqual(previous, resolvedCurrent)) {
        previousQuery.current = resolvedCurrent;
        setLoading(true);
        fetchQueryCount(resolvedCurrent as Sqon)
          .then(setTotal)
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [fetchQueryCount, query.raw(), queryBuilder.getRawQueries()]);

  return (
    <div className="flex items-center gap-1">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {queryCountIcon}
          <span className="font-medium">{numberFormat(total)}</span>
        </>
      )}
    </div>
  );
}

export default QueryBarCount;
