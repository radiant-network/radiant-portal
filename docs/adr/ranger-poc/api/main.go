package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

// ---------------------------------------------------------------------------
// Users: StarRocks credentials for each test user
// ---------------------------------------------------------------------------

type User struct {
	Name   string
	SRUser string
	SRPass string
}

var users = map[string]User{
	"jane":  {Name: "jane", SRUser: "jane", SRPass: "janepass"},
	"alice": {Name: "alice", SRUser: "alice", SRPass: "alicepass"},
	"bob":   {Name: "bob", SRUser: "bob", SRPass: "bobpass"},
	"carol": {Name: "carol", SRUser: "carol", SRPass: "carolpass"},
	"dan":   {Name: "dan", SRUser: "dan", SRPass: "danpass"},
}

// Root connection for admin operations and auth-table reads
func rootDSN(dbName string) string {
	return fmt.Sprintf("root:@tcp(starrocks:9030)/%s?interpolateParams=true", dbName)
}

// ---------------------------------------------------------------------------
// Role hierarchy
// ---------------------------------------------------------------------------

var orgRoleLevel = map[string]int{
	"org_member": 1,
	"org_editor": 2,
	"org_admin":  3,
	"org_owner":  4,
}

var tenantRoleLevel = map[string]int{
	"tenant_member": 1,
	"tenant_admin":  2,
	"tenant_owner":  3,
}

// ---------------------------------------------------------------------------
// Auth-table queries
// ---------------------------------------------------------------------------

type TenantRole struct {
	TenantID string `json:"tenant_id"`
	Role     string `json:"role"`
}

type OrgRole struct {
	OrgID    string `json:"org_id"`
	TenantID string `json:"tenant_id"`
	Role     string `json:"role"`
}

func getUserTenantRoles(username string) ([]TenantRole, error) {
	db, err := sql.Open("mysql", rootDSN("auth_db"))
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(
		"SELECT tenant_id, role FROM auth_db.user_tenant_role WHERE username = ?", username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []TenantRole
	for rows.Next() {
		var r TenantRole
		rows.Scan(&r.TenantID, &r.Role)
		roles = append(roles, r)
	}
	return roles, nil
}

func getUserOrgRoles(username string) ([]OrgRole, error) {
	db, err := sql.Open("mysql", rootDSN("auth_db"))
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT uor.org_id, o.tenant_id, uor.role
		FROM auth_db.user_org_role uor
		JOIN auth_db.organization o ON o.org_id = uor.org_id
		WHERE uor.username = ?`, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []OrgRole
	for rows.Next() {
		var r OrgRole
		rows.Scan(&r.OrgID, &r.TenantID, &r.Role)
		roles = append(roles, r)
	}
	return roles, nil
}

// ---------------------------------------------------------------------------
// Permission matrix
// ---------------------------------------------------------------------------

type Permission struct {
	Resource       string
	Action         string
	Scope          string // "org" or "tenant"
	MinOrgRole     string // minimum org role (empty = not sufficient via org role alone)
	MinTenantRole  string // minimum tenant role (empty = not sufficient via tenant role alone)
}

// Permissions define what each action requires.
// For org-scoped: user needs MinOrgRole+ at the org, OR MinTenantRole+ at the tenant.
// For tenant-scoped: user needs MinTenantRole+ at the tenant.
var permissions = []Permission{
	// Org-scoped actions
	{Resource: "case", Action: "create", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "case", Action: "edit", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "case", Action: "delete", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "case", Action: "assign", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "variant", Action: "interpret", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "variant", Action: "comment", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "report", Action: "generate", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	{Resource: "file", Action: "download", Scope: "org", MinOrgRole: "org_editor", MinTenantRole: "tenant_admin"},
	// Tenant-scoped actions (data reads)
	{Resource: "patient", Action: "search", Scope: "tenant", MinTenantRole: "tenant_member"},
	{Resource: "case", Action: "search", Scope: "tenant", MinTenantRole: "tenant_member"},
	{Resource: "case", Action: "view", Scope: "tenant", MinTenantRole: "tenant_member"},
	{Resource: "kb", Action: "search", Scope: "tenant", MinTenantRole: "tenant_member"},
	{Resource: "kb", Action: "view", Scope: "tenant", MinTenantRole: "tenant_member"},
	// Tenant admin actions
	{Resource: "project", Action: "create", Scope: "tenant", MinTenantRole: "tenant_admin"},
	{Resource: "user", Action: "invite", Scope: "tenant", MinTenantRole: "tenant_admin"},
	{Resource: "codesystem", Action: "manage", Scope: "tenant", MinTenantRole: "tenant_admin"},
	{Resource: "genepanel", Action: "manage", Scope: "tenant", MinTenantRole: "tenant_admin"},
}

func findPermission(resource, action string) *Permission {
	for i := range permissions {
		if permissions[i].Resource == resource && permissions[i].Action == action {
			return &permissions[i]
		}
	}
	return nil
}

func hasMinOrgRole(userOrgRoles []OrgRole, orgID, minRole string) bool {
	minLevel := orgRoleLevel[minRole]
	for _, r := range userOrgRoles {
		if r.OrgID == orgID && orgRoleLevel[r.Role] >= minLevel {
			return true
		}
	}
	return false
}

func hasMinTenantRole(userTenantRoles []TenantRole, tenantID, minRole string) bool {
	minLevel := tenantRoleLevel[minRole]
	for _, r := range userTenantRoles {
		if r.TenantID == tenantID && tenantRoleLevel[r.Role] >= minLevel {
			return true
		}
	}
	return false
}

// isAllowed checks if a user can perform an action given their roles.
func isAllowed(tenantRoles []TenantRole, orgRoles []OrgRole, tenant, org, resource, action string) bool {
	perm := findPermission(resource, action)
	if perm == nil {
		return false
	}

	if perm.Scope == "tenant" {
		// Tenant-scoped: need MinTenantRole at the tenant
		// Any org role in this tenant also implies tenant_member
		if perm.MinTenantRole != "" && hasMinTenantRole(tenantRoles, tenant, perm.MinTenantRole) {
			return true
		}
		// Org role in this tenant implies tenant_member
		if perm.MinTenantRole == "tenant_member" {
			for _, r := range orgRoles {
				if r.TenantID == tenant {
					return true
				}
			}
		}
		return false
	}

	// Org-scoped: need MinOrgRole at the specific org, OR MinTenantRole at the tenant
	if org == "" {
		return false
	}
	if perm.MinOrgRole != "" && hasMinOrgRole(orgRoles, org, perm.MinOrgRole) {
		return true
	}
	if perm.MinTenantRole != "" && hasMinTenantRole(tenantRoles, tenant, perm.MinTenantRole) {
		return true
	}
	return false
}

// ---------------------------------------------------------------------------
// StarRocks query helpers
// ---------------------------------------------------------------------------

func queryStarRocks(srUser, srPass, dbName, query string) ([]map[string]string, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(starrocks:9030)/%s", srUser, srPass, dbName)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cols, _ := rows.Columns()
	var results []map[string]string

	for rows.Next() {
		values := make([]sql.NullString, len(cols))
		ptrs := make([]interface{}, len(cols))
		for i := range values {
			ptrs[i] = &values[i]
		}
		rows.Scan(ptrs...)

		row := make(map[string]string)
		for i, col := range cols {
			if values[i].Valid {
				row[col] = values[i].String
			} else {
				row[col] = "NULL"
			}
		}
		results = append(results, row)
	}
	return results, nil
}

func execStarRocks(dsn, query string, args ...interface{}) error {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return err
	}
	defer db.Close()
	_, err = db.Exec(query, args...)
	return err
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func getUser(r *http.Request) (*User, error) {
	name := r.Header.Get("X-User")
	if name == "" {
		return nil, fmt.Errorf("missing X-User header")
	}
	u, ok := users[name]
	if !ok {
		return nil, fmt.Errorf("unknown user: %s", name)
	}
	return &u, nil
}

// knownResources distinguishes /{tenant}/{resource} from /{tenant}/{org}/{resource}
var knownResources = map[string]bool{
	"patients": true, "cases": true, "reports": true, "users": true, "kb": true, "projects": true,
}

func parsePath(r *http.Request) (tenant, org, rest string, err error) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/"), "/")
	if len(parts) < 2 {
		return "", "", "", fmt.Errorf("expected /{tenant}/..., got: %s", r.URL.Path)
	}

	tenant = parts[0]
	if knownResources[parts[1]] {
		rest = "/" + strings.Join(parts[1:], "/")
		return tenant, "", rest, nil
	}

	if len(parts) < 3 {
		return "", "", "", fmt.Errorf("expected /{tenant}/{org}/{resource}/..., got: %s", r.URL.Path)
	}
	org = parts[1]
	rest = "/" + strings.Join(parts[2:], "/")
	return tenant, org, rest, nil
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

func healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, 200, map[string]string{"status": "ok"})
}

// GET /auth/me — return user's roles from auth tables
func authMeHandler(w http.ResponseWriter, r *http.Request) {
	user, err := getUser(r)
	if err != nil {
		jsonResponse(w, 401, map[string]string{"error": err.Error()})
		return
	}

	tenantRoles, err := getUserTenantRoles(user.Name)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "failed to fetch tenant roles: " + err.Error()})
		return
	}
	orgRoles, err := getUserOrgRoles(user.Name)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "failed to fetch org roles: " + err.Error()})
		return
	}

	jsonResponse(w, 200, map[string]interface{}{
		"user":         user.Name,
		"tenant_roles": tenantRoles,
		"org_roles":    orgRoles,
	})
}

// POST /admin/grant-org-role — insert into auth_db.user_org_role
func adminGrantOrgRoleHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		OrgID    string `json:"org_id"`
		Role     string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, 400, map[string]string{"error": "invalid JSON: " + err.Error()})
		return
	}
	if req.Username == "" || req.OrgID == "" || req.Role == "" {
		jsonResponse(w, 400, map[string]string{"error": "username, org_id, and role are required"})
		return
	}
	if orgRoleLevel[req.Role] == 0 {
		jsonResponse(w, 400, map[string]string{"error": "invalid role, must be: org_member, org_editor, org_admin, or org_owner"})
		return
	}

	err := execStarRocks(rootDSN("auth_db"),
		"INSERT INTO auth_db.user_org_role (username, org_id, role, granted_by) VALUES (?, ?, ?, 'admin')",
		req.Username, req.OrgID, req.Role)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "grant failed: " + err.Error()})
		return
	}

	jsonResponse(w, 200, map[string]interface{}{
		"status":   "granted",
		"username": req.Username,
		"org_id":   req.OrgID,
		"role":     req.Role,
	})
}

// POST /admin/revoke-org-role — delete from auth_db.user_org_role
func adminRevokeOrgRoleHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		OrgID    string `json:"org_id"`
		Role     string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, 400, map[string]string{"error": "invalid JSON: " + err.Error()})
		return
	}
	if req.Username == "" || req.OrgID == "" || req.Role == "" {
		jsonResponse(w, 400, map[string]string{"error": "username, org_id, and role are required"})
		return
	}

	err := execStarRocks(rootDSN("auth_db"),
		"DELETE FROM auth_db.user_org_role WHERE username = ? AND org_id = ? AND role = ?",
		req.Username, req.OrgID, req.Role)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "revoke failed: " + err.Error()})
		return
	}

	jsonResponse(w, 200, map[string]interface{}{
		"status":   "revoked",
		"username": req.Username,
		"org_id":   req.OrgID,
		"role":     req.Role,
	})
}

// Route matching
type route struct {
	resource string
	action   string
	method   string
	dataDB   string // non-empty: query this database and return results
	dataSQL  string
}

var routes = []route{
	// GET /{tenant}/patients — read clinical data (row-filtered + masked by StarRocks/Ranger)
	{resource: "patient", action: "search", method: "GET", dataDB: "poc_db",
		dataSQL: "SELECT id, first_name, last_name, mrn, date_of_birth, tenant_id, org_id, diagnosis FROM poc_db.patients ORDER BY id"},
	// GET /{tenant}/cases — read operational data (row-filtered by StarRocks/Ranger)
	{resource: "case", action: "view", method: "GET", dataDB: "operational_db",
		dataSQL: "SELECT case_id, patient_id, case_name, status, tenant_id, org_id, created_by FROM operational_db.cases ORDER BY case_id"},
	// POST /{tenant}/{org}/cases — create case
	{resource: "case", action: "create", method: "POST"},
	// interpret variant
	{resource: "variant", action: "interpret"},
	// generate report
	{resource: "report", action: "generate"},
	// invite user
	{resource: "user", action: "invite", method: "POST"},
}

func matchRoute(method, path string) *route {
	switch {
	case strings.HasSuffix(path, "/interpret"):
		return &routes[3]
	case path == "/reports/generate":
		return &routes[4]
	case path == "/users/invite" && method == "POST":
		return &routes[5]
	case path == "/patients" && method == "GET":
		return &routes[0]
	case path == "/cases" && method == "GET":
		return &routes[1]
	case path == "/cases" && method == "POST":
		return &routes[2]
	}
	return nil
}

// tenantHandler handles all /{tenant}/... requests
func tenantHandler(w http.ResponseWriter, r *http.Request) {
	tenant, org, rest, err := parsePath(r)
	if err != nil {
		jsonResponse(w, 400, map[string]string{"error": err.Error()})
		return
	}

	user, err := getUser(r)
	if err != nil {
		jsonResponse(w, 401, map[string]string{"error": err.Error()})
		return
	}

	rt := matchRoute(r.Method, rest)
	if rt == nil {
		jsonResponse(w, 404, map[string]string{"error": "not found", "path": r.URL.Path})
		return
	}

	// Fetch user's roles from auth tables
	tenantRoles, err := getUserTenantRoles(user.Name)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "failed to fetch roles: " + err.Error()})
		return
	}
	orgRoles, err := getUserOrgRoles(user.Name)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "failed to fetch roles: " + err.Error()})
		return
	}

	// Check authorization
	if !isAllowed(tenantRoles, orgRoles, tenant, org, rt.resource, rt.action) {
		jsonResponse(w, 403, map[string]string{
			"error":    "access denied",
			"user":     user.Name,
			"tenant":   tenant,
			"org":      org,
			"action":   rt.action,
			"resource": rt.resource,
		})
		return
	}

	// For POST /cases: insert a new case
	if rt.resource == "case" && rt.action == "create" {
		var body struct {
			CaseName  string `json:"case_name"`
			PatientID int    `json:"patient_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			jsonResponse(w, 400, map[string]string{"error": "invalid JSON: " + err.Error()})
			return
		}

		// Get next case_id (simple approach for POC)
		db, _ := sql.Open("mysql", rootDSN("operational_db"))
		defer db.Close()
		var maxID sql.NullInt64
		db.QueryRow("SELECT MAX(case_id) FROM operational_db.cases").Scan(&maxID)
		nextID := 1
		if maxID.Valid {
			nextID = int(maxID.Int64) + 1
		}

		err := execStarRocks(rootDSN("operational_db"),
			"INSERT INTO operational_db.cases (case_id, patient_id, case_name, status, tenant_id, org_id, created_by) VALUES (?, ?, ?, 'open', ?, ?, ?)",
			nextID, body.PatientID, body.CaseName, tenant, org, user.Name)
		if err != nil {
			jsonResponse(w, 500, map[string]string{"error": "insert failed: " + err.Error()})
			return
		}

		jsonResponse(w, 200, map[string]interface{}{
			"status":   "created",
			"case_id":  nextID,
			"user":     user.Name,
			"tenant":   tenant,
			"org":      org,
			"resource": rt.resource,
			"action":   rt.action,
		})
		return
	}

	// For data queries: run against StarRocks as the user
	if rt.dataDB != "" {
		rows, err := queryStarRocks(user.SRUser, user.SRPass, rt.dataDB, rt.dataSQL)
		if err != nil {
			jsonResponse(w, 500, map[string]string{"error": err.Error()})
			return
		}
		jsonResponse(w, 200, map[string]interface{}{
			"user":     user.Name,
			"tenant":   tenant,
			"org":      org,
			"action":   rt.action,
			"resource": rt.resource,
			"data":     rows,
		})
		return
	}

	// Non-data action (interpret, generate, invite, etc.)
	jsonResponse(w, 200, map[string]string{
		"user":     user.Name,
		"tenant":   tenant,
		"org":      org,
		"action":   rt.action,
		"resource": rt.resource,
		"status":   "allowed",
	})
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/auth/me", authMeHandler)
	mux.HandleFunc("/admin/grant-org-role", adminGrantOrgRoleHandler)
	mux.HandleFunc("/admin/revoke-org-role", adminRevokeOrgRoleHandler)
	mux.HandleFunc("/", tenantHandler)

	log.Println("[poc-api] Starting on :8080")
	log.Println("[poc-api] No Ranger polling — auth tables are the source of truth")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
