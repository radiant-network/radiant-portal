package types

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_NegotiateLocale_French_ReturnsFr(t *testing.T) {
	t.Parallel()
	assert.Equal(t, LocaleFr, NegotiateLocale("fr"))
}

func Test_NegotiateLocale_FrenchWithRegion_ReturnsFr(t *testing.T) {
	t.Parallel()
	assert.Equal(t, LocaleFr, NegotiateLocale("fr-CA,fr;q=0.9,en;q=0.8"))
}

func Test_NegotiateLocale_English_ReturnsEn(t *testing.T) {
	t.Parallel()
	assert.Equal(t, LocaleEn, NegotiateLocale("en"))
}

func Test_NegotiateLocale_Empty_ReturnsEn(t *testing.T) {
	t.Parallel()
	assert.Equal(t, LocaleEn, NegotiateLocale(""))
}

func Test_NegotiateLocale_Unsupported_ReturnsEn(t *testing.T) {
	t.Parallel()
	assert.Equal(t, LocaleEn, NegotiateLocale("de"))
}

func Test_NegotiateLocale_Malformed_ReturnsEn(t *testing.T) {
	t.Parallel()
	assert.Equal(t, LocaleEn, NegotiateLocale("fr;q=abc"))
}

func Test_LocalizedName_NoLocale_ReadsEnglish(t *testing.T) {
	t.Parallel()
	assert.Equal(t, "anc.name_en", LocalizedName(context.Background(), "anc"))
}

func Test_LocalizedName_French_FallsBackToEnglish(t *testing.T) {
	t.Parallel()
	ctx := ContextWithLocale(context.Background(), LocaleFr)
	assert.Equal(t, "COALESCE(NULLIF(anc.name_fr, ''), anc.name_en)", LocalizedName(ctx, "anc"))
}
