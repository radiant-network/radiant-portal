# CasePatientClinicalInformation

Patient clinical information to display in Case Entity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**affected_status_code** | **string** |  | [default to undefined]
**date_of_birth** | **string** |  | [optional] [default to undefined]
**ethnicity_codes** | **Array&lt;string&gt;** | TODO | [optional] [default to undefined]
**managing_organization_code** | **string** |  | [optional] [default to undefined]
**managing_organization_name** | **string** |  | [optional] [default to undefined]
**mrn** | **string** |  | [optional] [default to undefined]
**non_observed_phenotypes** | [**Array&lt;Term&gt;**](Term.md) |  | [optional] [default to undefined]
**observed_phenotypes** | [**Array&lt;Term&gt;**](Term.md) |  | [optional] [default to undefined]
**patient_id** | **number** |  | [default to undefined]
**relationship_to_proband** | **string** |  | [default to undefined]
**sex_code** | **string** |  | [default to undefined]

## Example

```typescript
import { CasePatientClinicalInformation } from './api';

const instance: CasePatientClinicalInformation = {
    affected_status_code,
    date_of_birth,
    ethnicity_codes,
    managing_organization_code,
    managing_organization_name,
    mrn,
    non_observed_phenotypes,
    observed_phenotypes,
    patient_id,
    relationship_to_proband,
    sex_code,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
