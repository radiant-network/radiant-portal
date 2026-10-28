# CNVProfileChromosome


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**size** | **int** |  | 

## Example

```python
from radiant_python.models.cnv_profile_chromosome import CNVProfileChromosome

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfileChromosome from a JSON string
cnv_profile_chromosome_instance = CNVProfileChromosome.from_json(json)
# print the JSON string representation of the object
print(CNVProfileChromosome.to_json())

# convert the object into a dict
cnv_profile_chromosome_dict = cnv_profile_chromosome_instance.to_dict()
# create an instance of CNVProfileChromosome from a dict
cnv_profile_chromosome_from_dict = CNVProfileChromosome.from_dict(cnv_profile_chromosome_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


