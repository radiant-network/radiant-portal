package types

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

// JsonMap Generic type to handle maps of any primitive type
type JsonMap[K comparable, V any] map[K]V

func (ja JsonMap[K, V]) Value() (driver.Value, error) {
	return json.Marshal(ja)
}

// Scan - Convert a JSON string or byte slice from the database into a JsonArray
func (ja *JsonMap[K, V]) Scan(value interface{}) error {
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
		return fmt.Errorf("unsupported type for JsonMap, got: %T", value)
	}
}
