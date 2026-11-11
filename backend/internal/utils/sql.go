package utils

func PrefixColumns(alias string, columns []string) []string {
	out := make([]string, len(columns))
	for i, c := range columns {
		out[i] = alias + "." + c
	}
	return out
}
