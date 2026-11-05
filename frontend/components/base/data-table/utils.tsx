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

type AddMissingDefaultColumnsProps = {
  columnOrder?: string[];
  columnPinning?: ColumnPinningState;
  columnVisibility?: Record<string, boolean>;
  defaultColumnSettings: ColumnSettings[];
};

type ColumnSettingsWithDefaults = {
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

export const addMissingDefaultColumns = ({
  columnOrder,
  columnPinning,
  columnVisibility,
  defaultColumnSettings,
}: AddMissingDefaultColumnsProps): ColumnSettingsWithDefaults => {
  const defaults = [...defaultColumnSettings].sort((a, b) => a.index - b.index);
  const savedOrder = columnOrder ?? [];

  const orderWithDefaults = [...savedOrder];
  defaults.forEach((setting, position) => {
    if (!orderWithDefaults.includes(setting.id)) {
      insertAfterClosestKnownDefault(orderWithDefaults, defaults, position);
    }
  });

  const pinningWithDefaults: ColumnPinningState = {
    start: [...(columnPinning?.start ?? [])],
    end: [...(columnPinning?.end ?? [])],
  };
  defaults.forEach((setting, position) => {
    const side = setting.pinningPosition;
    if (!side || savedOrder.includes(setting.id) || pinningWithDefaults[side].includes(setting.id)) return;
    insertAfterClosestKnownDefault(pinningWithDefaults[side], defaults, position);
  });

  const visibilityWithDefaults = { ...(columnVisibility ?? {}) };
  defaults.forEach(setting => {
    if (!(setting.id in visibilityWithDefaults)) {
      visibilityWithDefaults[setting.id] = setting.visible;
    }
  });

  return {
    columnOrder: orderWithDefaults,
    columnPinning: pinningWithDefaults,
    columnVisibility: visibilityWithDefaults,
  };
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
