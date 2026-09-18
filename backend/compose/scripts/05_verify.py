#!/usr/bin/env python3
"""
05_verify.py — verify the multi-tenant PII-masking simulation end-to-end.

    python3 05_verify.py

No pip deps: shells out to the `mysql` client against StarRocks :9030.

Two groups of checks:

  1. MASKING MATRIX (the working deliverable) — each user sees a patient's PII
     only where they hold can_read_pii for that patient's org; admin_role/root
     see everything; everyone else gets '***'.

  2. TENANT ISOLATION — a user must be DENIED on a tenant whose role he does not
     hold, on the views as well as on the base tables. This became enforceable
     when StarRocks fixed #72910 (Ranger authorization was previously bypassed
     for views); it requires the `view`-resource access policies that
     03_ranger_policies.py creates alongside the table ones.
     The view half SKIPS itself on a server that does not apply Ranger to views
     (see views_are_enforced) rather than reporting a failure — the local
     StarRocks image is such a server.

Exit code 0 = all checks passed, 1 = at least one failed.
"""

import atexit
import base64
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request

SR_HOST, SR_PORT = "127.0.0.1", "9030"

# Auth model (mirrors 02_starrocks_admin_user.sql):
#   root           native, no password (allin1 image)
#   svc_admin_api  native, password adminpass1 (the platform/service admin)
#   alice/bob/wendy JWT — a Keycloak token, sent via the mysql OIDC client plugin
NATIVE_USERS = {"root": None, "svc_admin_api": "adminpass1"}
JWT_USERS = {"alice", "bob", "wendy"}

KC_URL = os.environ.get("KC_URL", "http://localhost:8080")
REALM = os.environ.get("REALM", "CQDG")
CLIENT_ID = os.environ.get("CLIENT_ID", "radiant")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET", "ShutThisIsASecret!")
USER_PASSWORD = os.environ.get("USER_PASSWORD", "radiant123!")

RESULTS = []
_TOKEN_FILES = {}  # user -> path of a temp file holding their JWT (cached)
_TOKENS = {}       # user -> raw JWT access token (cached)
_SUBS = {}         # user -> `sub` claim = the StarRocks username (cached)


@atexit.register
def _cleanup_token_files():
    for path in _TOKEN_FILES.values():
        try:
            os.remove(path)
        except OSError:
            pass


def _token(user):
    """Fetch and cache a Keycloak access token for `user` (ROPC)."""
    if user in _TOKENS:
        return _TOKENS[user]
    body = urllib.parse.urlencode({
        "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET,
        "username": user, "password": USER_PASSWORD, "grant_type": "password",
    }).encode()
    url = f"{KC_URL}/realms/{REALM}/protocol/openid-connect/token"
    try:
        with urllib.request.urlopen(url, data=body, timeout=30) as resp:
            tok = json.loads(resp.read().decode())["access_token"]
    except (urllib.error.URLError, KeyError) as e:
        print(f"  !! token fetch failed for {user}: {e}", file=sys.stderr)
        tok = ""
    _TOKENS[user] = tok
    return tok


def _token_file(user):
    """Write the user's cached JWT to a temp file the mysql OIDC client plugin
    can read. Returns the file path."""
    if user in _TOKEN_FILES:
        return _TOKEN_FILES[user]
    fd, path = tempfile.mkstemp(prefix=f"jwt_{user}_")
    with os.fdopen(fd, "w") as f:
        f.write(_token(user))
    _TOKEN_FILES[user] = path
    return path


def _sub(user):
    """The StarRocks username for a JWT user is the token's `sub` claim
    (principal_field=sub now), not the human handle. Falls back to the handle if
    the token can't be decoded."""
    if user in _SUBS:
        return _SUBS[user]
    tok = _token(user)
    sub = user
    if tok:
        payload = tok.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        sub = json.loads(base64.urlsafe_b64decode(payload)).get("sub", user)
    _SUBS[user] = sub
    return sub


def run_sql(user, sql):
    # JWT users authenticate as their `sub` (the StarRocks username); native
    # users (root/svc_admin_api) keep their handle.
    login = _sub(user) if user in JWT_USERS else user
    cmd = ["mysql", "-h", SR_HOST, "-P", SR_PORT, f"-u{login}", "-N", "-B", "-e", sql]
    if user in JWT_USERS:
        cmd[5:5] = [
            "--ssl-mode=PREFERRED", # Use ssl but no cert validation (autosign cert)
            f"--authentication-openid-connect-client-id-token-file={_token_file(user)}",
            "--default-auth=authentication_openid_connect_client",
        ]
    else:
        pwd = NATIVE_USERS.get(user)
        if pwd:
            cmd.insert(5, f"-p{pwd}")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    out, err = proc.stdout.strip(), proc.stderr.strip()
    denied = "Access denied" in err or "Access denied" in out
    rows = [ln.split("\t") for ln in out.splitlines()] if out else []
    return {"denied": denied, "rows": rows, "err": err, "rc": proc.returncode}


def check(name, ok, detail=""):
    RESULTS.append(ok)
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}" + (f"  — {detail}" if detail else ""))


# ---------------------------------------------------------------------------
# 1. Masking matrix.  True = PII clear, False = masked ('***').
#    Patients: tenant_a 1001/1002=ORG_A1, 1003=ORG_A2 ; tenant_b 2001=ORG_B1, 2002=ORG_B2
#    Only (user, tenant) pairs the user can READ at all appear here — a user has no
#    access to a tenant whose role he doesn't hold, which DENIED below asserts.
# ---------------------------------------------------------------------------
MATRIX = {
    ("root",          "tenant_a"): {1001: True, 1002: True, 1003: True},
    ("root",          "tenant_b"): {2001: True, 2002: True},
    ("svc_admin_api", "tenant_a"): {1001: True, 1002: True, 1003: True},  # admin_role bypass
    ("svc_admin_api", "tenant_b"): {2001: True, 2002: True},
    ("wendy", "tenant_a"): {1001: True,  1002: True,  1003: True},   # can_read_pii @ '*'
    ("alice", "tenant_a"): {1001: True,  1002: True,  1003: False},  # can_read_pii @ ORG_A1
    ("bob",   "tenant_b"): {2001: True,  2002: False},               # can_read_pii @ ORG_B1
}

# (user, tenant) pairs the user holds no role for -> every read must be denied.
DENIED = [("alice", "tenant_b"), ("wendy", "tenant_b"), ("bob", "tenant_a")]


def test_masking_matrix():
    print("\n== 1. Masking matrix (PII clear vs '***') ==")
    for (user, db), expected in MATRIX.items():
        res = run_sql(user, f"SELECT id, submitter_patient_id FROM {db}.patient ORDER BY id")
        if res["denied"] or not res["rows"]:
            check(f"{user} @ {db}", False,
                  f"expected rows but got denied/empty (rc={res['rc']}) {res['err'][:80]}")
            continue
        got = {int(r[0]): r[1] for r in res["rows"] if len(r) == 2}
        bad = []
        for pid, want_clear in expected.items():
            spid = got.get(pid)
            is_clear = spid is not None and spid != "***"
            if spid is None or is_clear != want_clear:
                bad.append(f"id={pid} want={'clear' if want_clear else 'masked'} got={spid!r}")
        check(f"{user} @ {db}", not bad, "; ".join(bad))


def test_flag_matches_masking():
    # For regular (user_role) users the can_read_pii flag must equal "PII visible":
    # can_read_pii=1 <=> submitter_patient_id is clear, =0 <=> it is '***'.
    # (Admins/root read the flag as 0 while seeing clear data — bypass, not action
    # — so they're skipped.)
    print("\n== 2. can_read_pii flag agrees with masking (regular users) ==")
    for user, db in (("alice", "tenant_a"), ("wendy", "tenant_a"), ("bob", "tenant_b")):
        res = run_sql(user, f"SELECT id, submitter_patient_id, can_read_pii FROM {db}.patient ORDER BY id")
        if res["denied"] or not res["rows"]:
            check(f"{user} @ {db}", False, f"denied/empty (rc={res['rc']})")
            continue
        bad = []
        for r in res["rows"]:
            if len(r) != 3:
                continue
            pid, spid, flag = r[0], r[1], r[2]
            clear = spid != "***"
            if (flag == "1") != clear:
                bad.append(f"id={pid} flag={flag} submitter_patient_id={spid!r}")
        check(f"{user} @ {db}", not bad, "; ".join(bad))


# Deliberately does NOT match `tenant_*`, so no access policy covers it.
PROBE_DB = "verify_probe"


def views_are_enforced():
    """True if this StarRocks applies Ranger to views (i.e. #72910 is fixed on it).

    Probes with a throwaway view in a database no policy grants, selecting a constant so
    the only thing that can deny the read is the view object itself. A regular user who
    CAN read it is on a server that bypasses authorization for views (pre-#72910), where
    the isolation assertions cannot hold. Returns None if the probe can't be set up.
    """
    setup = run_sql("root", f"CREATE DATABASE IF NOT EXISTS {PROBE_DB}; "
                            f"CREATE OR REPLACE VIEW {PROBE_DB}.v AS SELECT 1 AS x")
    if setup["rc"] != 0:
        return None
    try:
        return run_sql("bob", f"SELECT x FROM {PROBE_DB}.v")["denied"]
    finally:
        run_sql("root", f"DROP VIEW IF EXISTS {PROBE_DB}.v; "
                        f"DROP DATABASE IF EXISTS {PROBE_DB}")


def test_tenant_isolation():
    print("\n== 3. Tenant isolation (views and base tables) ==")
    # Enforced on every StarRocks version, so this half never skips.
    base = run_sql("bob", "SELECT count(*) FROM radiant_jdbc.public.patient")
    check("bob DENIED on base table radiant_jdbc.public.patient",
          base["denied"], "" if base["denied"] else f"rc={base['rc']} rows={base['rows']}")

    enforced = views_are_enforced()
    if enforced is None:
        print(f"  [SKIP] view isolation — could not create the {PROBE_DB} probe as root")
        return
    if not enforced:
        print("  [SKIP] view isolation — this StarRocks does not apply Ranger to views:")
        print(f"         a regular user read {PROBE_DB}.v, which no policy grants")
        print("         (pre-#72910 behaviour). Run against a server that enforces")
        print("         views to assert tenant isolation.")
        return

    # Views are an access boundary ONLY because 03_ranger_policies.py grants the `view`
    # resource: a table-resource policy does not reach a view, so a MISSING view policy
    # shows up here as a spurious PASS on denial while the portal can read nothing at
    # all. Check 1 is what catches that.
    for user, db in DENIED:
        res = run_sql(user, f"SELECT count(*) FROM {db}.patient")
        check(f"{user} DENIED on view {db}.patient (holds no {db} role)",
              res["denied"],
              "" if res["denied"] else f"rc={res['rc']} rows={res['rows']}")


def main():
    # sanity: connectivity
    if run_sql("root", "SELECT 1")["rc"] != 0:
        print("Cannot reach StarRocks at "
              f"{SR_HOST}:{SR_PORT} as root. Is the stack up?", file=sys.stderr)
        sys.exit(2)
    test_masking_matrix()
    test_flag_matches_masking()
    test_tenant_isolation()
    passed, total = sum(RESULTS), len(RESULTS)
    print(f"\n{passed}/{total} checks passed.")
    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
