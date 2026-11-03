import type { RefObject } from 'react';

import type { ColumnSettings } from './data-table';

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

type CompleteSavedColumnSettingsProps = {
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  defaultColumnSettings: ColumnSettings[];
};

/**
 * Complete the column order and visibility a user saved with the table defaults.
 *
 * A saved preference only knows the columns the table had when it was saved. A column added since
 * takes its default visibility, and its default position: right after the closest column that
 * precedes it in the defaults and that the saved order knows, or first when there is none. Without
 * this, the new column would end up last, unchecked, and its additional fields never requested.
 * Everything the user saved is kept as is.
 */
export const completeSavedColumnSettings = ({
  columnOrder,
  columnVisibility,
  defaultColumnSettings,
}: CompleteSavedColumnSettingsProps): { columnOrder: string[]; columnVisibility: Record<string, boolean> } => {
  const defaults = [...defaultColumnSettings].sort((a, b) => a.index - b.index);

  const completedOrder = [...(columnOrder ?? [])];
  defaults.forEach((setting, position) => {
    if (completedOrder.includes(setting.id)) return;
    const previous = defaults
      .slice(0, position)
      .reverse()
      .find(candidate => completedOrder.includes(candidate.id));
    const insertAt = previous ? completedOrder.indexOf(previous.id) + 1 : 0;
    completedOrder.splice(insertAt, 0, setting.id);
  });

  const completedVisibility = { ...(columnVisibility ?? {}) };
  defaults.forEach(setting => {
    if (!(setting.id in completedVisibility)) {
      completedVisibility[setting.id] = setting.visible;
    }
  });

  return { columnOrder: completedOrder, columnVisibility: completedVisibility };
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
