# PatientOrganizationVitalCount

Alive and deceased patients of one organization

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alive** | **int** |  | 
**deceased** | **int** |  | 
**organization_code** | **str** |  | 
**organization_name** | **str** |  | 

## Example

```python
from radiant_python.models.patient_organization_vital_count import PatientOrganizationVitalCount

# TODO update the JSON string below
json = "{}"
# create an instance of PatientOrganizationVitalCount from a JSON string
patient_organization_vital_count_instance = PatientOrganizationVitalCount.from_json(json)
# print the JSON string representation of the object
print(PatientOrganizationVitalCount.to_json())

# convert the object into a dict
patient_organization_vital_count_dict = patient_organization_vital_count_instance.to_dict()
# create an instance of PatientOrganizationVitalCount from a dict
patient_organization_vital_count_from_dict = PatientOrganizationVitalCount.from_dict(patient_organization_vital_count_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


