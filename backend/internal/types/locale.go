package types

import (
	"context"
	"fmt"

	"golang.org/x/text/language"
)

type Locale string

const (
	LocaleEn Locale = "en"
	LocaleFr Locale = "fr"
)

// The first tag is the matcher's fallback, so anything not French is English.
var localeMatcher = language.NewMatcher([]language.Tag{language.English, language.French})

// NegotiateLocale never fails: an empty, unknown or malformed Accept-Language gives English.
func NegotiateLocale(acceptLanguage string) Locale {
	tags, _, err := language.ParseAcceptLanguage(acceptLanguage)
	if err != nil {
		return LocaleEn
	}
	if _, index, confidence := localeMatcher.Match(tags...); index == 1 && confidence != language.No {
		return LocaleFr
	}
	return LocaleEn
}

type localeContextKey struct{}

func ContextWithLocale(ctx context.Context, locale Locale) context.Context {
	return context.WithValue(ctx, localeContextKey{}, locale)
}

func LocaleFromContext(ctx context.Context) Locale {
	if locale, ok := ctx.Value(localeContextKey{}).(Locale); ok {
		return locale
	}
	return LocaleEn
}

// LocalizedName selects the name of the table aliased alias in the request's language.
// NULLIF: exam.name_fr is NOT NULL, so an untranslated exam holds an empty string, not NULL.
func LocalizedName(ctx context.Context, alias string) string {
	if LocaleFromContext(ctx) == LocaleFr {
		return fmt.Sprintf("COALESCE(NULLIF(%s.name_fr, ''), %s.name_en)", alias, alias)
	}
	return alias + ".name_en"
}
