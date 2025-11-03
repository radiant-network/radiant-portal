# DocumentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**autocompleteDocuments**](#autocompletedocuments) | **GET** /documents/autocomplete | Get AutocompleteResult list of matching prefix|
|[**documentsFilters**](#documentsfilters) | **POST** /documents/filters | Get DocumentFilters documents filters|
|[**searchDocuments**](#searchdocuments) | **POST** /documents/search | Search documents|

# **autocompleteDocuments**
> Array<AutocompleteResult> autocompleteDocuments()

Retrieve AutocompleteResult list of ids matching prefix

### Example

```typescript
import {
    DocumentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentsApi(configuration);

let prefix: string; //Prefix (default to undefined)
let limit: string; //Limit (optional) (default to undefined)

const { status, data } = await apiInstance.autocompleteDocuments(
    prefix,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **prefix** | [**string**] | Prefix | defaults to undefined|
| **limit** | [**string**] | Limit | (optional) defaults to undefined|


### Return type

**Array<AutocompleteResult>**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **documentsFilters**
> DocumentFilters documentsFilters(filtersBodyWithCriteria)

Retrieve DocumentFilters documents filters

### Example

```typescript
import {
    DocumentsApi,
    Configuration,
    FiltersBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentsApi(configuration);

let filtersBodyWithCriteria: FiltersBodyWithCriteria; //Filters Body

const { status, data } = await apiInstance.documentsFilters(
    filtersBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filtersBodyWithCriteria** | **FiltersBodyWithCriteria**| Filters Body | |


### Return type

**DocumentFilters**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchDocuments**
> DocumentsSearchResponse searchDocuments(listBodyWithCriteria)

Search documents

### Example

```typescript
import {
    DocumentsApi,
    Configuration,
    ListBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new DocumentsApi(configuration);

let listBodyWithCriteria: ListBodyWithCriteria; //List Body

const { status, data } = await apiInstance.searchDocuments(
    listBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithCriteria** | **ListBodyWithCriteria**| List Body | |


### Return type

**DocumentsSearchResponse**

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
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

