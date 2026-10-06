package types

import "time"

// PCX 3.0 patient view. Every value comes from the secured v_pcx_30_* views read as the caller, so PHI
// is already resolved per row: patient_id is the MRN when can_read_phi is true and the research ID
// otherwise, and calendar dates are null without PHI access. A day is the patient's age in days.

// PatientIdentity - Identifiers of a PCX patient
// @Description Identifiers of a PCX patient, resolved for the caller. MRN and research ID are never returned together.
// @Name PatientIdentity
type PatientIdentity struct {
	PatientKey       string `json:"patient_key" validate:"required" format:"uuid"` // Opaque key for the patient page URL, the same for every user
	PatientID        string `json:"patient_id" validate:"required"`
	PatientIDType    string `json:"patient_id_type" validate:"required" enums:"mrn,research_id"`
	CanReadPhi       bool   `json:"can_read_phi" validate:"required"`
	RadiantPatientID *int   `json:"radiant_patient_id"` // Portal patient id, null outside the portal
	OrganizationCode string `json:"organization_code" validate:"required"`
	OrganizationName string `json:"organization_name" validate:"required"`
	GivenName        string `json:"given_name" validate:"required"`  // Placeholder when can_read_phi is false
	FamilyName       string `json:"family_name" validate:"required"` // Placeholder when can_read_phi is false
}

// PatientListItem - Line of the patient list
// @Description A PCX patient in the patient list
// @Name PatientListItem
type PatientListItem struct {
	PatientIdentity
	BirthYear                    *int    `json:"birth_year"`
	Gender                       string  `json:"gender" validate:"required" enums:"female,male,unknown"`
	CnsIntegratedDiagnosis       *string `json:"cns_integrated_diagnosis"`        // From the initial event
	CnsIntegratedDiagnosisSource *string `json:"cns_integrated_diagnosis_source"` // Dataset of the diagnosis, e.g. CBTN or OpenPedCan
	VitalStatus                  string  `json:"vital_status" validate:"required" enums:"alive,deceased"`
	AgeAtVitalStatusDays         *int    `json:"age_at_vital_status_days"`
	AgeAtInitialDxDays           *int    `json:"age_at_initial_dx_days"`
	SurvivalDays                 *int    `json:"survival_days"` // Vital status day minus initial diagnosis day
	HasImaging                   bool    `json:"has_imaging" validate:"required"`
	CaseCount                    int     `json:"case_count" validate:"required"` // Portal cases, 0 outside the portal
}

type PatientsSearchResponse = SearchResponse[PatientListItem]

// PatientFilters - Values of the patient list filters
// @Description Values of the patient list filters
// @Name PatientFilters
type PatientFilters struct {
	VitalStatus            []FiltersValue `json:"vital_status" validate:"required"`
	OrganizationCode       []FiltersValue `json:"organization_code" validate:"required"` // label = organization name
	CnsIntegratedDiagnosis []FiltersValue `json:"cns_integrated_diagnosis" validate:"required"`
}

// PatientStatistics - Cohort analytics of the patient list
// @Description Statistics on every patient the caller can see, regardless of the list filters
// @Name PatientStatistics
type PatientStatistics struct {
	Total          int64                           `json:"total" validate:"required"`
	ImagingCount   int64                           `json:"imaging_count" validate:"required"`
	WithCasesCount int64                           `json:"with_cases_count" validate:"required"`
	ByDiagnosis    []Aggregation                   `json:"by_diagnosis" validate:"required"`
	ByAgeBucket    []Aggregation                   `json:"by_age_bucket" validate:"required"` // Keys 0-4, 5-9, 10-14, 15-19, 20+
	ByProtocol     []Aggregation                   `json:"by_protocol" validate:"required"`   // Patients per protocol_name, a patient counted once per protocol
	ByOrganization []PatientOrganizationVitalCount `json:"by_organization" validate:"required"`
	Survival       []PatientSurvival               `json:"survival" validate:"required"` // Input of the Kaplan-Meier
}

// PatientOrganizationVitalCount - Vital status counts of one organization
// @Description Alive and deceased patients of one organization
// @Name PatientOrganizationVitalCount
type PatientOrganizationVitalCount struct {
	OrganizationCode string `json:"organization_code" validate:"required"`
	OrganizationName string `json:"organization_name" validate:"required"`
	Alive            int64  `json:"alive" validate:"required"`
	Deceased         int64  `json:"deceased" validate:"required"`
}

// PatientSurvival - Survival of one patient
// @Description Survival time of one patient, for the Kaplan-Meier
// @Name PatientSurvival
type PatientSurvival struct {
	OrganizationCode       string  `json:"organization_code" validate:"required"`
	CnsIntegratedDiagnosis *string `json:"cns_integrated_diagnosis"`
	Days                   int     `json:"days" validate:"required"`
	Event                  bool    `json:"event" validate:"required"` // true when deceased
}

// PatientDayDate - When something happened to a patient
// @Description Age in days, and the calendar date when the caller can read PHI
// @Name PatientDayDate
type PatientDayDate struct {
	Day  *int         `json:"day"`
	Date *DateISO8601 `json:"date" swaggertype:"string" format:"date" example:"2020-01-31"`
}

// PatientKeyDate - Key date of the patient sidebar
// @Description Key date of the patient sidebar, with the source it comes from
// @Name PatientKeyDate
type PatientKeyDate struct {
	PatientDayDate
	Source string `json:"source" validate:"required" enums:"clinical,registry"`
}

// PatientKeyDates - Key dates of the patient sidebar
// @Description Key dates of the patient sidebar
// @Name PatientKeyDates
type PatientKeyDates struct {
	InitialDiagnosis PatientKeyDate `json:"initial_diagnosis" validate:"required"`
	LatestEncounter  PatientKeyDate `json:"latest_encounter" validate:"required"`
}

// PatientEntity - Patient page
// @Description Data of the patient page
// @Name PatientEntity
type PatientEntity struct {
	PatientListItem
	BirthDate                   *DateISO8601             `json:"birth_date" swaggertype:"string" format:"date" example:"2020-01-31"`
	Race                        *string                  `json:"race"`
	Ethnicity                   *string                  `json:"ethnicity"`
	PostalCode                  *string                  `json:"postal_code"` // Full with PHI access, 3 digits + XX otherwise
	DiagnosisTypeCohort         *string                  `json:"diagnosis_type_cohort"`
	DataTypeCohort              *string                  `json:"data_type_cohort"`
	KeyDates                    PatientKeyDates          `json:"key_dates" validate:"required"`
	InitialDiagnosisEvidenceURL *string                  `json:"initial_diagnosis_evidence_url"` // BRIM link, format to be defined
	VitalStatusAt               PatientDayDate           `json:"vital_status_at" validate:"required"`
	Events                      []PatientEvent           `json:"events" validate:"required"`
	Surgeries                   []PatientSurgery         `json:"surgeries" validate:"required"`
	Radiations                  []PatientRadiation       `json:"radiations" validate:"required"`
	Therapies                   []PatientTherapy         `json:"therapies" validate:"required"`
	Imaging                     []PatientImagingSession  `json:"imaging" validate:"required"`
	TreatmentSummary            *PatientTreatmentSummary `json:"treatment_summary"`
	Cases                       []PatientCase            `json:"cases" validate:"required"`
}

// PatientEvent - Disease event of a patient
// @Description Disease event of a patient
// @Name PatientEvent
type PatientEvent struct {
	PatientDayDate
	EventType                    string   `json:"event_type" validate:"required" enums:"initial_cns_tumor,progressive,recurrence,second_malignancy,deceased,unavailable"`
	CnsDiagnosisCategory         *string  `json:"cns_diagnosis_category"`
	CnsIntegratedDiagnosis       *string  `json:"cns_integrated_diagnosis"`
	CnsIntegratedDiagnosisSource *string  `json:"cns_integrated_diagnosis_source"` // Dataset of the diagnosis, e.g. CBTN or OpenPedCan
	TumorLocations               []string `json:"tumor_locations" validate:"required"`
	TumorLocationOther           *string  `json:"tumor_location_other"`
	Metastasis                   *string  `json:"metastasis"` // Yes, No or Not Applicable, as in the source
	MetastasisLocations          []string `json:"metastasis_locations" validate:"required"`
	MetastasisLocationOther      *string  `json:"metastasis_location_other"`
}

// PatientSurgery - Surgery of a patient
// @Description Surgery of a patient
// @Name PatientSurgery
type PatientSurgery struct {
	PatientDayDate
	ExtentOfTumorResection *string `json:"extent_of_tumor_resection"`
	IsInitialTreatment     *bool   `json:"is_initial_treatment"` // null when Not Reported
}

// PatientDose - Radiation dose
// @Description Radiation dose, raw from the source, not normalized. The unit is Gy, cGy or CGE, or a sentinel such as Not Applicable, Not Reported or Not Available.
// @Name PatientDose
type PatientDose struct {
	Value *string `json:"value"`
	Unit  *string `json:"unit"`
}

// PatientRadiation - Radiation course of a patient
// @Description Radiation course of a patient
// @Name PatientRadiation
type PatientRadiation struct {
	Start              PatientDayDate `json:"start" validate:"required"`
	Stop               PatientDayDate `json:"stop" validate:"required"`
	Site               *string        `json:"site"`
	SiteOther          *string        `json:"site_other"`
	Type               *string        `json:"type"`
	TypeOther          *string        `json:"type_other"`
	CraniospinalDose   PatientDose    `json:"craniospinal_dose" validate:"required"`  // total_radiation_dose
	TotalPrimaryDose   PatientDose    `json:"total_primary_dose" validate:"required"` // total_radiation_dose_focal
	FocalBoostDose     *PatientDose   `json:"focal_boost_dose"`                       // Total to primary minus craniospinal; null unless both are numbers in the same unit
	IsInitialTreatment *bool          `json:"is_initial_treatment"`                   // null when Not Reported
}

// PatientTherapy - Medical therapy of a patient
// @Description Medical therapy of a patient
// @Name PatientTherapy
type PatientTherapy struct {
	Start              PatientDayDate `json:"start" validate:"required"`
	Stop               PatientDayDate `json:"stop" validate:"required"`
	ProtocolNameAndArm *string        `json:"protocol_name_and_arm"`
	ProtocolName       *string        `json:"protocol_name"`
	ProtocolArm        *string        `json:"protocol_arm"`
	ChemotherapyType   *string        `json:"chemotherapy_type"`
	ChemotherapyAgents []string       `json:"chemotherapy_agents" validate:"required"`
	IsInitialTreatment *bool          `json:"is_initial_treatment"` // null when Not Reported
}

// PatientImagingSession - Imaging session of a patient
// @Description Imaging session of a patient
// @Name PatientImagingSession
type PatientImagingSession struct {
	PatientDayDate
	SessionID       string  `json:"session_id" validate:"required"`
	SessionName     string  `json:"session_name" validate:"required"`
	AnatomicalSite  *string `json:"anatomical_site"`
	ImagingModality *string `json:"imaging_modality"`
	FlywheelURL     *string `json:"flywheel_url"`
}

// PatientTreatmentSummary - Initial treatment summary of a patient
// @Description Initial treatment summary of a patient
// @Name PatientTreatmentSummary
type PatientTreatmentSummary struct {
	InitialDx              PatientDayDate `json:"initial_dx" validate:"required"`
	FirstEvent             PatientDayDate `json:"first_event" validate:"required"`
	FirstRadiationEver     PatientDayDate `json:"first_radiation_ever" validate:"required"`
	InitialRadiation       PatientDayDate `json:"initial_radiation" validate:"required"`
	FirstChemoEver         PatientDayDate `json:"first_chemo_ever" validate:"required"`
	InitialChemo           PatientDayDate `json:"initial_chemo" validate:"required"`
	FirstMethotrexateEver  PatientDayDate `json:"first_methotrexate_ever" validate:"required"`
	HadInitialRadiation    bool           `json:"had_initial_radiation" validate:"required"`
	HadInitialChemo        bool           `json:"had_initial_chemo" validate:"required"`
	HadInitialMethotrexate bool           `json:"had_initial_methotrexate" validate:"required"`
	InitialTreatmentOrder  *string        `json:"initial_treatment_order"`
}

// PatientCase - Portal case of a patient
// @Description Portal case the patient is part of
// @Name PatientCase
type PatientCase struct {
	CaseID              int       `json:"case_id" validate:"required"`
	Relationship        string    `json:"relationship" validate:"required"` // proband, or the relationship_to_proband code
	StatusCode          string    `json:"status_code" validate:"required"`
	PriorityCode        *string   `json:"priority_code"`
	CaseTypeCode        string    `json:"case_type_code" validate:"required"`
	AnalysisCatalogCode *string   `json:"analysis_catalog_code"`
	DiagnosisLabCode    string    `json:"diagnosis_lab_code" validate:"required"`
	UpdatedOn           time.Time `json:"updated_on" validate:"required"`
}
