# Plan: lab notification in Radiant (manifest + email)

## Context

Radiant delivers files (`radiant-client`) but nothing tells a diagnostic lab (LDM) that a run is available yet. This feature adds that notification: one email per lab with the manifest of its files. Radiant is the system of record; QLIN is the **logic reference only** (manifest columns, grouping per lab, STAT subject) and will be unplugged in the coming months. QLIN today: the Scala job `LDMNotifier` (`clin-pipelines`, run by the Airflow `etl_notify` DAG) fetches a batch's FHIR Tasks, builds one TSV manifest per LDM (`url file_name file_type file_format hash ldm_sample_id patient_id service_request_id size`), emails it (`[STAT][RAPIDE] Nouvelles données du CQGC`, French HTML body linking the QLIN portal, BCC from config, recipients = FHIR Organization contact emails); users feed the manifest to `ferload-client`. Radiant has its own Airflow (`radiant-network/radiant-portal-pipeline`), which is where the new steps go.

Radiant owns file delivery (`radiant-client download -m manifest.tsv`, CLIN-6197..6201, merged on `origin/main`). The email/manifest producer was left out of that work. Spec source: team brainstorm notes (not in a repo). Team presentation 2026-09-14, feedback folded in on 2026-09-15 (see Decisions).

Deliverables: a French design page presented to the team, this file (EN, file-level plan), and `project-tasks/radiant-migration/manifest-notification.md` in clin-localstack (FR, decisions + localstack) with CLIN-6222. Jira epic CLIN-6220, stories CLIN-6222 to CLIN-6231.

## Decisions

| Topic | Decision |
|---|---|
| Where | radiant-api endpoint, **synchronous**; Airflow calls it. Not a worker batch type. |
| Grouping | One Postgres table `case_group`, PK `(tenant_code, name)`, **no surrogate id** (team 2026-09-15). `case_ids text` comma-joined, same convention as `interpretation_germline.classification_criterias` (DAO `string`, API `[]int`). Radiant's Airflow (`radiant-portal-pipeline`, DAG `nextflow_postprocessing_cases`) creates it from the case ids of a post-processing run right after `register_tasks`, then triggers notify. `clin-pipelines-dags` untouched. |
| Create / overwrite | `POST /{tenant}/case_groups` with `{name, case_ids}` (team 2026-09-15, was `PUT /{name}`). Same name in the tenant = **overwrite** (`ON CONFLICT (tenant_code, name) DO UPDATE`), so an Airflow retry is idempotent. `GET /{tenant}/case_groups/{name}` unchanged. |
| Recipients | **No `organization_contact` table, no contacts endpoints** (team 2026-09-15). New column `organization.notification_emails text` (comma-joined, nullable) on the existing table, exposed as `notification_emails []string` in the organization DTOs and editable through the existing `POST`/`PUT /{tenant}/organizations` (`can_manage_org`). One email per LDM = `cases.diagnosis_lab_code`; lab without emails → skipped, reported. Admin panel: the existing organization form gains the field (CLIN-6231). `organization` is federated to StarRocks; a `text` column federates fine and holds no PII. |
| No journal, stateless | No `case_group_notification` table, no `dry_run`, no `force`. Notify sends what exists now; if Airflow runs the task twice, labs get the email twice. |
| Manifest columns | QLIN parity mapped to Radiant: `tenant document_id name size data_type format submitter_sample_id patient_id case_id`. `url` dropped (CLI presigns by id), `hash` dropped (S3 ETag, not a checksum). CLI: these 5 extra columns become known informational columns (no "ignored" warning). |
| Index files | `.crai` / `.tbi` included. `download_url` already serves them (`origin/main` `61020823b`, CLIN-6209, `Test_GetById_IndexFile`). Nothing to change. |
| Templates | **One template per tenant**: `NOTIFICATION_TEMPLATE_DIR/manifest_<tenant>.tmpl` (team 2026-09-15; no per-analysis-code template, no generic `manifest.tmpl`, **no embedded default**). Subject and body in the same file (`{{define "subject"}}` / `{{define "body"}}`). Loaded at boot: parse every `manifest_*.tmpl`; a parse error or a missing define is a **warning** (not fatal, team 2026-09-15), the file is skipped; `info` log with the count and names of templates loaded correctly; `warn` when the dir is unset or holds no template. At notify time, **no template for the tenant = the request fails** (500, `notification template missing for tenant <code>`), nothing is sent. Template data is the extension point: `HasStat`, `AnalysisCodes`, `Cases`, … Adding a variable = an API change only, templates use conditions (`{{if .HasStat}}`). `NOTIFICATION_TEMPLATE_DIR` is a volume mount today; an `s3://` path is a possible later extension of `LoadTemplates`, not now. A ConfigMap edit does not restart pods: qlin-qa-infra ships it through kustomize `configMapGenerator` (hash-suffixed name → rollout). |
| STAT / RAPIDE | Template data exposes `HasStat` (any case `priority_code = 'stat'`), `AnalysisCodes`, and the func `HasAnalysis "CODE"`; the QLIN `[STAT]`/`[RAPIDE]` prefixes live in `manifest_qlin.tmpl`. |
| Locale | None. One template per tenant, in the tenant's language. If a bilingual mail is wanted later, the template carries both languages in one message (Government of Canada style). |
| SMTP | `github.com/wneessen/go-mail`. Env read lazily (`SMTP_*`, `NOTIFICATION_CC/BCC`, `PORTAL_URL`, `NOTIFICATION_TIMEZONE`). Prod relay is plain port 25, so `SMTP_TLS=none` must be supported. |
| Gate | `can_ingest_data` (`data_manager` role) for the `case_groups` routes: caller is the pipeline service account. Org-scoped action, request names no org → `requireActionInTenant` (like the patient/sample/sequencing batches); routes listed in `expectedTenantActions` and `inTenantOrgActionRoutes` of `cmd/api/action_enforcement_integration_test.go`. |
| Read path | Postgres-direct (like interpretations / batch). `postgres.WithTenant(ctx)` is a no-op unless `TENANT_VIEWS_READ_ENABLED`, so every repo method takes `tenantCode` explicitly (precedent `AuthRepository.OrgsForDocument`). Nothing new is federated; `case_group` is Postgres-only. |
| Group name | Client-chosen, in the body of `POST /case_groups` and in the URL of `GET` / `notify`. Pipeline uses `postprocessing-<run_tag>` (`sanitize_run_tag(run_id)`, datetime-based, unique, stable across retries); manual DAG defaults to `manual-<run_tag>`. Becomes a filename and an SMTP header: `^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$`, 400 otherwise (`types.ValidateCaseGroupName`). |
| Notify response | 200 with the group `{name, tenant_code, case_ids}` (no id) and per-lab entries: `organization_code`, `recipients`, `case_count`, `document_count`, `status` (`sent`, `skipped_no_contact`, `skipped_no_documents`, `failed`), `error?`, plus **template context** (team 2026-09-15): `template` (file name used) and `context` (`has_stat`, `analysis_codes`, `case_ids`, `manifest_filename`). 404 unknown group; 400 bad name; 500 when the request fails before any send (settings, template missing for the tenant, DB reads). Partial failure stays 200. |
| Case → groups lookup (UI filter, CLIN-6229) | The URL filter goes group → cases: handler reads `case_group.case_ids` by name and injects `case_id in (...)` (precedent `caseIdFilter`, `handlers_cases.go`). No column on `cases`, a case can belong to several groups (re-runs). The reverse direction (groups of a case, if ever shown on the case page) is exact in Postgres without a `LIKE`: `WHERE tenant_code = ? AND string_to_array(case_ids, ',')::int[] @> ARRAY[?::int]`, served by the GIN expression index `case_group_case_ids_idx` (A1). `= ANY(...)` would be correct too but ignores the index; use `@>`. |

Open questions still for the team: trio with 2/3 members sequenced (second email later, same as QLIN per batch); `patient_id` = internal Radiant id, not MRN.

## Part A: radiant-portal backend (`services/radiant-portal/backend`, branch from `origin/main`)

Verified against `origin/main` `f7336967b`. Follow `.claude/skills/add-endpoint/SKILL.md` and `.claude/rules/universal.md` (test each step before the next).

### A1. Migration `scripts/init-sql/migrations/000033_add_case_group_and_organization_emails.up.sql` (CLIN-6223 + CLIN-6230)
`make migrate` creates `000033_todo.up/down.sql`; rename, delete the down file (repo keeps `.up.sql` only).
```sql
CREATE TABLE public.case_group (
    tenant_code varchar(50) NOT NULL REFERENCES public.tenant(code),
    name text NOT NULL,
    case_ids text NOT NULL,
    created_on timestamptz NOT NULL DEFAULT now(),
    created_by text,
    PRIMARY KEY (tenant_code, name));
-- Reverse lookup (groups of a case) stays an index probe as the table grows. Only `@>` on this exact
-- expression uses it; `= ANY(...)` does not.
CREATE INDEX case_group_case_ids_idx ON public.case_group USING GIN ((string_to_array(case_ids, ',')::int[]));

ALTER TABLE public.organization ADD COLUMN notification_emails text;
```
`case_ids` is comma-joined text (`"1187,1188,1192"`), the `interpretation_*.classification_criterias` convention: no FK to `cases`, existence validated at POST time. `created_by` = Keycloak `sub`. `notification_emails` comma-joined, `NULL` = no distribution list. Federation: `organization` is in `types.ViewTables`, the new column appears in the per-tenant views automatically (`FederatableColumns` reads `information_schema`); `cmd/refresh-tenants` or `VIEW_REFRESH_ON_STARTUP_ENABLED` after deploy.
- `test/testutils/setup_postgres.go` `cleanUp`: add `DELETE FROM case_group WHERE created_on > '2025-01-01'`.
- QLIN seed `scripts/init-sql/qlin/organization.sql`: the six `LDM-*` rows get `notification_emails = '<code lowercase>@localstack.invalid'` (idempotent `INSERT … ON CONFLICT DO UPDATE SET notification_emails = …` or a separate `UPDATE`, check how the file is written).
- Test fixture `test/data/clinical/*organization*.sql`: `LDM-CHUSJ` with two emails; `LDM-CHOP` without (the `skipped_no_contact` case).

### A2. Types
- `internal/types/case_group.go` (new): `CaseGroup` GORM model (`TenantCode`, `Name`, `CaseIDs string`, `CreatedOn`, `CreatedBy`) + `TableName()`; `CaseGroupTable` (Postgres only); `JoinCaseIDs([]int) string` / `ParseCaseIDs(string) ([]int, error)` (sorted, deduplicated, error on a non-integer token); `ValidateCaseGroupName`; `ErrCaseGroupNotFound`; `UnknownCaseIDsError{IDs}`; DTOs `PostCaseGroupRequest{Name string binding:"required"; CaseIDs []int binding:"required"}`, `CaseGroupResponse{Name, TenantCode, CaseIDs []int}`, `CaseGroupEmailReport{OrganizationCode, Recipients []string, CaseCount, DocumentCount, Status, Error?, Template string, Context CaseGroupEmailContext}`, `CaseGroupEmailContext{HasStat bool, AnalysisCodes []string, CaseIDs []int, ManifestFilename string}`, `NotifyCaseGroupResponse{Group CaseGroupResponse, Emails []CaseGroupEmailReport}`; status constants; read rows `CaseGroupCaseRow{CaseID, PriorityCode, AnalysisCatalogCode, DiagnosisLabCode, DiagnosisLabName}`, `CaseGroupDocumentRow{DocumentID, Name, Size, DataTypeCode, FormatCode, SubmitterSampleID, PatientID, CaseID, DiagnosisLabCode}`. Empty `case_ids: []` passes `required` (non-nil) = empty group, documented in swagger.
- `internal/types/organization.go`: `Organization` model gains `NotificationEmails string` (column `notification_emails`); the organization request/response DTOs used by `POST`/`PUT /organizations` gain `NotificationEmails []string json:"notification_emails"` (`binding:"dive,email"`), mapped with `JoinEmails` / `SplitEmails` (trim, drop empties). Check the exact DTO names in `internal/types/organization.go` and `internal/server/handlers_organizations.go` on `origin/main`.
- Tests: `Test_ValidateCaseGroupName_Valid/_Empty/_PathSeparatorRejected`, `Test_UnknownCaseIDsError_Message`, `Test_ParseCaseIDs_SortsAndDedups/_Empty/_NonInteger_Error`, `Test_JoinCaseIDs_RoundTrip`, `Test_SplitEmails_TrimsAndDropsEmpty`.

### A3. Organization notification emails (CLIN-6230)
- `internal/repository/postgres/organizations.go`: write path persists `notification_emails`; new read `ListNotificationEmails(ctx, tenantCode, orgCodes) (map[string][]string, error)` (used by notify; labs with `NULL`/empty → absent key).
- `internal/server/handlers_organizations.go`: `POST` / `PUT /{tenant}/organizations[/:code]` accept and return `notification_emails` (400 on invalid email); `GET /organizations` list returns it. No new route.
- Tests: repo `Test_UpsertOrganization_PersistsNotificationEmails`, `Test_ListNotificationEmails_GroupsByOrg/_NullAbsent/_OtherTenant_Empty`; handler `Test_PutOrganization_NotificationEmails_RoundTrip`, `_InvalidEmail_400`; existing organization tests keep passing (field optional).

### A4. Case group repository `internal/repository/postgres/case_groups.go` (CLIN-6223)
- `NewCaseGroupsRepository(database.PostgresDB)` with `joins.Postgres()`.
- `UpsertCaseGroup(ctx, tenantCode, name, caseIDs, createdBy) (*types.CaseGroup, error)`: `SELECT id FROM cases WHERE tenant_code=? AND id IN ?` → missing ⇒ `*UnknownCaseIDsError`, nothing written; `INSERT … (tenant_code, name, case_ids, created_by) ON CONFLICT (tenant_code, name) DO UPDATE SET case_ids = EXCLUDED.case_ids RETURNING *`.
- `GetCaseGroupByName(ctx, tenantCode, name) (*types.CaseGroup, error)` (nil,nil when absent).
- `ListCases(ctx, tenantCode, caseIDs []int) ([]types.CaseGroupCaseRow, error)`: `cases` + `CaseWithDiagnosisLab` + `CaseWithAnalysisCatalog`, `WHERE c.id IN ? AND c.tenant_code=?`.
- `ListDocuments(ctx, tenantCode, caseIDs []int) ([]types.CaseGroupDocumentRow, error)`: Postgres twin of `starrocks.prepareDocumentsQuery` (`document` → `DocumentWithTaskHasDocument` type=`output` → `TaskHasDocWithTaskContext` → `TaskContextWithCaseHasSeqExp` → `CaseHasSeqExpWithCase` → `CaseHasSeqExpWithSequencingExperiment` → `SeqExpWithSample`), `WHERE c.id IN ? AND doc.tenant_code=? AND c.tenant_code=?`, **no** `filterOutIndexFiles`.
- Tests `Need{Postgres: WritePostgres}`, ids ≥ 1000 via `createTestCase` (`helpers_test.go`), unique names per test: `Test_UpsertCaseGroup_CreatesGroup/_OverwritesCaseIds/_EmptyCaseIds/_UnknownCaseId_Error/_CaseFromOtherTenant_Unknown/_SameNameOtherTenant_Independent`, `Test_GetCaseGroupByName_NotFound_Nil/_OtherTenant_Nil`, `Test_ListDocuments_OutputDocumentsOfCases` (seeded case 1, assert a `crai` row), `_ExcludesInputDocuments` (doc 245 once), `_OnlyGivenCaseIds`, `Test_ListCases_ReturnsPriorityAndAnalysisCode`.

### A5. `internal/notification/` (new package; `service/` is Keycloak/Ranger provisioning, no overlap)
- `config.go` (CLIN-6226): `SMTPConfig{Host, Port, User, Password, TLS none|starttls|tls, From}` + `SMTPConfigFromEnv()` (host/from required, port default 587, TLS default `starttls`, unknown TLS = error); `Settings{PortalURL, CC, BCC []string, Location}` + `SettingsFromEnv()` (timezone default `America/Montreal`). Env: `SMTP_HOST/PORT/USER/PASSWORD/TLS/FROM`, `NOTIFICATION_CC/BCC/TIMEZONE`, `PORTAL_URL`. Read per request (lazy, like `KEYCLOAK_ADMIN_CLIENT_ID`). Tests with `t.Setenv`.
- `mailer.go` (CLIN-6226): `Message{From, To, CC, BCC, Subject, HTMLBody, Attachment{Filename, ContentType, Content}}`, consumer-side `Mailer interface{ Send(ctx, Message) error }`, `SMTPMailer` on go-mail (`NoTLS` / `TLSMandatory` / SSL port, auth only when user set, `AttachReader` with `text/tab-separated-values`, `DialAndSendWithContext`). `Test_SMTPMailer_ConfigError_NoDial`; composition via `fakeMailer` in service tests.
- `manifest.go` (CLIN-6226): `ManifestRow`, `ManifestColumns` built from `internal/cli/manifest` constants (API imports the CLI package: stdlib + humanize; never the reverse), `WriteManifest(w, rows)` (`encoding/csv`, tab, size plain bytes), `manifestRows(tenant, docs)` **dedup by document_id** (a task output reaches several `(seq, sample, patient)` rows via `task_context`; `manifest.Parse` skips repeated ids with a warning) joining distinct sample/patient ids with `;`. Contract test `Test_WriteManifest_HeaderMatchesCLIColumns` = write → `manifest.Parse` → zero warnings.
- `template.go` (CLIN-6225): `LoadTemplates(dir string) *Templates` runs **at boot** in `cmd/api/main.go`, never fatal. `dir == ""` → `slog.Warn("NOTIFICATION_TEMPLATE_DIR unset, no notification template loaded")`. Otherwise every `manifest_<tenant>.tmpl` is parsed (`text/template` for `subject`, `html/template` for `body`, both defines required, template funcs `HasAnalysis`); a parse error or a missing define → `slog.Warn("notification template skipped", "file", …, "err", …)`, file skipped; other file names → `slog.Warn("unexpected file in template dir")`; then `slog.Info("notification templates loaded", "dir", dir, "count", n, "tenants", […])`, and `slog.Warn` if `n == 0`. `Templates.For(tenantCode) (*Template, bool)`. `Render(tenantCode, data) (subject, body, file string, err error)`: `ErrTemplateMissing` when the tenant has none (→ notify 500 before any send); subject trimmed to one line, body HTML-escaped. `TemplateData{Tenant, GroupName, OrganizationCode, OrganizationName, PortalURL, Cases []TemplateCase{CaseID, Priority, AnalysisCode}, HasStat, AnalysisCodes, DocumentCount, ManifestFilename, GeneratedOn}`: the extension point, new variables are API-only changes, templates branch with `{{if}}`. No embedded default template. Tests (`t.TempDir()`): `Test_LoadTemplates_EmptyDir_WarnsNoTemplates`, `_ParsesPerTenant`, `_InvalidTemplate_SkippedNotFatal`, `_MissingSubjectDefine_Skipped`, `_UnexpectedFile_Ignored`, `Test_Render_TenantWithoutTemplate_ErrTemplateMissing`, `Test_Render_BodyEscapesHTML`, `Test_Render_SubjectSingleLine`, `Test_Render_HasAnalysisFunc`.
- `service.go` (CLIN-6226): consumer-side interfaces `groupReader` (`GetCaseGroupByName`, `ListCases`, `ListDocuments`), `emailsReader` (`ListNotificationEmails`); `Service{groups, orgs, templates *Templates, mailer, settings func() (Settings, error), now func() time.Time}`; `Notify(ctx, tenantCode, groupName) (*NotifyCaseGroupResponse, error)`. Flow: settings → group (nil → `ErrCaseGroupNotFound`) → template for tenant (missing → `ErrTemplateMissing`, 500, nothing sent) → `ParseCaseIDs` → cases + documents → group by `DiagnosisLabCode` → emails → per lab: no docs → `skipped_no_documents`; no emails → `skipped_no_contact`; else rows → manifest → `TemplateData` (`HasStat`, filename `<group>_<yyyyMMdd>_manifest.tsv` in `Location`) → `Render` → `mailer.Send` (error → `failed` + `Error`, others continue). Every report entry carries `Template` (file name) and `Context`. Stateless. Errors returned (→ 500) only before any send. Tests with fakes + fixed `now`: `Test_Notify_GroupNotFound_Error`, `_TemplateMissing_Error_NothingSent`, `_SendsOneEmailPerLab`, `_RecipientsCCBCCFromSettings`, `_AttachmentNameUsesGroupAndDate`, `_HasStatWhenAnyCaseStat`, `_NoContact_SkippedNotError`, `_NoDocuments_Skipped`, `_SendFailure_ReportedPerLab_OthersStillSent`, `_SecondCallSendsAgain`, `_ReportCarriesTemplateAndContext`, `_ManifestParsesWithCLI`.

### A6. Handlers `internal/server/handlers_case_groups.go` (CLIN-6223 for POST/GET, CLIN-6226 for notify)
Consumer-side `caseGroupStore` (`UpsertCaseGroup`, `GetCaseGroupByName`) and `caseGroupNotifier` (`Notify`). `PostCaseGroupHandler(store, auth)` `POST /{tenant}/case_groups` body `PostCaseGroupRequest` (200 `CaseGroupResponse`; 400 name / body / `UnknownCaseIDsError` via `errors.As` → `HandleValidationError`; `created_by` from `auth.RetrieveUserIdFromToken`, 401), `GetCaseGroupHandler(store)` `GET /{tenant}/case_groups/{name}` (404 `HandleNotFoundError(c, "case group")`), `PostCaseGroupNotifyHandler(svc)` `POST /{tenant}/case_groups/{name}/notify` (no body; 404 on `ErrCaseGroupNotFound`; 500 on `ErrTemplateMissing` with the generic message, detail logged). All: `ValidateCaseGroupName`, `GetTenant(c)`, nil slices → `[]`, `@Tags case_groups`, `@Security bearerauth`, `X-Correlation-ID` on 500. Unit tests with mocks + `assert.JSONEq` + `tenantRouter()`: post success / invalid name / missing body / unknown ids listed / overwrite / repo error 500 generic / get not found / notify report / notify 404 / notify template missing 500 / service error 500.

### A7. Wiring `cmd/api/main.go`
```go
repoCaseGroups := postgres.NewCaseGroupsRepository(postgresDB)
notificationTemplates := notification.LoadTemplates(utils.GetEnvOrDefault("NOTIFICATION_TEMPLATE_DIR", ""))   // warns, never fatal
caseGroupNotifier := notification.NewService(repoCaseGroups, repoOrganizations, notificationTemplates, notification.NewSMTPMailer(), notification.SettingsFromEnv)

caseGroupsGroup := tenantRoutes.Group("/case_groups")
caseGroupsGroup.POST("", requireActionInTenant(types.ActionIngestData), server.PostCaseGroupHandler(repoCaseGroups, auth))
caseGroupsGroup.GET("/:name", requireActionInTenant(types.ActionIngestData), server.GetCaseGroupHandler(repoCaseGroups))
caseGroupsGroup.POST("/:name/notify", requireActionInTenant(types.ActionIngestData), server.PostCaseGroupNotifyHandler(caseGroupNotifier))
```
- `cmd/api/action_enforcement_integration_test.go`: the three routes in `expectedTenantActions` (→ `ActionIngestData`) and `inTenantOrgActionRoutes`.
- `cmd/api/integration_test.go` `Test_SecureRoutes`: the three paths.
- `cmd/api/case_groups_integration_test.go` (new, pattern `organizations_integration_test.go`, `MockAuth` gabe = data_manager `'*'`, mike = member → 403): post creates & returns ids, post same name overwrites, member forbidden, unknown case 400, get after post, notify with a fake `Mailer` and a temp template dir (seeded case 1's lab `CQGC` has no emails → `skipped_no_contact`; a group with an id ≥ 1000 case at `LDM-CHUSJ` → `sent`, manifest captured from the fake and parsed with the CLI; report carries `template` = `manifest_radiant.tmpl`), notify without a template for the tenant → 500 and the fake mailer saw nothing (`WritePostgres`).

### A8. Deps, env, docs
- `go get github.com/wneessen/go-mail`, `make install`. Check `go version -m bin/radiant-client/radiant-client` does not list go-mail.
- `.env.template`: `# --- Notifications (LDM manifest emails) ---` block with `SMTP_*`, `NOTIFICATION_CC/BCC/TIMEZONE/TEMPLATE_DIR`, `PORTAL_URL` and the lazy-read note.
- `backend/CLAUDE.md`: `notification/` in layout, `/:tenant/case_groups` routes + gate, config rows, `case_group` (Postgres-only, tenant-scoped) and `organization.notification_emails`, `cleanUp` line, API→`internal/cli/manifest` import note pinned by the contract test, template-per-tenant rule.
- `make doc`, root `make generate-client-typescript` (+ python), commit `frontend/api` diff. Postman folder `Case Groups` (post / get / notify); `Organizations` requests gain `notification_emails`.

### A9. Order
1 migration + types + cleanUp → 2 organization `notification_emails` (repo, DTO, handlers) → 3 case group repo (`make itest`) → 4 CLI columns (`make test-cli`) → 5 `internal/notification` → 6 handlers, wiring, registries, integration tests → 7 `make fmt && make lint && make test && make doc`, client regen, Postman, CLAUDE.md, `.env.template` → 8 localstack end-to-end (Verification).

## Part B: radiant-client CLI (CLIN-6228)

- `internal/cli/manifest/manifest.go`: constants `ColumnDataType`, `ColumnFormat`, `ColumnSubmitterSampleID`, `ColumnPatientID`, `ColumnCaseID` + `InformationalColumns`; `Parse` treats them as known (no "ignored" warning), never reads them into `Entry`; the warning's known-list string lists all three groups. Tests: `Test_Parse_InformationalColumns_NoWarning`, `Test_Parse_UnknownColumn_StillWarns`. `make test-cli` green, footprint unchanged.
- Contract test lives API-side (`Test_WriteManifest_HeaderMatchesCLIColumns`, A5). Column constants stay in `internal/cli/manifest`; the API imports the CLI package, never the reverse.
- `cmd/radiant-client/README.md`: document the extra columns.

## Part C: radiant-portal-pipeline (CLIN-6227; Radiant's own Airflow, `github.com/radiant-network/radiant-portal-pipeline`, not cloned locally yet)

Radiant's Airflow already talks to radiant-api: `radiant/tasks/nextflow/portal.py` (`fetch_token` client_credentials, `patch_case_batch`, `wait_for_batch`) with the `radiant_api_conn` Airflow Connection (provisioned in qlin-qa-infra `kubernetes-manifests/apps/airflow/externalsecret.yaml` as `AIRFLOW_CONN_RADIANT_API_CONN`, Keycloak client `airflow`, realm `qlin`). That service account already holds `ingest_data` on the tenants it registers into: **no new Keycloak client, no new grant**.

Hook: `radiant/dags/nextflow_postprocessing_cases.py`, right after `register_tasks` (PATCH `/{tenant}/cases/batch`, mapped over `list_tenants`), the documents exist.

1. `radiant/tasks/nextflow/portal.py`: `post_case_group(host, tenant, token, name, case_ids) -> dict` (POST `/{tenant}/case_groups`) and `notify_case_group(host, tenant, token, name) -> dict` (POST `…/notify`), same `requests` + `PortalError` style, same 403 hint. Unit tests in `tests/unit/` with `requests` mocked (pytest, ruff, Google docstrings, line length 119).
2. `nextflow_postprocessing_cases.py`: two new mapped tasks after `register_tasks`, one per tenant like it: `create_case_group` (name `postprocessing-<run_tag>`, `run_tag` from `paths.sanitize_run_tag`; case ids = `Family.case_id` of that tenant) then `notify_labs` (skipped when the DAG runs with `dry_run=true`; logs the per-lab report incl. `template` and `context`; fails the mapped instance only if a lab is `failed` or the call returns 500). `skipped_no_contact` labs logged as warnings. New param `notify` (bool, default true). DAG doc gets a "Notification" section (statuses, a retried `notify_labs` re-sends, template-missing 500 = infra config).
3. `radiant/dags/notify_cases.py` (new manual DAG, `<NAMESPACE>-notify-cases`, doc `docs/notify_cases.md`): params `tenant`, `case_group_name` (default `manual-<run_tag>`), `case_ids` (optional; when given, POST the group first). Equivalent of QLIN's `etl_notify` for re-sends and ad-hoc groups; every run sends.
4. Design note `design/CLIN-6227-lab-manifest-notification.md` in that repo (convention `design/SJRA-*.md`; confirm the ticket-prefix rule).
5. Test: unit tests + QA run of `notify_cases` on a group whose lab points to a test distribution list.

## Part D: clin-localstack (CLIN-6222, separate PR)

1. `docker-compose.yml`, profile `radiant`: `mailpit` service (`axllent/mailpit`, SMTP `1025`, UI `8025`). `configs/radiant-portal/.env`: `SMTP_HOST=mailpit`, `SMTP_PORT=1025`, `SMTP_TLS=none`, `SMTP_FROM=cqgc@localstack.test`, `NOTIFICATION_BCC=support@localstack.test`, `PORTAL_URL=http://localhost:3002`, `NOTIFICATION_TEMPLATE_DIR=/templates`. Bind mount `./configs/radiant-portal/templates:/templates:ro` on `radiant-api` with `manifest_qlin.tmpl` (QLIN text, `[STAT]`/`[RAPIDE]`) and `manifest_radiant.tmpl` (generic, for the seeded `radiant` tenant). Mailpit in the CLAUDE.md infra table (port 8025).
2. Seed emails come from the submodule (`init-sql/qlin/organization.sql`, A1). Fix the `radiant-seed` wait in `docker-compose.yml` (~line 378): wait for `information_schema.columns` to have `organization.notification_emails` (latest migration) rather than only `public.document`.
3. `clin-system` service account must hold `data_manager` on tenant `qlin` (seeded) and on any tenant whose cases it groups. Found 2026-09-16: `seed-complement.sql` pins the service-account `sub` (`c722f5ff-…`) but a fresh realm import assigns another id, so the seeded grants match nobody (every `/{tenant}/*` call → 403). Fix in CLIN-6222: resolve the real `sub` (Keycloak admin API, like `make radiant_keycloak_sync` does for `geneticist`) and copy the `user_role` rows, service accounts included.
4. `project-tasks/radiant-migration/manifest-notification.md` (FR): contexte, décisions, mapping colonnes QLIN → Radiant, découpage Jira, intégration localstack (Mailpit, templates, curl), risques. Pointer in `clin-localstack/CLAUDE.md` Radiant list; `radiant-client-cli.md` "Hors périmètre" line points here.

## Jira (epic CLIN-6220 « Email notifications (ETL trigger) [Radiant] », stories created 2026-09-14)

| Ticket | Repo | Branch | Plan part | Content | Depends on |
|---|---|---|---|---|---|
| CLIN-6223 | radiant-portal | `feat/clin-6223` | A1 (`case_group`), A2, A4, A6 POST/GET, A7 | migration `case_group`, types + `ParseCaseIDs`, repo, `POST /case_groups` (overwrite by name) + `GET /case_groups/{name}`, registries, swagger/TS client, Postman | none, first |
| CLIN-6230 | radiant-portal | `feat/clin-6230` | A1 (`notification_emails`), A2, A3 | column `organization.notification_emails`, DTOs, `POST`/`PUT /organizations` round-trip, `ListNotificationEmails`, QLIN seed, swagger/TS, Postman | none |
| CLIN-6225 | radiant-portal | `feat/clin-6225` | A5 template | `internal/notification/template.go`, `LoadTemplates` at boot (warn, never fatal), `manifest_<tenant>.tmpl`, `ErrTemplateMissing`, `NOTIFICATION_TEMPLATE_DIR` | none |
| CLIN-6228 | radiant-portal | `feat/clin-6228` | B | `InformationalColumns` in `internal/cli/manifest`, README | none |
| CLIN-6226 | radiant-portal | `feat/clin-6226` | A5 config/mailer/manifest/service, A6 notify, A7, A8 | `go-mail`, `SMTP_*`/`NOTIFICATION_*`/`PORTAL_URL`, manifest writer + CLI contract test, `Service.Notify`, `POST /case_groups/{name}/notify` with template context in the report, `.env.template`, CLAUDE.md | 6223, 6231, 6225, 6228 |
| CLIN-6222 | clin-localstack | `feat/clin-6222` | D | Mailpit, SMTP env, templates mount (`manifest_qlin.tmpl`, `manifest_radiant.tmpl`), seed wait fix, FR doc, CLAUDE.md pointer | 6226 to test end to end |
| CLIN-6224 | qlin-qa-infra | `feat/clin-6224` | infra | `SMTP_*`, `NOTIFICATION_*`, `PORTAL_URL` on radiant-api Deployment, ConfigMap `radiant-notification-templates` via kustomize `configMapGenerator` (`manifest_qlin.tmpl`), QA lab emails via `PUT /organizations/{code}` | 6225, 6226 deployed |
| CLIN-6227 | radiant-portal-pipeline | `feat/clin-6227` | C | `post_case_group` + `notify_case_group` in `portal.py`, `create_case_group` + `notify_labs` after `register_tasks`, manual DAG `notify_cases`, DAG docs | 6226 in QA |
| CLIN-6229 | radiant-portal (frontend + handler) | `feat/clin-6229` | follow-up | `?case_group=<name>` URL state in `case-exploration.tsx`; cases search handler resolves the group and injects `case_id in` | 6223 |
| CLIN-6231 | radiant-portal (frontend admin) | `feat/clin-6231` | follow-up | `notification_emails` field on the existing organization form in `frontend/apps/admin` | 6231 |

Commits `<type>: CLIN-XXXX <desc>`, never committed/pushed by Claude; submodule git discipline per `/git` skill. radiant-portal and radiant-portal-pipeline document `SJRA-###` in commitlint: confirm a `CLIN-` key passes at the first commit (precedent: CLIN-6198/6199 merged).

## Verification

Backend:
```bash
cd services/radiant-portal/backend && go build ./... && make test && make fmt && make lint && make doc
cd .. && make generate-client-typescript && git status --short
```
Localstack end to end (`make start_radiant`, Mailpit UI `http://localhost:8025`; radiant-api boot log shows `notification templates loaded count=2 tenants=[qlin radiant]`):
```bash
TOKEN=$(curl -s -X POST http://keycloak:8081/realms/radiant/protocol/openid-connect/token -d grant_type=client_credentials -d client_id=clin-system -d client_secret=<localstack secret> | jq -r .access_token)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' http://localhost:8090/qlin/case_groups -d '{"name":"run-2026-09-15","case_ids":[1,2,3]}' | jq .
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' http://localhost:8090/qlin/case_groups -d '{"name":"run-2026-09-15","case_ids":[1,2]}' | jq .case_ids   # overwritten
curl -s -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8090/qlin/case_groups/run-2026-09-15/notify | jq '.emails[] | {organization_code, status, template, context}'   # emails in Mailpit
curl -s -X POST -H "Authorization: Bearer $TOKEN" http://localhost:8090/qlin/case_groups/run-2026-09-15/notify | jq '.emails[].status'   # sent again (stateless)
# remove configs/radiant-portal/templates/manifest_qlin.tmpl, restart radiant-api: boot warns, notify on qlin → 500, nothing in Mailpit
# save the attachment from Mailpit, then:
radiant-client download -m run-2026-09-15_20260915_manifest.tsv -o tmp/manifest-notify/out --yes   # no "column ignored" warnings, crai/tbi downloaded
```
