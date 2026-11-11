package types

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_PcxPatientListTable_TenantBound_ReadsTenantDatabase(t *testing.T) {
	ctx := ContextWithTenant(context.Background(), "cbtn")
	assert.Equal(t, "cbtn_tenant.v_pcx_30_patient_list", PcxPatientListTable.TenantQualifiedName(ctx))
}

func Test_PcxPatientsQuery_CanReadPhiCannotBeFiltered(t *testing.T) {
	_, err := NewListQueryFromCriteria(PcxPatientsQueryConfig, nil,
		[]SearchCriterion{{FieldName: "can_read_phi", Value: []interface{}{true}}}, &Pagination{Limit: 10}, nil)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "can_read_phi can not be filtered")
}

func Test_PcxPatientsQuery_PatientNameIsFilterableButNotSelected(t *testing.T) {
	query, err := NewListQueryFromCriteria(PcxPatientsQueryConfig, []string{"patient_name"},
		[]SearchCriterion{{FieldName: "patient_name", Value: []interface{}{"Ada Lovelace"}}}, &Pagination{Limit: 10}, nil)
	require.NoError(t, err)
	assert.NotContains(t, query.SelectedFields(), PcxPatientNameField)
}

func Test_PcxPatientsQuery_DefaultSortEndsWithPatientKey(t *testing.T) {
	query, err := NewListQueryFromCriteria(PcxPatientsQueryConfig, nil, nil, &Pagination{Limit: 10}, nil)
	require.NoError(t, err)
	assert.Equal(t, []SortField{
		{Field: PcxPatientCanReadPhiField, Order: "desc"},
		{Field: PcxPatientOrganizationCodeField, Order: "asc"},
		{Field: PcxPatientIDField, Order: "asc"},
		{Field: PcxPatientKeyField, Order: "asc"},
	}, query.SortedFields())
}

func Test_PcxPatientsQuery_FilterOnlyFieldsAreNotSelected(t *testing.T) {
	query, err := NewListQueryFromCriteria(PcxPatientsQueryConfig, []string{"age_at_initial_dx_group", "got_radiation_ever", "chemotherapy_agents"},
		[]SearchCriterion{
			{FieldName: "age_at_initial_dx_group", Value: []interface{}{"childhood"}},
			{FieldName: "got_radiation_ever", Value: []interface{}{true}},
			{FieldName: "chemotherapy_agents", Value: []interface{}{"methotrexate"}},
		}, &Pagination{Limit: 10}, nil)
	require.NoError(t, err)
	assert.NotContains(t, query.SelectedFields(), PcxPatientAgeAtInitialDxGroupField)
	assert.NotContains(t, query.SelectedFields(), PcxPatientGotRadiationEverField)
	assert.NotContains(t, query.SelectedFields(), PcxPatientChemotherapyAgentsField)
}

func Test_PcxPatientsQuery_DiagnosisTypeCohortIsSelectedByDefault(t *testing.T) {
	query, err := NewListQueryFromCriteria(PcxPatientsQueryConfig, nil, nil, &Pagination{Limit: 10}, nil)
	require.NoError(t, err)
	assert.Contains(t, query.SelectedFields(), PcxPatientDiagnosisTypeCohortField)
}

func Test_PcxDemographicsTable_TenantBound_ReadsTenantDatabase(t *testing.T) {
	ctx := ContextWithTenant(context.Background(), "cbtn")
	assert.Equal(t, "cbtn_tenant.v_pcx_30_demographics_combined", PcxDemographicsTable.TenantQualifiedName(ctx))
}
