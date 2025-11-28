# openapi_client.SamplesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**post_sample_batch**](SamplesApi.md#post_sample_batch) | **POST** /samples/batch | Create a new sample batch


# **post_sample_batch**
> CreateBatchResponse post_sample_batch(body=body)

Create a new sample batch

Create a new sample batch

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.create_batch_response import CreateBatchResponse
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.SamplesApi(api_client)
    body = None # object |  (optional)

    try:
        # Create a new sample batch
        api_response = api_instance.post_sample_batch(body=body)
        print("The response of SamplesApi->post_sample_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SamplesApi->post_sample_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **object**|  | [optional] 

### Return type

[**CreateBatchResponse**](CreateBatchResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**202** | Accepted |  -  |
**400** | Bad Request |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

