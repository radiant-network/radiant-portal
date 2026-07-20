# radiant_python.SequencingApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_sequencing_experiment_detail_by_id**](SequencingApi.md#get_sequencing_experiment_detail_by_id) | **GET** /{tenant}/sequencing/{seq_id}/details | Get SequencingExperimentDetail by id
[**post_sequencing_experiment_batch**](SequencingApi.md#post_sequencing_experiment_batch) | **POST** /{tenant}/sequencing/batch | Create a new sequencing experiment batch
[**put_sequencing_experiment_batch**](SequencingApi.md#put_sequencing_experiment_batch) | **PUT** /{tenant}/sequencing/batch | Update existing sequencing experiments (batch)


# **get_sequencing_experiment_detail_by_id**
> SequencingExperimentDetail get_sequencing_experiment_detail_by_id(tenant, seq_id)

Get SequencingExperimentDetail by id

Get SequencingExperimentDetail by id

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.sequencing_experiment_detail import SequencingExperimentDetail
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
    tenant = 'tenant_example' # str | Tenant code
    seq_id = 'seq_id_example' # str | Seq ID

    try:
        # Get SequencingExperimentDetail by id
        api_response = api_instance.get_sequencing_experiment_detail_by_id(tenant, seq_id)
        print("The response of SequencingApi->get_sequencing_experiment_detail_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SequencingApi->get_sequencing_experiment_detail_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **seq_id** | **str**| Seq ID | 

### Return type

[**SequencingExperimentDetail**](SequencingExperimentDetail.md)

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
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_sequencing_experiment_batch**
> CreateBatchResponse post_sequencing_experiment_batch(tenant, create_sequencing_experiment_batch_body, dry_run=dry_run)

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
    tenant = 'tenant_example' # str | Tenant code
    create_sequencing_experiment_batch_body = radiant_python.CreateSequencingExperimentBatchBody() # CreateSequencingExperimentBatchBody | Create Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Create a new sequencing experiment batch
        api_response = api_instance.post_sequencing_experiment_batch(tenant, create_sequencing_experiment_batch_body, dry_run=dry_run)
        print("The response of SequencingApi->post_sequencing_experiment_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SequencingApi->post_sequencing_experiment_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
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
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_sequencing_experiment_batch**
> CreateBatchResponse put_sequencing_experiment_batch(tenant, create_sequencing_experiment_batch_body, dry_run=dry_run)

Update existing sequencing experiments (batch)

Update existing sequencing experiments — each one is looked up by (sample_organization_code, submitter_sample_id, aliquot).
A sequencing experiment not found is reported as a validation error and left untouched.

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
    tenant = 'tenant_example' # str | Tenant code
    create_sequencing_experiment_batch_body = radiant_python.CreateSequencingExperimentBatchBody() # CreateSequencingExperimentBatchBody | Update Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Update existing sequencing experiments (batch)
        api_response = api_instance.put_sequencing_experiment_batch(tenant, create_sequencing_experiment_batch_body, dry_run=dry_run)
        print("The response of SequencingApi->put_sequencing_experiment_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SequencingApi->put_sequencing_experiment_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_sequencing_experiment_batch_body** | [**CreateSequencingExperimentBatchBody**](CreateSequencingExperimentBatchBody.md)| Update Body | 
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
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

