"""StarRocks access under the caller's JWT, and the raw SQL tools."""

import asyncio
import base64
import json
import os
import stat
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest
from conftest import envelope
from mysql.connector.errors import DatabaseError

from radiant_mcp import portal_api as _api
from radiant_mcp import starrocks
from radiant_mcp.tools import query


def jwt(sub: str, **claims) -> str:
    payload = base64.urlsafe_b64encode(json.dumps({"sub": sub, **claims}).encode()).decode().rstrip("=")
    return f"header.{payload}.signature"


class FakeCursor:
    def __init__(self, conn):
        self.conn = conn
        self.description = None
        self._rows = []
        self.fetched = []

    def execute(self, sql, params=None):
        self.conn.statements.append((sql, params))
        if self.conn.error:
            raise self.conn.error
        # A statement list "A; B" answers one result set per statement, like StarRocks.
        self._sets = [self.conn.answer(part.strip()) for part in sql.split(";") if part.strip()]
        self._next()

    def _next(self):
        columns, rows = self._sets.pop(0)
        self.description = [(c,) for c in columns] if columns else None
        self._rows = list(rows)

    def nextset(self):
        if not self._sets:
            return None
        self._next()
        return True

    def fetchall(self):
        self.fetched.append("all")
        rows, self._rows = self._rows, []
        return rows

    def fetchmany(self, n):
        self.fetched.append(n)
        rows, self._rows = self._rows[:n], self._rows[n:]
        return rows

    def close(self):
        pass


class FakeConnection:
    def __init__(self, kwargs, data, error):
        self.kwargs = kwargs
        self.data = data
        self.error = error
        self.statements = []
        self.cursors = []
        self.closed = False

    def answer(self, sql):
        rows = self.data.get(self.kwargs["user"], [])
        if sql.startswith("SELECT COUNT(*)"):
            return ["count(*)"], [(len(rows),)]
        if sql.startswith("DESCRIBE"):
            return ["Field", "Type"], [("patient_id", "varchar")]
        if sql.startswith(("USE ", "SET ")):
            return [], []
        return ["patient_id"], rows

    def cursor(self):
        cursor = FakeCursor(self)
        self.cursors.append(cursor)
        return cursor

    def close(self):
        self.closed = True


@pytest.fixture
def starrocks_server(monkeypatch):
    """A fake StarRocks: ``data`` maps a user (JWT sub) to the rows they may read."""

    class Server:
        data: dict = {}
        error = None
        connections: list = []
        token_files: list = []

    def connect(**kwargs):
        path = kwargs["openid_token_file"]
        Server.token_files.append((path, Path(path).read_text(), stat.S_IMODE(os.stat(path).st_mode)))
        conn = FakeConnection(kwargs, Server.data, Server.error)
        Server.connections.append(conn)
        return conn

    Server.data, Server.connections, Server.token_files = {}, [], []
    monkeypatch.setattr(starrocks.mysql.connector, "connect", connect)
    return Server


def test_a_query_without_jwt_never_connects(starrocks_server):
    with pytest.raises(starrocks.StarRocksError, match="Authentication required"):
        starrocks.query(None, "SELECT 1")
    assert starrocks_server.connections == []


def test_connects_as_the_jwt_subject_with_timeouts(starrocks_server, configure):
    configure(starrocks_query_timeout=30, starrocks_db="radiant")
    token = jwt("alice-sub")
    starrocks.query(token, "SELECT 1")
    (conn,) = starrocks_server.connections
    assert conn.kwargs["user"] == "alice-sub"
    assert conn.kwargs["auth_plugin"] == "authentication_openid_connect_client"
    assert conn.kwargs["database"] == "radiant"
    assert conn.kwargs["init_command"] == "SET query_timeout = 30"
    assert conn.kwargs["read_timeout"] == 35
    ((path, content, mode),) = starrocks_server.token_files
    assert content == token and mode == 0o600
    assert not os.path.exists(path)
    assert conn.closed


def test_parallel_logins_run_one_at_a_time_each_with_its_own_token(monkeypatch):
    # The OpenID plugin's token file is a process-wide setting: overlapping logins would
    # read another call's token, or a file already removed.
    active, overlaps, seen = [0], [], []
    lock = threading.Lock()

    def connect(**kwargs):
        with lock:
            active[0] += 1
            overlaps.append(active[0])
        time.sleep(0.02)
        seen.append((kwargs["user"], Path(kwargs["openid_token_file"]).read_text()))
        with lock:
            active[0] -= 1
        return FakeConnection(kwargs, {}, None)

    monkeypatch.setattr(starrocks.mysql.connector, "connect", connect)
    tokens = [jwt(f"user{i}") for i in range(6)]
    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(lambda token: starrocks.query(token, "SELECT 1"), tokens))
    assert max(overlaps) == 1
    assert sorted(seen) == sorted((f"user{i}", token) for i, token in enumerate(tokens))


def test_the_certificate_is_not_verified_by_default(starrocks_server):
    starrocks.query(jwt("alice"), "SELECT 1")
    kwargs = starrocks_server.connections[0].kwargs
    assert kwargs["ssl_verify_cert"] is False and kwargs["ssl_verify_identity"] is False
    assert "ssl_ca" not in kwargs


def test_the_certificate_chain_and_hostname_are_verified_against_the_ca(starrocks_server, configure, tmp_path):
    ca = tmp_path / "ca.pem"
    ca.write_text("PEM")
    configure(starrocks_ssl_verify=True, starrocks_ssl_ca=str(ca))
    starrocks.query(jwt("alice"), "SELECT 1")
    kwargs = starrocks_server.connections[0].kwargs
    assert kwargs["ssl_ca"] == str(ca)
    assert kwargs["ssl_verify_cert"] is True and kwargs["ssl_verify_identity"] is True


def test_a_row_cap_stops_the_statement_in_starrocks(starrocks_server, configure):
    configure(starrocks_query_timeout=30)
    starrocks.query(jwt("alice"), "SELECT 1", max_rows=500)
    starrocks.query(jwt("alice"), "SELECT 1")
    capped, uncapped = (conn.kwargs["init_command"] for conn in starrocks_server.connections)
    assert capped == "SET query_timeout = 30, sql_select_limit = 501"
    assert uncapped == "SET query_timeout = 30"


def test_a_connection_error_keeps_the_host_out_of_the_message(monkeypatch):
    def refuse(**kwargs):
        raise DatabaseError(msg="Can't connect to MySQL server on 'starrocks.internal:9030' (61)", errno=2003)

    monkeypatch.setattr(starrocks.mysql.connector, "connect", refuse)
    with pytest.raises(starrocks.StarRocksError) as exc:
        starrocks.query(jwt("alice"), "SELECT 1")
    assert "starrocks.internal" not in str(exc.value) and "2003" in str(exc.value)


def test_an_unknown_database_at_connect_is_the_callers_input(starrocks_server, monkeypatch):
    # StarRocks 4.0.16 rejects an unknown default database at connect.
    def unknown(**kwargs):
        raise DatabaseError(msg="Getting analyzing error. Detail message: Unknown database 'nope_tenant'.",
                            errno=5501, sqlstate="3F000")

    monkeypatch.setattr(starrocks.mysql.connector, "connect", unknown)
    error = call_as(monkeypatch, "bob", query.read_query, "SELECT 1", "nope_tenant")["error"]
    assert error["code"] == "invalid_input" and "nope_tenant" in error["message"]


def test_table_overview_reports_an_unknown_table_as_input(starrocks_server, monkeypatch):
    starrocks_server.error = DatabaseError(msg="Getting analyzing error. Detail message: Unknown table 't.nope'.",
                                           errno=5502, sqlstate="42602")
    error = call_as(monkeypatch, "bob", query.table_overview, "t1_tenant.nope")["error"]
    assert error["code"] == "invalid_input" and "Unknown table" in error["message"]


def test_a_denied_login_says_so(monkeypatch):
    def deny(**kwargs):
        raise DatabaseError(msg="Access denied for user 'alice'", errno=1045, sqlstate="28000")

    monkeypatch.setattr(starrocks.mysql.connector, "connect", deny)
    with pytest.raises(starrocks.StarRocksError) as exc:
        starrocks.query(jwt("alice"), "SELECT 1")
    assert exc.value.kind == "denied"


def test_max_rows_reads_one_extra_row_and_flags_truncation(starrocks_server):
    starrocks_server.data = {"alice": [(f"MRN-{i}",) for i in range(10)]}
    result = starrocks.query(jwt("alice"), "SELECT patient_id FROM t", max_rows=3)
    assert result.rows == [("MRN-0",), ("MRN-1",), ("MRN-2",)]
    assert result.truncated
    # One extra row fetched to flag the cut; the rest is never fetched into memory (an
    # explicit LIMIT overrides sql_select_limit): nextset / close discard it.
    assert starrocks_server.connections[0].cursors[0].fetched == [4]


def test_a_statement_error_is_raised_and_the_connection_closed(starrocks_server):
    starrocks_server.error = DatabaseError(msg="Query exceeded time limit of 60 seconds")
    with pytest.raises(starrocks.StarRocksError, match="exceeded time limit"):
        starrocks.query(jwt("alice"), "SELECT sleep(100)")
    assert starrocks_server.connections[0].closed


def test_an_unsafe_database_name_is_rejected_before_connecting(starrocks_server):
    with pytest.raises(starrocks.StarRocksError, match="invalid name"):
        starrocks.query(jwt("alice"), "SELECT 1", database="x`; DROP TABLE y; --")
    assert starrocks_server.connections == []


def call_as(monkeypatch, user, tool, *args):
    monkeypatch.setattr(_api, "get_jwt_token", lambda: jwt(user) if user else None)
    return envelope(asyncio.run(tool(*args)))


def test_read_query_returns_rows_and_says_when_it_cut_them(starrocks_server, monkeypatch, configure):
    configure(starrocks_max_rows=2)
    starrocks_server.data = {"alice": [("a",), ("b",), ("c",)]}
    out = call_as(monkeypatch, "alice", query.read_query, "SELECT patient_id FROM t")
    assert out["data"]["columns"] == ["patient_id"] and out["data"]["rows"] == [["a"], ["b"]]
    assert out["data"]["returned"] == 2 and "Aggregate" in out["truncated"]["reason"]


def test_read_query_reports_starrocks_errors_and_missing_jwt(starrocks_server, monkeypatch):
    assert call_as(monkeypatch, None, query.read_query, "SELECT 1")["error"]["code"] == "auth_required"
    starrocks_server.error = DatabaseError(msg="Access denied for user bob", errno=1227, sqlstate="42000")
    assert call_as(monkeypatch, "bob", query.read_query, "SELECT 1")["error"] == {
        "code": "forbidden", "message": "StarRocks denied access: 1227 (42000): Access denied for user bob"}


def test_a_token_that_expired_during_the_call_asks_to_sign_in_again(starrocks_server, monkeypatch):
    # Checked once on arrival, a token can expire while a tool chains statements: StarRocks
    # would deny the login as a missing grant, and the agent would blame the tenant.
    monkeypatch.setattr(_api, "get_jwt_token", lambda: jwt("bob", exp=1))
    error = envelope(asyncio.run(query.read_query("SELECT 1")))["error"]
    assert error["code"] == "auth_required" and "expired" in error["message"]
    assert starrocks_server.connections == []
    starrocks.query(jwt("bob", exp=4102444800), "SELECT 1")  # 2100: still valid
    assert len(starrocks_server.connections) == 1


def test_a_token_about_to_expire_counts_as_expired(starrocks_server):
    # StarRocks checks it again with its own clock: a login landing just after exp would be
    # denied as a missing grant.
    import time

    with pytest.raises(starrocks.StarRocksError) as exc:
        starrocks.query(jwt("bob", exp=int(time.time()) + 2), "SELECT 1")
    assert exc.value.kind == "expired" and starrocks_server.connections == []
    # A token with a minute left still works: the margin only covers the connect.
    starrocks.query(jwt("bob", exp=int(time.time()) + 60), "SELECT 1")
    assert len(starrocks_server.connections) == 1


@pytest.mark.parametrize("errno, sqlstate, msg, code", [
    # The agent wrote the statement: a syntax error or an unknown column is its to fix.
    (1064, "42000", "Getting syntax error at line 1", "invalid_input"),
    (1064, "HY000", "Getting analyzing error. Detail message: Column 'foo' cannot be resolved.", "invalid_input"),
    (1054, "42S22", "Unknown column 'foo'", "invalid_input"),
    (1146, "42S02", "Unknown table 'bar'", "invalid_input"),
    # StarRocks itself: retry once.
    (1064, "HY000", "Query exceeded time limit of 60 seconds", "upstream"),
    (2013, "HY000", "Lost connection to MySQL server during query", "upstream"),
])
def test_read_query_tells_a_bad_statement_from_a_starrocks_failure(starrocks_server, monkeypatch, errno, sqlstate,
                                                                    msg, code):
    starrocks_server.error = DatabaseError(msg=msg, errno=errno, sqlstate=sqlstate)
    error = call_as(monkeypatch, "bob", query.read_query, "SELECT foo FROM bar")["error"]
    assert error["code"] == code and msg in error["message"]


def test_read_query_rejects_a_bad_database_name_as_input(starrocks_server, monkeypatch):
    error = call_as(monkeypatch, "bob", query.read_query, "SELECT 1", "x; DROP")["error"]
    assert error["code"] == "invalid_input" and starrocks_server.connections == []


def test_table_overview_runs_under_each_caller_grants(starrocks_server, monkeypatch):
    """No cache: Bob never sees the rows Alice was allowed to read."""
    starrocks_server.data = {"alice": [("MRN-ALICE",)], "bob": []}
    alice = call_as(monkeypatch, "alice", query.table_overview, "t1_tenant.v_pcx_30_patient_key")
    assert alice["data"]["row_count"] == 1 and alice["data"]["sample"]["rows"] == [["MRN-ALICE"]]
    assert alice["data"]["columns"] == [{"Field": "patient_id", "Type": "varchar"}]
    bob = call_as(monkeypatch, "bob", query.table_overview, "t1_tenant.v_pcx_30_patient_key")
    assert bob["data"]["row_count"] == 0 and "sample" not in bob["data"]
    assert "MRN-ALICE" not in json.dumps(bob)


def test_table_overview_rejects_unsafe_or_incomplete_names(starrocks_server, monkeypatch):
    out = call_as(monkeypatch, "alice", query.table_overview, "t1_tenant.x` UNION SELECT 1 --")
    assert out["error"]["code"] == "invalid_input" and out["error"]["message"].startswith("invalid name")
    out = call_as(monkeypatch, "alice", query.table_overview, "germline__snv__occurrence")
    assert "no database given" in out["error"]["message"]
    assert starrocks_server.connections == []


def test_a_use_before_the_select_returns_the_select(starrocks_server, monkeypatch):
    # StarRocks runs every statement: `USE db; SELECT ...` used to come back empty.
    starrocks_server.data = {"bob": [("MRN-1",), ("MRN-2",)]}
    out = call_as(monkeypatch, "bob", query.read_query, "USE t1_tenant; SELECT patient_id FROM t")
    assert out["data"]["rows"] == [["MRN-1"], ["MRN-2"]] and out["warnings"] == []


def test_later_result_sets_are_counted_and_warned(starrocks_server, monkeypatch):
    starrocks_server.data = {"bob": [("MRN-1",)]}
    out = call_as(monkeypatch, "bob", query.read_query, "SELECT patient_id FROM t; SELECT patient_id FROM u")
    assert out["data"]["returned"] == 1
    assert out["warnings"] and "1 later statement(s)" in out["warnings"][0]
