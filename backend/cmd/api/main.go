package main

import (
	"flag"
	"log"
	"os"
	"strings"
	"time"

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

var corsAllowedOrigins = strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")

var keycloakConfig = ginkeycloak.BuilderConfig{
	Service: os.Getenv("KEYCLOAK_CLIENT"),
	Url:     os.Getenv("KEYCLOAK_HOST"),
	Realm:   os.Getenv("KEYCLOAK_REALM"),
}

func init() {
	err := flag.Set("logtostderr", "true")
	if err != nil {
		log.Fatalf("Failed to set logtostderr flag: %v", err)
	} // Log to standard error
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

	// Create repository
	repoStarrocks := repository.NewStarrocksRepository(dbStarrocks)
	repoSeqExp := repository.NewSequencingRepository(dbStarrocks)
	repoVariants := repository.NewVariantsRepository(dbStarrocks)
	repoExomiser := repository.NewExomiserRepository(dbStarrocks)
	repoOccurrences := repository.NewOccurrencesRepository(dbStarrocks)
	repoTerms := repository.NewTermsRepository(dbStarrocks)
	repoCases := repository.NewCasesRepository(dbStarrocks)
	repoAssays := repository.NewAssaysRepository(dbStarrocks)
	repoGenePanels := repository.NewGenePanelsRepository(dbStarrocks)
	pubmedClient := client.NewPubmedClient()
	repoPostgres := repository.NewPostgresRepository(dbPostgres, pubmedClient)
	repoClinvarRCV := repository.NewClinvarRCVRepository(dbStarrocks)

	r := gin.Default()
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.Use(ginglog.Logger(3 * time.Second))
	r.Use(ginkeycloak.RequestLogger([]string{"uid"}, "data"))

	r.Use(cors.New(cors.Config{
		AllowOrigins:     corsAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	occurrencesGroup := r.Group("/occurrences")
	occurrencesGermlineGroup := occurrencesGroup.Group("/germline")

	role := os.Getenv("KEYCLOAK_CLIENT_ROLE")
	// check if role belongs of either ResourceAccess or RealmAccess
	roleAccessMiddleware := ginkeycloak.NewAccessBuilder(keycloakConfig).
		RestrictButForRole(role).
		RestrictButForRealm(role).
		Build()

	occurrencesGroup.Use(roleAccessMiddleware)

	r.GET("/status", server.StatusHandler(repoStarrocks, repoPostgres))
	occurrencesGermlineGroup.POST("/:seq_id/count", server.OccurrencesGermlineCountHandler(repoOccurrences))
	occurrencesGermlineGroup.POST("/:seq_id/list", server.OccurrencesGermlineListHandler(repoOccurrences))
	occurrencesGermlineGroup.POST("/:seq_id/aggregate", server.OccurrencesGermlineAggregateHandler(repoOccurrences))
	occurrencesGermlineGroup.POST("/:seq_id/statistics", server.OccurrencesGermlineStatisticsHandler(repoOccurrences))
	occurrencesGermlineGroup.GET("/:seq_id/:locus_id/expanded", server.GetExpandedGermlineOccurrence(repoOccurrences, repoExomiser))

	interpretationsGroup := r.Group("/interpretations")
	interpretationsGroup.Use(roleAccessMiddleware)
	interpretationsGroup.GET("/pubmed/:citation_id", server.GetPubmedCitation(pubmedClient))
	interpretationsGermlineGroup := interpretationsGroup.Group("/germline/:sequencing_id/:locus_id/:transcript_id")
	interpretationsGermlineGroup.GET("", server.GetInterpretationGermline(repoPostgres.Interpretations))
	interpretationsGermlineGroup.POST("", server.PostInterpretationGermline(repoPostgres.Interpretations))
	interpretationsSomaticGroup := interpretationsGroup.Group("/somatic/:sequencing_id/:locus_id/:transcript_id")
	interpretationsSomaticGroup.GET("", server.GetInterpretationSomatic(repoPostgres.Interpretations))
	interpretationsSomaticGroup.POST("", server.PostInterpretationSomatic(repoPostgres.Interpretations))

	// search endpoints
	interpretationsGroup.GET("/germline", server.SearchInterpretationGermline(repoPostgres.Interpretations))
	interpretationsGroup.GET("/somatic", server.SearchInterpretationSomatic(repoPostgres.Interpretations))

	usersGroup := r.Group("/users")
	usersGroup.GET("/sets/:user_set_id", server.GetUserSet(repoPostgres.UserSets))

	sequencingGroup := r.Group("/sequencing")
	sequencingGroup.Use(roleAccessMiddleware)
	sequencingGroup.GET("/:seq_id", server.GetSequencing(repoSeqExp))

	mondoGroup := r.Group("/mondo")
	mondoGroup.GET("/autocomplete", server.GetMondoTermAutoComplete(repoTerms))

	hpoGroup := r.Group("/hpo")
	hpoGroup.GET("/autocomplete", server.GetHPOTermAutoComplete(repoTerms))

	variantsGroup := r.Group("/variants")
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

	casesGroup := r.Group("/cases")
	casesGroup.POST("/search", server.SearchCasesHandler(repoCases))
	casesGroup.GET("/autocomplete", server.CasesAutocompleteHandler(repoCases))
	casesGroup.POST("/filters", server.CasesFiltersHandler(repoCases))
	casesGroup.GET("/:case_id", server.CaseEntityHandler(repoCases))

	assaysGroup := r.Group("/assays")
	assaysGroup.GET("/:seq_id", server.GetAssayBySeqIdHandler(repoAssays))

	r.Use(gin.Recovery())
	r.Run(":8090")
}
