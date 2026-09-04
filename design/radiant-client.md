# Plan: `radiant-client` CLI (ferload-client replacement) + `GET /config`

## Context

QLIN users download sequencing files with the Scala `ferload-client` CLI (`configure` + `download -m manifest.tsv`), backed by the `ferload` server. Radiant replaces ferload: documents already have presigned download URLs in radiant-api. Goal: a Go CLI in `radiant-portal/backend/cmd/radiant-client` with the same two commands, Keycloak **device flow** (public client, no secret), downloads via the existing per-document `download_url` endpoint, plus a public `GET /config` on radiant-api so `configure` needs only the API URL. Binaries for linux/mac/windows attached to GitHub releases. Keycloak public client provisioned in localstack (realm JSON) and QA (`qlin-qa-infra` terraform). Analysis doc for the team in French.

Decisions taken with Yann: binary name `radiant-client`, Keycloak client id `radiant-client-cli` (renamed after team feedback); reuse `GET /:tenant/documents/:id/download_url` (no bulk endpoint); manifest = TSV `tenant`, `document_id` required, `name`, `size` optional; release on the same `v*` tags as docker images.

Spec source: brainstorm notes with the tech lead (not in the repo).

## Reference behaviour (Scala CLI, device method) to keep

- `configure`: prompt API URL (prefilled), `GET /config` (public), store auth settings. `--reset` wipes config.
- `download`: mkdir output + writable check; token reuse (local `exp` check, 15s slack) then refresh grant then device flow (print `verification_uri_complete` + `user_code`, poll `/token` with `urn:ietf:params:oauth:grant-type:device_code`, tolerate `authorization_pending`/`slow_down`, give up at `expires_in`); TSV header row, tab, trim, skip empty rows, size accepts `123` or `123 MB`; size estimate from manifest else `Content-Length` HEAD per URL with 60s total timeout (failure = warn, show `-`); disk usable space of output dir; prompt `total X, available Y, continue? [yes]` (blank/`y`/`yes` accept); hard fail if space < total; pool of 10 workers; per-file progress; `Total downloaded files: N located here: <abs path>`.
- Scala gaps we fix: no retry, no resume (`--resume`: skip complete files by size, HTTP Range on partial `.part`), `--yes` for scripting, pool size as a flag (Scala: fixed 10, ours default 4), presign and download in the same worker job (Scala presigned everything upfront in one batch, then downloaded), JSON config in the OS config dir instead of `~/.ferload-client.properties`. Not doing: checksum (hash algo unknown), manifest by id / report API, email of manifest (other ticket).

## Part A: radiant-api, public `GET /config`

Files (backend = `services/radiant-portal/backend`):

1. `internal/types/client_config.go`
   ```go
   type ClientConfig struct {
       Auth ClientAuthConfig `json:"auth" validate:"required"`
   } // @name ClientConfig
   type ClientAuthConfig struct {
       Method      string `json:"method" validate:"required"`       // "device"
       KeycloakURL string `json:"keycloak_url" validate:"required"` // base URL, no /realms
       Realm       string `json:"realm" validate:"required"`
       ClientID    string `json:"client_id" validate:"required"`
   }
   ```
   Manifest columns are the CLI's own knowledge (required `tenant`, `document_id`; optional `name`, `size`), not served by the API.
2. `internal/server/handlers_config.go`: `ClientConfigFromEnv() types.ClientConfig` reading `KEYCLOAK_HOST` (same base-URL format gin-keycloak uses in `internal/authorization/keycloak.go`; a separate public-URL variable was dropped in review, every deployment exposes the public URL there), `KEYCLOAK_REALM`, `KEYCLOAK_CLI_CLIENT_ID` (default `radiant-client-cli`); `GetClientConfigHandler(cfg types.ClientConfig) gin.HandlerFunc` with swaggo block (`@Tags config`, `@Router /config [get]`, no `@Security`), mirroring `StatusHandler` in `internal/server/handlers.go:16-32`. Use `utils.GetEnvOrDefault` (`internal/utils/env.go`).
   Tests `handlers_config_test.go`: `Test_ClientConfigFromEnv_Defaults`, `Test_ClientConfigFromEnv_PublicURLOverridesHost`, `Test_GetClientConfigHandler_Success` (`assert.JSONEq`).
3. `cmd/api/main.go`: register `r.GET("/config", ...)` next to `/status` (line ~105), outside `privateRoutes`. Route audit test only scans `/:tenant` routes, no registry change. Add `/config` to the no-auth check in `cmd/api/integration_test.go` beside the `/status` case (200 without token).
4. `GET /:tenant/documents/:id/download_url` stays as is (`{url, expires_at}`). Team feedback: size comes from `Content-Length` and the name from the manifest or the URL, so no enrichment, and `hash` is not needed. `/config` is the only backend change.
5. `make doc` then root `make generate-client-typescript` (commit regenerated `docs/swagger.*` + `frontend/api`). Postman: add `Config > Get client config` to `postman/RADIANT-API.postman_collection.json`.
6. `backend/CLAUDE.md`: add `/config` to public routes, `KEYCLOAK_CLI_CLIENT_ID` to config table, `cmd/radiant-client` + `internal/cli` to layout. Also fix the stale `GET /metrics` claim while there (verified absent).

## Part B: CLI

Deps added to shared `backend/go.mod`: `github.com/spf13/cobra`, `github.com/vbauerster/mpb/v8`. `golang.org/x/sys` already indirect, `golang.org/x/term` direct, `golang-jwt/jwt/v5` direct.

**Binary footprint rule**: `cmd/radiant-client` and `internal/cli/*` import nothing from `internal/types` (pulls gorm), `internal/utils` (pulls gin, gin-keycloak, aws-sdk-go) or `internal/client` (pulls `internal/types`). The linker only includes the import graph of the `main`, so the CLI stays stdlib + cobra + mpb + x/sys + x/term + jwt. The CLI owns its two small DTOs; a contract test in `internal/server` (`Test_ClientConfig_MatchesCLIContract`) marshals `types.ClientConfig` and decodes it into the CLI DTO so the shapes cannot drift. Verify with `go version -m bin/radiant-client/radiant-client` (dep list) after the first build.

### B1 `cmd/radiant-client/` (thin, cobra only)
- `main.go`: package doc usage block (convention of `cmd/create-user/main.go`), `var version, commit, date = "dev","none","unknown"`, `rootCmd` with `Version: fmt.Sprintf("%s (commit %s, built %s)", version, commit, date)`, `SilenceUsage: true`, persistent `--config` flag. No `godotenv/autoload` (end-user binary).
- `configure_cmd.go`: flags `-u/--api-url`, `--reset`. Prompt URL if flag absent (default = stored). `GET /config`, store `api_url` + `auth`, drop tokens. Print config path.
- `download_cmd.go`: flags `-m/--manifest` (required), `-o/--output` (default `.`), `-t/--threads` (default 4, size of the worker pool used for both presign calls and downloads), `-y/--yes`, `--resume`, `--skip-missing`. Flow below.
- Pattern: one `<name>_cmd.go`, `init()` does `rootCmd.AddCommand`, flags bound in constructor to local vars.

### B2 `internal/cli/config`
`Config{APIURL, Auth types.ClientAuthConfig, Tokens{AccessToken, RefreshToken}}` stored as **JSON** (not the ferload `.properties`) at `RADIANT_CLIENT_CONFIG` env or `os.UserConfigDir()/radiant-client/config.json`. `os.UserConfigDir()` resolves per OS: Linux `$XDG_CONFIG_HOME` or `~/.config`, macOS `~/Library/Application Support`, Windows `%AppData%` (`C:\Users\<user>\AppData\Roaming`). `Load` (missing file = zero config), `Save` (MkdirAll 0700, temp+rename, chmod 0600), `Validate`.
Tests: `Test_Load_MissingFile`, `Test_SaveLoad_RoundTrip`, `Test_Save_FileMode0600` (skip windows), `Test_Validate_MissingAPIURL`, `Test_DefaultPath_EnvOverride`.

### B3 `internal/cli/keycloak` (same http style as `internal/client/keycloak_password.go`, but not in that package: it imports `internal/types`)
```go
type Config struct{ BaseURL, Realm, ClientID string }
type KeycloakDeviceClient struct{ cfg Config; httpClient *http.Client; sleep func(time.Duration) }
type DeviceAuth struct{ DeviceCode, UserCode, VerificationURI, VerificationURIComplete string; ExpiresIn, Interval int }
type Tokens struct{ AccessToken, RefreshToken string }
func (c *KeycloakDeviceClient) StartDeviceAuth(ctx) (*DeviceAuth, error)   // POST .../auth/device, client_id, scope=openid
func (c *KeycloakDeviceClient) PollDeviceToken(ctx, *DeviceAuth) (*Tokens, error) // pending: wait; slow_down: interval+5; expired_token/access_denied: error
func (c *KeycloakDeviceClient) Refresh(ctx, refreshToken string) (*Tokens, error)
func AccessTokenValid(token string, now time.Time, slack time.Duration) bool // jwt ParseUnverified exp
```
Tests with `httptest` + injected `sleep`: `Test_StartDeviceAuth_Success`, `Test_PollDeviceToken_PendingThenSuccess`, `Test_PollDeviceToken_SlowDownIncreasesInterval`, `Test_PollDeviceToken_ExpiredToken`, `Test_PollDeviceToken_AccessDenied`, `Test_Refresh_InvalidGrant`, `Test_AccessTokenValid_ExpiredWithinSlack`, `Test_AccessTokenValid_Malformed`.

### B4 `internal/cli/api` (radiant-api client)
`Client{BaseURL, HTTP, Token func(ctx)(string,error)}`; own DTOs `ClientConfig{Auth{Method, KeycloakURL, Realm, ClientID}}` and `PreSignedURL{URL, ExpiresAt}` (json tags identical to the server types, no import of `internal/types`/`internal/utils`, see footprint rule); `GetConfig(ctx) (*ClientConfig, error)` (no auth); `DownloadURL(ctx, tenant string, id int) (*PreSignedURL, error)` hitting `GET /{tenant}/documents/{id}/download_url`, mapping 401/403/404 to typed errors (`ErrUnauthorized`, `ErrForbidden`, `ErrNotFound`).
Tests: `Test_GetConfig_Success`, `Test_DownloadURL_Success`, `Test_DownloadURL_NotFound`, `Test_DownloadURL_Forbidden`, `Test_DownloadURL_SendsBearer`.

### B5 `internal/cli/manifest`
`Entry{Tenant string; DocumentID int; Name string; Size int64}`; package-level `RequiredColumns = []string{"tenant","document_id"}`, `OptionalColumns = []string{"name","size"}`; `Parse(r io.Reader) ([]Entry, error)` with `encoding/csv` `Comma='\t'`, `LazyQuotes`, `TrimLeadingSpace`, header required, case-insensitive columns, skip rows with empty tenant/id; `ParseSize(s) (int64, error)` for `123`, `123 MB`, `1.5 GB` (SI + IEC), empty = 0.
Tests: `Test_Parse_RequiredColumnsOnly`, `Test_Parse_MissingRequiredColumn`, `Test_Parse_SkipsEmptyRows`, `Test_Parse_TrimsCells`, `Test_Parse_InvalidDocumentID`, `Test_ParseSize_Plain`, `Test_ParseSize_WithUnit`, `Test_ParseSize_Unknown`, `Test_ParseSize_Empty`.

### B6 `internal/cli/diskspace` + `internal/cli/prompt`
- `Available(path) (uint64, error)`: `diskspace_unix.go` (`//go:build !windows`, `unix.Statfs`, `Bavail*Bsize`), `diskspace_windows.go` (`windows.GetDiskFreeSpaceEx`). Tests: `Test_Available_TempDir_Positive`, `Test_Available_MissingPath_Error`.
- `prompt.Confirm(in io.Reader, out io.Writer, msg string) (bool, error)` (blank/`y`/`yes` accept), `prompt.Line(in, out, msg, def string)`, `HumanBytes(int64) string`. Tests: `Test_Confirm_BlankAccepts`, `Test_Confirm_NoRejects`, `Test_HumanBytes_*`.

### B7 `internal/cli/pool` + `internal/cli/download`
`pool`: one generic custom worker pool; each job is one document, presign then download in the same worker:
```go
func Run[T any](ctx context.Context, workers int, jobs []T, fn func(ctx context.Context, job T) error) []error // buffered channel + sync.WaitGroup, ctx-aware, collects per-job errors in input order
```
Tests: `Test_Run_AllJobsExecuted`, `Test_Run_RespectsWorkerCount` (atomic max-concurrent), `Test_Run_ContextCancelledStopsEarly`, `Test_Run_ErrorsKeepOrder`, `Test_Run_ZeroWorkersDefaultsToOne`.

`download`:
```go
type Item struct{ Name string; Size int64; Presign func(ctx) (string, error) } // Name/Size from manifest (Size 0 = unknown); Presign = api.DownloadURL closure
type Options struct{ OutDir string; Threads int; Resume bool; Retries int; HTTP *http.Client; Progress io.Writer }
type Result struct{ Downloaded, Resumed, Skipped, Failed int; NotFound, Forbidden []string; Errors []error }
func Run(ctx, items []Item, opts Options) Result // via pool, opts.Threads workers, one job = presign + GET
```
One job per document: call `Presign` (the `download_url` request), then GET the URL immediately. The presigned URL is consumed seconds after being minted, so the 60 min `S3_PRESIGNED_URL_EXPIRE` never matters and no refresh logic exists. Name = manifest `name`, else `Content-Disposition` filename if the object carries one, else URL-decoded `path.Base` of the URL path. Size for the progress bar = manifest `size`, else `Content-Length` of the response.
Plain `net/http` GET, no S3 client lib: `aws-sdk-go` v1 `s3manager.Downloader` (ranged parallel parts) needs bucket/key + AWS credentials, no presigned URL input; minio-go same. The Java `TransferManager.PresignedUrlDownloadRequest` the Scala CLI used has no Go equivalent. Presigned SigV4 URLs sign only the host header, so `Range` requests are allowed.

Per file, default mode (ferload behaviour): always download to `<name>.part` through mpb `ProxyReader`, rename over target on success (Windows: `os.Remove` target first).
`--resume` mode, stateless, decided from what is on disk, before presigning (a skipped file costs zero API calls):
- target exists (a target only exists after a successful rename, so it is complete): skip (`Skipped`); if the manifest gives a size and it differs, re-download.
- `<name>.part` exists: `Range: bytes=<partSize>-`, expect 206 and append (`Resumed`); 200 means Range ignored: truncate and restart; 416 means the part is already complete: rename.
No downloaded-files cache in the config dir: disk state is the truth, a cache goes stale the moment the user deletes or moves a file.
Retries: net error/5xx/429 with backoff 0.5s/1s/2s, ctx-aware, each retry re-presigns and resumes from current `.part` length. `Presign` 404/403 are recorded in `NotFound`/`Forbidden` (not retried, not counted as `Failed` when `--skip-missing`). On failure keep `.part` when `Resume`, remove otherwise. mpb: overall bar + per-file bars `BarRemoveOnComplete`; non-TTY (`term.IsTerminal`) = `mpb.WithOutput(io.Discard)` + one log line per file.
Tests (httptest + `t.TempDir()`): `Test_Run_DownloadsAllFiles`, `Test_Run_DefaultOverwritesExisting`, `Test_Run_Resume_SkipsExistingSameSize`, `Test_Run_Resume_RedownloadsSizeMismatch`, `Test_Run_Resume_AppendsPartWithRange206`, `Test_Run_Resume_RestartsWhenRangeUnsupported`, `Test_Run_Resume_SkipsWithoutPresign` (presign counter stays 0), `Test_Run_RetriesOn503_RepresignsEachAttempt`, `Test_Run_PresignNotFound_RecordedNotRetried`, `Test_Run_NameFromContentDisposition`, `Test_Run_NameFromURLPath`, `Test_Run_RespectsThreads`, `Test_Run_ContextCancelled`, `Test_Run_PartFileRemovedOnFailure`, `Test_Run_Resume_PartFileKeptOnFailure`.

### B8 `download` command flow
1. Load + validate config (error tells to run `configure`).
2. Mkdir output, writable probe.
3. Ensure token: valid by `exp` (15s slack) → else `Refresh` → else device flow (print `verification_uri_complete` + `user_code`, poll). Persist tokens.
4. Parse manifest.
5. Total size = sum of manifest `size`, 100% manifest based, no network call. Rows without size are counted and shown (`total >= X, N fichiers sans taille`). With `--resume`, files already complete on disk are excluded from the total.
6. `diskspace.Available`; hard fail if insufficient (on the known total); confirm unless `--yes`.
7. `download.Run` (`threads` workers, default 4): each job presigns via `api.DownloadURL` then downloads. On the first 401 the run aborts, tokens are wiped, user asked to rerun. `NotFound`/`Forbidden` are listed at the end; exit 1 unless `--skip-missing`.
8. Print `Total downloaded files: N (resumed R, skipped S, failed F) located here: <abs>`; exit 1 if F>0.
Tests: `Test_Configure_WritesConfig`, `Test_Download_MissingConfig_Error`, `Test_Download_HappyPath_Yes` (httptest for API + file server, pre-seeded valid token).

## Part C: build, image, release

All build logic lives in `backend/Makefile`; the workflow only calls make targets.

- `backend/Makefile` additions:
  ```make
  CLI_NAME=radiant-client
  VERSION?=$(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
  COMMIT?=$(shell git rev-parse --short HEAD 2>/dev/null || echo none)
  DATE?=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
  CLI_LDFLAGS="-s -w -X main.version=$(VERSION) -X main.commit=$(COMMIT) -X main.date=$(DATE)"
  CLI_PLATFORMS=linux/amd64 linux/arm64 darwin/amd64 darwin/arm64 windows/amd64

  build-cli:            # local: version = git describe (tag, or <sha>-dirty, or dev)
  	CGO_ENABLED=0 go build -trimpath -ldflags=$(CLI_LDFLAGS) -o bin/$(CLI_NAME)/ ./cmd/$(CLI_NAME)/

  build-cli-all:        # cross-compile matrix, archives in dist/ + checksums.txt
  	rm -rf dist && mkdir -p dist
  	for p in $(CLI_PLATFORMS); do os=$${p%/*}; arch=$${p#*/}; ext=$$([ $$os = windows ] && echo .exe); \
  	  CGO_ENABLED=0 GOOS=$$os GOARCH=$$arch go build -trimpath -ldflags=$(CLI_LDFLAGS) -o dist/$$os-$$arch/$(CLI_NAME)$$ext ./cmd/$(CLI_NAME)/ || exit 1; \
  	  if [ $$os = windows ]; then (cd dist && zip -qj $(CLI_NAME)-$$os-$$arch.zip $$os-$$arch/$(CLI_NAME)$$ext); \
  	  else (cd dist && tar -czf $(CLI_NAME)-$$os-$$arch.tar.gz -C $$os-$$arch $(CLI_NAME)); fi; \
  	  rm -rf dist/$$os-$$arch; done
  	cd dist && sha256sum *.tar.gz *.zip > checksums.txt

  test-cli:
  	go test ./cmd/$(CLI_NAME)/... ./internal/cli/... ./internal/client/... -count=1
  ```
  `--version` prints `v1.4.0 (commit abc1234, built 2026-09-02T...)` on a tag build, `dev (commit none, built ...)` with no git. Fix `clean` to remove `bin/ dist/`.
- `backend/toolbox.Dockerfile`: build + copy `radiant-client` (fourth binary), pass `--build-arg VERSION` through to ldflags so the image binary reports the tag too.
- `.github/workflows/test-and-release-cli.yml` (repo root), two jobs:
  ```yaml
  name: Test and Release radiant-client
  on:
    push:
      tags: ['v*.*.*']
  permissions:
    contents: write
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-go@v5
          with: { go-version-file: backend/go.mod, cache-dependency-path: backend/go.sum }
        - run: make -C backend test-cli
    release:
      needs: test
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          with: { fetch-depth: 0 }        # git describe needs the tags
        - uses: actions/setup-go@v5
          with: { go-version-file: backend/go.mod, cache-dependency-path: backend/go.sum }
        - run: make -C backend build-cli-all
        - uses: softprops/action-gh-release@v2
          with:
            files: backend/dist/*
            generate_release_notes: true
  ```
  Release assets: `radiant-client-{linux,darwin}-{amd64,arm64}.tar.gz`, `radiant-client-windows-amd64.zip`, `checksums.txt`. Same `v*` tags already drive `build_and_push.yml` (docker images); this workflow adds the binaries to the GitHub release for that tag.
- `backend.yml` (PR CI): add `make -C backend test-cli` and a `GOOS=windows GOARCH=amd64 go build ./cmd/radiant-client/` step to catch build-tag regressions before a tag.

## Part D: clin-localstack (separate repo, separate commit)

1. `configs/keycloak/init/radiant-realm.json`: add client
   ```json
   {"clientId":"radiant-client-cli","enabled":true,"publicClient":true,"protocol":"openid-connect",
    "standardFlowEnabled":false,"directAccessGrantsEnabled":false,"serviceAccountsEnabled":false,
    "attributes":{"oauth2.device.authorization.grant.enabled":"true","oauth2.device.polling.interval":"5"},
    "protocolMappers":[{"name":"radiant-audience","protocol":"openid-connect","protocolMapper":"oidc-audience-mapper",
      "config":{"included.client.audience":"radiant","access.token.claim":"true","id.token.claim":"false"}}]}
   ```
   Realm import runs only on first boot: re-import needs realm delete or keycloak DB wipe (documented in `localstack-integration.md`). Default client id matches, so no env change in `configs/radiant-portal/.env`; `KEYCLOAK_HOST` is `http://keycloak:8081`, reachable from the host via `/etc/hosts`, so no `KEYCLOAK_PUBLIC_URL` needed locally.
2. `project-tasks/radiant-migration/radiant-client-cli.md` (French, team analysis doc): contexte, décisions du brainstorm, architecture (device flow, `/config`, `download_url`), format manifeste, config Keycloak (client public + mapper audience, à reproduire sur QA par l'infra), fonctionnalités cachées du CLI Scala et leur sort (espace disque, confirmation, concurrence, retry, skip), risques ouverts, hors périmètre (envoi manifeste par email, bulk presign, checksum). Add pointer in `clin-localstack/CLAUDE.md` radiant list.

## Part E: qlin-qa-infra (QA, separate repo, separate PR)

QA realm is `qlin` (not `radiant`), managed 100% by the terraform keycloak provider in `terraform/keycloak_config/`, applied every 5 min by the in-cluster `terracd` CronJob (`kubernetes-manifests/apps/keycloak-configuration/`). Device grant is already on for the `radiant` client (`clients.tf:28`) but that client is CONFIDENTIAL: device flow on it needs the secret, unusable for a distributed CLI. Need a new PUBLIC client.

1. `terraform/keycloak_config/clients.tf`: new `keycloak_openid_client.radiant_client`, modeled on the public `radiant-mcp-agent` block (`:59-114`), no secret, no Secrets Manager entry:
   ```hcl
   # Public client for the radiant-client CLI: device authorization grant only, no secret
   # (binary is distributed to end users). Audience mapper stamps aud=radiant like the other clients.
   resource "keycloak_openid_client" "radiant_client" {
     realm_id  = keycloak_realm.qlin.id
     client_id = "radiant-client-cli"
     name      = "radiant-client CLI"

     enabled                                   = true
     access_type                               = "PUBLIC"
     standard_flow_enabled                     = false
     implicit_flow_enabled                     = false
     direct_access_grants_enabled              = false
     service_accounts_enabled                  = false
     oauth2_device_authorization_grant_enabled = true
     full_scope_allowed                        = true
   }

   resource "keycloak_openid_audience_protocol_mapper" "radiant_client_audience" {
     realm_id                 = keycloak_realm.qlin.id
     client_id                = keycloak_openid_client.radiant_client.id
     name                     = "radiant-audience"
     included_custom_audience = "radiant"
     add_to_id_token          = false
     add_to_access_token      = true
   }
   ```
   Optional realm-level tuning if defaults bite: `keycloak_realm.qlin` `oauth2_device_code_lifespan` (default 600s) / `oauth2_device_polling_interval` (default 5s).
2. `kubernetes-manifests/apps/radiant-api/deployment.yaml` `env:` block (`:98-182`): add `KEYCLOAK_CLI_CLIENT_ID: radiant-client-cli` (explicit, even though it is the code default). `KEYCLOAK_HOST` is already the public `https://auth.dev.qlin.aws.sante.quebec`. `S3_PRESIGNED_URL_EXPIRE` unset there (60m default), fine.
3. Flux reconciles both within minutes after merge to `main`; no manual apply. Commit style there: `feat: SJRA-xxxx <desc>`.
4. Check IAM: `terraform/radiant_api/policies/radiant-api.json` grants `s3:GetObject` only on nextflow buckets; presign of a document in another bucket would sign but 403 at download. Verify document URLs point to covered buckets.
5. QA end-to-end: `radiant-client configure -u https://api.dev.qlin.aws.sante.quebec`, browser on `https://auth.dev.qlin.aws.sante.quebec/realms/qlin/device`, user needs `can_download_file` on the QA tenant. VPN required (internal ALB).

## Verification

```bash
cd backend && go build ./... && GOOS=windows GOARCH=amd64 go build ./cmd/radiant-client/ && GOOS=darwin GOARCH=arm64 go build ./cmd/radiant-client/
make test && make fmt && make lint && make doc
cd .. && make generate-client-typescript && git status --short
cd backend && make build-cli && ./bin/radiant-client/radiant-client --version && make build-cli-all && ls dist
```
End-to-end on localstack (`make start_radiant`, Keycloak realm re-imported with the new client; user must hold `can_download_file` on tenant `qlin`, check `seed-complement.sql` roles, grant via `cmd/create-user -grant` if needed):
```bash
curl -s http://localhost:8090/config | jq .
./bin/radiant-client/radiant-client configure -u http://localhost:8090
printf 'tenant\tdocument_id\tname\tsize\nqlin\t<id>\t\t\n' > tmp/radiant-client/manifest.tsv
./bin/radiant-client/radiant-client download -m tmp/radiant-client/manifest.tsv -o tmp/radiant-client/out   # browser device login
./bin/radiant-client/radiant-client download -m tmp/radiant-client/manifest.tsv -o tmp/radiant-client/out            # re-downloads everything, token reused
./bin/radiant-client/radiant-client download -m tmp/radiant-client/manifest.tsv -o tmp/radiant-client/out --resume   # all skipped
truncate -s 1000 tmp/radiant-client/out/<file>.part   # fake crash, then --resume again: Range 206, file completes
```

## Risks / notes

- Backend verifies no `aud` on inbound JWTs (`internal/authorization/keycloak.go`): audience mapper is hygiene, not enforcement. Follow-up ticket if wanted.
- Presigned URL TTL (`S3_PRESIGNED_URL_EXPIRE`, 60m): irrelevant, each URL is consumed right after being minted inside the same worker job.
- Size estimate is only as good as the manifest: rows without `size` are excluded from the disk-space gate. The manifest producer should always fill `size`.
- Tokens on disk in cleartext (0600), same as Scala. OS keyring = later.
- Shared `go.mod` grows (cobra, mpb); CI `go mod tidy` diff check must stay clean.
- Commits per the `/git` skill: `<type>: CLIN-XXXX <desc>`, one line, English. radiant-portal's commitlint enforces conventional type; confirm at implementation time that a `CLIN-` key passes (precedent: `feat/clin-6117` branch). Never committed or pushed by Claude.
- Localstack: `clin-system` etc. untouched; new client only. QA: existing `radiant` client keeps its device grant (SJRA-749), untouched.

## Branches and PRs (4 PRs, 3 repos)

| Order | Repo | Branch | Ticket | Content |
|---|---|---|---|---|
| 1 | qlin-qa-infra | `feat/clin-6197` | CLIN-6197 | Part E: public Keycloak client + audience mapper, `KEYCLOAK_CLI_CLIENT_ID` on radiant-api Deployment |
| 2 | radiant-portal | `feat/clin-6198` | CLIN-6198 | Part A: `GET /config` endpoint, swagger + TS client regen, Postman, backend CLAUDE.md. Small PR, reviewed first |
| 3 | radiant-portal | `feat/clin-6199` | CLIN-6199 | Parts B + C: CLI, Makefile targets, release workflow, toolbox image. Branched from `feat/clin-6198` until that one merges, then rebased on `main` |
| 4 | clin-localstack | `feat/clin-6201` | CLIN-6201 | Part D: `radiant-client` client in `radiant-realm.json`, analysis doc, CLAUDE.md pointer. Needed to test locally, can be worked in parallel |

Submodule workflow: `cd services/radiant-portal` (standalone call) then bare `git` / `gh`; `pwd`-check atomically before any push or `gh pr create`. PR title + body rendered in chat and approved before `gh pr create`; radiant-portal PRs fill `.github/pull_request_template.md`.
