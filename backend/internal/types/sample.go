package types

type Sample struct {
	ID                int
	CategoryCode      string
	Category          SampleCategory `gorm:"foreignKey:code;references:CategoryCode"`
	TypeCode          string
	Type              SampleType `gorm:"foreignKey:code;references:TypeCode"`
	ParentSampleID    int
	ParentSample      *Sample `gorm:"foreignKey:ID;references:ParentSampleID"`
	TissueType        string
	HistologyTypeCode string
	HistologyType     HistologyType `gorm:"foreignKey:code;references:HistologyTypeCode"`
	SubmitterSampleId string
}

var SampleSubmitterSampleIdField = Field{
	Name:          "submitter_sample_id",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         SampleTable,
}

var SampleTable = Table{
	Name:  "radiant_jdbc.public.sample",
	Alias: "spl",
}

func (Sample) TableName() string {
	return SampleTable.Name
}
