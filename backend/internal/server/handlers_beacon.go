package server

import (
	"context"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/beacon"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

const (
	beaconIDEnv               = "BEACON_ID"
	beaconNameEnv             = "BEACON_NAME"
	beaconDescriptionEnv      = "BEACON_DESCRIPTION"
	beaconEnvironmentEnv      = "BEACON_ENVIRONMENT"
	beaconProductionStatusEnv = "BEACON_PRODUCTION_STATUS"
	beaconPublicURLEnv        = "BEACON_PUBLIC_URL"
	beaconWelcomeURLEnv       = "BEACON_WELCOME_URL"
	beaconOrgIDEnv            = "BEACON_ORG_ID"
	beaconOrgNameEnv          = "BEACON_ORG_NAME"
	beaconOrgDescriptionEnv   = "BEACON_ORG_DESCRIPTION"
	beaconOrgAddressEnv       = "BEACON_ORG_ADDRESS"
	beaconOrgWelcomeURLEnv    = "BEACON_ORG_WELCOME_URL"
	beaconOrgContactURLEnv    = "BEACON_ORG_CONTACT_URL"
	beaconOrgLogoURLEnv       = "BEACON_ORG_LOGO_URL"
)

// BeaconConfigFromEnv reads the beacon identity once at startup. Only BEACON_PUBLIC_URL has no
// sensible default: the /map endpoint advertises absolute URLs built from it.
func BeaconConfigFromEnv() beacon.Config {
	return beacon.Config{
		ID:               utils.GetEnvOrDefault(beaconIDEnv, "org.radiant-network.beacon"),
		Name:             utils.GetEnvOrDefault(beaconNameEnv, "Radiant Beacon"),
		Description:      utils.GetEnvOrDefault(beaconDescriptionEnv, "Beacon v2 over the Radiant genomic data platform"),
		Environment:      utils.GetEnvOrDefault(beaconEnvironmentEnv, "dev"),
		ProductionStatus: utils.GetEnvOrDefault(beaconProductionStatusEnv, "DEV"),
		PublicURL:        utils.GetEnvOrDefault(beaconPublicURLEnv, "http://localhost:8090"),
		WelcomeURL:       utils.GetEnvOrDefault(beaconWelcomeURLEnv, "https://radiant-network.github.io/radiant-portal/"),
		Organization: beacon.Organization{
			ID:          utils.GetEnvOrDefault(beaconOrgIDEnv, "org.radiant-network"),
			Name:        utils.GetEnvOrDefault(beaconOrgNameEnv, "Radiant Network"),
			Description: utils.GetEnvOrDefault(beaconOrgDescriptionEnv, ""),
			Address:     utils.GetEnvOrDefault(beaconOrgAddressEnv, ""),
			WelcomeURL:  utils.GetEnvOrDefault(beaconOrgWelcomeURLEnv, ""),
			ContactURL:  utils.GetEnvOrDefault(beaconOrgContactURLEnv, ""),
			LogoURL:     utils.GetEnvOrDefault(beaconOrgLogoURLEnv, ""),
		},
	}
}

type beaconVariantsReader interface {
	Exists(ctx context.Context, q beacon.VariantQuery) (bool, error)
	Count(ctx context.Context, q beacon.VariantQuery) (int64, error)
	List(ctx context.Context, q beacon.VariantQuery, skip, limit int) ([]types.BeaconVariant, error)
	GetByLocusID(ctx context.Context, locusID int64) (*types.BeaconVariant, error)
}

type projectsReader interface {
	ListByTenant(ctx context.Context, tenantCode string) ([]types.Project, error)
	GetByCode(ctx context.Context, tenantCode, code string) (*types.Project, error)
}

func handleBeaconError(c *gin.Context, tenant string, status int, message string) {
	c.JSON(status, beacon.NewErrorResponse(beaconIDFor(c, tenant), status, message))
}

func handleBeaconInternalError(c *gin.Context, tenant string, err error) {
	logInternalError(c, err)
	c.JSON(http.StatusInternalServerError, beacon.NewErrorResponse(beaconIDFor(c, tenant), http.StatusInternalServerError, "Internal Server Error"))
}

// beaconIDFor resolves the beacon id for error envelopes. The config is stored on the gin context
// by the handlers so the middleware, which has no config, can still name the beacon.
func beaconIDFor(c *gin.Context, tenant string) string {
	if v, ok := c.Get(beaconConfigContextKey); ok {
		if cfg, ok := v.(beacon.Config); ok {
			return cfg.BeaconID(tenant)
		}
	}
	return tenant
}

const beaconConfigContextKey = "beacon_config"

// WithBeaconConfig makes the beacon config available to the error writers downstream.
func WithBeaconConfig(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(beaconConfigContextKey, cfg)
		c.Next()
	}
}

// beaconTenant reads the tenant stored by RequireTenantAccess or RequireTenantExists.
func beaconTenant(c *gin.Context) (string, bool) {
	tenant, err := GetTenant(c)
	if err != nil {
		handleBeaconInternalError(c, c.Param("tenant"), err)
		return "", false
	}
	return *tenant, true
}

// BeaconInfoHandler serves the beacon description
// @Summary Beacon: describe this beacon
// @Id beaconInfo
// @Description GA4GH Beacon v2 informational endpoint. Public, no token required. With requestedSchema=ga4gh-service-info-v1.0 the response is the GA4GH service-info document instead.
// @Tags beacon
// @Param tenant path string true "Tenant code"
// @Param requestedSchema query string false "ga4gh-service-info-v1.0 to get the service-info format"
// @Produce json
// @Success 200 {object} beacon.InfoResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/info [get]
func BeaconInfoHandler(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, ok := beaconTenant(c)
		if !ok {
			return
		}
		if c.Query("requestedSchema") == "ga4gh-service-info-v1.0" {
			c.JSON(http.StatusOK, beacon.NewServiceInfo(cfg, tenant))
			return
		}
		c.JSON(http.StatusOK, beacon.NewInfoResponse(cfg, tenant))
	}
}

// BeaconServiceInfoHandler serves the GA4GH service-info document
// @Summary Beacon: GA4GH service-info
// @Id beaconServiceInfo
// @Description GA4GH service-info (v1.0) for this beacon. Public, no token required.
// @Tags beacon
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} beacon.ServiceInfo
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/service-info [get]
func BeaconServiceInfoHandler(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if tenant, ok := beaconTenant(c); ok {
			c.JSON(http.StatusOK, beacon.NewServiceInfo(cfg, tenant))
		}
	}
}

// BeaconConfigurationHandler serves the beacon configuration
// @Summary Beacon: configuration
// @Id beaconConfiguration
// @Description Maturity, security attributes and the entry types this beacon implements. Public, no token required.
// @Tags beacon
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} beacon.ConfigurationResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/configuration [get]
func BeaconConfigurationHandler(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if tenant, ok := beaconTenant(c); ok {
			c.JSON(http.StatusOK, beacon.NewConfigurationResponse(cfg, tenant))
		}
	}
}

// BeaconEntryTypesHandler serves the entry type definitions
// @Summary Beacon: entry types
// @Id beaconEntryTypes
// @Description The entry types this beacon implements (genomicVariation, dataset). Public, no token required.
// @Tags beacon
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} beacon.EntryTypesResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/entry_types [get]
func BeaconEntryTypesHandler(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if tenant, ok := beaconTenant(c); ok {
			c.JSON(http.StatusOK, beacon.NewEntryTypesResponse(cfg, tenant))
		}
	}
}

// BeaconMapHandler serves the endpoint map
// @Summary Beacon: endpoint map
// @Id beaconMap
// @Description The query endpoints this beacon exposes, as absolute URLs. Public, no token required.
// @Tags beacon
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} beacon.MapResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/map [get]
func BeaconMapHandler(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if tenant, ok := beaconTenant(c); ok {
			c.JSON(http.StatusOK, beacon.NewMapResponse(cfg, tenant))
		}
	}
}

// BeaconFilteringTermsHandler serves the accepted filtering terms
// @Summary Beacon: filtering terms
// @Id beaconFilteringTerms
// @Description Ontology filters this beacon accepts. Empty in this release: queries with filters are rejected. Public, no token required.
// @Tags beacon
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {object} beacon.FilteringTermsResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/filtering_terms [get]
func BeaconFilteringTermsHandler(cfg beacon.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if tenant, ok := beaconTenant(c); ok {
			c.JSON(http.StatusOK, beacon.NewFilteringTermsResponse(cfg, tenant))
		}
	}
}

// granularityCeiling is the most detailed answer the caller may receive: can_search_case opens
// record-level variant documents, anyone else admitted to the route (can_view_kb) gets counts.
func granularityCeiling(c *gin.Context, auth utils.Auth, actions actionChecker, tenant string) (beacon.Granularity, error) {
	userID, err := auth.RetrieveUserIdFromToken(c)
	if err != nil {
		return "", err
	}
	canSearch, err := actions.HasAction(c.Request.Context(), *userID, tenant, TenantWideOrg, types.ActionSearchCase)
	if err != nil {
		return "", err
	}
	if canSearch {
		return beacon.GranularityRecord, nil
	}
	return beacon.GranularityCount, nil
}

func parseBeaconRequest(c *gin.Context) (*beacon.Request, error) {
	if c.Request.Method == http.MethodPost {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			return nil, &beacon.RequestError{Status: http.StatusBadRequest, Message: "unable to read request body"}
		}
		return beacon.ParsePOST(body)
	}
	return beacon.ParseGET(c.Request.URL.Query())
}

func writeBeaconRequestError(c *gin.Context, tenant string, err error) {
	if re, ok := err.(*beacon.RequestError); ok {
		handleBeaconError(c, tenant, re.Status, re.Message)
		return
	}
	handleBeaconInternalError(c, tenant, err)
}

// BeaconGenomicVariationsHandler answers g_variants queries
// @Summary Beacon: query genomic variants
// @Id beaconGenomicVariations
// @Description GA4GH Beacon v2 genomicVariation query over the tenant's variant catalog. Supports sequence (referenceName, start, referenceBases, alternateBases), range (referenceName, start, end), gene (geneId) and aminoacidChange queries. Coordinates are 0-based interbase, GRCh38. Granularity is clamped to the caller's entitlement: can_search_case → record, can_view_kb → count. The same query can be sent as a POST with a Beacon request body.
// @Tags beacon
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param referenceName query string false "Chromosome: 17, chr17 or NC_000017.11"
// @Param start query string false "0-based start (one value; two values = bracket query, not supported)"
// @Param end query string false "0-based exclusive end (range query)"
// @Param referenceBases query string false "Reference allele (sequence query)"
// @Param alternateBases query string false "Alternate allele"
// @Param variantType query string false "SNP, INS, DEL, INDEL or MNP"
// @Param geneId query string false "HGNC gene symbol"
// @Param aminoacidChange query string false "One-letter (V600E) or HGVS (p.Val600Glu) amino acid change"
// @Param variantMinLength query int false "Minimum allele length"
// @Param variantMaxLength query int false "Maximum allele length"
// @Param assemblyId query string false "GRCh38 (default and only supported assembly)"
// @Param requestedGranularity query string false "boolean (default), count or record"
// @Param includeResultsetResponses query string false "HIT (default), ALL, NONE or MISS"
// @Param skip query int false "Records to skip (record granularity)"
// @Param limit query int false "Page size, 1-100 (record granularity)"
// @Produce json
// @Success 200 {object} beacon.ResultsetsResponse
// @Failure 400 {object} beacon.ErrorResponse
// @Failure 401 {object} beacon.ErrorResponse
// @Failure 403 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Failure 501 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/g_variants [get]
func BeaconGenomicVariationsHandler(cfg beacon.Config, repo beaconVariantsReader, auth utils.Auth, actions actionChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, ok := beaconTenant(c)
		if !ok {
			return
		}
		req, err := parseBeaconRequest(c)
		if err != nil {
			writeBeaconRequestError(c, tenant, err)
			return
		}
		ceiling, err := granularityCeiling(c, auth, actions, tenant)
		if err != nil {
			handleBeaconInternalError(c, tenant, err)
			return
		}
		returned := beacon.Clamp(req.Granularity, ceiling)

		ctx := c.Request.Context()
		answer := beacon.Answer{}
		switch returned {
		case beacon.GranularityBoolean:
			if answer.Exists, err = repo.Exists(ctx, req.Query); err != nil {
				handleBeaconInternalError(c, tenant, err)
				return
			}
		default:
			if answer.Count, err = repo.Count(ctx, req.Query); err != nil {
				handleBeaconInternalError(c, tenant, err)
				return
			}
			answer.Exists = answer.Count > 0
			if returned == beacon.GranularityRecord && answer.Exists {
				rows, err := repo.List(ctx, req.Query, req.Pagination.Skip, req.Pagination.Limit)
				if err != nil {
					handleBeaconInternalError(c, tenant, err)
					return
				}
				answer.Results = make([]any, 0, len(rows))
				for _, row := range rows {
					answer.Results = append(answer.Results, beacon.ToGenomicVariation(row, cfg.BaseURL(tenant)))
				}
			}
		}

		c.JSON(http.StatusOK, beacon.NewResultsetsResponse(cfg.BeaconID(tenant), *req, returned, beacon.EntryTypeGenomicVariation, beacon.SchemaGenomicVariation, tenant, answer))
	}
}

// BeaconGenomicVariationByIDHandler returns one variant by its internal id
// @Summary Beacon: get a genomic variant by id
// @Id beaconGenomicVariationById
// @Description The Beacon genomicVariation document for one variantInternalId (Radiant locus id). Requires can_search_case; other callers receive a count-level answer.
// @Tags beacon
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param id path int true "variantInternalId (locus id)"
// @Produce json
// @Success 200 {object} beacon.ResultsetsResponse
// @Failure 400 {object} beacon.ErrorResponse
// @Failure 401 {object} beacon.ErrorResponse
// @Failure 403 {object} beacon.ErrorResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/g_variants/{id} [get]
func BeaconGenomicVariationByIDHandler(cfg beacon.Config, repo beaconVariantsReader, auth utils.Auth, actions actionChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, ok := beaconTenant(c)
		if !ok {
			return
		}
		locusID, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			handleBeaconError(c, tenant, http.StatusBadRequest, "variant id must be an integer locus id")
			return
		}
		ceiling, err := granularityCeiling(c, auth, actions, tenant)
		if err != nil {
			handleBeaconInternalError(c, tenant, err)
			return
		}
		row, err := repo.GetByLocusID(c.Request.Context(), locusID)
		if err != nil {
			handleBeaconInternalError(c, tenant, err)
			return
		}
		if row == nil {
			handleBeaconError(c, tenant, http.StatusNotFound, "variant not found")
			return
		}
		req := beacon.Request{Granularity: beacon.GranularityRecord, IncludeResultsetResponses: beacon.IncludeHit, Pagination: beacon.Pagination{Limit: 1}, APIVersion: beacon.APIVersion}
		returned := beacon.Clamp(req.Granularity, ceiling)
		answer := beacon.Answer{Exists: true, Count: 1}
		if returned == beacon.GranularityRecord {
			answer.Results = []any{beacon.ToGenomicVariation(*row, cfg.BaseURL(tenant))}
		}
		c.JSON(http.StatusOK, beacon.NewResultsetsResponse(cfg.BeaconID(tenant), req, returned, beacon.EntryTypeGenomicVariation, beacon.SchemaGenomicVariation, tenant, answer))
	}
}

// BeaconDatasetsHandler lists the tenant's datasets (projects)
// @Summary Beacon: list datasets
// @Id beaconDatasets
// @Description The datasets (Radiant projects) of the tenant, as Beacon dataset documents. Records are returned to every tenant member: dataset names are the catalog a client needs before querying. Accepts requestedGranularity, skip and limit; the same request can be sent as a POST.
// @Tags beacon
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param requestedGranularity query string false "boolean, count or record (default record)"
// @Param skip query int false "Records to skip"
// @Param limit query int false "Page size, 1-100"
// @Produce json
// @Success 200 {object} beacon.ResultsetsResponse
// @Failure 400 {object} beacon.ErrorResponse
// @Failure 401 {object} beacon.ErrorResponse
// @Failure 403 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/datasets [get]
func BeaconDatasetsHandler(cfg beacon.Config, repo projectsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, ok := beaconTenant(c)
		if !ok {
			return
		}
		req, err := parseDatasetsRequest(c)
		if err != nil {
			writeBeaconRequestError(c, tenant, err)
			return
		}
		projects, err := repo.ListByTenant(c.Request.Context(), tenant)
		if err != nil {
			handleBeaconInternalError(c, tenant, err)
			return
		}
		answer := beacon.Answer{Exists: len(projects) > 0, Count: int64(len(projects))}
		if req.Granularity == beacon.GranularityRecord {
			answer.Results = []any{}
			for i := req.Pagination.Skip; i < len(projects) && len(answer.Results) < req.Pagination.Limit; i++ {
				answer.Results = append(answer.Results, beacon.ToDataset(projects[i]))
			}
		}
		c.JSON(http.StatusOK, beacon.NewResultsetsResponse(cfg.BeaconID(tenant), *req, req.Granularity, beacon.EntryTypeDataset, beacon.SchemaDataset, tenant, answer))
	}
}

// BeaconDatasetByIDHandler returns one dataset by its id (project code)
// @Summary Beacon: get a dataset by id
// @Id beaconDatasetById
// @Description The Beacon dataset document for one project code.
// @Tags beacon
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param id path string true "Dataset id (project code)"
// @Produce json
// @Success 200 {object} beacon.ResultsetsResponse
// @Failure 401 {object} beacon.ErrorResponse
// @Failure 403 {object} beacon.ErrorResponse
// @Failure 404 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/datasets/{id} [get]
func BeaconDatasetByIDHandler(cfg beacon.Config, repo projectsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, ok := beaconTenant(c)
		if !ok {
			return
		}
		project, err := repo.GetByCode(c.Request.Context(), tenant, c.Param("id"))
		if err != nil {
			handleBeaconInternalError(c, tenant, err)
			return
		}
		if project == nil {
			handleBeaconError(c, tenant, http.StatusNotFound, "dataset not found")
			return
		}
		req := beacon.Request{Granularity: beacon.GranularityRecord, IncludeResultsetResponses: beacon.IncludeHit, Pagination: beacon.Pagination{Limit: 1}, APIVersion: beacon.APIVersion}
		answer := beacon.Answer{Exists: true, Count: 1, Results: []any{beacon.ToDataset(*project)}}
		c.JSON(http.StatusOK, beacon.NewResultsetsResponse(cfg.BeaconID(tenant), req, beacon.GranularityRecord, beacon.EntryTypeDataset, beacon.SchemaDataset, tenant, answer))
	}
}

// parseDatasetsRequest reads only the envelope parameters of a datasets request: there is no
// query to parse, and the dataset catalog defaults to record granularity.
func parseDatasetsRequest(c *gin.Context) (*beacon.Request, error) {
	if c.Request.Method == http.MethodPost {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			return nil, &beacon.RequestError{Status: http.StatusBadRequest, Message: "unable to read request body"}
		}
		return beacon.ParseCollectionPOST(body)
	}
	return beacon.ParseCollectionGET(c.Request.URL.Query())
}

// BeaconGenomicVariationsPostHandler is the POST form of the g_variants query. Same handler:
// the method decides whether parameters come from the query string or the Beacon request body.
// @Summary Beacon: query genomic variants (POST)
// @Id beaconGenomicVariationsPost
// @Description GA4GH Beacon v2 genomicVariation query with a Beacon request body: {"meta":{"apiVersion":"v2.0.0"},"query":{"requestParameters":{...},"requestedGranularity":"count","pagination":{"skip":0,"limit":10}}}. Same parameters and semantics as the GET form.
// @Tags beacon
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param body body object true "Beacon request body (meta, query.requestParameters, query.requestedGranularity, query.pagination)"
// @Accept json
// @Produce json
// @Success 200 {object} beacon.ResultsetsResponse
// @Failure 400 {object} beacon.ErrorResponse
// @Failure 401 {object} beacon.ErrorResponse
// @Failure 403 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Failure 501 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/g_variants [post]
func BeaconGenomicVariationsPostHandler(cfg beacon.Config, repo beaconVariantsReader, auth utils.Auth, actions actionChecker) gin.HandlerFunc {
	return BeaconGenomicVariationsHandler(cfg, repo, auth, actions)
}

// BeaconDatasetsPostHandler is the POST form of the datasets listing.
// @Summary Beacon: list datasets (POST)
// @Id beaconDatasetsPost
// @Description The tenant's datasets, requested with a Beacon request body (query.requestedGranularity, query.pagination). Same semantics as the GET form.
// @Tags beacon
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param body body object false "Beacon request body"
// @Accept json
// @Produce json
// @Success 200 {object} beacon.ResultsetsResponse
// @Failure 400 {object} beacon.ErrorResponse
// @Failure 401 {object} beacon.ErrorResponse
// @Failure 403 {object} beacon.ErrorResponse
// @Failure 500 {object} beacon.ErrorResponse
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/beacon/datasets [post]
func BeaconDatasetsPostHandler(cfg beacon.Config, repo projectsReader) gin.HandlerFunc {
	return BeaconDatasetsHandler(cfg, repo)
}
