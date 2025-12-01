# radiant_python.SavedFiltersApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_saved_filter**](SavedFiltersApi.md#delete_saved_filter) | **DELETE** /users/saved_filters/{saved_filter_id} | Delete a saved filter
[**get_saved_filter_by_id**](SavedFiltersApi.md#get_saved_filter_by_id) | **GET** /users/saved_filters/{saved_filter_id} | Get saved filter by id
[**get_saved_filters**](SavedFiltersApi.md#get_saved_filters) | **GET** /users/saved_filters | Get user saved filters
[**post_saved_filter**](SavedFiltersApi.md#post_saved_filter) | **POST** /users/saved_filters | Create a new saved filter
[**put_saved_filter**](SavedFiltersApi.md#put_saved_filter) | **PUT** /users/saved_filters/{saved_filter_id} | Update a saved filter


# **delete_saved_filter**
> delete_saved_filter(saved_filter_id)

Delete a saved filter

Delete a saved filter

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
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
    api_instance = radiant_python.SavedFiltersApi(api_client)
    saved_filter_id = 'saved_filter_id_example' # str | Saved Filter ID

    try:
        # Delete a saved filter
        api_instance.delete_saved_filter(saved_filter_id)
    except Exception as e:
        print("Exception when calling SavedFiltersApi->delete_saved_filter: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **saved_filter_id** | **str**| Saved Filter ID | 

### Return type

void (empty response body)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | No Content |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_saved_filter_by_id**
> SavedFilter get_saved_filter_by_id(saved_filter_id)

Get saved filter by id

Get saved filter by id

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.saved_filter import SavedFilter
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
    api_instance = radiant_python.SavedFiltersApi(api_client)
    saved_filter_id = 'saved_filter_id_example' # str | Saved Filter ID

    try:
        # Get saved filter by id
        api_response = api_instance.get_saved_filter_by_id(saved_filter_id)
        print("The response of SavedFiltersApi->get_saved_filter_by_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SavedFiltersApi->get_saved_filter_by_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **saved_filter_id** | **str**| Saved Filter ID | 

### Return type

[**SavedFilter**](SavedFilter.md)

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

# **get_saved_filters**
> List[SavedFilter] get_saved_filters(type=type)

Get user saved filters

Get user saved filters

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.saved_filter import SavedFilter
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
    api_instance = radiant_python.SavedFiltersApi(api_client)
    type = 'type_example' # str | Saved Filter Type (optional)

    try:
        # Get user saved filters
        api_response = api_instance.get_saved_filters(type=type)
        print("The response of SavedFiltersApi->get_saved_filters:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SavedFiltersApi->get_saved_filters: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **str**| Saved Filter Type | [optional] 

### Return type

[**List[SavedFilter]**](SavedFilter.md)

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_saved_filter**
> SavedFilter post_saved_filter(saved_filter_creation_input)

Create a new saved filter

Create a new saved filter

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.saved_filter import SavedFilter
from radiant_python.models.saved_filter_creation_input import SavedFilterCreationInput
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
    api_instance = radiant_python.SavedFiltersApi(api_client)
    saved_filter_creation_input = radiant_python.SavedFilterCreationInput() # SavedFilterCreationInput | New Saved Filter to create

    try:
        # Create a new saved filter
        api_response = api_instance.post_saved_filter(saved_filter_creation_input)
        print("The response of SavedFiltersApi->post_saved_filter:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SavedFiltersApi->post_saved_filter: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **saved_filter_creation_input** | [**SavedFilterCreationInput**](SavedFilterCreationInput.md)| New Saved Filter to create | 

### Return type

[**SavedFilter**](SavedFilter.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Created |  -  |
**400** | Bad Request |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_saved_filter**
> SavedFilter put_saved_filter(saved_filter_id, saved_filter_update_input)

Update a saved filter

Update a saved filter

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.saved_filter import SavedFilter
from radiant_python.models.saved_filter_update_input import SavedFilterUpdateInput
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
    api_instance = radiant_python.SavedFiltersApi(api_client)
    saved_filter_id = 'saved_filter_id_example' # str | Saved Filter ID
    saved_filter_update_input = radiant_python.SavedFilterUpdateInput() # SavedFilterUpdateInput | Saved Filter to update

    try:
        # Update a saved filter
        api_response = api_instance.put_saved_filter(saved_filter_id, saved_filter_update_input)
        print("The response of SavedFiltersApi->put_saved_filter:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SavedFiltersApi->put_saved_filter: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **saved_filter_id** | **str**| Saved Filter ID | 
 **saved_filter_update_input** | [**SavedFilterUpdateInput**](SavedFilterUpdateInput.md)| Saved Filter to update | 

### Return type

[**SavedFilter**](SavedFilter.md)

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

