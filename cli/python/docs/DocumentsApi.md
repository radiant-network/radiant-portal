# radiant_python.DocumentsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**autocomplete_documents**](DocumentsApi.md#autocomplete_documents) | **GET** /documents/autocomplete | Get AutocompleteResult list of matching prefix
[**documents_filters**](DocumentsApi.md#documents_filters) | **POST** /documents/filters | Get DocumentFilters documents filters
[**search_documents**](DocumentsApi.md#search_documents) | **POST** /documents/search | Search documents


# **autocomplete_documents**
> List[AutocompleteResult] autocomplete_documents(prefix, limit=limit)

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
    api_instance = radiant_python.DocumentsApi(api_client)
    prefix = 'prefix_example' # str | Prefix
    limit = 'limit_example' # str | Limit (optional)

    try:
        # Get AutocompleteResult list of matching prefix
        api_response = api_instance.autocomplete_documents(prefix, limit=limit)
        print("The response of DocumentsApi->autocomplete_documents:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->autocomplete_documents: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **documents_filters**
> DocumentFilters documents_filters(filters_body_with_criteria)

Get DocumentFilters documents filters

Retrieve DocumentFilters documents filters

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.document_filters import DocumentFilters
from radiant_python.models.filters_body_with_criteria import FiltersBodyWithCriteria
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
    api_instance = radiant_python.DocumentsApi(api_client)
    filters_body_with_criteria = radiant_python.FiltersBodyWithCriteria() # FiltersBodyWithCriteria | Filters Body

    try:
        # Get DocumentFilters documents filters
        api_response = api_instance.documents_filters(filters_body_with_criteria)
        print("The response of DocumentsApi->documents_filters:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->documents_filters: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filters_body_with_criteria** | [**FiltersBodyWithCriteria**](FiltersBodyWithCriteria.md)| Filters Body | 

### Return type

[**DocumentFilters**](DocumentFilters.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **search_documents**
> DocumentsSearchResponse search_documents(list_body_with_criteria)

Search documents

Search documents

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
    api_instance = radiant_python.DocumentsApi(api_client)
    list_body_with_criteria = radiant_python.ListBodyWithCriteria() # ListBodyWithCriteria | List Body

    try:
        # Search documents
        api_response = api_instance.search_documents(list_body_with_criteria)
        print("The response of DocumentsApi->search_documents:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->search_documents: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
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
**400** | Bad Request |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

