# radiant_python.SequencingApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_sequencing**](SequencingApi.md#get_sequencing) | **GET** /sequencing/{seq_id} | Get a Sequencing
[**post_sequencing_experiment_batch**](SequencingApi.md#post_sequencing_experiment_batch) | **POST** /sequencing/batch | Create a new sequencing experiment batch


# **get_sequencing**
> Sequencing get_sequencing(seq_id)

Get a Sequencing

Retrieve Sequencing data for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.sequencing import Sequencing
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
    api_instance = radiant_python.SequencingApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID

    try:
        # Get a Sequencing
        api_response = api_instance.get_sequencing(seq_id)
        print("The response of SequencingApi->get_sequencing:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SequencingApi->get_sequencing: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 

### Return type

[**Sequencing**](Sequencing.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_sequencing_experiment_batch**
> CreateBatchResponse post_sequencing_experiment_batch(create_sequencing_experiment_batch_body, dry_run=dry_run)

Create a new sequencing experiment batch

Create a new sequencing experiment batch

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_batch_response import CreateBatchResponse
from radiant_python.models.create_sequencing_experiment_batch_body import CreateSequencingExperimentBatchBody
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
    api_instance = radiant_python.SequencingApi(api_client)
    create_sequencing_experiment_batch_body = radiant_python.CreateSequencingExperimentBatchBody() # CreateSequencingExperimentBatchBody | Create Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Create a new sequencing experiment batch
        api_response = api_instance.post_sequencing_experiment_batch(create_sequencing_experiment_batch_body, dry_run=dry_run)
        print("The response of SequencingApi->post_sequencing_experiment_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SequencingApi->post_sequencing_experiment_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_sequencing_experiment_batch_body** | [**CreateSequencingExperimentBatchBody**](CreateSequencingExperimentBatchBody.md)| Create Body | 
 **dry_run** | **bool**| Dry Run | [optional] [default to False]

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

