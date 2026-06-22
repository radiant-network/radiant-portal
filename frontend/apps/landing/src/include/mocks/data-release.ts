export type DataReleaseStatKey = 'studies' | 'participants' | 'biospecimens' | 'genomes' | 'files' | 'transcriptomes';

/** Mock data-release figures — replaced by real counts in a later task. */
export const dataReleaseStats: { key: DataReleaseStatKey; value: number | string }[] = [
  { key: 'studies', value: 38 },
  { key: 'participants', value: 13500 },
  { key: 'biospecimens', value: 65634 },
  { key: 'files', value: '63.05 TB' },
  { key: 'genomes', value: 2022 },
  { key: 'transcriptomes', value: 956 },
];
