# radiant_python.OccurrenceNotesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**count_occurrence_notes**](OccurrenceNotesApi.md#count_occurrence_notes) | **GET** /notes/{case_id}/{seq_id}/{task_id}/{occurrence_id}/count | Count notes for an occurrence
[**delete_occurrence_note**](OccurrenceNotesApi.md#delete_occurrence_note) | **DELETE** /notes/{id} | Delete a note on an occurrence
[**get_occurrence_notes**](OccurrenceNotesApi.md#get_occurrence_notes) | **GET** /notes/{case_id}/{seq_id}/{task_id}/{occurrence_id} | Get notes for an occurrence
[**post_occurrence_note**](OccurrenceNotesApi.md#post_occurrence_note) | **POST** /notes | Create a note on an occurrence
[**put_occurrence_note**](OccurrenceNotesApi.md#put_occurrence_note) | **PUT** /notes/{id} | Update a note on an occurrence


# **count_occurrence_notes**
> Count count_occurrence_notes(case_id, seq_id, task_id, occurrence_id)

Count notes for an occurrence

Count all notes associated with an occurrence

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.count import Count
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
    api_instance = radiant_python.OccurrenceNotesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequencing Experiment ID
    task_id = 56 # int | Task ID
    occurrence_id = 'occurrence_id_example' # str | Occurrence ID

    try:
        # Count notes for an occurrence
        api_response = api_instance.count_occurrence_notes(case_id, seq_id, task_id, occurrence_id)
        print("The response of OccurrenceNotesApi->count_occurrence_notes:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrenceNotesApi->count_occurrence_notes: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequencing Experiment ID | 
 **task_id** | **int**| Task ID | 
 **occurrence_id** | **str**| Occurrence ID | 

### Return type

[**Count**](Count.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_occurrence_note**
> delete_occurrence_note(id)

Delete a note on an occurrence

Soft-delete a note by ID. Only the owner of the note can delete it.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
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
    api_instance = radiant_python.OccurrenceNotesApi(api_client)
    id = 'id_example' # str | Note ID

    try:
        # Delete a note on an occurrence
        api_instance.delete_occurrence_note(id)
    except Exception as e:
        print("Exception when calling OccurrenceNotesApi->delete_occurrence_note: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| Note ID | 

### Return type

void (empty response body)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | No Content |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_occurrence_notes**
> List[OccurrenceNote] get_occurrence_notes(case_id, seq_id, task_id, occurrence_id)

Get notes for an occurrence

Get all notes associated with an occurrence

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.occurrence_note import OccurrenceNote
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
    api_instance = radiant_python.OccurrenceNotesApi(api_client)
    case_id = 56 # int | Case ID
    seq_id = 56 # int | Sequencing Experiment ID
    task_id = 56 # int | Task ID
    occurrence_id = 'occurrence_id_example' # str | Occurrence ID

    try:
        # Get notes for an occurrence
        api_response = api_instance.get_occurrence_notes(case_id, seq_id, task_id, occurrence_id)
        print("The response of OccurrenceNotesApi->get_occurrence_notes:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrenceNotesApi->get_occurrence_notes: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **case_id** | **int**| Case ID | 
 **seq_id** | **int**| Sequencing Experiment ID | 
 **task_id** | **int**| Task ID | 
 **occurrence_id** | **str**| Occurrence ID | 

### Return type

[**List[OccurrenceNote]**](OccurrenceNote.md)

### Authorization

[bearerauth](../README.md#bearerauth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_occurrence_note**
> OccurrenceNote post_occurrence_note(create_occurrence_note_input)

Create a note on an occurrence

Create a new note associated with an occurrence (SNV or CNV)

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.create_occurrence_note_input import CreateOccurrenceNoteInput
from radiant_python.models.occurrence_note import OccurrenceNote
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
    api_instance = radiant_python.OccurrenceNotesApi(api_client)
    create_occurrence_note_input = radiant_python.CreateOccurrenceNoteInput() # CreateOccurrenceNoteInput | Note to create

    try:
        # Create a note on an occurrence
        api_response = api_instance.post_occurrence_note(create_occurrence_note_input)
        print("The response of OccurrenceNotesApi->post_occurrence_note:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrenceNotesApi->post_occurrence_note: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_occurrence_note_input** | [**CreateOccurrenceNoteInput**](CreateOccurrenceNoteInput.md)| Note to create | 

### Return type

[**OccurrenceNote**](OccurrenceNote.md)

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
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_occurrence_note**
> OccurrenceNote put_occurrence_note(id, update_occurrence_note_input)

Update a note on an occurrence

Update the content of an existing note. Only the owner of the note can update it.

### Example

* Bearer (JWT) Authentication (bearerauth):

```python
import radiant_python
from radiant_python.models.occurrence_note import OccurrenceNote
from radiant_python.models.update_occurrence_note_input import UpdateOccurrenceNoteInput
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
    api_instance = radiant_python.OccurrenceNotesApi(api_client)
    id = 'id_example' # str | Note ID
    update_occurrence_note_input = radiant_python.UpdateOccurrenceNoteInput() # UpdateOccurrenceNoteInput | Updated content

    try:
        # Update a note on an occurrence
        api_response = api_instance.put_occurrence_note(id, update_occurrence_note_input)
        print("The response of OccurrenceNotesApi->put_occurrence_note:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OccurrenceNotesApi->put_occurrence_note: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| Note ID | 
 **update_occurrence_note_input** | [**UpdateOccurrenceNoteInput**](UpdateOccurrenceNoteInput.md)| Updated content | 

### Return type

[**OccurrenceNote**](OccurrenceNote.md)

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
**403** | Forbidden |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

