package testutils

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"sync"
	"time"

	"github.com/testcontainers/testcontainers-go/network"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
)

const (
	TestResources            = "../../test/data"
	OpenFGAContainerName     = "openfga_radiant"
	StarrocksContainerName   = "starrocks_radiant"
	PostgresContainerName    = "postgres_radiant"
	ObjectStoreContainerName = "minio_radiant"
)

var (
	OpenFGAContainerSetup     *ContainerConf
	PostgresContainerSetup    *ContainerConf
	StarrocksContainerSetup   *ContainerConf
	ObjectStoreContainerSetup *ContainerConf
	Network                   *testcontainers.DockerNetwork
)

func StartAllContainers() {
	StartOpenFGAContainer()
	StartPostgresContainer()
	StartStarrocksContainer()
	StartObjectStoreContainer()
}

func StartOpenFGAContainer() {
	if Network == nil {
		Network = createNetwork()
	}
	if OpenFGAContainerSetup == nil {
		OpenFGAContainerSetup = newContainerSetup(OpenFGAContainerName, startOpenFGAContainer)
		OpenFGAContainerSetup.setupContainer()
	}
}

func StartPostgresContainer() {
	if Network == nil {
		Network = createNetwork()
	}
	if PostgresContainerSetup == nil {
		PostgresContainerSetup = newContainerSetup(PostgresContainerName, startPostgresContainer)
		PostgresContainerSetup.setupContainer()
	}
}

func StartStarrocksContainer() {
	if Network == nil {
		Network = createNetwork()
	}
	if StarrocksContainerSetup == nil {
		StarrocksContainerSetup = newContainerSetup(StarrocksContainerName, startStarRocksContainer)
		StarrocksContainerSetup.setupContainer()
	}
}

func StartObjectStoreContainer() {
	if Network == nil {
		Network = createNetwork()
	}
	if ObjectStoreContainerSetup == nil {
		ObjectStoreContainerSetup = newContainerSetup(ObjectStoreContainerName, startMinioContainer)
		ObjectStoreContainerSetup.setupContainer()
	}
}

func StopAllContainers() {
	if OpenFGAContainerSetup != nil {
		OpenFGAContainerSetup.stopContainer()
	}
	if PostgresContainerSetup != nil {
		PostgresContainerSetup.stopContainer()
	}
	if StarrocksContainerSetup != nil {
		StarrocksContainerSetup.stopContainer()
	}
	if ObjectStoreContainerSetup != nil {
		ObjectStoreContainerSetup.stopContainer()
	}
	if Network != nil {
		deleteNetwork()
	}
}

func (c *ContainerConf) stopContainer() {
	if c.ContainerStarted {
		fmt.Println("Stopping " + c.ContainerName + " container..")
		if err := c.Container.Terminate(context.Background()); err != nil {
			log.Fatal("Failed to stop "+c.ContainerName+" container: ", err)
		}
		fmt.Println(c.ContainerName + " container stopped")
	} else {
		fmt.Println(c.ContainerName + " container is still running because it was started outside the tests")
	}
}

func createNetwork() *testcontainers.DockerNetwork {
	ctx := context.Background()

	newNetwork, err := network.New(ctx)

	if err != nil {
		log.Fatal("Failed to create network: ", err)
	}
	return newNetwork
}

func deleteNetwork() {
	ctx := context.Background()
	err := Network.Remove(ctx)
	if err != nil {
		log.Fatal("Failed to delete network: ", err)
	}
	Network = nil
}

func startOpenFGAContainer() (testcontainers.Container, error) {
	ctx := context.Background()
	networkName := Network.Name
	aliases := []string{OpenFGAContainerName}

	req := testcontainers.ContainerRequest{
		Image:        "openfga/openfga",
		Cmd:          []string{"run"},
		ExposedPorts: []string{"8080/tcp", "8081/tcp"},
		WaitingFor: wait.ForAll(
			wait.ForListeningPort("8080/tcp"),
			wait.ForListeningPort("8081/tcp"),
			wait.ForLog("starting HTTP server on '0.0.0.0:8080'").WithPollInterval(1*time.Second),
		),
		Networks: []string{
			networkName,
		},
		NetworkAliases: map[string][]string{
			networkName: aliases,
		},
	}

	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	if err != nil {
		return nil, err
	}

	return container, nil
}

func startStarRocksContainer() (testcontainers.Container, error) {
	ctx := context.Background()
	networkName := Network.Name
	aliases := []string{StarrocksContainerName}

	req := testcontainers.ContainerRequest{
		Image:        "starrocks/allin1-ubuntu",
		ExposedPorts: []string{"9030/tcp", "8030/tcp", "8040/tcp"},
		WaitingFor: wait.ForAll(
			wait.ForListeningPort("9030/tcp"),
			wait.ForListeningPort("8030/tcp"),
			wait.ForListeningPort("8040/tcp"),
			wait.ForLog("Enjoy the journey to StarRocks").WithPollInterval(1*time.Second),
		),
		Networks: []string{
			networkName,
		},
		NetworkAliases: map[string][]string{
			networkName: aliases,
		},
	}

	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	if err != nil {
		return nil, err
	}

	return container, nil
}

func startPostgresContainer() (testcontainers.Container, error) {
	ctx := context.Background()
	networkName := Network.Name
	aliases := []string{PostgresContainerName}

	req := testcontainers.ContainerRequest{
		Image:        "postgres",
		ExposedPorts: []string{"5432/tcp"},
		Env: map[string]string{
			"POSTGRES_USER":     "radiant",
			"POSTGRES_PASSWORD": "radiant",
			"POSTGRES_DB":       "radiant",
		},
		Networks: []string{
			networkName,
		},
		NetworkAliases: map[string][]string{
			networkName: aliases,
		},
		WaitingFor: wait.ForAll(
			wait.ForListeningPort("5432/tcp"),
			wait.ForLog("PostgreSQL init process complete").WithPollInterval(1*time.Second),
		),
	}

	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	if err != nil {
		return nil, err
	}

	return container, nil
}

func startMinioContainer() (testcontainers.Container, error) {
	ctx := context.Background()
	networkName := Network.Name
	aliases := []string{ObjectStoreContainerName}

	req := testcontainers.ContainerRequest{
		Image:        "minio/minio:latest",
		ExposedPorts: []string{"9000/tcp"},
		Env: map[string]string{
			"MINIO_ROOT_USER":     "admin",
			"MINIO_ROOT_PASSWORD": "password",
		},
		Cmd:      []string{"server", "/data"},
		Networks: []string{networkName},
		NetworkAliases: map[string][]string{
			networkName: aliases,
		},
		WaitingFor: wait.ForListeningPort("9000/tcp"),
	}

	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	if err != nil {
		return nil, err
	}

	return container, nil
}

type ContainerConf struct {
	ContainerName          string
	ContainerStartFunction func() (testcontainers.Container, error)
	once                   sync.Once
	Container              testcontainers.Container
	ContainerStarted       bool
}

func newContainerSetup(containerName string, containerStartFunction func() (testcontainers.Container, error)) *ContainerConf {
	return &ContainerConf{ContainerName: containerName, ContainerStartFunction: containerStartFunction}
}

func (c *ContainerConf) setupContainer() {
	c.once.Do(func() {
		// Run the script to start the container if it's not already running
		cmd := exec.Command("docker", "ps", "-q", "-f", fmt.Sprintf("name=%s", c.ContainerName))
		output, err := cmd.Output()
		if err != nil {
			log.Fatal("Failed to check if "+c.ContainerName+" container is running: ", err)
		}

		if len(output) == 0 {
			// Container is not running, start a new one
			c.Container, err = c.ContainerStartFunction()
			if err != nil {
				log.Fatal("Failed to start "+c.ContainerName+" container: ", err)
			}
			c.ContainerStarted = true
		} else {
			// Container is already running, attach to it
			fmt.Println(c.ContainerName + " container is already running.")
			ctx := context.Background()
			c.Container, err = testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
				ContainerRequest: testcontainers.ContainerRequest{
					Name: c.ContainerName,
				},
				Started: true,
				Reuse:   true,
			})
			if err != nil {
				log.Fatal("Failed to attach to Postgres container: ", err)
			}
			c.ContainerStarted = false
		}
	})
}
