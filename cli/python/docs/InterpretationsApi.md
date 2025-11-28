# openapi_client.InterpretationsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_interpretation_germline**](InterpretationsApi.md#get_interpretation_germline) | **GET** /interpretations/v2/germline/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} | Get interpretation germline
[**get_interpretation_germline_deprecated**](InterpretationsApi.md#get_interpretation_germline_deprecated) | **GET** /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} | Get interpretation germline
[**get_interpretation_somatic**](InterpretationsApi.md#get_interpretation_somatic) | **GET** /interpretations/v2/somatic/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} | Get interpretation somatic
[**get_interpretation_somatic_deprecated**](InterpretationsApi.md#get_interpretation_somatic_deprecated) | **GET** /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} | Get interpretation somatic
[**get_pubmed_citation**](InterpretationsApi.md#get_pubmed_citation) | **GET** /interpretations/pubmed/{citation_id} | Get pubmed citation by ID
[**post_interpretation_germline**](InterpretationsApi.md#post_interpretation_germline) | **POST** /interpretations/v2/germline/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} | Create or Update interpretation germline
[**post_interpretation_germline_deprecated**](InterpretationsApi.md#post_interpretation_germline_deprecated) | **POST** /interpretations/germline/{sequencing_id}/{locus_id}/{transcript_id} | Create or Update interpretation germline
[**post_interpretation_somatic**](InterpretationsApi.md#post_interpretation_somatic) | **POST** /interpretations/v2/somatic/{case_id}/{sequencing_id}/{locus_id}/{transcript_id} | Create or Update interpretation somatic
[**post_interpretation_somatic_deprecated**](InterpretationsApi.md#post_interpretation_somatic_deprecated) | **POST** /interpretations/somatic/{sequencing_id}/{locus_id}/{transcript_id} | Create or Update interpretation somatic
[**search_interpretation_germline**](InterpretationsApi.md#search_interpretation_germline) | **GET** /interpretations/germline | Search interpretation germline
[**search_interpretation_somatic**](InterpretationsApi.md#search_interpretation_somatic) | **GET** /interpretations/somatic | Search interpretation somatic


# **get_interpretation_germline**
> InterpretationGermline get_interpretation_germline(case_id, sequencing_id, locus_id, transcript_id)

Get interpretation germline

Get interpretation germline

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_germline import InterpretationGermline
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    case_id = 'case_id_example' # str | Case ID
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID

    try:
        # Get interpretation germline
        api_response = api_instance.get_interpretation_germline(case_id, sequencing_id, locus_id, transcript_id)
        print("The response of InterpretationsApi->get_interpretation_germline:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->get_interpretation_germline: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **str**| Case ID | 
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 

### Return type

[**InterpretationGermline**](InterpretationGermline.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**206** | Partial Content |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_interpretation_germline_deprecated**
> InterpretationGermline get_interpretation_germline_deprecated(sequencing_id, locus_id, transcript_id)

Get interpretation germline

Get interpretation germline

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_germline import InterpretationGermline
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID

    try:
        # Get interpretation germline
        api_response = api_instance.get_interpretation_germline_deprecated(sequencing_id, locus_id, transcript_id)
        print("The response of InterpretationsApi->get_interpretation_germline_deprecated:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->get_interpretation_germline_deprecated: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 

### Return type

[**InterpretationGermline**](InterpretationGermline.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**206** | Partial Content |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_interpretation_somatic**
> InterpretationSomatic get_interpretation_somatic(case_id, sequencing_id, locus_id, transcript_id)

Get interpretation somatic

Get interpretation somatic

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_somatic import InterpretationSomatic
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    case_id = 'case_id_example' # str | Case ID
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID

    try:
        # Get interpretation somatic
        api_response = api_instance.get_interpretation_somatic(case_id, sequencing_id, locus_id, transcript_id)
        print("The response of InterpretationsApi->get_interpretation_somatic:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->get_interpretation_somatic: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **str**| Case ID | 
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 

### Return type

[**InterpretationSomatic**](InterpretationSomatic.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**206** | Partial Content |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_interpretation_somatic_deprecated**
> InterpretationSomatic get_interpretation_somatic_deprecated(sequencing_id, locus_id, transcript_id)

Get interpretation somatic

Get interpretation somatic

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_somatic import InterpretationSomatic
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID

    try:
        # Get interpretation somatic
        api_response = api_instance.get_interpretation_somatic_deprecated(sequencing_id, locus_id, transcript_id)
        print("The response of InterpretationsApi->get_interpretation_somatic_deprecated:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->get_interpretation_somatic_deprecated: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 

### Return type

[**InterpretationSomatic**](InterpretationSomatic.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**206** | Partial Content |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_pubmed_citation**
> PubmedCitation get_pubmed_citation(citation_id)

Get pubmed citation by ID

Get pubmed citation by ID

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.pubmed_citation import PubmedCitation
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    citation_id = 'citation_id_example' # str | Citation ID

    try:
        # Get pubmed citation by ID
        api_response = api_instance.get_pubmed_citation(citation_id)
        print("The response of InterpretationsApi->get_pubmed_citation:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->get_pubmed_citation: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **citation_id** | **str**| Citation ID | 

### Return type

[**PubmedCitation**](PubmedCitation.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**206** | Partial Content |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_interpretation_germline**
> InterpretationGermline post_interpretation_germline(case_id, sequencing_id, locus_id, transcript_id, interpretation_germline)

Create or Update interpretation germline

Create or Update interpretation germline

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_germline import InterpretationGermline
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    case_id = 'case_id_example' # str | Case ID
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID
    interpretation_germline = openapi_client.InterpretationGermline() # InterpretationGermline | Interpretation Body

    try:
        # Create or Update interpretation germline
        api_response = api_instance.post_interpretation_germline(case_id, sequencing_id, locus_id, transcript_id, interpretation_germline)
        print("The response of InterpretationsApi->post_interpretation_germline:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->post_interpretation_germline: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **str**| Case ID | 
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 
 **interpretation_germline** | [**InterpretationGermline**](InterpretationGermline.md)| Interpretation Body | 

### Return type

[**InterpretationGermline**](InterpretationGermline.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_interpretation_germline_deprecated**
> InterpretationGermline post_interpretation_germline_deprecated(sequencing_id, locus_id, transcript_id, interpretation_germline)

Create or Update interpretation germline

Create or Update interpretation germline

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_germline import InterpretationGermline
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID
    interpretation_germline = openapi_client.InterpretationGermline() # InterpretationGermline | Interpretation Body

    try:
        # Create or Update interpretation germline
        api_response = api_instance.post_interpretation_germline_deprecated(sequencing_id, locus_id, transcript_id, interpretation_germline)
        print("The response of InterpretationsApi->post_interpretation_germline_deprecated:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->post_interpretation_germline_deprecated: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 
 **interpretation_germline** | [**InterpretationGermline**](InterpretationGermline.md)| Interpretation Body | 

### Return type

[**InterpretationGermline**](InterpretationGermline.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_interpretation_somatic**
> InterpretationSomatic post_interpretation_somatic(case_id, sequencing_id, locus_id, transcript_id, interpretation_somatic)

Create or Update interpretation somatic

Create or Update interpretation somatic

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_somatic import InterpretationSomatic
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    case_id = 'case_id_example' # str | Case ID
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID
    interpretation_somatic = openapi_client.InterpretationSomatic() # InterpretationSomatic | Interpretation Body

    try:
        # Create or Update interpretation somatic
        api_response = api_instance.post_interpretation_somatic(case_id, sequencing_id, locus_id, transcript_id, interpretation_somatic)
        print("The response of InterpretationsApi->post_interpretation_somatic:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->post_interpretation_somatic: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **str**| Case ID | 
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 
 **interpretation_somatic** | [**InterpretationSomatic**](InterpretationSomatic.md)| Interpretation Body | 

### Return type

[**InterpretationSomatic**](InterpretationSomatic.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_interpretation_somatic_deprecated**
> InterpretationSomatic post_interpretation_somatic_deprecated(sequencing_id, locus_id, transcript_id, interpretation_somatic)

Create or Update interpretation somatic

Create or Update interpretation somatic

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_somatic import InterpretationSomatic
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)
    sequencing_id = 'sequencing_id_example' # str | Sequencing ID
    locus_id = 'locus_id_example' # str | Locus ID
    transcript_id = 'transcript_id_example' # str | Transcript ID
    interpretation_somatic = openapi_client.InterpretationSomatic() # InterpretationSomatic | Interpretation Body

    try:
        # Create or Update interpretation somatic
        api_response = api_instance.post_interpretation_somatic_deprecated(sequencing_id, locus_id, transcript_id, interpretation_somatic)
        print("The response of InterpretationsApi->post_interpretation_somatic_deprecated:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->post_interpretation_somatic_deprecated: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sequencing_id** | **str**| Sequencing ID | 
 **locus_id** | **str**| Locus ID | 
 **transcript_id** | **str**| Transcript ID | 
 **interpretation_somatic** | [**InterpretationSomatic**](InterpretationSomatic.md)| Interpretation Body | 

### Return type

[**InterpretationSomatic**](InterpretationSomatic.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **search_interpretation_germline**
> List[InterpretationGermline] search_interpretation_germline()

Search interpretation germline

Search interpretation germline

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_germline import InterpretationGermline
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)

    try:
        # Search interpretation germline
        api_response = api_instance.search_interpretation_germline()
        print("The response of InterpretationsApi->search_interpretation_germline:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->search_interpretation_germline: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[InterpretationGermline]**](InterpretationGermline.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **search_interpretation_somatic**
> List[InterpretationSomatic] search_interpretation_somatic()

Search interpretation somatic

Search interpretation somatic

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import openapi_client
from openapi_client.models.interpretation_somatic import InterpretationSomatic
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): bearerauth
configuration = openapi_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.InterpretationsApi(api_client)

    try:
        # Search interpretation somatic
        api_response = api_instance.search_interpretation_somatic()
        print("The response of InterpretationsApi->search_interpretation_somatic:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling InterpretationsApi->search_interpretation_somatic: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[InterpretationSomatic]**](InterpretationSomatic.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

