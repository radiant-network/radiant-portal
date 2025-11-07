package main

import (
	"flag"
	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository"
	"log"
	"time"
)

func main() {
	flag.Parse()
	defer glog.Flush()
	dbPostgres, err := database.NewPostgresDB()
	if err != nil {
		log.Fatal("Failed to initialize postgres database: ", err)
	}
	repoBatch := repository.NewBatchRepository(dbPostgres)
	log.Println("Worker started...")
	for {
		nextBatch, err := repoBatch.ClaimNextBatch()
		if err != nil {
			log.Println("Error claiming next batch: ", err)
		}
		if nextBatch != nil {
			log.Println("Processing batch: ", nextBatch)
		}
		time.Sleep(5 * time.Second)
	}

}
