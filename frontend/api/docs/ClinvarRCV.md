# ClinvarRCV

ClinvarRCV represents a Reference ClinVar record - data aggregated by variant-condition pair

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accession** | **string** |  | [optional] [default to undefined]
**clinical_significance** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**clinvar_id** | **string** |  | [default to undefined]
**date_last_evaluated** | **string** |  | [optional] [default to undefined]
**locus_id** | **string** |  | [default to undefined]
**origins** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**review_status** | **string** |  | [optional] [default to undefined]
**review_status_stars** | **number** |  | [optional] [default to undefined]
**submission_count** | **number** |  | [optional] [default to undefined]
**traits** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**version** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ClinvarRCV } from './api';

const instance: ClinvarRCV = {
    accession,
    clinical_significance,
    clinvar_id,
    date_last_evaluated,
    locus_id,
    origins,
    review_status,
    review_status_stars,
    submission_count,
    traits,
    version,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
