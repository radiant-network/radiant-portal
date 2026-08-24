# radiant_python.RolesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**list_roles**](RolesApi.md#list_roles) | **GET** /{tenant}/roles | List the tenant&#39;s roles


# **list_roles**
> List[RoleResult] list_roles(tenant)

List the tenant's roles

Returns every role defined in the tenant in the path — the seeded ones and the
tenant's own custom ones — each with the actions it grants and the number of users
holding it. Requires the `can_manage_role` or the `can_manage_user` action: the
catalog is both the roles section's own list and the role picker the add and edit
user screens are built from. `is_default` marks a seeded
role, which is locked and can be neither edited nor deleted. `scope` is derived
from the actions: `tenant` when they are all tenant-scoped, `org` when they are all
org-scoped, `mixed` when both — it is what decides whether granting the role needs
organizations. The list is small and bounded, so it is returned unpaged.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.role_result import RoleResult
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = radiant_python.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.RolesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # List the tenant's roles
        api_response = api_instance.list_roles(tenant)
        print("The response of RolesApi->list_roles:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->list_roles: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**List[RoleResult]**](RoleResult.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

