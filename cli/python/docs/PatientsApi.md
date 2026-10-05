# radiant_python.PatientsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**autocomplete_patients**](PatientsApi.md#autocomplete_patients) | **GET** /{tenant}/patients/autocomplete | Get AutocompleteResult list of PCX patients matching prefix
[**patient_entity**](PatientsApi.md#patient_entity) | **GET** /{tenant}/patients/{patient_key} | Get PatientEntity patient entity
[**patients_filters**](PatientsApi.md#patients_filters) | **GET** /{tenant}/patients/filters | Get PatientFilters patient list filters
[**patients_statistics**](PatientsApi.md#patients_statistics) | **GET** /{tenant}/patients/statistics | Get PatientStatistics cohort analytics
[**post_patient_batch**](PatientsApi.md#post_patient_batch) | **POST** /{tenant}/patients/batch | Create a new patient batch
[**put_patient_batch**](PatientsApi.md#put_patient_batch) | **PUT** /{tenant}/patients/batch | Update existing patients (batch)
[**search_patients**](PatientsApi.md#search_patients) | **POST** /{tenant}/patients/search | Search PCX patients


# **autocomplete_patients**
> List[AutocompleteResult] autocomplete_patients(tenant, prefix, limit=limit)

Get AutocompleteResult list of PCX patients matching prefix

Retrieve AutocompleteResult list matching prefix, of type patient_id or patient_name (names only where can_read_phi is true). A selected suggestion becomes a search criterion on the field named by its type.

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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    prefix = 'prefix_example' # str | Prefix
    limit = 'limit_example' # str | Limit (optional)

    try:
        # Get AutocompleteResult list of PCX patients matching prefix
        api_response = api_instance.autocomplete_patients(tenant, prefix, limit=limit)
        print("The response of PatientsApi->autocomplete_patients:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->autocomplete_patients: %s\n" % e)
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

# **patient_entity**
> PatientEntity patient_entity(tenant, patient_key)

Get PatientEntity patient entity

Retrieve PatientEntity by its patient_key. 404 for an unknown or malformed key, with no hint that the patient exists.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.patient_entity import PatientEntity
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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    patient_key = 'patient_key_example' # str | Patient key

    try:
        # Get PatientEntity patient entity
        api_response = api_instance.patient_entity(tenant, patient_key)
        print("The response of PatientsApi->patient_entity:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->patient_entity: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **patient_key** | **str**| Patient key | 

### Return type

[**PatientEntity**](PatientEntity.md)

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

# **patients_filters**
> PatientFilters patients_filters(tenant)

Get PatientFilters patient list filters

Retrieve PatientFilters patient list filters

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.patient_filters import PatientFilters
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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Get PatientFilters patient list filters
        api_response = api_instance.patients_filters(tenant)
        print("The response of PatientsApi->patients_filters:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->patients_filters: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**PatientFilters**](PatientFilters.md)

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

# **patients_statistics**
> PatientStatistics patients_statistics(tenant)

Get PatientStatistics cohort analytics

Retrieve PatientStatistics on every PCX patient the caller can see, regardless of the list filters

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.patient_statistics import PatientStatistics
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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Get PatientStatistics cohort analytics
        api_response = api_instance.patients_statistics(tenant)
        print("The response of PatientsApi->patients_statistics:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->patients_statistics: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**PatientStatistics**](PatientStatistics.md)

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

# **post_patient_batch**
> CreateBatchResponse post_patient_batch(tenant, create_patient_batch_body, dry_run=dry_run)

Create a new patient batch

Create a new patient batch

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_batch_response import CreateBatchResponse
from radiant_python.models.create_patient_batch_body import CreatePatientBatchBody
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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    create_patient_batch_body = radiant_python.CreatePatientBatchBody() # CreatePatientBatchBody | Create Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Create a new patient batch
        api_response = api_instance.post_patient_batch(tenant, create_patient_batch_body, dry_run=dry_run)
        print("The response of PatientsApi->post_patient_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->post_patient_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_patient_batch_body** | [**CreatePatientBatchBody**](CreatePatientBatchBody.md)| Create Body | 
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

# **put_patient_batch**
> CreateBatchResponse put_patient_batch(tenant, create_patient_batch_body, dry_run=dry_run)

Update existing patients (batch)

Update existing patients — each patient is looked up by (patient_organization_code, submitter_patient_id).
A patient not found is reported as a validation error and left untouched.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_batch_response import CreateBatchResponse
from radiant_python.models.create_patient_batch_body import CreatePatientBatchBody
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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    create_patient_batch_body = radiant_python.CreatePatientBatchBody() # CreatePatientBatchBody | Update Body
    dry_run = False # bool | Dry Run (optional) (default to False)

    try:
        # Update existing patients (batch)
        api_response = api_instance.put_patient_batch(tenant, create_patient_batch_body, dry_run=dry_run)
        print("The response of PatientsApi->put_patient_batch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->put_patient_batch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_patient_batch_body** | [**CreatePatientBatchBody**](CreatePatientBatchBody.md)| Update Body | 
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

# **search_patients**
> PatientsSearchResponse search_patients(tenant, list_body_with_criteria)

Search PCX patients

Search PCX patients. Default sort: can_read_phi desc, organization_code asc, patient_id asc. Filterable fields: vital_status, organization_code, cns_integrated_diagnosis, patient_id and patient_name (the latter only matches rows where can_read_phi is true).

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria
from radiant_python.models.patients_search_response import PatientsSearchResponse
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
    api_instance = radiant_python.PatientsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    list_body_with_criteria = radiant_python.ListBodyWithCriteria() # ListBodyWithCriteria | List Body

    try:
        # Search PCX patients
        api_response = api_instance.search_patients(tenant, list_body_with_criteria)
        print("The response of PatientsApi->search_patients:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling PatientsApi->search_patients: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **list_body_with_criteria** | [**ListBodyWithCriteria**](ListBodyWithCriteria.md)| List Body | 

### Return type

[**PatientsSearchResponse**](PatientsSearchResponse.md)

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

