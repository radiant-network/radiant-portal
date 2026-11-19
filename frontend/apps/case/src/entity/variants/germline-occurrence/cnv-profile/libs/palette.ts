/** The points of a track, by chromosome parity, and the rings they get once zoomed in. */
export type CloudColors = { even: string; odd: string; evenRing: string; oddRing: string };

export type CNVProfilePalette = {
  copyRatio: CloudColors;
  baf: CloudColors;
  gain: string;
  loss: string;
  roh: string;
  gene: string;
  geneOther: string;
  highlight: string;
};

// Plotly can't read CSS variables. The point pairs, and the gene colours against the gain and
// highlight colours, are checked for colour-blind separation against the light and dark card
// colours of usePlotlyTheme. A protein-coding gene stands out by lightness from the other genes.
// Each track has its own pair, in the same tone by chromosome parity: teal and green on the even
// chromosomes, purple and orchid on the odd ones.
const LIGHT: CNVProfilePalette = {
  copyRatio: { even: '#16a08e', odd: '#8a6bbf', evenRing: '#0b6b5e', oddRing: '#5c4291' },
  baf: { even: '#5b9b2a', odd: '#b8579f', evenRing: '#3a6619', oddRing: '#7e3a6c' },
  gain: '#1f6feb',
  loss: '#d1242f',
  roh: '#8b1a1a',
  gene: '#0a3069',
  geneOther: '#8fb3d9',
  highlight: '#bf8700',
};

const DARK: CNVProfilePalette = {
  copyRatio: { even: '#26a593', odd: '#9a7fd0', evenRing: '#13695e', oddRing: '#614a8f' },
  baf: { even: '#7cbf4a', odd: '#d27cbe', evenRing: '#4d7a2c', oddRing: '#8a4c7c' },
  gain: '#58a6ff',
  loss: '#ff7b72',
  roh: '#f0883e',
  gene: '#cfe0ff',
  geneOther: '#46658f',
  highlight: '#d29922',
};

export const getCNVProfilePalette = (isDark: boolean): CNVProfilePalette => (isDark ? DARK : LIGHT);

// UCSC ideogram stains.
export const CYTOBAND_STAINS: Record<string, string> = {
  gneg: '#ffffff',
  gpos25: '#c8c8c8',
  gpos50: '#969696',
  gpos75: '#646464',
  gpos100: '#1f1f1f',
  acen: '#c0392b',
  gvar: '#9fb3d9',
  stalk: '#9fb3d9',
};
