from decimal import Decimal

import pytest

from radiant_mcp import sql as _sql


@pytest.mark.parametrize("value", ["SCN1A", "C9orf72", "HLA-A", "IGH@", "ENSG00000144285"])
def test_symbols_accepted(value):
    assert _sql.symbol(value) == value


@pytest.mark.parametrize("value", ["", "A'; DROP TABLE x; --", "SCN1A OR 1=1", "a b", None, 3, "x" * 41])
def test_symbols_rejected(value):
    with pytest.raises(_sql.InvalidInput):
        _sql.symbol(value)


@pytest.mark.parametrize("call, value", [
    (_sql.tenant_db, "Demo"), (_sql.tenant_db, "demo; DROP"), (_sql.hpo_id, "HP:123"),
    (_sql.integer, "1 OR 1"), (_sql.integer, True), (_sql.number, "nan"), (_sql.number, "inf"),
])
def test_other_validators_reject(call, value):
    with pytest.raises(_sql.InvalidInput):
        call(value)


def test_tenant_db_and_shared_db(configure):
    assert _sql.tenant_db("pragmatiq") == "pragmatiq_tenant"
    assert _sql.shared_db() == "radiant"
    configure(radiant_shared_db="radiant_qa")
    assert _sql.shared_db() == "radiant_qa"


def test_params_are_named_so_build_order_does_not_matter():
    p = _sql.Params()
    later = f"tenant_code = {p('demo')}"
    sql = f"symbol = {p('SCN1A')} AND {later} AND x IN ({p.list([1, 2])})"
    assert sql == "symbol = %(p1)s AND tenant_code = %(p0)s AND x IN (%(p2)s, %(p3)s)"
    assert p.values == {"p0": "demo", "p1": "SCN1A", "p2": 1, "p3": 2}
    with pytest.raises(_sql.InvalidInput):
        p.list([])


def test_as_list_reads_starrocks_arrays():
    assert _sql.as_list('["a", "b"]') == ["a", "b"]
    assert _sql.as_list(None) == []
    assert _sql.as_list(["a"]) == ["a"]
    assert _sql.as_list("plain") == ["plain"]


def test_run_binds_params_and_returns_rows_as_dicts(monkeypatch):
    from radiant_mcp import starrocks

    calls = []

    def query(token, sql, params=None):
        calls.append((token, sql, params))
        return starrocks.Result(["gene", "n"], [("SCN1A", Decimal("2"))])

    monkeypatch.setattr(starrocks, "query", query)
    p = _sql.Params()
    assert _sql.run("jwt", f"SELECT {p('a')}", p) == [{"gene": "SCN1A", "n": 2.0}]
    assert calls == [("jwt", "SELECT %(p0)s", {"p0": "a"})]


def test_cut_tells_a_cut_list_from_a_complete_one():
    assert _sql.cut([1, 2], 2) == ([1, 2], False)
    assert _sql.cut([1, 2, 3], 2) == ([1, 2], True)
