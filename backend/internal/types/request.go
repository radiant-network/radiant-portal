package types

type Request struct {
	ID                     int
	PriorityCode           string
	Priority               Priority `gorm:"foreignKey:Code;references:PriorityCode"`
	OrderingPhysician      string
	OrderingOrganizationID int
	Organization           Organization `gorm:"foreignKey:ID;references:OrderingOrganizationID"`
	OrderNumber            string
}

var RequestTable = Table{
	Name: "radiant_jdbc.public.request",
}

func (Request) TableName() string {
	return RequestTable.Name
}
