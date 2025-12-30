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
