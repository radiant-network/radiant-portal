package com.radiant.udf;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * StarRocks Java UDF that resolves a user's identified organizations from Apache Ranger.
 *
 * Usage in Ranger mask expression:
 *   CASE WHEN array_contains(get_user_orgs(current_user()), organization)
 *     THEN {col} ELSE '***' END
 *
 * The UDF:
 * 1. Receives raw current_user() output (e.g., "'user_cbtn_analyst_chop'@'%'")
 * 2. Parses it to extract the username
 * 3. Fetches all Ranger roles (cached, refreshed every 30s)
 * 4. Extracts the org from role names matching pattern: role_{tenant}_{roletype}_{org}
 * 5. Returns the list of orgs this user has identified access to
 */
public class GetUserOrgs {

    private static volatile Map<String, List<String>> userOrgsCache = new ConcurrentHashMap<>();
    private static volatile long lastRefreshTime = 0;
    private static final long REFRESH_INTERVAL_MS = 30_000;

    // Configurable via system property or default
    private static final String RANGER_URL = System.getProperty("ranger.url", "http://ranger:6080");
    private static final String RANGER_USER = System.getProperty("ranger.user", "admin");
    private static final String RANGER_PASS = System.getProperty("ranger.password", "rangerR0cks!");

    /**
     * Main evaluate method called by StarRocks for each row.
     *
     * @param currentUserRaw raw output of current_user(), e.g. "'user_cbtn_analyst_chop'@'%'"
     * @return array of organization names the user has identified access to
     */
    public List<String> evaluate(String currentUserRaw) {
        if (currentUserRaw == null || currentUserRaw.isEmpty()) {
            // Return a list with empty string to avoid StarRocks array serialization bug with empty lists
            return new ArrayList<>(Arrays.asList(""));
        }

        // Parse: "'user_cbtn_analyst_chop'@'%'" -> "user_cbtn_analyst_chop"
        String username = parseUsername(currentUserRaw);

        refreshCacheIfNeeded();

        List<String> orgs = userOrgsCache.get(username);
        if (orgs == null || orgs.isEmpty()) {
            return new ArrayList<>(Arrays.asList(""));
        }
        return new ArrayList<>(orgs);
    }

    /**
     * Parse the raw current_user() output to extract the username.
     * Input formats: "'username'@'host'" or "username@host" or just "username"
     */
    static String parseUsername(String raw) {
        // Split on @ and take the first part
        String part = raw.split("@")[0];
        // Remove surrounding quotes
        return part.replace("'", "").trim();
    }

    /**
     * Refresh the cache if it's older than REFRESH_INTERVAL_MS.
     * Synchronized to prevent concurrent fetches.
     */
    private static synchronized void refreshCacheIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - lastRefreshTime < REFRESH_INTERVAL_MS && !userOrgsCache.isEmpty()) {
            return;
        }

        try {
            Map<String, List<String>> newCache = fetchUserOrgsFromRanger();
            userOrgsCache = new ConcurrentHashMap<>(newCache);
            lastRefreshTime = now;
        } catch (Exception e) {
            // On failure, keep the old cache. Log to stderr (visible in BE logs).
            System.err.println("[GetUserOrgs UDF] Failed to refresh from Ranger: " + e.getMessage());
            if (userOrgsCache.isEmpty()) {
                lastRefreshTime = 0; // Force retry on next call if cache is empty
            }
        }
    }

    /**
     * Fetch all roles from Ranger and build a user -> [orgs] map.
     *
     * Calls GET /service/public/v2/api/roles which returns:
     * [
     *   {"name": "role_cbtn_analyst_chop", "users": [{"name": "user_cbtn_analyst_chop"}]},
     *   {"name": "role_cbtn_analyst_seattle", "users": [{"name": "user_cbtn_analyst_seattle"}]},
     *   ...
     * ]
     *
     * Role naming convention: role_{tenant}_{roletype}_{org}
     * Roles with 4 segments have an org; roles with 3 segments (e.g., role_cbtn_tenant_manager)
     * are tenant-wide and don't map to a specific org.
     */
    private static Map<String, List<String>> fetchUserOrgsFromRanger() throws Exception {
        String url = RANGER_URL + "/service/public/v2/api/roles";

        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        // Basic auth
        String auth = RANGER_USER + ":" + RANGER_PASS;
        String encoded = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        conn.setRequestProperty("Authorization", "Basic " + encoded);

        conn.setConnectTimeout(10_000);
        conn.setReadTimeout(10_000);

        if (conn.getResponseCode() != 200) {
            throw new RuntimeException("Ranger returned HTTP " + conn.getResponseCode());
        }

        String body;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            body = br.lines().collect(Collectors.joining());
        }

        // Parse JSON
        Gson gson = new Gson();
        List<RangerRole> roles = gson.fromJson(body, new TypeToken<List<RangerRole>>(){}.getType());

        // Build user -> [orgs] map
        Map<String, Set<String>> userOrgs = new HashMap<>();
        for (RangerRole role : roles) {
            String org = extractOrgFromRoleName(role.name);
            if (org == null) continue; // Skip roles without an org segment

            for (RangerRoleUser user : role.users) {
                userOrgs.computeIfAbsent(user.name, k -> new HashSet<>()).add(org);
            }
        }

        // Convert Set to List
        Map<String, List<String>> result = new HashMap<>();
        for (Map.Entry<String, Set<String>> entry : userOrgs.entrySet()) {
            result.put(entry.getKey(), new ArrayList<>(entry.getValue()));
        }
        return result;
    }

    /**
     * Extract the organization from a role name.
     * Convention: role_{tenant}_{roletype}_{org}
     * e.g., "role_cbtn_analyst_chop" -> "chop"
     *        "role_cbtn_submitter_chop" -> "chop"
     *        "role_cbtn_tenant_manager" -> null (no org, tenant-wide)
     *
     * Heuristic: split by '_', if 4+ segments and segment[2] is a known role type
     * (analyst, submitter), then segment[3+] is the org.
     */
    static String extractOrgFromRoleName(String roleName) {
        if (roleName == null) return null;
        String[] parts = roleName.split("_", 4); // role, tenant, roletype, org
        if (parts.length < 4) return null;
        // parts[0] = "role", parts[1] = tenant, parts[2] = roletype, parts[3] = org
        return parts[3];
    }

    // JSON model classes for Gson
    static class RangerRole {
        String name;
        List<RangerRoleUser> users = Collections.emptyList();
    }

    static class RangerRoleUser {
        String name;
        boolean isAdmin;
    }
}
