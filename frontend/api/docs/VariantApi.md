# VariantApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getExpandedGermlineVariantInterpretedCase**](#getexpandedgermlinevariantinterpretedcase) | **GET** /variants/germline/{locus_id}/cases/interpreted/{seq_id}/{transcript_id} | Get expanded germline interpreted case for a given locus, sequencing and transcript|
|[**getGermlineVariantCasesCount**](#getgermlinevariantcasescount) | **GET** /variants/germline/{locus_id}/cases/count | Get germline cases count for a given locus|
|[**getGermlineVariantCasesFilters**](#getgermlinevariantcasesfilters) | **GET** /variants/germline/cases/filters | Get cases filters for germline variant entity|
|[**getGermlineVariantConditions**](#getgermlinevariantconditions) | **GET** /variants/germline/{locus_id}/conditions/{panel_type} | Get conditions for germline variant entity for a specific gene panel|
|[**getGermlineVariantConditionsClinvar**](#getgermlinevariantconditionsclinvar) | **GET** /variants/germline/{locus_id}/conditions/clinvar | Get ClinVar conditions for germline variant entity|
|[**getGermlineVariantConsequences**](#getgermlinevariantconsequences) | **GET** /variants/germline/{locus_id}/consequences | Get list of VariantConsequences for a germline variant|
|[**getGermlineVariantHeader**](#getgermlinevariantheader) | **GET** /variants/germline/{locus_id}/header | Get a germline VariantHeader|
|[**getGermlineVariantInterpretedCases**](#getgermlinevariantinterpretedcases) | **POST** /variants/germline/{locus_id}/cases/interpreted | Get list of interpreted Cases for a germline variant|
|[**getGermlineVariantOverview**](#getgermlinevariantoverview) | **GET** /variants/germline/{locus_id}/overview | Get a germline VariantOverview|
|[**getGermlineVariantUninterpretedCases**](#getgermlinevariantuninterpretedcases) | **POST** /variants/germline/{locus_id}/cases/uninterpreted | Get list of uninterpreted Cases for a germline variant|

# **getExpandedGermlineVariantInterpretedCase**
> VariantExpandedInterpretedCase getExpandedGermlineVariantInterpretedCase()

Retrieve germline expanded interpreted case for a given locus, sequencing and transcript

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)
let seqId: string; //Seq ID (default to undefined)
let transcriptId: string; //Transcript ID (default to undefined)

const { status, data } = await apiInstance.getExpandedGermlineVariantInterpretedCase(
    locusId,
    seqId,
    transcriptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|
| **seqId** | [**string**] | Seq ID | defaults to undefined|
| **transcriptId** | [**string**] | Transcript ID | defaults to undefined|


### Return type

**VariantExpandedInterpretedCase**

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

# **getGermlineVariantCasesCount**
> VariantCasesCount getGermlineVariantCasesCount()

Retrieve cases count for a given locus id

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.getGermlineVariantCasesCount(
    locusId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**VariantCasesCount**

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

# **getGermlineVariantCasesFilters**
> VariantCasesFilters getGermlineVariantCasesFilters()

Retrieve cases filters for germline variant entity

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

const { status, data } = await apiInstance.getGermlineVariantCasesFilters();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**VariantCasesFilters**

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

# **getGermlineVariantConditions**
> GenePanelConditions getGermlineVariantConditions()

Retrieve conditions for germline variant entity for a specific gene panel

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)
let panelType: 'omim' | 'hpo' | 'orphanet'; //Gene panel type (default to undefined)
let filter: string; //Condition filter (optional) (default to undefined)

const { status, data } = await apiInstance.getGermlineVariantConditions(
    locusId,
    panelType,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|
| **panelType** | [**&#39;omim&#39; | &#39;hpo&#39; | &#39;orphanet&#39;**]**Array<&#39;omim&#39; &#124; &#39;hpo&#39; &#124; &#39;orphanet&#39;>** | Gene panel type | defaults to undefined|
| **filter** | [**string**] | Condition filter | (optional) defaults to undefined|


### Return type

**GenePanelConditions**

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

# **getGermlineVariantConditionsClinvar**
> Array<ClinvarRCV> getGermlineVariantConditionsClinvar()

Retrieve ClinVar conditions for germline variant entity

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.getGermlineVariantConditionsClinvar(
    locusId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**Array<ClinvarRCV>**

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

# **getGermlineVariantConsequences**
> Array<VariantConsequence> getGermlineVariantConsequences()

Retrieve germline Variant Consequences for a given locus

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.getGermlineVariantConsequences(
    locusId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**Array<VariantConsequence>**

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

# **getGermlineVariantHeader**
> VariantHeader getGermlineVariantHeader()

Retrieve germline Variant Header data for a given locus

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.getGermlineVariantHeader(
    locusId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**VariantHeader**

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

# **getGermlineVariantInterpretedCases**
> VariantInterpretedCasesSearchResponse getGermlineVariantInterpretedCases(listBodyWithCriteria)

Retrieve Germline Variant interpreted cases for a given locus

### Example

```typescript
import {
    VariantApi,
    Configuration,
    ListBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)
let listBodyWithCriteria: ListBodyWithCriteria; //Search Body with criteria

const { status, data } = await apiInstance.getGermlineVariantInterpretedCases(
    locusId,
    listBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithCriteria** | **ListBodyWithCriteria**| Search Body with criteria | |
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**VariantInterpretedCasesSearchResponse**

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

# **getGermlineVariantOverview**
> VariantOverview getGermlineVariantOverview()

Retrieve germline Variant Overview data for a given locus

### Example

```typescript
import {
    VariantApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)

const { status, data } = await apiInstance.getGermlineVariantOverview(
    locusId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**VariantOverview**

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

# **getGermlineVariantUninterpretedCases**
> VariantUninterpretedCasesSearchResponse getGermlineVariantUninterpretedCases(listBodyWithCriteria)

Retrieve Germline Variant uninterpreted cases for a given locus

### Example

```typescript
import {
    VariantApi,
    Configuration,
    ListBodyWithCriteria
} from './api';

const configuration = new Configuration();
const apiInstance = new VariantApi(configuration);

let locusId: string; //Locus ID (default to undefined)
let listBodyWithCriteria: ListBodyWithCriteria; //Search Body with criteria

const { status, data } = await apiInstance.getGermlineVariantUninterpretedCases(
    locusId,
    listBodyWithCriteria
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **listBodyWithCriteria** | **ListBodyWithCriteria**| Search Body with criteria | |
| **locusId** | [**string**] | Locus ID | defaults to undefined|


### Return type

**VariantUninterpretedCasesSearchResponse**

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

