package beacon

import "github.com/radiant-network/radiant-api/internal/types"

// Dataset is the Beacon v2 default dataset document. A Radiant project is one dataset.
type Dataset struct {
	ID          string         `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description,omitempty"`
	Info        map[string]any `json:"info,omitempty"`
} // @name BeaconDataset

func ToDataset(p types.Project) Dataset {
	return Dataset{
		ID:          p.Code,
		Name:        p.Name,
		Description: p.Description,
		Info:        map[string]any{"radiant_project_id": p.ID},
	}
}
