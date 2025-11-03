# MondoApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mondoTermAutoComplete**](#mondotermautocomplete) | **GET** /mondo/autocomplete | Get AutoCompleteTerm list of matching input string with highlighted|

# **mondoTermAutoComplete**
> Array<AutoCompleteTerm> mondoTermAutoComplete()

Retrieve AutoCompleteTerm list of mondo terms matching input string with highlighted

### Example

```typescript
import {
    MondoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MondoApi(configuration);

let prefix: string; //Prefix (default to undefined)
let limit: string; //Limit (optional) (default to undefined)

const { status, data } = await apiInstance.mondoTermAutoComplete(
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

**Array<AutoCompleteTerm>**

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

