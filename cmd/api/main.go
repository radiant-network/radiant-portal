package main

import (
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/database"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/server"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"os"
	"strings"
)

var corsAllowedOrigins = strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")

func main() {

	// Initialize database connection
	db, err := database.New()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create repository
	repo := repository.New(db)

	r := gin.Default()
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.Use(cors.New(cors.Config{
		AllowOrigins:     corsAllowedOrigins, // TODO Add this list from env vars
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	r.GET("/status", server.StatusHandler(repo))
	r.POST("/occurrences/:seq_id/count", server.OccurrencesCountHandler(repo))
	r.POST("/occurrences/:seq_id/list", server.OccurrencesListHandler(repo))
	r.POST("/occurrences/:seq_id/aggregate", server.OccurrencesAggregateHandler(repo))

	r.Run(":8080")
}
