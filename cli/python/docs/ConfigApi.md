# radiant_python.ConfigApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_client_config**](ConfigApi.md#get_client_config) | **GET** /config | Get public client configuration


# **get_client_config**
> ClientConfig get_client_config()

Get public client configuration

Settings a command-line client needs to authenticate (Keycloak device flow). Public, no token required.

### Example


```python
import radiant_python
from radiant_python.models.client_config import ClientConfig
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.ConfigApi(api_client)

    try:
        # Get public client configuration
        api_response = api_instance.get_client_config()
        print("The response of ConfigApi->get_client_config:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ConfigApi->get_client_config: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**ClientConfig**](ClientConfig.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

