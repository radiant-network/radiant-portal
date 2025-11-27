import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "technical-guide/radiant-api/radiant-api",
    },
    {
      type: "category",
      label: "assays",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-assay-by-seq-id",
          label: "Get Assay by seq_id",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "batches",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-batch",
          label: "Retrieve a batch by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "cases",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/case-entity",
          label: "Get CaseEntity case entity",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/case-entity-documents-filters",
          label: "Get DocumentFilters documents filters for a specific case",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/case-entity-documents-search",
          label: "Search DocumentResult list for a case entity",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/autocomplete-cases",
          label: "Get AutocompleteResult list of matching prefix",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/cases-filters",
          label: "Get CaseFilters cases filters",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/search-cases",
          label: "Search cases",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "documents",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/autocomplete-documents",
          label: "Get AutocompleteResult list of matching prefix",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/documents-filters",
          label: "Get DocumentFilters documents filters",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/search-documents",
          label: "Search documents",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "genes",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/gene-auto-complete",
          label: "Get AutoCompleteGene list of matching input string with highlighted",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "hpo",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/hpo-term-auto-complete",
          label: "Get AutoCompleteTerm list of matching input string with highlighted",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "igv",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-igv",
          label: "Get IGV",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "interpretations",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/search-interpretation-germline",
          label: "Search interpretation germline",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-interpretation-germline-deprecated",
          label: "Get interpretation germline",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-interpretation-germline-deprecated",
          label: "Create or Update interpretation germline",
          className: "menu__list-item--deprecated api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-pubmed-citation",
          label: "Get pubmed citation by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/search-interpretation-somatic",
          label: "Search interpretation somatic",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-interpretation-somatic-deprecated",
          label: "Get interpretation somatic",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-interpretation-somatic-deprecated",
          label: "Create or Update interpretation somatic",
          className: "menu__list-item--deprecated api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-interpretation-germline",
          label: "Get interpretation germline",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-interpretation-germline",
          label: "Create or Update interpretation germline",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-interpretation-somatic",
          label: "Get interpretation somatic",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-interpretation-somatic",
          label: "Create or Update interpretation somatic",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "mondo",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/mondo-term-auto-complete",
          label: "Get AutoCompleteTerm list of matching input string with highlighted",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "occurrences",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/list-germline-cnv-genes-overlap",
          label: "List genes overlapping a CNV with a given ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/aggregate-germline-cnv-occurrences",
          label: "Aggregate germline CNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/count-germline-cnv-occurrences",
          label: "Count germline CNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/list-germline-cnv-occurrences",
          label: "List germline CNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/statistics-germline-cnv-occurrences",
          label: "Statistics of germline CNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-expanded-germline-snv-occurrence",
          label: "Get a germline ExpandedGermlineSNVOccurrence",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/aggregate-germline-snv-occurrences",
          label: "Aggregate germline SNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/count-germline-snv-occurrences",
          label: "Count germline SNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/list-germline-snv-occurrences",
          label: "List germline SNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/statistics-germline-snv-occurrences",
          label: "Statistics of germline SNV occurrences",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-snv-dictionary",
          label: "Get germline SNV facets dictionary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "patients",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-patient-batch",
          label: "Create a new patient batch",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "samples",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-sample-batch",
          label: "Create a new sample batch",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "sequencing",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-sequencing",
          label: "Get a Sequencing",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-sequencing-experiment-batch",
          label: "Create a new sequencing experiment batch",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "status",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-api-status",
          label: "Get API status",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "user_preferences",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-user-preferences",
          label: "Get user preferences",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-user-preferences",
          label: "Create or update user preference",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "saved_filters",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-saved-filters",
          label: "Get user saved filters",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/post-saved-filter",
          label: "Create a new saved filter",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/delete-saved-filter",
          label: "Delete a saved filter",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-saved-filter-by-id",
          label: "Get saved filter by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/put-saved-filter",
          label: "Update a saved filter",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "user_sets",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-user-set",
          label: "Get user set by id",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "variant",
      items: [
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-cases-count",
          label: "Get germline cases count for a given locus",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-interpreted-cases",
          label: "Get list of interpreted Cases for a germline variant",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-expanded-germline-variant-interpreted-case",
          label: "Get expanded germline interpreted case for a given locus, sequencing and transcript",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-uninterpreted-cases",
          label: "Get list of uninterpreted Cases for a germline variant",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-conditions",
          label: "Get conditions for germline variant entity for a specific gene panel",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-conditions-clinvar",
          label: "Get ClinVar conditions for germline variant entity",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-consequences",
          label: "Get list of VariantConsequences for a germline variant",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-header",
          label: "Get a germline VariantHeader",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-overview",
          label: "Get a germline VariantOverview",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "technical-guide/radiant-api/get-germline-variant-cases-filters",
          label: "Get cases filters for germline variant entity",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
