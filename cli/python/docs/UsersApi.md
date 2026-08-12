# radiant_python.UsersApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**list_users**](UsersApi.md#list_users) | **GET** /{tenant}/users | List the tenant&#39;s users


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
    search = 'search_example' # str | Case-insensitive substring of the user's name or email (optional)
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
 **search** | **str**| Case-insensitive substring of the user&#39;s name or email | [optional] 
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

