# PubmedCitationDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**format** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.pubmed_citation_details import PubmedCitationDetails

# TODO update the JSON string below
json = "{}"
# create an instance of PubmedCitationDetails from a JSON string
pubmed_citation_details_instance = PubmedCitationDetails.from_json(json)
# print the JSON string representation of the object
print(PubmedCitationDetails.to_json())

# convert the object into a dict
pubmed_citation_details_dict = pubmed_citation_details_instance.to_dict()
# create an instance of PubmedCitationDetails from a dict
pubmed_citation_details_from_dict = PubmedCitationDetails.from_dict(pubmed_citation_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


