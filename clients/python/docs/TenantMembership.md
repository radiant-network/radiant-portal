# TenantMembership

Caller's effective authorization within a single tenant

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**orgs_by_action** | **Dict[str, List[str]]** |  | [optional] 
**tenant_actions** | **List[str]** |  | [optional] 

## Example

```python
from radiant_python.models.tenant_membership import TenantMembership

# TODO update the JSON string below
json = "{}"
# create an instance of TenantMembership from a JSON string
tenant_membership_instance = TenantMembership.from_json(json)
# print the JSON string representation of the object
print(TenantMembership.to_json())

# convert the object into a dict
tenant_membership_dict = tenant_membership_instance.to_dict()
# create an instance of TenantMembership from a dict
tenant_membership_from_dict = TenantMembership.from_dict(tenant_membership_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


