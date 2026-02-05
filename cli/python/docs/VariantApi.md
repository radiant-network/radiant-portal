# radiant_python.VariantApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_expanded_germline_variant_interpreted_case**](VariantApi.md#get_expanded_germline_variant_interpreted_case) | **GET** /variants/germline/{locus_id}/cases/interpreted/{case_id}/{seq_id}/{transcript_id} | Get expanded germline interpreted case for a given locus, sequencing and transcript
[**get_germline_variant_cases_count**](VariantApi.md#get_germline_variant_cases_count) | **GET** /variants/germline/{locus_id}/cases/count | Get germline cases count for a given locus
[**get_germline_variant_cases_filters**](VariantApi.md#get_germline_variant_cases_filters) | **GET** /variants/germline/cases/filters | Get cases filters for germline variant entity
[**get_germline_variant_conditions**](VariantApi.md#get_germline_variant_conditions) | **GET** /variants/germline/{locus_id}/conditions/{panel_type} | Get conditions for germline variant entity for a specific gene panel
[**get_germline_variant_conditions_clinvar**](VariantApi.md#get_germline_variant_conditions_clinvar) | **GET** /variants/germline/{locus_id}/conditions/clinvar | Get ClinVar conditions for germline variant entity
[**get_germline_variant_consequences**](VariantApi.md#get_germline_variant_consequences) | **GET** /variants/germline/{locus_id}/consequences | Get list of VariantConsequences for a germline variant
[**get_germline_variant_external_frequencies**](VariantApi.md#get_germline_variant_external_frequencies) | **GET** /variants/germline/{locus_id}/external_frequencies | Get external frequencies
[**get_germline_variant_header**](VariantApi.md#get_germline_variant_header) | **GET** /variants/germline/{locus_id}/header | Get a germline VariantHeader
[**get_germline_variant_internal_frequencies**](VariantApi.md#get_germline_variant_internal_frequencies) | **GET** /variants/germline/{locus_id}/internal_frequencies | Get internal frequencies
[**get_germline_variant_interpreted_cases**](VariantApi.md#get_germline_variant_interpreted_cases) | **POST** /variants/germline/{locus_id}/cases/interpreted | Get list of interpreted Cases for a germline variant
[**get_germline_variant_overview**](VariantApi.md#get_germline_variant_overview) | **GET** /variants/germline/{locus_id}/overview | Get a germline VariantOverview
[**get_germline_variant_uninterpreted_cases**](VariantApi.md#get_germline_variant_uninterpreted_cases) | **POST** /variants/germline/{locus_id}/cases/uninterpreted | Get list of uninterpreted Cases for a germline variant


# **get_expanded_germline_variant_interpreted_case**
> VariantExpandedInterpretedCase get_expanded_germline_variant_interpreted_case(locus_id, case_id, seq_id, transcript_id)

Get expanded germline interpreted case for a given locus, sequencing and transcript

Retrieve germline expanded interpreted case for a given locus, sequencing and transcript

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_expanded_interpreted_case import VariantExpandedInterpretedCase
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID
    case_id = 'case_id_example' # str | Case ID
    seq_id = 'seq_id_example' # str | Seq ID
    transcript_id = 'transcript_id_example' # str | Transcript ID

    try:
        # Get expanded germline interpreted case for a given locus, sequencing and transcript
        api_response = api_instance.get_expanded_germline_variant_interpreted_case(locus_id, case_id, seq_id, transcript_id)
        print("The response of VariantApi->get_expanded_germline_variant_interpreted_case:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_expanded_germline_variant_interpreted_case: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 
 **case_id** | **str**| Case ID | 
 **seq_id** | **str**| Seq ID | 
 **transcript_id** | **str**| Transcript ID | 

### Return type

[**VariantExpandedInterpretedCase**](VariantExpandedInterpretedCase.md)

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

# **get_germline_variant_cases_count**
> VariantCasesCount get_germline_variant_cases_count(locus_id)

Get germline cases count for a given locus

Retrieve cases count for a given locus id

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_cases_count import VariantCasesCount
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get germline cases count for a given locus
        api_response = api_instance.get_germline_variant_cases_count(locus_id)
        print("The response of VariantApi->get_germline_variant_cases_count:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_cases_count: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 

### Return type

[**VariantCasesCount**](VariantCasesCount.md)

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

# **get_germline_variant_cases_filters**
> VariantCasesFilters get_germline_variant_cases_filters()

Get cases filters for germline variant entity

Retrieve cases filters for germline variant entity

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_cases_filters import VariantCasesFilters
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
    api_instance = radiant_python.VariantApi(api_client)

    try:
        # Get cases filters for germline variant entity
        api_response = api_instance.get_germline_variant_cases_filters()
        print("The response of VariantApi->get_germline_variant_cases_filters:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_cases_filters: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**VariantCasesFilters**](VariantCasesFilters.md)

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

# **get_germline_variant_conditions**
> GenePanelConditions get_germline_variant_conditions(locus_id, panel_type, filter=filter)

Get conditions for germline variant entity for a specific gene panel

Retrieve conditions for germline variant entity for a specific gene panel

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.gene_panel_conditions import GenePanelConditions
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID
    panel_type = 'panel_type_example' # str | Gene panel type
    filter = 'filter_example' # str | Condition filter (optional)

    try:
        # Get conditions for germline variant entity for a specific gene panel
        api_response = api_instance.get_germline_variant_conditions(locus_id, panel_type, filter=filter)
        print("The response of VariantApi->get_germline_variant_conditions:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_conditions: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 
 **panel_type** | **str**| Gene panel type | 
 **filter** | **str**| Condition filter | [optional] 

### Return type

[**GenePanelConditions**](GenePanelConditions.md)

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

# **get_germline_variant_conditions_clinvar**
> List[ClinvarRCV] get_germline_variant_conditions_clinvar(locus_id)

Get ClinVar conditions for germline variant entity

Retrieve ClinVar conditions for germline variant entity

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.clinvar_rcv import ClinvarRCV
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get ClinVar conditions for germline variant entity
        api_response = api_instance.get_germline_variant_conditions_clinvar(locus_id)
        print("The response of VariantApi->get_germline_variant_conditions_clinvar:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_conditions_clinvar: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 

### Return type

[**List[ClinvarRCV]**](ClinvarRCV.md)

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

# **get_germline_variant_consequences**
> List[VariantConsequence] get_germline_variant_consequences(locus_id)

Get list of VariantConsequences for a germline variant

Retrieve germline Variant Consequences for a given locus

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_consequence import VariantConsequence
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get list of VariantConsequences for a germline variant
        api_response = api_instance.get_germline_variant_consequences(locus_id)
        print("The response of VariantApi->get_germline_variant_consequences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_consequences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 

### Return type

[**List[VariantConsequence]**](VariantConsequence.md)

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

# **get_germline_variant_external_frequencies**
> VariantExternalFrequencies get_germline_variant_external_frequencies(locus_id)

Get external frequencies

Retrieve external frequencies for a given locus id

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_external_frequencies import VariantExternalFrequencies
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get external frequencies
        api_response = api_instance.get_germline_variant_external_frequencies(locus_id)
        print("The response of VariantApi->get_germline_variant_external_frequencies:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_external_frequencies: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 

### Return type

[**VariantExternalFrequencies**](VariantExternalFrequencies.md)

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

# **get_germline_variant_header**
> VariantHeader get_germline_variant_header(locus_id)

Get a germline VariantHeader

Retrieve germline Variant Header data for a given locus

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_header import VariantHeader
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get a germline VariantHeader
        api_response = api_instance.get_germline_variant_header(locus_id)
        print("The response of VariantApi->get_germline_variant_header:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_header: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 

### Return type

[**VariantHeader**](VariantHeader.md)

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

# **get_germline_variant_internal_frequencies**
> VariantInternalFrequencies get_germline_variant_internal_frequencies(locus_id, split)

Get internal frequencies

Retrieve internal frequencies for a given locus id

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_internal_frequencies import VariantInternalFrequencies
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID
    split = 'split_example' # str | split type

    try:
        # Get internal frequencies
        api_response = api_instance.get_germline_variant_internal_frequencies(locus_id, split)
        print("The response of VariantApi->get_germline_variant_internal_frequencies:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_internal_frequencies: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 
 **split** | **str**| split type | 

### Return type

[**VariantInternalFrequencies**](VariantInternalFrequencies.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_germline_variant_interpreted_cases**
> VariantInterpretedCasesSearchResponse get_germline_variant_interpreted_cases(locus_id, list_body_with_criteria)

Get list of interpreted Cases for a germline variant

Retrieve Germline Variant interpreted cases for a given locus

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria
from radiant_python.models.variant_interpreted_cases_search_response import VariantInterpretedCasesSearchResponse
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID
    list_body_with_criteria = radiant_python.ListBodyWithCriteria() # ListBodyWithCriteria | Search Body with criteria

    try:
        # Get list of interpreted Cases for a germline variant
        api_response = api_instance.get_germline_variant_interpreted_cases(locus_id, list_body_with_criteria)
        print("The response of VariantApi->get_germline_variant_interpreted_cases:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_interpreted_cases: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 
 **list_body_with_criteria** | [**ListBodyWithCriteria**](ListBodyWithCriteria.md)| Search Body with criteria | 

### Return type

[**VariantInterpretedCasesSearchResponse**](VariantInterpretedCasesSearchResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_germline_variant_overview**
> VariantOverview get_germline_variant_overview(locus_id)

Get a germline VariantOverview

Retrieve germline Variant Overview data for a given locus

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.variant_overview import VariantOverview
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get a germline VariantOverview
        api_response = api_instance.get_germline_variant_overview(locus_id)
        print("The response of VariantApi->get_germline_variant_overview:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_overview: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 

### Return type

[**VariantOverview**](VariantOverview.md)

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

# **get_germline_variant_uninterpreted_cases**
> VariantUninterpretedCasesSearchResponse get_germline_variant_uninterpreted_cases(locus_id, list_body_with_criteria)

Get list of uninterpreted Cases for a germline variant

Retrieve Germline Variant uninterpreted cases for a given locus

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria
from radiant_python.models.variant_uninterpreted_cases_search_response import VariantUninterpretedCasesSearchResponse
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
    api_instance = radiant_python.VariantApi(api_client)
    locus_id = 'locus_id_example' # str | Locus ID
    list_body_with_criteria = radiant_python.ListBodyWithCriteria() # ListBodyWithCriteria | Search Body with criteria

    try:
        # Get list of uninterpreted Cases for a germline variant
        api_response = api_instance.get_germline_variant_uninterpreted_cases(locus_id, list_body_with_criteria)
        print("The response of VariantApi->get_germline_variant_uninterpreted_cases:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VariantApi->get_germline_variant_uninterpreted_cases: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **locus_id** | **str**| Locus ID | 
 **list_body_with_criteria** | [**ListBodyWithCriteria**](ListBodyWithCriteria.md)| Search Body with criteria | 

### Return type

[**VariantUninterpretedCasesSearchResponse**](VariantUninterpretedCasesSearchResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

