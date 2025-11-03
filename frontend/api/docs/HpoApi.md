# HpoApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**hpoTermAutoComplete**](#hpotermautocomplete) | **GET** /hpo/autocomplete | Get AutoCompleteTerm list of matching input string with highlighted|

# **hpoTermAutoComplete**
> Array<AutoCompleteTerm> hpoTermAutoComplete()

Retrieve AutoCompleteTerm list of HPO terms matching input string with highlighted

### Example

```typescript
import {
    HpoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HpoApi(configuration);

let prefix: string; //Prefix (default to undefined)
let limit: string; //Limit (optional) (default to undefined)

const { status, data } = await apiInstance.hpoTermAutoComplete(
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

