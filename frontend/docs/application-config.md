# Application Config

Application config read json file located in `portals/config/{application}.json`. 



## Add new facets

If you need to add new facets for the [QueryBuilder](./query-builder.md). You needs to edit the config json file.

```markdown
We use radiant for this example.
```

- Navigate to `portals/config/radiant.json`

- Create a new aggregate or edit an existing one

  - If you create a new aggregate, you will need to create a new `app_id`  in `applications-config`. 

  ```typescript
  export enum ApplicationId {
    'admin' = 'admin',
    'variant_exploration' = 'variant_exploration',
    'cnv_occurrence' = 'cnv_occurrence',
    'snv_occurrence' = 'snv_occurrence',
    'example_id' = 'example_id' // <== New ID
  }
  ```

- Add new entries to items
  - `key` should be same at the api
  - `translation_key` should be mapped to our [Translations](./translation) file. It let us decide use multiple translation for the same key.
  - The rest of the props are related to the type of field (numerical, multiple, boolean)

```json
  "example": {
    "app_id": "example_id",
    "aggregations": {
      "example": {
        "items": [
          { 
              "key": "multiselect", 
              "translation_key": "multiselect", 
              "type": "multiple" 
          }, 
          { 
              "key": "divider", 
              "translation_key": "divider", 
              "type": "divider" 
          },
          { 
              "key": "cn", 
              "translation_key": "cn", 
              "type": "numerical", 
              "defaults": { "min": 0, "max": 100, "defaultOperator": "GreaterThan" } 
          },
        ]
      }
    }
  },

```

- If you need to call a new **aggregate** api, edit `feature/query-filters/use-aggregation-builder` `s fetcher function
  ```typescript
  const fetcher = (appId: ApplicationId) => {
    switch (appId) {
      case ApplicationId.cnv_occurrence:
        return (input: OccurrenceAggregationInput): Promise<Aggregation[]> =>
          occurrencesApi
            .aggregateGermlineCNVOccurrences(input.seqId, input.aggregationBody)
            .then(response => response.data);
      default:
        return (input: OccurrenceAggregationInput): Promise<Aggregation[]> =>
          occurrencesApi
            .aggregateGermlineSNVOccurrences(input.seqId, input.aggregationBody)
            .then(response => response.data);
    }
  };
  ```

- If you need to call a new **statistic** api, edit `feature/query-filters/numerical-filter` `s fetcher function

  ```typescript
  const statisticsFetcher = (appId: ApplicationId) => {
    switch (appId) {
      case ApplicationId.cnv_occurrence:
        return (input: OccurrenceStatisticsInput): Promise<Statistics> =>
          occurrencesApi
            .statisticsGermlineCNVOccurrences(input.seqId, input.statisticsBody)
            .then(response => response.data);
      default:
        return (input: OccurrenceStatisticsInput): Promise<Statistics> =>
          occurrencesApi
            .statisticsGermlineSNVOccurrences(input.seqId, input.statisticsBody)
            .then(response => response.data);
    }
  };
  
  ```

  
