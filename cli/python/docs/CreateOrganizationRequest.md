# CreateOrganizationRequest

Payload to create an organization in a tenant.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**category_code** | **str** |  | 
**code** | **str** |  | 
**name** | **str** |  | 

## Example

```python
from radiant_python.models.create_organization_request import CreateOrganizationRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateOrganizationRequest from a JSON string
create_organization_request_instance = CreateOrganizationRequest.from_json(json)
# print the JSON string representation of the object
print(CreateOrganizationRequest.to_json())

# convert the object into a dict
create_organization_request_dict = create_organization_request_instance.to_dict()
# create an instance of CreateOrganizationRequest from a dict
create_organization_request_from_dict = CreateOrganizationRequest.from_dict(create_organization_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


