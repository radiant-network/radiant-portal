import { describe, expect, it, vi } from 'vitest';

import type { CaseTrack } from './case-tracks';
import {
  applyReadsDisplayMode,
  getInitialReadsDisplayMode,
  getLocusWidth,
  getReadsDisplayMode,
  withReadsDisplayMode,
} from './reads-display-mode';

const readsTrack = () => ({ alignmentTrack: { setDisplayMode: vi.fn() } });

describe('getReadsDisplayMode', () => {
  it('expands the reads up to 5 kb', () => {
    expect(getReadsDisplayMode(5_000)).toBe('EXPANDED');
  });

  it('squishes the reads above 5 kb', () => {
    expect(getReadsDisplayMode(5_001)).toBe('SQUISHED');
  });
});

describe('getLocusWidth', () => {
  it('reads the width of a range', () => {
    expect(getLocusWidth('chr5:90855713-90881913')).toBe(26_200);
  });

  it('gives no width to a locus without a range', () => {
    expect(getLocusWidth('chr5')).toBe(0);
  });
});

describe('getInitialReadsDisplayMode', () => {
  it('squishes the reads of a CNV opened above 5 kb', () => {
    expect(getInitialReadsDisplayMode('cnv', 'chr5:90855713-90881913')).toBe('SQUISHED');
  });

  it('expands the reads of a CNV opened up to 5 kb', () => {
    expect(getInitialReadsDisplayMode('cnv', 'chr5:90855713-90858713')).toBe('EXPANDED');
  });

  it('applies no rule from an SNV', () => {
    expect(getInitialReadsDisplayMode('snv', 'chr5:90855713-90855913')).toBeUndefined();
  });
});

describe('withReadsDisplayMode', () => {
  it('sets the mode on the Reads tracks only', () => {
    const tracks: CaseTrack[] = [
      { type: 'alignment', format: 'cram', name: 'Reads: S1 proband', url: 'cram', order: 1 },
      { type: 'wig', format: 'bigWig', name: 'BAF: S1 proband', url: 'bw', order: 2 },
    ];

    expect(withReadsDisplayMode(tracks, 'SQUISHED').map(track => 'displayMode' in track && track.displayMode)).toEqual([
      'SQUISHED',
      false,
    ]);
  });

  it('leaves the tracks as they are when no rule applies', () => {
    const tracks: CaseTrack[] = [
      { type: 'alignment', format: 'cram', name: 'Reads: S1 proband', url: 'cram', order: 1 },
    ];

    expect(withReadsDisplayMode(tracks, undefined)).toBe(tracks);
  });
});

describe('applyReadsDisplayMode', () => {
  it('squishes every Reads track when the view grows above 5 kb', () => {
    const tracks = [readsTrack(), readsTrack()];

    expect(applyReadsDisplayMode(tracks, 'EXPANDED', 26_200)).toBe('SQUISHED');
    tracks.forEach(({ alignmentTrack }) => expect(alignmentTrack.setDisplayMode).toHaveBeenCalledWith('SQUISHED'));
  });

  it('expands the reads again when the view shrinks to 5 kb', () => {
    const track = readsTrack();

    expect(applyReadsDisplayMode([track], 'SQUISHED', 2_000)).toBe('EXPANDED');
    expect(track.alignmentTrack.setDisplayMode).toHaveBeenCalledWith('EXPANDED');
  });

  it('leaves the reads alone when no rule applies', () => {
    const track = readsTrack();

    expect(applyReadsDisplayMode([track], undefined, 26_200)).toBeUndefined();
    expect(track.alignmentTrack.setDisplayMode).not.toHaveBeenCalled();
  });

  it('keeps a mode picked in the igv.js menu while the view stays on the same side', () => {
    const track = readsTrack();

    expect(applyReadsDisplayMode([track], 'SQUISHED', 20_000)).toBe('SQUISHED');
    expect(track.alignmentTrack.setDisplayMode).not.toHaveBeenCalled();
  });
});
