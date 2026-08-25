# radiant_python.RolesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_role**](RolesApi.md#create_role) | **POST** /{tenant}/roles | Create a custom role
[**get_role**](RolesApi.md#get_role) | **GET** /{tenant}/roles/{code} | Get one of the tenant&#39;s roles
[**list_roles**](RolesApi.md#list_roles) | **GET** /{tenant}/roles | List the tenant&#39;s roles


# **create_role**
> RoleResult create_role(tenant, create_role_request)

Create a custom role

Creates a custom role in the tenant in the path and returns it, in the same shape
the reads serve it. Requires the `can_manage_role` action — unlike reading the
catalog, `can_manage_user` does not open this.

`code` is immutable after creation, must match `[a-z][a-z0-9_]*` (max 50) and be
unique within the tenant. `name` must also be unique within the tenant, compared
case-insensitively and including the seeded roles' names, so 409 covers a clash on
either. `description` is optional. `actions` must list at least one action, and
every one of them must exist and be grantable — a reserved action (such as
`can_manage_user`) yields 422, which is what keeps it out of every custom role and
makes `tenant_admin` un-duplicable.

The role's `scope` is not supplied: it is derived from the actions and decides
whether granting the role needs organizations. A created role is never
`is_default`, so it stays editable and deletable.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_role_request import CreateRoleRequest
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
    create_role_request = radiant_python.CreateRoleRequest() # CreateRoleRequest | Role to create

    try:
        # Create a custom role
        api_response = api_instance.create_role(tenant, create_role_request)
        print("The response of RolesApi->create_role:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->create_role: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_role_request** | [**CreateRoleRequest**](CreateRoleRequest.md)| Role to create | 

### Return type

[**RoleResult**](RoleResult.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Created |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**409** | Conflict |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_role**
> RoleResult get_role(tenant, code)

Get one of the tenant's roles

Returns the role with the code in the path, in the same shape the list serves it:
the actions it grants, the `scope` derived from them, and the number of users
holding it. Requires the `can_manage_role` or the `can_manage_user` action, the same
gate as the list — it backs the role detail panel, the duplicate flow (read the
role, then create a new one from its actions), and the "what this grants" preview
the user screens show at assignment. `is_default` marks a seeded role, which is
locked and can be neither edited nor deleted. Roles are keyed per tenant, so a role
of another tenant is reported as not found.

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
    code = 'code_example' # str | Role code

    try:
        # Get one of the tenant's roles
        api_response = api_instance.get_role(tenant, code)
        print("The response of RolesApi->get_role:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->get_role: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **code** | **str**| Role code | 

### Return type

[**RoleResult**](RoleResult.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

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

