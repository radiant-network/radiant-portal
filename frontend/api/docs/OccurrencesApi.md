# OccurrencesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aggregateGermlineCNVOccurrences**](#aggregategermlinecnvoccurrences) | **POST** /occurrences/germline/cnv/{seq_id}/aggregate | Aggregate germline CNV occurrences|
|[**aggregateGermlineSNVOccurrences**](#aggregategermlinesnvoccurrences) | **POST** /occurrences/germline/snv/{seq_id}/aggregate | Aggregate germline SNV occurrences|
|[**countGermlineCNVOccurrences**](#countgermlinecnvoccurrences) | **POST** /occurrences/germline/cnv/{seq_id}/count | Count germline CNV occurrences|
|[**countGermlineSNVOccurrences**](#countgermlinesnvoccurrences) | **POST** /occurrences/germline/snv/{seq_id}/count | Count germline SNV occurrences|
|[**getExpandedGermlineSNVOccurrence**](#getexpandedgermlinesnvoccurrence) | **GET** /occurrences/germline/snv/{seq_id}/{locus_id}/expanded | Get a germline ExpandedGermlineSNVOccurrence|
|[**getGermlineSNVDictionary**](#getgermlinesnvdictionary) | **GET** /occurrences/germline/snv/dictionary | Get germline SNV facets dictionary|
|[**listGermlineCNVGenesOverlap**](#listgermlinecnvgenesoverlap) | **GET** /occurrences/germline/cnv/{seq_id}/{cnv_id}/genes_overlap | List genes overlapping a CNV with a given ID|
|[**listGermlineCNVOccurrences**](#listgermlinecnvoccurrences) | **POST** /occurrences/germline/cnv/{seq_id}/list | List germline CNV occurrences|
|[**listGermlineSNVOccurrences**](#listgermlinesnvoccurrences) | **POST** /occurrences/germline/snv/{seq_id}/list | List germline SNV occurrences|
|[**statisticsGermlineCNVOccurrences**](#statisticsgermlinecnvoccurrences) | **POST** /occurrences/germline/cnv/{seq_id}/statistics | Statistics of germline CNV occurrences|
|[**statisticsGermlineSNVOccurrences**](#statisticsgermlinesnvoccurrences) | **POST** /occurrences/germline/snv/{seq_id}/statistics | Statistics of germline SNV occurrences|

# **aggregateGermlineCNVOccurrences**
> Array<Aggregation> aggregateGermlineCNVOccurrences(aggregationBodyWithSqon)

Aggregate germline CNV occurrences for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    AggregationBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let aggregationBodyWithSqon: AggregationBodyWithSqon; //Aggregation Body

const { status, data } = await apiInstance.aggregateGermlineCNVOccurrences(
    seqId,
    aggregationBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **aggregationBodyWithSqon** | **AggregationBodyWithSqon**| Aggregation Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Array<Aggregation>**

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

# **aggregateGermlineSNVOccurrences**
> Array<Aggregation> aggregateGermlineSNVOccurrences(aggregationBodyWithSqon)

Aggregate germline SNV occurrences for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    AggregationBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let aggregationBodyWithSqon: AggregationBodyWithSqon; //Aggregation Body
let withDictionary: boolean; //Whether to include all possible facet values (optional) (default to false)

const { status, data } = await apiInstance.aggregateGermlineSNVOccurrences(
    seqId,
    aggregationBodyWithSqon,
    withDictionary
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **aggregationBodyWithSqon** | **AggregationBodyWithSqon**| Aggregation Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|
| **withDictionary** | [**boolean**] | Whether to include all possible facet values | (optional) defaults to false|


### Return type

**Array<Aggregation>**

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

# **countGermlineCNVOccurrences**
> Count countGermlineCNVOccurrences(countBodyWithSqon)

Counts germline CNV occurrences for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    CountBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let countBodyWithSqon: CountBodyWithSqon; //Count Body

const { status, data } = await apiInstance.countGermlineCNVOccurrences(
    seqId,
    countBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **countBodyWithSqon** | **CountBodyWithSqon**| Count Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Count**

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

# **countGermlineSNVOccurrences**
> Count countGermlineSNVOccurrences(countBodyWithSqon)

Counts germline SNV occurrences for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    CountBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let countBodyWithSqon: CountBodyWithSqon; //Count Body

const { status, data } = await apiInstance.countGermlineSNVOccurrences(
    seqId,
    countBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **countBodyWithSqon** | **CountBodyWithSqon**| Count Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Count**

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

# **getExpandedGermlineSNVOccurrence**
> ExpandedGermlineSNVOccurrence getExpandedGermlineSNVOccurrence()

Retrieve ExpandedGermlineSNVOccurrence data for a given locus ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let locusId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.getExpandedGermlineSNVOccurrence(
    seqId,
    locusId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **seqId** | [**string**] | Sequence ID | defaults to undefined|
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**ExpandedGermlineSNVOccurrence**

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

# **getGermlineSNVDictionary**
> Array<Facet> getGermlineSNVDictionary()

Retrieve germline SNV facets

### Example

```typescript
import {
    OccurrencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let facets: Array<string>; //One or more facets to retrieve (optional) (default to undefined)

const { status, data } = await apiInstance.getGermlineSNVDictionary(
    facets
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **facets** | **Array&lt;string&gt;** | One or more facets to retrieve | (optional) defaults to undefined|


### Return type

**Array<Facet>**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listGermlineCNVGenesOverlap**
> Array<CNVGeneOverlap> listGermlineCNVGenesOverlap()

List genes overlapping a CNV with a given ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: number; //Sequence ID (default to undefined)
let cnvId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.listGermlineCNVGenesOverlap(
    seqId,
    cnvId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **seqId** | [**number**] | Sequence ID | defaults to undefined|
| **cnvId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**Array<CNVGeneOverlap>**

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

# **listGermlineCNVOccurrences**
> Array<GermlineCNVOccurrence> listGermlineCNVOccurrences(listBodyWithSqon)

List germline CNV occurrences for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    ListBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let listBodyWithSqon: ListBodyWithSqon; //List Body

const { status, data } = await apiInstance.listGermlineCNVOccurrences(
    seqId,
    listBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithSqon** | **ListBodyWithSqon**| List Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Array<GermlineCNVOccurrence>**

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

# **listGermlineSNVOccurrences**
> Array<GermlineSNVOccurrence> listGermlineSNVOccurrences(listBodyWithSqon)

List germline SNV occurrences for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    ListBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let listBodyWithSqon: ListBodyWithSqon; //List Body

const { status, data } = await apiInstance.listGermlineSNVOccurrences(
    seqId,
    listBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithSqon** | **ListBodyWithSqon**| List Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Array<GermlineSNVOccurrence>**

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

# **statisticsGermlineCNVOccurrences**
> Statistics statisticsGermlineCNVOccurrences(statisticsBodyWithSqon)

Return statistics about a field for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    StatisticsBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let statisticsBodyWithSqon: StatisticsBodyWithSqon; //Statistics Body

const { status, data } = await apiInstance.statisticsGermlineCNVOccurrences(
    seqId,
    statisticsBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **statisticsBodyWithSqon** | **StatisticsBodyWithSqon**| Statistics Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Statistics**

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

# **statisticsGermlineSNVOccurrences**
> Statistics statisticsGermlineSNVOccurrences(statisticsBodyWithSqon)

Return statistics about a field for a given sequence ID

### Example

```typescript
import {
    OccurrencesApi,
    Configuration,
    StatisticsBodyWithSqon
} from './api';

const configuration = new Configuration();
const apiInstance = new OccurrencesApi(configuration);

let seqId: string; //Sequence ID (default to undefined)
let statisticsBodyWithSqon: StatisticsBodyWithSqon; //Statistics Body

const { status, data } = await apiInstance.statisticsGermlineSNVOccurrences(
    seqId,
    statisticsBodyWithSqon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **statisticsBodyWithSqon** | **StatisticsBodyWithSqon**| Statistics Body | |
| **seqId** | [**string**] | Sequence ID | defaults to undefined|


### Return type

**Statistics**

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

