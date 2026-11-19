import type { GeneTrackGene } from '@/api/api';

/** The Ensembl description of a gene, without its source suffix ("[Source:HGNC Symbol;Acc:...]"). */
export const geneDescription = (gene: GeneTrackGene) => gene.description?.replace(/\s*\[Source:[^\]]*\]\s*$/, '');
