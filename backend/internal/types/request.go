package types

import "time"

type Request struct {
	ID                     int
	StatusCode             string
	Status                 Status `gorm:"foreignKey:Code;references:StatusCode"`
	PriorityCode           string
	Priority               Priority `gorm:"foreignKey:Code;references:PriorityCode"`
	RequestCode            string
	OrderingPhysician      string
	OrderingOrganizationID int
	Organization           Organization `gorm:"foreignKey:ID;references:OrderingOrganizationID"`
	OrderNumber            string
	CreatedOn              time.Time
	UpdatedOn              time.Time
}

var RequestTable = Table{
	Name: "radiant_jdbc.public.request",
}

func (Request) TableName() string {
	return RequestTable.Name
}
