import { describe, expect, it } from 'vitest';

import {
  formatLocus,
  getBravoUrl,
  getClingenCnvUrl,
  getClingenGeneUrl,
  getClinvarRcvUrl,
  getClinvarVariationUrl,
  getCohortUrl,
  getDbSnpUrl,
  getEnsemblGeneUrl,
  getEnsemblUrl,
  getFranklinCnvUrl,
  getFranklinSnvUrl,
  getGnomadVariantUrl,
  getHpoJaxUrl,
  getObolibraryUrl,
  getOmimEntryUrl,
  getOmimOrgUrl,
  getOrphanetUrl,
  getPhenotypeConditionUrl,
} from './external-links';

describe('getOmimOrgUrl', () => {
  it('searches the gene symbol when no OMIM id is given', () => {
    expect(getOmimOrgUrl({ symbol: 'ADGRV1' })).toBe(
      'https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=ADGRV1',
    );
  });

  it('links the OMIM entry when the id is given', () => {
    expect(getOmimOrgUrl({ omimGeneId: '602851', symbol: 'ADGRV1' })).toBe('https://www.omim.org/entry/602851');
  });
});

describe('getOmimEntryUrl', () => {
  it('links the OMIM entry', () => {
    expect(getOmimEntryUrl('604352')).toBe('https://www.omim.org/entry/604352');
  });
});

describe('getEnsemblUrl', () => {
  it('links a transcript or gene id', () => {
    expect(getEnsemblUrl('ENST00000405460')).toBe('https://www.ensembl.org/id/ENST00000405460');
  });
});

describe('getEnsemblGeneUrl', () => {
  it('links the gene summary by symbol', () => {
    expect(getEnsemblGeneUrl('ADGRV1')).toBe('https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=ADGRV1');
  });
});

describe('getDbSnpUrl', () => {
  it('links the rs number', () => {
    expect(getDbSnpUrl('rs56382582')).toBe('https://www.ncbi.nlm.nih.gov/snp/rs56382582');
  });
});

describe('getGnomadVariantUrl', () => {
  it('links the variant in gnomAD r4', () => {
    expect(getGnomadVariantUrl('5-90855813-C-G')).toBe(
      'https://gnomad.broadinstitute.org/variant/5-90855813-C-G?dataset=gnomad_r4',
    );
  });
});

describe('getBravoUrl', () => {
  it('links the variant in TOPMed BRAVO freeze 8', () => {
    expect(getBravoUrl('5-90855813-C-G')).toBe('https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/5-90855813-C-G');
  });
});

describe('getCohortUrl', () => {
  it('links TOPMed to BRAVO', () => {
    expect(getCohortUrl('topmed_bravo', '5-90855813-C-G')).toBe(
      'https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/5-90855813-C-G',
    );
  });

  it('links gnomAD genomes to gnomAD r4', () => {
    expect(getCohortUrl('gnomad_genomes_v3', '5-90855813-C-G')).toBe(
      'https://gnomad.broadinstitute.org/variant/5-90855813-C-G?dataset=gnomad_r4',
    );
  });

  it('has no link without a locus', () => {
    expect(getCohortUrl('topmed_bravo')).toBeUndefined();
  });

  it('has no link for another cohort', () => {
    expect(getCohortUrl('thousand_genomes', '5-90855813-C-G')).toBeUndefined();
  });
});

describe('getClinvarVariationUrl', () => {
  it('links the ClinVar variation', () => {
    expect(getClinvarVariationUrl('906693')).toBe('https://www.ncbi.nlm.nih.gov/clinvar/variation/906693');
  });
});

describe('getClinvarRcvUrl', () => {
  it('links the RCV accession with its version', () => {
    expect(getClinvarRcvUrl('RCV001156035', 4)).toBe('https://www.ncbi.nlm.nih.gov/clinvar/RCV001156035.4');
  });
});

describe('getOrphanetUrl', () => {
  it('links the Orphanet disease', () => {
    expect(getOrphanetUrl('10424')).toBe('https://www.orpha.net/en/disease/detail/10424');
  });
});

describe('getHpoJaxUrl', () => {
  it('links the HPO term', () => {
    expect(getHpoJaxUrl('HP:0000512')).toBe('https://hpo.jax.org/app/browse/term/HP:0000512');
  });
});

describe('getObolibraryUrl', () => {
  it('turns the code into an OBO PURL', () => {
    expect(getObolibraryUrl('MONDO:0000004')).toBe('http://purl.obolibrary.org/obo/MONDO_0000004');
  });
});

describe('getPhenotypeConditionUrl', () => {
  it('links a Mondo condition', () => {
    expect(getPhenotypeConditionUrl('MONDO:0700092')).toBe('http://purl.obolibrary.org/obo/MONDO_0700092');
  });

  it('links an HPO phenotype', () => {
    expect(getPhenotypeConditionUrl('HP:0000512')).toBe('http://purl.obolibrary.org/obo/HP_0000512');
  });

  it('has no link for another ontology', () => {
    expect(getPhenotypeConditionUrl('OMIM:604352')).toBeUndefined();
  });
});

describe('getClingenGeneUrl', () => {
  it('searches the gene in ClinGen', () => {
    expect(getClingenGeneUrl('GUSBP11')).toBe('https://search.clinicalgenome.org/kb/genes?search=GUSBP11');
  });
});

describe('getClingenCnvUrl', () => {
  it('searches the GRCh38 region in ClinGen', () => {
    expect(getClingenCnvUrl('22', 23709335, 23719924)).toBe(
      'https://search.clinicalgenome.org/kb/regions?page=1&type=GRCh38&region=chr22%3A23709335-23719924&size=25&search=',
    );
  });
});

describe('formatLocus', () => {
  it('joins the variant in VCF order', () => {
    expect(formatLocus('1', 21836953, 'C', 'T')).toBe('1-21836953-C-T');
  });
});

describe('getFranklinSnvUrl', () => {
  it('links the somatic SNV in Franklin', () => {
    expect(getFranklinSnvUrl('1-21836953-C-T')).toBe(
      'https://franklin.genoox.com/clinical-db/variant/snpTumor/chr1-21836953-C-T-hg38',
    );
  });
});

describe('getFranklinCnvUrl', () => {
  it('links a gain as a duplication', () => {
    expect(getFranklinCnvUrl('22', 23709335, 23719924, 'GAIN')).toBe(
      'https://franklin.genoox.com/clinical-db/variant/sv/chr22-23709335-23719924-DUP-HG38',
    );
  });

  it('links a loss as a deletion', () => {
    expect(getFranklinCnvUrl('22', 23709335, 23719924, 'LOSS')).toBe(
      'https://franklin.genoox.com/clinical-db/variant/sv/chr22-23709335-23719924-DEL-HG38',
    );
  });
});
