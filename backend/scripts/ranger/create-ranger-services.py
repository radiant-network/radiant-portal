# Replaces the stock apache/ranger:2.7.0 create-ranger-services.py (which creates nine demo
# dev_* service instances pointing at non-existent Hadoop/Hive/etc. containers).
#
# ranger.sh runs this once on first setup (when /opt/ranger/.setupDone is absent), ~30s after the
# admin starts. By fully replacing the stock script, the dev_* services are never created; instead
# we register our StarRocks service definition and a single "starrocks" service instance.
#
# Scope: service-def + service only. No access policies, and no StarRocks engine integration
# (no fe.conf change) -- the service config below is used by Ranger only for test-connection /
# resource lookup in the policy UI, and is harmless if StarRocks is unreachable.

import json

from apache_ranger.client.ranger_client import RangerClient
from apache_ranger.model.ranger_service import RangerService
from apache_ranger.model.ranger_service_def import RangerServiceDef

ranger_client = RangerClient('http://ranger:6080', ('admin', 'rangerR0cks!'))

SERVICEDEF_FILE = '/home/ranger/scripts/ranger-servicedef-starrocks.json'


def missing(getter, name):
    try:
        return getter(name) is None
    except Exception:
        # The stock script treats a non-JSON / 404 response as "does not exist".
        return True


# 1. Register the StarRocks service definition (idempotent).
with open(SERVICEDEF_FILE) as f:
    starrocks_def = RangerServiceDef(json.load(f))

try:
    if missing(ranger_client.get_service_def, 'starrocks'):
        ranger_client.create_service_def(starrocks_def)
        print(" starrocks service-def created!")
    else:
        print(" starrocks service-def already exists")
except Exception as e:
    print(f"An exception occured creating the starrocks service-def: {e}")

# 2. Create the StarRocks service instance (idempotent).
starrocks = RangerService({'name': 'starrocks', 'type': 'starrocks',
                           'configs': {'username': 'root', 'password': '',
                                       'jdbc.driverClassName': 'com.mysql.cj.jdbc.Driver',
                                       'jdbc.url': 'jdbc:mysql://starrocks:9030'}})

try:
    if missing(ranger_client.get_service, 'starrocks'):
        ranger_client.create_service(starrocks)
        print(" starrocks service created!")
    else:
        print(" starrocks service already exists")
except Exception as e:
    print(f"An exception occured creating the starrocks service: {e}")
