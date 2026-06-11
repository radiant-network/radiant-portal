# radiant_python.CasesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**autocomplete_cases**](CasesApi.md#autocomplete_cases) | **GET** /{tenant}/cases/autocomplete | Get AutocompleteResult list of matching prefix
[**case_entity**](CasesApi.md#case_entity) | **GET** /{tenant}/cases/{case_id} | Get CaseEntity case entity
[**case_entity_documents_filters**](CasesApi.md#case_entity_documents_filters) | **GET** /{tenant}/cases/{case_id}/documents/filters | Get DocumentFilters documents filters for a specific case
[**case_entity_documents_search**](CasesApi.md#case_entity_documents_search) | **POST** /{tenant}/cases/{case_id}/documents/search | Search DocumentResult list for a case entity
[**case_tasks_with_occurrences**](CasesApi.md#case_tasks_with_occurrences) | **GET** /{tenant}/cases/{case_id}/{seq_id}/tasks_with_occurrences | List tasks producing occurrences of a given type for a (case, sequencing) pair
[**cases_filters**](CasesApi.md#cases_filters) | **GET** /{tenant}/cases/filters | Get CaseFilters cases filters
[**patch_case_batch**](CasesApi.md#patch_case_batch) | **PATCH** /{tenant}/cases/batch | Partially update existing cases (batch)
[**post_case_batch**](CasesApi.md#post_case_batch) | **POST** /{tenant}/cases/batch | Create a new case batch
[**search_cases**](CasesApi.md#search_cases) | **POST** /{tenant}/cases/search | Search cases


# **autocomplete_cases**
> List[AutocompleteResult] autocomplete_cases(tenant, prefix, limit=limit)

Get AutocompleteResult list of matching prefix

Retrieve AutocompleteResult list of ids matching prefix

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.autocomplete_result import AutocompleteResult
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    prefix = 'prefix_example' # str | Prefix
    limit = 'limit_example' # str | Limit (optional)

    try:
        # Get AutocompleteResult list of matching prefix
        api_response = api_instance.autocomplete_cases(tenant, prefix, limit=limit)
        print("The response of CasesApi->autocomplete_cases:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->autocomplete_cases: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **prefix** | **str**| Prefix | 
 **limit** | **str**| Limit | [optional] 

### Return type

[**List[AutocompleteResult]**](AutocompleteResult.md)

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

# **case_entity**
> CaseEntity case_entity(tenant, case_id)

Get CaseEntity case entity

Retrieve CaseEntity by its ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.case_entity import CaseEntity
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    case_id = 56 # int | Case ID

    try:
        # Get CaseEntity case entity
        api_response = api_instance.case_entity(tenant, case_id)
        print("The response of CasesApi->case_entity:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->case_entity: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **case_id** | **int**| Case ID | 

### Return type

[**CaseEntity**](CaseEntity.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **case_entity_documents_filters**
> DocumentFilters case_entity_documents_filters(tenant, case_id)

Get DocumentFilters documents filters for a specific case

Retrieve DocumentFilters documents filters for a specific case

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.document_filters import DocumentFilters
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    case_id = 56 # int | Case ID

    try:
        # Get DocumentFilters documents filters for a specific case
        api_response = api_instance.case_entity_documents_filters(tenant, case_id)
        print("The response of CasesApi->case_entity_documents_filters:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->case_entity_documents_filters: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **case_id** | **int**| Case ID | 

### Return type

[**DocumentFilters**](DocumentFilters.md)

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

# **case_entity_documents_search**
> DocumentsSearchResponse case_entity_documents_search(tenant, case_id, list_body_with_criteria)

Search DocumentResult list for a case entity

Search for DocumentResult list for a case entity

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.documents_search_response import DocumentsSearchResponse
from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    case_id = 56 # int | Case ID
    list_body_with_criteria = radiant_python.ListBodyWithCriteria() # ListBodyWithCriteria | List Body

    try:
        # Search DocumentResult list for a case entity
        api_response = api_instance.case_entity_documents_search(tenant, case_id, list_body_with_criteria)
        print("The response of CasesApi->case_entity_documents_search:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->case_entity_documents_search: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **case_id** | **int**| Case ID | 
 **list_body_with_criteria** | [**ListBodyWithCriteria**](ListBodyWithCriteria.md)| List Body | 

### Return type

[**DocumentsSearchResponse**](DocumentsSearchResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **case_tasks_with_occurrences**
> List[TaskOccurrenceType] case_tasks_with_occurrences(tenant, case_id, seq_id, data_type)

List tasks producing occurrences of a given type for a (case, sequencing) pair

Return tasks attached to the given case and sequencing experiment whose task type produces occurrences of the requested occurrence type. Sorted by created_on DESC. Returns an empty list (200) when no task matches.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.task_occurrence_type import TaskOccurrenceType
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequencing Experiment ID
    data_type = 'data_type_example' # str | Occurrence type

    try:
        # List tasks producing occurrences of a given type for a (case, sequencing) pair
        api_response = api_instance.case_tasks_with_occurrences(tenant, case_id, seq_id, data_type)
        print("The response of CasesApi->case_tasks_with_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->case_tasks_with_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequencing Experiment ID | 
 **data_type** | **str**| Occurrence type | 

### Return type

[**List[TaskOccurrenceType]**](TaskOccurrenceType.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cases_filters**
> CaseFilters cases_filters(tenant)

Get CaseFilters cases filters

Retrieve CaseFilters cases filters

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.case_filters import CaseFilters
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Get CaseFilters cases filters
        api_response = api_instance.cases_filters(tenant)
        print("The response of CasesApi->cases_filters:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->cases_filters: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**CaseFilters**](CaseFilters.md)

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

# **patch_case_batch**
> CreateBatchResponse patch_case_batch(tenant, patch_case_batch_body, dry_run=dry_run)

Partially update existing cases (batch)

Partially updates existing cases — see the request body for updatable fields.
Each case is looked up by (project_code, submitter_case_id); CASE-012 is returned if not found.
Array fields are appended, not replaced.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_batch_response import CreateBatchResponse
from radiant_python.models.patch_case_batch_body import PatchCaseBatchBody
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    patch_case_batch_body = radiant_python.PatchCaseBatchBody() # PatchCaseBatchBody | Attach Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Partially update existing cases (batch)
        api_response = api_instance.patch_case_batch(tenant, patch_case_batch_body, dry_run=dry_run)
        print("The response of CasesApi->patch_case_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->patch_case_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **patch_case_batch_body** | [**PatchCaseBatchBody**](PatchCaseBatchBody.md)| Attach Body | 
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

# **post_case_batch**
> CreateBatchResponse post_case_batch(tenant, create_case_batch_body, dry_run=dry_run)

Create a new case batch

Create a new case batch

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_batch_response import CreateBatchResponse
from radiant_python.models.create_case_batch_body import CreateCaseBatchBody
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    create_case_batch_body = radiant_python.CreateCaseBatchBody() # CreateCaseBatchBody | Create Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Create a new case batch
        api_response = api_instance.post_case_batch(tenant, create_case_batch_body, dry_run=dry_run)
        print("The response of CasesApi->post_case_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->post_case_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_case_batch_body** | [**CreateCaseBatchBody**](CreateCaseBatchBody.md)| Create Body | 
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

# **search_cases**
> CasesSearchResponse search_cases(tenant, list_body_with_criteria)

Search cases

Search cases

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.cases_search_response import CasesSearchResponse
from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria
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
    api_instance = radiant_python.CasesApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    list_body_with_criteria = radiant_python.ListBodyWithCriteria() # ListBodyWithCriteria | List Body

    try:
        # Search cases
        api_response = api_instance.search_cases(tenant, list_body_with_criteria)
        print("The response of CasesApi->search_cases:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CasesApi->search_cases: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **list_body_with_criteria** | [**ListBodyWithCriteria**](ListBodyWithCriteria.md)| List Body | 

### Return type

[**CasesSearchResponse**](CasesSearchResponse.md)

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
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

