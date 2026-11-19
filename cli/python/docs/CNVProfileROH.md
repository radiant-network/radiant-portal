# CNVProfileROH


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chromosome** | **str** |  | 
**end** | **int** |  | 
**nb_het** | **int** |  | 
**nb_hom** | **int** |  | 
**score** | **float** |  | 
**start** | **int** |  | 

## Example

```python
from radiant_python.models.cnv_profile_roh import CNVProfileROH

# TODO update the JSON string below
json = "{}"
# create an instance of CNVProfileROH from a JSON string
cnv_profile_roh_instance = CNVProfileROH.from_json(json)
# print the JSON string representation of the object
print(CNVProfileROH.to_json())

# convert the object into a dict
cnv_profile_roh_dict = cnv_profile_roh_instance.to_dict()
# create an instance of CNVProfileROH from a dict
cnv_profile_roh_from_dict = CNVProfileROH.from_dict(cnv_profile_roh_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


