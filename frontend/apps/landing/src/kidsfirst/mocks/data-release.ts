export type StatKey = 'studies' | 'participants' | 'variants' | 'biospecimens' | 'files' | 'genomes';

/** Mock data-release figures — replaced by real counts in a later task. */
export const stats: { key: StatKey; value: number | string }[] = [
  { key: 'studies', value: 8 },
  { key: 'participants', value: '11K' },
  { key: 'variants', value: '39M+' },
  { key: 'biospecimens', value: '16.3K' },
  { key: 'files', value: '680.4 TB' },
  { key: 'genomes', value: 9121 },
];
