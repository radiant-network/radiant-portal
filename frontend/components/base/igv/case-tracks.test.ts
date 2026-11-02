import type { Browser } from 'igv';
import { describe, expect, it, vi } from 'vitest';

import type { IGVTrackEnriched, IGVTracks } from '@/api/api';

import {
  buildCaseTracks,
  type CaseTrack,
  CNV_GAIN_COLOR,
  CNV_LOSS_COLOR,
  CNV_OTHER_COLOR,
  getCNVColor,
  loadCaseTracks,
} from './case-tracks';

const apiTrack = (sequencingExperimentId: number, name: string, indexURL = ''): IGVTrackEnriched => ({
  sequencing_experiment_id: sequencingExperimentId,
  name,
  url: `https://bucket/${name}`,
  indexURL,
});

const trioTracks: IGVTracks = {
  alignment: [apiTrack(101, 'Reads: S123 proband', 'crai'), apiTrack(102, 'Reads: S124 mother', 'crai')],
  cnv: [apiTrack(101, 'CNVs: S123 proband', 'tbi'), apiTrack(102, 'CNVs: S124 mother', 'tbi')],
  seg: [apiTrack(101, 'Seg: S123 proband')],
  baf: [apiTrack(101, 'BAF: S123 proband'), apiTrack(102, 'BAF: S124 mother')],
  roh: [apiTrack(102, 'ROH: S124 mother')],
  capture_targets: [apiTrack(101, 'Capture targets')],
  public_tracks: {},
};

describe('buildCaseTracks', () => {
  it('gives no track before the response arrives', () => {
    expect(buildCaseTracks(undefined)).toEqual([]);
  });

  it('orders the tracks per member, after the capture targets', () => {
    expect(buildCaseTracks(trioTracks).map(({ order, name }) => [order, name])).toEqual([
      [1, 'Capture targets'],
      [2, 'CNVs: S123 proband'],
      [3, 'Reads: S123 proband'],
      [4, 'Seg: S123 proband'],
      [5, 'BAF: S123 proband'],
      [6, 'CNVs: S124 mother'],
      [7, 'Reads: S124 mother'],
      [8, 'BAF: S124 mother'],
      [9, 'ROH: S124 mother'],
    ]);
  });

  it('takes the member order from the Reads tracks', () => {
    const tracks = buildCaseTracks({
      alignment: [apiTrack(7, 'Reads: S9 tumor'), apiTrack(3, 'Reads: S8 normal')],
      cnv: [apiTrack(3, 'CNVs: S8 normal')],
      public_tracks: {},
    });

    expect(tracks.map(({ name }) => name)).toEqual(['Reads: S9 tumor', 'CNVs: S8 normal', 'Reads: S8 normal']);
  });

  it('gives each kind of file its igv.js track type and format', () => {
    expect(buildCaseTracks(trioTracks).map(({ name, type, format }) => [name, type, format])).toEqual([
      ['Capture targets', 'annotation', 'bed'],
      ['CNVs: S123 proband', 'variant', 'vcf'],
      ['Reads: S123 proband', 'alignment', 'cram'],
      ['Seg: S123 proband', 'wig', 'bigWig'],
      ['BAF: S123 proband', 'wig', 'bigWig'],
      ['CNVs: S124 mother', 'variant', 'vcf'],
      ['Reads: S124 mother', 'alignment', 'cram'],
      ['BAF: S124 mother', 'wig', 'bigWig'],
      ['ROH: S124 mother', 'annotation', 'bed'],
    ]);
  });

  it('passes the index of the CRAM and VCF files only', () => {
    const indexURLs = buildCaseTracks(trioTracks).map(track => ('indexURL' in track ? track.indexURL : undefined));

    expect(indexURLs).toEqual([undefined, 'tbi', 'crai', undefined, undefined, 'tbi', 'crai', undefined, undefined]);
  });

  it('colors every CNV track by gain and loss', () => {
    const cnvTracks = buildCaseTracks(trioTracks).filter(track => track.type === 'variant');

    expect(cnvTracks.map(track => ('color' in track ? track.color : undefined))).toEqual([getCNVColor, getCNVColor]);
  });
});

describe('getCNVColor', () => {
  it('colors a gain in blue', () => {
    expect(getCNVColor({ alternateBases: '<DUP>' })).toBe(CNV_GAIN_COLOR);
  });

  it('colors a loss in red', () => {
    expect(getCNVColor({ alternateBases: '<DEL>' })).toBe(CNV_LOSS_COLOR);
  });

  it('colors any other call in gray', () => {
    expect(getCNVColor({ alternateBases: '.' })).toBe(CNV_OTHER_COLOR);
  });

  it('reads the variant wrapped by the whole-genome view', () => {
    expect(getCNVColor({ _f: { alternateBases: '<DEL>' } })).toBe(CNV_LOSS_COLOR);
  });
});

describe('loadCaseTracks', () => {
  it('loads the other tracks and names the one that fails', async () => {
    const tracks = buildCaseTracks(trioTracks);
    const loadTrack = vi.fn((track: CaseTrack) =>
      track.name === 'BAF: S123 proband' ? Promise.reject(new Error('403')) : Promise.resolve({ name: track.name }),
    );

    const { loads, failedTrackNames } = loadCaseTracks({ loadTrack } as unknown as Pick<Browser, 'loadTrack'>, tracks);

    expect(await failedTrackNames).toEqual(['BAF: S123 proband']);
    const statuses = (await Promise.allSettled(loads)).map(({ status }) => status);
    expect(statuses.filter(status => status === 'fulfilled')).toHaveLength(tracks.length - 1);
    expect(loadTrack).toHaveBeenCalledTimes(tracks.length);
  });

  it('names no track when every load succeeds', async () => {
    const loadTrack = vi.fn((track: CaseTrack) => Promise.resolve({ name: track.name }));

    const { failedTrackNames } = loadCaseTracks(
      { loadTrack } as unknown as Pick<Browser, 'loadTrack'>,
      buildCaseTracks(trioTracks),
    );

    expect(await failedTrackNames).toEqual([]);
  });
});
