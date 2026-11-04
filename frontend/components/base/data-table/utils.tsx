import type { RefObject } from 'react';
import type { ColumnPinningState } from '@tanstack/react-table';

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
  columnPinning?: ColumnPinningState;
  columnVisibility?: Record<string, boolean>;
  defaultColumnSettings: ColumnSettings[];
};

type CompletedColumnSettings = {
  columnOrder: string[];
  columnPinning: ColumnPinningState;
  columnVisibility: Record<string, boolean>;
};

const insertAfterClosestKnownDefault = (ids: string[], defaults: ColumnSettings[], position: number) => {
  const previous = defaults
    .slice(0, position)
    .reverse()
    .find(candidate => ids.includes(candidate.id));
  ids.splice(previous ? ids.indexOf(previous.id) + 1 : 0, 0, defaults[position].id);
};

export const completeSavedColumnSettings = ({
  columnOrder,
  columnPinning,
  columnVisibility,
  defaultColumnSettings,
}: CompleteSavedColumnSettingsProps): CompletedColumnSettings => {
  const defaults = [...defaultColumnSettings].sort((a, b) => a.index - b.index);
  const savedOrder = columnOrder ?? [];

  const completedOrder = [...savedOrder];
  defaults.forEach((setting, position) => {
    if (!completedOrder.includes(setting.id)) {
      insertAfterClosestKnownDefault(completedOrder, defaults, position);
    }
  });

  const completedPinning: ColumnPinningState = {
    start: [...(columnPinning?.start ?? [])],
    end: [...(columnPinning?.end ?? [])],
  };
  defaults.forEach((setting, position) => {
    const side = setting.pinningPosition;
    if (!side || savedOrder.includes(setting.id) || completedPinning[side].includes(setting.id)) return;
    insertAfterClosestKnownDefault(completedPinning[side], defaults, position);
  });

  const completedVisibility = { ...(columnVisibility ?? {}) };
  defaults.forEach(setting => {
    if (!(setting.id in completedVisibility)) {
      completedVisibility[setting.id] = setting.visible;
    }
  });

  return { columnOrder: completedOrder, columnPinning: completedPinning, columnVisibility: completedVisibility };
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
