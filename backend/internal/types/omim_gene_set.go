package types

/*
+--------------------------+---------------------+----+-----+-------+-----+
|Field                     |Type                 |Null|Key  |Default|Extra|
+--------------------------+---------------------+----+-----+-------+-----+
|symbol                    |varchar(65533)       |YES |true |null   |     |
|omim_gene_id              |int                  |NO  |false|null   |     |
|phenotype_name            |varchar(65533)       |YES |false|null   |     |
|phenotype_omim_id         |varchar(65533)       |YES |false|null   |     |
|phenotype_inheritance_code|array<varchar(65533)>|YES |false|null   |     |
|phenotype_inheritance     |array<varchar(65533)>|YES |false|null   |     |
+--------------------------+---------------------+----+-----+-------+-----+
*/

var OmimGeneSetTable = Table{
	Name:  "omim_gene_set_flat",
	Alias: "omgsf",
}

type OmimGeneSet = struct {
	PhenotypeOmimId          string            `json:"omim_id,omitempty"`
	PhenotypeName            string            `json:"name,omitempty"`
	PhenotypeInheritanceCode JsonArray[string] `gorm:"type:json" json:"inheritance_code,omitempty"`
} // @name OmimGeneSet
