# radiant_python.GenesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**gene_auto_complete**](GenesApi.md#gene_auto_complete) | **GET** /genes/autocomplete | Get AutoCompleteGene list of matching input string with highlighted
[**gene_search**](GenesApi.md#gene_search) | **POST** /genes/search | Post search GeneResult list of matching input strings


# **gene_auto_complete**
> List[AutoCompleteGene] gene_auto_complete(prefix, limit=limit)

Get AutoCompleteGene list of matching input string with highlighted

Retrieve AutoCompleteGene list of genes matching input string with highlighted

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.auto_complete_gene import AutoCompleteGene
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
    api_instance = radiant_python.GenesApi(api_client)
    prefix = 'prefix_example' # str | Prefix
    limit = 'limit_example' # str | Limit (optional)

    try:
        # Get AutoCompleteGene list of matching input string with highlighted
        api_response = api_instance.gene_auto_complete(prefix, limit=limit)
        print("The response of GenesApi->gene_auto_complete:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GenesApi->gene_auto_complete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **prefix** | **str**| Prefix | 
 **limit** | **str**| Limit | [optional] 

### Return type

[**List[AutoCompleteGene]**](AutoCompleteGene.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **gene_search**
> List[GeneResult] gene_search(gene_search_body)

Post search GeneResult list of matching input strings

Retrieve GeneResult list of genes matching input strings

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.gene_result import GeneResult
from radiant_python.models.gene_search_body import GeneSearchBody
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
    api_instance = radiant_python.GenesApi(api_client)
    gene_search_body = radiant_python.GeneSearchBody() # GeneSearchBody | Search Body

    try:
        # Post search GeneResult list of matching input strings
        api_response = api_instance.gene_search(gene_search_body)
        print("The response of GenesApi->gene_search:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GenesApi->gene_search: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gene_search_body** | [**GeneSearchBody**](GeneSearchBody.md)| Search Body | 

### Return type

[**List[GeneResult]**](GeneResult.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

