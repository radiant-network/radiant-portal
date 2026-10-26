# Cytoband


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chromosome** | **str** |  | 
**cytoband** | **str** |  | 
**end** | **int** |  | 
**gie_stain** | **str** |  | [optional] 
**start** | **int** |  | 

## Example

```python
from radiant_python.models.cytoband import Cytoband

# TODO update the JSON string below
json = "{}"
# create an instance of Cytoband from a JSON string
cytoband_instance = Cytoband.from_json(json)
# print the JSON string representation of the object
print(Cytoband.to_json())

# convert the object into a dict
cytoband_dict = cytoband_instance.to_dict()
# create an instance of Cytoband from a dict
cytoband_from_dict = Cytoband.from_dict(cytoband_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


