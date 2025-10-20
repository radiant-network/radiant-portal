package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/radiant-network/radiant-api/internal/authorization"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/golang/glog"
	_ "github.com/joho/godotenv/autoload"
	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/server"
	ginglog "github.com/szuecs/gin-glog"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func init() {
	err := flag.Set("logtostderr", "true")
	if err != nil {
		log.Fatalf("Failed to set logtostderr flag: %v", err)
	} // Log to standard error
}

func setupRouter(dbStarrocks *gorm.DB, dbPostgres *gorm.DB) *gin.Engine {
	// Auth service
	auth := utils.NewKeycloakAuth()

	// S3 URL Presigner for IGV returned URLs
	s3Presigner := utils.NewS3PreSigner()

	// Create repository
	repoStarrocks := repository.NewStarrocksRepository(dbStarrocks)
	repoSeqExp := repository.NewSequencingRepository(dbStarrocks)
	repoVariants := repository.NewVariantsRepository(dbStarrocks)
	repoExomiser := repository.NewExomiserRepository(dbStarrocks)
	repoGenes := repository.NewGenesRepository(dbStarrocks)
	repoGermlineCNVOccurrences := repository.NewGermlineCNVOccurrencesRepository(dbStarrocks)
	repoGermlineSNVOccurrences := repository.NewGermlineSNVOccurrencesRepository(dbStarrocks)
	repoTerms := repository.NewTermsRepository(dbStarrocks)
	repoCases := repository.NewCasesRepository(dbStarrocks)
	repoAssays := repository.NewAssaysRepository(dbStarrocks)
	repoGenePanels := repository.NewGenePanelsRepository(dbStarrocks)
	pubmedClient := client.NewPubmedClient()
	repoPostgres := repository.NewPostgresRepository(dbPostgres, pubmedClient)
	repoClinvarRCV := repository.NewClinvarRCVRepository(dbStarrocks)
	repoIGV := repository.NewIGVRepository(dbStarrocks)
	repoDocuments := repository.NewDocumentsRepository(dbStarrocks)
	repoSavedFilters := repository.NewSavedFiltersRepository(dbPostgres)
	repoUserPreferences := repository.NewUserPreferencesRepository(dbPostgres)

	r := gin.Default()
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.Use(ginglog.Logger(3 * time.Second))
	r.Use(ginkeycloak.RequestLogger([]string{"uid"}, "data"))

	var corsAllowedOrigins = strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     corsAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	roleAccessMiddleware, err := authorization.InitAuthorizer()
	if err != nil {
		log.Fatalf("Failed to initialize authorizer: %v", err)
	}

	// Initialize public routes explicitly
	r.GET("/status", server.StatusHandler(repoStarrocks, repoPostgres))

	// Private routes, alphabetically ordered
	// Use privateRoutes instead of `r` for all private routes to automatically apply the role access middleware
	privateRoutes := r.Group("/")
	privateRoutes.Use(roleAccessMiddleware)

	assaysGroup := privateRoutes.Group("/assays")
	assaysGroup.GET("/:seq_id", server.GetAssayBySeqIdHandler(repoAssays))

	casesGroup := privateRoutes.Group("/cases")
	casesGroup.POST("/search", server.SearchCasesHandler(repoCases))
	casesGroup.GET("/autocomplete", server.CasesAutocompleteHandler(repoCases))
	casesGroup.POST("/filters", server.CasesFiltersHandler(repoCases))
	casesGroup.GET("/:case_id", server.CaseEntityHandler(repoCases))
	casesGroup.POST("/:case_id/documents/search", server.CaseEntityDocumentsSearchHandler(repoDocuments))
	casesGroup.POST("/:case_id/documents/filters", server.CaseEntityDocumentsFiltersHandler(repoDocuments))

	geneGroup := privateRoutes.Group("/genes")
	geneGroup.GET("/autocomplete", server.GetGeneAutoCompleteHandler(repoGenes))

	hpoGroup := privateRoutes.Group("/hpo")
	hpoGroup.GET("/autocomplete", server.GetHPOTermAutoComplete(repoTerms))

	igvGroup := privateRoutes.Group("/igv")
	igvGroup.GET("/:seq_id", server.GetIGVHandler(repoIGV, s3Presigner))

	interpretationsGroup := privateRoutes.Group("/interpretations")
	interpretationsGroup.GET("/pubmed/:citation_id", server.GetPubmedCitation(pubmedClient))
	interpretationsGroup.GET("/germline", server.SearchInterpretationGermline(repoPostgres.Interpretations))
	interpretationsGroup.GET("/somatic", server.SearchInterpretationSomatic(repoPostgres.Interpretations))

	interpretationsGermlineGroup := interpretationsGroup.Group("/germline/:sequencing_id/:locus_id/:transcript_id")
	interpretationsGermlineGroup.GET("", server.GetInterpretationGermline(repoPostgres.Interpretations))
	interpretationsGermlineGroup.POST("", server.PostInterpretationGermline(repoPostgres.Interpretations))
	interpretationsSomaticGroup := interpretationsGroup.Group("/somatic/:sequencing_id/:locus_id/:transcript_id")
	interpretationsSomaticGroup.GET("", server.GetInterpretationSomatic(repoPostgres.Interpretations))
	interpretationsSomaticGroup.POST("", server.PostInterpretationSomatic(repoPostgres.Interpretations))

	mondoGroup := privateRoutes.Group("/mondo")
	mondoGroup.GET("/autocomplete", server.GetMondoTermAutoComplete(repoTerms))

	occurrencesGroup := privateRoutes.Group("/occurrences")
	occurrencesGermlineGroup := occurrencesGroup.Group("/germline")

	occurrencesGermlineCNVGroup := occurrencesGermlineGroup.Group("/cnv")
	occurrencesGermlineCNVGroup.POST("/:seq_id/count", server.OccurrencesGermlineCNVCountHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.POST("/:seq_id/list", server.OccurrencesGermlineCNVListHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.POST("/:seq_id/aggregate", server.OccurrencesGermlineCNVAggregateHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.POST("/:seq_id/statistics", server.OccurrencesGermlineCNVStatisticsHandler(repoGermlineCNVOccurrences))
	occurrencesGermlineCNVGroup.GET("/:seq_id/:cnv_id/genes_overlap", server.OccurrencesGermlineCNVGenesOverlapHandler(repoGermlineCNVOccurrences))

	occurrencesGermlineSNVGroup := occurrencesGermlineGroup.Group("/snv")
	occurrencesGermlineSNVGroup.POST("/:seq_id/count", server.OccurrencesGermlineSNVCountHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.POST("/:seq_id/list", server.OccurrencesGermlineSNVListHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.POST("/:seq_id/aggregate", server.OccurrencesGermlineSNVAggregateHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.POST("/:seq_id/statistics", server.OccurrencesGermlineSNVStatisticsHandler(repoGermlineSNVOccurrences))
	occurrencesGermlineSNVGroup.GET("/:seq_id/:locus_id/expanded", server.GetExpandedGermlineSNVOccurrence(repoGermlineSNVOccurrences))

	sequencingGroup := privateRoutes.Group("/sequencing")
	sequencingGroup.GET("/:seq_id", server.GetSequencing(repoSeqExp))

	usersGroup := privateRoutes.Group("/users")
	usersGroup.POST("/saved_filters", server.PostSavedFilterHandler(repoSavedFilters, auth))
	usersGroup.PUT("/saved_filters/:saved_filter_id", server.PutSavedFilterHandler(repoSavedFilters, auth))
	usersGroup.DELETE("/saved_filters/:saved_filter_id", server.DeleteSavedFilterHandler(repoSavedFilters, auth))
	usersGroup.GET("/saved_filters/:saved_filter_id", server.GetSavedFilterByIDHandler(repoSavedFilters))
	usersGroup.GET("/saved_filters", server.GetSavedFiltersHandler(repoSavedFilters, auth))
	usersGroup.GET("/sets/:user_set_id", server.GetUserSet(repoPostgres.UserSets))
	usersGroup.GET("/preferences", server.GetUserPreferencesHandler(repoUserPreferences, auth))
	usersGroup.POST("/preferences", server.UpdateUserPreferencesHandler(repoUserPreferences, auth))

	variantsGroup := privateRoutes.Group("/variants")
	variantsGermlineGroup := variantsGroup.Group("/germline")
	variantsGermlineGroup.GET("/:locus_id/header", server.GetGermlineVariantHeader(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/overview", server.GetGermlineVariantOverview(repoVariants, repoExomiser))
	variantsGermlineGroup.GET("/:locus_id/consequences", server.GetGermlineVariantConsequences(repoVariants))
	variantsGermlineGroup.POST("/:locus_id/cases/interpreted", server.GetGermlineVariantInterpretedCases(repoVariants))
	variantsGermlineGroup.POST("/:locus_id/cases/uninterpreted", server.GetGermlineVariantUninterpretedCases(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/cases/interpreted/:seq_id/:transcript_id", server.GetExpandedGermlineVariantInterpretedCase(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/cases/count", server.GetGermlineVariantCasesCount(repoVariants))
	variantsGermlineGroup.GET("/cases/filters", server.GetGermlineVariantCasesFilters(repoVariants))
	variantsGermlineGroup.GET("/:locus_id/conditions/:panel_type", server.GetGermlineVariantConditions(repoGenePanels))
	variantsGermlineGroup.GET("/:locus_id/conditions/clinvar", server.GetGermlineVariantConditionsClinvar(repoClinvarRCV))

	documentsGroup := privateRoutes.Group("/documents")
	documentsGroup.POST("/search", server.SearchDocumentsHandler(repoDocuments))
	documentsGroup.GET("/autocomplete", server.DocumentsAutocompleteHandler(repoDocuments))
	documentsGroup.POST("/filters", server.DocumentsFiltersHandler(repoDocuments))

	r.Use(gin.Recovery())
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
	flag.Parse()
	defer glog.Flush()

	database.MigrateWithEnvDefault()

	// Initialize database connection
	dbStarrocks, err := database.NewStarrocksDB()
	if err != nil {
		log.Print("Failed to initialize starrocks database: ", err)
	}

	dbPostgres, err := database.NewPostgresDB()
	if err != nil {
		log.Fatal("Failed to initialize postgres database: ", err)
	}

	p := os.Getenv("API_PORT")
	if p == "" {
		p = "8090"
	}

	r := setupRouter(dbStarrocks, dbPostgres)
	err = r.Run(fmt.Sprintf(":%s", p))
	if err != nil {
		log.Fatal(err)
	}
}
