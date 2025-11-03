# CasesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**autocompleteCases**](#autocompletecases) | **GET** /cases/autocomplete | Get AutocompleteResult list of matching prefix|
|[**caseEntity**](#caseentity) | **GET** /cases/{case_id} | Get CaseEntity case entity|
|[**caseEntityDocumentsFilters**](#caseentitydocumentsfilters) | **POST** /cases/{case_id}/documents/filters | Get DocumentFilters documents filters for a specific case|
|[**caseEntityDocumentsSearch**](#caseentitydocumentssearch) | **POST** /cases/{case_id}/documents/search | Search DocumentResult list for a case entity|
|[**casesFilters**](#casesfilters) | **POST** /cases/filters | Get CaseFilters cases filters|
|[**searchCases**](#searchcases) | **POST** /cases/search | Search cases|

# **autocompleteCases**
> Array<AutocompleteResult> autocompleteCases()

Retrieve AutocompleteResult list of ids matching prefix

### Example

```typescript
import {
    CasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CasesApi(configuration);

let prefix: string; //Prefix (default to undefined)
let limit: string; //Limit (optional) (default to undefined)

const { status, data } = await apiInstance.autocompleteCases(
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

# **caseEntity**
> CaseEntity caseEntity()

Retrieve CaseEntity by its ID

### Example

```typescript
import {
    CasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CasesApi(configuration);

let caseId: number; //Case ID (default to undefined)

const { status, data } = await apiInstance.caseEntity(
    caseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **caseId** | [**number**] | Case ID | defaults to undefined|


### Return type

**CaseEntity**

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

# **caseEntityDocumentsFilters**
> DocumentFilters caseEntityDocumentsFilters(filtersBodyWithCriteria)

Retrieve DocumentFilters documents filters for a specific case

### Example

```typescript
import {
    CasesApi,
    Configuration,
    FiltersBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new CasesApi(configuration);

let caseId: string; //Case ID (default to undefined)
let filtersBodyWithCriteria: FiltersBodyWithCriteria; //Filters Body

const { status, data } = await apiInstance.caseEntityDocumentsFilters(
    caseId,
    filtersBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filtersBodyWithCriteria** | **FiltersBodyWithCriteria**| Filters Body | |
| **caseId** | [**string**] | Case ID | defaults to undefined|


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

# **caseEntityDocumentsSearch**
> DocumentsSearchResponse caseEntityDocumentsSearch(listBodyWithCriteria)

Search for DocumentResult list for a case entity

### Example

```typescript
import {
    CasesApi,
    Configuration,
    ListBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new CasesApi(configuration);

let caseId: string; //Case ID (default to undefined)
let listBodyWithCriteria: ListBodyWithCriteria; //List Body

const { status, data } = await apiInstance.caseEntityDocumentsSearch(
    caseId,
    listBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithCriteria** | **ListBodyWithCriteria**| List Body | |
| **caseId** | [**string**] | Case ID | defaults to undefined|


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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **casesFilters**
> CaseFilters casesFilters(filtersBodyWithCriteria)

Retrieve CaseFilters cases filters

### Example

```typescript
import {
    CasesApi,
    Configuration,
    FiltersBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new CasesApi(configuration);

let filtersBodyWithCriteria: FiltersBodyWithCriteria; //Filters Body

const { status, data } = await apiInstance.casesFilters(
    filtersBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filtersBodyWithCriteria** | **FiltersBodyWithCriteria**| Filters Body | |


### Return type

**CaseFilters**

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

# **searchCases**
> CasesSearchResponse searchCases(listBodyWithCriteria)

Search cases

### Example

```typescript
import {
    CasesApi,
    Configuration,
    ListBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new CasesApi(configuration);

let listBodyWithCriteria: ListBodyWithCriteria; //List Body

const { status, data } = await apiInstance.searchCases(
    listBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithCriteria** | **ListBodyWithCriteria**| List Body | |


### Return type

**CasesSearchResponse**

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

