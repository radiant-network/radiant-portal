# CaseEntity

Data for Case Entity Page

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assays** | [**Array&lt;CaseAssay&gt;**](CaseAssay.md) |  | [default to undefined]
**case_analysis_code** | **string** |  | [optional] [default to undefined]
**case_analysis_name** | **string** |  | [optional] [default to undefined]
**case_id** | **number** |  | [default to undefined]
**case_type** | **string** |  | [optional] [default to undefined]
**created_on** | **string** |  | [default to undefined]
**members** | [**Array&lt;CasePatientClinicalInformation&gt;**](CasePatientClinicalInformation.md) |  | [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**performer_lab_code** | **string** |  | [optional] [default to undefined]
**performer_lab_name** | **string** |  | [optional] [default to undefined]
**prescriber** | **string** |  | [optional] [default to undefined]
**primary_condition_id** | **string** |  | [optional] [default to undefined]
**primary_condition_name** | **string** |  | [optional] [default to undefined]
**priority_code** | **string** |  | [optional] [default to undefined]
**project_code** | **string** |  | [optional] [default to undefined]
**project_name** | **string** |  | [optional] [default to undefined]
**request_id** | **number** |  | [optional] [default to undefined]
**requested_by_code** | **string** |  | [optional] [default to undefined]
**requested_by_name** | **string** |  | [optional] [default to undefined]
**status_code** | **string** |  | [default to undefined]
**tasks** | [**Array&lt;CaseTask&gt;**](CaseTask.md) |  | [default to undefined]
**updated_on** | **string** |  | [default to undefined]

## Example

```typescript
import { CaseEntity } from './api';

const instance: CaseEntity = {
    assays,
    case_analysis_code,
    case_analysis_name,
    case_id,
    case_type,
    created_on,
    members,
    note,
    performer_lab_code,
    performer_lab_name,
    prescriber,
    primary_condition_id,
    primary_condition_name,
    priority_code,
    project_code,
    project_name,
    request_id,
    requested_by_code,
    requested_by_name,
    status_code,
    tasks,
    updated_on,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
