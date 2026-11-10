package main

import (
	"log"
	"os"
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

	// Before cleanupFile: swag wraps the YAML lines with the "types." prefixes in, and the YAML
	// encoder must wrap them the same way to leave the other lines unchanged.
	for filePath, rewrite := range map[string]func([]byte) ([]byte, error){
		yamlFilePath:   nullableItemsYAML,
		jsonFilePath:   nullableItemsComponentsLine,
		"docs/docs.go": nullableItemsComponentsLine,
	} {
		if err := rewriteFile(filePath, rewrite); err != nil {
			log.Fatalf("Failed to set nullable items: %v", err)
		}
		log.Printf("Successfully set nullable items in the file %s.", filePath)
	}

	// Process the YAML file
	cleanupFile(yamlFilePath)

	// Process the JSON file
	cleanupFile(jsonFilePath)
}

func cleanupFile(filePath string) {
	// Read the file
	content, err := os.ReadFile(filePath)
	if err != nil {
		log.Printf("Failed to read file %s: %v", filePath, err)
		return
	}

	// Remove all occurrences of "types."
	modifiedContent := strings.ReplaceAll(string(content), "types.", "")

	// Write the modified content back to the file
	err = os.WriteFile(filePath, []byte(modifiedContent), 0644)
	if err != nil {
		log.Printf("Failed to write file %s: %v", filePath, err)
		return
	}

	log.Printf("Successfully removed all occurrences of 'types.' from the file %s.", filePath)
}
