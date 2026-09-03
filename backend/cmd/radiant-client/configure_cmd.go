package main

import (
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/cli/api"
	"github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/cli/prompt"
	"github.com/radiant-network/radiant-api/internal/cli/style"
	"github.com/spf13/cobra"
)

func configureCmd(resolve configPathResolver) *cobra.Command {
	var apiURL string
	var reset bool

	cmd := &cobra.Command{
		Use:   "configure",
		Short: "Point the client at a Radiant API and fetch its authentication settings",
		RunE: func(cmd *cobra.Command, args []string) error {
			path, err := resolve()
			if err != nil {
				return err
			}
			if reset {
				if err := config.Save(path, &config.Config{}); err != nil {
					return err
				}
				prompt.Printf(cmd.OutOrStdout(), "Configuration reset: %s\n", path)
				return nil
			}
			cfg, err := config.Load(path)
			if err != nil {
				return err
			}
			if apiURL == "" {
				apiURL, err = prompt.Line(cmd.InOrStdin(), cmd.OutOrStdout(), "Radiant API URL", cfg.APIURL)
				if err != nil {
					return err
				}
			}
			apiURL = strings.TrimRight(strings.TrimSpace(apiURL), "/")
			if apiURL == "" {
				return fmt.Errorf("an API URL is required")
			}
			cc, err := api.New(apiURL).GetConfig(cmd.Context())
			if err != nil {
				return err
			}
			cfg.APIURL = apiURL
			cfg.Auth = cc.Auth
			cfg.Tokens = config.Tokens{}
			if err := cfg.Validate(); err != nil {
				return fmt.Errorf("server returned an unusable configuration: %w", err)
			}
			if err := config.Save(path, cfg); err != nil {
				return err
			}
			p := style.For(cmd.OutOrStdout())
			prompt.Printf(cmd.OutOrStdout(), "Configuration saved to %s\nAuthentication: %s flow on %s (realm %s, client %s)\n", p.Path(path), cfg.Auth.Method, p.URL(cfg.Auth.KeycloakURL), cfg.Auth.Realm, cfg.Auth.ClientID)
			return nil
		},
	}
	cmd.Flags().StringVarP(&apiURL, "api-url", "u", "", "Radiant API base URL (asked interactively when omitted)")
	cmd.Flags().BoolVar(&reset, "reset", false, "erase the configuration and stored tokens")
	return cmd
}
