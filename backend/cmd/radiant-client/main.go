// Command radiant-client downloads case documents listed in a TSV manifest through radiant-api
// presigned URLs, authenticating with the Keycloak device flow.
//
//	radiant-client configure -u https://api.example.org
//	radiant-client download -m manifest.tsv -o ./downloads --resume
package main

import (
	"errors"
	"fmt"
	"os"

	"github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/cli/style"
	"github.com/spf13/cobra"
)

var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

// configPathResolver returns the config file path, from --config or the OS default.
type configPathResolver func() (string, error)

func newRootCmd() *cobra.Command {
	var configPath string
	root := &cobra.Command{
		Use:           "radiant-client",
		Short:         "Download Radiant case documents from a TSV manifest",
		Version:       fmt.Sprintf("%s (commit %s, built %s)", version, commit, date),
		SilenceUsage:  true,
		SilenceErrors: true,
	}
	root.PersistentFlags().StringVar(&configPath, "config", "", "config file (default: <user config dir>/radiant-client/config.json, or $RADIANT_CLIENT_CONFIG)")
	resolve := func() (string, error) {
		if configPath != "" {
			return configPath, nil
		}
		return config.DefaultPath()
	}
	root.AddCommand(configureCmd(resolve), downloadCmd(resolve))
	return root
}

func main() {
	root := newRootCmd()
	if p := style.For(os.Stdout); p.Enabled {
		cobra.AddTemplateFuncs(p.TemplateFuncs())
		root.SetUsageTemplate(p.UsageTemplate(root.UsageTemplate()))
	}
	if err := root.Execute(); err != nil {
		var ec exitCodeError
		if errors.As(err, &ec) {
			os.Exit(ec.code) // already reported by the command
		}
		fmt.Fprintln(os.Stderr, style.For(os.Stderr).Red("Error:"), err)
		os.Exit(1)
	}
}
