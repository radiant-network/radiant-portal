package utils

import (
	"slices"
	"sort"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

func GroupByProperty[T any, K comparable](items []T, getProperty func(T) K) map[K][]T {
	grouped := make(map[K][]T)

	for _, item := range items {
		key := getProperty(item)
		grouped[key] = append(grouped[key], item)
	}

	return grouped
}

// SortConsequences sort by is_picked first then by symbol asc
func SortConsequences(variantConsequences []types.VariantConsequence) []types.VariantConsequence {
	sort.Slice(variantConsequences, func(i, j int) bool {
		return variantConsequences[i].IsPicked && !variantConsequences[j].IsPicked ||
			(!variantConsequences[i].IsPicked && !variantConsequences[j].IsPicked && variantConsequences[i].Symbol < variantConsequences[j].Symbol)
	})
	return variantConsequences
}

func ParseString(s string) []string {
	// split and remove empty elements
	return slices.DeleteFunc(strings.Split(s, ","), func(e string) bool {
		return e == ""
	})
}
