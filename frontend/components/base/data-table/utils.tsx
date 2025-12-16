import { RefObject } from 'react';

import { ColumnSettings } from './data-table';

type getFilteredAdditionalFieldsProps = {
  columnVisibility: Record<string, boolean>;
  defaultColumnSettings: ColumnSettings[];
};

export const getFilteredAdditionalFields = ({
  columnVisibility,
  defaultColumnSettings,
}: getFilteredAdditionalFieldsProps): string[] => {
  const filteredAdditionalFields: string[] = [];
  for (const [key, value] of Object.entries(columnVisibility)) {
    const colSettings = defaultColumnSettings.find(setting => setting.id === key);
    if (value === true && colSettings?.additionalFields) {
      filteredAdditionalFields.push(...colSettings.additionalFields);
    }
  }
  return filteredAdditionalFields;
};

type UpdateAdditionalFieldProps = {
  newAddFields: string[];
  prevAddFields: RefObject<string[]>;
  setAdditionalFields?: (fields: string[]) => void;
};

export const updateAdditionalField = ({
  newAddFields,
  prevAddFields,
  setAdditionalFields,
}: UpdateAdditionalFieldProps) => {
  const fieldsChanged =
    newAddFields.length !== prevAddFields.current.length ||
    newAddFields.some((field, index) => field !== prevAddFields.current[index]);

  if (setAdditionalFields && fieldsChanged) {
    prevAddFields.current = newAddFields;
    setAdditionalFields(newAddFields);
  }
};
