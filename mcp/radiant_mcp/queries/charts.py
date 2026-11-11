"""SQL of the family Venn diagram and the oncoprint."""


from .. import sql as _sql
from ..domain import data_types
from ..domain import rules as _rules
from ..domain.rules import ALT_ZYGOSITIES
from ..enums import ENUMS
from .impact import most_severe_in
from .quality import germline_qualifies, somatic_qualifies
from .sequencing import latest_task_join


def venn_query(tenant_db: str, members: list[tuple[str, dict]], rare_only: bool,
               vep_impact: list[str]) -> tuple[str, _sql.Params]:
    p = _sql.Params()
    flags = ", ".join(
        f"MAX(CASE WHEN o.seq_id = {p(k['seq_id'])} AND o.task_id = {p(k['task_id'])} THEN 1 ELSE 0 END) AS m{i}"
        for i, (_, k) in enumerate(members)
    )
    keys = " OR ".join(
        f"(o.seq_id = {p(k['seq_id'])} AND o.task_id = {p(k['task_id'])} AND o.part = {p(k['part'])})"
        for _, k in members
    )
    semi = ""
    if rare_only or vep_impact:
        conditions = ["v.locus_id = o.locus_id",
                      f"v.part IN ({p.list(sorted({k['variant_part'] for _, k in members}))})"]
        if rare_only:
            conditions.append(f"(v.gnomad_v3_af IS NULL OR v.gnomad_v3_af < {p(_rules.RARE_MAX_AF)})")
        if vep_impact:
            conditions.append(f"v.vep_impact IN ({p.list(vep_impact)})")
        semi = f" LEFT SEMI JOIN {tenant_db}.snv__variant_partitioned v ON {' AND '.join(conditions)}"
    group = ", ".join(f"m{i}" for i in range(len(members)))
    sql = (
        f"WITH occ AS (SELECT o.locus_id, {flags} FROM {tenant_db}.germline__snv__occurrence o{semi}"
        f" WHERE ({keys}) AND o.zygosity IN ({p.list(ALT_ZYGOSITIES)}) GROUP BY o.locus_id)"
        f" SELECT {group}, COUNT(*) AS n FROM occ GROUP BY {group}"
    )
    return sql, p


# Rows read per data type; one more is fetched to tell a truncated result.
ONCOPRINT_ROW_LIMIT = 50000


def oncoprint_query(tenant: str, data_type: str, genes: list[str], max_gnomad_af: float | None,
                    vep_impact: list[str]) -> tuple[str, _sql.Params]:
    """``(case_id, gene, kind)`` rows, ordered by case so a cut drops whole cases last.

    Germline columns are cases: only the proband's sequencings count, since the
    parents' rows carry the proband's case_id. Only the latest task of each
    sequencing is read (``latest_tasks``).
    """
    p = _sql.Params()
    tenant_db = _sql.tenant_db(tenant)
    sequencing = latest_task_join(p, tenant, data_type)
    if not data_types.is_somatic(data_type):
        sequencing += f" AND s.family_role = {p(_rules.PROBAND)}"
    tail = f" ORDER BY s.case_id, x.gene LIMIT {p(ONCOPRINT_ROW_LIMIT + 1)}"
    if data_types.is_snv(data_type):
        # Same gene membership as the carrier tools: a consequence on a transcript of the
        # gene other than upstream / downstream / intergenic.
        gene_where = [f"cf.symbol IN ({p.list(genes)})",
                      f"cf.consequence NOT IN ({p.list(_rules.NEARBY_CONSEQUENCES)})"]
        # The impact filter is on the variant's most severe impact on the gene.
        having = f" HAVING {most_severe_in(p, vep_impact)}" if vep_impact else ""
        rare = ""
        if max_gnomad_af is not None:
            rare = (f" JOIN {tenant_db}.snv__variant sv ON sv.locus_id = o.locus_id"
                    f" AND (sv.gnomad_v3_af IS NULL OR sv.gnomad_v3_af < {p(max_gnomad_af)})")
        somatic = data_types.is_somatic(data_type)
        table = "somatic__snv__occurrence" if somatic else "germline__snv__occurrence"
        seq = "tumor_seq_id" if somatic else "seq_id"
        occ_filter = (somatic_qualifies(p) if somatic
                      else f"o.zygosity IN ({p.list(ALT_ZYGOSITIES)}) AND {germline_qualifies(p)}")
        return (
            "WITH g AS (SELECT cf.locus_id, cf.symbol AS gene, array_join(array_agg(DISTINCT cf.consequence), ',') AS kind"
            f" FROM {_sql.shared_db()}.snv__consequence_filter cf WHERE {' AND '.join(gene_where)}"
            f" GROUP BY cf.locus_id, cf.symbol{having}),"
            f" x AS (SELECT o.{seq} AS seq_id, o.task_id, g.gene, g.kind"
            f" FROM {tenant_db}.{table} o JOIN g ON g.locus_id = o.locus_id{rare} WHERE {occ_filter})"
            f" SELECT DISTINCT s.case_id, x.gene, x.kind FROM x {sequencing}{tail}"
        ), p
    table = "somatic__cnv__occurrence" if data_types.is_somatic(data_type) else "germline__cnv__occurrence"
    return (
        f"WITH x AS (SELECT c.seq_id, c.task_id, g.symbol AS gene, c.type AS kind"
        f" FROM {tenant_db}.{table} c, unnest(c.symbol) AS g(symbol)"
        # The documented types only, as the carrier tools: the ETL can write UNKNOWN for a
        # germline call that is neither <DEL> nor <DUP>, which no chart colour stands for.
        f" WHERE g.symbol IN ({p.list(genes)}) AND c.filter = {p(_rules.PASS)}"
        f" AND c.type IN ({p.list(ENUMS['cnv_type'])}))"
        f" SELECT DISTINCT s.case_id, x.gene, x.kind FROM x {sequencing}{tail}"
    ), p
