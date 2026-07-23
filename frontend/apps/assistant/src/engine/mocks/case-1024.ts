import { type ChartDatum, type TableBlock } from '../../types';

/**
 * Mocked data for the demo scenario: pediatric case 1024 (epilepsy panel).
 * Stands in for real variant/patient/case lookups until a backend exists.
 */

export const VARIANTS_TABLE: TableBlock = {
  type: 'table',
  title: 'Prioritized variants — case 1024',
  columns: [
    { key: 'gene', label: 'Gene' },
    { key: 'variant', label: 'Variant' },
    { key: 'classification', label: 'ACMG' },
    { key: 'zygosity', label: 'Zygosity' },
    { key: 'gnomad', label: 'gnomAD AF' },
  ],
  rows: [
    {
      gene: 'SCN1A',
      variant: 'c.2792T>C p.(Leu931Pro)',
      classification: 'Pathogenic',
      zygosity: 'Het (de novo)',
      gnomad: '—',
    },
    {
      gene: 'KCNQ2',
      variant: 'c.740C>T p.(Ser247Leu)',
      classification: 'Likely pathogenic',
      zygosity: 'Het',
      gnomad: '0.00001',
    },
    { gene: 'STXBP1', variant: 'c.1217G>A p.(Arg406His)', classification: 'VUS', zygosity: 'Het', gnomad: '0.00003' },
    {
      gene: 'CFTR',
      variant: 'c.1521_1523del p.(Phe508del)',
      classification: 'Pathogenic',
      zygosity: 'Het (carrier)',
      gnomad: '0.0070',
    },
  ],
};

export const CLASSIFICATION_CHART_DATA: ChartDatum[] = [
  { label: 'Pathogenic', count: 2 },
  { label: 'Likely pathogenic', count: 1 },
  { label: 'VUS', count: 1 },
];

export const PATIENT_SUMMARY = [
  'Case 1024 — female, 4 years old, affected.',
  'Phenotype: seizures (HP:0001250), global developmental delay (HP:0001263).',
  'Analysis: trio (proband + both parents). 4 variants passed filtering, 2 classified pathogenic.',
].join(' ');
