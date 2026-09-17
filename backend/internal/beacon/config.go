// Package beacon implements the GA4GH Beacon v2 framework envelope, request parsing and the
// genomicVariation / dataset document mapping for Radiant. It is free of HTTP and database
// concerns: handlers live in internal/server, queries in internal/repository.
package beacon

import "strings"

// APIVersion is the Beacon specification version this implementation answers with.
const APIVersion = "v2.0.0"

const (
	EntryTypeGenomicVariation = "genomicVariation"
	EntryTypeDataset          = "dataset"

	SchemaGenomicVariation = "ga4gh-beacon-variant-v2.0.0"
	SchemaDataset          = "ga4gh-beacon-dataset-v2.0.0"

	schemaBase              = "https://raw.githubusercontent.com/ga4gh-beacon/beacon-v2/main"
	genomicVariationSchema  = schemaBase + "/models/json/beacon-v2-default-model/genomicVariations/defaultSchema.json"
	datasetSchema           = schemaBase + "/models/json/beacon-v2-default-model/datasets/defaultSchema.json"
	configurationSchemaRef  = schemaBase + "/framework/json/configuration/beaconConfigurationSchema.json"
	mapSchemaRef            = schemaBase + "/framework/json/configuration/beaconMapSchema.json"
	entryTypesSchemaRef     = schemaBase + "/framework/json/configuration/entryTypesSchema.json"
	filteringTermsSchemaRef = schemaBase + "/framework/json/configuration/filteringTermsSchema.json"
)

type Organization struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Address     string `json:"address,omitempty"`
	WelcomeURL  string `json:"welcomeUrl,omitempty"`
	ContactURL  string `json:"contactUrl,omitempty"`
	LogoURL     string `json:"logoUrl,omitempty"`
} // @name BeaconOrganization

// Config is the deployment-wide Beacon identity. Everything tenant-specific (beacon id, base URL,
// result set id) is derived from it plus the tenant code at request time.
type Config struct {
	ID               string
	Name             string
	Description      string
	Environment      string // prod | test | dev | staging (GA4GH service-info vocabulary)
	ProductionStatus string // DEV | TEST | PROD (Beacon maturityAttributes vocabulary)
	PublicURL        string // scheme://host[:port] the API is reachable at, no trailing slash
	WelcomeURL       string
	Organization     Organization
}

// BeaconID identifies one tenant's beacon: the deployment id suffixed with the tenant code.
func (c Config) BeaconID(tenantCode string) string {
	return c.ID + "." + tenantCode
}

// BaseURL is the root of one tenant's beacon, the prefix every /map endpoint URL is built from.
func (c Config) BaseURL(tenantCode string) string {
	return strings.TrimRight(c.PublicURL, "/") + "/" + tenantCode + "/beacon"
}
