"""StarRocks access under the caller's JWT.

Every statement opens a one-shot MySQL connection authenticated with the
caller's Keycloak JWT through the ``authentication_openid_connect_client``
plugin, so StarRocks applies that user's own grants. There is no pool, no
service account and no static-credential fallback: a call without a JWT
fails. ``STARROCKS_HOST``, ``STARROCKS_PORT`` and ``STARROCKS_DB`` only say
where to connect.

The connection is always TLS (StarRocks requires it for JWT logins). With
``STARROCKS_SSL_VERIFY`` the FE certificate chain and hostname are checked
against ``STARROCKS_SSL_CA``, or the system CA bundle when it is unset.

Each session gets a ``query_timeout``, and the socket a read timeout a little
longer, so one slow query cannot hold a worker thread forever. ``max_rows``
reads at most that many rows plus one, to flag a truncated result without
loading the rest.
"""

import base64
import json
import logging
import os
import re
import tempfile
import threading
import time
from collections.abc import Iterator
from contextlib import contextmanager, suppress
from dataclasses import dataclass, field
from typing import Any

import mysql.connector
from mysql.connector.errors import Error as MySQLError

try:  # The C extension raises its own error class from nextset().
    from _mysql_connector import MySQLError as CExtensionError
except ImportError:  # pragma: no cover - pure-Python connector
    CExtensionError = MySQLError

from .settings import get_settings

logger = logging.getLogger(__name__)

# Extra seconds the socket waits beyond query_timeout, so StarRocks' own
# timeout error normally arrives first.
_READ_TIMEOUT_MARGIN = 5
# A token this close to its exp counts as expired: StarRocks validates it again with its own
# clock, and would deny a login that lands just after exp as a missing grant. exp is checked
# right before each connection, so the margin only covers the connect and a little clock
# skew; a larger one would turn away tokens that still work (10% of a 300 s token at 30 s).
_EXPIRY_MARGIN = 5

# The C extension hands the token file to the OpenID plugin with mysql_plugin_options(), a
# setting of the process-wide plugin, not of the connection: two logins at once (parallel
# summary queries, or two users) would read whichever file was set last, another call's token
# or one already removed (errno 1, "Unknown MySQL error"). Logins run one at a time.
_LOGIN_LOCK = threading.Lock()

_DB_NAME = re.compile(r"^[A-Za-z0-9_]{1,64}$")

AUTH_REQUIRED = "Authentication required: no JWT in request context"
AUTH_EXPIRED = "Authentication expired: the token expired during the call; sign in again"


# MySQL error numbers for access denied, and for an unknown database, column or
# table. StarRocks also reports many unrelated errors, timeouts included, as 1064
# (HY000), so a statement it cannot parse or analyse is told by its message.
_DENIED_ERRNOS = {1044, 1045, 1142, 1143, 1227}
_INVALID_ERRNOS = {1049, 1054, 1146}
_INVALID_MESSAGE = re.compile(
    r"getting syntax error|getting analyzing error|cannot be resolved|unknown (database|table|column)"
    r"|no viable alternative|mismatched input|syntax error",
    re.IGNORECASE,
)


class StarRocksError(RuntimeError):
    """The connection or the statement failed.

    ``kind`` says whose fault it is: ``denied`` (the caller's grants),
    ``invalid`` (the statement or a name), ``expired`` (the caller's token), or
    ``failed`` (StarRocks itself: down, timed out, internal error).
    """

    def __init__(self, message: str, kind: str = "failed", errno: int | None = None) -> None:
        super().__init__(message)
        self.kind = kind
        self.errno = errno


def _error(exc: MySQLError) -> StarRocksError:
    message = str(exc)
    # The C extension's own error class (raised by nextset) may lack errno / sqlstate.
    errno, sqlstate = getattr(exc, "errno", None), getattr(exc, "sqlstate", None)
    if errno in _DENIED_ERRNOS or "access denied" in message.lower():
        kind = "denied"
    elif (errno in _INVALID_ERRNOS or _INVALID_MESSAGE.search(message)
          or str(sqlstate or "").startswith("42")):
        kind = "invalid"
    else:
        kind = "failed"
    return StarRocksError(message, kind, errno)


@dataclass
class Result:
    columns: list[str] = field(default_factory=list)
    rows: list[tuple] = field(default_factory=list)
    truncated: bool = False
    # Result sets of later statements, not returned (several statements in one call).
    ignored_result_sets: int = 0


def default_database() -> str | None:
    return get_settings().starrocks_db


def database_name(value: str) -> str:
    """A database or table name that is safe to write into a statement."""
    if not isinstance(value, str) or not _DB_NAME.match(value):
        raise StarRocksError(f"invalid name: {value!r}", "invalid")
    return value


def _claims(token: str) -> dict:
    """The JWT payload, not verified here: the auth provider already checked it
    against Keycloak's JWKS, and StarRocks checks it again."""
    payload = token.split(".")[1]
    payload += "=" * (-len(payload) % 4)
    return json.loads(base64.urlsafe_b64decode(payload))


def _username(token: str) -> str:
    """The JWT ``sub`` claim, which is the StarRocks user name."""
    return _claims(token).get("sub", "unknown")


def _expired(token: str) -> bool:
    """The token was valid when the call arrived, but a tool chains statements for
    minutes: past ``exp``, StarRocks would deny the login as if the grants were missing."""
    exp = _claims(token).get("exp")
    return isinstance(exp, (int, float)) and exp <= time.time() + _EXPIRY_MARGIN


def _tls(ca_file: str | None) -> dict:
    """Connector TLS arguments: verify chain and hostname against ``ca_file``, or nothing."""
    if ca_file is None:
        return {"ssl_verify_cert": False, "ssl_verify_identity": False}
    return {"ssl_ca": ca_file, "ssl_verify_cert": True, "ssl_verify_identity": True}


@contextmanager
def connect(token: str | None, database: str | None = None, max_rows: int | None = None) -> Iterator[Any]:
    """Open a connection as the caller; it is closed on exit.

    With ``max_rows``, the session's ``sql_select_limit`` stops a statement without
    its own LIMIT at ``max_rows + 1`` rows in StarRocks: closing the connection
    would otherwise read and discard the rest of the result (an explicit LIMIT
    still wins, as in MySQL).
    """
    if not token:
        raise StarRocksError(AUTH_REQUIRED)
    if _expired(token):
        raise StarRocksError(AUTH_EXPIRED, "expired")
    if database is not None:
        database_name(database)

    settings = get_settings()
    timeout = settings.starrocks_query_timeout
    with _LOGIN_LOCK:
        conn = _login(token, settings, timeout, database, max_rows)

    try:
        yield conn
    finally:
        # A close failure must not hide the result.
        with suppress(Exception):
            conn.close()


def _login(token: str, settings: Any, timeout: float, database: str | None, max_rows: int | None) -> Any:
    """Open the connection; the caller holds ``_LOGIN_LOCK`` (see there)."""
    # The plugin reads the token from a file: 0600, removed once connected.
    fd, token_path = tempfile.mkstemp(suffix=".jwt")
    try:
        os.fchmod(fd, 0o600)
        os.write(fd, token.encode("utf-8"))
    finally:
        os.close(fd)

    try:
        return mysql.connector.connect(
            host=settings.starrocks_host,
            port=settings.starrocks_port,
            user=_username(token),
            auth_plugin="authentication_openid_connect_client",
            openid_token_file=token_path,
            database=database or settings.starrocks_db or "",
            autocommit=True,
            **_tls(settings.starrocks_ca_file),
            connect_timeout=settings.starrocks_connection_timeout,
            read_timeout=timeout + _READ_TIMEOUT_MARGIN,
            init_command=f"SET query_timeout = {int(timeout)}"
            + (f", sql_select_limit = {int(max_rows) + 1}" if max_rows is not None else ""),
        )
    except MySQLError as exc:
        error = _error(exc)
        # StarRocks reports a denied login and an unknown database (5501) at connect:
        # both are the caller's to fix, and their message names no host.
        if error.kind in ("denied", "invalid"):
            raise error from exc
        # A connection error names the host, the port or the TLS failure: logged, not returned.
        logger.warning("StarRocks connection failed: %s", exc)
        raise StarRocksError(f"Could not connect to StarRocks (error {exc.errno}); the details are in the "
                             "server logs.", "failed", exc.errno) from exc
    finally:
        with suppress(OSError):
            os.unlink(token_path)


def query(
    token: str | None,
    sql: str,
    params: tuple | dict | None = None,
    *,
    database: str | None = None,
    max_rows: int | None = None,
) -> Result:
    """Run a statement as the caller and return its first result set.

    StarRocks runs every statement of a multi-statement call (it ignores the
    client's MULTI_STATEMENTS flag): statements without a result (``USE``,
    ``SET``) before the first result set are skipped, the result sets after it
    are counted in ``ignored_result_sets``, and an error in any statement is
    raised. ``params`` are bound by the MySQL connector: ``%s`` placeholders
    with a tuple, ``%(name)s`` with a dict. A literal ``%`` must then be ``%%``.
    """
    with connect(token, database, max_rows) as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(sql, params)
            while not cursor.description:
                if not cursor.nextset():
                    return Result()
            columns = [d[0] for d in cursor.description]
            if max_rows is None:
                result = Result(columns, list(cursor.fetchall()))
            else:
                rows = list(cursor.fetchmany(max_rows + 1))
                result = Result(columns, rows[:max_rows], truncated=len(rows) > max_rows)
            # nextset() discards the unread rows without storing them (the C extension's
            # consume_result): never fetchall() here, an explicit LIMIT overrides
            # sql_select_limit and would load the whole result into this process.
            while cursor.nextset():
                if cursor.description:
                    result.ignored_result_sets += 1
            return result
        except (MySQLError, CExtensionError) as exc:
            raise _error(exc) from exc
        finally:
            # Unread rows of a truncated result can make the close fail.
            with suppress(Exception):
                cursor.close()
