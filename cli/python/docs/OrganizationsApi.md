# radiant_python.OrganizationsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_organization**](OrganizationsApi.md#create_organization) | **POST** /{tenant}/organizations | Create an organization
[**list_organizations**](OrganizationsApi.md#list_organizations) | **GET** /{tenant}/organizations | List the tenant&#39;s organizations
[**update_organization**](OrganizationsApi.md#update_organization) | **PUT** /{tenant}/organizations/{code} | Update an organization


# **create_organization**
> object create_organization(tenant, create_organization_request)

Create an organization

Creates an organization in the tenant in the path. Requires the `can_manage_org`
action. The code must be unique within the tenant and is immutable after creation.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_organization_request import CreateOrganizationRequest
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
    api_instance = radiant_python.OrganizationsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    create_organization_request = radiant_python.CreateOrganizationRequest() # CreateOrganizationRequest | Organization to create

    try:
        # Create an organization
        api_response = api_instance.create_organization(tenant, create_organization_request)
        print("The response of OrganizationsApi->create_organization:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrganizationsApi->create_organization: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **create_organization_request** | [**CreateOrganizationRequest**](CreateOrganizationRequest.md)| Organization to create | 

### Return type

**object**

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Created |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**409** | Conflict |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_organizations**
> List[OrganizationResponse] list_organizations(tenant)

List the tenant's organizations

Returns the organizations of the tenant in the path, each with its category label.
Readable by any member of the tenant; it also feeds the organization picker when
assigning org-scoped roles to a user.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.organization_response import OrganizationResponse
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
    api_instance = radiant_python.OrganizationsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code

    try:
        # List the tenant's organizations
        api_response = api_instance.list_organizations(tenant)
        print("The response of OrganizationsApi->list_organizations:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrganizationsApi->list_organizations: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 

### Return type

[**List[OrganizationResponse]**](OrganizationResponse.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_organization**
> object update_organization(tenant, code, update_organization_request)

Update an organization

Updates an organization's name in the tenant. Requires the `can_manage_org` action.
Code and category are immutable, so only the name can change.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.update_organization_request import UpdateOrganizationRequest
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
    api_instance = radiant_python.OrganizationsApi(api_client)
    tenant = 'tenant_example' # str | Tenant code
    code = 'code_example' # str | Organization code
    update_organization_request = radiant_python.UpdateOrganizationRequest() # UpdateOrganizationRequest | Organization fields to update

    try:
        # Update an organization
        api_response = api_instance.update_organization(tenant, code, update_organization_request)
        print("The response of OrganizationsApi->update_organization:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OrganizationsApi->update_organization: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenant** | **str**| Tenant code | 
 **code** | **str**| Organization code | 
 **update_organization_request** | [**UpdateOrganizationRequest**](UpdateOrganizationRequest.md)| Organization fields to update | 

### Return type

**object**

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
**404** | Not Found |  -  |
**500** | Internal Server Error |  * X-Correlation-ID - Unique id correlating this error with the server-side log entry <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

