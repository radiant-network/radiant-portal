package types

type Experiment struct {
	ID                       int
	Code                     string
	Name                     string
	ExperimentalStrategyCode string
	ExperimentalStrategy     ExperimentalStrategy `gorm:"foreignKey:code;references:ExperimentalStrategyCode"`
	PlatformCode             string
	Platform                 Platform `gorm:"foreignKey:code;references:PlatformCode"`
	Description              string
}

var ExperimentTable = Table{
	Name: "radiant_jdbc.public.experiment",
}

func (Experiment) TableName() string {
	return ExperimentTable.Name
}
