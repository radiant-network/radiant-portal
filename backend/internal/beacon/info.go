package beacon

// OntologyTerm is the {id, label} pair the framework uses wherever a CURIE is expected.
type OntologyTerm struct {
	ID    string `json:"id"`
	Label string `json:"label,omitempty"`
} // @name BeaconOntologyTerm

type InfoResponse struct {
	Meta     Meta `json:"meta"`
	Response Info `json:"response"`
} // @name BeaconInfoResponse

type Info struct {
	ID             string         `json:"id"`
	Name           string         `json:"name"`
	APIVersion     string         `json:"apiVersion"`
	Environment    string         `json:"environment"`
	Organization   Organization   `json:"organization"`
	Description    string         `json:"description,omitempty"`
	Version        string         `json:"version"`
	WelcomeURL     string         `json:"welcomeUrl,omitempty"`
	AlternativeURL string         `json:"alternativeUrl,omitempty"`
	Info           map[string]any `json:"info,omitempty"`
} // @name BeaconInfo

// ServiceInfo is the GA4GH service-info document (ga4gh-service-info-v1.0).
type ServiceInfo struct {
	ID               string              `json:"id"`
	Name             string              `json:"name"`
	Type             ServiceType         `json:"type"`
	Description      string              `json:"description,omitempty"`
	Organization     ServiceOrganization `json:"organization"`
	ContactURL       string              `json:"contactUrl,omitempty"`
	DocumentationURL string              `json:"documentationUrl,omitempty"`
	Environment      string              `json:"environment,omitempty"`
	Version          string              `json:"version"`
} // @name BeaconServiceInfo

type ServiceType struct {
	Group    string `json:"group"`
	Artifact string `json:"artifact"`
	Version  string `json:"version"`
} // @name BeaconServiceType

type ServiceOrganization struct {
	Name string `json:"name"`
	URL  string `json:"url"`
} // @name BeaconServiceOrganization

type ConfigurationResponse struct {
	Meta     Meta          `json:"meta"`
	Response Configuration `json:"response"`
} // @name BeaconConfigurationResponse

type Configuration struct {
	Schema             string               `json:"$schema"`
	MaturityAttributes MaturityAttributes   `json:"maturityAttributes"`
	SecurityAttributes SecurityAttributes   `json:"securityAttributes"`
	EntryTypes         map[string]EntryType `json:"entryTypes"`
} // @name BeaconConfiguration

type MaturityAttributes struct {
	ProductionStatus string `json:"productionStatus"`
} // @name BeaconMaturityAttributes

type SecurityAttributes struct {
	Description        string      `json:"description,omitempty"`
	DefaultGranularity Granularity `json:"defaultGranularity"`
	SecurityLevels     []string    `json:"securityLevels"`
} // @name BeaconSecurityAttributes

type EntryType struct {
	ID                        string       `json:"id"`
	Name                      string       `json:"name"`
	Description               string       `json:"description,omitempty"`
	OntologyTermForThisType   OntologyTerm `json:"ontologyTermForThisType"`
	PartOfSpecification       string       `json:"partOfSpecification"`
	DefaultSchema             SchemaDef    `json:"defaultSchema"`
	NonFilteredQueriesAllowed bool         `json:"nonFilteredQueriesAllowed"`
} // @name BeaconEntryType

type SchemaDef struct {
	ID                          string `json:"id"`
	Name                        string `json:"name"`
	ReferenceToSchemaDefinition string `json:"referenceToSchemaDefinition"`
	SchemaVersion               string `json:"schemaVersion"`
} // @name BeaconSchemaDef

type EntryTypesResponse struct {
	Meta     Meta       `json:"meta"`
	Response EntryTypes `json:"response"`
} // @name BeaconEntryTypesResponse

type EntryTypes struct {
	Schema     string               `json:"$schema"`
	EntryTypes map[string]EntryType `json:"entryTypes"`
} // @name BeaconEntryTypes

type MapResponse struct {
	Meta     Meta        `json:"meta"`
	Response EndpointMap `json:"response"`
} // @name BeaconMapResponse

type EndpointMap struct {
	Schema       string                 `json:"$schema"`
	EndpointSets map[string]EndpointSet `json:"endpointSets"`
} // @name BeaconEndpointMap

type EndpointSet struct {
	EntryType      string `json:"entryType"`
	RootURL        string `json:"rootUrl"`
	SingleEntryURL string `json:"singleEntryUrl,omitempty"`
} // @name BeaconEndpointSet

type FilteringTermsResponse struct {
	Meta     Meta           `json:"meta"`
	Response FilteringTerms `json:"response"`
} // @name BeaconFilteringTermsResponse

type FilteringTerms struct {
	Schema         string           `json:"$schema"`
	Resources      []map[string]any `json:"resources"`
	FilteringTerms []map[string]any `json:"filteringTerms"`
} // @name BeaconFilteringTerms

// SecurityLevel is the single access tier this beacon serves: every query needs a Keycloak token
// and tenant membership. Informational endpoints stay anonymous, as the framework requires.
const SecurityLevel = "REGISTERED"

func NewInfoResponse(cfg Config, tenantCode string) InfoResponse {
	return InfoResponse{
		Meta: infoMeta(cfg.BeaconID(tenantCode)),
		Response: Info{
			ID:             cfg.BeaconID(tenantCode),
			Name:           cfg.Name + " (" + tenantCode + ")",
			APIVersion:     APIVersion,
			Environment:    cfg.Environment,
			Organization:   cfg.Organization,
			Description:    cfg.Description,
			Version:        APIVersion,
			WelcomeURL:     cfg.WelcomeURL,
			AlternativeURL: cfg.BaseURL(tenantCode),
			Info:           map[string]any{"tenant": tenantCode},
		},
	}
}

func NewServiceInfo(cfg Config, tenantCode string) ServiceInfo {
	return ServiceInfo{
		ID:               cfg.BeaconID(tenantCode),
		Name:             cfg.Name + " (" + tenantCode + ")",
		Type:             ServiceType{Group: "org.ga4gh", Artifact: "beacon", Version: "2.0.0"},
		Description:      cfg.Description,
		Organization:     ServiceOrganization{Name: cfg.Organization.Name, URL: cfg.Organization.WelcomeURL},
		ContactURL:       cfg.Organization.ContactURL,
		DocumentationURL: cfg.WelcomeURL,
		Environment:      cfg.Environment,
		Version:          APIVersion,
	}
}

func entryTypes() map[string]EntryType {
	return map[string]EntryType{
		EntryTypeGenomicVariation: {
			ID:                      EntryTypeGenomicVariation,
			Name:                    "Genomic Variants",
			Description:             "Small germline and somatic variants (SNV, indel) with tenant cohort frequencies",
			OntologyTermForThisType: OntologyTerm{ID: "ENSGLOSSARY:0000092", Label: "Variant"},
			PartOfSpecification:     "Beacon v2.0.0",
			DefaultSchema: SchemaDef{
				ID:                          SchemaGenomicVariation,
				Name:                        "Default schema for a genomic variation",
				ReferenceToSchemaDefinition: genomicVariationSchema,
				SchemaVersion:               APIVersion,
			},
			NonFilteredQueriesAllowed: true,
		},
		EntryTypeDataset: {
			ID:                      EntryTypeDataset,
			Name:                    "Dataset",
			Description:             "A Radiant project within the tenant",
			OntologyTermForThisType: OntologyTerm{ID: "NCIT:C47824", Label: "Data set"},
			PartOfSpecification:     "Beacon v2.0.0",
			DefaultSchema: SchemaDef{
				ID:                          SchemaDataset,
				Name:                        "Default schema for datasets",
				ReferenceToSchemaDefinition: datasetSchema,
				SchemaVersion:               APIVersion,
			},
			NonFilteredQueriesAllowed: true,
		},
	}
}

func NewConfigurationResponse(cfg Config, tenantCode string) ConfigurationResponse {
	return ConfigurationResponse{
		Meta: infoMeta(cfg.BeaconID(tenantCode)),
		Response: Configuration{
			Schema:             configurationSchemaRef,
			MaturityAttributes: MaturityAttributes{ProductionStatus: cfg.ProductionStatus},
			SecurityAttributes: SecurityAttributes{
				Description:        "Queries require a Keycloak bearer token and membership in the tenant. Boolean and count answers need can_view_kb; record answers need can_search_case.",
				DefaultGranularity: DefaultGranularity,
				SecurityLevels:     []string{SecurityLevel},
			},
			EntryTypes: entryTypes(),
		},
	}
}

func NewEntryTypesResponse(cfg Config, tenantCode string) EntryTypesResponse {
	return EntryTypesResponse{
		Meta:     infoMeta(cfg.BeaconID(tenantCode)),
		Response: EntryTypes{Schema: entryTypesSchemaRef, EntryTypes: entryTypes()},
	}
}

func NewMapResponse(cfg Config, tenantCode string) MapResponse {
	base := cfg.BaseURL(tenantCode)
	return MapResponse{
		Meta: infoMeta(cfg.BeaconID(tenantCode)),
		Response: EndpointMap{
			Schema: mapSchemaRef,
			EndpointSets: map[string]EndpointSet{
				EntryTypeGenomicVariation: {EntryType: EntryTypeGenomicVariation, RootURL: base + "/g_variants", SingleEntryURL: base + "/g_variants/{id}"},
				EntryTypeDataset:          {EntryType: EntryTypeDataset, RootURL: base + "/datasets", SingleEntryURL: base + "/datasets/{id}"},
			},
		},
	}
}

// NewFilteringTermsResponse is deliberately empty in phase 1: ontology filters arrive with the
// individuals and biosamples entry types.
func NewFilteringTermsResponse(cfg Config, tenantCode string) FilteringTermsResponse {
	return FilteringTermsResponse{
		Meta:     infoMeta(cfg.BeaconID(tenantCode)),
		Response: FilteringTerms{Schema: filteringTermsSchemaRef, Resources: []map[string]any{}, FilteringTerms: []map[string]any{}},
	}
}
