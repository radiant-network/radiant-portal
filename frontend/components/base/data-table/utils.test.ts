import { describe, expect, it } from 'vitest';

import type { ColumnSettings } from './data-table';
import { completeSavedColumnSettings, getFilteredAdditionalFields } from './utils';

// Defaults of a table that gained two columns after the user saved: `af` (hidden, needs an
// additional field) right after `sf`, and `ac` (visible) at the end.
const defaultColumnSettings: ColumnSettings[] = [
  { id: 'name', visible: true, index: 0 },
  { id: 'type', visible: true, index: 1 },
  { id: 'sf', visible: true, index: 2 },
  { id: 'af', visible: false, index: 3, additionalFields: ['gnomad_af'] },
  { id: 'calls', visible: false, index: 4, additionalFields: ['calls'] },
  { id: 'ac', visible: true, index: 5 },
];

// What the user saved before `af` and `ac` existed: `calls` shown, `type` hidden, `sf` moved first.
const savedOrder = ['sf', 'name', 'type', 'calls'];
const savedVisibility = { sf: true, name: true, type: false, calls: true };

// A table whose pinned `igv` column was added after the user saved, next to the pinned `row-info`.
const pinnedDefaultColumnSettings: ColumnSettings[] = [
  { id: 'row-info', visible: true, index: 0, pinningPosition: 'start' },
  { id: 'igv', visible: true, index: 1, pinningPosition: 'start' },
  { id: 'symbol', visible: true, index: 2 },
  { id: 'export', visible: true, index: 3, pinningPosition: 'end' },
  { id: 'actions', visible: true, index: 4, pinningPosition: 'end' },
];

describe('completeSavedColumnSettings', () => {
  it('gives a column the saved settings do not know its default visibility', () => {
    const { columnVisibility } = completeSavedColumnSettings({
      columnOrder: savedOrder,
      columnVisibility: savedVisibility,
      defaultColumnSettings,
    });

    expect(columnVisibility.af).toBe(false);
    expect(columnVisibility.ac).toBe(true);
  });

  it('places a new column right after the column that precedes it in the defaults', () => {
    const { columnOrder } = completeSavedColumnSettings({
      columnOrder: savedOrder,
      columnVisibility: savedVisibility,
      defaultColumnSettings,
    });

    // `af` follows `sf` wherever the user moved `sf`; `ac` follows `calls`
    expect(columnOrder).toEqual(['sf', 'af', 'name', 'type', 'calls', 'ac']);
  });

  it('keeps everything the user saved', () => {
    const { columnOrder, columnVisibility } = completeSavedColumnSettings({
      columnOrder: savedOrder,
      columnVisibility: savedVisibility,
      defaultColumnSettings,
    });

    expect(columnOrder.filter(id => savedOrder.includes(id))).toEqual(savedOrder);
    expect(columnVisibility).toMatchObject(savedVisibility);
  });

  it('places a new column first when no column before it is known', () => {
    const { columnOrder } = completeSavedColumnSettings({
      columnOrder: ['type', 'sf', 'af', 'calls', 'ac'],
      columnVisibility: {},
      defaultColumnSettings,
    });

    expect(columnOrder).toEqual(['name', 'type', 'sf', 'af', 'calls', 'ac']);
  });

  it('returns the defaults when nothing was saved', () => {
    const { columnOrder, columnVisibility } = completeSavedColumnSettings({ defaultColumnSettings });

    expect(columnOrder).toEqual(['name', 'type', 'sf', 'af', 'calls', 'ac']);
    expect(columnVisibility).toEqual({ name: true, type: true, sf: true, af: false, calls: false, ac: true });
  });

  it('keeps a saved column that is no longer in the defaults', () => {
    const { columnOrder, columnVisibility } = completeSavedColumnSettings({
      columnOrder: ['removed', ...savedOrder],
      columnVisibility: { ...savedVisibility, removed: true },
      defaultColumnSettings,
    });

    expect(columnOrder[0]).toBe('removed');
    expect(columnVisibility.removed).toBe(true);
  });

  it('does not reorder the default settings it is given', () => {
    const shuffled = [defaultColumnSettings[2], defaultColumnSettings[0], defaultColumnSettings[1]];
    completeSavedColumnSettings({ columnOrder: [], columnVisibility: {}, defaultColumnSettings: shuffled });

    expect(shuffled.map(setting => setting.id)).toEqual(['sf', 'name', 'type']);
  });

  it('does not request the additional fields of a new column that is hidden by default', () => {
    const { columnVisibility } = completeSavedColumnSettings({
      columnOrder: savedOrder,
      columnVisibility: savedVisibility,
      defaultColumnSettings,
    });

    const fields = getFilteredAdditionalFields({ columnVisibility, defaultColumnSettings });
    expect(fields).toEqual(['calls']);
    expect(fields).not.toContain('gnomad_af');
  });

  it('requests the additional fields of a new column that is visible by default', () => {
    const withVisibleAf = defaultColumnSettings.map(setting =>
      setting.id === 'af' ? { ...setting, visible: true } : setting,
    );
    const { columnVisibility } = completeSavedColumnSettings({
      columnOrder: savedOrder,
      columnVisibility: savedVisibility,
      defaultColumnSettings: withVisibleAf,
    });

    expect(getFilteredAdditionalFields({ columnVisibility, defaultColumnSettings: withVisibleAf })).toContain(
      'gnomad_af',
    );
  });

  it('pins a new column on its default side, right after the pinned column that precedes it', () => {
    const { columnPinning } = completeSavedColumnSettings({
      columnOrder: ['row-info', 'symbol', 'actions'],
      columnPinning: { start: ['row-info'], end: ['actions'] },
      columnVisibility: {},
      defaultColumnSettings: pinnedDefaultColumnSettings,
    });

    expect(columnPinning).toEqual({ start: ['row-info', 'igv'], end: ['export', 'actions'] });
  });

  it('keeps the pinning the user saved for the columns they knew', () => {
    const { columnPinning } = completeSavedColumnSettings({
      columnOrder: ['row-info', 'symbol', 'export', 'actions'],
      columnPinning: { start: ['row-info', 'symbol'], end: ['actions'] },
      columnVisibility: {},
      defaultColumnSettings: pinnedDefaultColumnSettings,
    });

    // `export` was known and left unpinned by the user; only `igv` is new
    expect(columnPinning).toEqual({ start: ['row-info', 'igv', 'symbol'], end: ['actions'] });
  });

  it('returns the default pinning when nothing was saved', () => {
    const { columnPinning } = completeSavedColumnSettings({ defaultColumnSettings: pinnedDefaultColumnSettings });

    expect(columnPinning).toEqual({ start: ['row-info', 'igv'], end: ['export', 'actions'] });
  });
});
