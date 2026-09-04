// Package prompt holds the few interactive console helpers of radiant-client.
package prompt

import (
	"bufio"
	"fmt"
	"io"
	"strings"
)

// Printf writes console output. A failed write to the terminal is not an error worth handling.
func Printf(out io.Writer, format string, args ...any) {
	_, _ = fmt.Fprintf(out, format, args...)
}

func Println(out io.Writer, args ...any) {
	_, _ = fmt.Fprintln(out, args...)
}

// Confirm asks "<msg> [yes]" and accepts an empty answer, "y" or "yes" (case insensitive).
func Confirm(in io.Reader, out io.Writer, msg string) (bool, error) {
	Printf(out, "%s [yes] ", msg)
	answer, err := readLine(in)
	if err != nil {
		return false, err
	}
	switch strings.ToLower(strings.TrimSpace(answer)) {
	case "", "y", "yes":
		return true, nil
	default:
		return false, nil
	}
}

// Line asks for a value, returning def when the answer is empty.
func Line(in io.Reader, out io.Writer, msg, def string) (string, error) {
	if def != "" {
		Printf(out, "%s [%s]: ", msg, def)
	} else {
		Printf(out, "%s: ", msg)
	}
	answer, err := readLine(in)
	if err != nil {
		return "", err
	}
	answer = strings.TrimSpace(answer)
	if answer == "" {
		return def, nil
	}
	return answer, nil
}

func readLine(in io.Reader) (string, error) {
	line, err := bufio.NewReader(in).ReadString('\n')
	if err != nil && (err != io.EOF || line == "") {
		return "", fmt.Errorf("read input: %w", err)
	}
	return line, nil
}
