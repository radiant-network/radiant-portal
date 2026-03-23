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

func Test_SplitRemoveEmptyString(t *testing.T) {
	input := "A,B,C,D,E,F"
	expectedOutput := []string{
		"A", "B", "C", "D", "E", "F",
	}
	result := SplitRemoveEmptyString(input, ",")
	assert.Equal(t, expectedOutput, result)
}

func Test_SplitRemoveEmptyString_EmptyInput(t *testing.T) {
	input := ""
	expectedOutput := []string{}
	result := SplitRemoveEmptyString(input, ",")
	assert.Equal(t, expectedOutput, result)
}

func Test_RemoveDuplicates(t *testing.T) {
	result := RemoveDuplicates([]string{"a", "b", "a", "c", "b"})
	assert.Equal(t, []string{"a", "b", "c"}, result)
}

func Test_RemoveDuplicates_Ints(t *testing.T) {
	result := RemoveDuplicates([]int{1, 2, 3, 2, 1})
	assert.Equal(t, []int{1, 2, 3}, result)
}

func Test_RemoveDuplicates_NoDuplicates(t *testing.T) {
	result := RemoveDuplicates([]string{"a", "b", "c"})
	assert.Equal(t, []string{"a", "b", "c"}, result)
}

func Test_RemoveDuplicates_AllDuplicates(t *testing.T) {
	result := RemoveDuplicates([]string{"x", "x", "x"})
	assert.Equal(t, []string{"x"}, result)
}

func Test_RemoveDuplicates_Empty(t *testing.T) {
	result := RemoveDuplicates([]string{})
	assert.Equal(t, []string{}, result)
}
