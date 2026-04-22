import { useEffect, useRef } from 'react';

import { SavedFilter } from '@/api/index';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';
import { ISyntheticSqon } from '../type';

type SavedFilterSyncWrapperProps = {
  children: React.ReactNode;
  selectedSavedFilter?: SavedFilter;
};

/**
 * Wrapper component that synchronizes selected saved filter with QB context
 * Must be used inside QBProvider
 */
export function SavedFilterInitializer({ children, selectedSavedFilter }: SavedFilterSyncWrapperProps) {
  const dispatchQB = useQBDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && selectedSavedFilter?.queries) {
      dispatchQB({
        type: QBActionType.LOAD_QUERIES,
        payload: selectedSavedFilter.queries as ISyntheticSqon[],
      });
      hasInitialized.current = true;
    }
  }, []); // Empty deps array to run only once

  return <>{children}</>;
}
