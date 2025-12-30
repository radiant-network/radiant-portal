---
sidebar_position: 0
---

# API Clients

This section provides information about the available API clients for the Radiant Portal backend API.

## Python Client

### Requirements.

Python 3.12+

### Installation

Install directly (using `pip`) in your environment by running the following command:

```sh
pip install git+https://github.com/radiant-network/radiant-portal.git#subdirectory=cli/python
```

### Example Usage

```python

import radiant_python
from radiant_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = radiant_python.Configuration(
    host = "http://localhost"
)

# Configure Bearer authorization (JWT): bearerauth
configuration = radiant_python.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with radiant_python.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = radiant_python.SequencingApi(api_client)
    seq_id = 'seq_id_example' # str | Seq ID

    try:
        # Get Sequencing by seq_id
        api_response = api_instance.get_sequencing(seq_id)
        print("The response of SequencingApi->get_sequencing:\n")
        pprint(api_response)
    except ApiException as e:
        print("Exception when calling SequencingApi->get_sequencing: %s\n" % e)

```


Authentication schemes defined for the API:
<a id="bearerauth"></a>
#### bearerauth

- **Type**: Bearer authentication (JWT)
