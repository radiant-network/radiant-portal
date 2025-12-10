import { useEffect, useMemo } from 'react';
import { SetURLSearchParams } from 'react-router';

interface CaseItem {
  case_id: number;
  patient_id: number;
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

/**
 * @DESCRIPTION: Patient_id is used to find valid row
 */
export function usePreviewCaseNavigation<T extends CaseItem>({
  casesData,
  searchParams,
  setSearchParams,
  selectedCaseParamKey,
  setRowSelection,
}: UsePreviewCaseNavigationParams<T>): UsePreviewCaseNavigationReturn<T> {
  const selectedId = searchParams.get(selectedCaseParamKey);
  const selectedCase = casesData.find(caseItem => caseItem.patient_id.toString() === selectedId);

  const selectedCaseIndex = selectedId
    ? casesData.findIndex(caseItem => caseItem.patient_id.toString() === selectedId)
    : -1;

  const handleClosePreview = () => {
    setSearchParams(prev => {
      prev.delete(selectedCaseParamKey);
      return prev;
    });
  };

  const handlePreviousCase = () => {
    if (selectedCaseIndex > 0 && selectedCase) {
      const currentId = selectedCase.patient_id;
      for (let i = selectedCaseIndex - 1; i >= 0; i--) {
        if (casesData[i].patient_id !== currentId) {
          setSearchParams(prev => {
            prev.set(selectedCaseParamKey, casesData[i].patient_id.toString());
            return prev;
          });
          return;
        }
      }
    }
  };

  const handleNextCase = () => {
    if (selectedCaseIndex >= 0 && selectedCaseIndex < casesData.length - 1 && selectedCase) {
      const currentId = selectedCase.patient_id;
      // Find the first next case with a different patient_id
      for (let i = selectedCaseIndex + 1; i < casesData.length; i++) {
        if (casesData[i].patient_id !== currentId) {
          setSearchParams(prev => {
            prev.set(selectedCaseParamKey, casesData[i].patient_id.toString());
            return prev;
          });
          return;
        }
      }
    }
  };

  // Check if there's a previous case with a different patient_id
  const hasPrevious = useMemo(() => {
    if (selectedCaseIndex <= 0 || !selectedCase) return false;
    const currentId = selectedCase.patient_id;
    for (let i = selectedCaseIndex - 1; i >= 0; i--) {
      if (casesData[i].patient_id !== currentId) {
        return true;
      }
    }
    return false;
  }, [selectedCaseIndex, selectedCase, casesData]);

  // Check if there's a next case with a different patient_id
  const hasNext = useMemo(() => {
    if (selectedCaseIndex < 0 || selectedCaseIndex >= casesData.length - 1 || !selectedCase) return false;
    const currentId = selectedCase.patient_id;
    for (let i = selectedCaseIndex + 1; i < casesData.length; i++) {
      if (casesData[i].patient_id !== currentId) {
        return true;
      }
    }
    return false;
  }, [selectedCaseIndex, selectedCase, casesData]);

  useEffect(() => {
    if (selectedId && casesData.length > 0) {
      const rowIndex = casesData.findIndex(caseItem => caseItem.patient_id.toString() === selectedId);
      if (rowIndex !== -1) {
        setRowSelection({ [rowIndex]: true });
      } else {
        setRowSelection({});
      }
    } else {
      setRowSelection({});
    }
  }, [selectedId, casesData, setRowSelection]);

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
