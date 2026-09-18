package server

import (
	"context"
	"maps"
	"slices"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// caseOrgLookup is the slice of the auth repository the org resolvers need. Each method
// answers "which diagnosis labs does this resource belong to?" for one route family, and
// returns an empty slice for a resource that does not exist in the tenant.
type caseOrgLookup interface {
	OrgsForCase(ctx context.Context, tenantCode string, caseID int) ([]string, error)
	OrgsForNote(ctx context.Context, tenantCode, noteID string) ([]string, error)
	OrgsForDocument(ctx context.Context, tenantCode string, documentID int) ([]string, error)
	OrgsForSubmitterCases(ctx context.Context, tenantCode string, pairs [][2]string) (map[[2]string]string, error)
}

// OrgFromCaseParam resolves the org from the :case_id the route already names — occurrence
// flags, igv, and the v2 interpretation routes.
func OrgFromCaseParam(repo caseOrgLookup) OrgResolver {
	return func(c *gin.Context) ([]string, error) {
		return orgsForCaseID(c, repo, c.Param("case_id"))
	}
}

// OrgFromCaseBody resolves the org from the case_id in the request body (POST /notes). It
// binds through ShouldBindBodyWithJSON, which caches the raw body on the context, so the
// handler can bind the full payload again afterwards.
func OrgFromCaseBody(repo caseOrgLookup) OrgResolver {
	return func(c *gin.Context) ([]string, error) {
		var body struct {
			CaseID int `json:"case_id"`
		}
		if err := c.ShouldBindBodyWithJSON(&body); err != nil {
			// A malformed body is the handler's 400 to emit, not the gate's 403; it cannot
			// name a case, so it resolves to no org and is denied here.
			return nil, nil
		}
		return orgsForCase(c, repo, body.CaseID)
	}
}

// OrgFromNoteParam resolves the org through the note the route names, for the note writes
// that carry no case id of their own (PUT and DELETE /notes/:id).
func OrgFromNoteParam(repo caseOrgLookup) OrgResolver {
	return func(c *gin.Context) ([]string, error) {
		tenant, err := GetTenant(c)
		if err != nil {
			return nil, err
		}
		noteID := c.Param("id")
		// occurrence_note.id is a uuid; a malformed one would fault the query rather than
		// miss, so it is rejected as unattributable before reaching the database.
		if _, err := uuid.Parse(noteID); err != nil {
			return nil, nil
		}
		return repo.OrgsForNote(c.Request.Context(), *tenant, noteID)
	}
}

// OrgFromDocumentParam resolves the orgs through the cases a document is attached to
// (GET /documents/:document_id/download_url).
func OrgFromDocumentParam(repo caseOrgLookup) OrgResolver {
	return func(c *gin.Context) ([]string, error) {
		tenant, err := GetTenant(c)
		if err != nil {
			return nil, err
		}
		documentID, err := strconv.Atoi(c.Param("document_id"))
		if err != nil {
			return nil, nil
		}
		return repo.OrgsForDocument(c.Request.Context(), *tenant, documentID)
	}
}

func orgsForCaseID(c *gin.Context, repo caseOrgLookup, rawCaseID string) ([]string, error) {
	caseID, err := strconv.Atoi(rawCaseID)
	if err != nil {
		return nil, nil
	}
	return orgsForCase(c, repo, caseID)
}

func orgsForCase(c *gin.Context, repo caseOrgLookup, caseID int) ([]string, error) {
	if caseID == 0 {
		return nil, nil
	}
	tenant, err := GetTenant(c)
	if err != nil {
		return nil, err
	}
	return repo.OrgsForCase(c.Request.Context(), *tenant, caseID)
}

// caseBatchRecord is the slice of a case-batch record the gate reads: its diagnosis lab when
// the payload states it, and otherwise the submitter key to look the case up by. It fits the
// POST, PUT and PATCH bodies alike — only PATCH may omit the lab.
type caseBatchRecord struct {
	DiagnosticLabCode string `json:"diagnostic_lab_code"`
	ProjectCode       string `json:"project_code"`
	SubmitterCaseID   string `json:"submitter_case_id"`
}

// OrgsFromCaseBatchBody resolves the diagnosis lab of every case in a case-batch payload, for
// the all-of gate: each record is authorized against its own lab. A record stating no lab (a
// PATCH may) is resolved through the case it names, so omitting the field cannot dodge the
// check; a record naming neither a lab nor an existing case resolves to nothing, which denies.
func OrgsFromCaseBatchBody(repo caseOrgLookup) OrgResolver {
	return func(c *gin.Context) ([]string, error) {
		tenant, err := GetTenant(c)
		if err != nil {
			return nil, err
		}

		var body struct {
			Cases []caseBatchRecord `json:"cases"`
		}
		if err := c.ShouldBindBodyWithJSON(&body); err != nil {
			return nil, nil
		}
		if len(body.Cases) == 0 {
			return nil, nil
		}

		orgs := map[string]bool{}
		pairs := [][2]string{}
		seen := map[[2]string]bool{}
		for _, record := range body.Cases {
			if record.DiagnosticLabCode != "" {
				orgs[record.DiagnosticLabCode] = true
				continue
			}
			if record.ProjectCode == "" || record.SubmitterCaseID == "" {
				return nil, nil
			}
			pair := [2]string{record.ProjectCode, record.SubmitterCaseID}
			if !seen[pair] {
				seen[pair] = true
				pairs = append(pairs, pair)
			}
		}

		if len(pairs) > 0 {
			resolved, err := repo.OrgsForSubmitterCases(c.Request.Context(), *tenant, pairs)
			if err != nil {
				return nil, err
			}
			for _, pair := range pairs {
				lab, found := resolved[pair]
				if !found {
					// The case does not exist in this tenant: nothing attributes the record to
					// an org, so the batch is refused rather than queued for the worker to reject.
					return nil, nil
				}
				orgs[lab] = true
			}
		}

		return slices.Sorted(maps.Keys(orgs)), nil
	}
}
