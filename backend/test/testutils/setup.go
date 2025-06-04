package testutils

import (
	"context"
	"fmt"
	"github.com/testcontainers/testcontainers-go/network"
	"log"
	"os/exec"
	"sync"
	"time"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
)

const (
	testResources          = "../../test/data"
	StarrocksContainerName = "starrocks_radiant"
	PostgresContainerName  = "postgres_radiant"
)

var (
	PostgresContainerSetup  *ContainerConf
	StarrocksContainerSetup *ContainerConf
	Network                 *testcontainers.DockerNetwork
)

func StartAllContainers() {
	StartPostgresContainer()
	StartStarrocksContainer()
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

func StopAllContainers() {
	if PostgresContainerSetup != nil {
		PostgresContainerSetup.stopContainer()
	}
	if StarrocksContainerSetup != nil {
		StarrocksContainerSetup.stopContainer()
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
