package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/radiant-network/radiant-api/internal/authorization"
	"github.com/radiant-network/radiant-api/internal/observability"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

// glog (pulled in transitively by gin-keycloak) defaults to writing log files under
// /tmp. Our container has no writable /tmp, so when gin-keycloak logs an auth error
// (e.g. an expired token, gin_keycloak.go:217) glog fails to create its file sink and
// escalates to its own Fatal handler, aborting the whole process (SIGABRT, exit 2).
// Forcing logtostderr keeps glog off the filesystem and routes those lines to stderr.
func init() {
	_ = flag.Set("logtostderr", "true")
}

func setupRouter(dbStarrocks *gorm.DB, dbPostgres *gorm.DB) *gin.Engine {
	// Auth service
	auth := utils.NewKeycloakAuth()

	// S3 URL Presigner for IGV returned URLs
	s3Presigner := utils.NewS3PreSigner()

	// Create repository
	repoStarrocks := repository.NewStarrocksRepository(dbStarrocks)
	repoSeqExp := repository.NewSequencingExperimentRepository(dbStarrocks)
	repoVariants := repository.NewVariantsRepository(dbStarrocks)
	repoExomiser := repository.NewExomiserRepository(dbStarrocks)
	repoGenes := repository.NewGenesRepository(dbStarrocks)
	repoGermlineCNVOccurrences := repository.NewGermlineCNVOccurrencesRepository(dbStarrocks)
	repoGermlineSNVOccurrences := repository.NewGermlineSNVOccurrencesRepository(dbStarrocks)
	repoSomaticSNVOccurrences := repository.NewSomaticSNVOccurrencesRepository(dbStarrocks)
	repoTerms := repository.NewTermsRepository(dbStarrocks)
	repoCases := repository.NewCasesRepository(dbStarrocks)
	repoGenePanels := repository.NewGenePanelsRepository(dbStarrocks)
	pubmedClient := client.NewPubmedClient()
	repoPostgres := repository.NewPostgresRepository(dbPostgres, pubmedClient)
	repoClinvarRCV := repository.NewClinvarRCVRepository(dbStarrocks)
	repoIGV := repository.NewIGVRepository(dbStarrocks)
	repoDocuments := repository.NewDocumentsRepository(dbStarrocks)
	repoOccurrenceNotes := repository.NewOccurrenceNotesRepository(dbPostgres)
	repoOccurrenceFlags := repository.NewOccurrenceFlagsRepository(dbPostgres)
	repoSavedFilters := repository.NewSavedFiltersRepository(dbPostgres)
	repoUserPreferences := repository.NewUserPreferencesRepository(dbPostgres)
	repoFacets := repository.NewFacetsRepository()
	repoBatches := repository.NewBatchRepository(dbPostgres)
	repoTasks := repository.NewTaskRepository(dbPostgres)
	repoAuth := repository.NewAuthRepository(dbPostgres)

	r := newEngine()

	authMiddleware, err := authorization.InitAuthorizer()
	if err != nil {
		slog.Error("failed to initialize authorizer", slog.Any("error", err))
		os.Exit(1)
	}

	// Initialize public routes explicitly
	r.GET("/status", server.StatusHandler(repoStarrocks, repoPostgres))

	// Private routes, alphabetically ordered
	// Use privateRoutes instead of `r` for all private routes to automatically apply the auth middleware
	privateRoutes := r.Group("/")
	privateRoutes.Use(authMiddleware)

	// Global routes (not tenant-scoped) stay on privateRoutes: /auth/*, /users/*.
	authGroup := privateRoutes.Group("/auth")
	authGroup.GET("/me", server.GetMeHandler(repoAuth, auth))

	// Tenant-scoped routes live under /:tenant and require the caller to hold at least one
	// role in that tenant (cross-tenant access → 403). The resolved tenant is stored in context.
	tenantRoutes := privateRoutes.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, repoAuth))

	// When enabled, run tenant-scoped StarRocks reads through mysql-proxy as the calling user so
	// Ranger enforces per-user masking / row-filter / access. Off by default; the routing pool
	// otherwise falls back to the root connection (today's behavior). Applied at the GROUP level
	// on purpose: it is what guarantees every /:tenant read has a user pool bound, so the routing
	// pool's root fallback is never reached for tenant data (see routingConnPool's security note).
	if utils.GetBoolEnvOrDefault(server.StarrocksProxyReadEnabledEnv, false) {
		tenantRoutes.Use(server.BindStarrocksUserPool(auth, database.NewStarrocksUserPool))
	}

	requireAction := func(action string) gin.HandlerFunc {
		return server.RequireAction(auth, repoAuth, action)
	}

	casesGroup := tenantRoutes.Group("/cases")
	casesGroup.POST("/search", requireAction(types.ActionSearchCase), server.SearchCasesHandler(repoCases))
	casesGroup.GET("/autocomplete", requireAction(types.ActionSearchCase), server.CasesAutocompleteHandler(repoCases))
	casesGroup.GET("/filters", requireAction(types.ActionSearchCase), server.CasesFiltersHandler(repoCases))
	casesGroup.GET("/:case_id", requireAction(types.ActionSearchCase), server.CaseEntityHandler(repoCases, repoIGV))
	casesGroup.POST("/:case_id/documents/search", requireAction(types.ActionSearchCase), server.CaseEntityDocumentsSearchHandler(repoDocuments))
	casesGroup.GET("/:case_id/documents/filters", requireAction(types.ActionSearchCase), server.CaseEntityDocumentsFiltersHandler(repoDocuments))
	casesGroup.GET("/:case_id/:seq_id/tasks_with_occurrences", requireAction(types.ActionSearchCase), server.CaseOccurrenceTasksHandler(repoTasks))

	geneGroup := tenantRoutes.Group("/genes")
	geneGroup.GET("/autocomplete", requireAction(types.ActionSearchCase), server.GetGeneAutoCompleteHandler(repoGenes))
	geneGroup.POST("/search", requireAction(types.ActionSearchCase), server.SearchGenesHandler(repoGenes))

	hpoGroup := tenantRoutes.Group("/hpo")
	hpoGroup.GET("/autocomplete", requireAction(types.ActionSearchCase), server.GetHPOTermAutoComplete(repoTerms))

	igvGroup := tenantRoutes.Group("/igv")
	igvGroup.GET("/:case_id", requireAction(types.ActionDownloadFile), server.GetIGVHandler(repoIGV, repoCases, s3Presigner))

	interpretationsGroup := tenantRoutes.Group("/interpretations")
	interpretationsGroup.GET("/pubmed/:citation_id", requireAction(types.ActionSearchCase), server.GetPubmedCitation(pubmedClient))
	interpretationsGroup.GET("/germline", requireAction(types.ActionSearchCase), server.SearchInterpretationGermline(repoPostgres.Interpretations))
	interpretationsGroup.GET("/somatic", requireAction(types.ActionSearchCase), server.SearchInterpretationSomatic(repoPostgres.Interpretations))

	interpretationsGermlineGroupDeprecated := interpretationsGroup.Group("/germline/:sequencing_id/:locus_id/:transcript_id")
	interpretationsGermlineGroupDeprecated.GET("", requireAction(types.ActionSearchCase), server.GetInterpretationGermlineDeprecated(repoPostgres.Interpretations))
	interpretationsGermlineGroupDeprecated.POST("", requireAction(types.ActionInterpretVariant), server.PostInterpretationGermlineDeprecated(repoPostgres.Interpretations))
	interpretationsGermlineGroup := interpretationsGroup.Group("/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id")
	interpretationsGermlineGroup.GET("", requireAction(types.ActionSearchCase), server.GetInterpretationGermline(repoPostgres.Interpretations, repoTerms))
	interpretationsGermlineGroup.POST("", requireAction(types.ActionInterpretVariant), server.PostInterpretationGermline(repoPostgres.Interpretations))

	interpretationsSomaticGroupDeprecated := interpretationsGroup.Group("/somatic/:sequencing_id/:locus_id/:transcript_id")
	interpretationsSomaticGroupDeprecated.GET("", requireAction(types.ActionSearchCase), server.GetInterpretationSomaticDeprecated(repoPostgres.Interpretations))
	interpretationsSomaticGroupDeprecated.POST("", requireAction(types.ActionInterpretVariant), server.PostInterpretationSomaticDeprecated(repoPostgres.Interpretations))
	interpretationsSomaticGroup := interpretationsGroup.Group("/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id")
	interpretationsSomaticGroup.GET("", requireAction(types.ActionSearchCase), server.GetInterpretationSomatic(repoPostgres.Interpretations, repoTerms))
	interpretationsSomaticGroup.POST("", requireAction(types.ActionInterpretVariant), server.PostInterpretationSomatic(repoPostgres.Interpretations))

	mondoGroup := tenantRoutes.Group("/mondo")
	mondoGroup.GET("/autocomplete", requireAction(types.ActionSearchCase), server.GetMondoTermAutoComplete(repoTerms))

	notesGroup := tenantRoutes.Group("/notes")
	notesGroup.POST("", requireAction(types.ActionCommentVariant), server.PostOccurrenceNoteHandler(repoOccurrenceNotes, auth))
	notesGroup.PUT("/:id", requireAction(types.ActionCommentVariant), server.PutOccurrenceNoteHandler(repoOccurrenceNotes, auth))
	notesGroup.DELETE("/:id", requireAction(types.ActionCommentVariant), server.DeleteOccurrenceNoteHandler(repoOccurrenceNotes, auth))
	notesGroup.GET("/:case_id/:seq_id/:task_id/:occurrence_id", requireAction(types.ActionSearchCase), server.GetOccurrenceNotesHandler(repoOccurrenceNotes))
	notesGroup.GET("/:case_id/:seq_id/:task_id/:occurrence_id/count", requireAction(types.ActionSearchCase), server.GetOccurrenceNoteCountHandler(repoOccurrenceNotes))

	occurrencesGroup := tenantRoutes.Group("/occurrences")
	occurrencesGermlineGroup := occurrencesGroup.Group("/germline")
	occurrencesSomaticGroup := occurrencesGroup.Group("/somatic")

	occurrenceFlagsGroup := occurrencesGroup.Group("/flags")
	occurrenceFlagsGroup.POST("/:case_id/:seq_id/:task_id/:occurrence_id", requireAction(types.ActionFlagVariant), server.UpsertOccurrenceFlagHandler(repoOccurrenceFlags))
	occurrenceFlagsGroup.DELETE("/:case_id/:seq_id/:task_id/:occurrence_id", requireAction(types.ActionFlagVariant), server.DeleteOccurrenceFlagHandler(repoOccurrenceFlags))

	occurrencesGermlineCNVGroup := occurrencesGermlineGroup.Group("/cnv")
	occurrencesGermlineCNVGroup.POST("/:case_id/:seq_id/:task_id/count", requireAction(types.ActionSearchCase), server.OccurrencesGermlineCNVCountHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.POST("/:case_id/:seq_id/:task_id/list", requireAction(types.ActionSearchCase), server.OccurrencesGermlineCNVListHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.POST("/:case_id/:seq_id/:task_id/aggregate", requireAction(types.ActionSearchCase), server.OccurrencesGermlineCNVAggregateHandler(repoGermlineCNVOccurrences, repoFacets))
	occurrencesGermlineCNVGroup.POST("/:case_id/:seq_id/:task_id/statistics", requireAction(types.ActionSearchCase), server.OccurrencesGermlineCNVStatisticsHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.GET("/:case_id/:seq_id/:task_id/:cnv_id/genes_overlap", requireAction(types.ActionSearchCase), server.OccurrencesGermlineCNVGenesOverlapHandler(repoGermlineCNVOccurrences))

	occurrencesGermlineSNVGroup := occurrencesGermlineGroup.Group("/snv")
	occurrencesGermlineSNVGroup.POST("/:case_id/:seq_id/:task_id/count", requireAction(types.ActionSearchCase), server.OccurrencesGermlineSNVCountHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.POST("/:case_id/:seq_id/:task_id/list", requireAction(types.ActionSearchCase), server.OccurrencesGermlineSNVListHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.POST("/:case_id/:seq_id/:task_id/aggregate", requireAction(types.ActionSearchCase), server.OccurrencesGermlineSNVAggregateHandler(repoGermlineSNVOccurrences, repoFacets))
	occurrencesGermlineSNVGroup.POST("/:case_id/:seq_id/:task_id/statistics", requireAction(types.ActionSearchCase), server.OccurrencesGermlineSNVStatisticsHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.GET("/:case_id/:seq_id/:task_id/:locus_id/expanded", requireAction(types.ActionSearchCase), server.GetExpandedGermlineSNVOccurrence(repoGermlineSNVOccurrences, repoExomiser, repoPostgres.Interpretations))
	occurrencesGermlineSNVGroup.GET("/dictionary", requireAction(types.ActionSearchCase), server.GetGermlineSNVDictionary(repoFacets))

	occurrencesSomaticSNVGroup := occurrencesSomaticGroup.Group("/snv")
	occurrencesSomaticSNVGroup.POST("/:case_id/:seq_id/:task_id/count", requireAction(types.ActionSearchCase), server.OccurrencesSomaticSNVCountHandler(repoSomaticSNVOccurrences))
	occurrencesSomaticSNVGroup.POST("/:case_id/:seq_id/:task_id/list", requireAction(types.ActionSearchCase), server.OccurrencesSomaticSNVListHandler(repoSomaticSNVOccurrences))
	occurrencesSomaticSNVGroup.POST("/:case_id/:seq_id/:task_id/aggregate", requireAction(types.ActionSearchCase), server.OccurrencesSomaticSNVAggregateHandler(repoSomaticSNVOccurrences, repoFacets))
	occurrencesSomaticSNVGroup.POST("/:case_id/:seq_id/:task_id/statistics", requireAction(types.ActionSearchCase), server.OccurrencesSomaticSNVStatisticsHandler(repoSomaticSNVOccurrences))
	occurrencesSomaticSNVGroup.GET("/:case_id/:seq_id/:task_id/:locus_id/expanded", requireAction(types.ActionSearchCase), server.GetExpandedSomaticSNVOccurrence(repoSomaticSNVOccurrences, repoPostgres.Interpretations))

	sequencingGroup := tenantRoutes.Group("/sequencing")
	sequencingGroup.GET("/:seq_id/details", requireAction(types.ActionSearchCase), server.GetSequencingExperimentDetailByIdHandler(repoSeqExp))

	usersGroup := privateRoutes.Group("/users")
	usersGroup.POST("/saved_filters", server.PostSavedFilterHandler(repoSavedFilters, auth))
	usersGroup.PUT("/saved_filters/:saved_filter_id", server.PutSavedFilterHandler(repoSavedFilters, auth))
	usersGroup.DELETE("/saved_filters/:saved_filter_id", server.DeleteSavedFilterHandler(repoSavedFilters, auth))
	usersGroup.GET("/saved_filters/:saved_filter_id", server.GetSavedFilterByIDHandler(repoSavedFilters))
	usersGroup.GET("/saved_filters", server.GetSavedFiltersHandler(repoSavedFilters, auth))
	usersGroup.GET("/sets/:user_set_id", server.GetUserSet(repoPostgres.UserSets))
	usersGroup.GET("/preferences/:key", server.GetUserPreferencesHandler(repoUserPreferences, auth))
	usersGroup.POST("/preferences/:key", server.UpdateUserPreferencesHandler(repoUserPreferences, auth))

	variantsGroup := tenantRoutes.Group("/variants")
	variantsGermlineGroup := variantsGroup.Group("/germline")
	variantsGermlineGroup.GET("/:locus_id/header", requireAction(types.ActionSearchCase), server.GetGermlineVariantHeader(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/overview", requireAction(types.ActionSearchCase), server.GetGermlineVariantOverview(repoVariants, repoExomiser, repoPostgres.Interpretations))
	variantsGermlineGroup.GET("/:locus_id/consequences", requireAction(types.ActionSearchCase), server.GetGermlineVariantConsequences(repoVariants))
	variantsGermlineGroup.POST("/:locus_id/cases/interpreted", requireAction(types.ActionSearchCase), server.GetGermlineVariantInterpretedCases(repoVariants))
	variantsGermlineGroup.POST("/:locus_id/cases/uninterpreted", requireAction(types.ActionSearchCase), server.GetGermlineVariantUninterpretedCases(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/cases/count", requireAction(types.ActionSearchCase), server.GetGermlineVariantCasesCount(repoVariants))
	variantsGermlineGroup.GET("/cases/filters", requireAction(types.ActionSearchCase), server.GetGermlineVariantCasesFilters(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/conditions/:panel_type", requireAction(types.ActionSearchCase), server.GetGermlineVariantConditions(repoGenePanels))
	variantsGermlineGroup.GET("/:locus_id/conditions/clinvar", requireAction(types.ActionSearchCase), server.GetGermlineVariantConditionsClinvar(repoClinvarRCV))
	variantsGermlineGroup.GET("/:locus_id/external_frequencies", requireAction(types.ActionSearchCase), server.GetGermlineVariantExternalFrequenciesHandler(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/internal_frequencies", requireAction(types.ActionSearchCase), server.GetGermlineVariantInternalFrequenciesHandler(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/internal_frequencies/global", requireAction(types.ActionSearchCase), server.GetGermlineVariantGlobalInternalFrequenciesHandler(repoVariants))

	documentsGroup := tenantRoutes.Group("/documents")
	documentsGroup.POST("/search", requireAction(types.ActionSearchCase), server.SearchDocumentsHandler(repoDocuments))
	documentsGroup.GET("/autocomplete", requireAction(types.ActionSearchCase), server.DocumentsAutocompleteHandler(repoDocuments))
	documentsGroup.GET("/filters", requireAction(types.ActionSearchCase), server.DocumentsFiltersHandler(repoDocuments))
	documentsGroup.GET("/:document_id/download_url", requireAction(types.ActionDownloadFile), server.GetDocumentsDownloadUrlHandler(repoDocuments, s3Presigner))

	batchesGroup := tenantRoutes.Group("/batches")
	batchesGroup.GET("/:batch_id", requireAction(types.ActionIngestData), server.GetBatchHandler(repoBatches))

	patientsGroup := tenantRoutes.Group("/patients")
	patientsGroup.POST("/batch", requireAction(types.ActionIngestData), server.PostPatientBatchHandler(repoBatches, auth))
	patientsGroup.PUT("/batch", requireAction(types.ActionIngestData), server.PutPatientBatchHandler(repoBatches, auth))

	samplesGroup := tenantRoutes.Group("/samples")
	samplesGroup.POST("/batch", requireAction(types.ActionIngestData), server.PostSampleBatchHandler(repoBatches, auth))
	samplesGroup.PUT("/batch", requireAction(types.ActionIngestData), server.PutSampleBatchHandler(repoBatches, auth))

	sequencingGroup.POST("/batch", requireAction(types.ActionIngestData), server.PostSequencingExperimentBatchHandler(repoBatches, auth))
	sequencingGroup.PUT("/batch", requireAction(types.ActionIngestData), server.PutSequencingExperimentBatchHandler(repoBatches, auth))

	casesGroup.POST("/batch", requireAction(types.ActionIngestData), server.PostCaseBatchHandler(repoBatches, auth))
	casesGroup.PATCH("/batch", requireAction(types.ActionIngestData), server.PatchCaseBatchHandler(repoBatches, auth))
	casesGroup.PUT("/batch", requireAction(types.ActionIngestData), server.PutCaseBatchHandler(repoBatches, auth))

	return r
}

// newEngine builds the gin engine with the global middleware stack in the correct order.
//
// gin.Recovery() MUST be the innermost (last-registered) global middleware. On a handler
// panic, defers unwind LIFO: the gzip middleware's deferred gz.Close() flushes the gzip
// footer to the response, which commits a 200 status. If Recovery sits outside gzip (as it
// did when this used gin.Default(), which registers Recovery before gzip is added), it runs
// after that flush and can no longer override the status — the client gets 200 instead of
// 500 ("Headers were already written. Wanted to override status code 200 with 500"). By
// registering Recovery after gzip, it recovers and sets 500 first, then gzip compresses the
// 500 response. See SJRA-1578.
func newEngine() *gin.Engine {
	r := gin.New()
	r.Use(server.RequestID())
	r.Use(server.RequestLogger())
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.Use(ginkeycloak.RequestLogger([]string{"uid"}, "data"))

	var corsAllowedOrigins = strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     corsAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	r.Use(gin.Recovery()) // innermost global middleware — see doc comment above
	return r
}

// @version 1.0
// @title Radiant API
// @description This is the API for Radiant data platform.

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @securitydefinitions.bearerauth
// @BasePath /
func main() {
	observability.Setup()

	database.MigrateWithEnvDefault()

	// Initialize database connection
	dbStarrocks, err := database.NewStarrocksDB()
	if err != nil {
		slog.Error("failed to initialize starrocks database", slog.Any("error", err))
		os.Exit(1)
	}

	dbPostgres, err := database.NewPostgresDB()
	if err != nil {
		slog.Error("failed to initialize postgres database", slog.Any("error", err))
		os.Exit(1)
	}

	p := os.Getenv("API_PORT")
	if p == "" {
		p = "8090"
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	if utils.GetBoolEnvOrDefault(viewRefreshOnStartupEnabledEnv, false) {
		if err := refreshTenantViews(ctx, dbPostgres, dbStarrocks); err != nil {
			slog.Error("startup tenant view refresh failed", slog.Any("error", err))
			os.Exit(1)
		}
	}

	r := setupRouter(dbStarrocks, dbPostgres)
	srv := &http.Server{Addr: fmt.Sprintf(":%s", p), Handler: r, ReadHeaderTimeout: 10 * time.Second}

	go func() {
		slog.Info("API server listening", slog.String("port", p))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("API server failed", slog.Any("error", err))
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	stop() // restore default signal handling so a second signal force-quits
	slog.Info("shutdown signal received, draining connections...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), utils.ShutdownTimeout())
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("API server shutdown error", slog.Any("error", err))
	}
	slog.Info("API server shut down cleanly")
}
