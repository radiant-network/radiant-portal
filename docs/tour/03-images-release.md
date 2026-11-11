# Chapter 3: images, tags and one product release

Branch: `poc/monorepo-03-images-release` (chapter 2 + the Docker images as moon tasks, the publish and release
scripts, Trivy). What it adds:

```bash
git diff --stat poc/monorepo-02-mcp-etl poc/monorepo-03-images-release
```

## Why we are doing this

Tests are half of CI. The other half is what we ship: **10 Docker images** (5 for the backend, 3 for the ETL, the
portal UI, the MCP), deployed to QA by Flux and to production by version.

Today each repo publishes its own images, its own way:

- every push to `main` **rebuilds every image of the repo**, changed or not: the portal's `build_and_push.yml`
  builds its 6 images (5 backend + the UI) for a one-line frontend fix, the ETL rebuilds its 3 images for a DAG fix;
- each built image gets `sha-<short>`, `<sha>-<timestamp>` and `latest` (docker/metadata-action). The QA Flux
  ImagePolicy (`qlin-qa-infra/kubernetes-manifests/fluxcd/*.yml`, pattern `^[a-fA-F0-9]+-(?P<ts>.*)`) deploys the
  highest timestamp: so QA redeploys **every** image of the repo on every merge, even the ones that did not change;
- each repo has its own release and its own version (today the ETL is at v1.1.32, the portal at v1.1.5, the MCP at
  v1.1.0). Nobody can say
  "production runs Radiant 2.3": it runs a combination of versions that was never tested as a whole.

In the monorepo, one commit holds every module. This chapter shows that moon's "affected" applies to images too, that
every `main` commit can still have a **complete** image set without rebuilding it, and that a release becomes one
version for the whole product.

## How this chapter works

Same as before: each step shows one or two concepts with a command. The images are built and pushed to a **local
registry** (a container on port 5002), which stands in for ghcr.io: nothing leaves your machine. The scripts in
`scripts/` are what the workflow `.github/workflows/publish.yml` would run (never run here).

| Step | Concept |
|---|---|
| 0 | setup: Docker, the local registry |
| 1 | an image is a task: its inputs are what the Dockerfile copies |
| 2 | affected images: a change rebuilds only the images it touches |
| 3 | bootstrap: the first complete image set |
| 4 | a merge to `main`: build the affected, retag the others; what Flux deploys |
| 5 | Trivy: scan the images a PR builds, fail on a fixable CRITICAL |
| 6 | one product release: a version is a retag of a tested image set |

## Step 0: setup

```bash
git switch poc/monorepo-03-images-release
export PATH=$PWD/.tools/node_modules/.bin:$PATH
git status --short                                        # nothing
docker info --format '{{.ServerVersion}}'                 # Docker is running
docker run -d --name radiant-tour-registry -p 5002:5000 registry:2.8.3   # the local "ghcr.io"
curl -s localhost:5002/v2/_catalog                        # {"repositories":[]}
```

Needs Docker (Docker Desktop, or colima), `curl` and `jq`. Trivy runs in a container (`aquasec/trivy:0.76.0`): no
install.

## Step 1: an image is a task

**Concept.** Each image is a moon task (`docker-*`) that runs `scripts/docker.sh <image> <Dockerfile> <context>`.
Like any task, it has **inputs**: here, exactly the files its Dockerfile copies. Images carry the tag `docker`, so
scripts can find them all, and depend on their module's tests (`deps`): no image is built from code whose tests fail.

```bash
scripts/images.sh                                         # the 10 published images: target, image, Trivy settings
moon tasks mcp                                            # docker-mcp next to lint and test
moon task backend:docker-mysql-proxy                      # Inputs: its Dockerfile, go.mod, 2 packages. Depends on: backend:test
```

What to look at:

- `moon task backend:docker-mysql-proxy` lists `cmd/mysql-proxy/*.go` and `internal/mysqlproxy/*.go`, not the whole
  backend. The 5 backend images share one Go module, but each binary imports different packages. The list comes from
  Go itself:

  ```bash
  (cd backend && python3 ../scripts/go-image-inputs.py mysql-proxy)   # go list -deps: the packages the binary imports
  ```

  `scripts/go-image-inputs.py` writes these lists; rerun it when an image's imports change.
- `docker-mcp` has `project://python-client?group=sources` in its inputs: the MCP image contains the generated API
  client (built from the repo root, `mcp/Dockerfile.dockerignore`).
- `docker-*` tasks have `cache: false`: pushing is a side effect, and moon must never replay a push from its cache.
  Docker's own layer cache keeps rebuilds fast.
- `etl:docker-airflow` has no `docker` tag: it is the ETL's local dev image, never published.

## Step 2: affected images

**Concept.** Affected (chapter 1) works on image tasks too: a change rebuilds the images whose inputs it touches, and
no other.

```bash
D() { moon query affected | jq -c '[.tasks | keys[] | select(test(":docker-"))]'; }

echo "# tour"  >> mcp/server.py;                                             D; git checkout -- mcp
echo "// tour" >> backend/internal/mysqlproxy/proxy.go;                      D; git checkout -- backend
echo "// tour" >> backend/internal/types/case.go;                            D; git checkout -- backend
echo "-- tour" >> etl/radiant/dags/sql/radiant/init/germline_snv_occurrence_create_table.sql; D; git checkout -- etl
echo "# tour"  >> backend/docs/swagger.yaml;                                 D; git checkout -- backend
```

Expected:

| Change | Images rebuilt | Today |
|---|---|---|
| MCP code | `mcp:docker-mcp` | the MCP image |
| the MySQL proxy package | `backend:docker-mysql-gateway`, `backend:docker-mysql-proxy` | the 5 backend images |
| `internal/types` (shared by 4 binaries) | `docker-api`, `docker-mysql-gateway`, `docker-toolbox`, `docker-worker` | the 5 backend images |
| an ETL DDL file | `etl:docker-operator` (the only image that copies `radiant/`) | the 3 ETL images |
| `swagger.yaml` alone | none: the spec is not in any image. Once the clients are regenerated (chapter 2, step 5), the MCP and UI images are | — |

## Step 3: bootstrap, the first complete image set

**Concept.** On `main`, every commit must have a **complete image set**: one tag `sha-<commit>` on each of the 10
images, so any commit can be deployed or released as a whole. The very first time, every image has to be built:
`publish.sh --all` (the same command as the weekly rebuild that picks up base-image fixes).

```bash
scripts/publish.sh --all                                  # 4 to 10 min: Docker pulls the base images the first time
curl -s localhost:5002/v2/_catalog | jq -c .              # the 10 images
scripts/tags.sh radiant-mcp                               # sha-<short>, <sha>-<ts>, latest: one digest
```

`publish.sh` builds through moon (`moon run <targets>` with `PUSH=1`), so the images' `deps` run first: the tests,
from the cache when they already passed. It then scans the pushed images with Trivy (step 5 explains the scan).

## Step 4: a merge to `main`

**Concept.** On each merge, `publish.sh <before> <after>` builds and pushes the **affected** images, with the three
tags. Every other image gets only `sha-<new commit>`, a **registry-side retag** of `sha-<previous commit>`: same
digest, nothing rebuilt, and no `<sha>-<ts>` tag, so the Flux policy ignores it and QA does not redeploy it. Every
commit keeps a complete set; QA only redeploys what changed.

Simulate the merge of an MCP change:

```bash
base=$(git rev-parse --short HEAD)
git switch -c tour/demo-merge
echo "# tour $(date +%s)" >> mcp/server.py
git -c user.name=tour -c user.email=tour@localhost commit --no-verify -qam "feat(mcp): a tour change"
scripts/publish.sh $base HEAD
```

Expected, in ~15 s: `== build (1 images)` then `built`/`pushed` for `radiant-mcp`, Trivy on it, and 9 lines
`retag  <image>  sha-<base> -> sha-<head>`.

```bash
scripts/tags.sh radiant-mcp                               # 2 digests: the new build, and the bootstrap one
scripts/tags.sh radiant-api                               # 1 digest: sha-<base> and sha-<head> are the same image
scripts/flux-check.sh                                     # what QA Flux would deploy: only radiant-mcp has a new timestamp
```

`flux-check.sh` applies the QA ImagePolicy to the registry's tags: for each image, the `<sha>-<ts>` tag with the
highest timestamp. Only `radiant-mcp` points at the new commit; the others still point at the bootstrap.

Two details of `.github/workflows/publish.yml` that matter: `concurrency: publish` (one run at a time, or a slower
run could push an older commit with a later timestamp, and Flux would deploy it), and the weekly `--all` (an image
that never changes would otherwise never get its base image's security fixes).

Keep the branch for the next two steps.

## Step 5: Trivy on the images a PR builds

**Concept.** Today the scanned image is a separate `:ci` build, and a CRITICAL CVE does not block anything. Here a PR
builds its affected images (without pushing) and scans **those**: it fails on a CRITICAL that has a fix. On `main`,
`publish.sh` scans the pushed images (the retagged ones have the same digest: already scanned). A daily job scans the
images QA runs, without building, for CVEs published since.

```bash
scripts/pr-check.sh $base                                 # config scan, build radiant-mcp (no push), scan it
ls .trivy/ | grep mcp                                     # radiant-mcp-{os,library}.{json,sarif}: what upload-sarif would send
```

Expected: `config  0 HIGH/CRITICAL misconfigurations` (the Dockerfiles), `built` for `radiant-mcp`, then
`trivy  radiant-mcp  os  CRITICAL=0 HIGH=0` and the same for `library`, exit code 0. With a fixable CRITICAL, the
script prints `fixable CRITICAL found` and exits 1: the PR is red. The settings are the three repos' current ones
(HIGH and CRITICAL, unfixed ignored, OS and library packages apart), per image in the task's `env`
(`TRIVY_LIBRARY_SEVERITY`, `TRIVY_IGNOREFILE`), read by `scripts/images.sh`.

Trivy already ran at step 3 (the bootstrap scans what it pushes): `radiant-dbt` and `radiant-task-operator` show
`HIGH=2` on OS packages. HIGH is reported, not blocking; only a fixable CRITICAL fails a PR.

## Step 6: one product release

**Concept.** A release is **one version for the whole product**: `v1.1.0` is put on all 10 images at once. It is a
**retag** of the image set of the release commit, the very digests QA has been running: nothing is rebuilt, so what
goes to production is what was tested.

The version comes from release-please, configured once at the root (`release-please-config.json`, one package `.`,
`.release-please-manifest.json` holds the current version). It reads the Conventional Commits since the last release:
`fix:` gives a patch, `feat:` a minor, `!` or `BREAKING CHANGE:` a major. Our demo commit is `feat(mcp): ...`, so
release-please would open the PR "release 1.1.0"; merging it runs the `promote` job:

```bash
cat release-please-config.json | jq '.packages'
cat .release-please-manifest.json                         # {".": "1.0.0"}
scripts/promote.sh HEAD 1.1.0                             # 10 lines: <image>  sha-<head> -> v1.1.0
scripts/tags.sh radiant-api                               # v1.1.0 and 1.1.0: the same digest as sha-<base>, built at step 3
scripts/tags.sh radiant-mcp                               # v1.1.0: the digest built at step 4
```

`radiant-api` 1.1.0 is the image built at the bootstrap: the release shipped it without rebuilding, because nothing
it contains changed. Production deploys `v1.1.0` of every image: a version names a whole, tested set.

Clean up:

```bash
git switch poc/monorepo-03-images-release
git branch -D tour/demo-merge
git status --short                                        # nothing
docker rm -f radiant-tour-registry                        # optional: the registry and its images
```

## What to remember

- An image is a moon task: inputs = what its Dockerfile copies; a change rebuilds only the images it touches.
- Every `main` commit has a complete image set: affected images are built (and redeployed in QA), the others are
  retagged registry-side, same digest, untouched in QA.
- A PR scans the images it builds and fails on a fixable CRITICAL; `main` scans what it pushes; a daily job scans what
  QA runs.
- One product version: a release retags the tested image set of a commit, no rebuild. Chapter 4 uses that version to
  decide when a data contract can change.

## Glossary

| Concept | What it is | Where |
|---|---|---|
| **image task** | A `docker-*` moon task, tag `docker`: builds (and with `PUSH=1` pushes) one image. Inputs = the files its Dockerfile copies. | `*/moon.yml`, `scripts/docker.sh` |
| **task tag** | A label on tasks (`tags: ['docker']`) to select them: `moon query tasks 'taskTag=docker'`. | `scripts/images.sh` |
| **complete image set** | Every image has a tag `sha-<commit>` for every `main` commit, built or retagged. | `scripts/publish.sh` |
| **registry-side retag** | A new tag on an existing manifest (`docker buildx imagetools create`): no pull, no build, same digest. | `publish.sh`, `promote.sh` |
| **digest** | The hash of an image's manifest. Two tags with the same digest are the same image, byte for byte. | `scripts/tags.sh` |
| **Flux ImagePolicy** | The QA rule that picks the tag to deploy: tags `<sha>-<ts>`, highest `ts`. Only built images get such a tag. | `qlin-qa-infra/kubernetes-manifests/fluxcd/`, `scripts/flux-check.sh` |
| **Conventional Commits** | `type(scope)!: message`. release-please derives the next version from the types since the last release. | PR titles (squash merge) |
| **product release** | One version `v<x.y.z>` for the whole repo, put on all 10 images by `promote.sh`. | `release-please-config.json`, `publish.yml` |

Next: `poc/monorepo-04-contracts` replaces the MCP tests that parse the other modules' code with data contracts, and
uses the product version to decide when a column can be removed.
