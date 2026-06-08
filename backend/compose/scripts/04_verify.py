#!/usr/bin/env python3
"""
04_verify.py — verify the multi-tenant PII-masking simulation end-to-end.

    python3 04_verify.py

No pip deps: shells out to the `mysql` client against StarRocks :9030.

Two groups of checks:

  1. MASKING MATRIX (the working deliverable) — each user sees a patient's PII
     only where they hold can_read_pii for that patient's org; admin_role/root
     see everything; everyone else gets '***'.

  2. KNOWN BUG #72910 (StarRocks Ranger view-auth bypass) — access control is
     enforced on base TABLES but NOT on VIEWS. We assert bob is DENIED on the
     base table radiant_jdbc.public.patient yet can still READ tenant_a.patient
     (a view he holds no grant for). When StarRocks fixes #72910 this check
     starts FAILING (bob gets denied on the view) — that is the signal to turn
     the access policies back on and re-verify tenant isolation.

Exit code 0 = all checks passed, 1 = at least one failed.
"""

import atexit
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request

SR_HOST, SR_PORT = "127.0.0.1", "9030"

# Auth model (mirrors 02_starrocks_users.sql):
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


@atexit.register
def _cleanup_token_files():
    for path in _TOKEN_FILES.values():
        try:
            os.remove(path)
        except OSError:
            pass


def _token_file(user):
    """Fetch a Keycloak access token for `user` (ROPC) and cache it in a temp
    file the mysql OIDC client plugin can read. Returns the file path."""
    if user in _TOKEN_FILES:
        return _TOKEN_FILES[user]
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
    fd, path = tempfile.mkstemp(prefix=f"jwt_{user}_")
    with os.fdopen(fd, "w") as f:
        f.write(tok)
    _TOKEN_FILES[user] = path
    return path


def run_sql(user, sql):
    cmd = ["mysql", "-h", SR_HOST, "-P", SR_PORT, f"-u{user}", "-N", "-B", "-e", sql]
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
#    (Users can READ other tenants' views due to #72910 — rows come back masked.)
# ---------------------------------------------------------------------------
MATRIX = {
    ("root",          "tenant_a"): {1001: True, 1002: True, 1003: True},
    ("root",          "tenant_b"): {2001: True, 2002: True},
    ("svc_admin_api", "tenant_a"): {1001: True, 1002: True, 1003: True},  # admin_role bypass
    ("svc_admin_api", "tenant_b"): {2001: True, 2002: True},
    ("wendy", "tenant_a"): {1001: True,  1002: True,  1003: True},   # can_read_pii @ '*'
    ("wendy", "tenant_b"): {2001: False, 2002: False},               # no grant in tenant_b
    ("alice", "tenant_a"): {1001: True,  1002: True,  1003: False},  # can_read_pii @ ORG_A1
    ("alice", "tenant_b"): {2001: False, 2002: False},
    ("bob",   "tenant_a"): {1001: False, 1002: False, 1003: False},  # no grant in tenant_a
    ("bob",   "tenant_b"): {2001: True,  2002: False},               # can_read_pii @ ORG_B1
}


def test_masking_matrix():
    print("\n== 1. Masking matrix (PII clear vs '***') ==")
    for (user, db), expected in MATRIX.items():
        res = run_sql(user, f"SELECT id, mrn FROM {db}.patient ORDER BY id")
        if res["denied"] or not res["rows"]:
            check(f"{user} @ {db}", False,
                  f"expected rows but got denied/empty (rc={res['rc']}) {res['err'][:80]}")
            continue
        got = {int(r[0]): r[1] for r in res["rows"] if len(r) == 2}
        bad = []
        for pid, want_clear in expected.items():
            mrn = got.get(pid)
            is_clear = mrn is not None and mrn != "***"
            if mrn is None or is_clear != want_clear:
                bad.append(f"id={pid} want={'clear' if want_clear else 'masked'} got={mrn!r}")
        check(f"{user} @ {db}", not bad, "; ".join(bad))


def test_flag_matches_masking():
    # For regular (user_role) users the can_read_pii flag must equal "PII visible":
    # can_read_pii=1 <=> mrn is clear, =0 <=> mrn is '***'. (Admins/root read the
    # flag as 0 while seeing clear data — bypass, not action — so they're skipped.)
    print("\n== 2. can_read_pii flag agrees with masking (regular users) ==")
    for user in ("alice", "bob", "wendy"):
        for db in ("tenant_a", "tenant_b"):
            res = run_sql(user, f"SELECT id, mrn, can_read_pii FROM {db}.patient ORDER BY id")
            if res["denied"] or not res["rows"]:
                check(f"{user} @ {db}", False, f"denied/empty (rc={res['rc']})")
                continue
            bad = []
            for r in res["rows"]:
                if len(r) != 3:
                    continue
                pid, mrn, flag = r[0], r[1], r[2]
                clear = mrn != "***"
                if (flag == "1") != clear:
                    bad.append(f"id={pid} flag={flag} mrn={mrn!r}")
            check(f"{user} @ {db}", not bad, "; ".join(bad))


def test_72910_view_auth_bypass():
    print("\n== 3. StarRocks #72910 — Ranger view-auth bypass (documented) ==")
    # (a) access control IS enforced on the base table
    base = run_sql("bob", "SELECT count(*) FROM radiant_jdbc.public.patient")
    check("bob DENIED on base table radiant_jdbc.public.patient",
          base["denied"], "" if base["denied"] else f"rc={base['rc']} rows={base['rows']}")

    # (b) ...but NOT on the view (bob has no tenant_a grant) — this is the bug
    view = run_sql("bob", "SELECT count(*) FROM tenant_a.patient")
    bug_present = (not view["denied"]) and view["rows"] and view["rows"][0][0].isdigit()
    check("bob CAN read view tenant_a.patient despite no grant (#72910 present)",
          bool(bug_present),
          "" if bug_present else
          "bob was DENIED on the view -> #72910 MAY BE FIXED. Re-enable access "
          "policies and re-verify tenant isolation.")


def main():
    # sanity: connectivity
    if run_sql("root", "SELECT 1")["rc"] != 0:
        print("Cannot reach StarRocks at "
              f"{SR_HOST}:{SR_PORT} as root. Is the stack up?", file=sys.stderr)
        sys.exit(2)
    test_masking_matrix()
    test_flag_matches_masking()
    test_72910_view_auth_bypass()
    passed, total = sum(RESULTS), len(RESULTS)
    print(f"\n{passed}/{total} checks passed.")
    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
