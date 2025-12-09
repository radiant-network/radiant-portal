/// <reference types="cypress"/>
export const CommonTexts = {
  en: {
    igvMaxZoom: '40 bp',
    igvTitle: 'Alignment and variant',
    igvTrackRefseq: 'Refseq Genes',
    igvTrackReads: (sample: string, relationship: string) => `Reads: ${sample} ${relationship}`,
    loginContent: 'Log in with',
    switchLanguage: 'FR',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
  },
  fr: {
    igvMaxZoom: '40 bp',
    igvTitle: 'Alignement et variant',
    igvTrackRefseq: 'Refseq Genes',
    igvTrackReads: (sample: string, relationship: string) => `Reads: ${sample} ${relationship}`,
    loginContent: 'Choisir votre identifiant',
    switchLanguage: 'EN',
    expandAll: 'Développer tout',
    collapseAll: 'Réduire tout',
  },
};
