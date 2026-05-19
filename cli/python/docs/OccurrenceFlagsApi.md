# radiant_python.OccurrenceFlagsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**upsert_occurrence_flag**](OccurrenceFlagsApi.md#upsert_occurrence_flag) | **POST** /occurrences/flags/{case_id}/{seq_id}/{task_id}/{occurrence_id} | Set or change the flag on an occurrence


# **upsert_occurrence_flag**
> upsert_occurrence_flag(case_id, seq_id, task_id, occurrence_id, flag_type)

Set or change the flag on an occurrence

Upserts the flag for a given (case_id, occurrence_id, seq_id, task_id). An occurrence has at most one flag per case.

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
    api_instance = radiant_python.OccurrenceFlagsApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Seq ID
    task_id = 56 # int | Task ID
    occurrence_id = 'occurrence_id_example' # str | Occurrence ID
    flag_type = 'flag_type_example' # str | Flag to set

    try:
        # Set or change the flag on an occurrence
        api_instance.upsert_occurrence_flag(case_id, seq_id, task_id, occurrence_id, flag_type)
    except Exception as e:
        print("Exception when calling OccurrenceFlagsApi->upsert_occurrence_flag: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Seq ID | 
 **task_id** | **int**| Task ID | 
 **occurrence_id** | **str**| Occurrence ID | 
 **flag_type** | **str**| Flag to set | 

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

