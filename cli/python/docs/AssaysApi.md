# radiant_python.AssaysApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_assay_by_seq_id**](AssaysApi.md#get_assay_by_seq_id) | **GET** /assays/{seq_id} | Get Assay by seq_id


# **get_assay_by_seq_id**
> Assay get_assay_by_seq_id(seq_id)

Get Assay by seq_id

Get Assay by seq_id

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.assay import Assay
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
    api_instance = radiant_python.AssaysApi(api_client)
    seq_id = 'seq_id_example' # str | Seq ID

    try:
        # Get Assay by seq_id
        api_response = api_instance.get_assay_by_seq_id(seq_id)
        print("The response of AssaysApi->get_assay_by_seq_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AssaysApi->get_assay_by_seq_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Seq ID | 

### Return type

[**Assay**](Assay.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

