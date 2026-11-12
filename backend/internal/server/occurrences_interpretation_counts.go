package server

import (
	"context"
	"log/slog"

	"github.com/radiant-network/radiant-api/internal/types"
)

type interpretationCountsLister func(ctx context.Context, locusIds []string) (map[string]types.JsonMap[string, int], error)

// addInterpretationCounts leaves the counts out when they cannot be read: they only decorate the list, so a PostgreSQL
// failure must not fail a page that StarRocks served.
func addInterpretationCounts[T any](ctx context.Context, occurrences []T, field func(*T) (string, *types.JsonMap[string, int]), list interpretationCountsLister) {
	locusIds := make([]string, len(occurrences))
	for i := range occurrences {
		locusIds[i], _ = field(&occurrences[i])
	}
	counts, err := list(ctx, locusIds)
	if err != nil {
		slog.ErrorContext(ctx, "list interpretation classification counts", "error", err)
		return
	}
	for i := range occurrences {
		locusId, target := field(&occurrences[i])
		*target = counts[locusId]
	}
}
