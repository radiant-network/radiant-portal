import { useEffect, useMemo } from 'react';
import { SetURLSearchParams } from 'react-router-dom';

interface OccurrenceItem {
  locus_id: string;
}

interface UsePreviewOccurrenceNavigationParams<T extends OccurrenceItem> {
  occurrencesData: T[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  selectedOccurrenceParamKey: string;
  setRowSelection: (
    selection: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
}

interface UsePreviewOccurrenceNavigationReturn<T extends OccurrenceItem> {
  selectedOccurrence: T | undefined;
  selectedOccurrenceIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  handleClosePreview: () => void;
  handlePreviousOccurrence: () => void;
  handleNextOccurrence: () => void;
}

export function usePreviewOccurrenceNavigation<T extends OccurrenceItem>({
  occurrencesData,
  searchParams,
  setSearchParams,
  selectedOccurrenceParamKey,
  setRowSelection,
}: UsePreviewOccurrenceNavigationParams<T>): UsePreviewOccurrenceNavigationReturn<T> {
  const selectedVariant = searchParams.get(selectedOccurrenceParamKey);
  const selectedOccurrence = occurrencesData.find(occurrence => occurrence.locus_id === selectedVariant);

  const selectedOccurrenceIndex = selectedVariant
    ? occurrencesData.findIndex(occurrence => occurrence.locus_id === selectedVariant)
    : -1;

  const handleClosePreview = () => {
    setSearchParams(prev => {
      prev.delete(selectedOccurrenceParamKey);
      return prev;
    });
  };

  const handlePreviousOccurrence = () => {
    if (selectedOccurrenceIndex > 0) {
      const previousOccurrence = occurrencesData[selectedOccurrenceIndex - 1];
      setSearchParams(prev => {
        prev.set(selectedOccurrenceParamKey, previousOccurrence.locus_id);
        return prev;
      });
    }
  };

  const handleNextOccurrence = () => {
    if (selectedOccurrenceIndex >= 0 && selectedOccurrenceIndex < occurrencesData.length - 1) {
      const nextOccurrence = occurrencesData[selectedOccurrenceIndex + 1];
      setSearchParams(prev => {
        prev.set(selectedOccurrenceParamKey, nextOccurrence.locus_id);
        return prev;
      });
    }
  };

  const hasPrevious = useMemo(() => selectedOccurrenceIndex > 0, [selectedOccurrenceIndex]);

  const hasNext = useMemo(
    () => selectedOccurrenceIndex >= 0 && selectedOccurrenceIndex < occurrencesData.length - 1,
    [selectedOccurrenceIndex, occurrencesData.length],
  );

  useEffect(() => {
    if (selectedVariant && occurrencesData.length > 0) {
      const rowIndex = occurrencesData.findIndex(occurrence => occurrence.locus_id === selectedVariant);
      if (rowIndex !== -1) {
        setRowSelection({ [rowIndex]: true });
      } else {
        setRowSelection({});
      }
    } else {
      setRowSelection({});
    }
  }, [selectedVariant, occurrencesData, setRowSelection]);

  return {
    selectedOccurrence,
    selectedOccurrenceIndex,
    hasPrevious,
    hasNext,
    handleClosePreview,
    handlePreviousOccurrence,
    handleNextOccurrence,
  };
}
