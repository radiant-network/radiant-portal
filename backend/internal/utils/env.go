package utils

import "os"

// GetEnvOrDefault retrieves the value of the environment variable named by the key.
// If the variable is not present in the environment, then the provided fallback value is returned.
func GetEnvOrDefault(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

// GetEnvOrPanic retrieves the value of the environment variable named by the key.
// If the variable is not present in the environment, or is empty, the function panics.
func GetEnvOrPanic(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic("Environment variable " + key + " is required but not set or empty")
	}
	return value
}
