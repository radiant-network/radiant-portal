# InterpretationsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getInterpretationGermline**](#getinterpretationgermline) | **GET** /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} | Get interpretation germline|
|[**getInterpretationSomatic**](#getinterpretationsomatic) | **GET** /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} | Get interpretation somatic|
|[**getPubmedCitation**](#getpubmedcitation) | **GET** /interpretations/pubmed/{citation_id} | Get pubmed citation by ID|
|[**postInterpretationGermline**](#postinterpretationgermline) | **POST** /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} | Create or Update interpretation germline|
|[**postInterpretationSomatic**](#postinterpretationsomatic) | **POST** /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} | Create or Update interpretation somatic|
|[**searchInterpretationGermline**](#searchinterpretationgermline) | **GET** /interpretations/germline | Search interpretation germline|
|[**searchInterpretationSomatic**](#searchinterpretationsomatic) | **GET** /interpretations/somatic | Search interpretation somatic|

# **getInterpretationGermline**
> InterpretationGermline getInterpretationGermline()

Get interpretation germline

### Example

```typescript
import {
    InterpretationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

let sequencingId: string; //Sequencing ID (default to undefined)
let locusId: string; //Locus ID (default to undefined)
let transcriptId: string; //Transcript ID (default to undefined)

const { status, data } = await apiInstance.getInterpretationGermline(
    sequencingId,
    locusId,
    transcriptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sequencingId** | [**string**] | Sequencing ID | defaults to undefined|
| **locusId** | [**string**] | Locus ID | defaults to undefined|
| **transcriptId** | [**string**] | Transcript ID | defaults to undefined|


### Return type

**InterpretationGermline**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**206** | Partial Content |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInterpretationSomatic**
> InterpretationSomatic getInterpretationSomatic()

Get interpretation somatic

### Example

```typescript
import {
    InterpretationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

let sequencingId: string; //Sequencing ID (default to undefined)
let locusId: string; //Locus ID (default to undefined)
let transcriptId: string; //Transcript ID (default to undefined)

const { status, data } = await apiInstance.getInterpretationSomatic(
    sequencingId,
    locusId,
    transcriptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sequencingId** | [**string**] | Sequencing ID | defaults to undefined|
| **locusId** | [**string**] | Locus ID | defaults to undefined|
| **transcriptId** | [**string**] | Transcript ID | defaults to undefined|


### Return type

**InterpretationSomatic**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**206** | Partial Content |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPubmedCitation**
> PubmedCitation getPubmedCitation()

Get pubmed citation by ID

### Example

```typescript
import {
    InterpretationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

let citationId: string; //Citation ID (default to undefined)

const { status, data } = await apiInstance.getPubmedCitation(
    citationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **citationId** | [**string**] | Citation ID | defaults to undefined|


### Return type

**PubmedCitation**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**206** | Partial Content |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postInterpretationGermline**
> InterpretationGermline postInterpretationGermline(interpretationGermline)

Create or Update interpretation germline

### Example

```typescript
import {
    InterpretationsApi,
    Configuration,
    InterpretationGermline
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

let sequencingId: string; //Sequencing ID (default to undefined)
let locusId: string; //Locus ID (default to undefined)
let transcriptId: string; //Transcript ID (default to undefined)
let interpretationGermline: InterpretationGermline; //Interpretation Body

const { status, data } = await apiInstance.postInterpretationGermline(
    sequencingId,
    locusId,
    transcriptId,
    interpretationGermline
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **interpretationGermline** | **InterpretationGermline**| Interpretation Body | |
| **sequencingId** | [**string**] | Sequencing ID | defaults to undefined|
| **locusId** | [**string**] | Locus ID | defaults to undefined|
| **transcriptId** | [**string**] | Transcript ID | defaults to undefined|


### Return type

**InterpretationGermline**

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

# **postInterpretationSomatic**
> InterpretationSomatic postInterpretationSomatic(interpretationSomatic)

Create or Update interpretation somatic

### Example

```typescript
import {
    InterpretationsApi,
    Configuration,
    InterpretationSomatic
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

let sequencingId: string; //Sequencing ID (default to undefined)
let locusId: string; //Locus ID (default to undefined)
let transcriptId: string; //Transcript ID (default to undefined)
let interpretationSomatic: InterpretationSomatic; //Interpretation Body

const { status, data } = await apiInstance.postInterpretationSomatic(
    sequencingId,
    locusId,
    transcriptId,
    interpretationSomatic
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **interpretationSomatic** | **InterpretationSomatic**| Interpretation Body | |
| **sequencingId** | [**string**] | Sequencing ID | defaults to undefined|
| **locusId** | [**string**] | Locus ID | defaults to undefined|
| **transcriptId** | [**string**] | Transcript ID | defaults to undefined|


### Return type

**InterpretationSomatic**

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

# **searchInterpretationGermline**
> Array<InterpretationGermline> searchInterpretationGermline()

Search interpretation germline

### Example

```typescript
import {
    InterpretationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

const { status, data } = await apiInstance.searchInterpretationGermline();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InterpretationGermline>**

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

# **searchInterpretationSomatic**
> Array<InterpretationSomatic> searchInterpretationSomatic()

Search interpretation somatic

### Example

```typescript
import {
    InterpretationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InterpretationsApi(configuration);

const { status, data } = await apiInstance.searchInterpretationSomatic();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InterpretationSomatic>**

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

