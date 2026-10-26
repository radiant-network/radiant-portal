import { describe, expect, it } from 'vitest';

import {
  chromosomeIndexAt,
  chromosomesInView,
  clampView,
  computeTicks,
  createGenome,
  geneWindow,
  MIN_SPAN,
  parseLocus,
  toGenomePosition,
  viewAround,
} from './genome';

const genome = createGenome([
  { name: '1', size: 1000 },
  { name: '2', size: 500 },
  { name: 'X', size: 300 },
]);

describe('createGenome', () => {
  it('places the chromosomes end to end', () => {
    expect(genome.chromosomes.map(c => c.offset)).toEqual([0, 1000, 1500]);
    expect(genome.length).toBe(1800);
  });
});

describe('chromosomeIndexAt', () => {
  it('finds the chromosome holding a position', () => {
    expect(chromosomeIndexAt(genome, 0)).toBe(0);
    expect(chromosomeIndexAt(genome, 999)).toBe(0);
    expect(chromosomeIndexAt(genome, 1000)).toBe(1);
    expect(chromosomeIndexAt(genome, 1799)).toBe(2);
  });
});

describe('chromosomesInView', () => {
  it('lists the chromosomes a view crosses', () => {
    expect(chromosomesInView(genome, { x0: 900, x1: 1100 }).map(c => c.name)).toEqual(['1', '2']);
  });

  it('leaves out the chromosome starting at the view end', () => {
    expect(chromosomesInView(genome, { x0: 0, x1: 1000 }).map(c => c.name)).toEqual(['1']);
  });
});

describe('toGenomePosition', () => {
  it('adds the chromosome offset', () => {
    expect(toGenomePosition(genome, '2', 10)).toBe(1010);
  });

  it('gives nothing for an unknown chromosome', () => {
    expect(toGenomePosition(genome, 'Y', 10)).toBeUndefined();
  });
});

describe('clampView', () => {
  it('keeps a view inside the genome with its width', () => {
    expect(clampView(genome, -100, 500)).toEqual({ x0: 0, x1: 600 });
    expect(clampView(genome, 1500, 2100)).toEqual({ x0: 1200, x1: 1800 });
  });

  it('widens a view narrower than the minimum span around its centre', () => {
    const big = createGenome([{ name: '1', size: 10_000 }]);
    expect(clampView(big, 5000, 5010)).toEqual({ x0: 5005 - MIN_SPAN / 2, x1: 5005 + MIN_SPAN / 2 });
  });

  it('caps a view at the whole genome', () => {
    expect(clampView(genome, -5000, 5000)).toEqual({ x0: 0, x1: 1800 });
  });
});

describe('viewAround', () => {
  it('frames a region with a margin, within its chromosome', () => {
    const big = createGenome([
      { name: '1', size: 10_000 },
      { name: '2', size: 10_000 },
    ]);
    expect(viewAround(big, '2', 1000, 2000, 500)).toEqual({ x0: 10_500, x1: 12_500 });
  });

  it('shows the whole genome for an unknown chromosome', () => {
    expect(viewAround(genome, 'Y', 0, 10, 0)).toEqual({ x0: 0, x1: 1800 });
  });
});

describe('computeTicks', () => {
  const format = (n: number) => `${n}`;

  it('names the chromosomes when three or more are in view', () => {
    expect(computeTicks(genome, { x0: 0, x1: 1800 }, format)).toEqual({
      tickvals: [500, 1250, 1650],
      ticktext: ['1', '2', 'X'],
    });
  });

  it('gives local positions within one chromosome', () => {
    expect(computeTicks(genome, { x0: 1000, x1: 1500 }, format)).toEqual({
      tickvals: [1000, 1100, 1200, 1300, 1400, 1500],
      ticktext: ['2:0', '2:100', '2:200', '2:300', '2:400', '2:500'],
    });
  });
});

describe('parseLocus', () => {
  it('reads a chromosome', () => {
    expect(parseLocus(genome, 'chrX')).toEqual({ chromosome: 'X', start: 0, end: 300 });
  });

  it('reads a region with separators', () => {
    expect(parseLocus(genome, '1:100-2,00')).toEqual({ chromosome: '1', start: 100, end: 200 });
  });

  it('rejects a region ending before it starts', () => {
    expect(parseLocus(genome, '1:200-100')).toBeUndefined();
  });

  it('rejects an unknown chromosome', () => {
    expect(parseLocus(genome, 'chrY')).toBeUndefined();
  });

  it('rejects free text', () => {
    expect(parseLocus(genome, 'BRCA1')).toBeUndefined();
  });
});

describe('geneWindow', () => {
  const big = createGenome([
    { name: '1', size: 100_000_000 },
    { name: '2', size: 100_000_000 },
  ]);

  it('widens a view within a chromosome and covers it', () => {
    const window = geneWindow(big, { x0: 10_000_000, x1: 11_000_000 }, 20_000_000)!;
    expect(window.chromosome).toBe('1');
    expect(window.start).toBeLessThanOrEqual(10_000_000);
    expect(window.end).toBeGreaterThanOrEqual(11_000_000);
    expect(window.end - window.start).toBeLessThanOrEqual(20_000_000);
  });

  it('gives the same window after a small move', () => {
    expect(geneWindow(big, { x0: 10_000_000, x1: 11_000_000 }, 20_000_000)).toEqual(
      geneWindow(big, { x0: 10_100_000, x1: 11_100_000 }, 20_000_000),
    );
  });

  it('stays within the chromosome', () => {
    const window = geneWindow(big, { x0: 100_000_000, x1: 101_000_000 }, 20_000_000)!;
    expect(window.chromosome).toBe('2');
    expect(window.start).toBe(0);
  });

  it('gives nothing for a view across two chromosomes or too wide', () => {
    expect(geneWindow(big, { x0: 99_000_000, x1: 101_000_000 }, 20_000_000)).toBeUndefined();
    expect(geneWindow(big, { x0: 0, x1: 30_000_000 }, 20_000_000)).toBeUndefined();
  });
});
