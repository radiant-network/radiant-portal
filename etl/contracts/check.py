"""Check that the StarRocks tables the ETL creates match their contracts.

The contract (``contracts/starrocks/{shared,tenant}/<table>.odcs.yaml``) is the
interface the portal and the MCP read; the DDL and the dbt data QA must agree
with it:

- every contracted table is created by an init DDL, named through ``radiant_tables.py``;
- same columns, same physical type; a ``NOT NULL`` column is ``required``;
- a column with a dbt ``accepted_values`` test has the same values as the contract ``enum``.

Run from ``etl/``: ``python contracts/check.py``. Exit 1 on any mismatch.
"""

import ast
import re
import sys
from pathlib import Path

import yaml

ETL = Path(__file__).resolve().parents[1]
CONTRACTS = ETL / "contracts" / "starrocks"
SQL = ETL / "radiant" / "dags" / "sql"
QA = ETL / "radiant" / "data_qa"
CREATE = re.compile(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?\{\{\s*mapping\.(\w+)\s*\}\}\s*\(", re.I)
TENANT_MAPPING = "STARROCKS_RADIANT_PER_TENANT_MAPPING"
SHARED_MAPPINGS = ("STARROCKS_RADIANT_BASE_MAPPING", "STARROCKS_OPEN_DATA_MAPPING", "CLINICAL_TRANSFORM_LAYER_MAPPING")


def norm(t: str) -> str:
    return re.sub(r"\s+", "", t).upper()


def split_columns(body: str) -> list[str]:
    """The column list of a CREATE TABLE, split on top-level commas (types and comments hold commas)."""
    depth, quote, cur, parts = 1, None, "", []
    for ch in body:
        if quote:
            quote = None if ch == quote else quote
        elif ch in "\"'":
            quote = ch
        elif ch in "(<":
            depth += 1
        elif ch in ")>":
            depth -= 1
            if depth == 0:
                break
        elif ch == "," and depth == 1:
            parts.append(cur)
            cur = ""
            continue
        cur += ch
    return parts + [cur]


def ddl_tables() -> dict[str, dict[str, dict]]:
    """``tenant/x`` | ``shared/x`` -> {column: {type, not_null}} from the init DDL."""
    tree = ast.parse((ETL / "radiant" / "tasks" / "data" / "radiant_tables.py").read_text())
    maps = {n.targets[0].id: ast.literal_eval(n.value) for n in tree.body
            if isinstance(n, ast.Assign) and isinstance(n.targets[0], ast.Name)
            and n.targets[0].id in (TENANT_MAPPING, *SHARED_MAPPINGS)}
    names = {k: f"tenant/{v}" for k, v in maps[TENANT_MAPPING].items()}
    for m in SHARED_MAPPINGS:
        names.update({k: f"shared/{v}" for k, v in maps[m].items()})
    out = {}
    for path in SQL.glob("*/init/*_create_table.sql"):
        sql = re.sub(r"--[^\n]*", "", path.read_text())
        m = CREATE.search(sql)
        if not m or m.group(1) not in names:
            continue
        cols = {}
        for part in split_columns(sql[m.end():]):
            cm = re.match(r"\s*(?:`([A-Za-z_]\w*)`\s*|([A-Za-z_]\w*)\s+)(.*)$", part, re.S)
            if not cm:
                continue
            name, tail = cm.group(1) or cm.group(2), " ".join(cm.group(3).split())
            if name.upper() in ("INDEX", "PRIMARY", "KEY", "CONSTRAINT", "UNIQUE"):
                continue
            typ = re.split(r"\s+(?:NOT\s+NULL|NULL|COMMENT|DEFAULT|AUTO_INCREMENT|AS)\b", tail, maxsplit=1, flags=re.I)[0]
            cols[name] = {"type": typ, "not_null": bool(re.search(r"\bNOT\s+NULL\b", tail, re.I))}
        out[names[m.group(1)]] = cols
    return out


def dbt_enums() -> dict[tuple[str, str], list]:
    """(table, column) -> values of its dbt ``accepted_values`` test."""
    text = re.sub(r"\{#.*?#\}", "", (QA / "macros" / "dictionaries.sql").read_text(), flags=re.S)
    dicts = {n: ast.literal_eval(v) for n, v in
             re.findall(r"macro\s+dict_(\w+)\(\)\s*%\}\s*\{\{\s*return\((\[.*?\])\)", text, re.S)}
    out = {}
    for path in (QA / "sources").glob("*.yml"):
        for src in yaml.safe_load(path.read_text()).get("sources", []):
            for table in src.get("tables", []):
                for col in table.get("columns", []):
                    for test in col.get("tests") or []:
                        kind = next((k for k in ("accepted_values", "accepted_values_in_array")
                                     if isinstance(test, dict) and k in test), None)
                        if kind:
                            values = test[kind].get("values")
                            if isinstance(values, str):
                                values = dicts[re.search(r"dict_(\w+)\(\)", values).group(1)]
                            out[(table["name"], col["name"])] = list(values)
    return out


def main() -> int:
    ddl, enums, errors = ddl_tables(), dbt_enums(), []
    contracts = sorted(CONTRACTS.glob("*/*.odcs.yaml"))
    for path in contracts:
        key = f"{path.parent.name}/{path.name.removesuffix('.odcs.yaml')}"
        table = key.split("/")[1]
        if key not in ddl:
            errors.append(f"{key}: contracted but no init DDL creates it")
            continue
        props = {p["name"]: p for p in yaml.safe_load(path.read_text())["schema"][0]["properties"]}
        cols = ddl[key]
        for name in cols.keys() - props.keys():
            errors.append(f"{key}.{name}: in the DDL, missing from the contract")
        for name in props.keys() - cols.keys():
            errors.append(f"{key}.{name}: in the contract, missing from the DDL")
        for name in props.keys() & cols.keys():
            p, c = props[name], cols[name]
            if norm(p["physicalType"]) != norm(c["type"]):
                errors.append(f"{key}.{name}: type {c['type']} in the DDL, {p['physicalType']} in the contract")
            if c["not_null"] and not p.get("required"):
                errors.append(f"{key}.{name}: NOT NULL in the DDL, not required in the contract")
            if (table, name) in enums:
                # An array column holds its accepted values on its items.
                contract_values = [e["value"] for e in (p.get("items") or p).get("enum", [])]
                if sorted(map(str, contract_values)) != sorted(map(str, enums[(table, name)])):
                    errors.append(f"{key}.{name}: enum {contract_values} in the contract, "
                                  f"{enums[(table, name)]} in the dbt data QA")
    for e in errors:
        print(f"  ✗ {e}")
    print(f"{len(contracts)} contracts, {len(errors)} mismatch(es) with the DDL / data QA")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
