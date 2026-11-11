"""The StarRocks schema as its owners define it, read from their checkouts.

- The ETL (``RADIANT_ETL_DIR``, or a sibling ``etl`` / ``radiant-portal-pipeline``
  folder) creates the tables: ``radiant/dags/sql/*/init/*_create_table.sql``,
  named through the mappings of ``radiant/tasks/data/radiant_tables.py``.
- The portal (``RADIANT_PORTAL_DIR``, or a sibling ``portal`` / ``radiant-portal``
  folder) creates, in each tenant database, the clinical ``v_pcx_30_*`` views,
  one view per PostgreSQL table of ``types.ViewTables`` (columns from the
  migrations) and the ``gene_panel_mv`` materialized view.

Without a checkout, the fixtures skip their tests, unless ``RADIANT_REQUIRE_ETL=1``
/ ``RADIANT_REQUIRE_PORTAL=1`` (CI), where they fail. Columns map to a coarse
type (``ARRAY<VARCHAR>`` or ``VARCHAR``), enough to resolve ``unnest``.
"""

import ast
import os
import re
from pathlib import Path

import pytest

from radiant_mcp.schema_catalog import SHARED_DB, TENANT_DB

REPO = Path(__file__).resolve().parents[2]
_MAPPINGS_SHARED = ("STARROCKS_RADIANT_BASE_MAPPING", "STARROCKS_OPEN_DATA_MAPPING", "CLINICAL_TRANSFORM_LAYER_MAPPING")
_MAPPING_PER_TENANT = "STARROCKS_RADIANT_PER_TENANT_MAPPING"
_CREATE = re.compile(
    r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?\{\{\s*mapping\.(\w+)\s*\}\}\s*\(", re.I,
)
_VIEW = re.compile(r"CREATE\s+OR\s+REPLACE\s+VIEW\s+\S+?_tenant\.(\w+)\s+AS\s+SELECT\b", re.I)
PORTAL_VIEW_DIRS = ("backend/scripts/seed/views", "backend/scripts/pcx_tables/access_controlled_views")
PORTAL_MIGRATIONS = "backend/scripts/init-sql/migrations"
PORTAL_VIEW_TABLES = "backend/internal/types/tenant.go"
PORTAL_TENANT_REPOSITORY = "backend/internal/repository/starrocks/starrocks_tenant.go"

Columns = dict[str, str]


def _coarse(type_text: str) -> str:
    return "ARRAY<VARCHAR>" if type_text.strip().upper().startswith("ARRAY") else "VARCHAR"


# -- checkouts -------------------------------------------------------------------

def _etl_dir() -> Path | None:
    candidates = [os.getenv("RADIANT_ETL_DIR"), REPO.parent / "etl", REPO.parent / "radiant-portal-pipeline"]
    for candidate in candidates:
        if candidate and (Path(candidate) / "radiant" / "dags" / "sql").is_dir():
            return Path(candidate)
    return None


@pytest.fixture(scope="session")
def etl() -> Path:
    path = _etl_dir()
    if path is None:
        if os.getenv("RADIANT_REQUIRE_ETL") == "1":
            pytest.fail("RADIANT_REQUIRE_ETL=1 but no ETL checkout found (set RADIANT_ETL_DIR)")
        pytest.skip("no ETL checkout: set RADIANT_ETL_DIR to check against the ETL schema")
    return path


def _portal_dir() -> Path | None:
    candidates = [os.getenv("RADIANT_PORTAL_DIR"), REPO.parent / "portal", REPO.parent / "radiant-portal"]
    for candidate in candidates:
        if candidate and all((Path(candidate) / d).is_dir() for d in PORTAL_VIEW_DIRS):
            return Path(candidate)
    return None


@pytest.fixture(scope="session")
def portal() -> Path:
    path = _portal_dir()
    if path is None:
        if os.getenv("RADIANT_REQUIRE_PORTAL") == "1":
            pytest.fail("RADIANT_REQUIRE_PORTAL=1 but no portal checkout found (set RADIANT_PORTAL_DIR)")
        pytest.skip("no portal checkout: set RADIANT_PORTAL_DIR to check against the portal views")
    return path


# -- parsing ---------------------------------------------------------------------

def _top_level_split(text: str) -> list[str]:
    depth, quote, current, parts = 0, None, "", []
    for ch in text:
        if quote:
            if ch == quote:
                quote = None
        elif ch in "\"'":
            quote = ch
        elif ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        elif ch == "," and depth == 0:
            parts.append(current)
            current = ""
            continue
        current += ch
    return parts + [current]


def _select_aliases(select_list: str) -> list[str]:
    columns = []
    for item in _top_level_split(select_list):
        names = re.findall(r"[A-Za-z_]\w*", item.split(" AS ")[-1] if " AS " in item.upper() else item)
        alias = re.search(r"\bAS\s+([A-Za-z_]\w*)\s*$", item.strip(), re.I)
        columns.append(alias.group(1) if alias else names[-1])
    return columns


def _until_top_level_from(body: str) -> str:
    depth = 0
    for m in re.finditer(r"\(|\)|\bFROM\b", body, re.I):
        token = m.group(0)
        if token == "(":
            depth += 1
        elif token == ")":
            depth -= 1
        elif depth == 0:
            return body[:m.start()]
    return body


def view_columns(sql: str) -> tuple[str, list[str]] | None:
    """``(view name, column names)`` of a create-view statement: the select list up to its top-level FROM."""
    sql = re.sub(r"/\*.*?\*/", "", re.sub(r"--[^\n]*", "", sql), flags=re.S)
    match = _VIEW.search(sql)
    if not match:
        return None
    return match.group(1), _select_aliases(_until_top_level_from(sql[match.end():]))


def ddl_columns(sql: str) -> tuple[str, Columns] | None:
    """``(mapping key, {column: type})`` of an ETL create-table statement.

    Scans the column list with paren depth and quotes, so commas in a COMMENT
    or a type (``DECIMAL(10, 2)``, ``ARRAY<STRUCT<...>>``) do not split it.
    """
    sql = re.sub(r"--[^\n]*", "", sql)
    match = _CREATE.search(sql)
    if not match:
        return None
    depth, quote, current, parts = 1, None, "", []
    for ch in sql[match.end():]:
        if quote:
            if ch == quote:
                quote = None
        elif ch in "\"'":
            quote = ch
        elif ch in "(<":
            depth += 1
        elif ch in ")>":
            depth -= 1
            if depth == 0:
                break
        elif ch == "," and depth == 1:
            parts.append(current)
            current = ""
            continue
        current += ch
    parts.append(current)
    columns = {}
    for part in parts:
        name = re.match(r"\s*`?([A-Za-z_]\w*)`?\s+(\S+)", part)
        if name and name.group(1).upper() not in ("INDEX", "PRIMARY", "KEY", "CONSTRAINT", "UNIQUE"):
            columns[name.group(1)] = _coarse(name.group(2))
    return match.group(1), columns


def _mappings(etl: Path) -> dict[str, str]:
    """Mapping key -> qualified table name, from the ETL's table registry."""
    tree = ast.parse((etl / "radiant" / "tasks" / "data" / "radiant_tables.py").read_text())
    wanted = (_MAPPING_PER_TENANT, *_MAPPINGS_SHARED)
    dicts = {
        node.targets[0].id: ast.literal_eval(node.value)
        for node in tree.body
        if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name) and node.targets[0].id in wanted
    }
    out = {key: f"{TENANT_DB}.{table}" for key, table in dicts[_MAPPING_PER_TENANT].items()}
    for name in _MAPPINGS_SHARED:
        out.update({key: f"{SHARED_DB}.{table}" for key, table in dicts[name].items()})
    return out


def migration_tables(migrations: list[str]) -> dict[str, list[str]]:
    """PostgreSQL ``public`` table -> columns, after applying the migrations in order.

    Follows CREATE TABLE and ALTER TABLE ... ADD / DROP / RENAME COLUMN, which
    is all the portal migrations do to columns.
    """
    tables: dict[str, list[str]] = {}
    for text in migrations:
        text = re.sub(r"--[^\n]*", "", text)
        for stmt in text.split(";"):
            create = re.search(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)\s*\((.*)\)\s*$",
                               stmt, re.I | re.S)
            if create:
                cols = []
                for part in _top_level_split(create.group(2)):
                    name = re.match(r"\s*\"?([A-Za-z_]\w*)\"?\s+\S", part)
                    if name and name.group(1).upper() not in ("CONSTRAINT", "PRIMARY", "UNIQUE", "FOREIGN", "CHECK"):
                        cols.append(name.group(1))
                tables[create.group(1)] = cols
                continue
            alter = re.search(r"ALTER\s+TABLE\s+(?:ONLY\s+)?(?:IF\s+EXISTS\s+)?(?:public\.)?(\w+)\s+(.*)$",
                              stmt, re.I | re.S)
            if not alter or alter.group(1) not in tables:
                continue
            cols = tables[alter.group(1)]
            for action in _top_level_split(alter.group(2)):
                if m := re.match(r"\s*ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?\"?(\w+)", action, re.I):
                    if m.group(1) not in cols:
                        cols.append(m.group(1))
                elif m := re.match(r"\s*DROP\s+COLUMN\s+(?:IF\s+EXISTS\s+)?\"?(\w+)", action, re.I):
                    if m.group(1) in cols:
                        cols.remove(m.group(1))
                elif m := re.match(r"\s*RENAME\s+COLUMN\s+\"?(\w+)\"?\s+TO\s+\"?(\w+)", action, re.I):
                    cols[:] = [m.group(2) if c == m.group(1) else c for c in cols]
    return tables


def _view_tables(text: str) -> list[str]:
    block = re.search(r"var\s+ViewTables\s*=\s*\[\]string\{(.*?)\n\}", text, re.S)
    assert block, "ViewTables not found in the portal"
    return re.findall(r"\"(\w+)\"", re.sub(r"//[^\n]*", "", block.group(1)))


def _gene_panel_mv_columns(text: str) -> list[str]:
    match = re.search(r"CREATE MATERIALIZED VIEW.*?AS SELECT (?:DISTINCT )?(.*?) FROM ", text.replace('"+\n\t\t"', ""), re.S)
    assert match, "gene_panel_mv definition not found in the portal"
    return _select_aliases(match.group(1))


# -- fixtures --------------------------------------------------------------------

@pytest.fixture(scope="session")
def etl_tables(etl) -> dict[str, Columns]:
    """Qualified table (``<tenant>_tenant.x`` / ``radiant.x``) -> columns, from the ETL DDL."""
    mappings = _mappings(etl)
    tables = {}
    for path in (etl / "radiant" / "dags" / "sql").glob("*/init/*_create_table.sql"):
        parsed = ddl_columns(path.read_text())
        if parsed and parsed[0] in mappings:
            tables[mappings[parsed[0]]] = parsed[1]
    assert tables, "no create-table DDL found in the ETL checkout"
    return tables


@pytest.fixture(scope="session")
def etl_dictionaries(etl) -> dict[str, list[str]]:
    text = (etl / "radiant" / "data_qa" / "macros" / "dictionaries.sql").read_text()
    text = re.sub(r"\{#.*?#\}", "", text, flags=re.S)
    return {
        name: ast.literal_eval(values)
        for name, values in re.findall(r"macro\s+dict_(\w+)\(\)\s*%\}\s*\{\{\s*return\((\[.*?\])\)", text, re.S)
    }


@pytest.fixture(scope="session")
def portal_views(portal) -> dict[str, set[str]]:
    """The clinical ``v_pcx_30_*`` views of a tenant -> columns."""
    views = {}
    for directory in PORTAL_VIEW_DIRS:
        for path in (portal / directory).glob("*.sql.tmpl"):
            parsed = view_columns(path.read_text())
            if parsed:
                views[f"{TENANT_DB}.{parsed[0]}"] = set(parsed[1])
    assert views, "no view definition found in the portal checkout"
    return views


@pytest.fixture(scope="session")
def portal_tenant_objects(portal, portal_views) -> dict[str, Columns]:
    """Every object the portal creates in a tenant database -> columns."""
    migrations = sorted((portal / PORTAL_MIGRATIONS).glob("*.up.sql"))
    pg = migration_tables([path.read_text() for path in migrations])
    objects: dict[str, Columns] = {}
    for table in _view_tables((portal / PORTAL_VIEW_TABLES).read_text()):
        assert table in pg, f"ViewTables lists {table}, not created by the portal migrations"
        objects[f"{TENANT_DB}.{table}"] = dict.fromkeys(pg[table], "VARCHAR")
    mv = _gene_panel_mv_columns((portal / PORTAL_TENANT_REPOSITORY).read_text())
    objects[f"{TENANT_DB}.gene_panel_mv"] = dict.fromkeys(mv, "VARCHAR")
    for name, columns in portal_views.items():
        objects[name] = dict.fromkeys(columns, "VARCHAR")
    return objects


# -- portal API fields -----------------------------------------------------------

PORTAL_TYPES = "backend/internal/types"
_GO_VAR = re.compile(r"^var\s+(\w+)\s*=\s*(Field\{|\[\]Field\{|append\()", re.M)


def _go_values(text: str) -> dict[str, tuple[str, str]]:
    """``var NAME = Field{...}`` / ``[]Field{...}`` / ``append(...)`` -> (kind, body), braces balanced."""
    out = {}
    for m in _GO_VAR.finditer(text):
        open_char = m.group(2)[-1]
        close_char = "}" if open_char == "{" else ")"
        depth, i = 1, m.end()
        while depth and i < len(text):
            depth += {open_char: 1, close_char: -1}.get(text[i], 0)
            i += 1
        out[m.group(1)] = (m.group(2), text[m.end():i - 1])
    return out


def portal_field_lists(types_dir: Path) -> dict[str, dict[str, dict[str, bool]]]:
    """Backend field list (``CasesFields``, ``GermlineSNVOccurrencesFields``...) ->
    ``{alias: {"filter": CanBeFiltered, "sort": CanBeSorted}}``.

    The API matches a criterion or a sort on ``Field.GetAlias()``: ``Alias``
    when set, else ``Name``.
    """
    text = "\n".join(re.sub(r"//[^\n]*", "", p.read_text()) for p in sorted(types_dir.glob("*.go"))
                     if not p.name.endswith("_test.go"))
    values = _go_values(text)
    fields, raw = {}, {}
    for name, (kind, body) in values.items():
        if kind == "Field{":
            props = dict(re.findall(r"(\w+):\s*(\"[^\"]*\"|true|false)", body))
            alias = (props.get("Alias") or props.get("Name") or '""').strip('"')
            fields[name] = (alias, props.get("CanBeFiltered") == "true", props.get("CanBeSorted") == "true")
        else:
            raw[name] = re.findall(r"\b([A-Z]\w*)\b", body)

    def resolve(name: str, seen: frozenset = frozenset()) -> list[str]:
        out = []
        for item in raw.get(name, []):
            if item in fields:
                out.append(item)
            elif item in raw and item not in seen:
                out.extend(resolve(item, seen | {name}))
        return out

    lists = {}
    for name in raw:
        members = [fields[f] for f in resolve(name)]
        # Two fields can share an alias (``SymbolField`` filters, ``PickedSymbolField`` does
        # not): the API finds the first match by capability, so OR the flags.
        merged: dict[str, dict[str, bool]] = {}
        for alias, f, s in members:
            if alias:
                flags = merged.setdefault(alias, {"filter": False, "sort": False})
                flags["filter"] |= f
                flags["sort"] |= s
        lists[name] = merged
    return lists


@pytest.fixture(scope="session")
def portal_fields(portal) -> dict[str, dict[str, dict[str, bool]]]:
    if not (portal / PORTAL_TYPES).is_dir():
        if os.getenv("RADIANT_REQUIRE_PORTAL") == "1":
            pytest.fail(f"RADIANT_REQUIRE_PORTAL=1 but {PORTAL_TYPES} is missing from the portal checkout")
        pytest.skip(f"no {PORTAL_TYPES} in the portal checkout")
    lists = portal_field_lists(portal / PORTAL_TYPES)
    assert lists, "no field list found in the portal checkout"
    return lists
