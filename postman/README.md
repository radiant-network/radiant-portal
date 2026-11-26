# Postman Collections

This folder contains the Postman collections used to test Radiant API.

## 📦 Contents

* `RADIANT-API.postman_collection.json` → Main collection
* `Radiant.postman_environment.json` → Environment file (configurable variables)
* `Radiant-Local.postman_environment.json` → Environment of the local stack (`make docker-run` in `backend/`), filled with its dev values

## 🚀 Using with Postman

1. Open Postman
2. Click **Import**
3. Select the `.collection.json` and `.environment.json` files
4. Select the environment before running the requests

## 🔧 Environment Variables

The following variables must be configured:

| Variable                     | Description                | Example                 |
| ---------------------------- | -------------------------- | ----------------------- |
| `radiant-api-url`            | API base URL               | `http://localhost:8090` |
| `keycloak-url`               | Keycloak base URL          | `http://localhost:8080` |
| `keycloak-realm`             | Keycloak realm             | `radiant`               |
| `client-secret`              | Radiant client secret      | `xxxxxx`                |
| `username`                   | Your username              | `xxxxxx`                |
| `password`                   | Your password              | `xxxxxx`                |
| `data-manager-client-id`     | Data manager client ID     | `xxxxxx`                |
| `data-manager-client-secret` | Data manager client secret | `xxxxxx`                |
| `accept-language`            | Language of the labels     | `en` or `fr`            |

The others `token` and `batch-id` will be filled by post response scripts.

⚠️ Secrets (API keys, tokens, credentials) must **never** be committed to the repository. The local environment holds only the local stack's dev values, already public in `backend/scripts/init-keycloak/radiant.json`.

## 📝 Best Practices

* Update the collection whenever the API changes
* Never commit secrets

---

If you make significant API changes, make sure to update this collection accordingly.
