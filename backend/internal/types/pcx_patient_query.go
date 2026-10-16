package types

// PcxPatientListTable is the secured PCX patient list view (scripts/seed/views), one per tenant database. The
// repository reads it through a subquery under this alias, which adds the virtual patient_name and
// age_at_initial_dx_group columns.
var PcxPatientListTable = Table{
	Name:      "v_pcx_30_patient_list",
	Alias:     "pl",
	PerTenant: true,
}

const PcxPatientListDefaultLimit = 10

var PcxPatientKeyField = Field{Name: "patient_key", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientIDField = Field{Name: "patient_id", CanBeSelected: true, CanBeFiltered: true, CanBeSorted: true, Table: PcxPatientListTable}
var PcxPatientIDTypeField = Field{Name: "patient_id_type", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientCanReadPhiField = Field{Name: "can_read_phi", CanBeSelected: true, CanBeSorted: true, Table: PcxPatientListTable}
var PcxPatientRadiantPatientIDField = Field{Name: "radiant_patient_id", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientOrganizationCodeField = Field{Name: "organization_code", CanBeSelected: true, CanBeFiltered: true, CanBeSorted: true, Table: PcxPatientListTable}
var PcxPatientOrganizationNameField = Field{Name: "organization_name", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientGivenNameField = Field{Name: "given_name", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientFamilyNameField = Field{Name: "family_name", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientBirthYearField = Field{Name: "birth_year", CanBeSelected: true, CanBeSorted: true, SortNullsLast: true, Table: PcxPatientListTable}
var PcxPatientGenderField = Field{Name: "gender", CanBeSelected: true, CanBeSorted: true, Table: PcxPatientListTable}
var PcxPatientDiagnosisTypeCohortField = Field{Name: "diagnosis_type_cohort", CanBeSelected: true, CanBeFiltered: true, CanBeSorted: true, SortNullsLast: true, Table: PcxPatientListTable}
var PcxPatientCnsIntegratedDiagnosisField = Field{Name: "cns_integrated_diagnosis", CanBeSelected: true, CanBeFiltered: true, CanBeSorted: true, SortNullsLast: true, Table: PcxPatientListTable}
var PcxPatientCnsIntegratedDiagnosisSourceField = Field{Name: "cns_integrated_diagnosis_source", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientVitalStatusField = Field{Name: "vital_status", CanBeSelected: true, CanBeFiltered: true, CanBeSorted: true, Table: PcxPatientListTable}
var PcxPatientAgeAtVitalStatusDaysField = Field{Name: "age_at_vital_status_days", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientAgeAtInitialDxDaysField = Field{Name: "age_at_initial_dx_days", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientSurvivalDaysField = Field{Name: "survival_days", CanBeSelected: true, CanBeSorted: true, SortNullsLast: true, Table: PcxPatientListTable}
var PcxPatientHasImagingField = Field{Name: "has_imaging", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientCaseCountField = Field{Name: "case_count", CanBeSelected: true, Table: PcxPatientListTable}
var PcxPatientHadInitialRadiationField = Field{Name: "had_initial_radiation", CanBeFiltered: true, Table: PcxPatientListTable}
var PcxPatientHadInitialMethotrexateField = Field{Name: "had_initial_methotrexate", CanBeFiltered: true, Table: PcxPatientListTable}

// PcxPatientNameField is "given_name family_name" where can_read_phi is true and NULL elsewhere, so a
// restricted patient never matches a name criterion.
var PcxPatientNameField = Field{Name: "patient_name", CanBeFiltered: true, Table: PcxPatientListTable}

// PcxPatientAgeAtInitialDxGroupField is under_36_months, 36_months_and_over or unknown.
var PcxPatientAgeAtInitialDxGroupField = Field{Name: "age_at_initial_dx_group", CanBeFiltered: true, Table: PcxPatientListTable}

var PcxPatientListFields = []Field{
	PcxPatientKeyField, PcxPatientIDField, PcxPatientIDTypeField, PcxPatientCanReadPhiField, PcxPatientRadiantPatientIDField,
	PcxPatientOrganizationCodeField, PcxPatientOrganizationNameField, PcxPatientGivenNameField, PcxPatientFamilyNameField,
	PcxPatientBirthYearField, PcxPatientGenderField, PcxPatientDiagnosisTypeCohortField, PcxPatientCnsIntegratedDiagnosisField,
	PcxPatientCnsIntegratedDiagnosisSourceField, PcxPatientVitalStatusField, PcxPatientAgeAtVitalStatusDaysField,
	PcxPatientAgeAtInitialDxDaysField, PcxPatientSurvivalDaysField, PcxPatientHasImagingField, PcxPatientCaseCountField,
	PcxPatientHadInitialRadiationField, PcxPatientHadInitialMethotrexateField, PcxPatientNameField, PcxPatientAgeAtInitialDxGroupField,
}

var PcxPatientsQueryConfig = QueryConfig{
	AllFields: PcxPatientListFields,
	DefaultFields: []Field{
		PcxPatientKeyField, PcxPatientIDField, PcxPatientIDTypeField, PcxPatientCanReadPhiField, PcxPatientRadiantPatientIDField,
		PcxPatientOrganizationCodeField, PcxPatientOrganizationNameField, PcxPatientGivenNameField, PcxPatientFamilyNameField,
		PcxPatientBirthYearField, PcxPatientGenderField, PcxPatientDiagnosisTypeCohortField, PcxPatientCnsIntegratedDiagnosisField,
		PcxPatientCnsIntegratedDiagnosisSourceField, PcxPatientVitalStatusField, PcxPatientAgeAtVitalStatusDaysField, PcxPatientAgeAtInitialDxDaysField, PcxPatientSurvivalDaysField,
		PcxPatientHasImagingField, PcxPatientCaseCountField,
	},
	DefaultSort: []SortField{
		{Field: PcxPatientCanReadPhiField, Order: "desc"},
		{Field: PcxPatientOrganizationCodeField, Order: "asc"},
		{Field: PcxPatientIDField, Order: "asc"},
	},
	IdField: PcxPatientKeyField,
}

// The secured PCX views the patient page reads, one per tenant database (upstream's, scripts/pcx_tables).
var PcxDemographicsTable = Table{Name: "v_pcx_30_demographics_combined", Alias: "d", PerTenant: true}
var PcxPatientLevelTable = Table{Name: "v_pcx_30_patient_level_combined", Alias: "pv", PerTenant: true}
var PcxEventLevelTable = Table{Name: "v_pcx_30_event_level_combined", Alias: "ev", PerTenant: true}
var PcxSurgeryLevelTable = Table{Name: "v_pcx_30_surgery_level_combined", Alias: "su", PerTenant: true}
var PcxRadiationLevelTable = Table{Name: "v_pcx_30_radiation_level_combined", Alias: "ra", PerTenant: true}
var PcxMedicalTherapyTable = Table{Name: "v_pcx_30_medical_therapy_level_combined", Alias: "mt", PerTenant: true}
var PcxMriImagesTable = Table{Name: "v_pcx_30_mri_images_combined", Alias: "mri", PerTenant: true}
var PcxTreatmentSummaryTable = Table{Name: "v_pcx_30_treatment_summary_combined", Alias: "ts", PerTenant: true}
