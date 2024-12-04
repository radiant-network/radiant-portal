package utils

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

// JsonArray Generic type to handle arrays of any primitive type
type JsonArray[T any] []T

func (ja JsonArray[T]) Value() (driver.Value, error) {
	return json.Marshal(ja)
}

// Scan - Convert a JSON string or byte slice from the database into a JsonArray
func (ja *JsonArray[T]) Scan(value interface{}) error {
	// Handle `nil` value
	if value == nil {
		*ja = nil
		return nil
	}

	// Handle `[]uint8` (commonly returned for JSON or TEXT columns)
	switch v := value.(type) {
	case []byte:
		// Unmarshal the JSON data into the slice
		return json.Unmarshal(v, ja)
	case string:
		// Also handle string type if returned as text
		return json.Unmarshal([]byte(v), ja)
	default:
		return fmt.Errorf("unsupported type for JsonArray, got: %T", value)
	}
}
