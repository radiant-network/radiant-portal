# UtilsPreSignedURL


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expires_at** | **int** |  | [optional] 
**url** | **str** |  | [optional] 

## Example

```python
from radiant_python.models.utils_pre_signed_url import UtilsPreSignedURL

# TODO update the JSON string below
json = "{}"
# create an instance of UtilsPreSignedURL from a JSON string
utils_pre_signed_url_instance = UtilsPreSignedURL.from_json(json)
# print the JSON string representation of the object
print(UtilsPreSignedURL.to_json())

# convert the object into a dict
utils_pre_signed_url_dict = utils_pre_signed_url_instance.to_dict()
# create an instance of UtilsPreSignedURL from a dict
utils_pre_signed_url_from_dict = UtilsPreSignedURL.from_dict(utils_pre_signed_url_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


