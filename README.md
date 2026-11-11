# Radiant monorepo tour (local POC)

A hands-on tour of what the Radiant monorepo is meant to achieve. One chapter per branch, each adding one idea to the
previous one. Start it with Claude Code: open this folder and type `/tour`.

| Branch | Chapter |
|---|---|
| `poc/monorepo-01-moon-portal` | moon on the portal (backend + frontend): tasks, inputs, cache, affected, generated code checked, CI |
| `poc/monorepo-02-mcp-etl` | + the MCP and the ETL: Python projects, a boundary across three modules |
| `poc/monorepo-03-images-release` | + Docker images, tags and Flux, Trivy, one product release |
| `poc/monorepo-04-contracts` | + data contracts: check, breaking changes, deployment rules |

`git diff poc/monorepo-01-moon-portal poc/monorepo-02-mcp-etl` shows what a chapter adds. The chapters are in
`docs/tour/`.

The code is a copy of `origin/main` of radiant-portal (and later radiant-portal-pipeline and radiant-mcp). The
branches are pushed to radiant-portal only to be shared: they have no common history with `main`, are never merged,
and the GitHub workflows in `.github/` are never run (the tour runs what they run, `moon ci`). Never open a PR from
them.

Get the tour in its own folder (not in your radiant-portal clone: the demos commit and the frontend's husky hooks
would get in the way):

```bash
git clone git@github.com:radiant-network/radiant-portal.git radiant-moon-tour
cd radiant-moon-tour
git switch poc/monorepo-01-moon-portal
```

Setup:

```bash
npm ci --prefix .tools                    # moon
export PATH=$PWD/.tools/node_modules/.bin:$PATH
moon run frontend:install                 # frontend dependencies
```

Needs Go, Node (`.nvmrc`), Java (the OpenAPI generator) and `jq`.
