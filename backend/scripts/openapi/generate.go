package main

import (
	"io/ioutil"
	"log"
	"os/exec"
	"strings"
)

func main() {
	// Run the swag init command
	cmd := exec.Command("swag", "init", "--v3.1", "--generalInfo", "cmd/api/main.go", "-o", "docs")
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("Failed to run swag init command: %v\nOutput: %s", err, output)
	}

	log.Println("Successfully ran swag init command.")

	// Define the file paths
	yamlFilePath := "docs/swagger.yaml"
	jsonFilePath := "docs/swagger.json"

	// Process the YAML file
	cleanupFile(yamlFilePath)

	// Process the JSON file
	cleanupFile(jsonFilePath)

}

func cleanupFile(filePath string) {
	// Read the file
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Printf("Failed to read file %s: %v", filePath, err)
		return
	}

	// Remove all occurrences of "types."
	modifiedContent := strings.ReplaceAll(string(content), "types.", "")

	// Write the modified content back to the file
	err = ioutil.WriteFile(filePath, []byte(modifiedContent), 0644)
	if err != nil {
		log.Printf("Failed to write file %s: %v", filePath, err)
		return
	}

	log.Printf("Successfully removed all occurrences of 'types.' from the file %s.", filePath)
}
