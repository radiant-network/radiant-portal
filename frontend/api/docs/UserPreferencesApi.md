# UserPreferencesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserPreferences**](#getuserpreferences) | **GET** /users/preferences | Get user preferences|
|[**postUserPreferences**](#postuserpreferences) | **POST** /users/preferences | Create or update user preference|

# **getUserPreferences**
> UserPreference getUserPreferences()

Get user preferences

### Example

```typescript
import {
    UserPreferencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserPreferencesApi(configuration);

const { status, data } = await apiInstance.getUserPreferences();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserPreference**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postUserPreferences**
> UserPreference postUserPreferences(userPreference)

Create or update user preference

### Example

```typescript
import {
    UserPreferencesApi,
    Configuration,
    UserPreference
} from './api';

const configuration = new Configuration();
const apiInstance = new UserPreferencesApi(configuration);

let userPreference: UserPreference; //User Preference to create or update

const { status, data } = await apiInstance.postUserPreferences(
    userPreference
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userPreference** | **UserPreference**| User Preference to create or update | |


### Return type

**UserPreference**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

