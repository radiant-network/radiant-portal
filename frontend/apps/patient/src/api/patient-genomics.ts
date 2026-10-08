import type { ListBodyWithCriteria } from '@/api/api';

// TODO: replace with generated types from frontend/api/ once backend exposes
// /{tenant}/patients/{patient_id}/{cases,interpretations}

export type GenomicCase = {
  case_id: number;
  priority_code: 'asap' | 'routine' | 'stat' | 'urgent';
  status_code: 'draft' | 'in_progress' | 'in_review' | 'completed' | 'processing' | 'submitted';
  sample_scope: string;
  assay: string;
  requested_by: string;
  requested_by_name?: string;
  updated_day: number;
};

export type GenomicCasesSearchResponse = {
  list: GenomicCase[];
  count: number;
};

export type VariantInterpretation = {
  gene: string;
  variant: string;
  locus_id: string;
  classification: string;
  origin: 'germline' | 'somatic';
  case_id: number;
  assay: string;
  reported_day: number;
};

export type VariantInterpretationsSearchResponse = {
  list: VariantInterpretation[];
  count: number;
};

const CASES_MOCK: Record<string, GenomicCase[]> = {
  C1032093: [
    {
      case_id: 1032093001,
      priority_code: 'urgent',
      status_code: 'in_progress',
      sample_scope: 'Germline + tumour',
      assay: 'WGS',
      requested_by: 'CHOP',
      requested_by_name: "The Children's Hospital of Philadelphia",
      updated_day: 1026,
    },
  ],
  C974652: [
    {
      case_id: 974652001,
      priority_code: 'urgent',
      status_code: 'in_progress',
      sample_scope: 'Germline + tumour',
      assay: 'WGS',
      requested_by: 'CHOP',
      requested_by_name: "The Children's Hospital of Philadelphia",
      updated_day: 1571,
    },
    {
      case_id: 974652002,
      priority_code: 'routine',
      status_code: 'completed',
      sample_scope: 'Tumour only',
      assay: 'WES',
      requested_by: 'CHOP',
      requested_by_name: "The Children's Hospital of Philadelphia",
      updated_day: 1589,
    },
  ],
  C7617267: [
    {
      case_id: 7617267001,
      priority_code: 'urgent',
      status_code: 'completed',
      sample_scope: 'Germline + tumour',
      assay: 'WGS',
      requested_by: 'SCH',
      requested_by_name: "Seattle Children's Hospital",
      updated_day: 1190,
    },
  ],
  C886092: [
    {
      case_id: 886092001,
      priority_code: 'routine',
      status_code: 'completed',
      sample_scope: 'Tumour only',
      assay: 'WGS',
      requested_by: 'UCSF',
      requested_by_name: "UCSF Benioff Children's Hospital",
      updated_day: 370,
    },
  ],
  C4261089: [
    {
      case_id: 4261089001,
      priority_code: 'urgent',
      status_code: 'in_progress',
      sample_scope: 'Germline + tumour',
      assay: 'WGS',
      requested_by: 'CHOP',
      requested_by_name: "The Children's Hospital of Philadelphia",
      updated_day: 4160,
    },
  ],
};

const LOCUS = {
  smarcb1_arg201ter: 'smarcb1-p-arg201ter',
  smarcb1_arg374ter: 'smarcb1-p-arg374ter',
  smarcb1_gln318ter: 'smarcb1-p-gln318ter',
  smarcb1_glu138ter: 'smarcb1-p-glu138ter',
  tp53_arg248trp: 'tp53-p-arg248trp',
  arid1a_gln1402fs: 'arid1a-p-gln1402fs',
  ctnnb1_ser37cys: 'ctnnb1-p-ser37cys',
  ezh2_tyr646asn: 'ezh2-p-tyr646asn',
  myc_amplification: 'myc-amplification',
};

const INTERPRETATIONS_MOCK: Record<string, VariantInterpretation[]> = {
  C1032093: [
    {
      gene: 'SMARCB1',
      variant: 'p.Arg201Ter',
      locus_id: LOCUS.smarcb1_arg201ter,
      classification: 'pathogenic',
      origin: 'germline',
      case_id: 1032093001,
      assay: 'WGS',
      reported_day: 1026,
    },
  ],
  C974652: [
    {
      gene: 'SMARCB1',
      variant: 'p.Arg374Ter',
      locus_id: LOCUS.smarcb1_arg374ter,
      classification: 'pathogenic',
      origin: 'germline',
      case_id: 974652001,
      assay: 'WGS',
      reported_day: 1571,
    },
    {
      gene: 'SMARCB1',
      variant: 'p.Arg374Ter',
      locus_id: LOCUS.smarcb1_arg374ter,
      classification: 'pathogenic',
      origin: 'somatic',
      case_id: 974652001,
      assay: 'WGS',
      reported_day: 1571,
    },
    {
      gene: 'SMARCB1',
      variant: 'p.Arg374Ter',
      locus_id: LOCUS.smarcb1_arg374ter,
      classification: 'likely_pathogenic',
      origin: 'somatic',
      case_id: 974652002,
      assay: 'WES',
      reported_day: 1589,
    },
    {
      gene: 'TP53',
      variant: 'p.Arg248Trp',
      locus_id: LOCUS.tp53_arg248trp,
      classification: 'uncertain_significance',
      origin: 'somatic',
      case_id: 974652001,
      assay: 'WGS',
      reported_day: 1571,
    },
    {
      gene: 'ARID1A',
      variant: 'p.Gln1402fs',
      locus_id: LOCUS.arid1a_gln1402fs,
      classification: 'uncertain_significance',
      origin: 'somatic',
      case_id: 974652002,
      assay: 'WES',
      reported_day: 1589,
    },
  ],
  C7617267: [
    {
      gene: 'SMARCB1',
      variant: 'p.Gln318Ter',
      locus_id: LOCUS.smarcb1_gln318ter,
      classification: 'pathogenic',
      origin: 'germline',
      case_id: 7617267001,
      assay: 'WGS',
      reported_day: 1190,
    },
    {
      gene: 'SMARCB1',
      variant: 'p.Gln318Ter',
      locus_id: LOCUS.smarcb1_gln318ter,
      classification: 'pathogenic',
      origin: 'somatic',
      case_id: 7617267001,
      assay: 'WGS',
      reported_day: 1190,
    },
    {
      gene: 'CTNNB1',
      variant: 'p.Ser37Cys',
      locus_id: LOCUS.ctnnb1_ser37cys,
      classification: 'uncertain_significance',
      origin: 'somatic',
      case_id: 7617267001,
      assay: 'WGS',
      reported_day: 1190,
    },
  ],
  C886092: [
    {
      gene: 'SMARCB1',
      variant: 'p.Arg201Ter',
      locus_id: LOCUS.smarcb1_arg201ter,
      classification: 'pathogenic',
      origin: 'somatic',
      case_id: 886092001,
      assay: 'WGS',
      reported_day: 370,
    },
    {
      gene: 'EZH2',
      variant: 'p.Tyr646Asn',
      locus_id: LOCUS.ezh2_tyr646asn,
      classification: 'uncertain_significance',
      origin: 'somatic',
      case_id: 886092001,
      assay: 'WGS',
      reported_day: 370,
    },
  ],
  C4261089: [
    {
      gene: 'SMARCB1',
      variant: 'p.Glu138Ter',
      locus_id: LOCUS.smarcb1_glu138ter,
      classification: 'pathogenic',
      origin: 'somatic',
      case_id: 4261089001,
      assay: 'WGS',
      reported_day: 4160,
    },
    {
      gene: 'MYC',
      variant: 'Amplification',
      locus_id: LOCUS.myc_amplification,
      classification: 'pathogenic',
      origin: 'somatic',
      case_id: 4261089001,
      assay: 'WGS',
      reported_day: 4160,
    },
  ],
};

const MOCK_LATENCY_MS = 300;

// TODO: swap for caseApi.searchCases({ search_criteria: [{ field: 'proband_id', value: [patientId] }] })
// once Hannah adds patient_id to the StarRocks patients table; fall back to mock only on 404
export async function fetchGenomicCasesForPatient(
  patientId: string,
  body: ListBodyWithCriteria = {},
): Promise<GenomicCasesSearchResponse> {
  await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
  const all = CASES_MOCK[patientId] ?? [];
  const limit = body.limit ?? all.length;
  const pageIndex = body.page_index ?? 0;
  const start = pageIndex * limit;
  return {
    list: all.slice(start, start + limit),
    count: all.length,
  };
}

// TODO: swap for interpretationsApi.searchInterpretationGermline + Somatic, union client-side,
// filter on case_id ∈ patient's cases; fall back to mock only on 404
export async function fetchInterpretationsForPatient(
  patientId: string,
  body: ListBodyWithCriteria = {},
): Promise<VariantInterpretationsSearchResponse> {
  await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
  const all = INTERPRETATIONS_MOCK[patientId] ?? [];
  const limit = body.limit ?? all.length;
  const pageIndex = body.page_index ?? 0;
  const start = pageIndex * limit;
  return {
    list: all.slice(start, start + limit),
    count: all.length,
  };
}
