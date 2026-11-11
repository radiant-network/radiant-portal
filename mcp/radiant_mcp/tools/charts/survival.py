"""``survival_curve``: Kaplan-Meier curves of patient groups, with a log-rank test."""

import re
from dataclasses import replace
from typing import Any

from fastmcp.tools import ToolResult
from pydantic import BaseModel, ConfigDict, Field, PrivateAttr, ValidationError, field_validator, model_validator

from ... import charts
from ... import portal_api as _api
from ... import sql as _sql
from ...domain.criteria import Criteria, build_criteria
from ...domain.data_types import CohortDataType
from ...portal_api import RadiantApi, resolve_tenant
from ...queries.carriers import carrier_patients_query
from ...queries.patients import PATIENT_LIST_ROW_LIMIT, patient_list_query
from ...queries.sequencing import genotyped_patients_query
from ...results import ToolFailure, ToolOutput, failure, invalid, not_found, ok, respond
from ...services.genes import not_found_message, resolve_genes
from ...services.patients import PATIENT_KEY, PATIENT_SEARCH_FILTER_FIELDS, unknown_filter_fields
from ._common import DAYS_PER_YEAR

# Patient keys a group may list.
MAX_SURVIVAL_PATIENTS = 5000


_GROUP_SOURCES = ("patient_keys", "filters", "carriers")


def _patient_filters(filters: Any, what: str) -> dict:
    if not isinstance(filters, dict) or not filters:
        raise _sql.InvalidInput(f"{what} must be a non-empty mapping of search_patients filters")
    bad = unknown_filter_fields(filters)
    if bad:
        raise _sql.InvalidInput(f"{what}: unknown patient filter field(s): {', '.join(bad)}; "
                                f"allowed: {', '.join(PATIENT_SEARCH_FILTER_FIELDS)}")
    return dict(filters)


class CarrierSource(BaseModel):
    """cohort_carriers criteria: the patients carrying a variant in ``gene``."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    gene: str = Field(description="Official HGNC symbol (case-insensitive) or Ensembl gene id; aliases are not resolved.")
    data_type: CohortDataType = "germline_snv"
    vep_impact: list[str] | None = None
    clinvar: list[str] | None = None
    max_gnomad_af: float | None = None
    zygosity: list[str] | None = None
    cnv_types: list[str] | None = None


class GroupSpec(BaseModel):
    """One survival group: a label and exactly one source of its patients."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    label: str = Field("", description="Group name shown in the legend.")
    patient_keys: list[str] | None = Field(None, description="Patient keys (UUIDs from search_patients).")
    filters: dict[str, Any] | None = Field(None, description="search_patients filters.")
    carriers: CarrierSource | None = Field(None, description="cohort_carriers criteria.")
    _criteria: Criteria | None = PrivateAttr(None)

    @field_validator("label")
    @classmethod
    def _strip(cls, label: str) -> str:
        return label.strip()

    @model_validator(mode="after")
    def _one_source(self) -> "GroupSpec":
        sources = [name for name in _GROUP_SOURCES if getattr(self, name) not in (None, [], {})]
        empty = [name for name in _GROUP_SOURCES if getattr(self, name) in ([], {})]
        if not sources and empty:
            raise ValueError(f"the group is empty: {empty[0]} has no value")
        if len(sources) != 1:
            raise ValueError(f"give exactly one of {', '.join(_GROUP_SOURCES)}")
        if self.patient_keys:
            # Keys are stored lower-case; a copied key may carry spaces or a newline.
            normalized = [k.strip().lower() for k in self.patient_keys]
            bad = [k for k, n in zip(self.patient_keys, normalized, strict=True) if not PATIENT_KEY.fullmatch(n)]
            if bad:
                raise ValueError(f"not patient keys (UUIDs from search_patients): {bad[:3]}")
            keys = list(dict.fromkeys(normalized))
            if len(keys) > MAX_SURVIVAL_PATIENTS:
                raise ValueError(f"at most {MAX_SURVIVAL_PATIENTS} patient keys")
            object.__setattr__(self, "patient_keys", keys)
        elif self.filters:
            object.__setattr__(self, "filters", _patient_filters(self.filters, "filters"))
        else:
            c = self.carriers
            self._criteria = build_criteria(c.data_type, c.gene, c.vep_impact, c.clinvar, c.max_gnomad_af,
                                            c.zygosity, c.cnv_types)
        return self

    @property
    def criteria(self) -> Criteria | None:
        """The validated carrier criteria of a ``carriers`` group."""
        return self._criteria


def _invalid_group(index: int, group: Any, exc: ValidationError) -> _sql.InvalidInput:
    """One readable message for a group that does not validate."""
    raw_label = group.get("label") if isinstance(group, dict) else None
    label = str(raw_label or "").strip() or f"Group {index}"
    error = exc.errors()[0]
    loc = [str(part) for part in error["loc"]]
    if error["type"] == "extra_forbidden" and loc[:1] == ["carriers"]:
        message = (f"unknown carriers field(s) {loc[-1]}; "
                   f"allowed: {', '.join(CarrierSource.model_fields)}")
    elif error["type"] == "extra_forbidden":
        message = f"unknown field(s) {loc[-1]}"
    elif error["type"] == "missing" and loc == ["carriers", "gene"]:
        message = "carriers needs at least a gene"
    elif error["type"] in ("model_type", "dict_type") and not loc:
        message = f"must be a mapping: {{label, and one of {', '.join(_GROUP_SOURCES)}}}"
    else:
        message = error["msg"].removeprefix("Value error, ")
        if loc:
            message = f"{'.'.join(loc)}: {message}"
    return _sql.InvalidInput(f"group {label!r}: {message}")


def _group_spec(index: int, group: Any) -> GroupSpec:
    try:
        spec = GroupSpec.model_validate(group)
    except ValidationError as exc:
        raise _invalid_group(index, group, exc) from None
    return spec if spec.label else spec.model_copy(update={"label": f"Group {index}"})


def parse_groups(groups: Any, others_label: str | None) -> list[GroupSpec]:
    """Validate the ``groups`` argument of survival_curve."""
    if not isinstance(groups, list) or not groups:
        raise _sql.InvalidInput("give `groups`: a list of {label, and one of patient_keys, filters, carriers}")
    count = len(groups) + (1 if others_label else 0)
    if count < 2:
        raise _sql.InvalidInput("give at least two groups, or one group and `others_label`")
    if count > charts.MAX_SURVIVAL_GROUPS:
        raise _sql.InvalidInput(f"at most {charts.MAX_SURVIVAL_GROUPS} groups, `others_label` included")
    specs = [_group_spec(i, group) for i, group in enumerate(groups, 1)]
    labels = [spec.label for spec in specs] + ([others_label] if others_label else [])
    if len(set(labels)) != len(labels):
        raise _sql.InvalidInput("group labels must be distinct")
    return specs


class _PatientReader:
    """Reads patient lists from the clinical patient view, and records what they left out.

    One statement per list, under the caller's JWT (the view applies their grants), instead
    of the portal search paged by 100: a 5000-patient cohort took 50 calls per list.
    """

    def __init__(self, token: str, tenant: str) -> None:
        self.token, self.tenant = token, tenant
        self.capped = False
        self.without_key = 0

    def by_key(self, *filter_sets: dict) -> dict[str, dict]:
        """The patients matching every filter set (capped), by patient key."""
        try:
            rows = _sql.run(self.token, *patient_list_query(self.tenant, [f for f in filter_sets if f], PATIENT_LIST_ROW_LIMIT + 1))
        except _sql.SqlError as exc:
            # A tenant without the clinical views: unknown database or table. Told by the message,
            # not by 5502: StarRocks sends it (SQLSTATE 42602) for any analysis error, an
            # unresolved column too, which is a bug to see, not "no clinical data".
            if not re.search(r"unknown (database|table)", str(exc), re.IGNORECASE):
                raise
            raise ToolFailure("unavailable", f"No clinical data for tenant {self.tenant}: its patient views "
                                             "could not be read.", tenant=self.tenant) from exc
        patients, cut = _sql.cut(rows, PATIENT_LIST_ROW_LIMIT)
        self.capped = self.capped or cut
        keyed = {p["patient_key"]: p for p in patients if p.get("patient_key")}
        self.without_key += len(patients) - len(keyed)
        return keyed


def _survival_group(name: str, patients: list[dict]) -> tuple[charts.SurvivalGroup, int]:
    times, events, missing = [], [], 0
    for patient in patients:
        days = patient.get("survival_days")
        if days is None or days < 0:
            missing += 1
            continue
        times.append(days / DAYS_PER_YEAR)
        events.append((patient.get("vital_status") or "").lower() == "deceased")
    return charts.SurvivalGroup(name, times, events), missing


def _genotyped_ids(token: str, tenant: str, specs: list[GroupSpec]) -> set[str] | None:
    """Patient ids genotyped for every data type of the carrier groups, or None
    without a carrier group. A Radiant case of another type (or not analysed
    yet) says nothing about the genotype a carrier group is defined on."""
    data_types = sorted({s.criteria.data_type for s in specs if s.criteria is not None})
    if not data_types:
        return None
    ids: set[str] | None = None
    for data_type in data_types:
        found = {str(r["patient_id"]) for r in _sql.run(token, *genotyped_patients_query(tenant, data_type))}
        ids = found if ids is None else ids & found
    return ids or set()


def _sequenced(patient: dict) -> bool:
    """The patient has at least one Radiant case: only then is the genotype known."""
    return (patient.get("case_count") or 0) > 0


def _resolve_group(token: str, tenant: str, spec: GroupSpec, cohort: dict[str, dict] | None,
                   cohort_filters: dict, reader: _PatientReader) -> tuple[dict[str, dict], dict]:
    """The group's patients by key, inside the cohort when there is one, and how they were found."""
    if spec.patient_keys:
        # The patient list cannot be filtered on patient_key: match the keys against the cohort.
        if cohort is None:
            raise RuntimeError("patient_keys groups need the cohort")
        found = {k: cohort[k] for k in spec.patient_keys if k in cohort}
        return found, {"patient_keys": len(spec.patient_keys),
                       "not_found_or_not_in_cohort": len(spec.patient_keys) - len(found)}
    if spec.filters is not None:
        # One statement with the cohort and group conditions AND-ed (not merged: see patient_list_query).
        matched = reader.by_key(cohort_filters, spec.filters)
        if cohort is None:
            return matched, {"filters": spec.filters}
        inside = {k: p for k, p in matched.items() if k in cohort}
        return inside, {"filters": spec.filters, "not_in_cohort": len(matched) - len(inside)}
    if spec.criteria is None or cohort is None:
        raise RuntimeError("carriers groups need resolved criteria and the cohort")
    ids = {str(r["patient_id"]) for r in _sql.run(token, *carrier_patients_query(tenant, spec.criteria))}
    found = {k: p for k, p in cohort.items()
             if p.get("radiant_patient_id") is not None and str(p["radiant_patient_id"]) in ids}
    return found, {"carriers": spec.criteria.describe(), "carrier_patients": len(ids),
                   "carriers_not_in_cohort": len(ids) - len(found)}


def _resolve_genes(api: RadiantApi, tenant: str, specs: list[GroupSpec]) -> list[GroupSpec]:
    """Carrier groups with their gene resolved, before any patient list is read."""
    out = []
    # One portal call for the genes of every group.
    genes = resolve_genes(api, tenant, [s.criteria.gene for s in specs if s.criteria is not None])
    for spec in specs:
        if spec.criteria is not None:
            gene = genes[spec.criteria.gene]
            if gene is None:
                # not_found, like the other gene tools.
                raise not_found(f"group {spec.label!r}: {not_found_message(spec.criteria.gene)}")
            resolved = spec.model_copy()
            resolved._criteria = replace(spec.criteria, gene=_sql.symbol(gene["symbol"]))
            spec = resolved
        out.append(spec)
    return out


def _survival_curve(api: RadiantApi, token: str, tenant: str | None, specs: list[GroupSpec],
                    cohort_filters: dict | None, sequenced_only: bool, others_label: str | None,
                    title: str) -> ToolOutput:
    tenant_code = resolve_tenant(api, tenant)
    reader = _PatientReader(token, tenant_code)
    cohort: dict[str, dict] | None = None
    unsequenced = 0
    try:
        specs = _resolve_genes(api, tenant_code, specs)
        if cohort_filters or sequenced_only or others_label or any(s.criteria or s.patient_keys for s in specs):
            cohort = reader.by_key(cohort_filters or {})
            if sequenced_only:
                before = len(cohort)
                genotyped = _genotyped_ids(token, tenant_code, specs)
                if genotyped is None:
                    cohort = {k: p for k, p in cohort.items() if _sequenced(p)}
                else:
                    cohort = {k: p for k, p in cohort.items()
                              if p.get("radiant_patient_id") is not None and str(p["radiant_patient_id"]) in genotyped}
                unsequenced = before - len(cohort)
        members: list[tuple[str, dict[str, dict]]] = []
        definition: dict[str, Any] = {}
        for spec in specs:
            found, how = _resolve_group(token, tenant_code, spec, cohort, cohort_filters or {}, reader)
            members.append((spec.label, found))
            definition[spec.label] = how
    except _sql.InvalidInput as exc:
        raise invalid(str(exc), tenant=tenant_code) from exc

    warnings: list[str] = []
    if others_label:
        if cohort is None:
            raise RuntimeError("others_label needs the cohort")
        grouped = {key for _, found in members for key in found}
        others = {k: p for k, p in cohort.items() if k not in grouped}
        members.append((others_label, others))
        definition[others_label] = "cohort patients in no other group"
        if any(s.criteria for s in specs) and not sequenced_only:
            # Same "genotyped" as sequenced_only: an imported analysis of the carriers' data type.
            genotyped = _genotyped_ids(token, tenant_code, specs) or set()
            not_genotyped = sum(1 for p in others.values()
                                if p.get("radiant_patient_id") is None or str(p["radiant_patient_id"]) not in genotyped)
            definition[others_label] = {"definition": "cohort patients in no other group",
                                        "patients_not_genotyped": not_genotyped}
            if not_genotyped:
                warnings.append(f"{others_label!r} includes {not_genotyped} patients without an analysis of the "
                                "carriers' data type, whose genotype is unknown: pass sequenced_only=True to compare "
                                "carriers with genotyped non-carriers")

    groups, missing = [], {}
    for name, found in members:
        group, absent = _survival_group(name, list(found.values()))
        groups.append(group)
        missing[name] = absent
    if not any(g.times for g in groups):
        return ok({"tenant": tenant_code, "definition": definition, "excluded_without_survival_data": missing},
                  warnings=[*warnings, "No patient of these groups has survival data: no chart drawn."])

    # Overlap only matters among the patients the curves draw.
    drawn_keys: dict[str, int] = {}
    for _, found in members[:len(specs)]:
        for key, patient in found.items():
            if patient.get("survival_days") is not None and patient["survival_days"] >= 0:
                drawn_keys[key] = drawn_keys.get(key, 0) + 1
    overlapping = sum(1 for n in drawn_keys.values() if n > 1)
    drawn = [g.name for g in groups if g.times]
    png, stats = charts.survival(groups, title or "Survival from initial diagnosis — " + " vs ".join(drawn),
                                 test=overlapping == 0)
    truncated = None
    if reader.capped:
        truncated = (f"A patient list stopped at {PATIENT_LIST_ROW_LIMIT} patients (in patient key order): the "
                     "cohort is incomplete and not representative of the tenant; narrow it with cohort_filters.")
    if reader.without_key:
        warnings.append(f"{reader.without_key} patients have no patient key yet and are in no group")
    result: dict[str, Any] = {
        "tenant": tenant_code, "groups": stats.groups,
        "logrank_p": stats.logrank_p, "logrank_df": stats.logrank_df,
        "logrank_skipped": "groups overlap" if overlapping else stats.logrank_skipped,
        "overlapping_patients": overlapping,
        "cohort": None if cohort is None else {
            "filters": cohort_filters or "all patients", "sequenced_only": sequenced_only, "patients": len(cohort),
            "excluded_not_genotyped": unsequenced if sequenced_only else None,
            "genotyped_means": (None if not sequenced_only else
                                "an imported analysis of every carrier group's data type (all of them): "
                                + ", ".join(sorted({s.criteria.data_type for s in specs if s.criteria}))
                                if any(s.criteria for s in specs) else "at least one Radiant case")},
        "definition": definition, "excluded_without_survival_data": missing,
        "excluded_without_patient_key": reader.without_key,
        "groups_without_survival_data": [g.name for g in groups if not g.times],
        "method": "Kaplan-Meier (scipy.stats.ecdf), k-sample log-rank test (chi-square, df = rank of the "
                  "variance matrix: a group with nobody at risk at the death times drops out); "
                  "event = deceased, time = survival_days (vital status day minus initial diagnosis day); "
                  "ticks mark censored patients.",
    }
    return ok(result, warnings=warnings, truncated=truncated, image=png)


async def survival_curve(
    groups: list[GroupSpec],
    cohort_filters: dict[str, Any] | None = None,
    sequenced_only: bool = False,
    others_label: str | None = None,
    title: str = "",
    tenant: str | None = None,
) -> ToolResult:
    """Kaplan-Meier survival curves of 2 to 6 patient groups, with the log-rank test.

    Each group is ``{"label": ..., <one source>}``, the source being one of:
    - ``patient_keys``: a list of patient keys (UUIDs), e.g. the patients a
      describe_schema("clinical") query returned for a treatment protocol;
    - ``filters``: search_patients filters, e.g. {"cns_integrated_diagnosis": [...]};
    - ``carriers``: cohort_carriers criteria, e.g. {"gene": "TP53",
      "data_type": "somatic_snv_tn", "vep_impact": ["HIGH"]}.

    ``cohort_filters`` (search_patients filters) restricts every group to one
    cohort, and ``others_label`` adds a group of the cohort's patients that are
    in no other group. ``sequenced_only`` keeps the genotyped patients: with a
    carriers group, those with an imported analysis of its data type (a germline
    case does not genotype a somatic gene); with carriers groups of several data
    types, of every one of them, so a patient missing one type leaves every
    group; otherwise those with a Radiant case. Example: medulloblastoma treated on a protocol vs the other
    medulloblastoma patients = groups=[{"label": "ACNS0334 Regimen B",
    "patient_keys": [...]}], cohort_filters={"cns_integrated_diagnosis": [...]},
    others_label="Other protocols". Carriers vs non-carriers =
    groups=[{"label": "TP53 carriers", "carriers": {...}}],
    sequenced_only=True, others_label="Non-carriers".

    The server reads survival_days and vital_status itself: time is from
    initial diagnosis to the vital status date, the event is death. Returns
    the image plus, per group, the patients, deaths and median survival, the
    log-rank p-value (``logrank_skipped`` says why when there is none: the
    groups overlap, a single group, no death...), the patients left out (not
    found, outside the cohort, no survival data, no patient key), ``warnings``
    and ``truncated`` (a cohort cut at 50000 patients). State these when reporting.

    Args:
        groups: 2 to 6 groups, or 1 to 5 with others_label (which adds one), see above.
        cohort_filters: search_patients filters applied to every group.
        sequenced_only: Keep only genotyped patients (an imported analysis of the
            carriers groups' data type; otherwise a Radiant case). Use it to compare
            carriers with non-carriers, so the others group is genotyped.
        others_label: Name of the extra group "cohort patients in no other group".
        title: Chart title (default: the group names).
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    try:
        specs = parse_groups(groups, others_label)
        if cohort_filters:
            _patient_filters(cohort_filters, "cohort_filters")
    except _sql.InvalidInput as exc:
        return respond(failure(exc))
    return await _api.run(_survival_curve, tenant, specs, cohort_filters, sequenced_only, others_label, title)
