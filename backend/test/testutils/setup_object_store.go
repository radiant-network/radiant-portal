package testutils

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	tc "github.com/testcontainers/testcontainers-go"
)

const (
	objectStoreAccessKey = "admin"
	objectStoreSecretKey = "password"
)

type ObjectStoreContainer struct {
	Container tc.Container
	Endpoint  string
}

func initObjectStoreContainer(ctx context.Context) (*ObjectStoreContainer, error) {
	host, err := ObjectStoreContainerSetup.Container.Host(ctx)
	if err != nil {
		log.Fatal("failed to get container host: ", err)
	}

	port, err := ObjectStoreContainerSetup.Container.MappedPort(ctx, "9000")
	if err != nil {
		log.Fatal("failed to get container port: ", err)
	}

	endpoint := fmt.Sprintf("%s:%s", host, port.Port())

	// Wait a bit to allow the object store to fully start up
	time.Sleep(2 * time.Second)

	return &ObjectStoreContainer{Container: ObjectStoreContainerSetup.Container, Endpoint: endpoint}, nil
}

func initS3Client(endpoint string) (*minio.Client, error) {
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(objectStoreAccessKey, objectStoreSecretKey, ""),
		Secure: false,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create minio client: %w", err)
	}

	return client, nil
}
