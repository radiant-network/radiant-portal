# radiant_python.OrganizationsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**list_organizations**](OrganizationsApi.md#list_organizations) | **GET** /{tenant}/organizations | List the tenant&#39;s organizations


# **list_organizations**
> List[OrganizationResponse] list_organizations(tenant)

List the tenant's organizations

Returns the organizations of the tenant in the path, each with its category label.
Readable by any member of the tenant; it also feeds the organization picker when
assigning org-scoped roles to a user.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.organization_response import OrganizationResponse
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
    api_instance = radiant_python.OrganizationsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # List the tenant's organizations
        api_response = api_instance.list_organizations(tenant)
        print("The response of OrganizationsApi->list_organizations:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrganizationsApi->list_organizations: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**List[OrganizationResponse]**](OrganizationResponse.md)

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

