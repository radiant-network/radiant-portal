# openapi_client.UserPreferencesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_user_preferences**](UserPreferencesApi.md#get_user_preferences) | **GET** /users/preferences | Get user preferences
[**post_user_preferences**](UserPreferencesApi.md#post_user_preferences) | **POST** /users/preferences | Create or update user preference


# **get_user_preferences**
> UserPreference get_user_preferences()

Get user preferences

Get user preferences

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.user_preference import UserPreference
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
    api_instance = openapi_client.UserPreferencesApi(api_client)

    try:
        # Get user preferences
        api_response = api_instance.get_user_preferences()
        print("The response of UserPreferencesApi->get_user_preferences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UserPreferencesApi->get_user_preferences: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**UserPreference**](UserPreference.md)

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

# **post_user_preferences**
> UserPreference post_user_preferences(user_preference)

Create or update user preference

Create or update user preference

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.user_preference import UserPreference
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
    api_instance = openapi_client.UserPreferencesApi(api_client)
    user_preference = openapi_client.UserPreference() # UserPreference | User Preference to create or update

    try:
        # Create or update user preference
        api_response = api_instance.post_user_preferences(user_preference)
        print("The response of UserPreferencesApi->post_user_preferences:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling UserPreferencesApi->post_user_preferences: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_preference** | [**UserPreference**](UserPreference.md)| User Preference to create or update | 

### Return type

[**UserPreference**](UserPreference.md)

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

