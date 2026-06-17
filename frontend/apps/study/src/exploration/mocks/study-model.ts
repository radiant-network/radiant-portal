/**
 * A single study row.
 * TODO(back): replace with the generated `Study` model from frontend/api/ once the endpoint exists.
 */
export interface Study {
  study_code: string;
  study_name: string;
  program: string;
  domain: string;
  dbgap: string | null;
  participant_count: number | null;
  biospecimen_count: number | null;
  family_count: number | null;
  file_count: number | null;
  /** Drives the "Data Category" facet AND the Genomics/Transcriptomics/Imaging/Proteomics columns. */
  data_categories: string[];
  experimental_strategies: string[];
  family_data: boolean;
}
