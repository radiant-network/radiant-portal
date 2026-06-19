export type DataReleaseStatKey = 'studies' | 'participants' | 'biospecimens' | 'families' | 'files' | 'variants';

/** Mock data-release figures — replaced by real counts in a later task. */
export const dataReleaseStats: { key: DataReleaseStatKey; value: number }[] = [
  { key: 'studies', value: 17 },
  { key: 'participants', value: 13500 },
  { key: 'biospecimens', value: 24180 },
  { key: 'families', value: 6492 },
  { key: 'files', value: 121540 },
  { key: 'variants', value: 8920000 },
];
