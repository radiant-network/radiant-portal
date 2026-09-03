//go:build !windows

package style

import "os"

func enableVirtualTerminal(*os.File) bool { return true }
