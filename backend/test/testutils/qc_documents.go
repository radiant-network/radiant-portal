package testutils

import (
	"testing"

	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

const (
	QCTaskID           = 1790
	QCReportDocumentID = 1790
	QCMetricsJSONDocID = 1791
)

// InsertQCTaskDocuments adds a quality_control_metrics task on case 1 (sequencing experiment 1)
// with two outputs: a MultiQC report and a per-sample metrics.json. The caller must run with
// ExclusivePostgres: the report is listed like any other document.
func InsertQCTaskDocuments(t *testing.T, db *gorm.DB) {
	t.Helper()
	// Children first: cleanUp deletes task before task_context, so the foreign key would keep the task.
	t.Cleanup(func() {
		db.Exec("DELETE FROM task_has_document WHERE task_id = ?", QCTaskID)
		db.Exec("DELETE FROM task_context WHERE task_id = ?", QCTaskID)
		db.Exec("DELETE FROM task WHERE id = ?", QCTaskID)
		db.Exec("DELETE FROM document WHERE id IN ?", []int{QCReportDocumentID, QCMetricsJSONDocID})
	})
	require.NoError(t, db.Exec(`
		INSERT INTO document (id, name, data_category_code, data_type_code, format_code, size, url, tenant_code)
		VALUES (?, 'RAD179_multiqc_report.html', 'genomic', 'aggqc', 'html', 10, 's3://bucket/qc/RAD179_multiqc_report.html', 'radiant'),
		       (?, 'RAD179.metrics.json', 'genomic', 'aggqc', 'json', 10, 's3://bucket/qc/qc_json/RAD179.metrics.json', 'radiant')
	`, QCReportDocumentID, QCMetricsJSONDocID).Error)
	require.NoError(t, db.Exec(`
		INSERT INTO task (id, task_type_code, created_on, pipeline_version, tenant_code)
		VALUES (?, 'quality_control_metrics', now(), '2.0.0', 'radiant')
	`, QCTaskID).Error)
	require.NoError(t, db.Exec(`INSERT INTO task_context (task_id, sequencing_experiment_id, case_id) VALUES (?, 1, 1)`, QCTaskID).Error)
	require.NoError(t, db.Exec(`
		INSERT INTO task_has_document (task_id, document_id, type) VALUES (?, ?, 'output'), (?, ?, 'output')
	`, QCTaskID, QCReportDocumentID, QCTaskID, QCMetricsJSONDocID).Error)
}
