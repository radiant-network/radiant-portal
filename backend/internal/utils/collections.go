package utils

import (
	"slices"
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

// SortIgvTracksByLeadingThenName sorts IGV tracks in-place: tracks for which `leading` returns true
// come first, then ties (and non-leading tracks) are broken alphabetically by Name.
func SortIgvTracksByLeadingThenName(tracks []types.IGVTrackEnriched, leading func(types.IGVTrackEnriched) bool) {
	slices.SortFunc(tracks, func(a, b types.IGVTrackEnriched) int {
		aLead, bLead := leading(a), leading(b)
		if aLead != bLead {
			if aLead {
				return -1
			}
			return 1
		}
		return strings.Compare(a.Name, b.Name)
	})
}

// SortConsequences sort by is_picked first then by symbol asc
func SortConsequences(variantConsequences []types.VariantConsequence) []types.VariantConsequence {
	slices.SortFunc(variantConsequences, func(a, b types.VariantConsequence) int {
		if a.IsPicked != b.IsPicked {
			if a.IsPicked {
				return -1
			}
			return 1
		}
		return strings.Compare(a.Symbol, b.Symbol)
	})
	return variantConsequences
}

func SplitRemoveEmptyString(s string, separator string) []string {
	// split and remove empty elements
	return slices.DeleteFunc(strings.Split(s, separator), func(e string) bool {
		return e == ""
	})
}

func RemoveDuplicates[T comparable](slice []T) []T {
	seen := make(map[T]bool)
	result := []T{}

	for _, item := range slice {
		if !seen[item] {
			seen[item] = true
			result = append(result, item)
		}
	}

	return result
}
