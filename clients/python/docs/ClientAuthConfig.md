# ClientAuthConfig

Public Keycloak settings for the OAuth2 device authorization grant.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_id** | **str** |  | 
**keycloak_url** | **str** |  | 
**method** | **str** |  | 
**realm** | **str** |  | 

## Example

```python
from radiant_python.models.client_auth_config import ClientAuthConfig

# TODO update the JSON string below
json = "{}"
# create an instance of ClientAuthConfig from a JSON string
client_auth_config_instance = ClientAuthConfig.from_json(json)
# print the JSON string representation of the object
print(ClientAuthConfig.to_json())

# convert the object into a dict
client_auth_config_dict = client_auth_config_instance.to_dict()
# create an instance of ClientAuthConfig from a dict
client_auth_config_from_dict = ClientAuthConfig.from_dict(client_auth_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


