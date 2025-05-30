package types

import "time"

type Request struct {
	ID                     int
	StatusCode             string   `gorm:"column:status"`
	Status                 Status   `gorm:"foreignKey:Code;references:StatusCode"`
	PriorityCode           string   `gorm:"column:priority"`
	Priority               Priority `gorm:"foreignKey:Code;references:PriorityCode"`
	RequestCode            string
	OrderingPhysician      string
	OrderingOrganizationID int          `gorm:"column:ordering_organisation_id"`
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
