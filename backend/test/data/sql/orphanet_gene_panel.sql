create table orphanet_gene_panel
(
    symbol varchar(30)  NOT NULL,
    panel  varchar(250) NOT NULL,
    disorder_id bigint NULL,
    type_of_inheritance array<varchar(200)> NULL
);