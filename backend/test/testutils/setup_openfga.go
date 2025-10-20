package testutils

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/authorization"
)

func initOpenFGA() (*authorization.OpenFGAModelConfiguration, error) {
	ctx := context.Background()
	host, err := OpenFGAContainerSetup.Container.Host(ctx)
	port, err := OpenFGAContainerSetup.Container.MappedPort(ctx, "8080")
	if err != nil {
		return nil, fmt.Errorf("failed to get container port: %v", err)
	}
	endpoint := fmt.Sprintf("http://%s:%s", host, port.Port())
	store, err := authorization.InitOpenFGAStore(
		endpoint,
		"../../scripts/init-openfga/model.json",
	)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize OpenFGA store: %v", err)
	}
	return store, nil
}
