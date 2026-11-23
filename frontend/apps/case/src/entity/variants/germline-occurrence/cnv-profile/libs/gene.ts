import type { GeneTrackGene } from '@/api/api';

// Drops the "[Source:HGNC Symbol;Acc:...]" suffix of the Ensembl descriptions.
export const geneDescription = (gene: GeneTrackGene) => gene.description?.replace(/\s*\[Source:[^\]]*\]\s*$/, '');
