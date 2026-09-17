# radiant_python.BeaconApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**beacon_configuration**](BeaconApi.md#beacon_configuration) | **GET** /{tenant}/beacon/configuration | Beacon: configuration
[**beacon_dataset_by_id**](BeaconApi.md#beacon_dataset_by_id) | **GET** /{tenant}/beacon/datasets/{id} | Beacon: get a dataset by id
[**beacon_datasets**](BeaconApi.md#beacon_datasets) | **GET** /{tenant}/beacon/datasets | Beacon: list datasets
[**beacon_datasets_post**](BeaconApi.md#beacon_datasets_post) | **POST** /{tenant}/beacon/datasets | Beacon: list datasets (POST)
[**beacon_entry_types**](BeaconApi.md#beacon_entry_types) | **GET** /{tenant}/beacon/entry_types | Beacon: entry types
[**beacon_filtering_terms**](BeaconApi.md#beacon_filtering_terms) | **GET** /{tenant}/beacon/filtering_terms | Beacon: filtering terms
[**beacon_genomic_variation_by_id**](BeaconApi.md#beacon_genomic_variation_by_id) | **GET** /{tenant}/beacon/g_variants/{id} | Beacon: get a genomic variant by id
[**beacon_genomic_variations**](BeaconApi.md#beacon_genomic_variations) | **GET** /{tenant}/beacon/g_variants | Beacon: query genomic variants
[**beacon_genomic_variations_post**](BeaconApi.md#beacon_genomic_variations_post) | **POST** /{tenant}/beacon/g_variants | Beacon: query genomic variants (POST)
[**beacon_info**](BeaconApi.md#beacon_info) | **GET** /{tenant}/beacon/info | Beacon: describe this beacon
[**beacon_map**](BeaconApi.md#beacon_map) | **GET** /{tenant}/beacon/map | Beacon: endpoint map
[**beacon_service_info**](BeaconApi.md#beacon_service_info) | **GET** /{tenant}/beacon/service-info | Beacon: GA4GH service-info


# **beacon_configuration**
> BeaconConfigurationResponse beacon_configuration(tenant)

Beacon: configuration

Maturity, security attributes and the entry types this beacon implements. Public, no token required.

### Example


```python
import radiant_python
from radiant_python.models.beacon_configuration_response import BeaconConfigurationResponse
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Beacon: configuration
        api_response = api_instance.beacon_configuration(tenant)
        print("The response of BeaconApi->beacon_configuration:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_configuration: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**BeaconConfigurationResponse**](BeaconConfigurationResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_dataset_by_id**
> BeaconResultsetsResponse beacon_dataset_by_id(tenant, id)

Beacon: get a dataset by id

The Beacon dataset document for one project code.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse
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
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    id = 'id_example' # str | Dataset id (project code)

    try:
        # Beacon: get a dataset by id
        api_response = api_instance.beacon_dataset_by_id(tenant, id)
        print("The response of BeaconApi->beacon_dataset_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_dataset_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **id** | **str**| Dataset id (project code) | 

### Return type

[**BeaconResultsetsResponse**](BeaconResultsetsResponse.md)

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

# **beacon_datasets**
> BeaconResultsetsResponse beacon_datasets(tenant, requested_granularity=requested_granularity, skip=skip, limit=limit)

Beacon: list datasets

The datasets (Radiant projects) of the tenant, as Beacon dataset documents. Records are returned to every tenant member: dataset names are the catalog a client needs before querying. Accepts requestedGranularity, skip and limit; the same request can be sent as a POST.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse
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
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    requested_granularity = 'requested_granularity_example' # str | boolean, count or record (default record) (optional)
    skip = 56 # int | Records to skip (optional)
    limit = 56 # int | Page size, 1-100 (optional)

    try:
        # Beacon: list datasets
        api_response = api_instance.beacon_datasets(tenant, requested_granularity=requested_granularity, skip=skip, limit=limit)
        print("The response of BeaconApi->beacon_datasets:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_datasets: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **requested_granularity** | **str**| boolean, count or record (default record) | [optional] 
 **skip** | **int**| Records to skip | [optional] 
 **limit** | **int**| Page size, 1-100 | [optional] 

### Return type

[**BeaconResultsetsResponse**](BeaconResultsetsResponse.md)

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

# **beacon_datasets_post**
> BeaconResultsetsResponse beacon_datasets_post(tenant, body=body)

Beacon: list datasets (POST)

The tenant's datasets, requested with a Beacon request body (query.requestedGranularity, query.pagination). Same semantics as the GET form.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse
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
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    body = None # object | Beacon request body (optional)

    try:
        # Beacon: list datasets (POST)
        api_response = api_instance.beacon_datasets_post(tenant, body=body)
        print("The response of BeaconApi->beacon_datasets_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_datasets_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **body** | **object**| Beacon request body | [optional] 

### Return type

[**BeaconResultsetsResponse**](BeaconResultsetsResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json, text/plain
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

# **beacon_entry_types**
> BeaconEntryTypesResponse beacon_entry_types(tenant)

Beacon: entry types

The entry types this beacon implements (genomicVariation, dataset). Public, no token required.

### Example


```python
import radiant_python
from radiant_python.models.beacon_entry_types_response import BeaconEntryTypesResponse
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Beacon: entry types
        api_response = api_instance.beacon_entry_types(tenant)
        print("The response of BeaconApi->beacon_entry_types:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_entry_types: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**BeaconEntryTypesResponse**](BeaconEntryTypesResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_filtering_terms**
> BeaconFilteringTermsResponse beacon_filtering_terms(tenant)

Beacon: filtering terms

Ontology filters this beacon accepts. Empty in this release: queries with filters are rejected. Public, no token required.

### Example


```python
import radiant_python
from radiant_python.models.beacon_filtering_terms_response import BeaconFilteringTermsResponse
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Beacon: filtering terms
        api_response = api_instance.beacon_filtering_terms(tenant)
        print("The response of BeaconApi->beacon_filtering_terms:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_filtering_terms: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**BeaconFilteringTermsResponse**](BeaconFilteringTermsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_genomic_variation_by_id**
> BeaconResultsetsResponse beacon_genomic_variation_by_id(tenant, id)

Beacon: get a genomic variant by id

The Beacon genomicVariation document for one variantInternalId (Radiant locus id). Requires can_search_case; other callers receive a count-level answer.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse
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
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    id = 56 # int | variantInternalId (locus id)

    try:
        # Beacon: get a genomic variant by id
        api_response = api_instance.beacon_genomic_variation_by_id(tenant, id)
        print("The response of BeaconApi->beacon_genomic_variation_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_genomic_variation_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **id** | **int**| variantInternalId (locus id) | 

### Return type

[**BeaconResultsetsResponse**](BeaconResultsetsResponse.md)

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

# **beacon_genomic_variations**
> BeaconResultsetsResponse beacon_genomic_variations(tenant, reference_name=reference_name, start=start, end=end, reference_bases=reference_bases, alternate_bases=alternate_bases, variant_type=variant_type, gene_id=gene_id, aminoacid_change=aminoacid_change, variant_min_length=variant_min_length, variant_max_length=variant_max_length, assembly_id=assembly_id, requested_granularity=requested_granularity, include_resultset_responses=include_resultset_responses, skip=skip, limit=limit)

Beacon: query genomic variants

GA4GH Beacon v2 genomicVariation query over the tenant's variant catalog. Supports sequence (referenceName, start, referenceBases, alternateBases), range (referenceName, start, end), gene (geneId) and aminoacidChange queries. Coordinates are 0-based interbase, GRCh38. Granularity is clamped to the caller's entitlement: can_search_case → record, can_view_kb → count. The same query can be sent as a POST with a Beacon request body.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse
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
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    reference_name = 'reference_name_example' # str | Chromosome: 17, chr17 or NC_000017.11 (optional)
    start = 'start_example' # str | 0-based start (one value; two values = bracket query, not supported) (optional)
    end = 'end_example' # str | 0-based exclusive end (range query) (optional)
    reference_bases = 'reference_bases_example' # str | Reference allele (sequence query) (optional)
    alternate_bases = 'alternate_bases_example' # str | Alternate allele (optional)
    variant_type = 'variant_type_example' # str | SNP, INS, DEL, INDEL or MNP (optional)
    gene_id = 'gene_id_example' # str | HGNC gene symbol (optional)
    aminoacid_change = 'aminoacid_change_example' # str | One-letter (V600E) or HGVS (p.Val600Glu) amino acid change (optional)
    variant_min_length = 56 # int | Minimum allele length (optional)
    variant_max_length = 56 # int | Maximum allele length (optional)
    assembly_id = 'assembly_id_example' # str | GRCh38 (default and only supported assembly) (optional)
    requested_granularity = 'requested_granularity_example' # str | boolean (default), count or record (optional)
    include_resultset_responses = 'include_resultset_responses_example' # str | HIT (default), ALL, NONE or MISS (optional)
    skip = 56 # int | Records to skip (record granularity) (optional)
    limit = 56 # int | Page size, 1-100 (record granularity) (optional)

    try:
        # Beacon: query genomic variants
        api_response = api_instance.beacon_genomic_variations(tenant, reference_name=reference_name, start=start, end=end, reference_bases=reference_bases, alternate_bases=alternate_bases, variant_type=variant_type, gene_id=gene_id, aminoacid_change=aminoacid_change, variant_min_length=variant_min_length, variant_max_length=variant_max_length, assembly_id=assembly_id, requested_granularity=requested_granularity, include_resultset_responses=include_resultset_responses, skip=skip, limit=limit)
        print("The response of BeaconApi->beacon_genomic_variations:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_genomic_variations: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **reference_name** | **str**| Chromosome: 17, chr17 or NC_000017.11 | [optional] 
 **start** | **str**| 0-based start (one value; two values &#x3D; bracket query, not supported) | [optional] 
 **end** | **str**| 0-based exclusive end (range query) | [optional] 
 **reference_bases** | **str**| Reference allele (sequence query) | [optional] 
 **alternate_bases** | **str**| Alternate allele | [optional] 
 **variant_type** | **str**| SNP, INS, DEL, INDEL or MNP | [optional] 
 **gene_id** | **str**| HGNC gene symbol | [optional] 
 **aminoacid_change** | **str**| One-letter (V600E) or HGVS (p.Val600Glu) amino acid change | [optional] 
 **variant_min_length** | **int**| Minimum allele length | [optional] 
 **variant_max_length** | **int**| Maximum allele length | [optional] 
 **assembly_id** | **str**| GRCh38 (default and only supported assembly) | [optional] 
 **requested_granularity** | **str**| boolean (default), count or record | [optional] 
 **include_resultset_responses** | **str**| HIT (default), ALL, NONE or MISS | [optional] 
 **skip** | **int**| Records to skip (record granularity) | [optional] 
 **limit** | **int**| Page size, 1-100 (record granularity) | [optional] 

### Return type

[**BeaconResultsetsResponse**](BeaconResultsetsResponse.md)

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
**501** | Not Implemented |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_genomic_variations_post**
> BeaconResultsetsResponse beacon_genomic_variations_post(tenant, body)

Beacon: query genomic variants (POST)

GA4GH Beacon v2 genomicVariation query with a Beacon request body: {"meta":{"apiVersion":"v2.0.0"},"query":{"requestParameters":{...},"requestedGranularity":"count","pagination":{"skip":0,"limit":10}}}. Same parameters and semantics as the GET form.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.beacon_resultsets_response import BeaconResultsetsResponse
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
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    body = None # object | Beacon request body (meta, query.requestParameters, query.requestedGranularity, query.pagination)

    try:
        # Beacon: query genomic variants (POST)
        api_response = api_instance.beacon_genomic_variations_post(tenant, body)
        print("The response of BeaconApi->beacon_genomic_variations_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_genomic_variations_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **body** | **object**| Beacon request body (meta, query.requestParameters, query.requestedGranularity, query.pagination) | 

### Return type

[**BeaconResultsetsResponse**](BeaconResultsetsResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json, text/plain
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |
**501** | Not Implemented |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_info**
> BeaconInfoResponse beacon_info(tenant, requested_schema=requested_schema)

Beacon: describe this beacon

GA4GH Beacon v2 informational endpoint. Public, no token required. With requestedSchema=ga4gh-service-info-v1.0 the response is the GA4GH service-info document instead.

### Example


```python
import radiant_python
from radiant_python.models.beacon_info_response import BeaconInfoResponse
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    requested_schema = 'requested_schema_example' # str | ga4gh-service-info-v1.0 to get the service-info format (optional)

    try:
        # Beacon: describe this beacon
        api_response = api_instance.beacon_info(tenant, requested_schema=requested_schema)
        print("The response of BeaconApi->beacon_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_info: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **requested_schema** | **str**| ga4gh-service-info-v1.0 to get the service-info format | [optional] 

### Return type

[**BeaconInfoResponse**](BeaconInfoResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_map**
> BeaconMapResponse beacon_map(tenant)

Beacon: endpoint map

The query endpoints this beacon exposes, as absolute URLs. Public, no token required.

### Example


```python
import radiant_python
from radiant_python.models.beacon_map_response import BeaconMapResponse
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Beacon: endpoint map
        api_response = api_instance.beacon_map(tenant)
        print("The response of BeaconApi->beacon_map:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_map: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**BeaconMapResponse**](BeaconMapResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **beacon_service_info**
> BeaconServiceInfo beacon_service_info(tenant)

Beacon: GA4GH service-info

GA4GH service-info (v1.0) for this beacon. Public, no token required.

### Example


```python
import radiant_python
from radiant_python.models.beacon_service_info import BeaconServiceInfo
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.BeaconApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # Beacon: GA4GH service-info
        api_response = api_instance.beacon_service_info(tenant)
        print("The response of BeaconApi->beacon_service_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BeaconApi->beacon_service_info: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**BeaconServiceInfo**](BeaconServiceInfo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

