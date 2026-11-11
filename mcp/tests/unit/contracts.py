"""The StarRocks schema as its owners publish it: their data contracts (ODCS).

- ``etl/contracts/starrocks/{shared,tenant}/*.odcs.yaml``: the tables the ETL writes (owned, hand-edited,
  checked against its DDL by ``etl:contracts-check``);
- ``backend/contracts/starrocks/tenant/*.odcs.yaml``: the views the portal creates in each tenant database
  (generated, ``backend:contracts-check``).

The MCP no longer parses the ETL DDL nor the portal's Go and SQL: it reads the contracts, from the monorepo
root (``RADIANT_ROOT``, default: the parent of the MCP). Columns map to a coarse type (``ARRAY<VARCHAR>`` or
``VARCHAR``), enough to resolve ``unnest``.
"""

import os
from pathlib import Path

import pytest
import yaml

from radiant_mcp.schema_catalog import SHARED_DB, TENANT_DB

ROOT = Path(os.getenv("RADIANT_ROOT") or Path(__file__).resolve().parents[3])
ETL_CONTRACTS = ROOT / "etl" / "contracts" / "starrocks"
PORTAL_CONTRACTS = ROOT / "backend" / "contracts" / "starrocks"

Columns = dict[str, str]


def _load(directory: Path) -> dict[str, dict]:
    """``<db>.<object>`` -> the contract's schema object."""
    contracts = sorted(directory.glob("*/*.odcs.yaml"))
    assert contracts, f"no contract in {directory}"
    out = {}
    for path in contracts:
        schema = yaml.safe_load(path.read_text())["schema"][0]
        db = TENANT_DB if path.parent.name == "tenant" else SHARED_DB
        out[f"{db}.{schema['name']}"] = schema
    return out


def _columns(schema: dict) -> Columns:
    """Columns the MCP may read: a ``deprecated`` column is about to be removed, so reading it fails the tests
    (the reader moves in the same change that deprecates it)."""
    return {p["name"]: "ARRAY<VARCHAR>" if p.get("logicalType") == "array" else "VARCHAR"
            for p in schema["properties"] if "deprecated" not in (p.get("tags") or [])}


@pytest.fixture(scope="session")
def etl_contracts() -> dict[str, dict]:
    return _load(ETL_CONTRACTS)


@pytest.fixture(scope="session")
def etl_tables(etl_contracts) -> dict[str, Columns]:
    """Qualified table (``<tenant>_tenant.x`` / ``radiant.x``) -> columns, from the ETL contracts."""
    return {name: _columns(schema) for name, schema in etl_contracts.items()}


@pytest.fixture(scope="session")
def etl_enums(etl_contracts) -> dict[tuple[str, str], list]:
    """(qualified table, column) -> the values of the column's contract ``enum`` (of its items for an array)."""
    return {(name, p["name"]): [e["value"] for e in (p.get("items") or p)["enum"]]
            for name, schema in etl_contracts.items() for p in schema["properties"]
            if (p.get("items") or p).get("enum")}


@pytest.fixture(scope="session")
def portal_tenant_objects() -> dict[str, Columns]:
    """Every object the portal creates in a tenant database -> columns, from the portal contracts."""
    return {name: _columns(schema) for name, schema in _load(PORTAL_CONTRACTS).items()}


@pytest.fixture(scope="session")
def portal_views(portal_tenant_objects) -> dict[str, set[str]]:
    return {name: set(columns) for name, columns in portal_tenant_objects.items()}
