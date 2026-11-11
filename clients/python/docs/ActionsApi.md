# radiant_python.ActionsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**list_actions**](ActionsApi.md#list_actions) | **GET** /actions | List the authorization action catalog


# **list_actions**
> List[ActionResponse] list_actions()

List the authorization action catalog

Returns the global action catalog, used to build the role-editing action picker.
Not tenant-scoped; any authenticated user may read it.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.action_response import ActionResponse
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
    api_instance = radiant_python.ActionsApi(api_client)

    try:
        # List the authorization action catalog
        api_response = api_instance.list_actions()
        print("The response of ActionsApi->list_actions:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ActionsApi->list_actions: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[ActionResponse]**](ActionResponse.md)

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
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

