import { useEffect, useMemo } from 'react';
import { SetURLSearchParams } from 'react-router';

interface CaseItem {
  case_id: number;
}

interface UsePreviewCaseNavigationParams<T extends CaseItem> {
  casesData: T[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  selectedCaseParamKey: string;
  setRowSelection: (
    selection: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
}

interface UsePreviewCaseNavigationReturn<T extends CaseItem> {
  selectedCase: T | undefined;
  selectedCaseIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  handleClosePreview: () => void;
  handlePreviousCase: () => void;
  handleNextCase: () => void;
}

export function usePreviewCaseNavigation<T extends CaseItem>({
  casesData,
  searchParams,
  setSearchParams,
  selectedCaseParamKey,
  setRowSelection,
}: UsePreviewCaseNavigationParams<T>): UsePreviewCaseNavigationReturn<T> {
  const selectedCaseId = searchParams.get(selectedCaseParamKey);
  const selectedCase = casesData.find(caseItem => caseItem.case_id.toString() === selectedCaseId);

  const selectedCaseIndex = selectedCaseId
    ? casesData.findIndex(caseItem => caseItem.case_id.toString() === selectedCaseId)
    : -1;

  const handleClosePreview = () => {
    setSearchParams(prev => {
      prev.delete(selectedCaseParamKey);
      return prev;
    });
  };

  const handlePreviousCase = () => {
    if (selectedCaseIndex > 0 && selectedCase) {
      const currentCaseId = selectedCase.case_id;
      // Find the first previous case with a different case_id
      for (let i = selectedCaseIndex - 1; i >= 0; i--) {
        if (casesData[i].case_id !== currentCaseId) {
          setSearchParams(prev => {
            prev.set(selectedCaseParamKey, casesData[i].case_id.toString());
            return prev;
          });
          return;
        }
      }
    }
  };

  const handleNextCase = () => {
    if (selectedCaseIndex >= 0 && selectedCaseIndex < casesData.length - 1 && selectedCase) {
      const currentCaseId = selectedCase.case_id;
      // Find the first next case with a different case_id
      for (let i = selectedCaseIndex + 1; i < casesData.length; i++) {
        if (casesData[i].case_id !== currentCaseId) {
          setSearchParams(prev => {
            prev.set(selectedCaseParamKey, casesData[i].case_id.toString());
            return prev;
          });
          return;
        }
      }
    }
  };

  // Check if there's a previous case with a different case_id
  const hasPrevious = useMemo(() => {
    if (selectedCaseIndex <= 0 || !selectedCase) return false;
    const currentCaseId = selectedCase.case_id;
    for (let i = selectedCaseIndex - 1; i >= 0; i--) {
      if (casesData[i].case_id !== currentCaseId) {
        return true;
      }
    }
    return false;
  }, [selectedCaseIndex, selectedCase, casesData]);

  // Check if there's a next case with a different case_id
  const hasNext = useMemo(() => {
    if (selectedCaseIndex < 0 || selectedCaseIndex >= casesData.length - 1 || !selectedCase) return false;
    const currentCaseId = selectedCase.case_id;
    for (let i = selectedCaseIndex + 1; i < casesData.length; i++) {
      if (casesData[i].case_id !== currentCaseId) {
        return true;
      }
    }
    return false;
  }, [selectedCaseIndex, selectedCase, casesData]);

  useEffect(() => {
    if (selectedCaseId && casesData.length > 0) {
      const rowIndex = casesData.findIndex(caseItem => caseItem.case_id.toString() === selectedCaseId);
      if (rowIndex !== -1) {
        setRowSelection({ [rowIndex]: true });
      } else {
        setRowSelection({});
      }
    } else {
      setRowSelection({});
    }
  }, [selectedCaseId, casesData, setRowSelection]);

  return {
    selectedCase,
    selectedCaseIndex,
    hasPrevious,
    hasNext,
    handleClosePreview,
    handlePreviousCase,
    handleNextCase,
  };
}
