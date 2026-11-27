import { DEPTHS, type GeneCoverage } from './qc-gene-coverage-rules';

const GENE_NAMES = [
  'MT-ND6',
  'ZBED1',
  'FAM25C',
  'GPAT2',
  'SSU72P7',
  'PRAMEF7',
  'CCZ1B',
  'GOLGA8Q',
  'ACKR4',
  'ZNF714',
  'BRCA1',
  'BRCA2',
  'TP53',
  'CFTR',
  'DMD',
  'SCN1A',
  'MECP2',
  'FBN1',
  'COL1A1',
  'COL1A2',
  'MYH7',
  'MYBPC3',
  'KCNQ1',
  'KCNH2',
  'LMNA',
  'PKD1',
  'PKD2',
  'SMN1',
  'SMN2',
  'CYP21A2',
  'GBA1',
  'HBB',
  'HBA1',
  'PAH',
  'FMR1',
  'NF1',
  'TSC1',
  'TSC2',
  'RYR1',
  'TTN',
  'NEB',
  'USH2A',
  'ABCA4',
  'RPGR',
  'CHD7',
  'ARID1B',
  'KMT2D',
  'ANKRD11',
  'SYNGAP1',
  'STXBP1',
];

// Deterministic pseudo-random generator, so the story is stable between reloads.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const random = createRandom(42);

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

type Profile = { meanMin: number; meanRange: number; startMin: number; startRange: number; decay: number };

// One profile per gene in turn: well covered, borderline, poorly covered, unmappable.
const PROFILES: Profile[] = [
  { meanMin: 80, meanRange: 170, startMin: 101, startRange: 4, decay: 0.0006 },
  { meanMin: 80, meanRange: 170, startMin: 101, startRange: 4, decay: 0.0006 },
  { meanMin: 80, meanRange: 170, startMin: 101, startRange: 4, decay: 0.0006 },
  { meanMin: 30, meanRange: 220, startMin: 97, startRange: 3, decay: 0.003 },
  { meanMin: 30, meanRange: 220, startMin: 97, startRange: 3, decay: 0.003 },
  { meanMin: 30, meanRange: 220, startMin: 50, startRange: 40, decay: 0.012 },
  { meanMin: 0, meanRange: 4, startMin: 0, startRange: 8, decay: 0.012 },
];

function buildGene(gene: string, index: number): GeneCoverage {
  const profile = PROFILES[index % PROFILES.length];
  const size = Math.round(250 + random() * 9000);
  const mean = round1(profile.meanMin + random() * profile.meanRange);
  const start = profile.startMin + random() * profile.startRange;
  const pct = DEPTHS.map(depth =>
    round1(Math.max(0, Math.min(100, start * Math.exp(-profile.decay * depth * (150 / Math.max(mean, 1)))))),
  );
  return { gene, size, mean, pct };
}

export const geneCoverageMock: GeneCoverage[] = GENE_NAMES.map(buildGene);
