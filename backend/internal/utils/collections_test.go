package utils

import (
	"github.com/stretchr/testify/assert"
	"testing"
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
