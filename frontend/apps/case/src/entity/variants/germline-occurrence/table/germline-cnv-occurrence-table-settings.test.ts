import type { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';

import en from '../../../../../../../translations/common/en.json';
import fr from '../../../../../../../translations/common/fr.json';

import { defaultGermlineCNVSettings, getGermlineCNVOccurrenceColumns } from './germline-cnv-occurrence-table-settings';

// The settings are data; their rendering pulls in the whole UI kit, whose aliases only the portal's
// Vite build resolves. Stub the rendering modules and keep the column helper and settings shape.
vi.mock('@/components/base/data-table/data-table', () => ({
  createAppColumnHelper: () => ({
    accessor: (accessorFn: unknown, column: object) => ({ accessorFn, ...column }),
    display: (column: object) => column,
  }),
  createColumnSettings: (settings: object[]) => settings.map((setting, index) => ({ ...setting, index })),
}));
vi.mock('@/components/base/data-table/headers/table-tooltip-header', () => ({ default: () => null }));
vi.mock('@/components/base/data-table/cells/gnomad-cell', () => ({ default: () => null }));
vi.mock('@/components/base/data-table/cells/number-cell', () => ({ default: () => null }));
vi.mock('@/components/base/data-table/cells/number-list-cell', () => ({ default: () => null }));
vi.mock('@/components/base/data-table/cells/text-cell', () => ({ default: () => null }));
vi.mock('../../table/cells/occurrence-flag-cell', () => ({ default: () => null }));
vi.mock('../../table/cells/occurrence-note-cell', () => ({ default: () => null }));
vi.mock('./cells/clingen-cell', () => ({ default: () => null }));
vi.mock('./cells/cnv-name-cell', () => ({ default: () => null }));
vi.mock('./cells/overlapping-gene-link-cell', () => ({ default: () => null }));

const GNOMAD_COLUMNS = ['gnomad_sf', 'gnomad_af', 'gnomad_ac', 'gnomad_sc'];

const t = ((key: string) => key) as unknown as TFunction<string, undefined>;

function setting(id: string) {
  const found = defaultGermlineCNVSettings.find(candidate => candidate.id === id);
  if (!found) throw new Error(`no column setting for ${id}`);
  return found;
}

describe('germline CNV gnomAD SV columns', () => {
  it('lists AF, AC, SC and SF in the column settings, next to each other', () => {
    const ids = defaultGermlineCNVSettings.map(candidate => candidate.id);
    const start = ids.indexOf('gnomad_sf');

    expect(ids.slice(start, start + GNOMAD_COLUMNS.length)).toEqual(GNOMAD_COLUMNS);
  });

  it('shows SF by default and hides AF, AC and SC', () => {
    expect(setting('gnomad_sf').visible).toBe(true);
    expect(setting('gnomad_af').visible).toBe(false);
    expect(setting('gnomad_ac').visible).toBe(false);
    expect(setting('gnomad_sc').visible).toBe(false);
  });

  it('requests AF, AC and SC from the API only when shown', () => {
    expect(setting('gnomad_af').additionalFields).toEqual(['gnomad_af']);
    expect(setting('gnomad_ac').additionalFields).toEqual(['gnomad_ac']);
    expect(setting('gnomad_sc').additionalFields).toEqual(['gnomad_sc']);
    // SF is a default field of the API
    expect(setting('gnomad_sf').additionalFields).toBeUndefined();
  });

  it('defines a sortable column for each setting', () => {
    const columns = getGermlineCNVOccurrenceColumns({ t });
    GNOMAD_COLUMNS.forEach(id => {
      const column = columns.find(candidate => candidate.id === id);
      expect(column, id).toBeDefined();
      expect(column?.enableSorting, id).toBe(true);
    });
  });

  it.each([
    ['en', en],
    ['fr', fr],
  ])('has a %s label and tooltip for each gnomAD column', (_lang, translations) => {
    const headers = translations.variant.headers as Record<string, string>;
    GNOMAD_COLUMNS.forEach(id => {
      const label = setting(id).label!.replace('variant.headers.', '');
      expect(headers[label], label).toBeTruthy();
      expect(headers[`${label}_tooltip`], `${label}_tooltip`).toBeTruthy();
    });
  });

  it('describes SF as a site frequency, not an allele frequency', () => {
    expect(en.variant.headers.gnomad_sf_tooltip).toContain('Site Frequency');
    expect(fr.variant.headers.gnomad_sf_tooltip).toContain('fréquence de site');
  });
});
