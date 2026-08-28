# radiant_python.UsersApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_user**](UsersApi.md#create_user) | **POST** /{tenant}/users | Add a user to the tenant
[**delete_user**](UsersApi.md#delete_user) | **DELETE** /{tenant}/users/{user_id} | Remove a user from the tenant
[**list_users**](UsersApi.md#list_users) | **GET** /{tenant}/users | List the tenant&#39;s users
[**update_user**](UsersApi.md#update_user) | **PUT** /{tenant}/users/{user_id} | Update the roles of a user of the tenant


# **create_user**
> object create_user(tenant, create_user_request)

Add a user to the tenant

Provisions the user across the identity provider and the data stores, then grants
them the requested roles in the tenant in the path. Requires the `can_manage_user`
action. The `member` role is granted tenant-wide automatically and must not be
listed. Whether a role needs organizations is derived from its actions: a role
holding only tenant-scoped actions must come with no `org_codes`, one holding any
org-scoped action needs at least one (`*` meaning every organization). No password
is ever set — the identity provider links the account by email at first sign-in.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_user_request import CreateUserRequest
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
    api_instance = radiant_python.UsersApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    create_user_request = radiant_python.CreateUserRequest() # CreateUserRequest | User to add

    try:
        # Add a user to the tenant
        api_response = api_instance.create_user(tenant, create_user_request)
        print("The response of UsersApi->create_user:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UsersApi->create_user: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_user_request** | [**CreateUserRequest**](CreateUserRequest.md)| User to add | 

### Return type

**object**

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
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_user**
> delete_user(tenant, user_id)

Remove a user from the tenant

Revokes the user's access to the tenant in the path by removing every role granted
to them there, `member` included — so their next request no longer sees this tenant.
Requires the `can_manage_user` action. This is not an account deletion: the identity
provider account and the roles the same user holds in other tenants are untouched.
The last user able to manage users cannot be removed (409), and an administrator
cannot remove their own access (400).

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
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
    api_instance = radiant_python.UsersApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    user_id = 'user_id_example' # str | User id (the identity provider's subject id)

    try:
        # Remove a user from the tenant
        api_instance.delete_user(tenant, user_id)
    except Exception as e:
        print("Exception when calling UsersApi->delete_user: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **user_id** | **str**| User id (the identity provider&#39;s subject id) | 

### Return type

void (empty response body)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | No Content |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**409** | Conflict |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_users**
> UsersSearchResponse list_users(tenant, search=search, roles=roles, limit=limit, offset=offset, page_index=page_index)

List the tenant's users

Returns the users holding at least one role in the tenant in the path, each with the
roles granted to them there and the organizations those roles apply at. Requires the
`can_manage_user` action. `count` is the total matching `search`, before pagination.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.users_search_response import UsersSearchResponse
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
    api_instance = radiant_python.UsersApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    search = 'search_example' # str | Case-insensitive prefix of the user's first name, last name or email (optional)
    roles = 'roles_example' # str | Comma-separated role codes; keeps users holding any of them (optional)
    limit = 56 # int | Page size (default 25, capped at 200) (optional)
    offset = 56 # int | Number of users to skip (optional)
    page_index = 56 # int | Page to return, as an alternative to offset (optional)

    try:
        # List the tenant's users
        api_response = api_instance.list_users(tenant, search=search, roles=roles, limit=limit, offset=offset, page_index=page_index)
        print("The response of UsersApi->list_users:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UsersApi->list_users: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **search** | **str**| Case-insensitive prefix of the user&#39;s first name, last name or email | [optional] 
 **roles** | **str**| Comma-separated role codes; keeps users holding any of them | [optional] 
 **limit** | **int**| Page size (default 25, capped at 200) | [optional] 
 **offset** | **int**| Number of users to skip | [optional] 
 **page_index** | **int**| Page to return, as an alternative to offset | [optional] 

### Return type

[**UsersSearchResponse**](UsersSearchResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_user**
> object update_user(tenant, user_id, update_user_request)

Update the roles of a user of the tenant

Replaces the roles granted to the user in the tenant in the path with the ones in
the payload — a role left out is revoked. Requires the `can_manage_user` action.
The user's identity is fixed at creation: their name and the email the account
signs in with cannot be changed here. The `member` role is kept tenant-wide whether
or not it is listed, and the last user able to manage users cannot lose that
ability (409). Whether a role needs organizations is derived from its actions: a
role holding only tenant-scoped actions must come with no `org_codes`, one holding
any org-scoped action needs at least one (`*` meaning every organization).

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.update_user_request import UpdateUserRequest
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
    api_instance = radiant_python.UsersApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    user_id = 'user_id_example' # str | User id (the identity provider's subject id)
    update_user_request = radiant_python.UpdateUserRequest() # UpdateUserRequest | Roles the user should end up with

    try:
        # Update the roles of a user of the tenant
        api_response = api_instance.update_user(tenant, user_id, update_user_request)
        print("The response of UsersApi->update_user:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UsersApi->update_user: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **user_id** | **str**| User id (the identity provider&#39;s subject id) | 
 **update_user_request** | [**UpdateUserRequest**](UpdateUserRequest.md)| Roles the user should end up with | 

### Return type

**object**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**409** | Conflict |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

