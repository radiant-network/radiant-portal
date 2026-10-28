import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';

// Bounds are inclusive, as the ETL relates the genes to a CNV and genes_overlap counts its exons.
export const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  a.start <= b.end && a.end >= b.start;

export function cnvsOnGene(segments: CNVProfileSegment[], gene: GeneTrackGene): CNVProfileSegment[] {
  return segments.filter(segment => segment.chromosome === gene.chromosome && overlaps(segment, gene));
}

export function exonsHit(gene: GeneTrackGene, segment: CNVProfileSegment): number {
  return gene.exons.filter(exon => overlaps(exon, segment)).length;
}
