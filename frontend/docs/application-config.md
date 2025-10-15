# Application Config

Application config read json file located in `portals/config/{application}.json`. 

## Add new facets

If you need to add new facets for the [QueryBuilder](./query-builder.md). You needs to edit the config json file.

```markdown
We use radiant for this example.
```

- Navigate to `portals/config/radiant.json`
- Create a new aggregate or edit an existing one
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

