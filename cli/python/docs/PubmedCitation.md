# PubmedCitation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | [optional] 
**nlm** | [**PubmedCitationDetails**](PubmedCitationDetails.md) |  | [optional] 

## Example

```python
from openapi_client.models.pubmed_citation import PubmedCitation

# TODO update the JSON string below
json = "{}"
# create an instance of PubmedCitation from a JSON string
pubmed_citation_instance = PubmedCitation.from_json(json)
# print the JSON string representation of the object
print(PubmedCitation.to_json())

# convert the object into a dict
pubmed_citation_dict = pubmed_citation_instance.to_dict()
# create an instance of PubmedCitation from a dict
pubmed_citation_from_dict = PubmedCitation.from_dict(pubmed_citation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


