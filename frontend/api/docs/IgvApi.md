# IgvApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getIGV**](#getigv) | **GET** /igv/{seq_id} | Get IGV|

# **getIGV**
> IGVTracks getIGV()

Get IGV tracks for a sequencing experiment

### Example

```typescript
import {
    IgvApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IgvApi(configuration);

let seqId: string; //Sequencing ID (default to undefined)

const { status, data } = await apiInstance.getIGV(
    seqId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **seqId** | [**string**] | Sequencing ID | defaults to undefined|


### Return type

**IGVTracks**

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

