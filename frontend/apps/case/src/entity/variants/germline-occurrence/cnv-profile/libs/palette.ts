export type CNVProfilePalette = {
  pointEven: string;
  pointOdd: string;
  pointEvenRing: string;
  pointOddRing: string;
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
const LIGHT: CNVProfilePalette = {
  pointEven: '#16a08e',
  pointOdd: '#8a6bbf',
  pointEvenRing: '#0b6b5e',
  pointOddRing: '#5c4291',
  gain: '#1f6feb',
  loss: '#d1242f',
  roh: '#8b1a1a',
  gene: '#0a3069',
  geneOther: '#8fb3d9',
  highlight: '#bf8700',
};

const DARK: CNVProfilePalette = {
  pointEven: '#26a593',
  pointOdd: '#9a7fd0',
  pointEvenRing: '#13695e',
  pointOddRing: '#614a8f',
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
