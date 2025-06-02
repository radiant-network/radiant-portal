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
	SubmitterId       string
}

var SampleTable = Table{
	Name: "radiant_jdbc.public.sample",
}

func (Sample) TableName() string {
	return SampleTable.Name
}
