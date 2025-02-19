package main

import (
	"flag"
	"log"
	"os"
	"strings"
	"time"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/client"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/database"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/server"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/golang/glog"
	_ "github.com/joho/godotenv/autoload"
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
	pubmedClient := client.NewPubmedClient()
	repoPostgres := repository.NewPostgresRepository(dbPostgres, pubmedClient)

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

	role := os.Getenv("KEYCLOAK_CLIENT_ROLE")
	// check if role belongs of either ResourceAccess or RealmAccess
	roleAccessMiddleware := ginkeycloak.NewAccessBuilder(keycloakConfig).
		RestrictButForRole(role).
		RestrictButForRealm(role).
		Build()

	occurrencesGroup.Use(roleAccessMiddleware)

	r.GET("/status", server.StatusHandler(repoStarrocks, repoPostgres))
	occurrencesGroup.POST("/:seq_id/count", server.OccurrencesCountHandler(repoStarrocks))
	occurrencesGroup.POST("/:seq_id/list", server.OccurrencesListHandler(repoStarrocks))
	occurrencesGroup.POST("/:seq_id/aggregate", server.OccurrencesAggregateHandler(repoStarrocks))

	interpretationsGroup := r.Group("/interpretations")
	interpretationsGroup.Use(roleAccessMiddleware)
	interpretationsGroup.GET("/pubmed/:citation_id", server.GetPubmedCitation(pubmedClient))
	interpretationsGermlineGroup := interpretationsGroup.Group("/germline/:sequencing_id/:locus_id/:transcript_id")
	interpretationsGermlineGroup.GET("", server.GetInterpretationGermline(repoPostgres.Interpretations))
	interpretationsGermlineGroup.POST("", server.PostInterpretationGermline(repoPostgres.Interpretations))
	interpretationsSomaticGroup := interpretationsGroup.Group("/somatic/:sequencing_id/:locus_id/:transcript_id")
	interpretationsSomaticGroup.GET("", server.GetInterpretationSomatic(repoPostgres.Interpretations))
	interpretationsSomaticGroup.POST("", server.PostInterpretationSomatic(repoPostgres.Interpretations))

	r.Use(gin.Recovery())
	r.Run(":8090")
}
