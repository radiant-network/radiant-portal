# SavedFiltersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteSavedFilter**](#deletesavedfilter) | **DELETE** /users/saved_filters/{saved_filter_id} | Delete a saved filter|
|[**getSavedFilterById**](#getsavedfilterbyid) | **GET** /users/saved_filters/{saved_filter_id} | Get saved filter by id|
|[**getSavedFilters**](#getsavedfilters) | **GET** /users/saved_filters | Get user saved filters|
|[**postSavedFilter**](#postsavedfilter) | **POST** /users/saved_filters | Create a new saved filter|
|[**putSavedFilter**](#putsavedfilter) | **PUT** /users/saved_filters/{saved_filter_id} | Update a saved filter|

# **deleteSavedFilter**
> deleteSavedFilter()

Delete a saved filter

### Example

```typescript
import {
    SavedFiltersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SavedFiltersApi(configuration);

let savedFilterId: string; //Saved Filter ID (default to undefined)

const { status, data } = await apiInstance.deleteSavedFilter(
    savedFilterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **savedFilterId** | [**string**] | Saved Filter ID | defaults to undefined|


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
|**204** | No Content |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSavedFilterById**
> SavedFilter getSavedFilterById()

Get saved filter by id

### Example

```typescript
import {
    SavedFiltersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SavedFiltersApi(configuration);

let savedFilterId: string; //Saved Filter ID (default to undefined)

const { status, data } = await apiInstance.getSavedFilterById(
    savedFilterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **savedFilterId** | [**string**] | Saved Filter ID | defaults to undefined|


### Return type

**SavedFilter**

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

# **getSavedFilters**
> Array<SavedFilter> getSavedFilters()

Get user saved filters

### Example

```typescript
import {
    SavedFiltersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SavedFiltersApi(configuration);

let type: string; //Saved Filter Type (optional) (default to undefined)

const { status, data } = await apiInstance.getSavedFilters(
    type
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**string**] | Saved Filter Type | (optional) defaults to undefined|


### Return type

**Array<SavedFilter>**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postSavedFilter**
> SavedFilter postSavedFilter(savedFilterCreationInput)

Create a new saved filter

### Example

```typescript
import {
    SavedFiltersApi,
    Configuration,
    SavedFilterCreationInput
} from './api';

const configuration = new Configuration();
const apiInstance = new SavedFiltersApi(configuration);

let savedFilterCreationInput: SavedFilterCreationInput; //New Saved Filter to create

const { status, data } = await apiInstance.postSavedFilter(
    savedFilterCreationInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **savedFilterCreationInput** | **SavedFilterCreationInput**| New Saved Filter to create | |


### Return type

**SavedFilter**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **putSavedFilter**
> SavedFilter putSavedFilter(savedFilterUpdateInput)

Update a saved filter

### Example

```typescript
import {
    SavedFiltersApi,
    Configuration,
    SavedFilterUpdateInput
} from './api';

const configuration = new Configuration();
const apiInstance = new SavedFiltersApi(configuration);

let savedFilterId: string; //Saved Filter ID (default to undefined)
let savedFilterUpdateInput: SavedFilterUpdateInput; //Saved Filter to update

const { status, data } = await apiInstance.putSavedFilter(
    savedFilterId,
    savedFilterUpdateInput
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **savedFilterUpdateInput** | **SavedFilterUpdateInput**| Saved Filter to update | |
| **savedFilterId** | [**string**] | Saved Filter ID | defaults to undefined|


### Return type

**SavedFilter**

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

