# radiant_python.CaseGroupsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_case_group**](CaseGroupsApi.md#create_case_group) | **POST** /{tenant}/case_groups | Create or overwrite a case group
[**get_case_group**](CaseGroupsApi.md#get_case_group) | **GET** /{tenant}/case_groups/{name} | Get a case group
[**notify_case_group**](CaseGroupsApi.md#notify_case_group) | **POST** /{tenant}/case_groups/{name}/notify | Email the diagnosis laboratories of a case group


# **create_case_group**
> CaseGroupResponse create_case_group(tenant, case_group_request)

Create or overwrite a case group

Creates a named set of cases in the tenant in the path. The name is the key:
posting an existing name overwrites its case list, so a pipeline retry is idempotent.
Every case id must exist in the tenant. Requires the `can_ingest_data` action.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.case_group_request import CaseGroupRequest
from radiant_python.models.case_group_response import CaseGroupResponse
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
    api_instance = radiant_python.CaseGroupsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    case_group_request = radiant_python.CaseGroupRequest() # CaseGroupRequest | Case group to create or overwrite

    try:
        # Create or overwrite a case group
        api_response = api_instance.create_case_group(tenant, case_group_request)
        print("The response of CaseGroupsApi->create_case_group:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CaseGroupsApi->create_case_group: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **case_group_request** | [**CaseGroupRequest**](CaseGroupRequest.md)| Case group to create or overwrite | 

### Return type

[**CaseGroupResponse**](CaseGroupResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_case_group**
> CaseGroupResponse get_case_group(tenant, name)

Get a case group

Returns the case group with this name in the tenant in the path, with its case ids.
Requires the `can_search_case` action, so the portal can turn a group into a case filter.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.case_group_response import CaseGroupResponse
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
    api_instance = radiant_python.CaseGroupsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    name = 'name_example' # str | Case group name

    try:
        # Get a case group
        api_response = api_instance.get_case_group(tenant, name)
        print("The response of CaseGroupsApi->get_case_group:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CaseGroupsApi->get_case_group: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **name** | **str**| Case group name | 

### Return type

[**CaseGroupResponse**](CaseGroupResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notify_case_group**
> NotifyCaseGroupResponse notify_case_group(tenant, name)

Email the diagnosis laboratories of a case group

Sends one email per diagnosis laboratory of the group's cases, with the TSV manifest
of that laboratory's output documents attached (index files included), ready for
`radiant-client download -m`. Recipients come from `organization.notification_emails`,
subject and body from the tenant's template. Stateless: calling it again sends again.
Requires the `can_ingest_data` action. Returns 500 before any send when the tenant has
no template or the SMTP / notification settings are invalid; a laboratory whose send
fails is reported as `failed` and the others are still served.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.notify_case_group_response import NotifyCaseGroupResponse
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
    api_instance = radiant_python.CaseGroupsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    name = 'name_example' # str | Case group name

    try:
        # Email the diagnosis laboratories of a case group
        api_response = api_instance.notify_case_group(tenant, name)
        print("The response of CaseGroupsApi->notify_case_group:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CaseGroupsApi->notify_case_group: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **name** | **str**| Case group name | 

### Return type

[**NotifyCaseGroupResponse**](NotifyCaseGroupResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

