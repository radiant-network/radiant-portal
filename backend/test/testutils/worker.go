package testutils

import (
	"path"

	"github.com/BurntSushi/toml"
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
	scenarioPath := path.Join(TestResources, WorkerScenariosPath, dataSetName+".toml")
	if _, err := toml.DecodeFile(scenarioPath, &wrapper); err != nil {
		return nil, err
	}
	return &wrapper, nil
}
