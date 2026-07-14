package types

import (
	"context"
	"testing"

	"github.com/magiconair/properties/assert"
)

func Test_FieldGetAlias_Return_Alias_If_Not_Empty(t *testing.T) {
	t.Parallel()
	f := Field{
		Name:  "name",
		Alias: "alias",
	}
	assert.Equal(t, f.GetAlias(), "alias")
}

func Test_FieldGetAlias_Return_Name_If_Empty(t *testing.T) {
	t.Parallel()
	f := Field{
		Name: "name",
	}
	assert.Equal(t, f.GetAlias(), "name")
}

func Test_Table_In_QualifiesNameWithSchema(t *testing.T) {
	t.Parallel()
	tbl := Table{Name: "cases", FederationName: "radiant_jdbc.public.cases"}
	assert.Equal(t, tbl.In("radiant_jdbc.public"), "radiant_jdbc.public.cases")
	assert.Equal(t, tbl.In("demo_tenant"), "demo_tenant.cases")
}

func Test_Table_TenantQualifiedName_Federated(t *testing.T) {
	t.Parallel()
	tbl := Table{Name: "cases", FederationName: "radiant_jdbc.public.cases"}
	// No tenant bound → federation schema (unchanged legacy behavior).
	assert.Equal(t, tbl.TenantQualifiedName(context.Background()), "radiant_jdbc.public.cases")
	// Tenant bound → that tenant's view database.
	assert.Equal(t, tbl.TenantQualifiedName(ContextWithTenant(context.Background(), "cbtn")), "cbtn_tenant.cases")
}

func Test_Table_TenantQualifiedName_PerTenant(t *testing.T) {
	t.Parallel()
	tbl := Table{Name: "germline__snv__occurrence", PerTenant: true}
	// No tenant bound → bare name (shared pool default database).
	assert.Equal(t, tbl.TenantQualifiedName(context.Background()), "germline__snv__occurrence")
	// Tenant bound → the tenant database, never any other tenant's.
	assert.Equal(t, tbl.TenantQualifiedName(ContextWithTenant(context.Background(), "cbtn")), "cbtn_tenant.germline__snv__occurrence")
}

func Test_Table_TenantQualifiedName_Shared(t *testing.T) {
	t.Parallel()
	tbl := Table{Name: "snv__variant"}
	// No tenant bound → bare name.
	assert.Equal(t, tbl.TenantQualifiedName(context.Background()), "snv__variant")
	// Tenant bound → the shared base database.
	assert.Equal(t, tbl.TenantQualifiedName(ContextWithTenant(context.Background(), "cbtn")), "radiant.snv__variant")
}

func Test_Table_In_FederationSchemaMatchesFederationName(t *testing.T) {
	t.Parallel()
	// In(FederationSchema) must reproduce the static FederationName so the legacy read path
	// is byte-identical until a tenant is bound to the context.
	assert.Equal(t, CaseTable.In(FederationSchema), CaseTable.FederationName)
	assert.Equal(t, PatientTable.In(FederationSchema), PatientTable.FederationName)
}

func Test_FindSortedFields_Return_Only_Valid_Field_And_Field_That_Can_Be_Sorted(t *testing.T) {
	t.Parallel()
	fields := []Field{
		{Name: "field1", CanBeSorted: true},
		{Name: "field2", CanBeSorted: false},
		{Name: "field3", CanBeSorted: true},
		GermlineSNVLocusIdField,
	}
	sorted := []SortBody{
		{Field: "field1", Order: "asc"},
		{Field: "field2", Order: "desc"},
		{Field: "field3", Order: "asc"},
		{Field: "field4", Order: "asc"},
	}
	expected := []SortField{
		{Field: fields[0], Order: "asc"},
		{Field: fields[2], Order: "asc"},
		{Field: fields[3], Order: "asc"},
	}
	defaultSorted := []SortField{
		{Field: fields[0], Order: "asc"},
	}
	result := findSortedFields(fields, sorted, defaultSorted, GermlineSNVLocusIdField)
	assert.Equal(t, result, expected)
}

func Test_FindSortedFields_Filter_out_Field_With_Bad_Order(t *testing.T) {
	t.Parallel()
	fields := []Field{
		{Name: "field1", CanBeSorted: true},
		{Name: "field2", CanBeSorted: false},
		{Name: "field3", CanBeSorted: true},
		GermlineSNVLocusIdField,
	}
	sorted := []SortBody{
		{Field: "field1", Order: "bad"},
		{Field: "field2", Order: "desc"},
		{Field: "field3", Order: "asc"},
		{Field: "field4", Order: "asc"},
	}
	expected := []SortField{
		{Field: fields[2], Order: "asc"},
		{Field: fields[3], Order: "asc"},
	}
	defaultSorted := []SortField{
		{Field: fields[0], Order: "asc"},
	}
	result := findSortedFields(fields, sorted, defaultSorted, GermlineSNVLocusIdField)
	assert.Equal(t, result, expected)
}
