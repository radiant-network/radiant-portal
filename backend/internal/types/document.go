package types

type Document struct {
	ID               int
	Name             string
	DataCategoryCode string
	DataCategory     DataCategory `gorm:"foreignKey:code;references:DataCategoryCode"`
	DataTypeCode     string
	DataType         DataType `gorm:"foreignKey:code;references:DataTypeCode"`
	FileFormatCode   string
	FileFormat       FileFormat `gorm:"foreignKey:code;references:FileFormatCode"`
	Size             int
	Url              string
	Hash             string
	Patients         []Patient `gorm:"many2many:radiant_jdbc.public.document_has_patient;"`
}

var DocumentTable = Table{
	Name: "radiant_jdbc.public.document",
}

func (Document) TableName() string {
	return DocumentTable.Name
}
