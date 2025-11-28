# openapi_client.OccurrencesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**aggregate_germline_cnv_occurrences**](OccurrencesApi.md#aggregate_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{seq_id}/aggregate | Aggregate germline CNV occurrences
[**aggregate_germline_snv_occurrences**](OccurrencesApi.md#aggregate_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{seq_id}/aggregate | Aggregate germline SNV occurrences
[**count_germline_cnv_occurrences**](OccurrencesApi.md#count_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{seq_id}/count | Count germline CNV occurrences
[**count_germline_snv_occurrences**](OccurrencesApi.md#count_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{seq_id}/count | Count germline SNV occurrences
[**get_expanded_germline_snv_occurrence**](OccurrencesApi.md#get_expanded_germline_snv_occurrence) | **GET** /occurrences/germline/snv/{seq_id}/{locus_id}/expanded | Get a germline ExpandedGermlineSNVOccurrence
[**get_germline_snv_dictionary**](OccurrencesApi.md#get_germline_snv_dictionary) | **GET** /occurrences/germline/snv/dictionary | Get germline SNV facets dictionary
[**list_germline_cnv_genes_overlap**](OccurrencesApi.md#list_germline_cnv_genes_overlap) | **GET** /occurrences/germline/cnv/{seq_id}/{cnv_id}/genes_overlap | List genes overlapping a CNV with a given ID
[**list_germline_cnv_occurrences**](OccurrencesApi.md#list_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{seq_id}/list | List germline CNV occurrences
[**list_germline_snv_occurrences**](OccurrencesApi.md#list_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{seq_id}/list | List germline SNV occurrences
[**statistics_germline_cnv_occurrences**](OccurrencesApi.md#statistics_germline_cnv_occurrences) | **POST** /occurrences/germline/cnv/{seq_id}/statistics | Statistics of germline CNV occurrences
[**statistics_germline_snv_occurrences**](OccurrencesApi.md#statistics_germline_snv_occurrences) | **POST** /occurrences/germline/snv/{seq_id}/statistics | Statistics of germline SNV occurrences


# **aggregate_germline_cnv_occurrences**
> List[Aggregation] aggregate_germline_cnv_occurrences(seq_id, aggregation_body_with_sqon)

Aggregate germline CNV occurrences

Aggregate germline CNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.aggregation import Aggregation
from openapi_client.models.aggregation_body_with_sqon import AggregationBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    aggregation_body_with_sqon = openapi_client.AggregationBodyWithSqon() # AggregationBodyWithSqon | Aggregation Body

    try:
        # Aggregate germline CNV occurrences
        api_response = api_instance.aggregate_germline_cnv_occurrences(seq_id, aggregation_body_with_sqon)
        print("The response of OccurrencesApi->aggregate_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->aggregate_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> List[Aggregation] aggregate_germline_snv_occurrences(seq_id, aggregation_body_with_sqon, with_dictionary=with_dictionary)

Aggregate germline SNV occurrences

Aggregate germline SNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.aggregation import Aggregation
from openapi_client.models.aggregation_body_with_sqon import AggregationBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    aggregation_body_with_sqon = openapi_client.AggregationBodyWithSqon() # AggregationBodyWithSqon | Aggregation Body
    with_dictionary = False # bool | Whether to include all possible facet values (optional) (default to False)

    try:
        # Aggregate germline SNV occurrences
        api_response = api_instance.aggregate_germline_snv_occurrences(seq_id, aggregation_body_with_sqon, with_dictionary=with_dictionary)
        print("The response of OccurrencesApi->aggregate_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->aggregate_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> Count count_germline_cnv_occurrences(seq_id, count_body_with_sqon)

Count germline CNV occurrences

Counts germline CNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.count import Count
from openapi_client.models.count_body_with_sqon import CountBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    count_body_with_sqon = openapi_client.CountBodyWithSqon() # CountBodyWithSqon | Count Body

    try:
        # Count germline CNV occurrences
        api_response = api_instance.count_germline_cnv_occurrences(seq_id, count_body_with_sqon)
        print("The response of OccurrencesApi->count_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->count_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> Count count_germline_snv_occurrences(seq_id, count_body_with_sqon)

Count germline SNV occurrences

Counts germline SNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.count import Count
from openapi_client.models.count_body_with_sqon import CountBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    count_body_with_sqon = openapi_client.CountBodyWithSqon() # CountBodyWithSqon | Count Body

    try:
        # Count germline SNV occurrences
        api_response = api_instance.count_germline_snv_occurrences(seq_id, count_body_with_sqon)
        print("The response of OccurrencesApi->count_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->count_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> ExpandedGermlineSNVOccurrence get_expanded_germline_snv_occurrence(seq_id, locus_id)

Get a germline ExpandedGermlineSNVOccurrence

Retrieve ExpandedGermlineSNVOccurrence data for a given locus ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.expanded_germline_snv_occurrence import ExpandedGermlineSNVOccurrence
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    locus_id = 'locus_id_example' # str | Locus ID

    try:
        # Get a germline ExpandedGermlineSNVOccurrence
        api_response = api_instance.get_expanded_germline_snv_occurrence(seq_id, locus_id)
        print("The response of OccurrencesApi->get_expanded_germline_snv_occurrence:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->get_expanded_germline_snv_occurrence: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
import openapi_client
from openapi_client.models.facet import Facet
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
    api_instance = openapi_client.OccurrencesApi(api_client)
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
> List[CNVGeneOverlap] list_germline_cnv_genes_overlap(seq_id, cnv_id)

List genes overlapping a CNV with a given ID

List genes overlapping a CNV with a given ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.cnv_gene_overlap import CNVGeneOverlap
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 56 # int | Sequence ID
    cnv_id = 'cnv_id_example' # str | Locus ID

    try:
        # List genes overlapping a CNV with a given ID
        api_response = api_instance.list_germline_cnv_genes_overlap(seq_id, cnv_id)
        print("The response of OccurrencesApi->list_germline_cnv_genes_overlap:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->list_germline_cnv_genes_overlap: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
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
> List[GermlineCNVOccurrence] list_germline_cnv_occurrences(seq_id, list_body_with_sqon)

List germline CNV occurrences

List germline CNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.germline_cnv_occurrence import GermlineCNVOccurrence
from openapi_client.models.list_body_with_sqon import ListBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    list_body_with_sqon = openapi_client.ListBodyWithSqon() # ListBodyWithSqon | List Body

    try:
        # List germline CNV occurrences
        api_response = api_instance.list_germline_cnv_occurrences(seq_id, list_body_with_sqon)
        print("The response of OccurrencesApi->list_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->list_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> List[GermlineSNVOccurrence] list_germline_snv_occurrences(seq_id, list_body_with_sqon)

List germline SNV occurrences

List germline SNV occurrences for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.germline_snv_occurrence import GermlineSNVOccurrence
from openapi_client.models.list_body_with_sqon import ListBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    list_body_with_sqon = openapi_client.ListBodyWithSqon() # ListBodyWithSqon | List Body

    try:
        # List germline SNV occurrences
        api_response = api_instance.list_germline_snv_occurrences(seq_id, list_body_with_sqon)
        print("The response of OccurrencesApi->list_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->list_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> Statistics statistics_germline_cnv_occurrences(seq_id, statistics_body_with_sqon)

Statistics of germline CNV occurrences

Return statistics about a field for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.statistics import Statistics
from openapi_client.models.statistics_body_with_sqon import StatisticsBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    statistics_body_with_sqon = openapi_client.StatisticsBodyWithSqon() # StatisticsBodyWithSqon | Statistics Body

    try:
        # Statistics of germline CNV occurrences
        api_response = api_instance.statistics_germline_cnv_occurrences(seq_id, statistics_body_with_sqon)
        print("The response of OccurrencesApi->statistics_germline_cnv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->statistics_germline_cnv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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
> Statistics statistics_germline_snv_occurrences(seq_id, statistics_body_with_sqon)

Statistics of germline SNV occurrences

Return statistics about a field for a given sequence ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.statistics import Statistics
from openapi_client.models.statistics_body_with_sqon import StatisticsBodyWithSqon
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
    api_instance = openapi_client.OccurrencesApi(api_client)
    seq_id = 'seq_id_example' # str | Sequence ID
    statistics_body_with_sqon = openapi_client.StatisticsBodyWithSqon() # StatisticsBodyWithSqon | Statistics Body

    try:
        # Statistics of germline SNV occurrences
        api_response = api_instance.statistics_germline_snv_occurrences(seq_id, statistics_body_with_sqon)
        print("The response of OccurrencesApi->statistics_germline_snv_occurrences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrencesApi->statistics_germline_snv_occurrences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **seq_id** | **str**| Sequence ID | 
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

