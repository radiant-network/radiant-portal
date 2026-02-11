# Worker Pipe-and-Filter Architecture Design Document

## 1. Motivation

The current worker validates each batch record by interleaving DB lookups with validation logic. Every field validator that needs reference data (value-set codes, organization lookups, existing-entity checks) calls the repository directly. This produces **N * K** database round-trips per batch (N records, K lookups per record), even though most lookups return the same data across records.

Measured DB call counts per batch of N records today:

| Batch type | DB calls (approx.) |
|---|---|
| Patient | 4N |
| Sample | 6N |
| Sequencing experiment | 7N + variable |
| Case | 12 + (P + 3S + A + ...) per record, times N |

The case type already has partial pre-fetching (`fetchCodeInfos`, `fetchValidationInfos`), but it runs per-record rather than per-batch, and even then re-fetches some data it already cached (two `TODO` comments acknowledge this).

This document proposes replacing the current approach with a **pipe-and-filter** architecture backed by a **batch-level cache** and **configuration-driven pipeline definitions**.

---

## 2. Architecture Overview

```
                                    +-----------+
                                    | Pipeline  |
                                    | Config    |
                                    | (TOML)    |
                                    +-----+-----+
                                          |
                                          v
 +----------+     +--------+     +------------------+     +---------+
 | Unmarshal | --> | Cache  | --> | Filter 1 (field) | --> | Filter 2|  --> ... --> Persist
 | Payload   |     | Warmup |     +------------------+     +---------+
 +----------+     +--------+
                      |
                      v
              +---------------+
              | BatchCache    |
              | (codes, orgs, |
              |  patients...) |
              +---------------+
```

A **pipeline** is an ordered sequence of steps applied to a batch:

1. **Unmarshal** -- deserialize the JSON payload into typed records.
2. **Cache warm-up** -- scan the payload, collect all lookup keys, execute bulk DB queries, and populate a `BatchCache`.
3. **Filters** -- an ordered chain of validation functions. Each filter reads from the cache and the record, and writes errors/warnings/infos onto the record. Filters never call the database directly.
4. **Persist** -- the existing transactional write logic (unchanged).

---

## 3. BatchCache

### 3.1 Structure

The cache is a single struct populated once per batch, before any filter runs. All filters receive a read-only reference.

```go
type BatchCache struct {
    // Value-set codes -- keyed by ValueSetType
    Codes map[repository.ValueSetType][]string

    // Task type codes (fetched differently than value sets)
    TaskTypeCodes []string

    // Entity lookups -- keyed by the natural key used in the payload
    Organizations       map[string]*types.Organization           // key: org code
    Patients            map[PatientKey]*types.Patient             // key: {OrgCode, SubmitterPatientId}
    Samples             map[SampleKey]*types.Sample               // key: {OrgCode, SubmitterSampleId}
    SamplesByOrgAndId   map[SampleKey]*types.Sample               // key: {OrgCode, SubmitterSampleId} via org-code lookup
    SeqExps             map[SeqExpLookupKey]*types.SequencingExperiment // key: {Aliquot, SubmitterSampleId, OrgCode}
    SeqExpsByAliquot    map[string][]types.SequencingExperiment   // key: aliquot
    Projects            map[string]*types.Project                 // key: project code
    AnalysisCatalogs    map[string]*types.AnalysisCatalog         // key: analysis code
    ExistingPatients    map[PatientKey]*types.Patient             // key: {OrgCode, SubmitterPatientId} for existing-check
    ExistingSamples     map[SampleKey]*types.Sample               // key: {OrgCode, SubmitterSampleId} for existing-check
    Cases               map[CaseLookupKey]*types.Case             // key: {ProjectID, SubmitterCaseId}
    Documents           map[string]*types.Document                // key: URL
    DocumentsInTasks    map[string][]*DocumentRelation            // key: URL
    TaskContexts        map[int][]*types.TaskContext              // key: TaskID
    FileMetadata        map[string]*utils.FileMetadata            // key: URL (from S3)
}
```

Concrete batch types only use a subset. The warm-up step for each type populates only what that type needs.

### 3.2 Warm-up: key extraction + bulk fetch

The warm-up scans the full payload to collect all unique lookup keys, then issues one query per key-set (or a few queries for larger datasets). This turns N per-record lookups into a constant number of batch-level lookups.

**Patient batch example:**

```go
func warmUpPatientCache(ctx *BatchValidationContext, patients []types.PatientBatch) (*BatchCache, error) {
    cache := NewBatchCache()

    // 1. Value sets -- two constant lookups, done once
    if err := cache.LoadCodes(ctx.ValueSetsRepo,
        repository.ValueSetLifeStatus,
        repository.ValueSetSex,
    ); err != nil {
        return nil, err
    }

    // 2. Collect unique org codes from the payload
    orgCodes := uniqueStrings(patients, func(p types.PatientBatch) string {
        return p.PatientOrganizationCode
    })

    // 3. Fetch all referenced organizations in one pass
    for _, code := range orgCodes {
        org, err := ctx.OrgRepo.GetOrganizationByCode(code)
        if err != nil {
            return nil, fmt.Errorf("cache warmup: get org %q: %w", code, err)
        }
        cache.Organizations[code] = org // nil is a valid cache entry (org doesn't exist)
    }

    // 4. For each resolved org, fetch all referenced patients
    for _, p := range patients {
        org := cache.Organizations[p.PatientOrganizationCode]
        if org == nil {
            continue
        }
        key := PatientKey{p.PatientOrganizationCode, p.SubmitterPatientId.String()}
        if _, seen := cache.ExistingPatients[key]; seen {
            continue
        }
        existing, err := ctx.PatientRepo.GetPatientBySubmitterPatientId(org.ID, p.SubmitterPatientId.String())
        if err != nil {
            return nil, fmt.Errorf("cache warmup: get patient %v: %w", key, err)
        }
        cache.ExistingPatients[key] = existing
    }

    return cache, nil
}
```

**DB calls for a patient batch of N records** after this change:

| Lookup | Calls |
|---|---|
| Value sets | 2 (not 2N) |
| Organizations | number of unique org codes (not N) |
| Existing patients | number of unique (org, patientId) pairs (not N) |
| **Total** | **2 + U_org + U_patient** (where U = unique keys) |

For a typical batch where all patients belong to the same organization, this is **4** DB calls regardless of N.

### 3.3 Cache contract

- **Nil values are cached** -- if `GetOrganizationByCode("XYZ")` returns nil, the cache stores `Organizations["XYZ"] = nil`. Filters check cache presence via `_, ok := cache.Organizations[code]` to distinguish "not fetched" from "fetched but doesn't exist".
- **Cache is read-only during filtering** -- filters never write to it.
- **Cache is batch-scoped** -- allocated at the start of `processTypedBatch`, dropped when the batch is done.

---

## 4. Filters

### 4.1 Filter interface

A filter is a function that inspects one record, reads the cache, and adds messages to the record's `BaseValidationRecord`. It returns `true` to continue to the next filter, or `false` to short-circuit (e.g., "already exists, skip").

```go
type Filter[R ValidationRecord] func(record R, cache *BatchCache) (continueChain bool)
```

Most filters return `true`. Only "skip" filters (e.g., `existingEntitySkip`) return `false` to stop the chain.

### 4.2 Generic reusable filters

Many validation checks are structurally identical across batch types. These become parameterised filter constructors.

**a) Required string field**

```go
func RequiredTextField[R ValidationRecord](
    fieldName string,
    getValue func(R) string,
    errorCode string,
    getResourceIDs func(R) []string,
    maxLength int,
    re *regexp.Regexp,
    reSrc string,
) Filter[R] {
    return func(record R, cache *BatchCache) bool {
        value := getValue(record)
        base := record.GetBase()
        ids := getResourceIDs(record)
        if value == "" {
            msg := formatInvalidField(record, fieldName, "field is missing", ids)
            base.addErrors(msg, errorCode, formatPath(record, fieldName))
            return true
        }
        if len(value) > maxLength {
            msg := formatFieldTooLong(record, fieldName, maxLength, ids)
            base.addErrors(msg, errorCode, formatPath(record, fieldName))
        }
        if re != nil && !re.MatchString(value) {
            msg := formatFieldRegexpMatch(record, fieldName, reSrc, ids)
            base.addErrors(msg, errorCode, formatPath(record, fieldName))
        }
        return true
    }
}
```

**b) Optional string field** -- same as above but returns early when empty.

**c) Code validation (value in allowed set)**

```go
func CodeInSet[R ValidationRecord](
    fieldName string,
    getValue func(R) string,
    codeSetKey repository.ValueSetType,
    errorCode string,
    getResourceIDs func(R) []string,
    formatReason func(value string, codes []string) string,
) Filter[R] {
    return func(record R, cache *BatchCache) bool {
        value := getValue(record)
        codes := cache.Codes[codeSetKey]
        if !slices.Contains(codes, value) {
            reason := formatReason(value, codes)
            msg := formatInvalidField(record, fieldName, reason, getResourceIDs(record))
            record.GetBase().addErrors(msg, errorCode, formatPath(record, fieldName))
        }
        return true
    }
}
```

**d) Entity-exists check (organization, patient, sample, etc.)**

```go
func EntityExists[R ValidationRecord, K comparable](
    getKey func(R) K,
    cacheLookup func(*BatchCache, K) (any, bool),
    errorCode string,
    formatError func(R, K) (string, string), // returns (message, path)
    onFound func(R, any),                    // e.g., store resolved ID on the record
) Filter[R] {
    return func(record R, cache *BatchCache) bool {
        key := getKey(record)
        entity, found := cacheLookup(cache, key)
        if !found || entity == nil {
            msg, path := formatError(record, key)
            record.GetBase().addErrors(msg, errorCode, path)
        } else if onFound != nil {
            onFound(record, entity)
        }
        return true
    }
}
```

**e) Existing-entity skip (already-exists → mark as skipped, compare fields)**

```go
func ExistingEntitySkip[R ValidationRecord, K comparable](
    getKey func(R) K,
    cacheLookup func(*BatchCache, K) (any, bool),
    compareFields func(R, any) bool, // returns true if any field differs (emits warnings)
    formatSkipInfo func(R) (string, string, string), // returns (message, code, path)
) Filter[R] {
    return func(record R, cache *BatchCache) bool {
        key := getKey(record)
        existing, found := cacheLookup(cache, key)
        if !found || existing == nil {
            return true // entity is new, continue
        }
        record.GetBase().Skipped = true
        anyDiff := compareFields(record, existing)
        if !anyDiff {
            msg, code, path := formatSkipInfo(record)
            record.GetBase().addInfos(msg, code, path)
        }
        return false // short-circuit: no further validation needed
    }
}
```

**f) Uniqueness within batch** -- wraps the existing `validateUniquenessInBatch` as a filter. This one is special: it carries mutable state (the `seen` map) across records but resets per batch.

```go
func UniquenessInBatch[R ValidationRecord, K comparable](
    getKey func(R) K,
    errorCode string,
    getIDs func(R) []string,
) Filter[R] {
    seen := map[K]struct{}{}
    return func(record R, cache *BatchCache) bool {
        key := getKey(record)
        validateUniquenessInBatch(record, key, seen, errorCode, getIDs(record))
        return true
    }
}
```

### 4.3 Type-specific filters

Some validations are unique to a batch type and cannot be parameterised generically (e.g., patient organization category check, sample parent-sample resolution, sequencing experiment aliquot-lab comparison, case proband count, task document context validation). These remain as type-specific filter functions:

```go
func patientOrgCategoryFilter(record *PatientValidationRecord, cache *BatchCache) bool {
    org := cache.Organizations[record.Patient.PatientOrganizationCode]
    if org == nil {
        return true // org-not-exist already caught by entity-exists filter
    }
    if !slices.Contains(AllowedOrganizationCategories, org.CategoryCode) {
        // ... same error message as today ...
    }
    return true
}
```

The point is not to force everything into generic constructors -- it's to make the generic ones available so that the ~60% of filters that are "check this field against a regex / length / code-set" don't require per-type code.

---

## 5. Pipeline Assembly

### 5.1 In-code pipeline

Each batch type assembles its filter chain in a dedicated function:

```go
func patientPipeline() []Filter[*PatientValidationRecord] {
    return []Filter[*PatientValidationRecord]{
        // Field validations
        RequiredTextField("submitter_patient_id", getPatientSubmitterPatientId, PatientInvalidValueCode, getPatientResIDs, TextMaxLength, ExternalIdRegexpCompiled, ExternalIdRegexp),
        RequiredTextField("submitter_patient_id_type", getPatientSubmitterPatientIdType, PatientInvalidValueCode, getPatientResIDs, TextMaxLength, ExternalIdRegexpCompiled, ExternalIdRegexp),
        OptionalTextField("last_name", getPatientLastName, PatientInvalidValueCode, getPatientResIDs, TextMaxLength, NameRegExpCompiled, NameRegExp),
        OptionalTextField("first_name", getPatientFirstName, PatientInvalidValueCode, getPatientResIDs, TextMaxLength, NameRegExpCompiled, NameRegExp),
        OptionalTextField("jhn", getPatientJhn, PatientInvalidValueCode, getPatientResIDs, TextMaxLength, ExternalIdRegexpCompiled, ExternalIdRegexp),
        RequiredField("date_of_birth", patientDateOfBirthFilter),

        // Code validations
        CodeInSet("life_status_code", getPatientLifeStatusCode, repository.ValueSetLifeStatus, PatientInvalidValueCode, getPatientResIDs, patientCodeReason),
        CodeInSet("sex_code", getPatientSexCode, repository.ValueSetSex, PatientInvalidValueCode, getPatientResIDs, patientCodeReason),

        // Batch uniqueness
        UniquenessInBatch(getPatientKey, PatientDuplicateInBatchCode, getPatientIDs),

        // Entity checks
        EntityExists(getPatientOrgCode, lookupOrg, PatientOrganizationNotExistCode, fmtPatientOrgNotExist, setPatientOrgId),
        patientOrgCategoryFilter,

        // Existing entity skip (must be last -- short-circuits)
        ExistingEntitySkip(getPatientLookupKey, lookupExistingPatient, comparePatientFields, fmtPatientAlreadyExists),
    }
}
```

### 5.2 Configuration-driven pipeline (TOML)

The long-term goal is to declare the filter chain externally so that adding a new field validation doesn't require touching Go code. The pipeline config declares which generic filters to instantiate and in what order.

```toml
[patient]
resource_type = "patient"
cache_warmup = ["value_sets", "organizations", "existing_patients"]

[[patient.filters]]
type = "required_text_field"
field = "submitter_patient_id"
error_code = "PATIENT-004"
max_length = 100
regexp = "ExternalId"
resource_ids = ["PatientOrganizationCode", "SubmitterPatientId"]

[[patient.filters]]
type = "required_text_field"
field = "submitter_patient_id_type"
error_code = "PATIENT-004"
max_length = 100
regexp = "ExternalId"
resource_ids = ["PatientOrganizationCode", "SubmitterPatientId"]

[[patient.filters]]
type = "optional_text_field"
field = "last_name"
error_code = "PATIENT-004"
max_length = 100
regexp = "Name"
resource_ids = ["PatientOrganizationCode", "SubmitterPatientId"]

# ... more fields ...

[[patient.filters]]
type = "code_in_set"
field = "life_status_code"
code_set = "life_status"
error_code = "PATIENT-004"
resource_ids = ["PatientOrganizationCode", "SubmitterPatientId"]

[[patient.filters]]
type = "code_in_set"
field = "sex_code"
code_set = "sex"
error_code = "PATIENT-004"
resource_ids = ["PatientOrganizationCode", "SubmitterPatientId"]

[[patient.filters]]
type = "uniqueness_in_batch"
error_code = "PATIENT-006"
key_fields = ["PatientOrganizationCode", "SubmitterPatientId"]

[[patient.filters]]
type = "entity_exists"
entity = "organization"
lookup_field = "PatientOrganizationCode"
error_code = "PATIENT-003"

[[patient.filters]]
type = "custom"
name = "patient_org_category"

[[patient.filters]]
type = "existing_entity_skip"
entity = "patient"
error_code = "PATIENT-001"
warning_code = "PATIENT-002"
```

A **registry** maps `type` values to generic filter constructors, and `regexp` names to compiled regexes:

```go
var regexpRegistry = map[string]*RegexpEntry{
    "ExternalId":             {ExternalIdRegexpCompiled, ExternalIdRegexp},
    "Name":                   {NameRegExpCompiled, NameRegExp},
    "TissueSite":             {TissueSiteRegExpCompiled, TissueSiteRegExp},
    "AlphanumericIdentifier": {AlphanumericIdentifierRegExpCompiled, AlphanumericIdentifierRegExp},
    "FamilyMemberCode":       {FamilyMemberCodeRegExpCompiled, FamilyMemberCodeRegExp},
    "Text":                   {TextRegExpCompiled, TextRegExp},
}
```

Custom (non-generic) filters are registered by name:

```go
var customFilterRegistry = map[string]any{
    "patient_org_category":    patientOrgCategoryFilter,
    "sample_parent_sample":    sampleParentSampleFilter,
    "seqexp_aliquot_lab":      seqExpAliquotLabFilter,
    "case_proband_count":      caseProbandCountFilter,
    // ...
}
```

A **pipeline loader** reads the TOML, resolves filter types against the registry, and produces the `[]Filter[R]` chain.

### 5.3 When to use config vs. code

| Use config for | Keep in code |
|---|---|
| `required_text_field`, `optional_text_field` | Complex multi-step validations (parent sample resolution, task document context) |
| `code_in_set` | Validations that depend on relationships between fields |
| `uniqueness_in_batch` | S3 metadata checks |
| `entity_exists` | Topological sort (sample reordering) |
| `existing_entity_skip` | Persistence logic |

The config handles the mechanical validations (~70% of all filters). The remaining ~30% stay as named Go functions registered in the custom registry. This means adding a "new required text field" to patient validation = one TOML block, zero Go changes.

---

## 6. Pipeline Execution

### 6.1 Core runner

```go
func RunPipeline[P any, R ValidationRecord](
    ctx *BatchValidationContext,
    batch *types.Batch,
    db *gorm.DB,
    config PipelineConfig,
    newRecord func(P, int) R,
    warmUp func(*BatchValidationContext, []P) (*BatchCache, error),
    filters []Filter[R],
    persist func(*gorm.DB, *types.Batch, []R) error,
) {
    // 1. Unmarshal
    var items []P
    if err := json.Unmarshal([]byte(batch.Payload), &items); err != nil {
        processUnexpectedError(batch, fmt.Errorf("error unmarshalling %s batch: %v", config.ResourceType, err), ctx.BatchRepo)
        return
    }

    // 2. Cache warm-up
    cache, err := warmUp(ctx, items)
    if err != nil {
        processUnexpectedError(batch, fmt.Errorf("error %s cache warmup: %v", config.ResourceType, err), ctx.BatchRepo)
        return
    }

    // 3. Apply filters to each record
    records := make([]R, 0, len(items))
    for i, item := range items {
        record := newRecord(item, i)
        for _, filter := range filters {
            if !filter(record, cache) {
                break // short-circuit (e.g., entity already exists)
            }
        }
        records = append(records, record)
    }

    // 4. Persist
    if err := persist(db, batch, records); err != nil {
        processUnexpectedError(batch, fmt.Errorf("error processing %s batch records: %v", config.ResourceType, err), ctx.BatchRepo)
    }
}
```

### 6.2 Batch-level filters (post-loop)

Some validations run after all records have been processed (e.g., sample topological reorder, case proband count). These are modelled as a separate filter type:

```go
type BatchFilter[R ValidationRecord] func(records []R, cache *BatchCache)
```

The runner calls these between steps 3 and 4.

### 6.3 Backward-compatible entry points

The existing `processPatientBatch`, `processSampleBatch`, etc. functions remain unchanged in signature. They become thin wrappers around `RunPipeline`:

```go
func processPatientBatch(ctx *BatchValidationContext, batch *types.Batch, db *gorm.DB) {
    RunPipeline(ctx, batch, db,
        PipelineConfig{ResourceType: "patient"},
        newPatientRecord,
        warmUpPatientCache,
        patientPipeline(),
        persistBatchAndPatientRecords,
    )
}
```

---

## 7. Cache Warm-up Strategy Per Batch Type

### 7.1 Patient

| Cache section | Source | Keys collected from payload |
|---|---|---|
| `Codes[ValueSetLifeStatus]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Codes[ValueSetSex]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Organizations` | `OrgRepo.GetOrganizationByCode` | unique `PatientOrganizationCode` |
| `ExistingPatients` | `PatientRepo.GetPatientBySubmitterPatientId` | unique `(OrgCode, SubmitterPatientId)` |

### 7.2 Sample

| Cache section | Source | Keys collected from payload |
|---|---|---|
| `Codes[ValueSetSampleType]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Codes[ValueSetHistologyType]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Organizations` | `OrgRepo.GetOrganizationByCode` | unique `SampleOrganizationCode` |
| `Patients` | `PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId` | unique `(PatientOrgCode, SubmitterPatientId)` |
| `ExistingSamples` | `SampleRepo.GetSampleBySubmitterSampleId` | unique `(OrgID, SubmitterSampleId)` |
| `ExistingSamples` (parents) | `SampleRepo.GetSampleBySubmitterSampleId` | unique `(OrgID, SubmitterParentSampleId)` where non-empty |

### 7.3 Sequencing Experiment

| Cache section | Source | Keys collected from payload |
|---|---|---|
| `Codes[ValueSetExperimentalStrategy]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Codes[ValueSetSequencingReadTechnology]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Codes[ValueSetStatus]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Codes[ValueSetPlatform]` | `ValueSetsRepo.GetCodes` | (constant) |
| `Organizations` | `OrgRepo.GetOrganizationByCode` | unique `SampleOrganizationCode` + unique `SequencingLabCode` |
| `Samples` | `SampleRepo.GetSampleBySubmitterSampleId` | unique `(OrgID, SubmitterSampleId)` |
| `SeqExpsByAliquot` | `SeqExpRepo.GetSequencingExperimentByAliquot` | unique `Aliquot` |
| Samples/Orgs for existing SEs | `SampleRepo.GetSampleById`, `OrgRepo.GetOrganizationById` | IDs from resolved SE results |

### 7.4 Case

| Cache section | Source | Keys collected from payload |
|---|---|---|
| All 12 code sets | `ValueSetsRepo.GetCodes` x 11 + `TaskRepo.GetTaskTypeCodes` | (constant) |
| `Projects` | `ProjectRepo.GetProjectByCode` | unique `ProjectCode` |
| `AnalysisCatalogs` | `CasesRepo.GetCaseAnalysisCatalogIdByCode` | unique `AnalysisCode` |
| `Organizations` | `OrgRepo.GetOrganizationByCode` | unique `OrderingOrganizationCode` + `DiagnosticLabCode` |
| `Patients` | `PatientRepo.GetPatientByOrgCodeAndSubmitterPatientId` | all `(OrgCode, SubmitterPatientId)` from all case patients |
| `SeqExps` | `SeqExpRepo.GetSequencingExperimentByAliquotAndSubmitterSample` | all `(Aliquot, SampleId, OrgCode)` from SEs + task aliquots |
| `SeqExpsByAliquot` | `SeqExpRepo.GetSequencingExperimentByAliquot` | all aliquots from tasks |
| `TaskContexts` | `TaskRepo.GetTaskContextBySequencingExperimentId` | all resolved SE IDs |
| `Documents` | `DocRepo.GetDocumentByUrl` | all input + output document URLs |
| `DocumentsInTasks` | `TaskRepo.GetTaskHasDocumentByDocumentId` | all resolved document IDs |
| `Cases` | `CasesRepo.GetCaseBySubmitterCaseIdAndProjectId` | `(ProjectID, SubmitterCaseId)` combos |
| `Samples` | `SampleRepo.GetSampleByOrgCodeAndSubmitterSampleId` | all `(OrgCode, SampleId)` from SEs |
| `FileMetadata` | `S3FS.GetMetadata` | all output document URLs (for new docs) |

The case warm-up is the most complex, but it eliminates the per-record N-multiplier and the two `TODO use cache from context` issues.

---

## 8. Impact on Test Compatibility

### What stays identical

- All struct names, field names, and method signatures
- All constants and error codes
- All error message strings, paths, and codes
- All top-level function signatures (`processPatientBatch`, `validatePatientsBatch`, `persistBatchAndPatientRecords`, etc.)
- `BatchValidationContext` struct and `NewBatchValidationContext`
- `ValidationRecord` interface, `BaseValidationRecord` struct

### What changes internally

- The body of `validatePatientsBatch` (and equivalents) delegates to `RunPipeline` + filter chain instead of inline code
- Individual validation methods on records (e.g., `validateSubmitterPatientId`) become thin wrappers that invoke the corresponding filter with the record's cached data
- `CaseValidationRecord.fetchCodeInfos()` / `fetchValidationInfos()` become no-ops or read from the cache instead of calling repos directly

### Test compatibility strategy

Since tests call individual methods like `record.validateSubmitterPatientId()` directly (constructing records manually without a cache), these methods must continue to work standalone. Two approaches:

**Option A: Dual-path methods.** Each method checks if a cache is available. If yes, use it. If no (test scenario), fall back to the current direct-call logic.

```go
func (r *PatientValidationRecord) validateLifeStatusCode() error {
    var codes []string
    if r.cache != nil {
        codes = r.cache.Codes[repository.ValueSetLifeStatus]
    } else {
        var err error
        codes, err = r.Context.ValueSetsRepo.GetCodes(repository.ValueSetLifeStatus)
        if err != nil {
            return err
        }
    }
    // ... same validation logic ...
}
```

**Option B: Add cache field to records but make it optional.** The old methods keep their signatures and behaviour. The pipeline simply populates the cache before calling them. Methods that currently call repos first check `r.cache` for the data and skip the repo call if found. This is the least disruptive approach since tests create records without a cache and the existing repo calls act as fallback.

**Recommended: Option B.** It requires no changes to test code and the "with cache"/"without cache" divergence is limited to a one-line `if` at the top of each method that currently makes a DB call.

---

## 9. File Structure

| File | Contents |
|---|---|
| `main.go` | Entry point, `BatchValidationContext`, health probe, dispatch (unchanged externally) |
| `cache.go` | `BatchCache` struct, `NewBatchCache()`, `LoadCodes()`, generic cache helpers |
| `pipeline.go` | `Filter[R]`, `BatchFilter[R]`, `RunPipeline[P,R]`, `PipelineConfig` |
| `filters.go` | Generic filter constructors: `RequiredTextField`, `OptionalTextField`, `CodeInSet`, `EntityExists`, `ExistingEntitySkip`, `UniquenessInBatch` |
| `pipeline_config.go` | TOML loading, filter registry, `LoadPipelineFromConfig()` |
| `base_validation.go` | `ValidationRecord`, `BaseValidationRecord`, format helpers, regex constants (from DESIGN.md) |
| `batch_utils.go` | `processUnexpectedError`, `persistBatchAndRecords[R]` |
| `patient_validation.go` | `PatientValidationRecord`, patient-specific filters, `warmUpPatientCache`, `patientPipeline()`, persistence |
| `sample_validation.go` | Same pattern + `reorderSampleRecords` as a `BatchFilter` |
| `sequencing_experiment_validation.go` | Same pattern + SE-specific filters |
| `case_validation.go` | Same pattern + case-specific filters, `StorageContext`, case persistence |
| `pipelines/patient.toml` | TOML pipeline definition for patient (optional, phase 2) |
| `pipelines/sample.toml` | TOML pipeline definition for sample |
| `pipelines/sequencing_experiment.toml` | TOML pipeline definition for sequencing experiment |
| `pipelines/case.toml` | TOML pipeline definition for case |

---

## 10. Migration Path

### Phase 1: Cache infrastructure (no behaviour change)

1. Add `cache.go` with `BatchCache` struct.
2. Add an optional `cache *BatchCache` field to `BaseValidationRecord`.
3. For patient batch only: implement `warmUpPatientCache`, populate cache before validation loop.
4. Modify `validateLifeStatusCode` and `validateSexCode` to read from cache when available (Option B fallback).
5. Run all patient tests -- they pass without a cache (fallback path). Run integration tests -- they pass with the cache (warm-up path).
6. Repeat for sample, sequencing experiment, case.

### Phase 2: Filter abstraction (structural change)

1. Add `pipeline.go` and `filters.go`.
2. Implement generic filter constructors.
3. For patient batch: build `patientPipeline()` returning `[]Filter[*PatientValidationRecord]`.
4. Replace the body of `validatePatientsBatch` to iterate records through the filter chain.
5. Keep existing method-level tests working by preserving the wrapper methods.
6. Run full test suite.
7. Repeat for the other three batch types.

### Phase 3: TOML configuration (optional, additive)

1. Add `pipeline_config.go` and the `pipelines/` directory.
2. Write `patient.toml` matching the hard-coded pipeline.
3. Add `LoadPipelineFromConfig()` that reads TOML and builds the filter chain from the registry.
4. Wire it up -- `processPatientBatch` loads from TOML if the config file exists, otherwise falls back to the hard-coded chain.
5. Write a test that loads the TOML and compares the resulting filter chain length/types against the hard-coded one.
6. Repeat for remaining types.

### Phase 4: Bulk queries (performance optimization)

1. Where repository interfaces support it, add batch-lookup methods (e.g., `GetOrganizationsByCodes([]string)`) that issue a single `WHERE code IN (...)` query.
2. Update the warm-up functions to use bulk methods instead of per-key loops.
3. This is a backend repository change, transparent to the worker architecture.

---

## 11. Summary of Benefits

| Concern | Before | After |
|---|---|---|
| DB calls per batch of N records | O(K*N) | O(K + U) where U = unique keys |
| Adding a new text-field validation | Write a Go method, compile, deploy | Add a TOML block (phase 3) |
| Code duplication across batch types | High (~3 copies of "is different", ~4 of text validation) | One generic filter per pattern |
| Understanding the validation order | Read 300+ lines of imperative Go per type | Read the TOML file or the `pipeline()` function |
| Value-set lookups | N times per batch (2N for patient, 12N for case) | 1 time per value-set type per batch |
| Testing a single filter | Must construct a full record with Context + repos | Construct a record + a `BatchCache` literal |
