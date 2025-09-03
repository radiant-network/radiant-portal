/// <reference types="cypress"/>
import { CommonSelectors } from './Selectors';

export const data = {
  variantGermline: {
    variant: 'chr1:g.201361940A>G',
    type: 'SNV',
    dbsnp: 'rs45520032',
    gene: 'TNNT2',
    consequence: 'Missense Variant',
    aa_change: 'p.Ile231Thr',
    consequenceImpact: CommonSelectors.vepIndicator('amber'),
    maneC: true,
    maneM: false,
    maneP: false,
    omim: ['AD'],
    clinvar: ['B', 'VUS', 'CI', 'LB'],
    exomiser: '0.274',
    acmg_exomiser: ['VUS'],
    gnomad: '1.45e-4',
    freq: '5.00e-1',
    gq: '99.00',
    zyg: '0/1',
    ad_ratio: '0.39',
    sqon: '{"content":[{"content":{"field":"hgvsg","value":["chr1:g.201361940A>G"]},"op":"in"}],"op":"and"}',
  },
};
