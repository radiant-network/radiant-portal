import type { Browser } from 'igv';
import { describe, expect, it, vi } from 'vitest';

import type { IGVPublicTrack } from '@/api/api';

import { CNV_GAIN_COLOR, CNV_LOSS_COLOR, CNV_OTHER_COLOR } from './case-tracks';
import { buildPublicTracks, createPublicTrackLoader, type PublicTrack, type PublicTrackId } from './public-tracks';

const FILE_IDS = [
  'clinvar',
  'clinvar_sv',
  'dgv',
  'clingen_gene',
  'clingen_region',
  'gnomad_sv',
  'gnomad_cnv',
  'segmental_duplications',
  'repeat_masker',
  'simple_repeats',
  'self_chain',
];

const publicFile = (fileId: string): IGVPublicTrack => ({
  url: `https://bucket/${fileId}`,
  urlExpireAt: 0,
  indexURL: `https://bucket/${fileId}.tbi`,
  indexURLExpireAt: 0,
});

const allPublicFiles = Object.fromEntries(FILE_IDS.map(fileId => [fileId, publicFile(fileId)]));

const nameOf = (id: PublicTrackId) => `name of ${id}`;

const trackOf = (id: PublicTrackId) => {
  const option = buildPublicTracks('cnv', allPublicFiles, nameOf).find(({ track }) => track.id === id);
  if (!option) throw new Error(`no ${id} track`);
  return option.track;
};

describe('buildPublicTracks', () => {
  it('offers ClinVar only from an SNV, switched off', () => {
    expect(
      buildPublicTracks('snv', allPublicFiles, nameOf).map(({ track, shownByDefault }) => [track.id, shownByDefault]),
    ).toEqual([['clinvar', false]]);
  });

  it('offers the 12 CNV tracks from a CNV, the first four switched on', () => {
    expect(
      buildPublicTracks('cnv', allPublicFiles, nameOf).map(({ track, shownByDefault }) => [track.id, shownByDefault]),
    ).toEqual([
      ['dgv', true],
      ['clinvar_sv', true],
      ['clingen_region_haploinsufficiency', true],
      ['clingen_region_triplosensitivity', true],
      ['gnomad_sv', false],
      ['gnomad_cnv', false],
      ['clingen_gene_haploinsufficiency', false],
      ['clingen_gene_triplosensitivity', false],
      ['segmental_duplications', false],
      ['repeat_masker', false],
      ['simple_repeats', false],
      ['self_chain', false],
    ]);
  });

  it('gives two tracks for each ClinGen file, colored by their own dosage field', () => {
    const haploinsufficiency = trackOf('clingen_gene_haploinsufficiency');
    const triplosensitivity = trackOf('clingen_gene_triplosensitivity');

    expect(haploinsufficiency.url).toBe('https://bucket/clingen_gene');
    expect(triplosensitivity.url).toBe('https://bucket/clingen_gene');
    expect(haploinsufficiency).toMatchObject({ colorBy: 'haploinsufficiency_description' });
    expect(triplosensitivity).toMatchObject({ colorBy: 'triplosensitivity_description' });
  });

  it('colors the gene and region ClinGen tracks with their own palette, gray for other values', () => {
    expect(trackOf('clingen_gene_haploinsufficiency')).toMatchObject({
      colorTable: { Sufficient_evidence_for_dosage_pathogenicity: 'green', '*': 'grey' },
    });
    expect(trackOf('clingen_region_haploinsufficiency')).toMatchObject({
      colorTable: { Sufficient_evidence_for_dosage_pathogenicity: 'red', '*': 'grey' },
    });
  });

  it('colors the DGV gains and losses like the CNV tracks', () => {
    expect(trackOf('dgv')).toMatchObject({
      colorBy: 'variant_sub_type',
      colorTable: { Gain: CNV_GAIN_COLOR, Loss: CNV_LOSS_COLOR, '*': CNV_OTHER_COLOR },
    });
  });

  it('leaves out an entry whose file is missing from the response', () => {
    const { clingen_region: _missing, ...files } = allPublicFiles;

    const ids = buildPublicTracks('cnv', files, nameOf).map(({ track }) => track.id);

    expect(ids).not.toContain('clingen_region_haploinsufficiency');
    expect(ids).not.toContain('clingen_region_triplosensitivity');
    expect(ids).toHaveLength(10);
  });

  it('offers nothing before the response arrives', () => {
    expect(buildPublicTracks('cnv', undefined, nameOf)).toEqual([]);
  });

  it('names the tracks, takes their files from the response and orders them under the case tracks', () => {
    const [dgv, clinvarSV] = buildPublicTracks('cnv', allPublicFiles, nameOf).map(({ track }) => track);

    expect(dgv).toMatchObject({
      name: 'name of dgv',
      type: 'annotation',
      format: 'gff3',
      url: 'https://bucket/dgv',
      indexURL: 'https://bucket/dgv.tbi',
      order: 1000,
    });
    expect(clinvarSV).toMatchObject({ type: 'variant', format: 'vcf', order: 1001 });
  });
});

type Deferred = { resolve: () => void; reject: () => void };

const fakeBrowser = () => {
  const pending = new Map<PublicTrackId, Deferred>();
  const loaded = new Map<PublicTrackId, { id: PublicTrackId }>();
  const loadTrack = vi.fn(
    (track: PublicTrack) =>
      new Promise((resolve, reject) => {
        const resolveTrack = () => {
          const igvTrack = { id: track.id };
          loaded.set(track.id, igvTrack);
          resolve(igvTrack);
        };
        pending.set(track.id, { resolve: resolveTrack, reject: () => reject(new Error('403')) });
      }),
  );
  const removeTrack = vi.fn();
  const browser = { loadTrack, removeTrack } as unknown as Pick<Browser, 'loadTrack' | 'removeTrack'>;
  // Settles the load, then lets the loader react to it.
  const settle = async (id: PublicTrackId, outcome: keyof Deferred) => {
    pending.get(id)?.[outcome]();
    await new Promise(resolve => setTimeout(resolve));
  };
  return { browser, loadTrack, removeTrack, settle, loaded };
};

describe('createPublicTrackLoader', () => {
  const dgv = trackOf('dgv');
  const clinvarSV = trackOf('clinvar_sv');

  it('loads a track switched on', () => {
    const { browser, loadTrack } = fakeBrowser();

    createPublicTrackLoader(browser, vi.fn()).sync([dgv, clinvarSV]);

    expect(loadTrack.mock.calls.map(([track]) => track.id)).toEqual(['dgv', 'clinvar_sv']);
  });

  it('removes a loaded track switched off, and keeps the others', async () => {
    const { browser, removeTrack, settle } = fakeBrowser();
    const loader = createPublicTrackLoader(browser, vi.fn());
    loader.sync([dgv, clinvarSV]);
    await settle('dgv', 'resolve');
    await settle('clinvar_sv', 'resolve');

    loader.sync([clinvarSV]);

    expect(removeTrack).toHaveBeenCalledTimes(1);
    expect(removeTrack).toHaveBeenCalledWith({ id: 'dgv' });
  });

  it('does not load again a track that stays on', async () => {
    const { browser, loadTrack, settle } = fakeBrowser();
    const loader = createPublicTrackLoader(browser, vi.fn());
    loader.sync([dgv]);
    await settle('dgv', 'resolve');

    loader.sync([dgv, clinvarSV]);

    expect(loadTrack.mock.calls.map(([track]) => track.id)).toEqual(['dgv', 'clinvar_sv']);
  });

  it('removes a track switched off while it loads, once loaded', async () => {
    const { browser, removeTrack, settle } = fakeBrowser();
    const loader = createPublicTrackLoader(browser, vi.fn());
    loader.sync([dgv]);
    loader.sync([]);
    expect(removeTrack).not.toHaveBeenCalled();

    await settle('dgv', 'resolve');

    expect(removeTrack).toHaveBeenCalledWith({ id: 'dgv' });
  });

  it('keeps a track switched off then on while it loads, loaded once', async () => {
    const { browser, loadTrack, removeTrack, settle } = fakeBrowser();
    const loader = createPublicTrackLoader(browser, vi.fn());
    loader.sync([dgv]);
    loader.sync([]);
    loader.sync([dgv]);

    await settle('dgv', 'resolve');

    expect(loadTrack).toHaveBeenCalledTimes(1);
    expect(removeTrack).not.toHaveBeenCalled();
  });

  it('names a track that fails, and loads it again when switched on again', async () => {
    const { browser, loadTrack, settle } = fakeBrowser();
    const onFailed = vi.fn();
    const loader = createPublicTrackLoader(browser, onFailed);
    loader.sync([dgv]);

    await settle('dgv', 'reject');
    loader.sync([]);
    loader.sync([dgv]);

    expect(onFailed).toHaveBeenCalledWith('name of dgv');
    expect(loadTrack).toHaveBeenCalledTimes(2);
  });

  it('names no track that fails after it was switched off', async () => {
    const { browser, settle } = fakeBrowser();
    const onFailed = vi.fn();
    const loader = createPublicTrackLoader(browser, onFailed);
    loader.sync([dgv]);
    loader.sync([]);

    await settle('dgv', 'reject');

    expect(onFailed).not.toHaveBeenCalled();
  });

  it('gives the id of a track removed from the igv.js menu, so it is not removed twice', async () => {
    const { browser, removeTrack, settle, loaded } = fakeBrowser();
    const loader = createPublicTrackLoader(browser, vi.fn());
    loader.sync([dgv]);
    await settle('dgv', 'resolve');

    expect(loader.forget(loaded.get('dgv') as never)).toBe('dgv');
    loader.sync([]);
    expect(removeTrack).not.toHaveBeenCalled();
  });

  it('gives no id for a removed case track', () => {
    const loader = createPublicTrackLoader(fakeBrowser().browser, vi.fn());

    expect(loader.forget({ id: 'Reads: S123 proband' } as never)).toBeUndefined();
  });
});
