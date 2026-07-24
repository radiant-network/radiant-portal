# OrganizationResponse

Organization within a tenant, with its category label.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**category_code** | **str** |  | [optional] 
**category_name** | **str** |  | [optional] 
**code** | **str** |  | [optional] 
**name** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.organization_response import OrganizationResponse

# TODO update the JSON string below
json = "{}"
# create an instance of OrganizationResponse from a JSON string
organization_response_instance = OrganizationResponse.from_json(json)
# print the JSON string representation of the object
print(OrganizationResponse.to_json())

# convert the object into a dict
organization_response_dict = organization_response_instance.to_dict()
# create an instance of OrganizationResponse from a dict
organization_response_from_dict = OrganizationResponse.from_dict(organization_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


