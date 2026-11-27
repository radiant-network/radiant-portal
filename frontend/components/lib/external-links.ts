export type GetOmimOrgUrlProps = {
  omimGeneId?: string;
  symbol: string;
};

export function getOmimOrgUrl({ omimGeneId, symbol }: GetOmimOrgUrlProps): string {
  if (omimGeneId) {
    return getOmimEntryUrl(omimGeneId);
  }

  return `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${symbol}`;
}

export function getEnsemblUrl(id: string): string {
  return `https://www.ensembl.org/id/${id}`;
}

export function getEnsemblGeneUrl(symbol: string): string {
  return `https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${symbol}`;
}

export function getDbSnpUrl(rsnumber: string): string {
  return `https://www.ncbi.nlm.nih.gov/snp/${rsnumber}`;
}

// locus in VCF representation: chromosome-position-reference-alternate
export function getFranklinSnvUrl(locus: string): string {
  return `https://franklin.genoox.com/clinical-db/variant/snpTumor/chr${locus}-hg38`;
}

// TODO: use the genome_build once the API returns it, the URL assumes GRCh38.
export function getFranklinCnvUrl(chromosome: string, start: number, end: number, type: string): string {
  const svType = type === 'GAIN' ? 'DUP' : 'DEL';
  return `https://franklin.genoox.com/clinical-db/variant/sv/chr${chromosome}-${start}-${end}-${svType}-HG38`;
}

// TODO: use the genome_build once the API returns it, the URL assumes GRCh38.
export function getClingenCnvUrl(chromosome: string, start: number, end: number): string {
  return `https://search.clinicalgenome.org/kb/regions?page=1&type=GRCh38&region=chr${chromosome}%3A${start}-${end}&size=25&search=`;
}

export function getClingenGeneUrl(symbol: string): string {
  return `https://search.clinicalgenome.org/kb/genes?search=${symbol}`;
}

export function getGnomadVariantUrl(locus: string): string {
  return `https://gnomad.broadinstitute.org/variant/${locus}?dataset=gnomad_r4`;
}

export function getBravoUrl(locus: string): string {
  return `https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/${locus}`;
}

export function getCohortUrl(cohort: string, locus?: string): string | undefined {
  if (!locus) return undefined;
  switch (cohort) {
    case 'topmed_bravo':
      return getBravoUrl(locus);
    case 'gnomad_genomes_v3':
      return getGnomadVariantUrl(locus);
    default:
      return undefined;
  }
}

export function getClinvarVariationUrl(id: string): string {
  return `https://www.ncbi.nlm.nih.gov/clinvar/variation/${id}`;
}

export function getClinvarRcvUrl(accession: string, version?: number | string): string {
  return `https://www.ncbi.nlm.nih.gov/clinvar/${accession}.${version}`;
}

export function getOmimEntryUrl(id: string): string {
  return `https://www.omim.org/entry/${id}`;
}

export function getOrphanetUrl(id: string): string {
  return `https://www.orpha.net/en/disease/detail/${id}`;
}

export function getHpoJaxUrl(id: string): string {
  return `https://hpo.jax.org/app/browse/term/${id}`;
}

// code as "PREFIX:ID", e.g. MONDO:0700092 or HP:0000512
export function getObolibraryUrl(code: string): string {
  return `http://purl.obolibrary.org/obo/${code.replace(':', '_')}`;
}

// Mondo and HPO codes only; other ontologies have no link
export function getPhenotypeConditionUrl(code: string): string | undefined {
  const prefix = code.split(':')[0];
  if (prefix === 'MONDO' || prefix === 'HP') {
    return getObolibraryUrl(code);
  }
  return undefined;
}

// VCF representation used by Franklin, gnomAD and BRAVO
export function formatLocus(chromosome: string, start: number, reference: string, alternate: string): string {
  return `${chromosome}-${start}-${reference}-${alternate}`;
}
