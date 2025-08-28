package utils

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type Person struct {
	Name string
	Age  int
	City string
}

func Test_GroupByProperty(t *testing.T) {
	people := []Person{
		{Name: "Alice", Age: 25, City: "New York"},
		{Name: "Bob", Age: 30, City: "Los Angeles"},
		{Name: "Charlie", Age: 25, City: "New York"},
		{Name: "David", Age: 35, City: "Chicago"},
	}

	groupedByCity := GroupByProperty(people, func(p Person) string {
		return p.City
	})

	assert.Equal(t, 3, len(groupedByCity))
	assert.Equal(t, 2, len(groupedByCity["New York"]))
	assert.Equal(t, 1, len(groupedByCity["Chicago"]))
	assert.Equal(t, 1, len(groupedByCity["Los Angeles"]))
}

func Test_SortConsequences(t *testing.T) {
	variantsConsequences := []types.VariantConsequence{
		{IsPicked: false, Symbol: "CCC"},
		{IsPicked: false, Symbol: "BBB"},
		{IsPicked: true, Symbol: "DDD"},
		{IsPicked: false, Symbol: "AAA"},
	}

	result := SortConsequences(variantsConsequences)

	assert.Equal(t, 4, len(result))
	assert.Equal(t, "DDD", result[0].Symbol)
	assert.Equal(t, "AAA", result[1].Symbol)
	assert.Equal(t, "BBB", result[2].Symbol)
	assert.Equal(t, "CCC", result[3].Symbol)
}

func Test_ParseString(t *testing.T) {
	input := "A,B,C,D,E,F"
	expectedOutput := []string{
		"A", "B", "C", "D", "E", "F",
	}
	result := ParseString(input)
	assert.Equal(t, expectedOutput, result)
}

func Test_ParseString_EmptyInput(t *testing.T) {
	input := ""
	expectedOutput := []string{}
	result := ParseString(input)
	assert.Equal(t, expectedOutput, result)
}

func Test_ParseAndSortString(t *testing.T) {
	input := "E,C,F,A,D,B"
	expectedOutput := []string{
		"A", "B", "C", "D", "E", "F",
	}
	result := ParseAndSortString(input)
	assert.Equal(t, expectedOutput, result)
}

func Test_ParseConvertIntSortString(t *testing.T) {
	input := "5,3,6,1,4,2"
	expectedOutput := []int{
		1, 2, 3, 4, 5, 6,
	}
	result, err := ParseConvertIntSortString(input)
	assert.NoError(t, err)
	assert.Equal(t, expectedOutput, result)
}

func Test_ParseConvertIntSortString_Error(t *testing.T) {
	input := "5,3,6,1,S,2"
	_, err := ParseConvertIntSortString(input)
	assert.Error(t, err)
}
