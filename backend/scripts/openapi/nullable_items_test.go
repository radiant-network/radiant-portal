package main

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_NullableItemsJSON_MarkedArray_ItemsAcceptNull(t *testing.T) {
	in := `{"schemas":{"M":{"properties":{"pe":{"items":{"type":"integer"},"type":"array","x-nullable-items":true}}}}}`

	out, err := nullableItemsJSON([]byte(in))

	require.NoError(t, err)
	assert.JSONEq(t, `{"schemas":{"M":{"properties":{"pe":{"items":{"type":["integer","null"]},"type":"array"}}}}}`, string(out))
}

func Test_NullableItemsJSON_NoMarker_Unchanged(t *testing.T) {
	in := `{"schemas":{"M":{"properties":{"pe":{"items":{"type":"integer"},"type":"array"},"sm":{"example":0.5,"type":"number"}}}}}`

	out, err := nullableItemsJSON([]byte(in))

	require.NoError(t, err)
	assert.Equal(t, in, string(out))
}

func Test_NullableItemsJSON_MarkerNotTrue_Error(t *testing.T) {
	in := `{"pe":{"items":{"type":"integer"},"type":"array","x-nullable-items":"yes"}}`

	_, err := nullableItemsJSON([]byte(in))

	assert.ErrorContains(t, err, "/pe: x-nullable-items must be true")
}

func Test_NullableItemsJSON_MarkerWithoutItems_Error(t *testing.T) {
	in := `{"pe":{"type":"integer","x-nullable-items":true}}`

	_, err := nullableItemsJSON([]byte(in))

	assert.ErrorContains(t, err, "/pe: x-nullable-items is set on a schema with no items")
}

func Test_NullableItemsJSON_MarkerOnItemsWithoutSingleType_Error(t *testing.T) {
	in := `{"pe":{"items":{"$ref":"#/components/schemas/X"},"type":"array","x-nullable-items":true}}`

	_, err := nullableItemsJSON([]byte(in))

	assert.ErrorContains(t, err, "/pe: x-nullable-items needs items of one type")
}

func Test_NullableItemsJSON_InvalidJSON_Error(t *testing.T) {
	_, err := nullableItemsJSON([]byte(`{"pe":`))

	assert.ErrorContains(t, err, "decode json")
}

func Test_NullableItemsComponentsLine_RewritesOnlyTheComponentsLine(t *testing.T) {
	in := "const docTemplate = `{\n" +
		"    \"schemes\": {{ marshal .Schemes }},\n" +
		"    \"components\": {\"schemas\":{\"M\":{\"properties\":{\"pe\":{\"items\":{\"type\":\"integer\"},\"type\":\"array\",\"x-nullable-items\":true}}}}},\n" +
		"    \"openapi\": \"3.1.0\"\n" +
		"}`\n"

	out, err := nullableItemsComponentsLine([]byte(in))

	require.NoError(t, err)
	want := "const docTemplate = `{\n" +
		"    \"schemes\": {{ marshal .Schemes }},\n" +
		"    \"components\": {\"schemas\":{\"M\":{\"properties\":{\"pe\":{\"items\":{\"type\":[\"integer\",\"null\"]},\"type\":\"array\"}}}}},\n" +
		"    \"openapi\": \"3.1.0\"\n" +
		"}`\n"
	assert.Equal(t, want, string(out))
}

func Test_NullableItemsComponentsLine_LastLineWithoutComma_KeepsNoComma(t *testing.T) {
	in := "{\n    \"components\": {\"pe\":{\"items\":{\"type\":\"integer\"},\"x-nullable-items\":true}}\n}"

	out, err := nullableItemsComponentsLine([]byte(in))

	require.NoError(t, err)
	assert.Equal(t, "{\n    \"components\": {\"pe\":{\"items\":{\"type\":[\"integer\",\"null\"]}}}\n}", string(out))
}

func Test_NullableItemsComponentsLine_NoComponentsLine_Error(t *testing.T) {
	_, err := nullableItemsComponentsLine([]byte("{\n    \"openapi\": \"3.1.0\"\n}"))

	assert.ErrorContains(t, err, "no line starts with")
}

func Test_NullableItemsYAML_MarkedArray_ItemsAcceptNull(t *testing.T) {
	in := "components:\n" +
		"  schemas:\n" +
		"    M:\n" +
		"      properties:\n" +
		"        pe:\n" +
		"          items:\n" +
		"            type: integer\n" +
		"          type: array\n" +
		"          x-nullable-items: true\n"

	out, err := nullableItemsYAML([]byte(in))

	require.NoError(t, err)
	want := "components:\n" +
		"  schemas:\n" +
		"    M:\n" +
		"      properties:\n" +
		"        pe:\n" +
		"          items:\n" +
		"            type:\n" +
		"            - integer\n" +
		"            - \"null\"\n" +
		"          type: array\n"
	assert.Equal(t, want, string(out))
}

func Test_NullableItemsYAML_InvalidYAML_Error(t *testing.T) {
	_, err := nullableItemsYAML([]byte("a: [b"))

	assert.ErrorContains(t, err, "convert yaml to json")
}

func Test_RewriteFile_WritesTheRewrittenContent(t *testing.T) {
	path := filepath.Join(t.TempDir(), "swagger.yaml")
	require.NoError(t, os.WriteFile(path, []byte("pe:\n  items:\n    type: integer\n  x-nullable-items: true\n"), 0644))

	err := rewriteFile(path, nullableItemsYAML)

	require.NoError(t, err)
	content, err := os.ReadFile(path)
	require.NoError(t, err)
	assert.Equal(t, "pe:\n  items:\n    type:\n    - integer\n    - \"null\"\n", string(content))
}

func Test_RewriteFile_MissingFile_Error(t *testing.T) {
	err := rewriteFile(filepath.Join(t.TempDir(), "missing.yaml"), nullableItemsYAML)

	assert.ErrorContains(t, err, "read ")
}
