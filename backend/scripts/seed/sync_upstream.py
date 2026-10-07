"""Copy what the seed needs from a RADIANT-Timeline-Abstraction clone, the source of truth for the PCX data.

  python3 sync_upstream.py ~/Dev/RADIANT/RADIANT-Timeline-Abstraction

upstream/access_controlled_views/  the secured view templates, rendered by build_seed.py for the tenant
upstream/organization_ref.csv      organization_name -> code, as pcx_30_organization_ref
upstream/view_data_dictionary_access_policy.csv
Commit the result: the local stack builds from this copy, it has no access to the clone.
"""
import csv, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(HERE, "upstream")
src = os.path.join(os.path.abspath(os.path.expanduser(sys.argv[1])), "pcx_demo_table_sql_objects")

views = os.path.join(DEST, "access_controlled_views")
shutil.rmtree(views, ignore_errors=True)
os.makedirs(views)
for f in sorted(os.listdir(os.path.join(src, "access_controlled_views"))):
    if f.endswith(".sql.tmpl"):
        shutil.copy(os.path.join(src, "access_controlled_views", f), views)
shutil.copy(os.path.join(src, "view_data_dictionary_access_policy.csv"), DEST)

# Organizations the de-identified CSVs reference that organization_ref_table.sql does not carry yet
# (reported to the data team 2026-10-06). Added only while still absent upstream, so this list stops
# having any effect once they land — delete it then, and keep the codes if upstream picks different
# ones only after checking nothing is already seeded against these.
PENDING_ORGS = [
    ["NCH", "Nicklaus Children's Hospital", "healthcare_provider", "radiant"],
    ["NYU", "NYU Langone Health", "healthcare_provider", "radiant"],
]

sql = open(os.path.join(src, "radiant-prod", "organization_ref", "organization_ref_table.sql"), encoding="utf-8").read()
rows = [[v.replace("''", "'") for v in r]
        for r in re.findall(r"\('((?:[^']|'')*)', '((?:[^']|'')*)', '([^']*)', '([^']*)'\)", sql)]
upstream_names = {r[1] for r in rows}
pending = [o for o in PENDING_ORGS if o[1] not in upstream_names]
with open(os.path.join(DEST, "organization_ref.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["code", "name", "category_code", "tenant_code"])
    w.writerows(rows + pending)

commit = subprocess.run(["git", "-C", os.path.dirname(src), "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
open(os.path.join(DEST, "VERSION"), "w").write(f"RADIANT-Timeline-Abstraction {commit}\n")
print(f"synced {len(os.listdir(views))} templates, {len(rows)} organizations from {commit}"
      + (f" (+{len(pending)} still pending upstream: {', '.join(o[1] for o in pending)})" if pending else ""))
