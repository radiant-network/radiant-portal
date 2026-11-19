export type GetOmimOrgUrlProps = {
  omimGeneId?: string;
  symbol: string;
};

export function getOmimOrgUrl({ omimGeneId, symbol }: GetOmimOrgUrlProps): string {
  if (omimGeneId) {
    return `https://www.omim.org/entry/${omimGeneId}`;
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

/**
 * @TODO: genome_build will be added later in API; the URL assumes GRCh38. A gain is a DUP and a loss
 * a DEL.
 */
export function getFranklinCnvUrl(chromosome: string, start: number, end: number, type: string): string {
  const svType = type === 'GAIN' ? 'DUP' : 'DEL';
  return `https://franklin.genoox.com/clinical-db/variant/sv/chr${chromosome}-${start}-${end}-${svType}-HG38`;
}

/**
 * The ClinGen regions overlapping a CNV. @TODO: genome_build will be added later in API; the URL
 * assumes GRCh38.
 */
export function getClingenCnvUrl(chromosome: string, start: number, end: number): string {
  return `https://search.clinicalgenome.org/kb/regions?page=1&type=GRCh38&region=chr${chromosome}%3A${start}-${end}&size=25&search=`;
}
