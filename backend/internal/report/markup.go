package report

import "unicode"

type run struct {
	Text   string
	Bold   bool
	Italic bool
}

// parseMarkup splits a rendered cell into font runs: **bold** and _italic_. An underscore only
// opens or closes at a word boundary (CommonMark intraword rule) so NM_000546.6 stays literal.
// A marker without a valid match is literal text.
func parseMarkup(s string) []run {
	text := []rune(s)
	var runs []run
	var buf []rune
	bold, italic := false, false
	flush := func() {
		if len(buf) > 0 {
			runs = append(runs, run{Text: string(buf), Bold: bold, Italic: italic})
			buf = buf[:0]
		}
	}
	for i := 0; i < len(text); i++ {
		switch {
		case isBoldMarker(text, i):
			if !bold && boldOpens(text, i) || bold && boldCloses(text, i) {
				flush()
				bold = !bold
				i++
				continue
			}
		case text[i] == '_':
			if !italic && italicOpens(text, i) || italic && italicCloses(text, i) {
				flush()
				italic = !italic
				continue
			}
		}
		buf = append(buf, text[i])
	}
	flush()
	return runs
}

func isBoldMarker(text []rune, i int) bool {
	return text[i] == '*' && i+1 < len(text) && text[i+1] == '*'
}

func boldOpens(text []rune, i int) bool {
	if i+2 >= len(text) || unicode.IsSpace(text[i+2]) {
		return false
	}
	for j := i + 2; j+1 < len(text); j++ {
		if isBoldMarker(text, j) && boldCloses(text, j) {
			return true
		}
	}
	return false
}

func boldCloses(text []rune, i int) bool {
	return i > 0 && !unicode.IsSpace(text[i-1])
}

func italicOpens(text []rune, i int) bool {
	if i > 0 && isWordChar(text[i-1]) {
		return false
	}
	if i+1 >= len(text) || unicode.IsSpace(text[i+1]) || text[i+1] == '_' {
		return false
	}
	for j := i + 1; j < len(text); j++ {
		if text[j] == '_' && italicCloses(text, j) {
			return true
		}
	}
	return false
}

func italicCloses(text []rune, i int) bool {
	if i == 0 || unicode.IsSpace(text[i-1]) || text[i-1] == '_' {
		return false
	}
	return i+1 >= len(text) || !isWordChar(text[i+1])
}

func isWordChar(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r)
}
