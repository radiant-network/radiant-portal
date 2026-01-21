package testutils

import (
	"os"
	"path/filepath"

	"github.com/pelletier/go-toml/v2"
	"github.com/radiant-network/radiant-api/internal/types"
)

const WorkerScenariosPath = "worker/scenarios"

type ScenarioWrapper struct {
	Patients              []*types.PatientBatch              `toml:"patients"`
	Samples               []*types.SampleBatch               `toml:"samples"`
	SequencingExperiments []*types.SequencingExperimentBatch `toml:"sequencing_experiments"`
	Cases                 []*types.CaseBatch                 `toml:"cases"`
}

func LoadScenario(dataSetName string) (*ScenarioWrapper, error) {
	var wrapper ScenarioWrapper
	scenarioPath := filepath.Join(TestResources, WorkerScenariosPath, dataSetName+".toml")

	file, err := os.Open(scenarioPath)
	if err != nil {
		return nil, err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			panic(err)
		}
	}(file)

	if err := toml.NewDecoder(file).Decode(&wrapper); err != nil {
		return nil, err
	}

	return &wrapper, nil
}
