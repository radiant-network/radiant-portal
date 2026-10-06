# PatientFilters

Values of the patient list filters

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cns_integrated_diagnosis** | [**List[FiltersValue]**](FiltersValue.md) |  | 
**organization_code** | [**List[FiltersValue]**](FiltersValue.md) | label &#x3D; organization name | 
**vital_status** | [**List[FiltersValue]**](FiltersValue.md) |  | 

## Example

```python
from radiant_python.models.patient_filters import PatientFilters

# TODO update the JSON string below
json = "{}"
# create an instance of PatientFilters from a JSON string
patient_filters_instance = PatientFilters.from_json(json)
# print the JSON string representation of the object
print(PatientFilters.to_json())

# convert the object into a dict
patient_filters_dict = patient_filters_instance.to_dict()
# create an instance of PatientFilters from a dict
patient_filters_from_dict = PatientFilters.from_dict(patient_filters_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


