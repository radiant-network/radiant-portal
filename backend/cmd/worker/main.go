package main

import (
	"log"
	"time"
)

func main() {
	log.Println("Worker started...")
	for {
		log.Println("Worker still running ...")
		time.Sleep(2 * time.Minute)
	}

}
