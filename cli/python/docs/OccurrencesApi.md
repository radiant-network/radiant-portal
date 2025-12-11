# radiant_python.OccurrencesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**aggregate_germline_cnv_occurrences**](OccurrencesApi.md#aggregate_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{case_id}/{seq_id}/aggregate | Aggregate germline CNV occurrences
[**aggregate_germline_snv_occurrences**](OccurrencesApi.md#aggregate_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{case_id}/{seq_id}/aggregate | Aggregate germline SNV occurrences
[**count_germline_cnv_occurrences**](OccurrencesApi.md#count_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{case_id}/{seq_id}/count | Count germline CNV occurrences
[**count_germline_snv_occurrences**](OccurrencesApi.md#count_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{case_id}/{seq_id}/count | Count germline SNV occurrences
[**get_expanded_germline_snv_occurrence**](OccurrencesApi.md#get_expanded_germline_snv_occurrence) | **GET** /occurrences/germline/snv/{case_id}/{seq_id}/{locus_id}/expanded | Get a germline ExpandedGermlineSNVOccurrence
[**get_germline_snv_dictionary**](OccurrencesApi.md#get_germline_snv_dictionary) | **GET** /occurrences/germline/snv/dictionary | Get germline SNV facets dictionary
[**list_germline_cnv_genes_overlap**](OccurrencesApi.md#list_germline_cnv_genes_overlap) | **GET** /occurrences/germline/cnv/{case_id}/{seq_id}/{cnv_id}/genes_overlap | List genes overlapping a CNV with a given ID
[**list_germline_cnv_occurrences**](OccurrencesApi.md#list_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{case_id}/{seq_id}/list | List germline CNV occurrences
[**list_germline_snv_occurrences**](OccurrencesApi.md#list_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{case_id}/{seq_id}/list | List germline SNV occurrences
[**statistics_germline_cnv_occurrences**](OccurrencesApi.md#statistics_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{case_id}/{seq_id}/statistics | Statistics of germline CNV occurrences
[**statistics_germline_snv_occurrences**](OccurrencesApi.md#statistics_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{case_id}/{seq_id}/statistics | Statistics of germline SNV occurrences


# **aggregate_germline_cnv_occurrences**
> List[Aggregation] aggregate_germline_cnv_occurrences(case_id, seq_id, aggregation_body_with_sqon)

Aggregate germline CNV occurrences

Aggregate germline CNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.aggregation import Aggregation
from radiant_python.models.aggregation_body_with_sqon import AggregationBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    aggregation_body_with_sqon = radiant_python.AggregationBodyWithSqon() # AggregationBodyWithSqon | Aggregation Body

    try:
        # Aggregate germline CNV occurrences
        api_response = api_instance.aggregate_germline_cnv_occurrences(case_id, seq_id, aggregation_body_with_sqon)
        print("The response of OccurrencesApi->aggregate_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->aggregate_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **aggregation_body_with_sqon** | [**AggregationBodyWithSqon**](AggregationBodyWithSqon.md)| Aggregation Body | 

### Return type

[**List[Aggregation]**](Aggregation.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aggregate_germline_snv_occurrences**
> List[Aggregation] aggregate_germline_snv_occurrences(case_id, seq_id, aggregation_body_with_sqon, with_dictionary=with_dictionary)

Aggregate germline SNV occurrences

Aggregate germline SNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.aggregation import Aggregation
from radiant_python.models.aggregation_body_with_sqon import AggregationBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    aggregation_body_with_sqon = radiant_python.AggregationBodyWithSqon() # AggregationBodyWithSqon | Aggregation Body
    with_dictionary = False # bool | Whether to include all possible facet values (optional) (default to False)

    try:
        # Aggregate germline SNV occurrences
        api_response = api_instance.aggregate_germline_snv_occurrences(case_id, seq_id, aggregation_body_with_sqon, with_dictionary=with_dictionary)
        print("The response of OccurrencesApi->aggregate_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->aggregate_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **aggregation_body_with_sqon** | [**AggregationBodyWithSqon**](AggregationBodyWithSqon.md)| Aggregation Body | 
 **with_dictionary** | **bool**| Whether to include all possible facet values | [optional] [default to False]

### Return type

[**List[Aggregation]**](Aggregation.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **count_germline_cnv_occurrences**
> Count count_germline_cnv_occurrences(case_id, seq_id, count_body_with_sqon)

Count germline CNV occurrences

Counts germline CNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.count import Count
from radiant_python.models.count_body_with_sqon import CountBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    count_body_with_sqon = radiant_python.CountBodyWithSqon() # CountBodyWithSqon | Count Body

    try:
        # Count germline CNV occurrences
        api_response = api_instance.count_germline_cnv_occurrences(case_id, seq_id, count_body_with_sqon)
        print("The response of OccurrencesApi->count_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->count_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **count_body_with_sqon** | [**CountBodyWithSqon**](CountBodyWithSqon.md)| Count Body | 

### Return type

[**Count**](Count.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **count_germline_snv_occurrences**
> Count count_germline_snv_occurrences(case_id, seq_id, count_body_with_sqon)

Count germline SNV occurrences

Counts germline SNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.count import Count
from radiant_python.models.count_body_with_sqon import CountBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    count_body_with_sqon = radiant_python.CountBodyWithSqon() # CountBodyWithSqon | Count Body

    try:
        # Count germline SNV occurrences
        api_response = api_instance.count_germline_snv_occurrences(case_id, seq_id, count_body_with_sqon)
        print("The response of OccurrencesApi->count_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->count_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **count_body_with_sqon** | [**CountBodyWithSqon**](CountBodyWithSqon.md)| Count Body | 

### Return type

[**Count**](Count.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_expanded_germline_snv_occurrence**
> ExpandedGermlineSNVOccurrence get_expanded_germline_snv_occurrence(case_id, seq_id, locus_id)

Get a germline ExpandedGermlineSNVOccurrence

Retrieve ExpandedGermlineSNVOccurrence data for a given locus ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.expanded_germline_snv_occurrence import ExpandedGermlineSNVOccurrence
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get a germline ExpandedGermlineSNVOccurrence
        api_response = api_instance.get_expanded_germline_snv_occurrence(case_id, seq_id, locus_id)
        print("The response of OccurrencesApi->get_expanded_germline_snv_occurrence:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->get_expanded_germline_snv_occurrence: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **locus_id** | **str**| Locus ID | 

### Return type

[**ExpandedGermlineSNVOccurrence**](ExpandedGermlineSNVOccurrence.md)

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

# **get_germline_snv_dictionary**
> List[Facet] get_germline_snv_dictionary(facets=facets)

Get germline SNV facets dictionary

Retrieve germline SNV facets

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.facet import Facet
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    facets = ['facets_example'] # List[str] | One or more facets to retrieve (optional)

    try:
        # Get germline SNV facets dictionary
        api_response = api_instance.get_germline_snv_dictionary(facets=facets)
        print("The response of OccurrencesApi->get_germline_snv_dictionary:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->get_germline_snv_dictionary: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **facets** | [**List[str]**](str.md)| One or more facets to retrieve | [optional] 

### Return type

[**List[Facet]**](Facet.md)

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

# **list_germline_cnv_genes_overlap**
> List[CNVGeneOverlap] list_germline_cnv_genes_overlap(case_id, seq_id, cnv_id)

List genes overlapping a CNV with a given ID

List genes overlapping a CNV with a given ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.cnv_gene_overlap import CNVGeneOverlap
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    cnv_id = 'cnv_id_example' # str | Locus ID

    try:
        # List genes overlapping a CNV with a given ID
        api_response = api_instance.list_germline_cnv_genes_overlap(case_id, seq_id, cnv_id)
        print("The response of OccurrencesApi->list_germline_cnv_genes_overlap:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->list_germline_cnv_genes_overlap: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **cnv_id** | **str**| Locus ID | 

### Return type

[**List[CNVGeneOverlap]**](CNVGeneOverlap.md)

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

# **list_germline_cnv_occurrences**
> List[GermlineCNVOccurrence] list_germline_cnv_occurrences(case_id, seq_id, list_body_with_sqon)

List germline CNV occurrences

List germline CNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.germline_cnv_occurrence import GermlineCNVOccurrence
from radiant_python.models.list_body_with_sqon import ListBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    list_body_with_sqon = radiant_python.ListBodyWithSqon() # ListBodyWithSqon | List Body

    try:
        # List germline CNV occurrences
        api_response = api_instance.list_germline_cnv_occurrences(case_id, seq_id, list_body_with_sqon)
        print("The response of OccurrencesApi->list_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->list_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **list_body_with_sqon** | [**ListBodyWithSqon**](ListBodyWithSqon.md)| List Body | 

### Return type

[**List[GermlineCNVOccurrence]**](GermlineCNVOccurrence.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_germline_snv_occurrences**
> List[GermlineSNVOccurrence] list_germline_snv_occurrences(case_id, seq_id, list_body_with_sqon)

List germline SNV occurrences

List germline SNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.germline_snv_occurrence import GermlineSNVOccurrence
from radiant_python.models.list_body_with_sqon import ListBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    list_body_with_sqon = radiant_python.ListBodyWithSqon() # ListBodyWithSqon | List Body

    try:
        # List germline SNV occurrences
        api_response = api_instance.list_germline_snv_occurrences(case_id, seq_id, list_body_with_sqon)
        print("The response of OccurrencesApi->list_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->list_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **list_body_with_sqon** | [**ListBodyWithSqon**](ListBodyWithSqon.md)| List Body | 

### Return type

[**List[GermlineSNVOccurrence]**](GermlineSNVOccurrence.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statistics_germline_cnv_occurrences**
> Statistics statistics_germline_cnv_occurrences(case_id, seq_id, statistics_body_with_sqon)

Statistics of germline CNV occurrences

Return statistics about a field for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.statistics import Statistics
from radiant_python.models.statistics_body_with_sqon import StatisticsBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    statistics_body_with_sqon = radiant_python.StatisticsBodyWithSqon() # StatisticsBodyWithSqon | Statistics Body

    try:
        # Statistics of germline CNV occurrences
        api_response = api_instance.statistics_germline_cnv_occurrences(case_id, seq_id, statistics_body_with_sqon)
        print("The response of OccurrencesApi->statistics_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->statistics_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **statistics_body_with_sqon** | [**StatisticsBodyWithSqon**](StatisticsBodyWithSqon.md)| Statistics Body | 

### Return type

[**Statistics**](Statistics.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statistics_germline_snv_occurrences**
> Statistics statistics_germline_snv_occurrences(case_id, seq_id, statistics_body_with_sqon)

Statistics of germline SNV occurrences

Return statistics about a field for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.statistics import Statistics
from radiant_python.models.statistics_body_with_sqon import StatisticsBodyWithSqon
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
    api_instance = radiant_python.OccurrencesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequence ID
    statistics_body_with_sqon = radiant_python.StatisticsBodyWithSqon() # StatisticsBodyWithSqon | Statistics Body

    try:
        # Statistics of germline SNV occurrences
        api_response = api_instance.statistics_germline_snv_occurrences(case_id, seq_id, statistics_body_with_sqon)
        print("The response of OccurrencesApi->statistics_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->statistics_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequence ID | 
 **statistics_body_with_sqon** | [**StatisticsBodyWithSqon**](StatisticsBodyWithSqon.md)| Statistics Body | 

### Return type

[**Statistics**](Statistics.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

