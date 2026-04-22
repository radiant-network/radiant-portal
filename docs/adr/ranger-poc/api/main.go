package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

// ---------------------------------------------------------------------------
// Connection config
// ---------------------------------------------------------------------------

// proxyAddr is the mysql-proxy that translates native_password → authentication_jwt
const proxyAddr = "mysql-proxy:9031"

// Root connection for admin operations (direct to StarRocks, native password)
func rootDSN(dbName string) string {
	return fmt.Sprintf("root:@tcp(starrocks:9030)/%s?interpolateParams=true", dbName)
}

// userDSN builds a DSN to connect via the proxy with JWT as the password.
// allowCleartextPasswords=true sends the JWT in cleartext (proxy needs the raw token).
func userDSN(username, jwt, dbName string) string {
	return fmt.Sprintf("%s:%s@tcp(%s)/%s?allowCleartextPasswords=true",
		username, url.QueryEscape(jwt), proxyAddr, dbName)
}

// ---------------------------------------------------------------------------
// Auth-table queries
// ---------------------------------------------------------------------------

type TenantRole struct {
	TenantID string `json:"tenant_id"`
	RoleID   string `json:"role_id"`
}

type OrgRole struct {
	TenantID string `json:"tenant_id"`
	OrgID    string `json:"org_id"`
	RoleID   string `json:"role_id"`
}

func getUserTenantRoles(username, jwt string) ([]TenantRole, error) {
	db, err := sql.Open("mysql", userDSN(username, jwt, "auth_db"))
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(
		"SELECT tenant_id, role_id FROM auth_db.user_tenant_role WHERE username = ?", username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []TenantRole
	for rows.Next() {
		var r TenantRole
		rows.Scan(&r.TenantID, &r.RoleID)
		roles = append(roles, r)
	}
	return roles, nil
}

func getUserOrgRoles(username, jwt string) ([]OrgRole, error) {
	db, err := sql.Open("mysql", userDSN(username, jwt, "auth_db"))
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(
		"SELECT tenant_id, org_id, role_id FROM auth_db.user_org_role WHERE username = ?", username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []OrgRole
	for rows.Next() {
		var r OrgRole
		rows.Scan(&r.TenantID, &r.OrgID, &r.RoleID)
		roles = append(roles, r)
	}
	return roles, nil
}

// ---------------------------------------------------------------------------
// Action-based permission checks
// ---------------------------------------------------------------------------

// Route → action_id mapping
var routeActions = map[string]string{
	"patient.search":    "can_search_case",
	"case.view":         "can_search_case",
	"case.create":       "can_create_case",
	"variant.interpret": "can_interpret_variant",
	"report.generate":   "can_generate_report",
	"user.invite":       "can_invite_user",
}

// hasAction checks if the user has a specific action_id at the given tenant+org scope.
// Uses root connection to query role_action (not subject to row-filter).
func hasAction(username, actionID, tenant, org string) bool {
	db, err := sql.Open("mysql", rootDSN("auth_db"))
	if err != nil {
		return false
	}
	defer db.Close()

	// Check tenant-scoped roles
	var count int
	db.QueryRow(`
		SELECT COUNT(*) FROM auth_db.user_tenant_role utr
		JOIN auth_db.role_action ra ON ra.role_id = utr.role_id
		WHERE utr.username = ? AND utr.tenant_id = ? AND ra.action_id = ?`,
		username, tenant, actionID).Scan(&count)
	if count > 0 {
		return true
	}

	// Check org-scoped roles (specific org or * wildcard)
	if org != "" {
		db.QueryRow(`
			SELECT COUNT(*) FROM auth_db.user_org_role uor
			JOIN auth_db.role_action ra ON ra.role_id = uor.role_id
			WHERE uor.username = ? AND uor.tenant_id = ?
			  AND (uor.org_id = ? OR uor.org_id = '*')
			  AND ra.action_id = ?`,
			username, tenant, org, actionID).Scan(&count)
		if count > 0 {
			return true
		}
	}

	return false
}

// ---------------------------------------------------------------------------
// StarRocks query helpers
// ---------------------------------------------------------------------------

func queryStarRocks(username, jwt, dbName, query string) ([]map[string]string, error) {
	dsn := userDSN(username, jwt, dbName)
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

// UserContext holds the user identity extracted from the JWT
type UserContext struct {
	Username string
	JWT      string // raw JWT token for StarRocks proxy auth
}

// getUser extracts user identity from Authorization: Bearer <jwt> header.
// Decodes the JWT payload (base64, no signature verification — StarRocks validates).
func getUser(r *http.Request) (*UserContext, error) {
	auth := r.Header.Get("Authorization")
	if auth == "" {
		return nil, fmt.Errorf("missing Authorization header")
	}
	if !strings.HasPrefix(auth, "Bearer ") {
		return nil, fmt.Errorf("expected Bearer token")
	}
	jwt := strings.TrimPrefix(auth, "Bearer ")

	// Decode JWT payload to extract preferred_username
	parts := strings.Split(jwt, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid JWT format")
	}

	// Pad base64url
	payload := parts[1]
	if m := len(payload) % 4; m != 0 {
		payload += strings.Repeat("=", 4-m)
	}

	decoded, err := base64.URLEncoding.DecodeString(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to decode JWT payload: %w", err)
	}

	var claims struct {
		PreferredUsername string `json:"preferred_username"`
	}
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return nil, fmt.Errorf("failed to parse JWT claims: %w", err)
	}

	if claims.PreferredUsername == "" {
		return nil, fmt.Errorf("JWT missing preferred_username claim")
	}

	return &UserContext{Username: claims.PreferredUsername, JWT: jwt}, nil
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

	tenantRoles, err := getUserTenantRoles(user.Username, user.JWT)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "failed to fetch tenant roles: " + err.Error()})
		return
	}
	orgRoles, err := getUserOrgRoles(user.Username, user.JWT)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "failed to fetch org roles: " + err.Error()})
		return
	}

	jsonResponse(w, 200, map[string]interface{}{
		"user":         user.Username,
		"tenant_roles": tenantRoles,
		"org_roles":    orgRoles,
	})
}

// POST /admin/grant-org-role — insert into auth_db.user_org_role
func adminGrantOrgRoleHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		TenantID string `json:"tenant_id"`
		OrgID    string `json:"org_id"`
		RoleID   string `json:"role_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, 400, map[string]string{"error": "invalid JSON: " + err.Error()})
		return
	}
	if req.Username == "" || req.TenantID == "" || req.OrgID == "" || req.RoleID == "" {
		jsonResponse(w, 400, map[string]string{"error": "username, tenant_id, org_id, and role_id are required"})
		return
	}

	err := execStarRocks(rootDSN("auth_db"),
		"INSERT INTO auth_db.user_org_role (username, tenant_id, org_id, role_id, granted_by) VALUES (?, ?, ?, ?, 'admin')",
		req.Username, req.TenantID, req.OrgID, req.RoleID)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "grant failed: " + err.Error()})
		return
	}

	jsonResponse(w, 200, map[string]interface{}{
		"status":    "granted",
		"username":  req.Username,
		"tenant_id": req.TenantID,
		"org_id":    req.OrgID,
		"role_id":   req.RoleID,
	})
}

// POST /admin/revoke-org-role — delete from auth_db.user_org_role
func adminRevokeOrgRoleHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		TenantID string `json:"tenant_id"`
		OrgID    string `json:"org_id"`
		RoleID   string `json:"role_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonResponse(w, 400, map[string]string{"error": "invalid JSON: " + err.Error()})
		return
	}
	if req.Username == "" || req.TenantID == "" || req.OrgID == "" || req.RoleID == "" {
		jsonResponse(w, 400, map[string]string{"error": "username, tenant_id, org_id, and role_id are required"})
		return
	}

	err := execStarRocks(rootDSN("auth_db"),
		"DELETE FROM auth_db.user_org_role WHERE username = ? AND tenant_id = ? AND org_id = ? AND role_id = ?",
		req.Username, req.TenantID, req.OrgID, req.RoleID)
	if err != nil {
		jsonResponse(w, 500, map[string]string{"error": "revoke failed: " + err.Error()})
		return
	}

	jsonResponse(w, 200, map[string]interface{}{
		"status":    "revoked",
		"username":  req.Username,
		"tenant_id": req.TenantID,
		"org_id":    req.OrgID,
		"role_id":   req.RoleID,
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

	// Check authorization via action-based model
	actionKey := rt.resource + "." + rt.action
	actionID, ok := routeActions[actionKey]
	if !ok {
		jsonResponse(w, 403, map[string]string{"error": "no action mapped for " + actionKey})
		return
	}

	if !hasAction(user.Username, actionID, tenant, org) {
		jsonResponse(w, 403, map[string]string{
			"error":    "access denied",
			"user":     user.Username,
			"tenant":   tenant,
			"org":      org,
			"action":   rt.action,
			"resource": rt.resource,
		})
		return
	}

	// For POST /cases: insert a new case (uses root for INSERT)
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
			nextID, body.PatientID, body.CaseName, tenant, org, user.Username)
		if err != nil {
			jsonResponse(w, 500, map[string]string{"error": "insert failed: " + err.Error()})
			return
		}

		jsonResponse(w, 200, map[string]interface{}{
			"status":   "created",
			"case_id":  nextID,
			"user":     user.Username,
			"tenant":   tenant,
			"org":      org,
			"resource": rt.resource,
			"action":   rt.action,
		})
		return
	}

	// For data queries: run against StarRocks via proxy as the user
	if rt.dataDB != "" {
		rows, err := queryStarRocks(user.Username, user.JWT, rt.dataDB, rt.dataSQL)
		if err != nil {
			jsonResponse(w, 500, map[string]string{"error": err.Error()})
			return
		}
		jsonResponse(w, 200, map[string]interface{}{
			"user":     user.Username,
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
		"user":     user.Username,
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
	log.Println("[poc-api] Auth: Bearer JWT → StarRocks via mysql-proxy")
	log.Println("[poc-api] Admin: root → StarRocks direct (port 9030)")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
