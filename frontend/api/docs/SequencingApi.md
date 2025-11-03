# SequencingApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getSequencing**](#getsequencing) | **GET** /sequencing/{seq_id} | Get a Sequencing|

# **getSequencing**
> Sequencing getSequencing()

Retrieve Sequencing data for a given sequence ID

### Example

```typescript
import {
    SequencingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SequencingApi(configuration);

let seqId: string; //Sequence ID (default to undefined)

const { status, data } = await apiInstance.getSequencing(
    seqId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Sequencing**

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

