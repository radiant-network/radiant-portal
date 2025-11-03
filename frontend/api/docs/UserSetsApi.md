# UserSetsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserSet**](#getuserset) | **GET** /users/sets/{user_set_id} | Get user set by id|

# **getUserSet**
> UserSet getUserSet()

Get user set

### Example

```typescript
import {
    UserSetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserSetsApi(configuration);

let userSetId: string; //UserSet ID (default to undefined)

const { status, data } = await apiInstance.getUserSet(
    userSetId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userSetId** | [**string**] | UserSet ID | defaults to undefined|


### Return type

**UserSet**

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

