"""SQL of the gene-level carrier tools (``cohort_carriers``, ``genotype_phenotype``,
``lollipop``, the carrier groups of ``survival_curve``).

The gene restricts the variant catalog (or the CNV gene arrays) first, then
the occurrences of those loci are mapped to cases and patients through
``staging_sequencing_experiment``.
"""

from .. import sql as _sql
from ..domain import rules as _rules
from ..domain.criteria import Criteria
from ..enums import ENUMS
from .impact import IMPACTS, impact_rank, most_severe_in
from .quality import germline_qualifies, somatic_qualifies
from .sequencing import latest_task_join

# Entries per summary list; one more is read to tell a cut list.
SUMMARY_LIMIT = 30
# Carrier variants read for a lollipop; one more is read to tell a cut.
LOLLIPOP_ROW_LIMIT = 5000


def carriers_cte(p: _sql.Params, tenant: str, criteria: Criteria) -> str:
    """``WITH ... car AS (...)``: one row per (case, sequencing, variant) of a carrier,
    from the latest task of the sequencing in that case (``latest_tasks``), with its
    patient. SNV CTEs also define ``g`` (the gene's loci, with ``impact_rank``, the rank of
    their most severe impact on the gene) and ``v``.

    An SNV is in the gene when one of its consequences is on a transcript of the
    gene (``snv__consequence_filter``), not only its picked one, so a variant of two
    overlapping genes counts for both. A ``vep_impact`` filter is on its most severe
    impact on that gene. An upstream, downstream or intergenic consequence does not
    count (``rules.NEARBY_CONSEQUENCES``): VEP reports every gene within 5 kb.
    """
    tenant_db, shared_db = _sql.tenant_db(tenant), _sql.shared_db()
    sequencing = latest_task_join(p, tenant, criteria.data_type)
    carrier_columns = (
        "s.case_id, s.patient_id, s.family_role, s.affected_status, s.experimental_strategy,"
        " x.seq_id, x.task_id, x.variant_id"
    )
    if criteria.is_snv:
        gene_where = [f"cf.symbol = {p(criteria.gene)}",
                      f"cf.consequence NOT IN ({p.list(_rules.NEARBY_CONSEQUENCES)})"]
        # The impact filter is on the variant's most severe impact on the gene.
        gene_having = f" HAVING {most_severe_in(p, criteria.vep_impact)}" if criteria.vep_impact else ""
        where = []
        if criteria.clinvar:
            # A ClinVar classification is the variant's: it counts for this gene only when the gene
            # is the picked one or the variant has an effect here (rules.PLP_GENE_IMPACTS).
            ranks = [IMPACTS.index(impact) for impact in _rules.PLP_GENE_IMPACTS]
            where.append(f"arrays_overlap(sv.clinvar_interpretation, [{p.list(criteria.clinvar)}])"
                         f" AND (sv.symbol = {p(criteria.gene)} OR g.impact_rank IN ({p.list(ranks)}))")
        if criteria.max_gnomad_af is not None:
            where.append(f"(sv.gnomad_v3_af IS NULL OR sv.gnomad_v3_af < {p(criteria.max_gnomad_af)})")
        variant_filter = (" WHERE " + " AND ".join(where)) if where else ""
        if criteria.is_somatic:
            occurrence, seq_column, zygosity_column = "somatic__snv__occurrence", "tumor_seq_id", "tumor_zygosity"
        else:
            occurrence, seq_column, zygosity_column = "germline__snv__occurrence", "seq_id", "zygosity"
        occ_where = []
        if criteria.zygosity:
            occ_where.append(f"o.{zygosity_column} IN ({p.list(criteria.zygosity)})")
        if criteria.is_somatic:
            occ_where.append(somatic_qualifies(p))
        else:
            occ_where.append(germline_qualifies(p))
        occ_filter = (" WHERE " + " AND ".join(occ_where)) if occ_where else ""
        return (
            "WITH g AS ("
            f" SELECT cf.locus_id, MIN({impact_rank(p)}) AS impact_rank"
            f" FROM {shared_db}.snv__consequence_filter cf WHERE {' AND '.join(gene_where)}"
            f" GROUP BY cf.locus_id{gene_having}"
            "), v AS ("
            " SELECT sv.locus_id, sv.variant_class"
            f" FROM {tenant_db}.snv__variant sv JOIN g ON g.locus_id = sv.locus_id{variant_filter}"
            "), x AS ("
            f" SELECT o.{seq_column} AS seq_id, o.task_id, o.locus_id AS variant_id"
            f" FROM {tenant_db}.{occurrence} o JOIN v ON v.locus_id = o.locus_id{occ_filter}"
            f"), car AS (SELECT {carrier_columns} FROM x {sequencing})"
        )
    table = "somatic__cnv__occurrence" if criteria.is_somatic else "germline__cnv__occurrence"
    types = criteria.cnv_types or tuple(ENUMS["cnv_type"])
    return (
        "WITH x AS ("
        " SELECT c.seq_id, c.task_id, c.cnv_id AS variant_id, c.type"
        f" FROM {tenant_db}.{table} c, unnest(c.symbol) AS g(symbol)"
        f" WHERE g.symbol = {p(criteria.gene)} AND c.filter = {p(_rules.PASS)} AND c.type IN ({p.list(types)})"
        f"), car AS (SELECT {carrier_columns}, x.type FROM x {sequencing})"
    )


def totals_query(tenant: str, criteria: Criteria) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    sql = (
        carriers_cte(p, tenant, criteria)
        # A relative's sequencing carries the proband's case_id: ``cases`` counts the
        # cases whose proband carries (as oncoprint), ``cases_any_member`` any member.
        + f" SELECT COUNT(DISTINCT CASE WHEN family_role = {p(_rules.PROBAND)} THEN case_id END) AS cases,"
        " COUNT(DISTINCT case_id) AS cases_any_member, COUNT(DISTINCT patient_id) AS patients,"
        " COUNT(DISTINCT variant_id) AS variants FROM car"
    )
    return sql, p


def carriers_query(tenant: str, criteria: Criteria, limit: int) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    # No list of the carrier's SNVs: without filters, a WGS genome has thousands of calls in a
    # large gene (introns count), all sent to the model. CNVs list their types (at most four).
    cnv_types = "" if criteria.is_snv else " array_agg(DISTINCT car.type) AS cnv_types,"
    sql = (
        carriers_cte(p, tenant, criteria)
        + " SELECT car.case_id, car.patient_id, car.family_role, car.affected_status, car.experimental_strategy,"
        f" car.seq_id, car.task_id, COUNT(DISTINCT car.variant_id) AS variant_count,{cnv_types}"
        " MIN(car.variant_id) AS first_variant_id"
        " FROM car"
        " GROUP BY car.case_id, car.patient_id, car.family_role, car.affected_status, car.experimental_strategy,"
        " car.seq_id, car.task_id"
        f" ORDER BY variant_count DESC, car.case_id LIMIT {p(limit)}"
    )
    return sql, p


def summary_queries(tenant: str, criteria: Criteria) -> dict[str, tuple[str, _sql.Params]]:
    out = {}
    if criteria.is_snv:
        p = _sql.Params()
        # The consequences on the gene's own transcripts, as the gene membership: the picked
        # transcript can be an overlapping gene's. Only those of the variant's most severe impact
        # on the gene: a stop_gained is also intron_variant on another transcript, and a HIGH
        # filter must not list it as intronic. An unknown impact matches an unknown one (<=>).
        out["by_consequence"] = (
            carriers_cte(p, tenant, criteria)
            + " SELECT cf.consequence, COUNT(DISTINCT car.variant_id) AS variants, COUNT(DISTINCT car.patient_id) AS patients"
            f" FROM car JOIN g ON g.locus_id = car.variant_id"
            f" JOIN {_sql.shared_db()}.snv__consequence_filter cf ON cf.locus_id = car.variant_id"
            f" AND cf.symbol = {p(criteria.gene)} AND cf.consequence NOT IN ({p.list(_rules.NEARBY_CONSEQUENCES)})"
            f" AND {impact_rank(p)} <=> g.impact_rank"
            f" GROUP BY cf.consequence ORDER BY patients DESC LIMIT {p(SUMMARY_LIMIT + 1)}",
            p,
        )
        p = _sql.Params()
        out["by_variant_class"] = (
            carriers_cte(p, tenant, criteria)
            + " SELECT v.variant_class, COUNT(DISTINCT car.variant_id) AS variants, COUNT(DISTINCT car.patient_id) AS patients"
            " FROM car JOIN v ON v.locus_id = car.variant_id"
            f" GROUP BY v.variant_class ORDER BY patients DESC LIMIT {p(SUMMARY_LIMIT + 1)}",
            p,
        )
    if not criteria.is_somatic:
        p = _sql.Params()
        out["by_family_role"] = (
            carriers_cte(p, tenant, criteria)
            + " SELECT family_role, COUNT(DISTINCT case_id) AS cases, COUNT(DISTINCT patient_id) AS patients"
            f" FROM car GROUP BY family_role ORDER BY patients DESC LIMIT {p(SUMMARY_LIMIT + 1)}",
            p,
        )
    if not criteria.is_snv:
        p = _sql.Params()
        out["by_cnv_type"] = (
            carriers_cte(p, tenant, criteria)
            + " SELECT car.type AS cnv_type, COUNT(DISTINCT car.variant_id) AS cnvs, COUNT(DISTINCT car.patient_id) AS patients"
            f" FROM car GROUP BY car.type ORDER BY patients DESC LIMIT {p(SUMMARY_LIMIT + 1)}",
            p,
        )
    return out


def phenotypes_query(tenant: str, criteria: Criteria, limit: int) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    tenant_db, shared_db = _sql.tenant_db(tenant), _sql.shared_db()
    sql = (
        carriers_cte(p, tenant, criteria)
        + ", pat AS (SELECT DISTINCT patient_id FROM car)"
        " SELECT obs.code_value AS hpo_term_id, MAX(h.name) AS hpo_term_name,"
        " COUNT(DISTINCT obs.patient_id) AS patients"
        f" FROM {tenant_db}.obs_categorical obs JOIN pat ON pat.patient_id = obs.patient_id"
        f" LEFT JOIN {shared_db}.hpo_term h ON h.id = obs.code_value"
        f" WHERE obs.observation_code = {p(_rules.PHENOTYPE_OBSERVATION_CODE)}"
        f"  AND obs.interpretation_code = {p(_rules.POSITIVE_INTERPRETATION_CODE)} AND obs.fetus_id IS NULL"
        f" GROUP BY obs.code_value ORDER BY patients DESC, hpo_term_id LIMIT {p(limit)}"
    )
    return sql, p


def phenotyped_patients_query(tenant: str, criteria: Criteria) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    tenant_db = _sql.tenant_db(tenant)
    sql = (
        carriers_cte(p, tenant, criteria)
        + " SELECT COUNT(DISTINCT obs.patient_id) AS patients"
        f" FROM {tenant_db}.obs_categorical obs JOIN (SELECT DISTINCT patient_id FROM car) pat ON pat.patient_id = obs.patient_id"
        f" WHERE obs.observation_code = {p(_rules.PHENOTYPE_OBSERVATION_CODE)}"
        f"  AND obs.interpretation_code = {p(_rules.POSITIVE_INTERPRETATION_CODE)} AND obs.fetus_id IS NULL"
    )
    return sql, p


def carriers_with_term_query(tenant: str, criteria: Criteria, hpo_term: str, limit: int) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    tenant_db = _sql.tenant_db(tenant)
    sql = (
        carriers_cte(p, tenant, criteria)
        + " SELECT DISTINCT car.case_id, car.patient_id, car.affected_status"
        f" FROM car JOIN {tenant_db}.obs_categorical obs ON obs.patient_id = car.patient_id"
        f" WHERE obs.observation_code = {p(_rules.PHENOTYPE_OBSERVATION_CODE)}"
        f"  AND obs.interpretation_code = {p(_rules.POSITIVE_INTERPRETATION_CODE)} AND obs.fetus_id IS NULL"
        f"  AND obs.code_value = {p(hpo_term)}"
        f" ORDER BY car.case_id LIMIT {p(limit)}"
    )
    return sql, p


def carrier_patients_query(tenant: str, criteria_: Criteria) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    return carriers_cte(p, tenant, criteria_) + " SELECT DISTINCT patient_id FROM car", p


def lollipop_query(tenant: str, criteria_: Criteria) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    cte = carriers_cte(p, tenant, criteria_)
    tenant_db = _sql.tenant_db(tenant)
    return (
        # Every carrier variant, with its picked annotation: the tool draws those picked on
        # the gene with a protein change and counts the others instead of dropping them.
        cte + ", va AS (SELECT sv.locus_id, sv.symbol, sv.transcript_id, sv.aa_change,"
        " array_join(sv.consequences, ',') AS kind"
        f" FROM {tenant_db}.snv__variant sv JOIN (SELECT DISTINCT variant_id FROM car) cv ON cv.variant_id = sv.locus_id)"
        " SELECT car.variant_id AS locus_id, va.symbol, va.transcript_id, va.aa_change, va.kind,"
        " COUNT(DISTINCT car.patient_id) AS carriers"
        " FROM car LEFT JOIN va ON va.locus_id = car.variant_id"
        " GROUP BY car.variant_id, va.symbol, va.transcript_id, va.aa_change, va.kind"
        f" ORDER BY carriers DESC LIMIT {p(LOLLIPOP_ROW_LIMIT + 1)}"
    ), p
