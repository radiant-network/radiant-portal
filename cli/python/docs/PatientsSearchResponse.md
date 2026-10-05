# PatientsSearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** |  | 
**list** | [**List[PatientListItem]**](PatientListItem.md) |  | 

## Example

```python
from radiant_python.models.patients_search_response import PatientsSearchResponse

# TODO update the JSON string below
json = "{}"
# create an instance of PatientsSearchResponse from a JSON string
patients_search_response_instance = PatientsSearchResponse.from_json(json)
# print the JSON string representation of the object
print(PatientsSearchResponse.to_json())

# convert the object into a dict
patients_search_response_dict = patients_search_response_instance.to_dict()
# create an instance of PatientsSearchResponse from a dict
patients_search_response_from_dict = PatientsSearchResponse.from_dict(patients_search_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


