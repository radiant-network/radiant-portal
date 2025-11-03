# InterpretationSomatic


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**clinical_utility** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**created_by** | **string** |  | [optional] [default to undefined]
**created_by_name** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**interpretation** | **string** |  | [optional] [default to undefined]
**locus_id** | **string** |  | [optional] [default to undefined]
**metadata** | [**InterpretationMetadata**](InterpretationMetadata.md) |  | [optional] [default to undefined]
**oncogenicity** | **string** |  | [optional] [default to undefined]
**oncogenicity_classification_criterias** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**pubmed** | [**Array&lt;InterpretationPubmed&gt;**](InterpretationPubmed.md) |  | [optional] [default to undefined]
**sequencing_id** | **string** |  | [optional] [default to undefined]
**transcript_id** | **string** |  | [optional] [default to undefined]
**tumoral_type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**updated_by** | **string** |  | [optional] [default to undefined]
**updated_by_name** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { InterpretationSomatic } from './api';

const instance: InterpretationSomatic = {
    clinical_utility,
    created_at,
    created_by,
    created_by_name,
    id,
    interpretation,
    locus_id,
    metadata,
    oncogenicity,
    oncogenicity_classification_criterias,
    pubmed,
    sequencing_id,
    transcript_id,
    tumoral_type,
    updated_at,
    updated_by,
    updated_by_name,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
