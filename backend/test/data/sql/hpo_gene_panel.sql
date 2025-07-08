create table hpo_gene_panel
(
    symbol varchar(20)  NOT NULL,
    panel  varchar(250) NOT NULL,
    hpo_term_name  varchar(200) NOT NULL,
    hpo_term_id  varchar(200) NOT NULL
);