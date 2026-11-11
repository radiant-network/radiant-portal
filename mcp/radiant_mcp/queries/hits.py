"""SQL of ``second_hit``. Every occurrence query filters on its key's ``part``.

An SNV belongs to every gene it has a consequence on (``snv__consequence_filter``),
not only its picked gene, and its impact is the impact on that gene. A gene it is
only near (upstream, downstream, intergenic: ``rules.NEARBY_CONSEQUENCES``) does
not count, or a variant of one gene would be a hit in its neighbours too."""

from .. import sql as _sql
from ..domain import rules as _rules
from .impact import impact_label, impact_rank
from .quality import germline_qualifies, somatic_qualifies

# Rows a list returns; one more is fetched to tell a truncated list.
ROW_LIMIT = 200


def _plp_condition(p: _sql.Params, interpretation_alias: str = "ig") -> str:
    return (
        f"(arrays_overlap(v.clinvar_interpretation, [{p.list(_rules.CLINVAR_PLP)}]) "
        f"OR o.exomiser_acmg_classification IN ({p.list(_rules.EXOMISER_PLP)}) "
        f"OR {interpretation_alias}.locus_id IS NOT NULL)"
    )


def _plp_on_gene(p: _sql.Params) -> str:
    """The P/LP classification counts for this ``cf`` row's gene (``rules.PLP_GENE_IMPACTS``)."""
    return f"(cf.symbol = v.symbol OR cf.vep_impact IN ({p.list(_rules.PLP_GENE_IMPACTS)}))"


def _interpretations(p: _sql.Params, tenant_db: str, seq_id: int) -> str:
    """Loci of a sequencing that a geneticist classified P/LP in the portal."""
    return (
        f"(SELECT DISTINCT locus_id FROM {tenant_db}.interpretation_germline "
        f"WHERE sequencing_id = {p(str(seq_id))} AND classification IN ({p.list(_rules.INTERPRETATION_PLP)}))"
    )


def _impact_on_gene(p: _sql.Params) -> str:
    """The most severe impact of the variant on the gene, over the rows the query kept: a
    window, so DISTINCT folds the per-transcript rows before the LIMIT counts them."""
    return impact_label(p, f"MIN({impact_rank(p)}) OVER (PARTITION BY o.locus_id, cf.symbol)")


def _gene_join(p: _sql.Params) -> str:
    """One row per gene of each variant: its consequences on the transcripts of every
    gene it lies in, so a variant of two overlapping genes counts for both. A gene the
    variant is only near (upstream, downstream) does not count."""
    return (f" JOIN {_sql.shared_db()}.snv__consequence_filter cf ON cf.locus_id = o.locus_id"
            f" AND cf.consequence NOT IN ({p.list(_rules.NEARBY_CONSEQUENCES)}) AND cf.symbol IS NOT NULL")


def snv_cnv_query(tenant_db: str, snv_key: dict, cnv_key: dict) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    sql = (
        "WITH snv AS ("
        # vep_impact = the most severe impact on this gene; hgvsg / aa_change /
        # picked_vep_impact describe the picked transcript.
        " SELECT DISTINCT o.locus_id, o.zygosity, o.transmission_mode, cf.symbol, v.hgvsg, v.aa_change,"
        f"  {_impact_on_gene(p)} AS vep_impact,"
        "  v.vep_impact AS picked_vep_impact,"
        "  v.gnomad_v3_af, v.clinvar_interpretation, o.exomiser_acmg_classification, v.chromosome, v.start,"
        f"  NOT {germline_qualifies(p)} AS low_quality, o.filter, o.gq"
        f" FROM {tenant_db}.germline__snv__occurrence o"
        f" JOIN {tenant_db}.snv__variant_partitioned v ON v.locus_id = o.locus_id AND v.part = {p(snv_key['variant_part'])}"
        f"{_gene_join(p)}"
        f" LEFT JOIN {_interpretations(p, tenant_db, snv_key['seq_id'])} ig ON ig.locus_id = CAST(o.locus_id AS VARCHAR)"
        f" WHERE o.seq_id = {p(snv_key['seq_id'])} AND o.task_id = {p(snv_key['task_id'])} AND o.part = {p(snv_key['part'])}"
        f"  AND o.zygosity IN ({p.list(_rules.ALT_ZYGOSITIES)})"
        f"  AND (v.gnomad_v3_af IS NULL OR v.gnomad_v3_af < {p(_rules.RARE_MAX_AF)})"
        f"  AND (cf.vep_impact IN ({p.list(_rules.QUALIFYING_IMPACTS)}) OR ({_plp_condition(p)} AND {_plp_on_gene(p)}))"
        "), cnv AS ("
        " SELECT c.cnv_id, c.chromosome, c.start, c.end, c.type, c.cn, c.length, g.symbol"
        f" FROM {tenant_db}.germline__cnv__occurrence c, unnest(c.symbol) AS g(symbol)"
        f" WHERE c.seq_id = {p(cnv_key['seq_id'])} AND c.task_id = {p(cnv_key['task_id'])} AND c.part = {p(cnv_key['part'])}"
        f"  AND c.filter = {p(_rules.PASS)} AND c.type IN ({p.list(_rules.GERMLINE_SECOND_HIT_CNV_TYPES)})"
        ")"
        " SELECT snv.symbol AS gene, snv.locus_id, snv.hgvsg, snv.start AS snv_start, snv.aa_change, snv.zygosity,"
        "  snv.transmission_mode,"
        "  snv.vep_impact, snv.picked_vep_impact, snv.gnomad_v3_af, snv.clinvar_interpretation,"
        "  snv.exomiser_acmg_classification,"
        "  snv.low_quality, snv.filter AS snv_filter, snv.gq AS snv_gq,"
        "  cnv.cnv_id, cnv.type AS cnv_type, cnv.chromosome AS cnv_chromosome, cnv.start AS cnv_start,"
        "  cnv.end AS cnv_end, cnv.length AS cnv_length, cnv.cn AS cnv_cn,"
        "  (snv.start BETWEEN cnv.start AND cnv.end) AS snv_inside_cnv"
        # A HET SNV anywhere in the gene, or a HOM/HEM SNV inside the deletion: the
        # remaining allele of a hemizygous region is called homozygous.
        " FROM snv JOIN cnv ON cnv.symbol = snv.symbol AND cnv.chromosome = snv.chromosome"
        f"  AND (snv.zygosity = {p(_rules.HET)} OR snv.start BETWEEN cnv.start AND cnv.end)"
        f" ORDER BY gene, snv.locus_id LIMIT {p(ROW_LIMIT + 1)}"
    )
    return sql, p


def family_deletions_query(tenant_db: str, cnv_key: dict, genes: list[str]) -> tuple[str, _sql.Params]:
    """PASS deletions over ``genes`` in another member's CNV analysis."""
    p = _sql.Params()
    sql = (
        "SELECT g.symbol AS gene, c.seq_id, c.cnv_id, c.chromosome, c.start, c.end, c.cn"
        f" FROM {tenant_db}.germline__cnv__occurrence c, unnest(c.symbol) AS g(symbol)"
        f" WHERE c.seq_id = {p(cnv_key['seq_id'])} AND c.task_id = {p(cnv_key['task_id'])} AND c.part = {p(cnv_key['part'])}"
        f"  AND c.filter = {p(_rules.PASS)} AND c.type IN ({p.list(_rules.GERMLINE_SECOND_HIT_CNV_TYPES)})"
        f"  AND g.symbol IN ({p.list(genes)})"
        f" ORDER BY gene LIMIT {p(ROW_LIMIT + 1)}"
    )
    return sql, p


def comphet_query(tenant_db: str, snv_key: dict) -> tuple[str, _sql.Params]:
    """The compound heterozygous pairs of a sequencing, once each.

    Slivar tags both variants of a pair, so the table holds each pair once per
    direction: the pair is read as (smaller locus, larger locus) per gene.
    """
    p = _sql.Params()
    sql = (
        "WITH pairs AS ("
        " SELECT DISTINCT c.symbol, LEAST(c.locus_id, c.partner_locus_id) AS locus_id,"
        "  GREATEST(c.locus_id, c.partner_locus_id) AS partner_locus_id"
        f" FROM {tenant_db}.germline__snv__comphet c"
        f" WHERE c.seq_id = {p(snv_key['seq_id'])} AND c.task_id = {p(snv_key['task_id'])} AND c.part = {p(snv_key['part'])}"
        # The most severe impact of each variant of the pairs on the pair's gene, as in
        # the other lists (vep_impact); the picked transcript can be another gene's.
        "), gene_impact AS ("
        f" SELECT cf.locus_id, cf.symbol, MIN({impact_rank(p)}) AS impact_rank"
        f" FROM {_sql.shared_db()}.snv__consequence_filter cf"
        " JOIN (SELECT locus_id, symbol FROM pairs UNION SELECT partner_locus_id, symbol FROM pairs) l"
        "  ON l.locus_id = cf.locus_id AND l.symbol = cf.symbol"
        f" WHERE cf.consequence NOT IN ({p.list(_rules.NEARBY_CONSEQUENCES)})"
        " GROUP BY cf.locus_id, cf.symbol"
        ")"
        f" SELECT pairs.symbol AS gene, pairs.locus_id, v1.hgvsg, {impact_label(p, 'g1.impact_rank')} AS vep_impact,"
        " v1.vep_impact AS picked_vep_impact, v1.gnomad_v3_af,"
        " pairs.partner_locus_id, v2.hgvsg AS partner_hgvsg,"
        f" {impact_label(p, 'g2.impact_rank')} AS partner_vep_impact, v2.vep_impact AS partner_picked_vep_impact,"
        " v2.gnomad_v3_af AS partner_gnomad_v3_af"
        " FROM pairs"
        f" JOIN {tenant_db}.snv__variant_partitioned v1 ON v1.locus_id = pairs.locus_id AND v1.part = {p(snv_key['variant_part'])}"
        f" JOIN {tenant_db}.snv__variant_partitioned v2 ON v2.locus_id = pairs.partner_locus_id AND v2.part = {p(snv_key['variant_part'])}"
        " LEFT JOIN gene_impact g1 ON g1.locus_id = pairs.locus_id AND g1.symbol = pairs.symbol"
        " LEFT JOIN gene_impact g2 ON g2.locus_id = pairs.partner_locus_id AND g2.symbol = pairs.symbol"
        f" ORDER BY gene, pairs.locus_id LIMIT {p(ROW_LIMIT + 1)}"
    )
    return sql, p


def germline_keys_query(shared_db: str, tenant: str, patient_id: int) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    sql = (
        "SELECT DISTINCT case_id, seq_id, task_id, part"
        f" FROM {shared_db}.staging_sequencing_experiment"
        f" WHERE tenant_code = {p(tenant)} AND patient_id = {p(patient_id)}"
        f"  AND task_type = {p(_rules.GERMLINE_SNV_TASK_TYPE)} AND deleted = false AND part IS NOT NULL"
        # A task not imported yet has no occurrences: it must not win over the loaded one.
        f"  AND ingested_at > {p(_rules.NOT_INGESTED)}"
    )
    return sql, p


def germline_plp_query(tenant_db: str, key: dict) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    sql = (
        "SELECT DISTINCT o.locus_id, cf.symbol AS gene, v.hgvsg, v.aa_change, o.zygosity, v.clinvar_interpretation,"
        " o.exomiser_acmg_classification, (ig.locus_id IS NOT NULL) AS interpreted_plp,"
        f" NOT {germline_qualifies(p)} AS low_quality, o.filter, o.gq"
        f" FROM {tenant_db}.germline__snv__occurrence o"
        f" JOIN {tenant_db}.snv__variant_partitioned v ON v.locus_id = o.locus_id AND v.part = {p(key['variant_part'])}"
        f"{_gene_join(p)}"
        f" LEFT JOIN {_interpretations(p, tenant_db, key['seq_id'])} ig ON ig.locus_id = CAST(o.locus_id AS VARCHAR)"
        f" WHERE o.seq_id = {p(key['seq_id'])} AND o.task_id = {p(key['task_id'])} AND o.part = {p(key['part'])}"
        f"  AND {_plp_condition(p)} AND {_plp_on_gene(p)}"
        f" ORDER BY gene LIMIT {p(ROW_LIMIT + 1)}"
    )
    return sql, p


def somatic_snv_query(tenant_db: str, key: dict, genes: list[str],
                      first_hit_loci: list[str] | None = None) -> tuple[str, _sql.Params]:
    """PASS tumor calls of the genes: a qualifying impact (second-hit candidates), or one of
    ``first_hit_loci`` whatever its impact (the germline first hit seen in the tumor). A call
    outside the platform's somatic carrier rule (too few tumor reads) is kept, marked
    ``low_quality``, as the germline calls are."""
    p = _sql.Params()
    impact = f"cf.vep_impact IN ({p.list(_rules.QUALIFYING_IMPACTS)})"
    if first_hit_loci:
        loci = ", ".join(p(int(locus)) for locus in first_hit_loci)
        impact = f"({impact} OR o.locus_id IN ({loci}))"
    sql = (
        f"SELECT DISTINCT cf.symbol AS gene, o.locus_id, v.hgvsg, v.aa_change, {_impact_on_gene(p)} AS vep_impact,"
        " v.vep_impact AS picked_vep_impact, o.tumor_ad_ratio,"
        f" o.tumor_zygosity, NOT {somatic_qualifies(p)} AS low_quality, o.tumor_ad_alt"
        f" FROM {tenant_db}.somatic__snv__occurrence o"
        f" JOIN {tenant_db}.snv__variant_partitioned v ON v.locus_id = o.locus_id AND v.part = {p(key['variant_part'])}"
        f"{_gene_join(p)}"
        f" WHERE o.tumor_seq_id = {p(key['seq_id'])} AND o.task_id = {p(key['task_id'])} AND o.part = {p(key['part'])}"
        f"  AND o.filter = {p(_rules.PASS)} AND {impact}"
        f"  AND cf.symbol IN ({p.list(genes)})"
        f" ORDER BY gene LIMIT {p(ROW_LIMIT + 1)}"
    )
    return sql, p


def somatic_cnv_query(tenant_db: str, key: dict, genes: list[str]) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    sql = (
        "SELECT g.symbol AS gene, c.cnv_id, c.type AS cnv_type, c.chromosome, c.start, c.end, c.cn"
        f" FROM {tenant_db}.somatic__cnv__occurrence c, unnest(c.symbol) AS g(symbol)"
        f" WHERE c.seq_id = {p(key['seq_id'])} AND c.task_id = {p(key['task_id'])} AND c.part = {p(key['part'])}"
        f"  AND c.filter = {p(_rules.PASS)} AND c.type IN ({p.list(_rules.SOMATIC_SECOND_HIT_CNV_TYPES)})"
        f"  AND g.symbol IN ({p.list(genes)})"
        f" ORDER BY gene LIMIT {p(ROW_LIMIT + 1)}"
    )
    return sql, p
