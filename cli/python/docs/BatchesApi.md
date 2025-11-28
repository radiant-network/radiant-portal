# openapi_client.BatchesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_batch**](BatchesApi.md#get_batch) | **GET** /batches/{batchId} | Retrieve a batch by ID


# **get_batch**
> GetBatchResponse get_batch(batch_id, body=body)

Retrieve a batch by ID

Retrieve a batch by ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.get_batch_response import GetBatchResponse
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
    api_instance = openapi_client.BatchesApi(api_client)
    batch_id = 'batch_id_example' # str | Batch ID
    body = None # object |  (optional)

    try:
        # Retrieve a batch by ID
        api_response = api_instance.get_batch(batch_id, body=body)
        print("The response of BatchesApi->get_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BatchesApi->get_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batch_id** | **str**| Batch ID | 
 **body** | **object**|  | [optional] 

### Return type

[**GetBatchResponse**](GetBatchResponse.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

