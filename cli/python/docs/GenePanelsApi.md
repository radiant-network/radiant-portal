# radiant_python.GenePanelsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**put_gene_panels**](GenePanelsApi.md#put_gene_panels) | **PUT** /{tenant}/gene_panels | Replace the tenant&#39;s gene panels


# **put_gene_panels**
> GenePanelUploadResult put_gene_panels(tenant, file, strict=strict)

Replace the tenant's gene panels

Sets the genes of the tenant's panels from the attached `.tsv` file. A panel of the
file that the tenant already has (same code, any case), such as a panel of the
analysis catalog, keeps its name and settings and gets the genes of the file. A new
code creates a panel named by its code. Panels created by an earlier upload and
missing from the file are removed; other panels missing from the file are not
changed. The change is all or nothing, and the genes are available for variant
filtering when the call returns. Requires the `can_manage_analysis_catalog` action.
Sending the same file again gives the same result, so a retry is safe.

File: UTF-8 TSV, max 10 MiB, one row per gene, with a header row. Column `symbol` holds
the gene symbol, column `panels` the comma-separated codes of the panels the gene is
in. Other columns, such as `version`, are ignored. A missing column, an empty or
duplicate symbol, a bad panel code, or two codes that differ only by case give 400,
with the line in `detail.line`.

Each symbol must be a known gene (an Ensembl gene ID is also accepted). A row with an
unknown gene is skipped and returned in `warnings`; with `strict=true` the file is
rejected instead (422, the rows in `detail.warnings`). An uploaded panel missing from
the file that the analysis catalog still uses gives 409.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.gene_panel_upload_result import GenePanelUploadResult
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = radiant_python.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.GenePanelsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    file = None # bytearray | 
    strict = True # bool | Reject the file when a row matches no Ensembl gene (optional)

    try:
        # Replace the tenant's gene panels
        api_response = api_instance.put_gene_panels(tenant, file, strict=strict)
        print("The response of GenePanelsApi->put_gene_panels:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GenePanelsApi->put_gene_panels: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **file** | **bytearray**|  | 
 **strict** | **bool**| Reject the file when a row matches no Ensembl gene | [optional] 

### Return type

[**GenePanelUploadResult**](GenePanelUploadResult.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**409** | Conflict |  -  |
**413** | Request Entity Too Large |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

