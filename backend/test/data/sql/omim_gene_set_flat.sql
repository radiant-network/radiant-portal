create table omim_gene_set_flat
(
    symbol varchar(20)  NOT NULL,
    omim_gene_id int NOT NULL,
    phenotype_name  varchar(2000) NULL,
    phenotype_omim_id  varchar(2000) NULL,
    phenotype_inheritance_code  array< varchar (5)> NULL,
    phenotype_inheritance  array< varchar (2000)> NULL
);