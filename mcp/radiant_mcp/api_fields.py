"""Fields the portal API accepts in a search criterion or a sort, per endpoint.

The backend silently drops a sort on a field it cannot sort, and then also
drops its default sort: the tools check fields against these lists first, so
the agent gets an error instead of rows in an unexpected order. They mirror
``CanBeFiltered`` / ``CanBeSorted`` of the backend field lists
(``backend/internal/types``, matched on ``Field.GetAlias()``);
``tests/unit/test_api_fields.py`` checks them against the portal checkout.
"""

# POST /{tenant}/cases/search (CasesFields)
CASE_FILTER_FIELDS = (
    "analysis_catalog_code", "case_category_code", "case_group", "case_id", "case_type_code", "created_on",
    "diagnosis_lab_code", "mrn", "ordering_organization_code", "organization_code", "panel_code",
    "patient_id", "prescriber", "primary_condition_id", "primary_condition_name", "priority_code",
    "proband_life_status_code", "proband_submitter_sample_ids", "project_code", "project_name",
    "sequencing_experiment_id", "status_code", "submitter_case_id", "submitter_patient_id", "updated_on",
)
CASE_SORT_FIELDS = (
    "analysis_catalog_code", "case_category_code", "case_id", "case_type_code", "created_on",
    "diagnosis_lab_code", "ordering_organization_code", "organization_code", "panel_code", "panel_name",
    "prescriber", "primary_condition_id", "primary_condition_name", "priority_code", "proband_first_name",
    "proband_id", "proband_jhn", "proband_last_name", "proband_life_status_code", "project_code",
    "project_name", "status_code", "submitter_proband_id", "updated_on",
)

# POST /{tenant}/patients/search (PcxPatientListFields)
PATIENT_FILTER_FIELDS = (
    "age_at_initial_dx_group", "chemotherapy_agents", "cns_integrated_diagnosis", "diagnosis_type_cohort",
    "got_radiation_ever", "organization_code", "patient_id", "patient_name", "vital_status",
)
PATIENT_SORT_FIELDS = (
    "birth_year", "can_read_phi", "cns_integrated_diagnosis", "diagnosis_type_cohort", "gender",
    "organization_code", "patient_id", "survival_days", "vital_status",
)

# Occurrence list endpoints of the case variants tab, per field list.
GERMLINE_SNV_SORT_FIELDS = (
    "aa_change", "ad_alt", "ad_ratio", "ad_total", "chromosome", "clinvar", "cmc_sample_mutated",
    "cmc_sample_ratio", "cmc_tier", "end", "exomiser_acmg_classification", "exomiser_acmg_evidence",
    "exomiser_gene_combined_score", "exomiser_moi", "exomiser_variant_score", "genotype_quality",
    "germline_af_wgs", "germline_af_wgs_affected", "germline_af_wgs_not_affected", "germline_af_wxs",
    "germline_af_wxs_affected", "germline_af_wxs_not_affected", "germline_hom_wgs",
    "germline_hom_wgs_affected", "germline_hom_wgs_not_affected", "germline_hom_wxs",
    "germline_hom_wxs_affected", "germline_hom_wxs_not_affected", "germline_pc_wgs",
    "germline_pc_wgs_affected", "germline_pc_wgs_not_affected", "germline_pc_wxs",
    "germline_pc_wxs_affected", "germline_pc_wxs_not_affected", "germline_pf_wgs",
    "germline_pf_wgs_affected", "germline_pf_wgs_not_affected", "germline_pf_wxs",
    "germline_pf_wxs_affected", "germline_pf_wxs_not_affected", "germline_pn_wgs",
    "germline_pn_wgs_affected", "germline_pn_wgs_not_affected", "germline_pn_wxs",
    "germline_pn_wxs_affected", "germline_pn_wxs_not_affected", "gnomad_v3_af", "hgvsg", "info_qd",
    "is_canonical", "is_mane_plus", "is_mane_select", "locus_id", "max_impact_score",
    "omim_inheritance_code", "picked_consequences", "rsnumber", "somatic_af_tn_wgs", "somatic_af_tn_wxs",
    "somatic_af_to_wgs", "somatic_af_to_wxs", "somatic_hom_tn_wgs", "somatic_hom_tn_wxs",
    "somatic_hom_to_wgs", "somatic_hom_to_wxs", "somatic_pc_tn_wgs", "somatic_pc_tn_wxs",
    "somatic_pc_to_wgs", "somatic_pc_to_wxs", "somatic_pf_tn_wgs", "somatic_pf_tn_wxs", "somatic_pf_to_wgs",
    "somatic_pf_to_wxs", "somatic_pn_tn_wgs", "somatic_pn_tn_wxs", "somatic_pn_to_wgs", "somatic_pn_to_wxs",
    "start", "symbol", "thousand_genome_af", "topmed_af", "transcript_id", "variant_class", "vep_impact",
    "zygosity",
)
SOMATIC_SNV_SORT_FIELDS = (
    "aa_change", "ad_alt", "ad_ratio", "ad_total", "aq", "chromosome", "clinvar", "cmc_sample_mutated",
    "cmc_sample_ratio", "cmc_tier", "end", "germline_af_wgs", "germline_af_wgs_affected",
    "germline_af_wgs_not_affected", "germline_af_wxs", "germline_af_wxs_affected",
    "germline_af_wxs_not_affected", "germline_hom_wgs", "germline_hom_wgs_affected",
    "germline_hom_wgs_not_affected", "germline_hom_wxs", "germline_hom_wxs_affected",
    "germline_hom_wxs_not_affected", "germline_pc_wgs", "germline_pc_wgs_affected",
    "germline_pc_wgs_not_affected", "germline_pc_wxs", "germline_pc_wxs_affected",
    "germline_pc_wxs_not_affected", "germline_pf_wgs", "germline_pf_wgs_affected",
    "germline_pf_wgs_not_affected", "germline_pf_wxs", "germline_pf_wxs_affected",
    "germline_pf_wxs_not_affected", "germline_pn_wgs", "germline_pn_wgs_affected",
    "germline_pn_wgs_not_affected", "germline_pn_wxs", "germline_pn_wxs_affected",
    "germline_pn_wxs_not_affected", "gnomad_v3_af", "hgvsg", "info_qd", "is_canonical", "is_mane_plus",
    "is_mane_select", "omim_inheritance_code", "picked_consequences", "rsnumber", "somatic_af_tn_wgs",
    "somatic_af_tn_wxs", "somatic_af_to_wgs", "somatic_af_to_wxs", "somatic_hom_tn_wgs",
    "somatic_hom_tn_wxs", "somatic_hom_to_wgs", "somatic_hom_to_wxs", "somatic_pc_tn_wgs",
    "somatic_pc_tn_wxs", "somatic_pc_to_wgs", "somatic_pc_to_wxs", "somatic_pf_tn_wgs", "somatic_pf_tn_wxs",
    "somatic_pf_to_wgs", "somatic_pf_to_wxs", "somatic_pn_tn_wgs", "somatic_pn_tn_wxs", "somatic_pn_to_wgs",
    "somatic_pn_to_wxs", "sq", "start", "symbol", "thousand_genome_af", "topmed_af", "transcript_id",
    "variant_class", "vep_impact",
)
GERMLINE_CNV_SORT_FIELDS = (
    "bc", "cn", "end", "germline_pc_wgs", "germline_pc_wgs_affected", "germline_pc_wgs_not_affected",
    "germline_pc_wxs", "germline_pc_wxs_affected", "germline_pc_wxs_not_affected", "germline_pf_wgs",
    "germline_pf_wgs_affected", "germline_pf_wgs_not_affected", "germline_pf_wxs",
    "germline_pf_wxs_affected", "germline_pf_wxs_not_affected", "germline_pn_wgs",
    "germline_pn_wgs_affected", "germline_pn_wgs_not_affected", "germline_pn_wxs",
    "germline_pn_wxs_affected", "germline_pn_wxs_not_affected", "gnomad_ac", "gnomad_af", "gnomad_sc",
    "gnomad_sf", "gnomad_sn", "length", "nb_genes", "nb_snv", "quality", "seq_id", "sm", "start", "svlen",
    "task_id", "type",
)
SOMATIC_CNV_SORT_FIELDS = (
    "ascn_as", "bc", "cn", "cnf", "cnq", "end", "gnomad_ac", "gnomad_af", "gnomad_sc", "gnomad_sf",
    "gnomad_sn", "length", "maf", "mcn", "mcnf", "mcnq", "nb_genes", "nb_snv", "quality", "sd", "seq_id",
    "sm", "somatic_pc_to_wgs", "somatic_pc_to_wxs", "somatic_pf_to_wgs", "somatic_pf_to_wxs",
    "somatic_pn_to_wgs", "somatic_pn_to_wxs", "start", "svlen", "task_id", "type",
)

# data_type -> sortable fields of its occurrence list endpoint.
OCCURRENCE_SORT_FIELDS = {
    "germline_snv": GERMLINE_SNV_SORT_FIELDS,
    "somatic_snv_tn": SOMATIC_SNV_SORT_FIELDS,
    "somatic_snv_to": SOMATIC_SNV_SORT_FIELDS,
    "germline_cnv": GERMLINE_CNV_SORT_FIELDS,
    "somatic_cnv": SOMATIC_CNV_SORT_FIELDS,
}
