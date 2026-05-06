package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_PrefixColumns(t *testing.T) {
	result := PrefixColumns("o", []string{"id", "name", "value"})
	assert.Equal(t, []string{"o.id", "o.name", "o.value"}, result)
}

func Test_PrefixColumns_EmptyColumns(t *testing.T) {
	result := PrefixColumns("o", []string{})
	assert.Equal(t, []string{}, result)
}

func Test_PrefixColumns_EmptyAlias(t *testing.T) {
	result := PrefixColumns("", []string{"id", "name"})
	assert.Equal(t, []string{".id", ".name"}, result)
}

func Test_PrefixColumns_SingleColumn(t *testing.T) {
	result := PrefixColumns("table", []string{"col"})
	assert.Equal(t, []string{"table.col"}, result)
}

func Test_PrefixColumns_NilColumns(t *testing.T) {
	result := PrefixColumns("o", nil)
	assert.Equal(t, []string{}, result)
}
