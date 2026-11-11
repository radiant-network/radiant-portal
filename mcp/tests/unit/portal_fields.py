"""The portal API field lists (``CasesFields``...), read from the backend's Go types.

The last place where the MCP parses the portal's Go: which fields can be filtered or sorted belongs to the
API contract (``x-filterable`` / ``x-sortable`` in ``swagger.yaml``, then the generated client), not to a data
contract. Until then, ``RADIANT_PORTAL_DIR`` (or the ``backend`` folder of the monorepo) gives the Go types.
"""

import os
import re
from pathlib import Path

import pytest

ROOT = Path(os.getenv("RADIANT_ROOT") or Path(__file__).resolve().parents[3])


@pytest.fixture(scope="session")
def portal() -> Path:
    path = Path(os.getenv("RADIANT_PORTAL_DIR") or ROOT)
    if not (path / "backend" / "internal" / "types").is_dir():
        pytest.fail(f"no backend/internal/types under {path} (set RADIANT_PORTAL_DIR)")
    return path


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
