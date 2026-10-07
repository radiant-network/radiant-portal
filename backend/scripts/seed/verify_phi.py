"""Check the PHI matrix of tenant cbtn on the running local stack, one demo user at a time.

  python3 verify_phi.py

Each user logs in through Keycloak; the PCX views are queried through mysql-proxy as that user (a throwaway
container on the compose network), the portal patient through the API. The rules, not counts, are checked, so this
keeps passing when the real CSVs replace the fake ones:
  PCX views    patient_id is the MRN exactly where the user can read PHI (organization grant, or diagnosis-lab grant
               for patients with a portal case), calendar dates are NULL elsewhere
  portal       Ranger masks the patient's identifiers for a user without PHI access (API case page)
Needs docker on the host and the stack started with STARROCKS_PROXY_READ_ENABLED on (the default).
"""
import base64, json, os, subprocess, sys, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
KEYCLOAK, API = "http://localhost:8080/realms/radiant/protocol/openid-connect/token", "http://localhost:8090/cbtn"
IMAGE = "starrocks/allin1-ubuntu:4.0.16"
# user: organizations whose patients it identifies; "*" = all, "lab" = every patient with a portal case.
EXPECTED = {"cbtn-admin": "*", "cbtn-phi-chop": {"CHOP"}, "cbtn-phi-sch": {"SCH"}, "cbtn-lab": "lab", "cbtn-nophi": set()}

realm = json.load(open(os.path.join(HERE, "..", "init-keycloak", "radiant.json")))
secret = next(c["secret"] for c in realm["clients"] if c["clientId"] == "radiant")
network = subprocess.run(["docker", "inspect", "radiant-api", "--format", "{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}"],
                         capture_output=True, text=True, check=True).stdout.strip()


def token(user):
    body = urllib.parse.urlencode({"grant_type": "password", "client_id": "radiant", "client_secret": secret,
                                   "username": user, "password": user}).encode()
    return json.load(urllib.request.urlopen(KEYCLOAK, body))["access_token"]


def sql(jwt, query):
    payload = jwt.split(".")[1]
    sub = json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))["sub"]
    out = subprocess.run(["docker", "run", "--rm", "--network", network, IMAGE, "mysql", "-h", "mysql-proxy", "-P9031", "-u", sub,
                          f"--password={jwt}", "--enable-cleartext-plugin", "-N", "-e", query], capture_output=True, text=True)
    if out.returncode:
        raise SystemExit(f"query failed: {out.stderr.strip()}")
    return [line.split("\t") for line in out.stdout.strip().splitlines()]


def api(jwt, path, body=None):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": f"Bearer {jwt}", "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


failures = []
for user, scope in EXPECTED.items():
    jwt = token(user)
    # Filtering on radiant_patient_id breaks on StarRocks 4.0.16 (upstream views), so count it instead of filtering.
    rows = sql(jwt, "SELECT organization_code, patient_id_type, count(*), count(radiant_patient_id), count(birth_date) "
                    "FROM cbtn_tenant.v_pcx_30_demographics_combined GROUP BY 1, 2")
    for org, id_type, n, portal, dated in rows:
        n, portal, dated = int(n), int(portal), int(dated)
        if scope == "*":
            ok = id_type == "mrn"
        elif scope == "lab":
            ok = (id_type == "mrn") == (portal == n) and (id_type == "research_id") == (portal == 0)
        else:
            ok = (id_type == "mrn") == (org in scope)
        ok = ok and dated == (n if id_type == "mrn" else 0)
        if not ok:
            failures.append(f"{user}: {org} {id_type} rows={n} portal={portal} dated={dated}")
    cases = api(jwt, "/cases/search", {"limit": 200})["list"]
    case = next(c for c in cases if c.get("ordering_organization_code") == "CHOP")
    member = api(jwt, f"/cases/{case['case_id']}")["members"][0]
    masked = member["submitter_patient_id"] == "***"
    if masked != (scope == set() or (isinstance(scope, set) and "CHOP" not in scope)):
        failures.append(f"{user}: CHOP case {case['case_id']} patient masked={masked}")
    print(f"{user:15} pcx {', '.join(f'{o}:{t}' for o, t, *_ in sorted(rows))} | portal CHOP patient masked={masked}")

print("\n" + ("PHI matrix OK" if not failures else "FAILED\n  " + "\n  ".join(failures)))
sys.exit(1 if failures else 0)
