package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// ---------------------------------------------------------------------------
// Hardcoded users: only StarRocks credentials.
// Roles are fetched from Ranger. Tenant comes from the URL path.
// ---------------------------------------------------------------------------

type User struct {
	Name   string
	SRUser string // StarRocks username
	SRPass string // StarRocks password
}

var users = map[string]User{
	"user_cbtn_submitter_chop": {
		Name: "user_cbtn_submitter_chop", SRUser: "user_cbtn_submitter_chop", SRPass: "submitterpass",
	},
	"user_cbtn_analyst_chop": {
		Name: "user_cbtn_analyst_chop", SRUser: "user_cbtn_analyst_chop", SRPass: "analystchoppass",
	},
	"user_cbtn_analyst_seattle": {
		Name: "user_cbtn_analyst_seattle", SRUser: "user_cbtn_analyst_seattle", SRPass: "analystseattlepass",
	},
	"user_cbtn_network_manager": {
		Name: "user_cbtn_network_manager", SRUser: "user_cbtn_network_manager", SRPass: "networkmanagerpass",
	},
}

// ---------------------------------------------------------------------------
// Ranger role cache: user -> roles (fetched from Ranger, not hardcoded)
// ---------------------------------------------------------------------------

var (
	rangerURL  = "http://ranger:6080"
	rangerAuth = "admin:rangerR0cks!"
)

type RoleCache struct {
	mu    sync.RWMutex
	roles map[string][]string // user -> [role1, role2, ...]
}

var roleCache = &RoleCache{roles: make(map[string][]string)}

func (rc *RoleCache) Get(user string) []string {
	rc.mu.RLock()
	defer rc.mu.RUnlock()
	return rc.roles[user]
}

func (rc *RoleCache) Update(userRoles map[string][]string) {
	rc.mu.Lock()
	defer rc.mu.Unlock()
	rc.roles = userRoles
}

type RangerRole struct {
	Name  string `json:"name"`
	Users []struct {
		Name string `json:"name"`
	} `json:"users"`
}

func fetchUserRoles() map[string][]string {
	// Single call: GET all roles, then invert to user -> [roles]
	url := fmt.Sprintf("%s/service/public/v2/api/roles", rangerURL)
	req, _ := http.NewRequest("GET", url, nil)
	req.SetBasicAuth("admin", "rangerR0cks!")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("[role-poller] Error fetching roles: %v", err)
		return nil
	}
	body, _ := io.ReadAll(resp.Body)
	resp.Body.Close()

	var roles []RangerRole
	if err := json.Unmarshal(body, &roles); err != nil {
		log.Printf("[role-poller] Error parsing roles: %v", err)
		return nil
	}

	// Invert: role.users -> user -> [role names]
	result := make(map[string][]string)
	for _, role := range roles {
		for _, u := range role.Users {
			result[u.Name] = append(result[u.Name], role.Name)
		}
	}
	return result
}

func pollUserRoles(interval time.Duration) {
	for {
		userRoles := fetchUserRoles()
		roleCache.Update(userRoles)
		log.Printf("[role-poller] Cached roles for %d users", len(userRoles))
		for u, r := range userRoles {
			log.Printf("[role-poller]   %s -> %v", u, r)
		}
		time.Sleep(interval)
	}
}

// ---------------------------------------------------------------------------
// Ranger portal policy cache
// ---------------------------------------------------------------------------

type RangerAccess struct {
	Type      string `json:"type"`
	IsAllowed bool   `json:"isAllowed"`
}

type RangerPolicyItem struct {
	Roles    []string       `json:"roles"`
	Users    []string       `json:"users"`
	Accesses []RangerAccess `json:"accesses"`
}

type RangerResourceValue struct {
	Values []string `json:"values"`
}

type RangerPolicy struct {
	Name      string                         `json:"name"`
	Resources map[string]RangerResourceValue `json:"resources"`
	Items     []RangerPolicyItem             `json:"policyItems"`
}

type RangerPolicyDownload struct {
	Policies []RangerPolicy `json:"policies"`
}

type PolicyCache struct {
	mu       sync.RWMutex
	policies []RangerPolicy
}

var portalPolicies = &PolicyCache{}

func (pc *PolicyCache) Update(policies []RangerPolicy) {
	pc.mu.Lock()
	defer pc.mu.Unlock()
	pc.policies = policies
}

func (pc *PolicyCache) IsAllowed(userRoles []string, tenant, org, resource, accessType string) bool {
	pc.mu.RLock()
	defer pc.mu.RUnlock()

	for _, policy := range pc.policies {
		tenantValues := policy.Resources["tenant"].Values
		orgValues := policy.Resources["organization"].Values
		resourceValues := policy.Resources["resource"].Values
		if !matchesAny(tenantValues, tenant) || !matchesAny(orgValues, org) || !matchesAny(resourceValues, resource) {
			continue
		}

		for _, item := range policy.Items {
			if !hasRoleOverlap(item.Roles, userRoles) {
				continue
			}
			for _, access := range item.Accesses {
				if access.Type == accessType && access.IsAllowed {
					return true
				}
			}
		}
	}
	return false
}

// matchesAny checks if any policy value matches the target.
// Policy value "*" matches any target (including empty).
// Empty target (network-scoped request) only matches policy value "*".
func matchesAny(values []string, target string) bool {
	for _, v := range values {
		if v == "*" {
			return true
		}
		if target != "" && v == target {
			return true
		}
	}
	return false
}

func hasRoleOverlap(policyRoles, userRoles []string) bool {
	for _, pr := range policyRoles {
		for _, ur := range userRoles {
			if pr == ur {
				return true
			}
		}
	}
	return false
}

func pollRangerPolicies(serviceName string, interval time.Duration) {
	url := fmt.Sprintf("%s/service/plugins/policies/download/%s", rangerURL, serviceName)

	for {
		resp, err := http.Get(url)
		if err != nil {
			log.Printf("[policy-poller] Error fetching policies: %v", err)
			time.Sleep(interval)
			continue
		}

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var download RangerPolicyDownload
		if err := json.Unmarshal(body, &download); err != nil {
			log.Printf("[policy-poller] Error parsing policies: %v", err)
			time.Sleep(interval)
			continue
		}

		portalPolicies.Update(download.Policies)
		log.Printf("[policy-poller] Cached %d policies for %s", len(download.Policies), serviceName)
		time.Sleep(interval)
	}
}

// ---------------------------------------------------------------------------
// StarRocks query helper
// ---------------------------------------------------------------------------

func queryStarRocks(srUser, srPass, query string) ([]map[string]string, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(starrocks:9030)/poc_db", srUser, srPass)
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

// ---------------------------------------------------------------------------
// HTTP handlers
// ---------------------------------------------------------------------------

func getUser(r *http.Request) (*User, []string, error) {
	name := r.Header.Get("X-User")
	if name == "" {
		return nil, nil, fmt.Errorf("missing X-User header")
	}
	u, ok := users[name]
	if !ok {
		return nil, nil, fmt.Errorf("unknown user: %s", name)
	}
	roles := roleCache.Get(name)
	return &u, roles, nil
}

// knownResources is the set of top-level resource path segments.
// Used to distinguish /{tenant}/{resource} from /{tenant}/{org}/{resource}.
var knownResources = map[string]bool{
	"cases": true, "reports": true, "users": true, "kb": true, "projects": true,
}

// parsePath extracts tenant, organization, and the remaining path.
//
// Two forms:
//   /{tenant}/{resource}/...          → org="" (network-scoped)
//   /{tenant}/{org}/{resource}/...    → org="{org}" (org-scoped)
//
// We distinguish them by checking if the second segment is a known resource name.
func parsePath(r *http.Request) (tenant, org, rest string, err error) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/"), "/")
	if len(parts) < 2 {
		return "", "", "", fmt.Errorf("expected /{tenant}/..., got: %s", r.URL.Path)
	}

	tenant = parts[0]

	if knownResources[parts[1]] {
		// /{tenant}/{resource}/... → network-scoped, no org
		rest = "/" + strings.Join(parts[1:], "/")
		return tenant, "", rest, nil
	}

	if len(parts) < 3 {
		return "", "", "", fmt.Errorf("expected /{tenant}/{org}/{resource}/..., got: %s", r.URL.Path)
	}

	// /{tenant}/{org}/{resource}/...
	org = parts[1]
	rest = "/" + strings.Join(parts[2:], "/")
	return tenant, org, rest, nil
}

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, 200, map[string]string{"status": "ok"})
}

// Route table: path pattern -> (resource, action, needsData)
type route struct {
	resource  string
	action    string
	method    string
	withData  bool // if true, query StarRocks and return results
}

var routes = []route{
	{resource: "case", action: "search", method: "GET", withData: true},       // GET  /{tenant}/cases
	{resource: "case", action: "create", method: "POST", withData: false},     // POST /{tenant}/cases
	{resource: "variant", action: "interpret", method: "", withData: false},    // *    /{tenant}/cases/{id}/interpret
	{resource: "report", action: "generate", method: "", withData: false},     // *    /{tenant}/reports/generate
	{resource: "user", action: "invite", method: "POST", withData: false},     // POST /{tenant}/users/invite
}

func matchRoute(method, path string) *route {
	switch {
	case strings.HasSuffix(path, "/interpret"):
		return &routes[2]
	case path == "/reports/generate":
		return &routes[3]
	case path == "/users/invite" && method == "POST":
		return &routes[4]
	case path == "/cases" && method == "GET":
		return &routes[0]
	case path == "/cases" && method == "POST":
		return &routes[1]
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

	user, roles, err := getUser(r)
	if err != nil {
		jsonResponse(w, 401, map[string]string{"error": err.Error()})
		return
	}

	rt := matchRoute(r.Method, rest)
	if rt == nil {
		jsonResponse(w, 404, map[string]string{"error": "not found", "path": r.URL.Path})
		return
	}

	if !portalPolicies.IsAllowed(roles, tenant, org, rt.resource, rt.action) {
		jsonResponse(w, 403, map[string]string{
			"error":        "access denied",
			"user":         user.Name,
			"tenant":       tenant,
			"organization": org,
			"action":       rt.action,
			"resource":     rt.resource,
			"roles":        strings.Join(roles, ", "),
		})
		return
	}

	if rt.withData {
		rows, err := queryStarRocks(user.SRUser, user.SRPass,
			"SELECT id, first_name, last_name, mrn, date_of_birth, tenant, organization, diagnosis FROM poc_db.patients ORDER BY id")
		if err != nil {
			jsonResponse(w, 500, map[string]string{"error": err.Error()})
			return
		}
		jsonResponse(w, 200, map[string]interface{}{
			"user":         user.Name,
			"tenant":       tenant,
			"organization": org,
			"roles":        roles,
			"action":       rt.action,
			"resource":     rt.resource,
			"patients":     rows,
		})
		return
	}

	jsonResponse(w, 200, map[string]string{
		"user":         user.Name,
		"tenant":       tenant,
		"organization": org,
		"action":       rt.action,
		"resource":     rt.resource,
		"status":       "allowed",
	})
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

func main() {
	// Start polling Ranger for portal policies and user roles
	go pollRangerPolicies("radiant_portal", 10*time.Second)
	go pollUserRoles(30 * time.Second)

	// Wait for the first fetch
	time.Sleep(3 * time.Second)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/", tenantHandler) // All /{tenant}/... routes

	log.Println("[poc-api] Starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
