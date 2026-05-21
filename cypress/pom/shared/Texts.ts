/// <reference types="cypress"/>
export const CommonTexts = {
  en: {
    collapseAll: 'Collapse all',
    expandAll: 'Expand all',
    format: 'Format',
    igvMaxZoom: '40 bp',
    igvTitle: 'Alignment and variant',
    igvTrackReads: (sample: string, relationship: string) => `Reads: ${sample} ${relationship}`,
    igvTrackRefseq: 'Refseq Genes',
    loginContent: 'Log in with',
    manageFilters: 'Manage filters',
    switchLanguage: 'FR',
  },
  fr: {
    collapseAll: 'Réduire tout',
    expandAll: 'Développer tout',
    format: 'Format',
    igvMaxZoom: '40 bp',
    igvTitle: 'Alignement et variant',
    igvTrackReads: (sample: string, relationship: string) => `Reads: ${sample} ${relationship}`,
    igvTrackRefseq: 'Refseq Genes',
    loginContent: 'Choisir votre identifiant',
    manageFilters: 'Gérer les filtres',
    switchLanguage: 'EN',
  },
};
