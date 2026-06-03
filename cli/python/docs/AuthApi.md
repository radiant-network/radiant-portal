# radiant_python.AuthApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_me**](AuthApi.md#get_me) | **GET** /auth/me | Get the caller&#39;s effective authorization


# **get_me**
> List[TenantMembership] get_me()

Get the caller's effective authorization

Returns the authenticated caller's tenant memberships, each with the
tenant-scoped actions they hold and the org-scoped actions mapped to the
orgs where they apply.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.tenant_membership import TenantMembership
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
    api_instance = radiant_python.AuthApi(api_client)

    try:
        # Get the caller's effective authorization
        api_response = api_instance.get_me()
        print("The response of AuthApi->get_me:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthApi->get_me: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[TenantMembership]**](TenantMembership.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

