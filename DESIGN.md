# Worker Refactoring Design Document

## 1. Current State Analysis

The worker validates batch payloads for four entity types: **patient**, **sample**, **sequencing_experiment**, and **case**. Each type grew independently, leading to duplicated patterns and inconsistent approaches to the same problems.

### Files today

| File                                  | Responsibility                                                                                                                             |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `main.go`                             | Entry point, `BatchValidationContext`, health probe, processor dispatch                                                                    |
| `base_validation.go`                  | `ValidationRecord` interface, `BaseValidationRecord`, shared formatters, `validateUniquenessInBatch`, `updateBatch`, `copyRecordIntoBatch` |
| `batch_utils.go`                      | `processUnexpectedError`                                                                                                                   |
| `patient_validation.go`               | Patient processing, validation, persistence                                                                                                |
| `sample_validation.go`                | Sample processing, validation, persistence                                                                                                 |
| `sequencing_experiment_validation.go` | Seq-exp processing, validation, persistence                                                                                                |
| `case_validation.go`                  | Case processing, validation, persistence (~1630 lines)                                                                                     |

### Key issues

**1. Three copies of the "is different" comparison function**

Each batch type has its own near-identical generic function that compares an existing DB value to a batch value and emits a warning if they differ:

- `validateIsDifferentExistingPatientField[T]` in `patient_validation.go:201`
- `validateIsDifferentExistingSampleField[T]` in `sample_validation.go:124`
- `verifyIsDifferentField[T]` in `sequencing_experiment_validation.go:304`

They differ only in the record type used for `addWarnings` and in how the message's ID portion is formatted.

**2. Four different approaches to string field validation**

| Type    | Approach                                                                                                                                                                |
|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Patient | One method per field with inline `len()` + `regexp.MatchString()` checks                                                                                                |
| Sample  | `validateFieldWithRegexp()` helper + separate `validateFieldLength()`                                                                                                   |
| Seq-exp | `verifyStringField()` -- the most consolidated: handles required, max-length, regex in one call                                                                         |
| Case    | `validateCaseField()`, `validatePatientsTextField()`, `validateTaskTextField()`, `validateDocumentTextField()` -- four slightly different signatures for the same logic |

**3. Copy-paste batch processing pipeline**

Every type repeats the same three-step skeleton:

```
processXBatch()       → unmarshal JSON → call validateXBatch → call persistBatchAndXRecords
validateXBatch()      → loop records, validate each, check uniqueness
persistBatchAndXRecords() → db.Transaction { updateBatch + conditional insert }
```

The structural logic is identical; only the types and the insert functions differ.

**4. Scattered regex declarations**

Regex constants are declared wherever first needed:

| Regex                                  | Declared in                           |
|----------------------------------------|---------------------------------------|
| `ExternalIdRegexp`                     | `base_validation.go`                  |
| `NameRegExp`                           | `patient_validation.go`               |
| `TissueSiteRegExp`                     | `sample_validation.go`                |
| `AlphanumericIdentifierRegExp`         | `sequencing_experiment_validation.go` |
| `FamilyMemberCodeRegExp`, `TextRegExp` | `case_validation.go`                  |

**5. Redundant path helper**

`SequencingExperimentValidationRecord.getPath()` duplicates `formatPath()` from `base_validation.go`.

**6. Context field duplication in CaseValidationRecord**

`CaseValidationRecord` has both an embedded `BaseValidationRecord.Context` field AND its own explicit `Context *BatchValidationContext` field. The embedded one is never set in `NewCaseValidationRecord()`, which leads to confusion about which `Context` to use.

**7. Unused variable**

`AllowedStatusCode` map in `sequencing_experiment_validation.go:26` is declared but never used -- value set codes are looked up from the DB instead.

---

## 2. Design Principles

1. **Identical external behaviour** -- error messages, paths, and codes must not change.
2. **Don't touch test files** -- all existing struct names, field names, method signatures, function signatures, and constants that tests reference must remain.
3. **Eliminate duplication** -- shared patterns live in one place.
4. **Consistent approach** -- one way to validate string fields, one way to compare existing vs. new values.
5. **Keep it simple** -- no over-abstraction; generics where the type system demands it, plain functions otherwise.

---

## 3. Proposed Changes

### 3.1 Unified string field validator on `BaseValidationRecord`

Move the `verifyStringField` pattern from `SequencingExperimentValidationRecord` to `BaseValidationRecord` so every batch type can use it. The existing per-type method names (which tests call) become thin wrappers.

```go
// base_validation.go
func (r *BaseValidationRecord) verifyTextField(
    record ValidationRecord,
    value string,
    fieldName string,
    maxLength int,
    re *regexp.Regexp,
    reSrc string,
    errorCode string,
    resourceIDs []string,
    required bool,
) {
    if value == "" {
        if required {
            msg := formatInvalidField(record, fieldName, "field is missing", resourceIDs)
            r.addErrors(msg, errorCode, formatPath(record, fieldName))
        }
        return
    }
    if len(value) > maxLength {
        msg := formatFieldTooLong(record, fieldName, maxLength, resourceIDs)
        r.addErrors(msg, errorCode, formatPath(record, fieldName))
    }
    if re != nil && !re.MatchString(value) {
        msg := formatFieldRegexpMatch(record, fieldName, reSrc, resourceIDs)
        r.addErrors(msg, errorCode, formatPath(record, fieldName))
    }
}
```

The patient validators would then become:

```go
func (r *PatientValidationRecord) validateLastName() {
    if r.Patient.LastName == "" {
        return
    }
    resIds := []string{r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId.String()}
    r.verifyTextField(r, r.Patient.LastName.String(), "last_name",
        TextMaxLength, NameRegExpCompiled, NameRegExp,
        PatientInvalidValueCode, resIds, false)
}
```

The seq-exp `verifyStringField` method stays as a wrapper that calls `verifyTextField` but supplies the path via `getPath()` to preserve the current path format.

**Impact**: Patient, sample, and case validation methods shrink to 1-3 line delegations. The duplicated length/regex logic disappears from 4 files.

### 3.2 Generic "is different" comparison function

Replace the three typed copies with one generic free function on `base_validation.go`:

```go
func validateIsDifferentField[T comparable](
    record ValidationRecord,
    fieldName string,
    existingValue T,
    newValue T,
    warningCode string,
    idsLabel string,
) bool {
    if existingValue == newValue {
        return false
    }
    path := formatPath(record, fieldName)
    msg := fmt.Sprintf(
        "A %s with same ids (%s) has been found but with a different %s (%v <> %v).",
        record.GetResourceType(), idsLabel, fieldName, existingValue, newValue,
    )
    record.GetBase().addWarnings(msg, warningCode, path)
    return true
}
```

The existing per-type functions become aliases or thin wrappers that compute `idsLabel` and pass the right `warningCode`:

```go
func validateIsDifferentExistingPatientField[T comparable](
    r *PatientValidationRecord, fieldName string, existing T, new T,
) bool {
    ids := fmt.Sprintf("%s / %s", r.Patient.PatientOrganizationCode, r.Patient.SubmitterPatientId)
    return validateIsDifferentField(r, fieldName, existing, new, PatientExistingPatientDifferentFieldCode, ids)
}
```

**Why keep the wrappers?** Tests call `validateIsDifferentExistingPatientField` directly. The wrapper preserves the exact signature.

### 3.3 Generic batch processing pipeline

Today each batch type has three nearly identical top-level functions. We can extract the skeleton into a single generic function.

Define a minimal interface for the insert step and use generics for the rest:

```go
type BatchItemUnmarshaler[P any] struct {
    TypeLabel string // "patient", "sample", etc.
}

func processTypedBatch[P any, R interface{ GetBase() *BaseValidationRecord }](
    ctx *BatchValidationContext,
    batch *types.Batch,
    db *gorm.DB,
    typeLabel string,
    validate func(*BatchValidationContext, []P) ([]R, error),
    persist func(*gorm.DB, *types.Batch, []R) error,
) {
    payload := []byte(batch.Payload)
    var items []P
    if err := json.Unmarshal(payload, &items); err != nil {
        processUnexpectedError(batch, fmt.Errorf("error unmarshalling %s batch: %v", typeLabel, err), ctx.BatchRepo)
        return
    }

    records, err := validate(ctx, items)
    if err != nil {
        processUnexpectedError(batch, fmt.Errorf("error %s batch validation: %v", typeLabel, err), ctx.BatchRepo)
        return
    }

    glog.Infof("%s batch %v processed with %d records", strings.Title(typeLabel), batch.ID, len(records))

    if err := persist(db, batch, records); err != nil {
        processUnexpectedError(batch, fmt.Errorf("error processing %s batch records: %v", typeLabel, err), ctx.BatchRepo)
    }
}
```

The existing entry-point functions stay in place (tests and `supportedProcessors` map reference them) but delegate:

```go
func processPatientBatch(ctx *BatchValidationContext, batch *types.Batch, db *gorm.DB) {
    processTypedBatch(ctx, batch, db, "patient", validatePatientsBatch, persistBatchAndPatientRecords)
}
```

### 3.4 Generic persist pipeline

Similarly, `persistBatchAndPatientRecords`, `persistBatchAndSampleRecords`, and `persistBatchAndSequencingExperimentRecords` share the same structure. Extract:

```go
func persistBatchAndRecords[R interface{ GetBase() *BaseValidationRecord }](
    db *gorm.DB,
    batch *types.Batch,
    records []R,
    typeLabel string,
    insertFn func(*gorm.DB, []R) error,
) error {
    return db.Transaction(func(tx *gorm.DB) error {
        txRepoBatch := repository.NewBatchRepository(tx)
        rowsUpdated, err := updateBatch(batch, records, txRepoBatch)
        if err != nil {
            return err
        }
        if rowsUpdated == 0 {
            return fmt.Errorf("no rows updated when updating %s batch %v", typeLabel, batch.ID)
        }
        if !batch.DryRun && batch.Status == types.BatchStatusSuccess {
            if err := insertFn(tx, records); err != nil {
                return fmt.Errorf("error during %s insertion %v", typeLabel, err)
            }
        }
        return nil
    })
}
```

The existing named functions remain as required by the tests:

```go
func persistBatchAndPatientRecords(db *gorm.DB, batch *types.Batch, records []*PatientValidationRecord) error {
    return persistBatchAndRecords(db, batch, records, "patient",
        func(tx *gorm.DB, recs []*PatientValidationRecord) error {
            return insertPatientRecords(recs, repository.NewPatientsRepository(tx))
        })
}
```

Case batch persistence is more complex (uses `StorageContext`), so it keeps its existing body but calls the generic for the batch-update portion.

### 3.5 Centralize regex constants

Move all regex constants and their compiled versions into `base_validation.go`:

```go
// base_validation.go

const (
    TextMaxLength = 100
    NoteMaxLength = 1000

    ExternalIdRegexp             = `^[a-zA-Z0-9\- ._'À-ÿ]*$`
    NameRegExp                   = `^[a-zA-Z0-9\- .'À-ÿ]*$`
    TissueSiteRegExp             = `^[A-Za-z\- ]+$`
    AlphanumericIdentifierRegExp = `^[A-Za-z0-9\-_.]+$`
    FamilyMemberCodeRegExp       = `^[A-Za-z\- ]+$`
    TextRegExp                   = `^[A-Za-z0-9\-\_\.\,\: ]+$`
)

var (
    ExternalIdRegexpCompiled             = regexp.MustCompile(ExternalIdRegexp)
    NameRegExpCompiled                   = regexp.MustCompile(NameRegExp)
    TissueSiteRegExpCompiled             = regexp.MustCompile(TissueSiteRegExp)
    AlphanumericIdentifierRegExpCompiled = regexp.MustCompile(AlphanumericIdentifierRegExp)
    FamilyMemberCodeRegExpCompiled       = regexp.MustCompile(FamilyMemberCodeRegExp)
    TextRegExpCompiled                   = regexp.MustCompile(TextRegExp)
)
```

Remove the individual declarations from each file.

### 3.6 Remove `SequencingExperimentValidationRecord.getPath()`

Replace all calls to `r.getPath(fieldName)` with `formatPath(r, fieldName)`. They produce identical output since `GetResourceType()` returns `"sequencing_experiment"`.

### 3.7 Fix `CaseValidationRecord` context duplication

Remove the explicit `Context *BatchValidationContext` field from `CaseValidationRecord`. Set the embedded `BaseValidationRecord.Context` in `NewCaseValidationRecord()` instead. Update all `cr.Context.XRepo` references inside `case_validation.go` to use `cr.BaseValidationRecord.Context.XRepo` (or just through the embedded field access, which Go resolves automatically once the shadow is removed).

Since the test file references `CaseValidationRecord.Context`, and Go's embedding means the `BaseValidationRecord.Context` is promoted, the expression `cr.Context` still works without changes to the test.

### 3.8 Remove dead code

Delete `AllowedStatusCode` map from `sequencing_experiment_validation.go` and the `EMPTY` variable. Status codes are validated via the ValueSets DB lookup, making this hardcoded map unused.

---

## 4. Proposed File Structure

| File | Contents |
|---|---|
| `main.go` | `BatchValidationContext`, `NewBatchValidationContext`, `supportedProcessors`, `main`, `processBatch`, `StartHealthProbe` -- unchanged |
| `base_validation.go` | `ValidationRecord` interface, `BaseValidationRecord` (with `verifyTextField`), all regex constants, all format helpers, `validateUniquenessInBatch`, `validateIsDifferentField[T]`, `copyRecordIntoBatch`, `updateBatch` |
| `batch_utils.go` | `processUnexpectedError`, `processTypedBatch[P,R]`, `persistBatchAndRecords[R]` |
| `patient_validation.go` | `PatientValidationRecord`, all patient constants, patient-specific validation/persistence. Field validators delegate to `verifyTextField`. "Is different" delegates to `validateIsDifferentField`. Process/persist delegates to `processTypedBatch`/`persistBatchAndRecords`. |
| `sample_validation.go` | Same pattern as patient. `validateFieldWithRegexp` and `validateFieldLength` removed (replaced by `verifyTextField`). |
| `sequencing_experiment_validation.go` | Same pattern. `verifyStringField` becomes a wrapper. `getPath` removed. `verifyIsDifferentField` becomes a wrapper. |
| `case_validation.go` | `CaseValidationRecord` (without duplicated `Context` field), `StorageContext`, all case constants. `validateCaseField`, `validatePatientsTextField`, `validateTaskTextField`, `validateDocumentTextField` delegate to `verifyTextField` for the regex/length portion. |

No new files are introduced. The total line count drops by an estimated 15-20%, mostly from patient and sample validation.

---

## 5. What Stays Unchanged

To avoid breaking any test:

- All struct names: `PatientValidationRecord`, `SampleValidationRecord`, `SequencingExperimentValidationRecord`, `CaseValidationRecord`, `BaseValidationRecord`, `BatchValidationContext`, `StorageContext`, `PatientKey`, `SampleKey`, `SequencingExperimentKey`, `CaseKey`, `DocumentRelation`
- All struct fields that tests reference (e.g., `Patient`, `Sample`, `SequencingExperiment`, `Skipped`, `Errors`, `Warnings`, `Infos`, `Index`, `OrganizationId`, `PatientId`, `SampleID`, `SequencingLabID`, `SubmitterOrganizationID`, `Context`, etc.)
- All method signatures called by tests (e.g., `validateSubmitterPatientId()`, `validateLastName()`, `verifyStringField()`, `verifyIsDifferentField()`, `preFetchValidationInfo()`, `validateCaseField()`, etc.)
- All free-function signatures called by tests (e.g., `formatPath()`, `formatIds()`, `validateUniquenessInBatch()`, `copyRecordIntoBatch()`, `processUnexpectedError()`, `validatePatientsBatch()`, `validateSamplesBatch()`, `validateSequencingExperimentBatch()`, `validateSequencingExperimentRecord()`, `validateCaseRecord()`, `validateCaseBatch()`, `persistBatchAndPatientRecords()`, `NewCaseValidationRecord()`, `NewBatchValidationContext()`, `processBatch()`, etc.)
- All constants and their values (error codes, regex strings)
- All error messages, paths, and codes produced by the validation logic

---

## 6. Migration Strategy

The refactoring is purely internal reorganization; no test changes needed.

1. **Add `verifyTextField` to `BaseValidationRecord`** and the generic `validateIsDifferentField[T]`. Compile -- no callers yet, nothing breaks.
2. **Centralize regex constants** into `base_validation.go`. Remove from other files. Compile.
3. **Refactor patient field validators** to delegate to `verifyTextField`. Run patient tests.
4. **Refactor sample field validators** similarly. Remove `validateFieldWithRegexp` and `validateFieldLength`. Run sample tests.
5. **Refactor seq-exp**: make `verifyStringField` delegate to `verifyTextField`, remove `getPath`, point `verifyIsDifferentField` at the generic version. Run seq-exp tests.
6. **Refactor case**: fix `Context` duplication, make `validateCaseField`/`validatePatientsTextField`/etc. delegate to `verifyTextField` for the length+regex portion. Run case tests.
7. **Add `processTypedBatch` and `persistBatchAndRecords`**, then make the four `processXBatch` and `persistBatchAndXRecords` functions delegate. Run integration tests.
8. **Remove `AllowedStatusCode`, `EMPTY`** dead code.
9. **Full test suite** run to confirm zero regressions.

Each step is independently compilable and testable, so regressions can be caught at the exact point of introduction.
