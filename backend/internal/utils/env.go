package utils

import (
	"log"
	"os"
	"strconv"
)

// GetEnvOrDefault retrieves the value of the environment variable named by the key.
// If the variable is not present in the environment, then the provided fallback value is returned.
func GetEnvOrDefault(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

// GetBoolEnvOrDefault retrieves a boolean environment variable named by the key. It accepts
// any form strconv.ParseBool understands (1, t, T, TRUE, true, True, 0, f, FALSE, ...). If the
// variable is unset/empty it returns the fallback; if it is set but unparseable it logs a
// warning and returns the fallback, so a typo like "enabled" can't silently flip a flag.
func GetBoolEnvOrDefault(key string, fallback bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		log.Printf("WARN: environment variable %s=%q is not a valid boolean; using default %t", key, value, fallback)
		return fallback
	}
	return parsed
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
