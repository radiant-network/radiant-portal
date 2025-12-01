# radiant_python.HpoApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**hpo_term_auto_complete**](HpoApi.md#hpo_term_auto_complete) | **GET** /hpo/autocomplete | Get AutoCompleteTerm list of matching input string with highlighted


# **hpo_term_auto_complete**
> List[AutoCompleteTerm] hpo_term_auto_complete(prefix, limit=limit)

Get AutoCompleteTerm list of matching input string with highlighted

Retrieve AutoCompleteTerm list of HPO terms matching input string with highlighted

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.auto_complete_term import AutoCompleteTerm
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
    api_instance = radiant_python.HpoApi(api_client)
    prefix = 'prefix_example' # str | Prefix
    limit = 'limit_example' # str | Limit (optional)

    try:
        # Get AutoCompleteTerm list of matching input string with highlighted
        api_response = api_instance.hpo_term_auto_complete(prefix, limit=limit)
        print("The response of HpoApi->hpo_term_auto_complete:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HpoApi->hpo_term_auto_complete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **prefix** | **str**| Prefix | 
 **limit** | **str**| Limit | [optional] 

### Return type

[**List[AutoCompleteTerm]**](AutoCompleteTerm.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

