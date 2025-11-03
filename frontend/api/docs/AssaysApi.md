# AssaysApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAssayBySeqId**](#getassaybyseqid) | **GET** /assays/{seq_id} | Get Assay by seq_id|

# **getAssayBySeqId**
> Assay getAssayBySeqId()

Get Assay by seq_id

### Example

```typescript
import {
    AssaysApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssaysApi(configuration);

let seqId: string; //Seq ID (default to undefined)

const { status, data } = await apiInstance.getAssayBySeqId(
    seqId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **seqId** | [**string**] | Seq ID | defaults to undefined|


### Return type

**Assay**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

