"""The occurrence data types: one vocabulary, where a value means the same thing in every tool.

Case tools go through the portal API and use its values. Tumor-normal and
tumor-only somatic SNVs are separate (``somatic_snv_tn`` / ``somatic_snv_to``):
the portal tells them apart by task, not by a column of the occurrence table.

Cohort and chart tools read StarRocks directly, where both sit in one
somatic SNV occurrence table. They read the tumor-normal analyses only
(``somatic_snv_tn``, a task with a normal sample): a tumor-only analysis cannot
subtract the germline variants, so its calls are mostly germline background
(ETL design SJRA-1751 §4.3) and would count polymorphisms as somatic events.
The portal's ``somatic_snv`` (a deprecated alias of ``somatic_snv_tn``) is
accepted nowhere, so no value means two things.

The ``Literal`` types annotate the tool arguments: the agent sees the allowed
values in each tool's schema.
"""

from typing import Literal, get_args

CaseSnvDataType = Literal["germline_snv", "somatic_snv_tn", "somatic_snv_to"]
CaseCnvDataType = Literal["germline_cnv", "somatic_cnv"]
CaseDataType = Literal[CaseSnvDataType, CaseCnvDataType]
CohortSnvDataType = Literal["germline_snv", "somatic_snv_tn"]
CohortDataType = Literal["germline_snv", "germline_cnv", "somatic_snv_tn", "somatic_cnv"]

CASE_SNV_DATA_TYPES: tuple[str, ...] = get_args(CaseSnvDataType)
CASE_CNV_DATA_TYPES: tuple[str, ...] = get_args(CaseCnvDataType)
GERMLINE_CASE_DATA_TYPES = ("germline_snv", "germline_cnv")
SOMATIC_CASE_DATA_TYPES = ("somatic_snv_tn", "somatic_snv_to", "somatic_cnv")
CASE_DATA_TYPES = GERMLINE_CASE_DATA_TYPES + SOMATIC_CASE_DATA_TYPES
COHORT_SNV_DATA_TYPES: tuple[str, ...] = get_args(CohortSnvDataType)
COHORT_DATA_TYPES: tuple[str, ...] = get_args(CohortDataType)


def is_snv(data_type: str) -> bool:
    return "_snv" in data_type


def is_somatic(data_type: str) -> bool:
    return data_type.startswith("somatic_")
