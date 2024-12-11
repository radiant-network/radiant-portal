package main

import (
	"flag"
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
	"log"
	"os"
	"strings"
	"time"
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
	// Initialize database connection
	db, err := database.New()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create repository
	repo := repository.New(db)

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

	occurrencesGroup.Use(ginkeycloak.NewAccessBuilder(keycloakConfig).
		RestrictButForRole(role).
		Build())

	r.GET("/status", server.StatusHandler(repo))
	occurrencesGroup.POST("/:seq_id/count", server.OccurrencesCountHandler(repo))
	occurrencesGroup.POST("/:seq_id/list", server.OccurrencesListHandler(repo))
	occurrencesGroup.POST("/:seq_id/aggregate", server.OccurrencesAggregateHandler(repo))
	r.Run(":8090")
}
