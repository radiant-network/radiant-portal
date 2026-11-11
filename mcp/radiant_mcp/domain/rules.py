"""Clinical rules of the RAD-252 tools, in one place.

They decide what ``second_hit``, the carrier tools (``cohort_carriers``,
``genotype_phenotype``) and the charts report to geneticists, so they are fixed by the spec
(hub ``docs/features/RAD-252-david-p2-tools.md``) and restated in each tool's
output. Every stored value used here is checked against ``enums.ENUMS`` by
the unit tests.
"""

# A variant is rare when gnomAD v3 has it below this allele frequency, or not at all.
RARE_MAX_AF = 0.01

# Impacts that make a rare SNV a candidate on their own.
QUALIFYING_IMPACTS = ("HIGH", "MODERATE")
# A P/LP classification (and a ClinVar filter) belongs to the variant, not to a gene: it counts
# for a gene the variant is in only when that gene is its picked gene, or the variant has an
# effect there (impact at least LOW). A variant pathogenic for gene A and only intronic in a
# nested gene B is not P/LP for B; a deep intronic pathogenic variant still counts for A.
PLP_GENE_IMPACTS = ("HIGH", "MODERATE", "LOW")

# Pathogenic or likely pathogenic, from three sources.
CLINVAR_PLP = ("Pathogenic", "Likely_pathogenic")
EXOMISER_PLP = ("pathogenic", "likely_pathogenic")
# Germline interpretations saved in the portal store LOINC answer codes.
INTERPRETATION_PLP = ("LA6668-3", "LA26332-9")

# CNV types that count as a second event.
GERMLINE_SECOND_HIT_CNV_TYPES = ("LOSS",)
SOMATIC_SECOND_HIT_CNV_TYPES = ("LOSS", "CNLOH")

PASS = "PASS"
HET = "HET"
# A germline SNV call counts as a carrier when it passes the ETL's carrier rule
# (`qualifies` in germline_snv_staging_variant_freq_insert.sql): FILTER PASS, GQ and
# alternate depth at least these (queries/quality.py). Keep them equal to the ETL's.
GERMLINE_MIN_GQ = 20
GERMLINE_MIN_AD_ALT = 3
GERMLINE_QUALITY_DEFINITION = (
    f"germline SNV calls with FILTER PASS, GQ >= {GERMLINE_MIN_GQ} and alternate depth >= {GERMLINE_MIN_AD_ALT} "
    "(the platform's carrier rule, as in the variant frequencies)"
)
# A somatic SNV call counts as a carrier under the ETL's somatic rule (`qualifies` in
# somatic_snv_staging_variant_freq_insert.sql): FILTER PASS and tumor alternate depth at
# least this (queries/quality.py). Keep it equal to the ETL's.
SOMATIC_MIN_TUMOR_AD_ALT = 2
SOMATIC_QUALITY_DEFINITION = (
    f"somatic SNV calls with FILTER PASS and tumor alternate depth >= {SOMATIC_MIN_TUMOR_AD_ALT} "
    "(the platform's carrier rule, as in the variant frequencies)"
)
# Calls with an alternate allele. The ETL loads only rows with one (has_alt), so a
# filter on them is a safeguard, not a semantic change.
ALT_ZYGOSITIES = ("HET", "HOM", "HEM")
# An SNV inside a heterozygous deletion keeps one allele: the caller reports it HOM (or HEM).
HEMIZYGOUS_CALLS = ("HOM", "HEM")

# A tumor call of the germline first-hit variant itself is not a somatic second hit.
# A high tumor allele ratio suggests the normal allele was lost (LOH), but tumor
# purity is unknown, so it is flagged for the geneticist, never counted as a hit.
ALLELIC_IMBALANCE_MIN_RATIO = 0.6

# VEP consequences that place a variant NEAR a gene, not in it: VEP runs with its
# default 5 kb distance and keeps every consequence (--flag_pick, not --pick), so a
# variant of one gene is also "upstream" of its neighbours. A variant belongs to a
# gene when it has any other consequence on it (intronic ones included).
NEARBY_CONSEQUENCES = ("upstream_gene_variant", "downstream_gene_variant", "intergenic_variant")

# staging_sequencing_experiment.task_type of a germline SNV annotation task.
GERMLINE_SNV_TASK_TYPE = "radiant_germline_annotation"
# The task type whose output feeds each cohort data type's occurrence table (ETL
# staging_external_sequencing_experiment: the VCF of these tasks only).
TASK_TYPES = {
    "germline_snv": GERMLINE_SNV_TASK_TYPE,
    "germline_cnv": "alignment_germline_variant_calling",
    "somatic_snv_tn": "radiant_somatic_annotation",
    "somatic_cnv": "tumor_only_variant_calling",
}
# staging_sequencing_experiment.ingested_at of a task whose occurrences are not loaded
# yet: the ETL inserts the row at the epoch and sets the time once the partition is
# imported (NULL: to import again). The ETL's own "imported" test is `> this`
# (clinical/case_status_select.sql).
NOT_INGESTED = "1970-01-01 00:00:00"
# staging_sequencing_experiment.histology_type of a normal sample. A somatic SNV task
# with one is tumor-normal, without one tumor-only (the portal's somaticCohortCounts).
NORMAL_HISTOLOGY = "normal"

# `family_role` of the proband in staging_sequencing_experiment. Parents' sequencings
# carry the proband's case_id, so a germline count per case keeps the proband only.
PROBAND = "proband"

# Portal observations: an observed (positive) HPO phenotype.
PHENOTYPE_OBSERVATION_CODE = "phenotype"
POSITIVE_INTERPRETATION_CODE = "positive"

PLP_DEFINITION = (
    "P/LP = ClinVar Pathogenic or Likely_pathogenic, or Exomiser pathogenic or likely_pathogenic, "
    "or a portal interpretation classified Pathogenic (LA6668-3) or Likely pathogenic (LA26332-9). "
    "It counts for a gene when that gene is the variant's picked gene, or the variant's impact there is at "
    "least LOW: a variant pathogenic for one gene and only intronic in an overlapping one is not P/LP for it."
)
RARE_DEFINITION = f"rare = gnomAD v3 AF < {RARE_MAX_AF:g} or absent from gnomAD."
