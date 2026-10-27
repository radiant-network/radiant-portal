package postgres

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// Tests of migration 000044 (RAD-116) and of its pre-check query. Each test gets a database of its
// own at version 43 with the fixtures of test/data/migration_000044 (their header lists the tasks and
// sequencings the tests use), adds legacy Exomiser tasks, then applies 000044.

const (
	versionBeforeExomiserMigration = 43
	exomiserMigrationVersion       = 44
	exomiserMigrationFixtures      = "migration_000044"
)

func newExomiserMigrationDatabase(t *testing.T) *testutils.MigrationDatabase {
	t.Helper()
	m := testutils.NewMigrationDatabase(t, versionBeforeExomiserMigration)
	require.NoError(t, m.LoadFixtures(exomiserMigrationFixtures))
	return m
}

type exomiserCheckFailure struct {
	LegacyTaskID int
	FailedCheck  string
}

type movedDocument struct {
	DocumentID   int
	TaskID       int
	TaskTypeCode string
	DataTypeCode string
}

func insertLegacyTask(t *testing.T, db *gorm.DB, id int, typeCode string) {
	t.Helper()
	require.NoError(t, db.Exec(`INSERT INTO task (id, task_type_code, pipeline_name, pipeline_version, genome_build, created_on, tenant_code)
		VALUES (?, ?, 'exomiser', '14.0.0', NULL, '2025-01-01', 'radiant')`, id, typeCode).Error)
}

func insertTaskContext(t *testing.T, db *gorm.DB, taskID, seqID, caseID int) {
	t.Helper()
	require.NoError(t, db.Exec(`INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES (?, ?, ?)`, taskID, seqID, caseID).Error)
}

func insertTaskInput(t *testing.T, db *gorm.DB, taskID, documentID int) {
	t.Helper()
	require.NoError(t, db.Exec(`INSERT INTO task_has_document (task_id, document_id, type) VALUES (?, ?, 'input')`, taskID, documentID).Error)
}

func insertExomiserOutput(t *testing.T, db *gorm.DB, taskID, documentID int) {
	t.Helper()
	require.NoError(t, db.Exec(`INSERT INTO document (id, name, data_category_code, data_type_code, format_code, size, url, hash, created_on, tenant_code)
		VALUES (?, 'variants.tsv', 'genomic', 'exomiser', 'tsv', 11, ?, NULL, '2025-01-01', 'radiant')`, documentID, fmt.Sprintf("s3://test-bucket/exomiser/%d.variants.tsv", documentID)).Error)
	require.NoError(t, db.Exec(`INSERT INTO task_has_document (task_id, document_id, type) VALUES (?, ?, 'output')`, taskID, documentID).Error)
}

func runExomiserPreCheck(t *testing.T, db *gorm.DB) []exomiserCheckFailure {
	t.Helper()
	query, err := os.ReadFile(filepath.Join(testutils.ModuleRoot(), "scripts", "init-sql", "check_exomiser_legacy_tasks.sql"))
	require.NoError(t, err)
	var failures []exomiserCheckFailure
	require.NoError(t, db.Raw(string(query)).Scan(&failures).Error)
	return failures
}

func movedDocuments(t *testing.T, db *gorm.DB, documentIDs ...int) []movedDocument {
	t.Helper()
	var docs []movedDocument
	require.NoError(t, db.Raw(`SELECT d.id AS document_id, t.id AS task_id, t.task_type_code, d.data_type_code
		FROM document d
		JOIN task_has_document thd ON thd.document_id = d.id AND thd.type = 'output'
		JOIN task t ON t.id = thd.task_id
		WHERE d.id IN ?
		ORDER BY d.id`, documentIDs).Scan(&docs).Error)
	return docs
}

func countRows(t *testing.T, db *gorm.DB, query string, args ...any) int64 {
	t.Helper()
	var n int64
	require.NoError(t, db.Raw(query, args...).Scan(&n).Error)
	return n
}

// assertExomiserMigrationFailsAndChangesNothing applies 000044, expects the error to name the task, and
// checks that the transaction left the legacy model in place.
func assertExomiserMigrationFailsAndChangesNothing(t *testing.T, m *testutils.MigrationDatabase, failingTaskID int, outputDocumentID int) {
	t.Helper()
	err := m.MigrateTo(exomiserMigrationVersion)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "task "+strconv.Itoa(failingTaskID))

	db := m.DB
	assert.EqualValues(t, 2, countRows(t, db, `SELECT count(*) FROM task_type WHERE code IN ('exomiser', 'exomiser_cnv')`))
	assert.EqualValues(t, 0, countRows(t, db, `SELECT count(*) FROM data_type WHERE code = 'exomiser_cnv'`))
	assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task WHERE id = ?`, failingTaskID))
	assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task_has_document WHERE task_id = ? AND document_id = ? AND type = 'output'`, failingTaskID, outputDocumentID))
}

func Test_ExomiserMigration_MovesOutputsToTheMatchedAnnotationTask(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB

		// SNV, matched by its input: the proband's slivar VCF, output of task 5.
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 1, 1)
		insertTaskInput(t, db, 2001, 251)
		insertExomiserOutput(t, db, 2001, 2001)
		insertExomiserOutput(t, db, 2001, 2002)

		// CNV, matched by its input: output 286 of task 86.
		insertLegacyTask(t, db, 2002, "exomiser_cnv")
		insertTaskContext(t, db, 2002, 70, 70)
		insertTaskInput(t, db, 2002, 286)
		insertExomiserOutput(t, db, 2002, 2003)

		// SNV, no annotation output as input: the fallback finds task 77 on case 3, sequencing 7.
		insertLegacyTask(t, db, 2003, "exomiser")
		insertTaskContext(t, db, 2003, 7, 3)
		insertTaskInput(t, db, 2003, 1)
		insertExomiserOutput(t, db, 2003, 2004)

		assert.Empty(t, runExomiserPreCheck(t, db))

		require.NoError(t, m.MigrateTo(exomiserMigrationVersion))

		assert.Equal(t, []movedDocument{
			{DocumentID: 2001, TaskID: 5, TaskTypeCode: "radiant_germline_annotation", DataTypeCode: "exomiser"},
			{DocumentID: 2002, TaskID: 5, TaskTypeCode: "radiant_germline_annotation", DataTypeCode: "exomiser"},
			{DocumentID: 2003, TaskID: 86, TaskTypeCode: "radiant_germline_cnv_annotation", DataTypeCode: "exomiser_cnv"},
			{DocumentID: 2004, TaskID: 77, TaskTypeCode: "radiant_germline_annotation", DataTypeCode: "exomiser"},
		}, movedDocuments(t, db, 2001, 2002, 2003, 2004))

		// Each document stays on the sequencing of its legacy task.
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task_context WHERE task_id = 5 AND sequencing_experiment_id = 1 AND case_id = 1`))
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task_context WHERE task_id = 86 AND sequencing_experiment_id = 70 AND case_id = 70`))
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task_context WHERE task_id = 77 AND sequencing_experiment_id = 7 AND case_id = 3`))

		assert.EqualValues(t, 0, countRows(t, db, `SELECT count(*) FROM task WHERE id IN (2001, 2002, 2003) OR task_type_code IN ('exomiser', 'exomiser_cnv')`))
		assert.EqualValues(t, 0, countRows(t, db, `SELECT count(*) FROM task_context WHERE task_id IN (2001, 2002, 2003)`))
		assert.EqualValues(t, 0, countRows(t, db, `SELECT count(*) FROM task_has_document WHERE task_id IN (2001, 2002, 2003)`))
		assert.EqualValues(t, 0, countRows(t, db, `SELECT count(*) FROM task_type WHERE code IN ('exomiser', 'exomiser_cnv')`))
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM data_type WHERE code = 'exomiser_cnv' AND name_en = 'Exomiser CNV Report'`))

		// The inputs of the legacy tasks are unlinked, not deleted: 251 stays an output of task 5.
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task_has_document WHERE task_id = 5 AND document_id = 251 AND type = 'output'`))
	})
}

func Test_ExomiserMigration_NoLegacyTask_RemovesTheTypes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)

		assert.Empty(t, runExomiserPreCheck(t, m.DB))
		require.NoError(t, m.MigrateTo(exomiserMigrationVersion))

		assert.EqualValues(t, 0, countRows(t, m.DB, `SELECT count(*) FROM task_type WHERE code IN ('exomiser', 'exomiser_cnv')`))
		assert.EqualValues(t, 1, countRows(t, m.DB, `SELECT count(*) FROM data_type WHERE code = 'exomiser_cnv'`))
	})
}

func Test_ExomiserMigration_NoTaskContext_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskInput(t, db, 2001, 251)
		insertExomiserOutput(t, db, 2001, 2001)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "task_context_count"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
	})
}

func Test_ExomiserMigration_TwoTaskContexts_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 1, 1)
		insertTaskContext(t, db, 2001, 2, 1)
		insertTaskInput(t, db, 2001, 251)
		insertExomiserOutput(t, db, 2001, 2001)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "task_context_count"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
	})
}

func Test_ExomiserMigration_SequencingNotProband_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		// Sequencing 2 is patient 1's, case 1's proband is patient 3. Task 5 holds sequencing 2 and outputs 251,
		// so only the proband check fails.
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 2, 1)
		insertTaskInput(t, db, 2001, 251)
		insertExomiserOutput(t, db, 2001, 2001)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "sequencing_not_proband"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
	})
}

func Test_ExomiserMigration_OccurrenceNoteAndFlagOnLegacyTask_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		// Matched by input to task 5 on the proband's sequencing: only the note and the flag break a check.
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 1, 1)
		insertTaskInput(t, db, 2001, 251)
		insertExomiserOutput(t, db, 2001, 2001)
		require.NoError(t, db.Exec(`INSERT INTO occurrence_note (case_id, seq_id, task_id, occurrence_id, user_id, user_name, content, tenant_code)
			VALUES (1, 1, 2001, '1000', '11111111-1111-1111-1111-111111111111', 'John Doe', 'note on a legacy task', 'radiant')`).Error)
		require.NoError(t, db.Exec(`INSERT INTO occurrence_flag (case_id, occurrence_id, seq_id, task_id, flag_type, tenant_code)
			VALUES (1, '1000', 1, 2001, 'flag', 'radiant')`).Error)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "occurrence_notes_or_flags"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM occurrence_note WHERE task_id = 2001`))
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM occurrence_flag WHERE task_id = 2001`))
	})
}

func Test_ExomiserMigration_NoMatchedAnnotationTask_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		// Case 8 holds sequencing 22, but no annotation task has a context on that case.
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 22, 8)
		insertTaskInput(t, db, 2001, 1)
		insertExomiserOutput(t, db, 2001, 2001)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "annotation_task_match_count"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
	})
}

func Test_ExomiserMigration_TwoMatchedAnnotationTasks_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 1, 1)
		insertTaskInput(t, db, 2001, 251)
		insertTaskInput(t, db, 2001, 264)
		insertExomiserOutput(t, db, 2001, 2001)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "annotation_task_match_count"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
	})
}

func Test_ExomiserMigration_MatchedAnnotationTaskWithoutTheSequencing_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		// Matched by input to task 5, which has no context on case 3, sequencing 7.
		insertLegacyTask(t, db, 2001, "exomiser")
		insertTaskContext(t, db, 2001, 7, 3)
		insertTaskInput(t, db, 2001, 251)
		insertExomiserOutput(t, db, 2001, 2001)

		assert.Equal(t, []exomiserCheckFailure{{LegacyTaskID: 2001, FailedCheck: "annotation_task_without_sequencing"}}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
	})
}

func Test_ExomiserMigration_AnnotationTaskMatchedTwice_Fails(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		m := newExomiserMigrationDatabase(t)
		db := m.DB
		for _, id := range []int{2001, 2002} {
			insertLegacyTask(t, db, id, "exomiser")
			insertTaskContext(t, db, id, 1, 1)
			insertTaskInput(t, db, id, 251)
			insertExomiserOutput(t, db, id, id)
		}

		assert.Equal(t, []exomiserCheckFailure{
			{LegacyTaskID: 2001, FailedCheck: "annotation_task_matched_twice"},
			{LegacyTaskID: 2002, FailedCheck: "annotation_task_matched_twice"},
		}, runExomiserPreCheck(t, db))
		assertExomiserMigrationFailsAndChangesNothing(t, m, 2001, 2001)
		assert.EqualValues(t, 1, countRows(t, db, `SELECT count(*) FROM task_has_document WHERE task_id = 2002 AND document_id = 2002 AND type = 'output'`))
	})
}
