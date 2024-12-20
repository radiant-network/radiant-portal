# Frontend 

## Getting Started

### Prerequisites

- Node.js
- Mac or Linux OS
- Make

### Installing

1. Clone the repository
2. Install the dependencies.
    Frontend is a workspace. It contains multiple projects that works together. To make them see each other and import each other
    you need to install the dependencies of the workspace at the root of the frontend folder first.
3. Run the the server

```bash
git clone git@github.com:Ferlab-Ste-Justine/radiant-portal.git
cd radiant-portal/frontend
npm install
cd portals/radiant
npm run dev
```

### Running server with docker

```bash
make docker-build-radiant
make docker-run-radiant
```

### Generate the API client

## Generate the CLI

Go to the root of the repo in the backend folder and run the following command:
    
    ```bash 

    openapi-generator-cli generate -i ./backend/docs/swagger.yaml -g typescript-axios -o ./frontend/api

    ```
